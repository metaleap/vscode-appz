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
function onCmdMain() {
    const progs = vscproj.getConfiguration("appz").get("progs");
    const items = progs.map(_ => ({ prog: _, pid: 0, label: "START: " + _ }));
    for (const _ in ppio.procs)
        items.push({ prog: _, label: "KILL: " + _, pid: ppio.procs[_].pid });
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
                    ppio.proc(_.prog);
                }
        });
}
