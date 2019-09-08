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
        if ((proc = exports.procs[key]) && proc.pid.toString() === pId) {
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
    return (_code, _sig) => disposeProc(pId + '');
}
function onProcErr(pId) {
    return (_err) => disposeProc(pId + '');
}
function proc(fullCmd) {
    let p = exports.procs[fullCmd];
    if (!p) {
        try {
            p = node_proc.spawn(fullCmd);
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
                    pipes[p.pid.toString()] = pipe;
                    p.on('error', onProcErr(p.pid));
                    const ongone = onProgEnd(p.pid);
                    p.on('disconnect', ongone);
                    p.on('close', ongone);
                    p.on('exit', ongone);
                    p.stderr.on('data', vscwin.showWarningMessage);
                }
            }
        if (!p)
            delete exports.procs[fullCmd];
        else
            exports.procs[fullCmd] = p;
    }
    return p;
}
exports.proc = proc;
function send(proc, msgOut) {
    const onmaybefailed = (err) => {
        if (err)
            vscwin.showErrorMessage(err + '');
    };
    try {
        const jsonmsgout = JSON.stringify(msgOut) + '\n';
        if (dbgLogJsonMsgs)
            console.log("OUT:\n" + jsonmsgout);
        const bufs = bufsUntilPipeDrained[proc.pid];
        if (bufs)
            bufs.push(jsonmsgout);
        else if (!proc.stdin.write(jsonmsgout, onmaybefailed)) {
            bufsUntilPipeDrained[proc.pid] = [];
            proc.stdin.once('drain', onProcPipeDrain(proc, onmaybefailed));
        }
    }
    catch (e) {
        onmaybefailed(e);
    }
}
exports.send = send;
const bufsUntilPipeDrained = {};
function onProcPipeDrain(proc, onMaybeFailed) {
    let ondrain;
    ondrain = () => {
        const bufs = bufsUntilPipeDrained[proc.pid];
        delete bufsUntilPipeDrained[proc.pid];
        if (bufs && bufs.length)
            for (let i = 0; i < bufs.length; i++)
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
                const promise = vscgen.handle(msg);
                if (promise)
                    promise.then(ret => {
                        if (msg.andThen)
                            send(proc, { andThen: msg.andThen, payload: ret });
                    }, err => onfail(err));
            }
            catch (err) {
                onfail(err);
            }
        }
        else if (msg.andThen) {
            vscwin.showInformationMessage(ln);
        }
        else
            vscwin.showErrorMessage(ln);
    };
}
