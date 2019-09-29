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
	interface pickItem extends vsc.QuickPickItem { fullCmd: string }

	const progs = vsc.workspace.getConfiguration("appz").get<string[]>("allProgs") || []
	const items: pickItem[] = progs.map(_ => ({
		fullCmd: _, label: "RUN: " + _,
		detail: ppio.procs[_] ? "Already running. Will kill and re-start." : "Not currently running" + (_.includes(' ') ? ' (at least not with those exact args)' : '') + "."
	}))
	for (const _ in ppio.procs)
		items.push({
			fullCmd: _, label: "KILL: " + _,
			detail: `Started ${getDurStr(_)} ago.`
		})

	if (!items.length)
		vsc.window.showInformationMessage("Your current `settings.json` has no Appz configured under `appz.allProgs`.")
	else
		vsc.window.showQuickPick(items).then(_ => {
			if (_ && _.fullCmd) {
				let alreadyrunning = ppio.procs[_.fullCmd]
				if (alreadyrunning)
					alreadyrunning.dispose()
				else
					strvar.Interpolate(_.fullCmd, extDirPathStrVarProvider).then(
						fullcmd => {
							if (fullcmd && fullcmd.length) {
								if (alreadyrunning = ppio.procs[fullcmd])
									alreadyrunning.dispose()
								if (ppio.proc(fullcmd))
									appStartTimes[fullcmd] = Date.now()
							}
						},
						_failed => { /* ignore, but keep handler to prevent warn-logs */ }
					)
			}
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
