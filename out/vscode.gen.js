"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function handle(msg, prog, remoteCancellationTokens) {
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
                        arg_options.validateInput = (a0) => prog.callBack(arg_options.validateInput_AppzFuncId, a0);
                    let ctid = msg.data['token'], arg_token = prog.cancellerToken(ctid);
                    if (!arg_token)
                        arg_token = prog.cancellers[''].token;
                    else
                        remoteCancellationTokens.push(ctid);
                    return vscode.window.showInputBox(arg_options, arg_token);
                }
                case "showQuickPick1": {
                    const arg_items = (msg.data['items']);
                    const arg_options = (msg.data['options']);
                    if (arg_options.onDidSelectItem_AppzFuncId && arg_options.onDidSelectItem_AppzFuncId.length)
                        arg_options.onDidSelectItem = (a0) => prog.callBack(arg_options.onDidSelectItem_AppzFuncId, a0);
                    let ctid = msg.data['token'], arg_token = prog.cancellerToken(ctid);
                    if (!arg_token)
                        arg_token = prog.cancellers[''].token;
                    else
                        remoteCancellationTokens.push(ctid);
                    return vscode.window.showQuickPick(arg_items, arg_options, arg_token);
                }
                case "showQuickPick2": {
                    const arg_items = (msg.data['items']);
                    const arg_options = (msg.data['options']);
                    if (arg_options.onDidSelectItem_AppzFuncId && arg_options.onDidSelectItem_AppzFuncId.length)
                        arg_options.onDidSelectItem = (a0) => prog.callBack(arg_options.onDidSelectItem_AppzFuncId, a0);
                    let ctid = msg.data['token'], arg_token = prog.cancellerToken(ctid);
                    if (!arg_token)
                        arg_token = prog.cancellers[''].token;
                    else
                        remoteCancellationTokens.push(ctid);
                    return vscode.window.showQuickPick(arg_items, arg_options, arg_token);
                }
                case "showQuickPick3": {
                    const arg_items = (msg.data['items']);
                    const arg_options = (msg.data['options']);
                    if (arg_options.onDidSelectItem_AppzFuncId && arg_options.onDidSelectItem_AppzFuncId.length)
                        arg_options.onDidSelectItem = (a0) => prog.callBack(arg_options.onDidSelectItem_AppzFuncId, a0);
                    let ctid = msg.data['token'], arg_token = prog.cancellerToken(ctid);
                    if (!arg_token)
                        arg_token = prog.cancellers[''].token;
                    else
                        remoteCancellationTokens.push(ctid);
                    return vscode.window.showQuickPick(arg_items, arg_options, arg_token);
                }
                case "showQuickPick4": {
                    const arg_items = (msg.data['items']);
                    const arg_options = (msg.data['options']);
                    if (arg_options.onDidSelectItem_AppzFuncId && arg_options.onDidSelectItem_AppzFuncId.length)
                        arg_options.onDidSelectItem = (a0) => prog.callBack(arg_options.onDidSelectItem_AppzFuncId, a0);
                    let ctid = msg.data['token'], arg_token = prog.cancellerToken(ctid);
                    if (!arg_token)
                        arg_token = prog.cancellers[''].token;
                    else
                        remoteCancellationTokens.push(ctid);
                    return vscode.window.showQuickPick(arg_items, arg_options, arg_token);
                }
                case "setStatusBarMessage1": {
                    const arg_text = (msg.data['text']);
                    const arg_hideAfterTimeout = (msg.data['hideAfterTimeout']);
                    return vscode.window.setStatusBarMessage(arg_text, arg_hideAfterTimeout);
                }
                case "setStatusBarMessage2": {
                    const arg_text = (msg.data['text']);
                    return vscode.window.setStatusBarMessage(arg_text);
                }
                case "showSaveDialog": {
                    const arg_options = (msg.data['options']);
                    return vscode.window.showSaveDialog(arg_options);
                }
                case "showOpenDialog": {
                    const arg_options = (msg.data['options']);
                    return vscode.window.showOpenDialog(arg_options);
                }
                case "showWorkspaceFolderPick": {
                    const arg_options = (msg.data['options']);
                    return vscode.window.showWorkspaceFolderPick(arg_options);
                }
                case "state": {
                    return Promise.resolve(vscode.window.state);
                }
                case "onDidChangeWindowState": {
                    return Promise.resolve(vscode.window.onDidChangeWindowState);
                }
                default:
                    throw (methodname);
            }
        default:
            throw (apiname);
    }
}
exports.handle = handle;
