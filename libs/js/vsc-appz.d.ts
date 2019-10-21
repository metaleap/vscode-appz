/// <reference types="node" />
import * as core from './core';
import * as vscgen from './vscode.gen';
/**
 * OnError Shows a selection list allowing multiple selections.

 * @param _this An array of strings, or a promise that resolves to an array of strings.
 * @param err Configures the behavior of the selection list.
 * @param jsonMsg A token that can be used to signal cancellation.
 */
export declare let OnError: (_this: vscgen.Vscode, err: any, jsonMsg?: any) => void;
/**
 * Main Shows a selection list allowing multiple selections.

 * @param main An array of strings, or a promise that resolves to an array of strings.
 * @param stdIn Configures the behavior of the selection list.
 * @param stdOut A token that can be used to signal cancellation.
 * @return A promise that resolves to the selected items or `undefined`.
 */
export declare function Main(main: (_: vscgen.Vscode) => void, stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream): void;
/**
 * CancelIn Shows a selection list allowing multiple selections.

 * @param msFromNow An array of strings, or a promise that resolves to an array of strings.
 */
export declare function CancelIn(msFromNow: number): core.Cancel;
