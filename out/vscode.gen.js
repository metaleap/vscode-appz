"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function handle(msg) {
    switch (msg.ns) {
        case "window":
            switch (msg.name) {
                case "showErrorMessage1":
                    return vscode.window.showErrorMessage(msg.payload['message'], ...msg.payload['items']);
                case "showErrorMessage2":
                    return vscode.window.showErrorMessage(msg.payload['message'], msg.payload['options'], ...msg.payload['items']);
                case "showErrorMessage3":
                    return vscode.window.showErrorMessage(msg.payload['message'], ...msg.payload['items']);
                case "showErrorMessage4":
                    return vscode.window.showErrorMessage(msg.payload['message'], msg.payload['options'], ...msg.payload['items']);
                case "showInformationMessage1":
                    return vscode.window.showInformationMessage(msg.payload['message'], ...msg.payload['items']);
                case "showInformationMessage2":
                    return vscode.window.showInformationMessage(msg.payload['message'], msg.payload['options'], ...msg.payload['items']);
                case "showInformationMessage3":
                    return vscode.window.showInformationMessage(msg.payload['message'], ...msg.payload['items']);
                case "showInformationMessage4":
                    return vscode.window.showInformationMessage(msg.payload['message'], msg.payload['options'], ...msg.payload['items']);
                case "showWarningMessage1":
                    return vscode.window.showWarningMessage(msg.payload['message'], ...msg.payload['items']);
                case "showWarningMessage2":
                    return vscode.window.showWarningMessage(msg.payload['message'], msg.payload['options'], ...msg.payload['items']);
                case "showWarningMessage3":
                    return vscode.window.showWarningMessage(msg.payload['message'], ...msg.payload['items']);
                case "showWarningMessage4":
                    return vscode.window.showWarningMessage(msg.payload['message'], msg.payload['options'], ...msg.payload['items']);
                case "showInputBox":
                    return vscode.window.showInputBox(msg.payload['options']);
                default:
                    throw (msg.name);
            }
        default:
            throw (msg.ns);
    }
}
exports.handle = handle;
