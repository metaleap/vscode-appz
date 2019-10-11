export interface Vscode {
    readonly window: Window
}

export interface Window {
    readonly showErrorMessage: (message: string, items: string[], then: (_: string) => void) => void
}

export class implWindow implements Window {
    showErrorMessage(_message: string, _items: string[], _then: (_: string) => void) {

    }
}
