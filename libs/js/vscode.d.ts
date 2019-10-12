import * as vsc from './basics';
export interface Vscode {
    readonly window: Window;
}
export interface Window {
    readonly showErrorMessage: (message: string, items: string[], then: (_: string) => void) => void;
}
declare class implBase {
    impl: impl;
    constructor(impl: impl);
    send(msg: vsc.ipcMsg, on: (_: any) => boolean): void;
}
export declare abstract class impl implements Vscode {
    window: Window;
    constructor();
    abstract send(msg: vsc.ipcMsg, on: (_: any) => boolean): void;
}
export declare class implWindow extends implBase implements Window {
    constructor(impl: impl);
    showErrorMessage(message: string, items: string[], then: (_: string) => void): void;
}
export {};
