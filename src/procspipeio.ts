import * as node_proc from 'child_process'
import * as node_pipeio from 'readline'
import * as vsc from 'vscode'

import { vscCtx, uxStr, onPromiseRejectedNoOp } from './appz'
import * as vscgen from './vscode.gen'



const dbgLogJsonMsgs = true
export let procs: { [_: string]: Proc } = {}



export interface IpcMsg {
    qName?: string
    data: { [_: string]: any } // | { "yay": any } | { "nay": any }
    cbId?: string
}

class Canceller extends vsc.CancellationTokenSource {
    num: number
    constructor() { super(); this.num = 1 }
}

export class Proc {
    fullCmd: string
    proc: node_proc.ChildProcess
    startTime: number
    hadOkJsonIncomingAtLeastOnce: boolean
    stdoutPipe: node_pipeio.ReadLine
    stderrChan: vsc.OutputChannel = undefined
    stderrKept: string = ''
    stdinBufsUntilPipeDrained: string[] = null
    cancellers: { [_: string]: Canceller } = {}
    callBacks: { [_: string]: { resolve: ((_: any) => void), reject: ((_?: any) => void) } } = {}

    constructor(fullCmd: string, proc: node_proc.ChildProcess, stdoutPipe: node_pipeio.ReadLine) {
        [this.startTime, this.fullCmd, this.proc, this.stdoutPipe] = [Date.now(), fullCmd, proc, stdoutPipe]

        this.stdoutPipe.on('line', this.onRecv())
        if (this.proc.stderr)
            this.proc.stderr.on('data', data => this.onIncomingStderrOutput(data))
        this.proc.on('error', this.onProcErr())
        const ongone = this.onProcEnd()
        this.proc.on('disconnect', ongone)
        this.proc.on('close', ongone)
        this.proc.on('exit', ongone)
    }

    dispose() {
        if (this.proc) {
            delete procs[this.fullCmd]

            for (const _ in this.cancellers)
                this.cancellers[_].dispose()
            this.cancellers = {}

            if (this.stderrChan) {
                if (cfgAutoCloseStderrOutputsOnProgExit())
                    this.stderrChan.dispose()
                else
                    vscCtx.subscriptions.push(this.stderrChan)
                this.stderrChan = null
            }

            for (const pipe of [this.proc.stderr, this.proc.stdout, this.proc.stdin])
                if (pipe)
                    try { pipe.removeAllListeners() } catch (_) { }

            if (this.stdoutPipe)
                try { this.stdoutPipe.removeAllListeners().close() } catch (_) { }

            try { this.proc.removeAllListeners() } catch (_) { }
            try { this.proc.kill() } catch (_) { }

            this.proc = null
        }
    }

    private onIncomingStderrOutput(incoming: any) {
        const str = incoming ? (incoming + '') : ''
        this.stderrKept = this.hadOkJsonIncomingAtLeastOnce ? '' : (this.stderrKept + str)
        if (str && str.length) {
            if (this.stderrChan === undefined)
                this.stderrChan = vsc.window.createOutputChannel(uxStr.appzPref + this.fullCmd)
            if (this.stderrChan)
                this.stderrChan.append(str)
        }
    }

    callBack<T>(fnId: string, ...args: any[]): Thenable<T> {
        const prom = new Promise<T>((resolve, reject) => {
            this.callBacks[fnId] = { resolve: resolve, reject: reject }
        })
        this.send({ cbId: fnId, data: { "": args } })
        return prom
    }

    canceller(fnId: any): vsc.CancellationToken | undefined {
        if (fnId && (typeof fnId === 'string') && fnId.length) {
            let it = this.cancellers[fnId]
            if (it)
                it.num++
            else
                this.cancellers[fnId] = (it = new Canceller())
            return it.token
        }
        return undefined
    }

    private onProcEnd() {
        return (code: number, _sig: string) => {
            if (code)
                if (this.stderrChan && !cfgAutoCloseStderrOutputsOnProgExit())
                    this.stderrChan.show(true)
                else if (!this.hadOkJsonIncomingAtLeastOnce)
                    vsc.window.showWarningMessage(this.stderrKept ? this.stderrKept : (uxStr.exitCodeNonZero.replace('_', code.toString()) + this.fullCmd))
            this.dispose()
        }
    }

    private onProcErr() {
        return (err: Error) => {
            if (err)
                vsc.window.showErrorMessage(err.name + ": " + err.message)
            this.dispose()
        }
    }

    private onProcPipeDrain(onMaybeFailed: (err: any) => void) {
        let ondrain: () => void
        ondrain = () => {
            const bufs = this.stdinBufsUntilPipeDrained
            this.stdinBufsUntilPipeDrained = null
            if (bufs && bufs.length)
                for (let i = 0; i < bufs.length; i++)
                    if (!this.proc.stdin.write(bufs[i], onMaybeFailed)) {
                        this.stdinBufsUntilPipeDrained =
                            (i === (bufs.length - 1)) ? [] : bufs.slice(i + 1)
                        this.proc.stdin.once('drain', ondrain)
                        break
                    }
        }
        return ondrain
    }

