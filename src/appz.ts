import * as vsc from 'vscode'

import * as ppio from './procspipeio'
import * as strvar from './strvarinterp'



export let vscCtx: vsc.ExtensionContext
const uxStrAppzPref = "[Appz] "
export let uxStr = {
	appzPref: uxStrAppzPref,
	tooLate: uxStrAppzPref + "Too late for that, program already ended. To launch it again: ",
	badProcCmd: uxStrAppzPref + "Could not run `_`, verify that there are no typos in the path or name and that it is executable.",
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
	'': _ => vscCtx.extensionPath,
}



export function deactivate() { ppio.disposeAll() }


export function activate(ctx: vsc.ExtensionContext) {
	(vscCtx = ctx).subscriptions.push(
		vsc.commands.registerCommand('vsc_appz.main', onCmdMain),
	)
}

function onCmdMain() {
	interface pickItem extends vsc.QuickPickItem { fullCmd: string, shouldEnd?: boolean }

	const progs = vsc.workspace.getConfiguration("appz").get<string[]>("allProgs") || []
	const items: pickItem[] = progs.map(_ => ({
		fullCmd: _, label: uxStr.menuPrefRun + _,
		detail: ppio.progs[_] ? uxStr.menuDescRunningYes : uxStr.menuDescRunningNo
	}))
	const prognum = items.length
	for (const _ in ppio.progs)
		items.push({
			fullCmd: _, label: uxStr.menuPrefEnd + _, shouldEnd: true,
			detail: uxStr.menuDescStartedAgo.replace('_', getDurStr(_))
		})

	if (!items.length)
		vsc.window.showInformationMessage(uxStr.menuMsgNoAppz)
	else
		vsc.window.showQuickPick(items, {
			placeHolder: uxStr.menuPrompt.replace('_', prognum.toString()),
			canPickMany: false, matchOnDescription: true, matchOnDetail: true,
		}).then(_ => {
			if (_ && _.fullCmd) {
				let alreadyrunning = ppio.progs[_.fullCmd]
				let shouldstart = !_.shouldEnd
				if (alreadyrunning)
					alreadyrunning.dispose()
				if (shouldstart)
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

export function _unUsed_QpTryOut() {
	console.log("S0")
	const qp = vsc.window.createQuickPick<vsc.QuickPickItem>()
	console.log("S1")
	// qp.step = 23
	// qp.totalSteps = 42
	// qp.title = "Noice"
	console.log("S2")
	qp.ignoreFocusOut = true
	// qp.buttons = [
	// 	{ tooltip: "jersey", iconPath: "jersey.svg" },
	// 	{ tooltip: "d-jersey", iconPath: "dark/jersey.svg" },
	// 	{ tooltip: "u-jersey", iconPath: "https://raw.githubusercontent.com/microsoft/vscode-icons/master/icons/dark/jersey.svg" },
	// 	{ tooltip: "location", iconPath: "location.svg" },
	// 	{ tooltip: "d-location", iconPath: "dark/location.svg" },
	// 	{ tooltip: "u-location", iconPath: "https://raw.githubusercontent.com/microsoft/vscode-icons/master/icons/dark/location.svg" },
	// ]
	console.log("S3")
	qp.items = new Array(88).map((_, i): vsc.QuickPickItem => ({
		description: `Descr. ${i}`, detail: `Detail ${i}`, label: `Label ${i}`
	}))
	console.log("S4", qp.items.length)
	// qp.onDidTriggerButton(btn => console.log(btn))
	// qp.onDidAccept(() => qp.hide())
	// qp.onDidHide(() => qp.dispose())
	console.log("S5")
	qp.enabled = true
	qp.show()
	console.log("S6")
}
