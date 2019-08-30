"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(ctx) {
    ctx.subscriptions.push(vscode.commands.registerCommand('vsc_appz.main', () => {
        vscode.window.showInformationMessage("Hi there");
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
