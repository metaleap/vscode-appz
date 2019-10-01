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
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showErrorMessage(arg_message, ...arg_items), ctoks];
                }
                case "showErrorMessage2": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showErrorMessage(arg_message, arg_options, ...arg_items), ctoks];
                }
                case "showErrorMessage3": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showErrorMessage(arg_message, ...arg_items), ctoks];
                }
                case "showErrorMessage4": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showErrorMessage(arg_message, arg_options, ...arg_items), ctoks];
                }
                case "showInformationMessage1": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showInformationMessage(arg_message, ...arg_items), ctoks];
                }
                case "showInformationMessage2": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showInformationMessage(arg_message, arg_options, ...arg_items), ctoks];
                }
                case "showInformationMessage3": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showInformationMessage(arg_message, ...arg_items), ctoks];
                }
                case "showInformationMessage4": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showInformationMessage(arg_message, arg_options, ...arg_items), ctoks];
                }
                case "showWarningMessage1": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showWarningMessage(arg_message, ...arg_items), ctoks];
                }
                case "showWarningMessage2": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showWarningMessage(arg_message, arg_options, ...arg_items), ctoks];
                }
                case "showWarningMessage3": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showWarningMessage(arg_message, ...arg_items), ctoks];
                }
                case "showWarningMessage4": {
                    let ctoks = undefined;
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    return [vscode.window.showWarningMessage(arg_message, arg_options, ...arg_items), ctoks];
                }
                case "showInputBox": {
                    let ctoks = undefined;
                    const arg_options = (msg.data['options']);
                    if (arg_options.validateInput_AppzFuncId && arg_options.validateInput_AppzFuncId.length)
                        arg_options.validateInput = (a0) => proc.callBack(arg_options.validateInput_AppzFuncId, a0);
                    const arg_token = proc.canceller(msg.data['token']);
                    if (arg_token) {
                        if (ctoks === undefined)
                            ctoks = [];
                        ctoks.push(msg.data['token']);
                    }
                    return [vscode.window.showInputBox(arg_options, arg_token), ctoks];
                }
                default:
                    throw (methodname);
            }
        default:
            throw (apiname);
    }
}
exports.handle = handle;
