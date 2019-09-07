import * as node_proc from 'child_process'
import * as node_pipeio from 'readline'

import * as vsc from 'vscode'
const vscproj = vsc.workspace
const vscwin = vsc.window



let procs: { [_key: string]: node_proc.ChildProcess } = {},
	pipes: { [_pid: string]: node_pipeio.ReadLine } = {}



export function deactivate() {
	let proc: node_proc.ChildProcess,
		pipe: node_pipeio.ReadLine
	const allprocs = procs,
		allpipes = pipes
	procs = {}
	pipes = {}
	for (const pid in allpipes)
		if (pipe = allpipes[pid]) {
			try { pipe.removeAllListeners() } catch (_) { }
			try { pipe.close() } catch (_) { }
		}
	for (const key in allprocs)
		if (proc = allprocs[key]) {
			try { proc.removeAllListeners() } catch (_) { }
			try { proc.kill() } catch (_) { }
		}
}

export function activate(ctx: vsc.ExtensionContext) {
	ctx.subscriptions.push(vsc.commands.registerCommand('vsc_appz.main', onCmdMain))
}


function onCmdMain() {
	const progs = vscproj.getConfiguration("appz").get<string[]>("progs")

	interface pickItem extends vsc.QuickPickItem { prog: string, pid: number }
	const items: pickItem[] = progs.map(_ => ({ prog: _, pid: 0, label: "START: " + _ }))
	for (const _ in procs)
		items.push({ prog: _, label: "KILL: " + _, pid: procs[_].pid })

	if (!items.length)
		vscwin.showInformationMessage("Your current `settings.json` has no Appz configured under `appz.progs`.")
	else
		vscwin.showQuickPick(items).then(_ => {
			if (_ && _.prog)
				if (_.pid)
					disposeProc(_.pid + '')
				else {
					const alreadyrunning = procs[_.prog]
					if (alreadyrunning)
						disposeProc(alreadyrunning.pid + '')
					proc(_.prog)
				}
		})
}

function disposeProc(pId: string) {
	const pipe = pipes[pId]
	if (pipe) {
		delete pipes[pId]
		try { pipe.removeAllListeners() } catch (_) { }
		try { pipe.close() } catch (_) { }
	}
	let proc: node_proc.ChildProcess
	for (const key in procs)
		if ((proc = procs[key]) && proc.pid.toString() === pId) {
			delete procs[key]
			try { proc.removeAllListeners() } catch (_) { }
			try { proc.kill() } catch (_) { }
			break
		}
}

function onProgEnd(pId: number) {
	return (_code: number, _sig: string) =>
		disposeProc(pId + '')
}

function onProcErr(pId: number) {
	return (_err: Error) =>
		disposeProc(pId + '')
}

export function proc(fullCmd: string): node_proc.ChildProcess {
	let p = procs[fullCmd]
	if (!p) {
		try {
			p = node_proc.spawn(fullCmd)
		} catch (e) { vscwin.showErrorMessage(e) }
		if (p)
			if (!(p.pid && p.stdin && p.stdin.writable && p.stdout && p.stdout.readable && p.stderr && p.stderr.readable))
				try { p.kill() } catch (_) { } finally { p = null }
			else {
				const pipe = node_pipeio.createInterface({
					input: p.stdout, terminal: false, historySize: 0
				})
				if (!pipe)
					try { p.kill() } catch (_) { } finally { p = null }
				else {
					pipe.setMaxListeners(0)
					pipe.on('line', vscwin.showInformationMessage)
					pipes[p.pid.toString()] = pipe
					p.on('error', onProcErr(p.pid))
					const ongone = onProgEnd(p.pid)
					p.on('disconnect', ongone)
					p.on('close', ongone)
					p.on('exit', ongone)
					p.stderr.on('data', vscwin.showWarningMessage)
				}
			}
		if (!p)
			delete procs[fullCmd]
		else
			procs[fullCmd] = p
	}
	return p
}
