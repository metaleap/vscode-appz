import * as node_proc from 'child_process'
import * as node_pipeio from 'readline'
import * as vsc from 'vscode'

import { vscCtx, uxStr, onPromiseRejectedNoOp } from './appz'
import * as vscgen from './vscode.gen'



const dbgLogJsonMsgs = true
export let progs: { [_: string]: Prog } = {}



export interface IpcMsg {
    qName?: string
    data: { [_: string]: any } // | { "yay": any } | { "nay": any }
    cbId?: string
}

class Canceller extends vsc.CancellationTokenSource {
    num: number
    constructor() { super(); this.num = 1 }
}

export class Prog {
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
    objects: { [_: string]: any } = {}
    lastDynId: number = 0
    onAliveOrDead: () => void

    constructor(fullCmd: string, proc: node_proc.ChildProcess, stdoutPipe: node_pipeio.ReadLine, onAliveOrDead?: () => void) {
        [this.startTime, this.fullCmd, this.proc, this.stdoutPipe, this.cancellers, this.onAliveOrDead] =
            [Date.now(), fullCmd, proc, stdoutPipe, { "": new Canceller() }, onAliveOrDead]

        this.stdoutPipe.on('line', this.onRecv())
        if (this.proc.stderr)
            this.proc.stderr.on('data', data => this.onIncomingStderrOutput(data))
        this.proc.on('error', this.onProcErr())
        const ongone = this.onProcEnd()
        this.proc.on('disconnect', ongone)
        this.proc.on('close', ongone)
        this.proc.on('exit', ongone)
    }

    handleAliveOrDead() {
        const on = this.onAliveOrDead
        if (on) {
            this.onAliveOrDead = undefined
            on()
        }
    }

    dispose() {
        this.handleAliveOrDead()
        const proc = this.proc
        if (proc) {
            this.proc = null
            delete progs[this.fullCmd]

            for (const _ in this.callBacks)
                this.callBacks[_].reject()
            this.callBacks = {}

            for (const _ in this.cancellers) {
                this.cancellers[_].cancel()
                this.cancellers[_].dispose()
            }
            this.cancellers = {}

            for (const _ in this.objects) {
                const obj = this.objects[_] as vsc.Disposable
                if (obj && obj.dispose)
                    obj.dispose()
            }
            this.objects = {}

            if (this.stderrChan) {
                if (cfgAutoCloseStderrOutputsOnProgExit())
                    this.stderrChan.dispose()
                else
                    vscCtx.subscriptions.push(this.stderrChan)
                this.stderrChan = null
            }

            for (const pipe of [proc.stderr, proc.stdout, proc.stdin])
                if (pipe)
                    try { pipe.removeAllListeners() } catch (_) { }

            if (this.stdoutPipe) {
                try { this.stdoutPipe.removeAllListeners() } catch (_) { }
                try { this.stdoutPipe.close() } catch (_) { }
            }

            try { proc.removeAllListeners() } catch (_) { }
            try { proc.kill() } catch (_) { }
        }
    }

    private onIncomingStderrOutput(incoming: any) {
        this.handleAliveOrDead()
        const str = incoming ? (incoming + '') : ''
        this.stderrKept = this.hadOkJsonIncomingAtLeastOnce ? '' : (this.stderrKept + str)
        if (str && str.length) {
            if (this.stderrChan === undefined)
                this.stderrChan = vsc.window.createOutputChannel(uxStr.appzPref + this.fullCmd)
            if (this.stderrChan)
                this.stderrChan.append(str)
        }
    }

    callBack<T>(willRet: boolean, fnId: string, ...args: any[]): Thenable<T> {
        return (!this.proc) ? Promise.reject() : new Promise<T>((resolve, reject) => {
            if (!this.proc)
                reject()
            else {
                if (willRet)
                    this.callBacks[fnId] = { resolve: resolve, reject: reject }
                this.send({ cbId: fnId, data: { "": args ? args : [] } })
            }
        })
    }

