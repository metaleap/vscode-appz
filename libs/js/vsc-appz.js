"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aux = require("./aux");
exports.OnError = (_this, err, jsonMsg) => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n");
};
function Vsc(stdIn, stdOut) {
    return new aux.impl(stdIn, stdOut);
}
exports.Vsc = Vsc;
