/// <reference types="node" />
import * as core from './core';
import * as vscgen from './vscode.gen';
/**
 * Reports problems during the ongoing forever-looping stdin/stdout communication
 * with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `null` or `undefined`.
 * Any of its args must be checked for `null`/`undefined`-ness by your `OnError` handler.
 */
export declare let OnError: (_this: vscgen.Vscode, err: any, jsonMsg?: any) => void;
/**
 * Creates a `Vscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `process.stdin`, and `stdOut` defaulting to `process.stdout`), then loops forever to never `return`.

 * @param main called whenever the counterparty demands, which usually means once at startup.
 */
export declare function Main(main: (_: vscgen.Vscode) => void, stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream): void;
/**
 * Returns a new `Cancel` with its `Now` already scheduled to be called in `msFromNow` milliseconds.
 */
export declare function CancelIn(msFromNow: number): core.Cancel;
