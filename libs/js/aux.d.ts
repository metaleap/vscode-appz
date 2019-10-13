/// <reference types="node" />
import * as vscgen from './vscode.gen';
declare type dict = {
    [_: string]: any;
};
export declare class ipcMsg {
    QName: string;
    Data: dict;
    CbId: string;
    constructor(qName?: string, data?: dict, cbId?: string);
    toJSON(): {
        qName: string;
        data: dict;
        cbId: string;
    };
}
export declare class impl extends vscgen.impl {
    readln: NodeJS.ReadStream;
    jsonOut: NodeJS.WriteStream;
    counter: number;
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
    nextSub(subscriber: (_: any[]) => boolean): string;
    send(msg: ipcMsg, on?: (_: any) => boolean): void;
    setupReadLn(): void;
}
export declare class Cancel {
    impl: impl;
    fnId: string;
    static In(msFromNow: number): Cancel;
    Now(): void;
}
export declare class Disposable {
    impl: impl;
    id: string;
    subFnId: string;
    bind(impl: impl, subFnId: string): this;
    populateFrom(payload: any): boolean;
    Dispose(): void;
}
export {};