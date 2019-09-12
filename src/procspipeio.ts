import * as ipc from './ipcprotocol'
import * as vscgen from './vscode.gen'

import * as node_proc from 'child_process'
import * as node_pipeio from 'readline'

import * as vsc from 'vscode'
const vscwin = vsc.window



const dbgLogJsonMsgs = true

export let procs: { [_key: string]: node_proc.ChildProcess } = {}
let pipes: { [_pid: number]: node_pipeio.ReadLine } = {}



export function disposeAll() {
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

export function disposeProc(pId: number) {
    const pipe = pipes[pId]
    if (pipe) {
        delete pipes[pId]
        try { pipe.removeAllListeners() } catch (_) { }
        try { pipe.close() } catch (_) { }
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
        } catch (e) { vscwin.showErrorMessage(e) }
        if (p)
            if (!(p.pid && p.stdin && p.stdin.writable && p.stdout && p.stdout.readable && p.stderr && p.stderr.readable))
                try { p.kill() } catch (_) { } finally { p = null }
            else {
                p.stderr.on('data', foo => vscwin.showWarningMessage(foo))
                p.stdout.on('data', moo => vscwin.showInformationMessage(moo))
                const pipe = node_pipeio.createInterface({
                    input: p.stdout, terminal: false, historySize: 0
                })
                if (!pipe)
                    try { p.kill() } catch (_) { } finally { p = null }
                else {
                    pipe.setMaxListeners(0)
                    pipe.on('line', onProcRecv(p))
                    pipes[p.pid] = pipe
                    p.on('error', onProcErr(p.pid))
                    const ongone = onProgEnd(p.pid)
                    p.on('disconnect', ongone)
                    p.on('close', ongone)
                    p.on('exit', ongone)
                    p.stderr.on('data', vscwin.showWarningMessage)
                }
            }
        if (p)
            procs[fullCmd] = p
        else {
            delete procs[fullCmd]
            vscwin.showErrorMessage('Unable to execute this exact command, any typos? ─── ' + fullCmd)
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

export function send(proc: node_proc.ChildProcess, msgOut: ipc.MsgToApp) {
    const onmaybefailed = (err: any) => {
        if (err && proc.pid && pipes[proc.pid])
            vscwin.showErrorMessage(err + '')
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
        reject: (() => void)
    }
} = {}

export function callBack<T>(proc: node_proc.ChildProcess, fnId: string, ...args: any[]): Thenable<T> {
    const prom = new Promise<T>((resolve, reject) => {
        callBacks[fnId] = { resolve: resolve, reject: reject }
    })
    send(proc, { andThen: fnId, payload: args })
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
        let msg: ipc.MsgFromApp
        try { msg = JSON.parse(ln) as ipc.MsgFromApp } catch (_) { }

        const onfail = (err: any) => {
            vscwin.showWarningMessage(err)
            if (msg && msg.andThen)
                send(proc, { andThen: msg.andThen, failed: true })
        }

        if (!msg)
            vscwin.showErrorMessage(ln)

        else if (msg.ns && msg.name) { // API request
            try {
                const promise = vscgen.handle(msg, proc)
                if (promise) promise.then(
                    ret => {
                        if (pipes[proc.pid] && msg.andThen)
                            send(proc, { andThen: msg.andThen, payload: ret })
                    },
                    err =>
                        onfail(err),
                )
            } catch (err) { onfail(err) }

        } else if (msg.andThen && msg.payload) { // response to an earlier remote-func-call of ours
            const [prom, ret, ok] = [callBacks[msg.andThen], msg.payload['ret'], msg.payload['ok']]
            delete callBacks[msg.andThen]
            if (prom)
                if (ok)
                    prom.resolve(ret)
                else
                    prom.reject()

        } else
            vscwin.showErrorMessage(ln)
    }
}
