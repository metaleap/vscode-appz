import { ipcMsg } from './aux';
export interface Vscode {
    readonly window: Window;
}
export interface Window {
    readonly showErrorMessage: (message: string, items: string[], then: (_: string) => void) => void;
}
export declare abstract class impl implements Vscode {
    window: Window;
    constructor();
    abstract send(msg: ipcMsg, on: (_: any) => boolean): void;
}
