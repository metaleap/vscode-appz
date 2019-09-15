import * as node_proc from 'child_process'
import * as node_pipeio from 'readline'
import * as vsc from 'vscode'
import { vscCtx } from './appz'
import * as vscgen from './vscode.gen'



export interface IpcMsg {
    qName?: string
    data: { [_: string]: any } // | { "yay": any } | { "nay": any }
    cbId?: string
}



const dbgLogJsonMsgs = true
export let procs: { [_key: string]: node_proc.ChildProcess } = {}
let pipes: { [_pid: number]: [node_pipeio.ReadLine, vsc.OutputChannel] } = {}



export function disposeAll() {
    let proc: node_proc.ChildProcess,
        both: [node_pipeio.ReadLine, vsc.OutputChannel]
    const allprocs = procs, allpipes = pipes
    procs = {}
    pipes = {}
    for (const pid in allpipes)
        if ((both = allpipes[pid]) && both.length) {
            if (both[1]) both[1].dispose()
            try { both[0].removeAllListeners() } catch (_) { }
            try { both[0].close() } catch (_) { }
        }
    for (const key in allprocs)
        if (proc = allprocs[key]) {
            try { proc.removeAllListeners() } catch (_) { }
            try { proc.kill() } catch (_) { }
        }
}

export function disposeProc(pId: number) {
    const both = pipes[pId]
    if (both && both.length) {
        delete pipes[pId]
        if (both[1] && cfgAutoCloseStderrOutputsOnProgExit())
            both[1].dispose()
        else
            vscCtx.subscriptions.push(both[1])
        try { both[0].removeAllListeners() } catch (_) { }
        try { both[0].close() } catch (_) { }
    }
    let proc: node_proc.ChildProcess
    for (const key in procs)
        if ((proc = procs[key]) && proc.pid.toString() === pId.toString()) {
            delete procs[key]
            try { proc.removeAllListeners() } catch (_) { }
            try { proc.kill() } catch (_) { }
            break
        }
}

function onProgEnd(pId: number) {
    return (_code: number, _sig: string) =>
        disposeProc(pId)
}

function onProcErr(pId: number) {
    return (err: Error) => {
        console.log(err)
        disposeProc(pId)
    }
}

export function proc(fullCmd: string): node_proc.ChildProcess {
    let p = procs[fullCmd]
    if (!p) {
        const [cmd, args] = cmdAndArgs(fullCmd)
        try {
            p = node_proc.spawn(cmd, args, { stdio: 'pipe', windowsHide: true, argv0: cmd })
        } catch (e) { vsc.window.showErrorMessage(e) }
        if (p)
            if (!(p.pid && p.stdin && p.stdin.writable && p.stdout && p.stdout.readable))
                try { p.kill() } catch (_) { } finally { p = null }
            else {
                const pid = p.pid, pipe = node_pipeio.createInterface({
                    input: p.stdout, terminal: false, historySize: 0
                })
                if (!pipe)
                    try { p.kill() } catch (_) { } finally { p = null }
                else {
                    pipe.setMaxListeners(0)
                    pipe.on('line', onProcRecv(p))
                    pipes[pid] = [pipe, null]
                    p.on('error', onProcErr(pid))
                    const ongone = onProgEnd(pid)
                    p.on('disconnect', ongone)
                    p.on('close', ongone)
                    p.on('exit', ongone)
                    if (p.stderr) p.stderr.on('data', _ => {
                        const both = pipes[pid]
                        if (both) {
                            let vscout = both[1]
                            if (!vscout) {
                                both[1] = vscout = vsc.window.createOutputChannel("Appz: " + fullCmd)
                                pipes[pid] = both
                            }
                            vscout.appendLine(_)
                        }
                    })
                }
            }
        if (p)
            procs[fullCmd] = p
        else {
            delete procs[fullCmd]
            vsc.window.showErrorMessage('Unable to execute this exact command, any typos? ─── ' + fullCmd)
        }
    }
    return p
}

