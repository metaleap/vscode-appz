/// <reference types="node" />
import * as vsc from './vscode';
declare type dict = {
    [_: string]: any;
};
export declare let OnError: (_this: vsc.Vscode, err: any, jsonMsg?: any) => void;
export declare class ipcMsg {
    qName: string;
    data: dict;
    cbId: string;
}
export declare function Vsc(stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream): vsc.Vscode;
export declare class impl extends vsc.impl {
    readln: NodeJS.ReadStream;
    jsonOut: NodeJS.WriteStream;
    counter: number;
    listening: boolean;
    cbWaiting: {
        [_: string]: (_: any) => boolean;
    };
    cbListeners: {
        [_: string]: (_: any[]) => boolean;
    };
    cbOther: {
        [_: string]: (_: any[]) => [any, boolean];
    };
    constructor(stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream);
    nextFuncId(): string;
    send(msg: ipcMsg, on: (_: any) => boolean): void;
    setupReadLn(): void;
}
export {};
