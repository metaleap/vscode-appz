"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_path = require("path");
const vsc = require("vscode");
var Std;
(function (Std) {
    Std["workspaceFolder"] = "workspaceFolder";
    Std["workspaceFolderBasename"] = "workspaceFolderBasename";
    Std["file"] = "file";
    Std["relativeFile"] = "relativeFile";
    Std["relativeFileDirname"] = "relativeFileDirname";
    Std["fileBasename"] = "fileBasename";
    Std["fileBasenameNoExtension"] = "fileBasenameNoExtension";
    Std["fileDirname"] = "fileDirname";
    Std["fileExtname"] = "fileExtname";
    Std["cwd"] = "cwd";
    Std["lineNumber"] = "lineNumber";
    Std["selectedText"] = "selectedText";
    Std["execPath"] = "execPath";
})(Std = exports.Std || (exports.Std = {}));
function Interpolate(str, extras = undefined, pickSplitSep = undefined) {
    const idx1 = str.lastIndexOf('${');
    if (idx1 < 0)
        return Promise.resolve(str);
    const idx2 = str.indexOf('}', idx1);
    if (idx2 < 0)
        return Promise.resolve(str);
    const fromProm = (_) => _.then(ret => (ret === undefined) ? Promise.reject() : Interpolate(str.slice(0, idx1) + ret + str.slice(idx2 + 1), extras), rej => Promise.reject(rej));
    const expr = str.slice(idx1 + 2, idx2);
    let newval = "";
    if (expr.startsWith("env:"))
        newval = process.env[expr.slice("env:".length)];
    else if (expr.startsWith("config:"))
        newval = vsc.workspace.getConfiguration().get(expr.slice("config:".length));
    else if (expr.startsWith("command:"))
        return fromProm(vsc.commands.executeCommand(expr.slice("command:".length)));
    else {
        const fileordirstuff = (name) => {
            const eds = [vsc.window.activeTextEditor].concat(...vsc.window.visibleTextEditors.filter(_ => _ !== vsc.window.activeTextEditor)).filter(_ => _ ? true : false);
            if (eds && eds.length)
                for (const ed of eds)
                    if (ed && ed.document && ed.document.uri && ed.document.uri.fsPath) {
                        let wsf = vsc.workspace.workspaceFolders.find(_ => {
                            let wsfuri = _.uri ? _.uri.toString() : null;
                            if (wsfuri && !wsfuri.endsWith('/'))
                                wsfuri += '/';
                            return wsfuri && ed.document.uri.toString().startsWith(wsfuri);
                        });
                        const curfilepath = (vsc.window.activeTextEditor && vsc.window.activeTextEditor.document && vsc.window.activeTextEditor.document.uri && vsc.window.activeTextEditor.document.uri.fsPath) ? vsc.window.activeTextEditor.document.uri.fsPath : null;
                        let affix = "";
                        const idx = name.indexOf(':');
                        if (idx > 0)
                            [name, affix] = [name.slice(0, idx), name.slice(idx + 1)];
                        if (affix && affix.length) {
                            const oldwsf = wsf;
                            if (!(wsf = vsc.workspace.workspaceFolders.find(_ => _.name === affix)))
                                wsf = oldwsf;
                        }
                        if (wsf && ((!wsf.uri) || (!wsf.uri.fsPath)))
                            wsf = null;
                        if (wsf && name === Std.workspaceFolder)
                            return wsf.uri.fsPath;
                        else if (wsf && name === Std.workspaceFolderBasename)
                            return node_path.basename(wsf.uri.fsPath);
                        else if (curfilepath && name === Std.file) {
                            return curfilepath;
                        }
                        else if (curfilepath && wsf && name === Std.relativeFile)
                            return node_path.relative(wsf.uri.fsPath, curfilepath);
                        else if (curfilepath && wsf && name === Std.relativeFileDirname)
                            return node_path.relative(wsf.uri.fsPath, node_path.dirname(curfilepath));
                        else if (curfilepath && name === Std.fileBasename)
                            return node_path.basename(curfilepath);
                        else if (curfilepath && name === Std.fileBasenameNoExtension) {
                            const fpbase = node_path.basename(curfilepath);
                            const fpext = node_path.extname(fpbase);
                            return fpext ? fpbase.slice(0, fpbase.length - fpext.length) : fpbase;
                        }
                        else if (curfilepath && name === Std.fileDirname)
                            return node_path.dirname(curfilepath);
                        else if (curfilepath && name === Std.fileExtname)
                            return node_path.extname(curfilepath);
                        else if (name === Std.cwd)
                            return process.cwd();
                        else if (name === Std.lineNumber)
                            return (ed.selection.active.line + 1).toString();
                        else if (name === Std.selectedText)
                            return ed.document.getText(ed.selection);
                        else if (name === Std.execPath)
                            return process.argv0;
                    }
            return null;
        };
        if (exports.AllStdBuiltins.some(_ => expr === _ || expr.startsWith(_ + ':')))
            newval = fileordirstuff(expr);
        if (extras)
            for (const key in extras)
                if (key === expr)
                    newval = extras[key](key);
        if (!newval) {
            let pickitems = [], prompt = expr;
            const idxcolon = prompt.indexOf(':');
            if (idxcolon > 0) {
                let strpicks = prompt.slice(idxcolon + 1);
                if (strpicks && strpicks.length && strpicks.length > 1) {
                    if (pickSplitSep === undefined && strpicks[0] === strpicks[strpicks.length - 1]) {
                        pickSplitSep = strpicks[0];
                        strpicks = strpicks.slice(1, strpicks.length - 1);
                    }
                    if (pickSplitSep)
                        [prompt, pickitems] = [prompt.slice(0, idxcolon), strpicks.split(pickSplitSep)];
                }
            }
            return (pickitems && pickitems.length)
                ? fromProm(vsc.window.showQuickPick(pickitems, { ignoreFocusOut: true, placeHolder: prompt }))
                : fromProm(vsc.window.showInputBox({ ignoreFocusOut: true, prompt: prompt }));
        }
    }
    return Promise.resolve(Interpolate(str.slice(0, idx1) + newval + str.slice(idx2 + 1), extras));
}
exports.Interpolate = Interpolate;
exports.AllStdBuiltins = [
    Std.workspaceFolder.toString(),
    Std.workspaceFolderBasename.toString(),
    Std.file.toString(),
    Std.relativeFile.toString(),
    Std.relativeFileDirname.toString(),
    Std.fileBasename.toString(),
    Std.fileBasenameNoExtension.toString(),
    Std.fileDirname.toString(),
    Std.fileExtname.toString(),
    Std.cwd.toString(),
    Std.lineNumber.toString(),
    Std.selectedText.toString(),
    Std.execPath.toString(),
];
