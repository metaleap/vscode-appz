import * as vsc from './vscode'


type dict = { [_: string]: any }

export let OnError = (_this: vsc.Vscode, err: any, jsonMsg?: any): void => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n")
}

export class ipcMsg {
    qName: string
    data: dict
    cbId: string
}

export function Vsc(stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream): vsc.Vscode {
    return new impl(stdIn, stdOut)
}


export class impl extends vsc.impl {
    readln: NodeJS.ReadStream
    jsonOut: NodeJS.WriteStream
    counter: number = 0
    listening: boolean = false

    cbWaiting: { [_: string]: (_: any) => boolean } = {}
    cbListeners: { [_: string]: (_: any[]) => boolean } = {}
    cbOther: { [_: string]: (_: any[]) => [any, boolean] } = {}

    constructor(stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream) {
        super()
        this.readln = stdIn ? stdIn : process.stdin
        this.jsonOut = stdOut ? stdOut : process.stdout
    }

    nextFuncId() {
        return (this.counter =
            (this.counter === Number.MAX_SAFE_INTEGER) ? 1 : (1 + this.counter)
        ).toString()
    }

    send(msg: ipcMsg, on: (_: any) => boolean): void {
        if (!this.listening) {
            this.listening = true
            this.setupReadLn()
        }

        if (on) {
            msg.cbId = this.nextFuncId()
            this.cbWaiting[msg.cbId] = on
        }
        try {
            this.jsonOut.write(JSON.stringify(msg) + '\n', err => {
                if (err)
                    throw err
            })
        } catch (err) {
            if (msg.qName && msg.qName.length)
                msg.data[""] = msg.qName
            OnError(this, err, msg)
        }
    }

    setupReadLn() {
        let buf: string = ''
        this.readln.setEncoding('utf8')
        this.readln.on('error', (err: Error) => OnError(this, err))
        this.readln.on('data', (chunk: string) => {
            buf += chunk
            for (let i = buf.indexOf('\n'); i >= 0; i = buf.indexOf('\n')) {
                let jsonmsg = buf.slice(0, i)
                buf = buf.slice(i + 1)
                if (jsonmsg && (jsonmsg = jsonmsg.trim()).length)
                    try {
                        let inmsg = JSON.parse(jsonmsg) as ipcMsg
                        if (!(inmsg.data))
                            throw "field `data` is missing"
                        const cbprom = this.cbWaiting[inmsg.cbId], cbevt = this.cbListeners[inmsg.cbId], cbmisc = this.cbOther[inmsg.cbId]
                        if (cbprom) {
                            const yay = inmsg.data['yay'], nay = inmsg.data['nay']
                            if (nay)
                                throw nay
                            else if (yay === undefined)
                                throw "field `data` must have either `yay` or `nay` member"
                            else if (!cbprom(yay))
                                throw `unexpected args: ${yay}`
                        } else if (cbevt) {

                        } else if (cbmisc) {

                        } else
                            throw "specified `cbId` not known locally"
                    } catch (err) {
                        OnError(this, err, jsonmsg)
                    }
            }
        })
    }

}
