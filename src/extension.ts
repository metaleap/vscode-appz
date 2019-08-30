import * as vscode from 'vscode';

export function activate(ctx: vscode.ExtensionContext) {
	ctx.subscriptions.push(vscode.commands.registerCommand('vsc_appz.main', () => {
		vscode.window.showInformationMessage("Hi there")
	}))
}

// this method is called when your extension is deactivated
export function deactivate() { }
