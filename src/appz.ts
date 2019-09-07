import * as vsc from 'vscode'

export function activate(ctx: vsc.ExtensionContext) {
	ctx.subscriptions.push(vsc.commands.registerCommand('vsc_appz.main', () => {
		const progs = vsc.workspace.getConfiguration("appz")
			.get<(string | {})[]>("cmds")
		if (!(progs && progs.length))
			vsc.window.showInformationMessage("No Appz configured in your currently active `settings.json`. Open File/Preferences to rectify.")
		else { }
	}))
}

export function deactivate() { }
