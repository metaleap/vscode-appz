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

const appStartTimes: { [_: string]: number } = {}

function onCmdMain() {
	const progs = vscproj.getConfiguration("appz").get<string[]>("progs")

	interface pickItem extends vsc.QuickPickItem { prog: string, pid: number }
	const items: pickItem[] = progs.map(_ => ({
		prog: _, pid: 0, label: "START:\t" + _,
		detail: ppio.procs[_] ? "Already running. Will kill and re-start." : "Not yet running."
	}))
	for (const _ in ppio.procs) {
		let durstr = new Date(Date.now() - appStartTimes[_]).toISOString()
		if (!durstr.startsWith("1970-01-01T")) // YYYY-MM-DDTHH:mm:ss.sssZ
			durstr = "well over a day"
		else
			durstr = durstr.slice(0, durstr.indexOf('.')).slice(1 + durstr.indexOf('T'))
		items.push({
			prog: _, label: "KILL:\t" + _, pid: ppio.procs[_].pid,
			detail: `Started ${durstr} ago.`
		})
	}

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
					if (ppio.proc(_.prog))
						appStartTimes[_.prog] = Date.now()
				}
		})
}
