import { ipcMsg } from './aux'

export interface Vscode {
    readonly window: Window
}

export interface Window {
    readonly showErrorMessage: (message: string, items: string[], then: (_: string) => void) => void
}

export abstract class impl implements Vscode {
    window: Window

    constructor() {
        this.window = new implWindow(this)
    }

    abstract send(msg: ipcMsg, on: (_: any) => boolean): void;
}

class implBase {
    impl: impl

    constructor(impl: impl) { this.impl = impl }

    send(msg: ipcMsg, on: (_: any) => boolean) {
        this.impl.send(msg, on)
    }
}

class implWindow extends implBase implements Window {

    constructor(impl: impl) {
        super(impl)
    }

    showErrorMessage(message: string, items: string[], then: (_: string) => void) {
        let msg: ipcMsg
        msg = new ipcMsg()
        msg.qName = 'window.showErrorMessage1'
        msg.data = {}
        msg.data['message'] = message
        msg.data['items'] = items
        let on: (_: any) => boolean
        if (then !== undefined && then !== null) {
            on = (payload: any): boolean => {
                let ok: boolean
                let result: string
                if (payload !== undefined && payload !== null) {
                    [result, ok] = (typeof payload === 'string') ? [payload, true] : [undefined, false]
                    if (!ok) {
                        return false
                    }
                }
                then(result)
                return true
            }
        }
        this.send(msg, on)
    }

}
