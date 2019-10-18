"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("./core");
exports.OnError = (_this, err, jsonMsg) => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n");
};
function Main(main, stdIn, stdOut) {
    new core.impl(main, stdIn, stdOut);
}
exports.Main = Main;
function CancelIn(msFromNow) {
    return core.Cancel.In(msFromNow);
}
exports.CancelIn = CancelIn;
