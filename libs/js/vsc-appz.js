"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("./core");
/**
 * OnError Shows a selection list allowing multiple selections.

 * @param _this An array of strings, or a promise that resolves to an array of strings.
 * @param err Configures the behavior of the selection list.
 * @param jsonMsg A token that can be used to signal cancellation.
 */
exports.OnError = (_this, err, jsonMsg) => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n");
};
/**
 * Main Shows a selection list allowing multiple selections.

 * @param main An array of strings, or a promise that resolves to an array of strings.
 * @param stdIn Configures the behavior of the selection list.
 * @param stdOut A token that can be used to signal cancellation.
 * @return A promise that resolves to the selected items or `undefined`.
 */
function Main(main, stdIn, stdOut) {
    new core.impl(main, stdIn, stdOut);
}
exports.Main = Main;
/**
 * CancelIn Shows a selection list allowing multiple selections.

 * @param msFromNow An array of strings, or a promise that resolves to an array of strings.
 */
function CancelIn(msFromNow) {
    return core.Cancel.In(msFromNow);
}
exports.CancelIn = CancelIn;
