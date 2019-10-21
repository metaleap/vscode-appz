"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("./core");
/**
 * Reports problems during the ongoing forever-looping stdin/stdout communication
 * with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `null` or `undefined`.
 * Any of its args must be checked for `null`/`undefined`-ness by your `OnError` handler.
 */
exports.OnError = (_this, err, jsonMsg) => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n");
};
/**
 * Creates a `Vscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `process.stdin`, and `stdOut` defaulting to `process.stdout`), then loops forever to never `return`.

 * @param main called whenever the counterparty demands, which usually means once at startup.
 */
function Main(main, stdIn, stdOut) {
    new core.impl(main, stdIn, stdOut);
}
exports.Main = Main;
/**
 * Returns a new `Cancel` with its `Now` already scheduled to be called in `msFromNow` milliseconds.
 */
function CancelIn(msFromNow) {
    return core.Cancel.In(msFromNow);
}
exports.CancelIn = CancelIn;
