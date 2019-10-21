import * as core from './core'
import * as vscgen from './vscode.gen'

/**
 * Reports problems during the ongoing forever-looping stdin/stdout communication
 * with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `null` or `undefined`.
 * Any of its args must be checked for `null`/`undefined`-ness by your `OnError` handler.
 */
export let OnError = (_this: vscgen.Vscode, err: any, jsonMsg?: any): void => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n")
}

/**
 * Creates a `Vscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `process.stdin`, and `stdOut` defaulting to `process.stdout`), then loops forever to never `return`.

 * @param main called whenever the counterparty demands, which usually means once at startup.
 */
export function Main(main: (_: vscgen.Vscode) => void, stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream) {
    new core.impl(main, stdIn, stdOut)
}

/**
 * Returns a new `Cancel` with its `Now` already scheduled to be called in `msFromNow` milliseconds.
 */
export function CancelIn(msFromNow: number) {
    return core.Cancel.In(msFromNow)
}
