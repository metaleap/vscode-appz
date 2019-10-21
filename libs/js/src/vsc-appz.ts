import * as core from './core'
import * as vscgen from './vscode.gen'


/**
 * OnError Shows a selection list allowing multiple selections.

 * @param _this An array of strings, or a promise that resolves to an array of strings.
 * @param err Configures the behavior of the selection list.
 * @param jsonMsg A token that can be used to signal cancellation.
 */
export let OnError = (_this: vscgen.Vscode, err: any, jsonMsg?: any): void => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n")
}

/**
 * Main Shows a selection list allowing multiple selections.

 * @param main An array of strings, or a promise that resolves to an array of strings.
 * @param stdIn Configures the behavior of the selection list.
 * @param stdOut A token that can be used to signal cancellation.
 * @return A promise that resolves to the selected items or `undefined`.
 */
export function Main(main: (_: vscgen.Vscode) => void, stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream) {
    new core.impl(main, stdIn, stdOut)
}

/**
 * CancelIn Shows a selection list allowing multiple selections.

 * @param msFromNow An array of strings, or a promise that resolves to an array of strings.
 */
export function CancelIn(msFromNow: number) {
    return core.Cancel.In(msFromNow)
}
