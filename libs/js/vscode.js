"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aux_1 = require("./aux");
class impl {
    constructor() {
        this.window = new implWindow(this);
    }
}
exports.impl = impl;
class implBase {
    constructor(impl) { this.impl = impl; }
    send(msg, on) {
        this.impl.send(msg, on);
    }
}
class implWindow extends implBase {
    constructor(impl) {
        super(impl);
    }
    showErrorMessage(message, items, then) {
        let msg;
        msg = new aux_1.ipcMsg();
        msg.QName = 'window.showErrorMessage1';
        msg.Data = {};
        msg.Data['message'] = message;
        msg.Data['items'] = items;
        let on;
        if (then !== undefined && then !== null) {
            on = (payload) => {
                let ok;
                let result;
                if (payload !== undefined && payload !== null) {
                    [result, ok] = (typeof payload === 'string') ? [payload, true] : [undefined, false];
                    if (!ok) {
                        return false;
                    }
                }
                then(result);
                return true;
            };
        }
        this.send(msg, on);
    }
}
