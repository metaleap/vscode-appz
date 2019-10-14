"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("./core");
exports.OnError = (_this, err, jsonMsg) => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n");
};
function Vsc(stdIn, stdOut) {
    return new core.impl(stdIn, stdOut);
}
exports.Vsc = Vsc;
function CancelIn(msFromNow) {
    return core.Cancel.In(msFromNow);
}
exports.CancelIn = CancelIn;
