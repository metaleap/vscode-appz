import * as ipc from './ipcprotocol'
import * as vscgen from './vscode.gen'

import * as node_proc from 'child_process'
import * as node_pipeio from 'readline'

import * as vsc from 'vscode'
const vscwin = vsc.window



export let procs: { [_key: string]: node_proc.ChildProcess } = {}
let pipes: { [_pid: string]: node_pipeio.ReadLine } = {}



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

export function disposeProc(pId: string) {
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
                    pipe.on('line', onProcRecv(p))
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

export function send(proc: node_proc.ChildProcess, jsonMsgOut: string) {
    const onsendmaybefailed = (_problem: any) => {
        // later: if proms involved signal rejection
        // later: if waiting-callbacks hang around, del them
    }
    try {
        if (!proc.stdin.write(jsonMsgOut + '\n'))
            proc.stdin.once('drain', onsendmaybefailed)
        else
            process.nextTick(onsendmaybefailed)
    } catch (e) {
        onsendmaybefailed(e)
    }
}

function onProcRecv(proc: node_proc.ChildProcess) {
    return (ln: string) => {
        const msg = JSON.parse(ln) as ipc.MsgIncoming
        if (!msg)
            vscwin.showErrorMessage(ln)
        else if (msg.ns && msg.name) { // API request
            vscgen.handle(msg)
        } else if (msg.andThen) { // response to an earlier remote-func-call of ours

        }
    }
}
