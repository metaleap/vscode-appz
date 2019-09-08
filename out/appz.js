"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ppio = require("./procspipeio");
const vsc = require("vscode");
const vscproj = vsc.workspace;
const vscwin = vsc.window;
function deactivate() {
    ppio.disposeAll();
}
exports.deactivate = deactivate;
function activate(ctx) {
    ctx.subscriptions.push(vsc.commands.registerCommand('vsc_appz.main', onCmdMain));
}
exports.activate = activate;
const appStartTimes = {};
function onCmdMain() {
    const progs = vscproj.getConfiguration("appz").get("progs");
    const items = progs.map(_ => ({
        prog: _, pid: 0, label: "START:\t" + _,
        detail: ppio.procs[_] ? "Already running. Will kill and re-start." : "Not yet running."
    }));
    for (const _ in ppio.procs) {
        let durstr = new Date(Date.now() - appStartTimes[_]).toISOString();
        if (!durstr.startsWith("1970-01-01T"))
            durstr = "well over a day";
        else
            durstr = durstr.slice(0, durstr.indexOf('.')).slice(1 + durstr.indexOf('T'));
        items.push({
            prog: _, label: "KILL:\t" + _, pid: ppio.procs[_].pid,
            detail: `Started ${durstr} ago.`
        });
    }
    if (!items.length)
        vscwin.showInformationMessage("Your current `settings.json` has no Appz configured under `appz.progs`.");
    else
        vscwin.showQuickPick(items).then(_ => {
            if (_ && _.prog)
                if (_.pid)
                    ppio.disposeProc(_.pid + '');
                else {
                    const alreadyrunning = ppio.procs[_.prog];
                    if (alreadyrunning)
                        ppio.disposeProc(alreadyrunning.pid + '');
                    if (ppio.proc(_.prog))
                        appStartTimes[_.prog] = Date.now();
                }
        });
}
