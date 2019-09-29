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
        fullCmd: _, label: "RUN: " + _,
        detail: ppio.procs[_] ? "Already running. Will kill and re-start." : "Not currently running" + (_.includes(' ') ? ' (at least not with those exact args)' : '') + "."
    }));
    for (const _ in ppio.procs)
        items.push({
            fullCmd: _, label: "KILL: " + _,
            detail: `Started ${getDurStr(_)} ago.`
        });
    if (!items.length)
        vsc.window.showInformationMessage("Your current `settings.json` has no Appz configured under `appz.allProgs`.");
    else
        vsc.window.showQuickPick(items).then(_ => {
            if (_ && _.fullCmd) {
                let alreadyrunning = ppio.procs[_.fullCmd];
                if (alreadyrunning)
                    alreadyrunning.dispose();
                else
                    strvar.Interpolate(_.fullCmd, extDirPathStrVarProvider).then(fullcmd => {
                        if (fullcmd && fullcmd.length) {
                            if (alreadyrunning = ppio.procs[fullcmd])
                                alreadyrunning.dispose();
                            if (ppio.proc(fullcmd))
                                appStartTimes[fullcmd] = Date.now();
                        }
                    }, _failed => { });
            }
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
