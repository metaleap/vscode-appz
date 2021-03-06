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
    main: (_: vscgen.Vscode) => void;
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
    constructor(main: (_: vscgen.Vscode) => void, stdIn?: NodeJS.ReadStream, stdOut?: NodeJS.WriteStream);
    nextFuncId(): string;
    nextSub(eitherListener: (_: any[]) => boolean, orOther: (_: any[]) => [any, boolean]): string;
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
    subFnIds: string[];
    addSub(fnId: string): void;
    bind(impl: impl, ...subFnIds: string[]): this;
    __loadFromJsonish__(payload: any): boolean;
    /**
     * Dispose requests the VSC side to forget about this object and release or destroy all resources associated with or occupied by it. All subsequent usage attempts will be rejected.
     */
    Dispose(): (_: () => void) => void;
}
export {};