    cancellerToken(fnId: any): vsc.CancellationToken | undefined {
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
            this.handleAliveOrDead()
            if (code)
                if (this.stderrChan && !cfgAutoCloseStderrOutputsOnProgExit())
                    this.stderrChan.show(true)
                else if (!this.hadOkJsonIncomingAtLeastOnce)
                    vsc.window.showWarningMessage((this.stderrKept && this.stderrKept.length) ? this.stderrKept : (uxStr.exitCodeNonZero.replace('_', code.toString()) + this.fullCmd))
            this.dispose()
        }
    }

    private onProcErr() {
        return (err: Error) => {
            this.handleAliveOrDead()
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
            this.handleAliveOrDead()
            if (dbgLogJsonMsgs)
                console.log("\n>>>IN>>>\n" + ln)

            let msg: IpcMsg
            try { msg = JSON.parse(ln) as IpcMsg } catch (_) { }

            if (!msg)
                vsc.window.showWarningMessage(ln)
            else if (msg.qName && msg.qName.length) {
                this.hadOkJsonIncomingAtLeastOnce = true
                this.handleIncomingRequestMsg(msg)
            } else if (msg.cbId && msg.cbId.length) {
                this.hadOkJsonIncomingAtLeastOnce = true
                this.handleIncomingResponseMsg(msg)
            } else
                vsc.window.showWarningMessage(ln)
        }
    }

    private handleIncomingRequestMsg(msg: IpcMsg) {
        let sendret = false
        const onfail = (err: any) => {
            if (err)
                vsc.window.showErrorMessage(err)
            if (this.proc && msg && msg.cbId && !sendret)
                this.send({ cbId: msg.cbId, data: { nay: ensureWillShowUpInJson(err) } })
        }

        if (msg.qName === 'Dispose' && msg.data) {
            const id = msg.data[''] as string
            if (id && id.length) {
                const obj = this.objects[id] as vsc.Disposable
                delete this.objects[id]
                if (obj && obj.dispose)
                    obj.dispose()
            }
        } else
            try {
                const cancelFnIds: string[] = []
                const ret = vscgen.handle(msg, this, cancelFnIds)
                const retprom = ret as Thenable<any>
                const retdisp = ret as vsc.Disposable

                if (retdisp && retdisp.dispose) {
                    this.ditchCancellers(cancelFnIds)
                    const id = this.nextId()
                    this.objects[id] = retdisp
                    if (sendret = msg.cbId ? true : false)
                        this.send({ cbId: msg.cbId, data: { yay: [id, ret] } })

                } else if (retprom && retprom.then)
                    retprom.then(
                        ret => {
                            this.ditchCancellers(cancelFnIds)
                            if (!this.proc)
                                vsc.window.showInformationMessage(uxStr.tooLate, this.fullCmd)
                                    .then(ensureProg, onPromiseRejectedNoOp)
                            else if (sendret = msg.cbId ? true : false)
                                this.send({ cbId: msg.cbId, data: { yay: ensureWillShowUpInJson(ret) } })
                        },
                        rej => {
                            this.ditchCancellers(cancelFnIds)
                            onfail(rej)
                        },
                    )

                else
                    this.ditchCancellers(cancelFnIds)
            } catch (err) { onfail(err) }
    }

    private handleIncomingResponseMsg(msg: IpcMsg) {
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
    }

    private send(msgOut: IpcMsg) {
        const onmaybefailed = (err: any) => {
            if (err && this.proc)
                vsc.window.showErrorMessage(err + '')
        }
        if (this.proc)
            try {
                const jsonmsgout = JSON.stringify(msgOut, (_key, val) => {
                    const uri = val as vsc.Uri
                    return (!(uri && (uri.fsPath || uri.path))) ? val :
                        (uri.fsPath && uri.fsPath.length) ? uri.fsPath : uri.path
                }) + '\n'
                if (dbgLogJsonMsgs)
                    console.log("\n<<<OUT<<\n" + jsonmsgout)

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

    nextId() {
        if (this.lastDynId === Number.MAX_SAFE_INTEGER)
            this.lastDynId = 0
        return (++this.lastDynId).toString()
    }
}


export function disposeAll() {
    const allprocs = progs
    progs = {}
    for (const _ in allprocs)
        progs[_].dispose()
}

export function ensureProg(fullCmd: string) {
    if (!(fullCmd && fullCmd.length))
        return
    let me = progs[fullCmd]
    if (!me)
        vsc.window.withProgress({ title: fullCmd, location: vsc.ProgressLocation.Window },
            (_progress, _cancellationToken) => new Promise((resolve, reject) => {
                const [cmd, args] = cmdAndArgs(fullCmd)
                let proc: node_proc.ChildProcess, pipe: node_pipeio.ReadLine
                try {
                    proc = node_proc.spawn(cmd, args, { stdio: 'pipe', windowsHide: true, argv0: cmd })
                } catch (e) { vsc.window.showErrorMessage(e) }
                if (proc)
                    if (proc.pid && proc.stdin && proc.stdin.writable && proc.stdout && proc.stdout.readable && (
                        pipe = node_pipeio.createInterface({ input: proc.stdout, terminal: false, historySize: 0 })
                    ))
                        me = new Prog(fullCmd, proc, pipe, resolve)
                    else
                        try { proc.removeAllListeners().kill() } catch (_) { }

                if (!me)
                    reject(vsc.window.showInformationMessage(uxStr.badProcCmd + fullCmd))
                else
                    progs[fullCmd] = me
            })
        )
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
