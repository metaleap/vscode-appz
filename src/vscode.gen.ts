// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-vscext.ts via github.com/metaleap/vscode-appz/src/gen/main.ts

import * as vscode from 'vscode'

import * as ipc from './ipcprotocol'

type MessageOptions = vscode.MessageOptions
interface MessageItem extends vscode.MessageItem {
	myTag?: any
}
type InputBoxOptions = vscode.InputBoxOptions

export function handle(msg: ipc.MsgFromApp): Thenable<any> {
	switch (msg.ns) {
		case "window":
			switch (msg.name) {
				case "showErrorMessage1":
					return vscode.window.showErrorMessage((msg.payload['message']) as string, ...(msg.payload['items'] || []) as string[], )
				case "showErrorMessage2":
					return vscode.window.showErrorMessage((msg.payload['message']) as string, (msg.payload['options']) as MessageOptions, ...(msg.payload['items'] || []) as string[], )
				case "showErrorMessage3":
					return vscode.window.showErrorMessage((msg.payload['message']) as string, ...(msg.payload['items'] || []) as MessageItem[], )
				case "showErrorMessage4":
					return vscode.window.showErrorMessage((msg.payload['message']) as string, (msg.payload['options']) as MessageOptions, ...(msg.payload['items'] || []) as MessageItem[], )
				case "showInformationMessage1":
					return vscode.window.showInformationMessage((msg.payload['message']) as string, ...(msg.payload['items'] || []) as string[], )
				case "showInformationMessage2":
					return vscode.window.showInformationMessage((msg.payload['message']) as string, (msg.payload['options']) as MessageOptions, ...(msg.payload['items'] || []) as string[], )
				case "showInformationMessage3":
					return vscode.window.showInformationMessage((msg.payload['message']) as string, ...(msg.payload['items'] || []) as MessageItem[], )
				case "showInformationMessage4":
					return vscode.window.showInformationMessage((msg.payload['message']) as string, (msg.payload['options']) as MessageOptions, ...(msg.payload['items'] || []) as MessageItem[], )
				case "showWarningMessage1":
					return vscode.window.showWarningMessage((msg.payload['message']) as string, ...(msg.payload['items'] || []) as string[], )
				case "showWarningMessage2":
					return vscode.window.showWarningMessage((msg.payload['message']) as string, (msg.payload['options']) as MessageOptions, ...(msg.payload['items'] || []) as string[], )
				case "showWarningMessage3":
					return vscode.window.showWarningMessage((msg.payload['message']) as string, ...(msg.payload['items'] || []) as MessageItem[], )
				case "showWarningMessage4":
					return vscode.window.showWarningMessage((msg.payload['message']) as string, (msg.payload['options']) as MessageOptions, ...(msg.payload['items'] || []) as MessageItem[], )
				case "showInputBox":
					return vscode.window.showInputBox((msg.payload['options']) as InputBoxOptions, )
				default:
					throw (msg.name)
			}
		default:
			throw (msg.ns)
	}
}

