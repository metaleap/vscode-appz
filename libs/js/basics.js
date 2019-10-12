"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vsc = require("./vscode");
exports.OnError = (_this, err, jsonMsg) => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n");
};
class ipcMsg {
}
exports.ipcMsg = ipcMsg;
function Vsc(stdIn, stdOut) {
    return new impl(stdIn, stdOut);
}
exports.Vsc = Vsc;
class impl extends vsc.impl {
    constructor(stdIn, stdOut) {
        super();
        this.counter = 0;
        this.listening = false;
        this.cbWaiting = {};
        this.cbListeners = {};
        this.cbOther = {};
        this.readln = stdIn ? stdIn : process.stdin;
        this.jsonOut = stdOut ? stdOut : process.stdout;
    }
    nextFuncId() {
        return (this.counter =
            (this.counter === Number.MAX_SAFE_INTEGER) ? 1 : (1 + this.counter)).toString();
    }
    send(msg, on) {
        if (!this.listening) {
            this.listening = true;
            this.setupReadLn();
        }
        if (on) {
            msg.cbId = this.nextFuncId();
            this.cbWaiting[msg.cbId] = on;
        }
        try {
            this.jsonOut.write(JSON.stringify(msg) + '\n', err => {
                if (err)
                    throw err;
            });
        }
        catch (err) {
            if (msg.qName && msg.qName.length)
                msg.data[""] = msg.qName;
            exports.OnError(this, err, msg);
        }
    }
    setupReadLn() {
        let buf = '';
        this.readln.setEncoding('utf8');
        this.readln.on('error', (err) => exports.OnError(this, err));
        this.readln.on('data', (chunk) => {
            buf += chunk;
            for (let i = buf.indexOf('\n'); i >= 0; i = buf.indexOf('\n')) {
                let jsonmsg = buf.slice(0, i);
                buf = buf.slice(i + 1);
                if (jsonmsg && (jsonmsg = jsonmsg.trim()).length)
                    try {
                        let inmsg = JSON.parse(jsonmsg);
                        if (!(inmsg.data))
                            throw "field `data` is missing";
                        const cbprom = this.cbWaiting[inmsg.cbId], cbevt = this.cbListeners[inmsg.cbId], cbmisc = this.cbOther[inmsg.cbId];
                        if (cbprom) {
                            const yay = inmsg.data['yay'], nay = inmsg.data['nay'];
                            if (nay)
                                throw nay;
                            else if (!yay)
                                throw "field `data` must have either `yay` or `nay` member";
                            else if (!cbprom(yay))
                                throw `unexpected args: ${yay}`;
                        }
                        else if (cbevt) {
                        }
                        else if (cbmisc) {
                        }
                        else
                            throw "specified `cbId` not known locally";
                    }
                    catch (err) {
                        exports.OnError(this, err, jsonmsg);
                    }
            }
        });
    }
}
exports.impl = impl;
