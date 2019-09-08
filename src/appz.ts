import * as ppio from './procspipeio'

import * as vsc from 'vscode'
const vscproj = vsc.workspace
const vscwin = vsc.window



export function deactivate() {
	ppio.disposeAll()
}

export function activate(ctx: vsc.ExtensionContext) {
	ctx.subscriptions.push(
		vsc.commands.registerCommand('vsc_appz.main', onCmdMain)
	)
}


function onCmdMain() {
	const progs = vscproj.getConfiguration("appz").get<string[]>("progs")

	interface pickItem extends vsc.QuickPickItem { prog: string, pid: number }
	const items: pickItem[] = progs.map(_ => ({ prog: _, pid: 0, label: "START: " + _ }))
	for (const _ in ppio.procs)
		items.push({ prog: _, label: "KILL: " + _, pid: ppio.procs[_].pid })

	if (!items.length)
		vscwin.showInformationMessage("Your current `settings.json` has no Appz configured under `appz.progs`.")
	else
		vscwin.showQuickPick(items).then(_ => {
			if (_ && _.prog)
				if (_.pid)
					ppio.disposeProc(_.pid + '')
				else {
					const alreadyrunning = ppio.procs[_.prog]
					if (alreadyrunning)
						ppio.disposeProc(alreadyrunning.pid + '')
					ppio.proc(_.prog)
				}
		})
}
