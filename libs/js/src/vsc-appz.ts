import * as aux from './aux'
import * as vscgen from './vscode'


export let OnError = (_this: vscgen.Vscode, err: any, jsonMsg?: any): void => {
    process.stderr.write("err:\t" + err + "\njson:\t"
        + ((typeof jsonMsg === 'string') ? jsonMsg : JSON.stringify(jsonMsg))
        + "\n\n")
}

export function Vsc(stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream): vscgen.Vscode {
    return new aux.impl(stdIn, stdOut)
}
