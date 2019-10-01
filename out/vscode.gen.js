"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function handle(msg, proc) {
    const idxdot = msg.qName.lastIndexOf('.');
    const [apiname, methodname] = (idxdot > 0) ? [msg.qName.slice(0, idxdot), msg.qName.slice(idxdot + 1)] : ['', msg.qName];
    switch (apiname) {
        case "window":
            switch (methodname) {
                case "showErrorMessage1": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showErrorMessage(arg_message, ...arg_items);
                }
                case "showErrorMessage2": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showErrorMessage(arg_message, arg_options, ...arg_items);
                }
                case "showErrorMessage3": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showErrorMessage(arg_message, ...arg_items);
                }
                case "showErrorMessage4": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showErrorMessage(arg_message, arg_options, ...arg_items);
                }
                case "showInformationMessage1": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showInformationMessage(arg_message, ...arg_items);
                }
                case "showInformationMessage2": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showInformationMessage(arg_message, arg_options, ...arg_items);
                }
                case "showInformationMessage3": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showInformationMessage(arg_message, ...arg_items);
                }
                case "showInformationMessage4": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showInformationMessage(arg_message, arg_options, ...arg_items);
                }
                case "showWarningMessage1": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showWarningMessage(arg_message, ...arg_items);
                }
                case "showWarningMessage2": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showWarningMessage(arg_message, arg_options, ...arg_items);
                }
                case "showWarningMessage3": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showWarningMessage(arg_message, ...arg_items);
                }
                case "showWarningMessage4": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return vscode.window.showWarningMessage(arg_message, arg_options, ...arg_items);
                }
                case "showInputBox": {
                    const arg_options = (msg.data['options']);
                    if (arg_options.validateInput_AppzFuncId && arg_options.validateInput_AppzFuncId.length)
                        arg_options.validateInput = (a0) => proc.callBack(arg_options.validateInput_AppzFuncId, a0);
                    const arg_token = (msg.data['token']);
                    let ctok_token = undefined;
                    if (arg_token && arg_token.length) {
                    }
                    return vscode.window.showInputBox(arg_options, ctok_token);
                }
                default:
                    throw (methodname);
            }
        default:
            throw (apiname);
    }
}
exports.handle = handle;
