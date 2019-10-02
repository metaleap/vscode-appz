"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vsc = require("vscode");
const ppio = require("./procspipeio");
const strvar = require("./strvarinterp");
const uxStrAppzPref = "[Appz] ";
exports.uxStr = {
    appzPref: uxStrAppzPref,
    tooLate: uxStrAppzPref + "Too late, program already ended: ",
    badProcCmd: uxStrAppzPref + "Couldn't run this exact command, any typos? ─── ",
    menuPrefRun: "RUN: ",
    menuPrefKill: "KILL: ",
    menuDescRunningYes: "Already running. Will kill and re-start.",
    menuDescRunningNo: "Not currently running (at least not with those exact args).",
    menuDescStartedAgo: "Started _ ago.",
    menuDescStartedAgo_: "well over a day",
    menuMsgNoAppz: uxStrAppzPref + "Your current `settings.json` has no `appz.allProgs` array or it's empty.",
    exitCodeNonZero: uxStrAppzPref + "Exited with code _: ",
};
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
        fullCmd: _, label: exports.uxStr.menuPrefRun + _,
        detail: ppio.procs[_] ? exports.uxStr.menuDescRunningYes : exports.uxStr.menuDescRunningNo
    }));
    for (const _ in ppio.procs)
        items.push({
            fullCmd: _, label: exports.uxStr.menuPrefKill + _,
            detail: exports.uxStr.menuDescStartedAgo.replace('_', getDurStr(_))
        });
    if (!items.length)
        vsc.window.showInformationMessage(exports.uxStr.menuMsgNoAppz);
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
                            ppio.proc(fullcmd);
                        }
                    }, _failed => { });
            }
        });
}
function getDurStr(fullCmd) {
    const proc = ppio.procs[fullCmd];
    let durstr = new Date(Date.now() - proc.startTime).toISOString();
    if (!durstr.startsWith("1970-01-01T"))
        durstr = exports.uxStr.menuDescStartedAgo_;
    else
        durstr = durstr.slice(0, durstr.indexOf('.')).slice(1 + durstr.indexOf('T'));
    return durstr;
}
