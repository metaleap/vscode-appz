/// <reference types="node" />
import * as vscgen from './vscode.gen';
export declare let OnError: (_this: vscgen.Vscode, err: any, jsonMsg?: any) => void;
export declare function Vsc(stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream): vscgen.Vscode;
