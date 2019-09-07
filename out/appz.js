"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_proc = require("child_process");
const node_pipeio = require("readline");
const vsc = require("vscode");
const vscproj = vsc.workspace;
const vscwin = vsc.window;
let procs = {}, pipes = {};
function deactivate() {
    let proc, pipe;
    const allprocs = procs, allpipes = pipes;
    procs = {};
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
exports.deactivate = deactivate;
function activate(ctx) {
    ctx.subscriptions.push(vsc.commands.registerCommand('vsc_appz.main', onCmdMain));
}
exports.activate = activate;
function onCmdMain() {
    const progs = vscproj.getConfiguration("appz").get("progs");
    const items = progs.map(_ => ({ prog: _, pid: 0, label: "START: " + _ }));
    for (const _ in procs)
        items.push({ prog: _, label: "KILL: " + _, pid: procs[_].pid });
    if (!items.length)
        vscwin.showInformationMessage("Your current `settings.json` has no Appz configured under `appz.progs`.");
    else
        vscwin.showQuickPick(items).then(_ => {
            if (_ && _.prog)
                if (_.pid)
                    disposeProc(_.pid + '');
                else {
                    const alreadyrunning = procs[_.prog];
                    if (alreadyrunning)
                        disposeProc(alreadyrunning.pid + '');
                    proc(_.prog);
                }
        });
}
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
    for (const key in procs)
        if ((proc = procs[key]) && proc.pid.toString() === pId) {
            delete procs[key];
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
function onProgEnd(pId) {
    return (_code, _sig) => disposeProc(pId + '');
}
function onProcErr(pId) {
    return (_err) => disposeProc(pId + '');
}
function proc(fullCmd) {
    let p = procs[fullCmd];
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
                    pipe.on('line', vscwin.showInformationMessage);
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
            delete procs[fullCmd];
        else
            procs[fullCmd] = p;
    }
    return p;
}
exports.proc = proc;