    private ditchCancellers(fnIds: string[]) {
        if (fnIds && fnIds.length)
            for (const fnid of fnIds) {
                const it = this.cancellers[fnid]
                if (it && 0 === (it.num = Math.max(0, it.num - 1))) {
                    it.dispose()
                    delete this.cancellers[fnid]
                }
            }
    }

    private onRecv() {
        return (ln: string) => {
            if (dbgLogJsonMsgs)
                console.log("IN:\n" + ln)
            let msg: IpcMsg
            try { msg = JSON.parse(ln) as IpcMsg } catch (_) { }

            if (!msg)
                vsc.window.showWarningMessage(ln)

            else if (msg.qName) { // API request
                this.hadOkJsonIncomingAtLeastOnce = true
                let sendret = false
                const onfail = (err: any) => {
                    if (err)
                        vsc.window.showErrorMessage(err)
                    if (msg && msg.cbId && !sendret)
                        this.send({ cbId: msg.cbId, data: { nay: ensureWillShowUpInJson(err) } })
                }

                try {
                    const [promise, cancelFnIds] = vscgen.handle(msg, this)
                    if (!promise)
                        this.ditchCancellers(cancelFnIds)
                    else
                        promise.then(
                            ret => {
                                this.ditchCancellers(cancelFnIds)
                                if (!this.proc)
                                    vsc.window.showInformationMessage(uxStr.tooLate, this.fullCmd)
                                        .then(ensureProc, onPromiseRejectedNoOp)
                                else if (sendret = msg.cbId ? true : false)
                                    this.send({ cbId: msg.cbId, data: { yay: ensureWillShowUpInJson(ret) } })
                            },
                            rej => {
                                this.ditchCancellers(cancelFnIds)
                                onfail(rej)
                            },
                        )
                } catch (err) { onfail(err) }

            } else if (msg.cbId) { // response to an earlier remote-func-call of ours, or cancellation
                this.hadOkJsonIncomingAtLeastOnce = true
                if (msg.data) {
                    const [prom, yay, nay] = [this.callBacks[msg.cbId], msg.data['yay'] as any, msg.data['nay']]
                    delete this.callBacks[msg.cbId]
                    if (prom)
                        if (nay)
                            prom.reject(nay)
                        else
                            prom.resolve(yay)
                } else {
                    const cts = this.cancellers[msg.cbId]
                    if (cts)
                        cts.cancel()
                }

            } else
                vsc.window.showWarningMessage(ln)
        }
    }

    private send(msgOut: IpcMsg) {
        const onmaybefailed = (err: any) => {
            if (err && this.proc)
                vsc.window.showErrorMessage(err + '')
        }
        try {
            const jsonmsgout = JSON.stringify(msgOut) + '\n'
            if (dbgLogJsonMsgs)
                console.log("OUT:\n" + jsonmsgout)

            if (this.stdinBufsUntilPipeDrained !== null)
                this.stdinBufsUntilPipeDrained.push(jsonmsgout)
            else if (this.proc && !this.proc.stdin.write(jsonmsgout, onmaybefailed)) {
                this.stdinBufsUntilPipeDrained = []
                this.proc.stdin.once('drain', this.onProcPipeDrain(onmaybefailed))
            }
        } catch (e) {
            onmaybefailed(e)
        }
    }
}


export function disposeAll() {
    const allprocs = procs
    procs = {}
    for (const _ in allprocs)
        procs[_].dispose()
}

export function ensureProc(fullCmd: string) {
    if (!(fullCmd && fullCmd.length))
        return
    let me = procs[fullCmd]
    if (!me) {
        const [cmd, args] = cmdAndArgs(fullCmd)
        let p: node_proc.ChildProcess, pipe: node_pipeio.ReadLine
        try {
            p = node_proc.spawn(cmd, args, { stdio: 'pipe', windowsHide: true, argv0: cmd })
        } catch (e) { vsc.window.showErrorMessage(e) }
        if (p)
            if (p.pid && p.stdin && p.stdin.writable && p.stdout && p.stdout.readable && (
                pipe = node_pipeio.createInterface({ input: p.stdout, terminal: false, historySize: 0 })
            ))
                me = new Proc(fullCmd, p, pipe)
            else
                try { p.removeAllListeners().kill() } catch (_) { }

        if (!me)
            vsc.window.showInformationMessage(uxStr.badProcCmd + fullCmd)
        else
            procs[fullCmd] = me
    }
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

function cfgAutoCloseStderrOutputsOnProgExit() {
    return vsc.workspace.getConfiguration("appz").get<boolean>("autoCloseStderrOutputsOnProgExit", true)
}

function ensureWillShowUpInJson(_: any) {
    return (_ === undefined) ? null : _
}
