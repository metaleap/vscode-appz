"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const noOp = (_) => { };
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
                    if (arg_options && arg_options.validateInput_AppzFuncId && arg_options.validateInput_AppzFuncId.length)
                        arg_options.validateInput = (a0) => prog.callBack(true, arg_options.validateInput_AppzFuncId, a0);
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
                    if (arg_options && arg_options.onDidSelectItem_AppzFuncId && arg_options.onDidSelectItem_AppzFuncId.length)
                        arg_options.onDidSelectItem = (a0) => prog.callBack(true, arg_options.onDidSelectItem_AppzFuncId, a0);
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
                    if (arg_options && arg_options.onDidSelectItem_AppzFuncId && arg_options.onDidSelectItem_AppzFuncId.length)
                        arg_options.onDidSelectItem = (a0) => prog.callBack(true, arg_options.onDidSelectItem_AppzFuncId, a0);
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
                    if (arg_options && arg_options.onDidSelectItem_AppzFuncId && arg_options.onDidSelectItem_AppzFuncId.length)
                        arg_options.onDidSelectItem = (a0) => prog.callBack(true, arg_options.onDidSelectItem_AppzFuncId, a0);
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
                    if (arg_options && arg_options.onDidSelectItem_AppzFuncId && arg_options.onDidSelectItem_AppzFuncId.length)
                        arg_options.onDidSelectItem = (a0) => prog.callBack(true, arg_options.onDidSelectItem_AppzFuncId, a0);
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
                    const _fnid_listener = msg.data['listener'];
                    return (!(_fnid_listener && _fnid_listener.length))
                        ? Promise.reject(msg.data)
                        : vscode.window.onDidChangeWindowState((a0) => {
                            if (prog && prog.proc)
                                prog.callBack(false, _fnid_listener, a0).then(noOp, noOp);
                        });
                }
                default:
                    throw (methodname);
            }
        case "env":
            switch (methodname) {
                case "openExternal": {
                    let arg_target;
                    try {
                        arg_target = vscode.Uri.parse(msg.data['target'], true);
                    }
                    catch (_) {
                        try {
                            arg_target = vscode.Uri.file(msg.data['target']);
                        }
                        catch (_) {
                            try {
                                arg_target = vscode.Uri.parse(msg.data['target'], false);
                            }
                            catch (_) {
                                return Promise.reject(msg.data['target']);
                            }
                        }
                    }
                    return vscode.env.openExternal(arg_target);
                }
                case "appName": {
                    return Promise.resolve(vscode.env.appName);
                }
                case "appRoot": {
                    return Promise.resolve(vscode.env.appRoot);
                }
                case "language": {
                    return Promise.resolve(vscode.env.language);
                }
                case "machineId": {
                    return Promise.resolve(vscode.env.machineId);
                }
                case "remoteName": {
                    return Promise.resolve(vscode.env.remoteName);
                }
                case "sessionId": {
                    return Promise.resolve(vscode.env.sessionId);
                }
                case "shell": {
                    return Promise.resolve(vscode.env.shell);
                }
                case "uriScheme": {
                    return Promise.resolve(vscode.env.uriScheme);
                }
                case "Properties": {
                    return Promise.resolve({
                        appName: vscode.env.appName,
                        appRoot: vscode.env.appRoot,
                        language: vscode.env.language,
                        machineId: vscode.env.machineId,
                        remoteName: vscode.env.remoteName,
                        sessionId: vscode.env.sessionId,
                        shell: vscode.env.shell,
                        uriScheme: vscode.env.uriScheme,
                    });
                }
                default:
                    throw (methodname);
            }
        case "workspace":
            switch (methodname) {
                case "name": {
                    return Promise.resolve(vscode.workspace.name);
                }
                case "saveAll": {
                    const arg_includeUntitled = (msg.data['includeUntitled']);
                    return vscode.workspace.saveAll(arg_includeUntitled);
                }
                case "onDidChangeWorkspaceFolders": {
                    const _fnid_listener = msg.data['listener'];
                    return (!(_fnid_listener && _fnid_listener.length))
                        ? Promise.reject(msg.data)
                        : vscode.workspace.onDidChangeWorkspaceFolders((a0) => {
                            if (prog && prog.proc)
                                prog.callBack(false, _fnid_listener, a0).then(noOp, noOp);
                        });
                }
                default:
                    throw (methodname);
            }
        case "languages":
            switch (methodname) {
                case "getLanguages": {
                    return vscode.languages.getLanguages();
                }
                case "onDidChangeDiagnostics": {
                    const _fnid_listener = msg.data['listener'];
                    return (!(_fnid_listener && _fnid_listener.length))
                        ? Promise.reject(msg.data)
                        : vscode.languages.onDidChangeDiagnostics((a0) => {
                            if (prog && prog.proc)
                                prog.callBack(false, _fnid_listener, a0).then(noOp, noOp);
                        });
                }
                default:
                    throw (methodname);
            }
        case "extensions":
            switch (methodname) {
                case "onDidChange": {
                    const _fnid_listener = msg.data['listener'];
                    return (!(_fnid_listener && _fnid_listener.length))
                        ? Promise.reject(msg.data)
                        : vscode.extensions.onDidChange(() => {
                            if (prog && prog.proc)
                                prog.callBack(false, _fnid_listener).then(noOp, noOp);
                        });
                }
                default:
                    throw (methodname);
            }
        case "commands":
            switch (methodname) {
                case "getCommands": {
                    const arg_filterInternal = (msg.data['filterInternal']);
                    return vscode.commands.getCommands(arg_filterInternal);
                }
                default:
                    throw (methodname);
            }
        default:
            throw (apiname);
    }
}
exports.handle = handle;
