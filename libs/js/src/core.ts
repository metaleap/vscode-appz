import * as appz from './vsc-appz'
import * as vscgen from './vscode.gen'


type dict = { [_: string]: any }

export class ipcMsg {
    QName: string
    Data: dict
    CbId: string

    constructor(qName?: string, data?: dict, cbId?: string) {
        [this.QName, this.Data, this.CbId] = [qName, data, cbId]
    }

    toJSON() { return { qName: this.QName, data: this.Data, cbId: this.CbId } }
}

export class impl extends vscgen.impl {
    main: (_: vscgen.Vscode) => void
    readln: NodeJS.ReadStream
    jsonOut: NodeJS.WriteStream
    counter: number = 0

    cbWaiting: { [_: string]: (_: any) => boolean } = {}
    cbListeners: { [_: string]: (_: any[]) => boolean } = {}
    cbOther: { [_: string]: (_: any[]) => [any, boolean] } = {}

    constructor(main: (_: vscgen.Vscode) => void, stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream) {
        super()
        this.main = main
        this.readln = stdIn ? stdIn : process.stdin
        this.jsonOut = stdOut ? stdOut : process.stdout
        this.setupReadLn()
    }

    nextFuncId() {
        return (this.counter =
            (this.counter === Number.MAX_SAFE_INTEGER) ? 1 : (1 + this.counter)
        ).toString()
    }

    nextSub(eitherListener: (_: any[]) => boolean, orOther: (_: any[]) => [any, boolean]) {
        const fnid = this.nextFuncId()
        if (eitherListener)
            this.cbListeners[fnid] = eitherListener
        else if (orOther)
            this.cbOther[fnid] = orOther
        return fnid
    }

    send(msg: ipcMsg, on?: (_: any) => boolean): void {
        if (on) {
            msg.CbId = this.nextFuncId()
            this.cbWaiting[msg.CbId] = on
        }
        try {
            this.jsonOut.write(JSON.stringify(msg) + '\n', err => {
                if (err)
                    throw err
            })
        } catch (err) {
            if (msg.QName && msg.QName.length)
                msg.Data["#"] = msg.QName
            appz.OnError(this, err, msg)
        }
    }

    setupReadLn() {
        let buf: string = ''
        this.readln.setEncoding('utf8')
        this.readln.on('error', (err: Error) => appz.OnError(this, err))
        this.readln.on('data', (chunk: string) => {
            buf += chunk
            for (let i = buf.indexOf('\n'); i >= 0; i = buf.indexOf('\n')) {
                let jsonmsg = buf.slice(0, i)
                buf = buf.slice(i + 1)
                if (jsonmsg && (jsonmsg = jsonmsg.trim()).length)
                    try {
                        let inmsg = JSON.parse(jsonmsg, (key, value) => {
                            if (value && (!(key && key.length))
                                && (value['qName'] || value['data'] || value['cbId'])
                            )
                                return new ipcMsg(value['qName'], value['data'], value['cbId'])
                            return value
                        }) as ipcMsg
                        if (inmsg.QName === "main")
                            this.main(this)
                        else if (!(inmsg.Data))
                            throw "field `data` is missing"
                        else {
                            const cbprom = this.cbWaiting[inmsg.CbId], cbevt = this.cbListeners[inmsg.CbId], cbmisc = this.cbOther[inmsg.CbId]
                            if (cbprom) {
                                const yay = inmsg.Data['yay'], nay = inmsg.Data['nay']
                                if (nay)
                                    throw nay
                                else if (yay === undefined)
                                    throw "field `data` must have either `yay` or `nay` member"
                                else if (!cbprom(yay))
                                    throw "unexpected args: " + JSON.stringify(yay)
                            } else if (cbevt) {
                                const fnargs = inmsg.Data['[]']
                                const args = fnargs as any[]
                                if (args === undefined || args === null
                                    || !cbevt(args)
                                ) throw "unexpected args: " + JSON.stringify(fnargs)
                            } else if (cbmisc) {
                                const fnargs = inmsg.Data['[]']
                                const args = fnargs as any[]
                                let ret: any
                                let ok = (args !== undefined && args !== null)
                                if (ok)
                                    [ret, ok] = cbmisc(args)
                                this.send(new ipcMsg(undefined,
                                    (ok ? { yay: ret }
                                        : { nay: "unexpected args: " + JSON.stringify(fnargs) }),
                                    inmsg.CbId)
                                )
                            } else
                                throw "specified `cbId` not known locally"
                        }
                    } catch (err) {
                        appz.OnError(this, err, jsonmsg)
                    }
            }
        })
    }
}

export class Cancel {
    impl: impl
    fnId: string = ""

    static In(msFromNow: number) {
        const me = new Cancel()
        setTimeout(() => me.Now(), msFromNow)
        return me
    }

    Now() {
        if (!(this.impl && this.fnId))
            appz.OnError(this.impl, "vscode-appz/libs/js#Cancel.Now called before the Cancel was announced to the counterparty.\n")
        else
            this.impl.send(new ipcMsg(undefined, undefined, this.fnId))
    }
}

export class Disposable {
    impl: impl
    id: string
    subFnIds: string[]

    addSub(fnId: string) {
        if (!this.subFnIds)
            this.subFnIds = []
        this.subFnIds.push(fnId)
    }

    bind(impl: impl, ...subFnIds: string[]) {
        [this.impl, this.subFnIds] = [impl, subFnIds]
        return this
    }

    __loadFromJsonish__(payload: any): boolean {
        return ((typeof payload === 'string') && (this.id = payload) && this.id.length) ? true : false
    }

    Dispose(): (_: () => void) => void {
        let ondone: () => void
        this.impl.send(new ipcMsg('dispose', { '': this.id }), () => {
            if (ondone)
                ondone()
            return true
        })
        if (this.subFnIds && this.subFnIds.length) {
            for (const subfnid of this.subFnIds) {
                delete this.impl.cbListeners[subfnid]
                delete this.impl.cbOther[subfnid]
            }
            this.subFnIds = []
        }
        return (on: () => void) => ondone = on;
    }
}
