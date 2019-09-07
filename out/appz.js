"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vsc = require("vscode");
function activate(ctx) {
    ctx.subscriptions.push(vsc.commands.registerCommand('vsc_appz.main', () => {
        const progs = vsc.workspace.getConfiguration("appz")
            .get("cmds");
        if (!(progs && progs.length))
            vsc.window.showInformationMessage("No Appz configured in your currently active `settings.json`. Open File/Preferences to rectify.");
        else { }
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