function cmdAndArgs(fullCmd: string): [string, string[]] {
    let cmd = (fullCmd + '').trim(), args: string[] = []
    const idx = cmd.indexOf(' ')
    if (idx > 0) {
        let instr = 0
        for (let i = idx; i < cmd.length; i++)
            if (cmd[i] === '"') {
                if (instr === 0)
                    instr = i
                else if (cmd[i - 1] !== '\\') {
                    args.push(cmd.slice(instr + 1, i))
                    instr = 0
                }
            } else if (instr === 0 && i < (cmd.length - 1) && cmd[i] === ' ' && cmd[i + 1] !== '"') {
                const pos = cmd.indexOf(' ', i + 1)
                if (pos < 0) {
                    args.push(cmd.slice(i + 1))
                    break
                } else if (pos > (i + 1)) {
                    args.push(cmd.slice(i + 1, pos))
                    i = pos - 1
                }
            }
        if (instr > 0)
            args.push(cmd.slice(instr))

        cmd = cmd.slice(0, idx)
    }
    return [cmd, args]
}

export function send(proc: node_proc.ChildProcess, msgOut: IpcMsg) {
    const onmaybefailed = (err: any) => {
        if (err && proc.pid && pipes[proc.pid])
            vsc.window.showErrorMessage(err + '')
    }
    try {
        const jsonmsgout = JSON.stringify(msgOut) + '\n'
        if (dbgLogJsonMsgs)
            console.log("OUT:\n" + jsonmsgout)

        const bufs = bufsUntilPipeDrained[proc.pid]
        if (bufs)
            bufs.push(jsonmsgout)
        else if (pipes[proc.pid] && !proc.stdin.write(jsonmsgout, onmaybefailed)) {
            bufsUntilPipeDrained[proc.pid] = []
            proc.stdin.once('drain', onProcPipeDrain(proc, onmaybefailed))
        }
    } catch (e) {
        onmaybefailed(e)
    }
}

const callBacks: {
    [_: string]: {
        resolve: ((_: any) => void),
        reject: ((_?: any) => void)
    }
} = {}

export function callBack<T>(proc: node_proc.ChildProcess, fnId: string, ...args: any[]): Thenable<T> {
    const prom = new Promise<T>((resolve, reject) => {
        callBacks[fnId] = { resolve: resolve, reject: reject }
    })
    send(proc, { cbId: fnId, data: { "": args } })
    return prom
}

const bufsUntilPipeDrained: { [_: number]: string[] } = {}

function onProcPipeDrain(proc: node_proc.ChildProcess, onMaybeFailed: (err: any) => void) {
    let ondrain: () => void
    ondrain = () => {
        const bufs = bufsUntilPipeDrained[proc.pid]
        delete bufsUntilPipeDrained[proc.pid]
        if (bufs && bufs.length)
            for (let i = 0; i < bufs.length && pipes[proc.pid]; i++)
                if (!proc.stdin.write(bufs[i], onMaybeFailed)) {
                    bufsUntilPipeDrained[proc.pid] =
                        (i === (bufs.length - 1)) ? [] : bufs.slice(i + 1)
                    proc.stdin.once('drain', ondrain)
                    break
                }
    }
    return ondrain
}

function onProcRecv(proc: node_proc.ChildProcess) {
    return (ln: string) => {
        if (dbgLogJsonMsgs)
            console.log("IN:\n" + ln)
        let msg: IpcMsg
        try { msg = JSON.parse(ln) as IpcMsg } catch (_) { }

        if (!msg)
            vsc.window.showErrorMessage(ln)

        else if (msg.qName) { // API request
            let sendret = false
            const onfail = (err: any) => {
                vsc.window.showErrorMessage(err)
                if (msg && msg.cbId && !sendret)
                    send(proc, { cbId: msg.cbId, data: { nay: (err === undefined) ? null : err } })
            }

            try {
                const promise = vscgen.handle(msg, proc)
                if (promise) promise.then(
                    ret => {
                        if (sendret = (proc.pid && pipes[proc.pid] && msg.cbId) ? true : false)
                            send(proc, { cbId: msg.cbId, data: { yay: (ret === undefined) ? null : ret } })
                    },
                    rej =>
                        onfail(rej),
                )
            } catch (err) { onfail(err) }

        } else if (msg.cbId && msg.data) { // response to an earlier remote-func-call of ours
            const [prom, yay, nay] = [callBacks[msg.cbId], msg.data['yay'] as any, msg.data['nay']]
            delete callBacks[msg.cbId]
            if (prom)
                if (nay)
                    prom.reject(nay)
                else
                    prom.resolve(yay)

        } else
            vsc.window.showErrorMessage(ln)
    }
}

function cfgAutoCloseStderrOutputsOnProgExit() {
    return vsc.workspace.getConfiguration("appz").get<boolean>("autoCloseStderrOutputsOnProgExit", true)
}
