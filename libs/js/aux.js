"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appz = require("./vsc-appz");
const vscgen = require("./vscode.gen");
class ipcMsg {
    constructor(qName, data, cbId) {
        [this.QName, this.Data, this.CbId] = [qName, data, cbId];
    }
    toJSON() { return { qName: this.QName, data: this.Data, cbId: this.CbId }; }
}
exports.ipcMsg = ipcMsg;
class impl extends vscgen.impl {
    constructor(stdIn, stdOut) {
        super();
        this.counter = 0;
        this.cbWaiting = {};
        this.cbListeners = {};
        this.cbOther = {};
        this.readln = stdIn ? stdIn : process.stdin;
        this.jsonOut = stdOut ? stdOut : process.stdout;
        this.setupReadLn();
    }
    nextFuncId() {
        return (this.counter =
            (this.counter === Number.MAX_SAFE_INTEGER) ? 1 : (1 + this.counter)).toString();
    }
    nextSub(subscriber) {
        const fnid = this.nextFuncId();
        this.cbListeners[fnid] = subscriber;
        return fnid;
    }
    send(msg, on) {
        if (on) {
            msg.CbId = this.nextFuncId();
            this.cbWaiting[msg.CbId] = on;
        }
        try {
            this.jsonOut.write(JSON.stringify(msg) + '\n', err => {
                if (err)
                    throw err;
            });
        }
        catch (err) {
            if (msg.QName && msg.QName.length)
                msg.Data[""] = msg.QName;
            appz.OnError(this, err, msg);
        }
    }
    setupReadLn() {
        let buf = '';
        this.readln.setEncoding('utf8');
        this.readln.on('error', (err) => appz.OnError(this, err));
        this.readln.on('data', (chunk) => {
            buf += chunk;
            for (let i = buf.indexOf('\n'); i >= 0; i = buf.indexOf('\n')) {
                let jsonmsg = buf.slice(0, i);
                buf = buf.slice(i + 1);
                if (jsonmsg && (jsonmsg = jsonmsg.trim()).length)
                    try {
                        let inmsg = JSON.parse(jsonmsg, (key, value) => {
                            if (value && (!(key && key.length))
                                && (value['qName'] || value['data'] || value['cbId']))
                                return new ipcMsg(value['qName'], value['data'], value['cbId']);
                            return value;
                        });
                        if (!(inmsg.Data))
                            throw "field `data` is missing";
                        const cbprom = this.cbWaiting[inmsg.CbId], cbevt = this.cbListeners[inmsg.CbId], cbmisc = this.cbOther[inmsg.CbId];
                        if (cbprom) {
                            const yay = inmsg.Data['yay'], nay = inmsg.Data['nay'];
                            if (nay)
                                throw nay;
                            else if (yay === undefined)
                                throw "field `data` must have either `yay` or `nay` member";
                            else if (!cbprom(yay))
                                throw "unexpected args: " + JSON.stringify(yay);
                        }
                        else if (cbevt) {
                            const fnargs = inmsg.Data[''];
                            const args = fnargs;
                            if (args === undefined || args === null
                                || !cbevt(args))
                                throw "unexpected args: " + JSON.stringify(fnargs);
                        }
                        else if (cbmisc) {
                            const fnargs = inmsg.Data[''];
                            const args = fnargs;
                            let ret;
                            let ok = (args !== undefined && args !== null);
                            if (ok)
                                [ret, ok] = cbmisc(args);
                            this.send(new ipcMsg(undefined, (ok ? { yay: ret }
                                : { nay: "unexpected args: " + JSON.stringify(fnargs) }), inmsg.CbId));
                        }
                        else
                            throw "specified `cbId` not known locally";
                    }
                    catch (err) {
                        appz.OnError(this, err, jsonmsg);
                    }
            }
        });
    }
}
exports.impl = impl;
class Cancel {
    static In(msFromNow) {
        const me = new Cancel();
        setTimeout(() => me.Now(), msFromNow);
        return me;
    }
    Now() {
        if (!(this.impl && this.fnId))
            appz.OnError(this.impl, "vscode-appz/libs/js#Cancel.Now called before the Cancel was announced to the counterparty.\n");
        else
            this.impl.send(new ipcMsg(undefined, undefined, this.fnId));
    }
}
exports.Cancel = Cancel;
class Disposable {
    bind(impl, subFnId) {
        [this.impl, this.subFnId] = [impl, subFnId];
        return this;
    }
    populateFrom(payload) {
        const arr = payload;
        return (arr && arr.length === 2 && arr[0] && (typeof arr[0] === 'string')
            && ((this.id = arr[0]).length > 0));
    }
    Dispose() {
        this.impl.send(new ipcMsg('Dispose', { '': this.id }));
        if (this.subFnId && this.subFnId.length) {
            delete this.impl.cbListeners[this.subFnId];
            this.subFnId = null;
        }
    }
}
exports.Disposable = Disposable;
