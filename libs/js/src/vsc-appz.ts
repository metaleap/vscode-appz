import * as core from './core'
import * as vscgen from './vscode.gen'


export let OnError = (_this: vscgen.Vscode, err: any, jsonMsg?: any): void => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n")
}

export function Vsc(stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream): vscgen.Vscode {
    return new core.impl(stdIn, stdOut)
}

export function CancelIn(msFromNow: number) {
    return core.Cancel.In(msFromNow)
}
