"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscgen = require("./vscode.gen");
const node_proc = require("child_process");
const node_pipeio = require("readline");
const vsc = require("vscode");
const vscwin = vsc.window;
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
function send(proc, jsonMsgOut) {
    const onsendmaybefailed = (_problem) => {
    };
    try {
        if (!proc.stdin.write(jsonMsgOut + '\n'))
            proc.stdin.once('drain', onsendmaybefailed);
        else
            process.nextTick(onsendmaybefailed);
    }
    catch (e) {
        onsendmaybefailed(e);
    }
}
exports.send = send;
function onProcRecv(proc) {
    return (ln) => {
        const msg = JSON.parse(ln);
        if (!msg)
            vscwin.showErrorMessage(ln);
        else if (msg.ns && msg.name) {
            vscgen.handle(msg);
        }
        else if (msg.andThen) {
        }
    };
}
