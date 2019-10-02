import * as vsc from 'vscode'

import * as ppio from './procspipeio'
import * as strvar from './strvarinterp'



export let vscCtx: vsc.ExtensionContext
const uxStrAppzPref = "[Appz] "
export let uxStr = {
	appzPref: uxStrAppzPref,
	tooLate: uxStrAppzPref + "Too late, program already ended: ",
	badProcCmd: uxStrAppzPref + "Couldn't run this exact command, any typos? ─── ",
	menuPrefRun: "RUN: ",
	menuPrefKill: "KILL: ",
	menuDescRunningYes: "Already running. Will kill and re-start.",
	menuDescRunningNo: "Not currently running (at least not with those exact args).",
	menuDescStartedAgo: "Started _ ago.",
	menuDescStartedAgo_: "well over a day",
	menuMsgNoAppz: uxStrAppzPref + "Your current `settings.json` has no `appz.allProgs` array or it's empty.",
	exitCodeNonZero: uxStrAppzPref + "Exited with code _: ",
}

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
		fullCmd: _, label: uxStr.menuPrefRun + _,
		detail: ppio.procs[_] ? uxStr.menuDescRunningYes : uxStr.menuDescRunningNo
	}))
	for (const _ in ppio.procs)
		items.push({
			fullCmd: _, label: uxStr.menuPrefKill + _,
			detail: uxStr.menuDescStartedAgo.replace('_', getDurStr(_))
		})

	if (!items.length)
		vsc.window.showInformationMessage(uxStr.menuMsgNoAppz)
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
								ppio.proc(fullcmd)
							}
						},
						_failed => { /* ignore, but keep handler to prevent warn-logs */ }
					)
			}
		})
}

function getDurStr(fullCmd: string): string {
	const proc = ppio.procs[fullCmd]
	let durstr = new Date(Date.now() - proc.startTime).toISOString()
	if (!durstr.startsWith("1970-01-01T")) // YYYY-MM-DDTHH:mm:ss.sssZ
		durstr = uxStr.menuDescStartedAgo_
	else
		durstr = durstr.slice(0, durstr.indexOf('.')).slice(1 + durstr.indexOf('T'))
	return durstr
}
