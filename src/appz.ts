import * as vsc from 'vscode'

import * as ppio from './procspipeio'
import * as strvar from './strvarinterp'



export let vscCtx: vsc.ExtensionContext
const uxStrAppzPref = "[Appz] "
export let uxStr = {
	appzPref: uxStrAppzPref,
	tooLate: uxStrAppzPref + "Too late for that, program already ended. To launch it again: ",
	badProcCmd: uxStrAppzPref + "Couldn't run this exact command, any typos? ─── ",
	menuPrefRun: "RUN: ",
	menuPrefEnd: "END: ",
	menuDescRunningYes: "Already running. Will end and re-start.",
	menuDescRunningNo: "Not currently running (at least not with those exact args).",
	menuDescStartedAgo: "Started _ ago.",
	menuDescStartedAgo_: "well over a day",
	menuPrompt: "Found _ in `appz.allProgs` array of your current `settings.json`:",
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
		detail: ppio.progs[_] ? uxStr.menuDescRunningYes : uxStr.menuDescRunningNo
	}))
	const prognum = items.length
	for (const _ in ppio.progs)
		items.push({
			fullCmd: _, label: uxStr.menuPrefEnd + _,
			detail: uxStr.menuDescStartedAgo.replace('_', getDurStr(_))
		})
	if (!items.length)
		vsc.window.showInformationMessage(uxStr.menuMsgNoAppz)
	else
		vsc.window.showQuickPick(items, {
			placeHolder: uxStr.menuPrompt.replace('_', prognum.toString()),
			canPickMany: false, ignoreFocusOut: true, matchOnDescription: true, matchOnDetail: true,
		}).then(_ => {
			if (_ && _.fullCmd) {
				let alreadyrunning = ppio.progs[_.fullCmd]
				if (alreadyrunning)
					alreadyrunning.dispose()
				else
					strvar.Interpolate(_.fullCmd, extDirPathStrVarProvider).then(fullcmd => {
						if (fullcmd && fullcmd.length) {
							if (alreadyrunning = ppio.progs[fullcmd])
								alreadyrunning.dispose()
							ppio.ensureProg(fullcmd)
						}
					}, onPromiseRejectedNoOp)
			}
		}, onPromiseRejectedNoOp)
}

function getDurStr(fullCmd: string): string {
	const proc = ppio.progs[fullCmd]
	let durstr = new Date(Date.now() - proc.startTime).toISOString()
	if (!durstr.startsWith("1970-01-01T")) // YYYY-MM-DDTHH:mm:ss.sssZ
		durstr = uxStr.menuDescStartedAgo_
	else
		durstr = durstr.slice(0, durstr.indexOf('.')).slice(1 + durstr.indexOf('T'))
	return durstr
}

export function onPromiseRejectedNoOp(_failed: any) { }
