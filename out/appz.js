"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vsc = require("vscode");
const ppio = require("./procspipeio");
const strvar = require("./strvarinterp");
const uxStrAppzPref = "[Appz] ";
exports.uxStr = {
    appzPref: uxStrAppzPref,
    tooLate: uxStrAppzPref + "Too late for that, program already ended. To launch it again: ",
    badProcCmd: uxStrAppzPref + "Could not run `_`, verify that there are no typos in the path or name and that it is executable.",
    menuPrefRun: "RUN: ",
    menuPrefEnd: "END: ",
    menuDescRunningYes: "Already running. Will end and re-start.",
    menuDescRunningNo: "Not currently running (at least not with those exact args).",
    menuDescStartedAgo: "Started _ ago.",
    menuDescStartedAgo_: "well over a day",
    menuPrompt: "Found _ in `appz.allProgs` array of your current `settings.json`:",
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
        detail: ppio.progs[_] ? exports.uxStr.menuDescRunningYes : exports.uxStr.menuDescRunningNo
    }));
    const prognum = items.length;
    for (const _ in ppio.progs)
        items.push({
            fullCmd: _, label: exports.uxStr.menuPrefEnd + _, shouldEnd: true,
            detail: exports.uxStr.menuDescStartedAgo.replace('_', getDurStr(_))
        });
    if (!items.length)
        vsc.window.showInformationMessage(exports.uxStr.menuMsgNoAppz);
    else
        vsc.window.showQuickPick(items, {
            placeHolder: exports.uxStr.menuPrompt.replace('_', prognum.toString()),
            canPickMany: false, matchOnDescription: true, matchOnDetail: true,
        }).then(_ => {
            if (_ && _.fullCmd) {
                let alreadyrunning = ppio.progs[_.fullCmd];
                let shouldstart = !_.shouldEnd;
                if (alreadyrunning)
                    alreadyrunning.dispose();
                if (shouldstart)
                    strvar.Interpolate(_.fullCmd, extDirPathStrVarProvider).then(fullcmd => {
                        if (fullcmd && fullcmd.length) {
                            if (alreadyrunning = ppio.progs[fullcmd])
                                alreadyrunning.dispose();
                            ppio.ensureProg(fullcmd);
                        }
                    }, onPromiseRejectedNoOp);
            }
        }, onPromiseRejectedNoOp);
}
function getDurStr(fullCmd) {
    const proc = ppio.progs[fullCmd];
    let durstr = new Date(Date.now() - proc.startTime).toISOString();
    if (!durstr.startsWith("1970-01-01T")) // YYYY-MM-DDTHH:mm:ss.sssZ
        durstr = exports.uxStr.menuDescStartedAgo_;
    else
        durstr = durstr.slice(0, durstr.indexOf('.')).slice(1 + durstr.indexOf('T'));
    return durstr;
}
function onPromiseRejectedNoOp(_failed) { }
exports.onPromiseRejectedNoOp = onPromiseRejectedNoOp;
