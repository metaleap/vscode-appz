"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscgen = require("./vscode.gen");
const node_proc = require("child_process");
const node_pipeio = require("readline");
const vsc = require("vscode");
const vscwin = vsc.window;
const dbgLogJsonMsgs = true;
exports.procs = {};
let pipes = {};
function disposeAll() {
    let proc, pipe;
    const allprocs = exports.procs, allpipes = pipes;
    exports.procs = {};
    pipes = {};
    for (const pid in allpipes)
        if (pipe = allpipes[pid]) {
            try {
                pipe.removeAllListeners();
            }
            catch (_) { }
            try {
                pipe.close();
            }
            catch (_) { }
        }
    for (const key in allprocs)
        if (proc = allprocs[key]) {
            try {
                proc.removeAllListeners();
            }
            catch (_) { }
            try {
                proc.kill();
            }
            catch (_) { }
        }
}
exports.disposeAll = disposeAll;
function disposeProc(pId) {
    const pipe = pipes[pId];
    if (pipe) {
        delete pipes[pId];
        try {
            pipe.removeAllListeners();
        }
        catch (_) { }
        try {
            pipe.close();
        }
        catch (_) { }
    }
    let proc;
    for (const key in exports.procs)
        if ((proc = exports.procs[key]) && proc.pid.toString() === pId.toString()) {
            delete exports.procs[key];
            try {
                proc.removeAllListeners();
            }
            catch (_) { }
            try {
                proc.kill();
            }
            catch (_) { }
            break;
        }
}
exports.disposeProc = disposeProc;
function onProgEnd(pId) {
    return (_code, _sig) => disposeProc(pId);
}
function onProcErr(pId) {
    return (err) => {
        console.log(err);
        disposeProc(pId);
    };
}
function proc(fullCmd) {
    let p = exports.procs[fullCmd];
    if (!p) {
        const [cmd, args] = cmdAndArgs(fullCmd);
        try {
            p = node_proc.spawn(cmd, args, { stdio: 'pipe', windowsHide: true, argv0: cmd });
        }
        catch (e) {
            vscwin.showErrorMessage(e);
        }
        if (p)
            if (!(p.pid && p.stdin && p.stdin.writable && p.stdout && p.stdout.readable && p.stderr && p.stderr.readable))
                try {
                    p.kill();
                }
                catch (_) { }
                finally {
                    p = null;
                }
            else {
                p.stderr.on('data', foo => vscwin.showWarningMessage(foo));
                p.stdout.on('data', moo => vscwin.showInformationMessage(moo));
                const pipe = node_pipeio.createInterface({
                    input: p.stdout, terminal: false, historySize: 0
                });
                if (!pipe)
                    try {
                        p.kill();
                    }
                    catch (_) { }
                    finally {
                        p = null;
                    }
                else {
                    pipe.setMaxListeners(0);
                    pipe.on('line', onProcRecv(p));
                    pipes[p.pid] = pipe;
                    p.on('error', onProcErr(p.pid));
                    const ongone = onProgEnd(p.pid);
                    p.on('disconnect', ongone);
                    p.on('close', ongone);
                    p.on('exit', ongone);
                    p.stderr.on('data', vscwin.showWarningMessage);
                }
            }
        if (p)
            exports.procs[fullCmd] = p;
        else {
            delete exports.procs[fullCmd];
            vscwin.showErrorMessage('Unable to execute this exact command, any typos? ─── ' + fullCmd);
        }
    }
    return p;
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
function send(proc, msgOut) {
    const onmaybefailed = (err) => {
        if (err && proc.pid && pipes[proc.pid])
            vscwin.showErrorMessage(err + '');
    };
    try {
        const jsonmsgout = JSON.stringify(msgOut) + '\n';
        if (dbgLogJsonMsgs)
            console.log("OUT:\n" + jsonmsgout);
        const bufs = bufsUntilPipeDrained[proc.pid];
        if (bufs)
            bufs.push(jsonmsgout);
        else if (pipes[proc.pid] && !proc.stdin.write(jsonmsgout, onmaybefailed)) {
            bufsUntilPipeDrained[proc.pid] = [];
            proc.stdin.once('drain', onProcPipeDrain(proc, onmaybefailed));
        }
    }
    catch (e) {
        onmaybefailed(e);
    }
}
exports.send = send;
const callBacks = {};
function callBack(proc, fnId, ...args) {
    const prom = new Promise((resolve, reject) => {
        callBacks[fnId] = { resolve: resolve, reject: reject };
    });
    send(proc, { andThen: fnId, payload: args });
    return prom;
}
exports.callBack = callBack;
const bufsUntilPipeDrained = {};
function onProcPipeDrain(proc, onMaybeFailed) {
    let ondrain;
    ondrain = () => {
        const bufs = bufsUntilPipeDrained[proc.pid];
        delete bufsUntilPipeDrained[proc.pid];
        if (bufs && bufs.length)
            for (let i = 0; i < bufs.length && pipes[proc.pid]; i++)
                if (!proc.stdin.write(bufs[i], onMaybeFailed)) {
                    bufsUntilPipeDrained[proc.pid] =
                        (i === (bufs.length - 1)) ? [] : bufs.slice(i + 1);
                    proc.stdin.once('drain', ondrain);
                    break;
                }
    };
    return ondrain;
}
function onProcRecv(proc) {
    return (ln) => {
        if (dbgLogJsonMsgs)
            console.log("IN:\n" + ln);
        let msg;
        try {
            msg = JSON.parse(ln);
        }
        catch (_) { }
        const onfail = (err) => {
            vscwin.showWarningMessage(err);
            if (msg && msg.andThen)
                send(proc, { andThen: msg.andThen, failed: true });
        };
        if (!msg)
            vscwin.showErrorMessage(ln);
        else if (msg.ns && msg.name) {
            try {
                const promise = vscgen.handle(msg, proc);
                if (promise)
                    promise.then(ret => {
                        if (pipes[proc.pid] && msg.andThen)
                            send(proc, { andThen: msg.andThen, payload: ret });
                    }, err => onfail(err));
            }
            catch (err) {
                onfail(err);
            }
        }
        else if (msg.andThen && msg.payload) {
            const [prom, ret, ok] = [callBacks[msg.andThen], msg.payload['ret'], msg.payload['ok']];
            delete callBacks[msg.andThen];
            if (prom)
                if (ok)
                    prom.resolve(ret);
                else
                    prom.reject();
        }
        else
            vscwin.showErrorMessage(ln);
    };
}
