"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_proc = require("child_process");
const node_pipeio = require("readline");
const vsc = require("vscode");
const appz_1 = require("./appz");
const vscgen = require("./vscode.gen");
const dbgLogJsonMsgs = true;
exports.procs = {};
class Proc {
    constructor(fullCmd, proc, stdoutPipe) {
        this.stderrChan = undefined;
        this.stdinBufsUntilPipeDrained = null;
        this.cancellers = {};
        this.callBacks = {};
        [this.fullCmd, this.proc, this.stdoutPipe] = [fullCmd, proc, stdoutPipe];
        this.stdoutPipe.on('line', this.onRecv());
        this.proc.on('error', this.onProcErr());
        const ongone = this.onProcEnd();
        this.proc.on('disconnect', ongone);
        this.proc.on('close', ongone);
        this.proc.on('exit', ongone);
        if (this.proc.stderr)
            this.proc.stderr.on('data', data => this.log(data));
    }
    dispose() {
        if (this.proc) {
            delete exports.procs[this.fullCmd];
            for (const _ in this.cancellers)
                this.cancellers[_].dispose();
            if (this.stderrChan) {
                if (cfgAutoCloseStderrOutputsOnProgExit())
                    this.stderrChan.dispose();
                else
                    appz_1.vscCtx.subscriptions.push(this.stderrChan);
                this.stderrChan = null;
            }
            for (const pipe of [this.proc.stderr, this.proc.stdout, this.proc.stdin])
                if (pipe)
                    try {
                        pipe.removeAllListeners();
                    }
                    catch (_) { }
            if (this.stdoutPipe)
                try {
                    this.stdoutPipe.removeAllListeners().close();
                }
                catch (_) { }
            try {
                this.proc.removeAllListeners();
            }
            catch (_) { }
            try {
                this.proc.kill();
            }
            catch (_) { }
            this.proc = null;
        }
    }
    log(ln) {
        if (this.stderrChan === undefined)
            this.stderrChan = vsc.window.createOutputChannel("Appz: " + this.fullCmd);
        if (this.stderrChan)
            this.stderrChan.appendLine(ln);
    }
    callBack(fId, ...args) {
        const prom = new Promise((resolve, reject) => {
            this.callBacks[fId] = { resolve: resolve, reject: reject };
        });
        this.send({ cbId: fId, data: { "": args } });
        return prom;
    }
    canceller(fId) {
        if (fId && (typeof fId === 'string') && fId.length) {
            const cts = new vsc.CancellationTokenSource();
            this.cancellers[fId] = cts;
            return cts.token;
        }
        return undefined;
    }
    onProcEnd() {
        return (_code, _sig) => this.dispose();
    }
    onProcErr() {
        return (err) => {
            console.log(err);
            this.dispose();
        };
    }
    onProcPipeDrain(onMaybeFailed) {
        let ondrain;
        ondrain = () => {
            const bufs = this.stdinBufsUntilPipeDrained;
            this.stdinBufsUntilPipeDrained = null;
            if (bufs && bufs.length)
                for (let i = 0; i < bufs.length; i++)
                    if (!this.proc.stdin.write(bufs[i], onMaybeFailed)) {
                        this.stdinBufsUntilPipeDrained =
                            (i === (bufs.length - 1)) ? [] : bufs.slice(i + 1);
                        this.proc.stdin.once('drain', ondrain);
                        break;
                    }
        };
        return ondrain;
    }
    onRecv() {
        return (ln) => {
            if (dbgLogJsonMsgs)
                console.log("IN:\n" + ln);
            let msg;
            try {
                msg = JSON.parse(ln);
            }
            catch (_) { }
            if (!msg)
                vsc.window.showWarningMessage(ln);
            else if (msg.qName) {
                let sendret = false;
                const onfail = (err) => {
                    vsc.window.showErrorMessage(err);
                    if (msg && msg.cbId && !sendret)
                        this.send({ cbId: msg.cbId, data: { nay: ensureWillShowUpInJson(err) } });
                };
                try {
                    const [promise, cancels] = vscgen.handle(msg, this);
                    let cleanup = () => { };
                    if (cancels && cancels.length)
                        cleanup = () => {
                            cancels.forEach(_ => {
                                const cancel = this.cancellers[_];
                                if (cancel)
                                    cancel.dispose();
                                delete this.cancellers[_];
                            });
                        };
                    if (promise)
                        promise.then(ret => {
                            cleanup();
                            if (sendret = (this.proc && msg.cbId) ? true : false)
                                this.send({ cbId: msg.cbId, data: { yay: ensureWillShowUpInJson(ret) } });
                        }, rej => {
                            cleanup();
                            onfail(rej);
                        });
                }
                catch (err) {
                    onfail(err);
                }
            }
            else if (msg.cbId && msg.data) {
                const [prom, yay, nay] = [this.callBacks[msg.cbId], msg.data['yay'], msg.data['nay']];
                delete this.callBacks[msg.cbId];
                if (prom)
                    if (nay)
                        prom.reject(nay);
                    else
                        prom.resolve(yay);
            }
            else
                vsc.window.showErrorMessage(ln);
        };
    }
    send(msgOut) {
        const onmaybefailed = (err) => {
            if (err && this.proc)
                vsc.window.showErrorMessage(err + '');
        };
        try {
            const jsonmsgout = JSON.stringify(msgOut) + '\n';
            if (dbgLogJsonMsgs)
                console.log("OUT:\n" + jsonmsgout);
            if (this.stdinBufsUntilPipeDrained !== null)
                this.stdinBufsUntilPipeDrained.push(jsonmsgout);
            else if (this.proc && !this.proc.stdin.write(jsonmsgout, onmaybefailed)) {
                this.stdinBufsUntilPipeDrained = [];
                this.proc.stdin.once('drain', this.onProcPipeDrain(onmaybefailed));
            }
        }
        catch (e) {
            onmaybefailed(e);
        }
    }
}
exports.Proc = Proc;
function disposeAll() {
    const allprocs = exports.procs;
    exports.procs = {};
    for (const _ in allprocs)
        exports.procs[_].dispose();
}
exports.disposeAll = disposeAll;
function proc(fullCmd) {
    let me = exports.procs[fullCmd];
    if (!me) {
        const [cmd, args] = cmdAndArgs(fullCmd);
        let p, pipe;
        try {
            p = node_proc.spawn(cmd, args, { stdio: 'pipe', windowsHide: true, argv0: cmd });
        }
        catch (e) {
            vsc.window.showErrorMessage(e);
        }
        if (p)
            if (p.pid && p.stdin && p.stdin.writable && p.stdout && p.stdout.readable && (pipe = node_pipeio.createInterface({ input: p.stdout, terminal: false, historySize: 0 })))
                me = new Proc(fullCmd, p, pipe);
            else
                try {
                    p.removeAllListeners().kill();
                }
                catch (_) { }
        if (me)
            exports.procs[fullCmd] = me;
        else
            vsc.window.showErrorMessage('Unable to execute this exact command, any typos? ─── ' + fullCmd);
    }
    return me;
}
exports.proc = proc;
function cmdAndArgs(fullCmd) {
    let cmd = (fullCmd + '').trim(), args = [];
    const idx = cmd.indexOf(' ');
    if (idx > 0) {
        let instr = 0;
        for (let i = idx; i < cmd.length; i++)
            if (cmd[i] === '"') {
                if (instr === 0)
                    instr = i;
                else if (cmd[i - 1] !== '\\') {
                    args.push(cmd.slice(instr + 1, i));
                    instr = 0;
                }
            }
            else if (instr === 0 && i < (cmd.length - 1) && cmd[i] === ' ' && cmd[i + 1] !== '"') {
                const pos = cmd.indexOf(' ', i + 1);
                if (pos < 0) {
                    args.push(cmd.slice(i + 1));
                    break;
                }
                else if (pos > (i + 1)) {
                    args.push(cmd.slice(i + 1, pos));
                    i = pos - 1;
                }
            }
        if (instr > 0)
            args.push(cmd.slice(instr));
        cmd = cmd.slice(0, idx);
    }
    return [cmd, args];
}
function cfgAutoCloseStderrOutputsOnProgExit() {
    return vsc.workspace.getConfiguration("appz").get("autoCloseStderrOutputsOnProgExit", true);
}
function ensureWillShowUpInJson(_) {
    return (_ === undefined) ? null : _;
}
