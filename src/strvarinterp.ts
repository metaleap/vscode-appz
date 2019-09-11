import * as node_path from 'path'

import * as vsc from 'vscode'


export enum Std {
    workspaceFolder = "workspaceFolder",
    workspaceFolderBasename = "workspaceFolderBasename",
    file = "file",
    relativeFile = "relativeFile",
    relativeFileDirname = "relativeFileDirname",
    fileBasename = "fileBasename",
    fileBasenameNoExtension = "fileBasenameNoExtension",
    fileDirname = "fileDirname",
    fileExtname = "fileExtname",
    cwd = "cwd",
    lineNumber = "lineNumber",
    selectedText = "selectedText",
    execPath = "execPath",
}


export function Interpolate(str: string, extras: { [_: string]: (_: string) => string } = undefined): Thenable<string> {
    const idx1 = str.lastIndexOf('${')
    if (idx1 < 0)
        return Promise.resolve(str)
    const idx2 = str.indexOf('}', idx1)
    if (idx2 < 0)
        return Promise.resolve(str)

    const fromProm = (_: Thenable<any>) => _.then(
        (ret: any) =>
            (ret === undefined) ? Promise.reject() : Interpolate(str.slice(0, idx1) + ret + str.slice(idx2 + 1), extras),
        (err: any) =>
            Promise.reject(err)
    )
    const expr = str.slice(idx1 + 2, idx2)
    let newval = ""

    if (expr.startsWith("env:"))
        newval = process.env[expr.slice("env:".length)]

    else if (expr.startsWith("config:"))
        newval = vsc.workspace.getConfiguration().get(expr.slice("config:".length))

    else if (expr.startsWith("command:"))
        return fromProm(vsc.commands.executeCommand(expr.slice("command:".length)))

    else {
        const fileordirstuff = (name: string): string => {
            const eds = [vsc.window.activeTextEditor].concat(...vsc.window.visibleTextEditors.filter(_ => _ !== vsc.window.activeTextEditor)).filter(_ => _ ? true : false)
            if (eds && eds.length)
                for (const ed of eds)
                    if (ed && ed.document && ed.document.uri && ed.document.uri.fsPath) {
                        let wsf = vsc.workspace.workspaceFolders.find(_ => {
                            let wsfuri = _.uri ? _.uri.toString() : null
                            if (wsfuri && !wsfuri.endsWith('/')) wsfuri += '/'
                            return wsfuri && ed.document.uri.toString().startsWith(wsfuri)
                        })
                        const curfilepath = (vsc.window.activeTextEditor && vsc.window.activeTextEditor.document && vsc.window.activeTextEditor.document.uri && vsc.window.activeTextEditor.document.uri.fsPath) ? vsc.window.activeTextEditor.document.uri.fsPath : null

                        let affix = ""
                        const idx = name.indexOf(':')
                        if (idx > 0)
                            [name, affix] = [name.slice(0, idx), name.slice(idx + 1)]
                        if (affix && affix.length) {
                            const oldwsf = wsf
                            if (!(wsf = vsc.workspace.workspaceFolders.find(_ => _.name === affix)))
                                wsf = oldwsf
                        }

                        if (wsf && ((!wsf.uri) || (!wsf.uri.fsPath)))
                            wsf = null

                        if (wsf && name === Std.workspaceFolder)
                            return wsf.uri.fsPath
                        else if (wsf && name === Std.workspaceFolderBasename)
                            return node_path.basename(wsf.uri.fsPath)
                        else if (curfilepath && name === Std.file) {
                            return curfilepath
                        } else if (curfilepath && wsf && name === Std.relativeFile)
                            return node_path.relative(wsf.uri.fsPath, curfilepath)
                        else if (curfilepath && wsf && name === Std.relativeFileDirname)
                            return node_path.relative(wsf.uri.fsPath, node_path.dirname(curfilepath))
                        else if (curfilepath && name === Std.fileBasename)
                            return node_path.basename(curfilepath)
                        else if (curfilepath && name === Std.fileBasenameNoExtension) {
                            const fpbase = node_path.basename(curfilepath)
                            const fpext = node_path.extname(fpbase)
                            return fpext ? fpbase.slice(0, fpbase.length - fpext.length) : fpbase
                        } else if (curfilepath && name === Std.fileDirname)
                            return node_path.dirname(curfilepath)
                        else if (curfilepath && name === Std.fileExtname)
                            return node_path.extname(curfilepath)
                        else if (name === Std.cwd)
                            return process.cwd()
                        else if (name === Std.lineNumber)
                            return (ed.selection.active.line + 1).toString()
                        else if (name === Std.selectedText)
                            return ed.document.getText(ed.selection)
                        else if (name === Std.execPath)
                            return process.argv0
                    }
            return null
        }

        if (AllStdBuiltins.some(_ => expr === _ || expr.startsWith(_ + ':')))
            newval = fileordirstuff(expr)

        if (extras)
            for (const key in extras)
                if (key === expr)
                    newval = extras[key](key)

        if (!newval) {
            let items: string[] = [],
                prompt = expr
            const colon = prompt.indexOf(':')
            if (colon > 0)
                [prompt, items] = [prompt.slice(0, colon), prompt.slice(colon + 1).split('|')]
            return (items && items.length)
                ? fromProm(vsc.window.showQuickPick(items, { ignoreFocusOut: true, placeHolder: prompt }))
                : fromProm(vsc.window.showInputBox({ ignoreFocusOut: true, prompt: prompt }))
        }

    }

    return Promise.resolve<string>(Interpolate(str.slice(0, idx1) + newval + str.slice(idx2 + 1), extras))
}



export const AllStdBuiltins = [
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
]
