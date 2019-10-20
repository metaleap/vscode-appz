"use strict";
// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-vscext.ts via github.com/metaleap/vscode-appz/src/gen/main.ts
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
                case "createStatusBarItem": {
                    const arg_alignment = (msg.data['alignment']);
                    const arg_priority = (msg.data['priority']);
                    const ret = vscode.window.createStatusBarItem(arg_alignment, arg_priority);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "createOutputChannel": {
                    const arg_name = (msg.data['name']);
                    const ret = vscode.window.createOutputChannel(arg_name);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
        case "clipboard":
            switch (methodname) {
                case "readText": {
                    const ret = vscode.env.clipboard.readText();
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "writeText": {
                    const arg_value = (msg.data['value']);
                    const ret = vscode.env.clipboard.writeText(arg_value);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
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
                case "registerCommand": {
                    const arg_command = (msg.data['command']);
                    const _fnid_callback = msg.data['callback'];
                    if (!(_fnid_callback && _fnid_callback.length))
                        return Promise.reject(msg.data);
                    const arg_callback = (..._0) => {
                        if (prog && prog.proc)
                            return prog.callBack(true, _fnid_callback, _0);
                        return undefined;
                    };
                    const ret = vscode.commands.registerCommand(arg_command, arg_callback);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "executeCommand": {
                    const arg_command = (msg.data['command']);
                    const arg_rest = (msg.data['rest'] || []);
                    const ret = vscode.commands.executeCommand(arg_command, ...arg_rest);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
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
        case "StatusBarItem":
            const thisStatusBarItem = prog.objects[msg.data[""]];
            if (!thisStatusBarItem)
                throw "Called vscode.StatusBarItem." + methodname + " for an already disposed-and-forgotten instance";
            switch (methodname) {
                case "show": {
                    const ret = thisStatusBarItem.show();
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "hide": {
                    const ret = thisStatusBarItem.hide();
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "dispose": {
                    const ret = thisStatusBarItem.dispose();
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "appzObjPropsGet": {
                    return Promise.resolve({
                        alignment: thisStatusBarItem.alignment,
                        priority: thisStatusBarItem.priority,
                        text: thisStatusBarItem.text,
                        tooltip: thisStatusBarItem.tooltip,
                        color: (thisStatusBarItem.color && (thisStatusBarItem.color["id"])) ? (thisStatusBarItem.color["id"]) : thisStatusBarItem.color,
                        command: thisStatusBarItem.command,
                    });
                }
                case "appzObjPropsSet": {
                    const allUpdates = msg.data['allUpdates'];
                    if (!allUpdates)
                        return Promise.reject(msg.data);
                    const prop_text = allUpdates["text"];
                    if (prop_text !== undefined)
                        thisStatusBarItem.text = prop_text;
                    const prop_tooltip = allUpdates["tooltip"];
                    if (prop_tooltip !== undefined)
                        thisStatusBarItem.tooltip = (!(prop_tooltip && prop_tooltip.length)) ? undefined : prop_tooltip;
                    const prop_color = allUpdates["color"];
                    if (prop_color !== undefined)
                        thisStatusBarItem.color = (!(prop_color && prop_color.length)) ? undefined : prop_color.startsWith("#") ? prop_color : new vscode.ThemeColor(prop_color);
                    const prop_command = allUpdates["command"];
                    if (prop_command !== undefined)
                        thisStatusBarItem.command = (!(prop_command && prop_command.length)) ? undefined : prop_command;
                    return Promise.resolve();
                }
                default:
                    throw methodname;
            }
        case "OutputChannel":
            const thisOutputChannel = prog.objects[msg.data[""]];
            if (!thisOutputChannel)
                throw "Called vscode.OutputChannel." + methodname + " for an already disposed-and-forgotten instance";
            switch (methodname) {
                case "append": {
                    const arg_value = (msg.data['value']);
                    const ret = thisOutputChannel.append(arg_value);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "appendLine": {
                    const arg_value = (msg.data['value']);
                    const ret = thisOutputChannel.appendLine(arg_value);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "clear": {
                    const ret = thisOutputChannel.clear();
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "show": {
                    const arg_preserveFocus = (msg.data['preserveFocus']);
                    const ret = thisOutputChannel.show(arg_preserveFocus);
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "hide": {
                    const ret = thisOutputChannel.hide();
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "dispose": {
                    const ret = thisOutputChannel.dispose();
                    const retdisp = ret;
                    const retprom = ret;
                    return (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret));
                }
                case "appzObjPropsGet": {
                    return Promise.resolve({
                        name: thisOutputChannel.name,
                    });
                }
                default:
                    throw methodname;
            }
        default:
            throw (apiname);
    }
}
exports.handle = handle;
