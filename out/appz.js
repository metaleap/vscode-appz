"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vsc = require("vscode");
const ppio = require("./procspipeio");
const strvar = require("./strvarinterp");
let extDirPathStrVarProvider = {
    'appz': _ => exports.vscCtx.extensionPath,
};
function deactivate() { ppio.disposeAll(); }
exports.deactivate = deactivate;
function activate(ctx) {
    (exports.vscCtx = ctx).subscriptions.push(vsc.commands.registerCommand('vsc_appz.main', onCmdMain));
}
exports.activate = activate;
function onCmdMain() {
    const progs = vsc.workspace.getConfiguration("appz").get("allProgs") || [];
    const items = progs.map(_ => ({
        prog: _, pid: 0, label: "RUN: " + _,
        detail: ppio.procs[_] ? "Already running. Will kill and re-start." : "Not currently running" + (_.includes(' ') ? ' (at least not with those exact args)' : '') + "."
    }));
    for (const _ in ppio.procs)
        items.push({
            prog: _, label: "KILL: " + _, pid: ppio.procs[_].pid,
            detail: `Started ${getDurStr(_)} ago.`
        });
    if (!items.length)
        vsc.window.showInformationMessage("Your current `settings.json` has no Appz configured under `appz.allProgs`.");
    else
        vsc.window.showQuickPick(items).then(_ => {
            if (_ && _.prog)
                if (_.pid)
                    ppio.disposeProc(_.pid);
                else
                    strvar.Interpolate(_.prog, extDirPathStrVarProvider).then(prog => {
                        if (prog && prog.length) {
                            const alreadyrunning = ppio.procs[prog];
                            if (alreadyrunning)
                                ppio.disposeProc(alreadyrunning.pid);
                            if (ppio.proc(prog))
                                appStartTimes[prog] = Date.now();
                        }
                    }, _failed => { });
        });
}
const appStartTimes = {};
function getDurStr(prog) {
    let durstr = new Date(Date.now() - appStartTimes[prog]).toISOString();
    if (!durstr.startsWith("1970-01-01T"))
        durstr = "well over a day";
    else
        durstr = durstr.slice(0, durstr.indexOf('.')).slice(1 + durstr.indexOf('T'));
    return durstr;
}
