"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ppio = require("./procspipeio");
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
                    const ret = vscode.window.showErrorMessage(arg_message, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showErrorMessage2": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showErrorMessage(arg_message, arg_options, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showErrorMessage3": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showErrorMessage(arg_message, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showErrorMessage4": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showErrorMessage(arg_message, arg_options, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showInformationMessage1": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showInformationMessage(arg_message, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showInformationMessage2": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showInformationMessage(arg_message, arg_options, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showInformationMessage3": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showInformationMessage(arg_message, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showInformationMessage4": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showInformationMessage(arg_message, arg_options, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showWarningMessage1": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showWarningMessage(arg_message, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showWarningMessage2": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showWarningMessage(arg_message, arg_options, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showWarningMessage3": {
                    const arg_message = (msg.data['message']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showWarningMessage(arg_message, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showWarningMessage4": {
                    const arg_message = (msg.data['message']);
                    const arg_options = (msg.data['options']);
                    const arg_items = (msg.data['items'] || []);
                    const ret = vscode.window.showWarningMessage(arg_message, arg_options, ...arg_items);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                    const ret = vscode.window.showInputBox(arg_options, arg_token);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                    const ret = vscode.window.showQuickPick(arg_items, arg_options, arg_token);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                    const ret = vscode.window.showQuickPick(arg_items, arg_options, arg_token);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                    const ret = vscode.window.showQuickPick(arg_items, arg_options, arg_token);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                    const ret = vscode.window.showQuickPick(arg_items, arg_options, arg_token);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "setStatusBarMessage1": {
                    const arg_text = (msg.data['text']);
                    const arg_hideAfterTimeout = (msg.data['hideAfterTimeout']);
                    const ret = vscode.window.setStatusBarMessage(arg_text, arg_hideAfterTimeout);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "setStatusBarMessage2": {
                    const arg_text = (msg.data['text']);
                    const ret = vscode.window.setStatusBarMessage(arg_text);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showSaveDialog": {
                    const arg_options = (msg.data['options']);
                    const ret = vscode.window.showSaveDialog(arg_options);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showOpenDialog": {
                    const arg_options = (msg.data['options']);
                    const ret = vscode.window.showOpenDialog(arg_options);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "showWorkspaceFolderPick": {
                    const arg_options = (msg.data['options']);
                    const ret = vscode.window.showWorkspaceFolderPick(arg_options);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                    const arg_target = ppio.tryUnmarshalUri(msg.data['target']);
                    if (!arg_target)
                        return Promise.reject(msg.data['target']);
                    const ret = vscode.env.openExternal(arg_target);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                case "workspaceFile": {
                    return Promise.resolve(vscode.workspace.workspaceFile);
                }
                case "saveAll": {
                    const arg_includeUntitled = (msg.data['includeUntitled']);
                    const ret = vscode.workspace.saveAll(arg_includeUntitled);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                case "getWorkspaceFolder": {
                    const arg_uri = ppio.tryUnmarshalUri(msg.data['uri']);
                    if (!arg_uri)
                        return Promise.reject(msg.data['uri']);
                    const ret = vscode.workspace.getWorkspaceFolder(arg_uri);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "workspaceFolders": {
                    return Promise.resolve(vscode.workspace.workspaceFolders);
                }
                case "findFiles": {
                    const arg_include = (msg.data['include']);
                    const arg_exclude = (msg.data['exclude']);
                    const arg_maxResults = (msg.data['maxResults']);
                    let ctid = msg.data['token'], arg_token = prog.cancellerToken(ctid);
                    if (!arg_token)
                        arg_token = prog.cancellers[''].token;
                    else
                        remoteCancellationTokens.push(ctid);
                    const ret = vscode.workspace.findFiles(arg_include, arg_exclude, arg_maxResults, arg_token);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "asRelativePath": {
                    const arg_pathOrUri = (msg.data['pathOrUri']);
                    const arg_includeWorkspaceFolder = (msg.data['includeWorkspaceFolder']);
                    const ret = vscode.workspace.asRelativePath(arg_pathOrUri, arg_includeWorkspaceFolder);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "Properties": {
                    return Promise.resolve({
                        name: vscode.workspace.name,
                        workspaceFile: vscode.workspace.workspaceFile,
                        workspaceFolders: vscode.workspace.workspaceFolders,
                    });
                }
                default:
                    throw (methodname);
            }
        case "languages":
            switch (methodname) {
                case "getLanguages": {
                    const ret = vscode.languages.getLanguages();
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                    const ret = vscode.commands.getCommands(arg_filterInternal);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                default:
                    throw (methodname);
            }
        default:
            throw (apiname);
    }
}
exports.handle = handle;
