import * as vsc from 'vscode'

import * as ppio from './procspipeio'
import * as strvar from './strvarinterp'



export let vscCtx: vsc.ExtensionContext
let extDirPathStrVarProvider: { [_: string]: ((_: string) => string) } = {
	'appz': _ => vscCtx.extensionPath,
}


export function deactivate() { ppio.disposeAll() }


export function activate(ctx: vsc.ExtensionContext) {
	(vscCtx = ctx).subscriptions.push(
		vsc.commands.registerCommand('vsc_appz.main', onCmdMain),
	)
}

function onCmdMain() {
	interface pickItem extends vsc.QuickPickItem { prog: string, pid: number }

	const progs = vsc.workspace.getConfiguration("appz").get<string[]>("allProgs") || []
	const items: pickItem[] = progs.map(_ => ({
		prog: _, pid: 0, label: "RUN: " + _,
		detail: ppio.OLDPROCS[_] ? "Already running. Will kill and re-start." : "Not currently running" + (_.includes(' ') ? ' (at least not with those exact args)' : '') + "."
	}))
	for (const _ in ppio.OLDPROCS)
		items.push({
			prog: _, label: "KILL: " + _, pid: ppio.OLDPROCS[_].pid,
			detail: `Started ${getDurStr(_)} ago.`
		})

	if (!items.length)
		vsc.window.showInformationMessage("Your current `settings.json` has no Appz configured under `appz.allProgs`.")
	else
		vsc.window.showQuickPick(items).then(_ => {
			if (_ && _.prog)
				if (_.pid)
					ppio.disposeProc(_.pid)
				else
					strvar.Interpolate(_.prog, extDirPathStrVarProvider).then(
						prog => {
							if (prog && prog.length) {
								const alreadyrunning = ppio.OLDPROCS[prog]
								if (alreadyrunning)
									ppio.disposeProc(alreadyrunning.pid)
								if (ppio.OLDPROC(prog))
									appStartTimes[prog] = Date.now()
							}
						},
						_failed => { /* ignore, but keep handler to prevent warn-logs */ }
					)
		})
}

const appStartTimes: { [_: string]: number } = {}

function getDurStr(prog: string): string {
	let durstr = new Date(Date.now() - appStartTimes[prog]).toISOString()
	if (!durstr.startsWith("1970-01-01T")) // YYYY-MM-DDTHH:mm:ss.sssZ
		durstr = "well over a day"
	else
		durstr = durstr.slice(0, durstr.indexOf('.')).slice(1 + durstr.indexOf('T'))
	return durstr
}
