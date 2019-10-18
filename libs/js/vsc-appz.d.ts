/// <reference types="node" />
import * as core from './core';
import * as vscgen from './vscode.gen';
export declare let OnError: (_this: vscgen.Vscode, err: any, jsonMsg?: any) => void;
export declare function Main(main: (_: vscgen.Vscode) => void, stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream): void;
export declare function CancelIn(msFromNow: number): core.Cancel;
