import * as vsc from 'vscode'


export function Interpolate(str: string): Thenable<string> {
    const idx1 = str.lastIndexOf('${')
    if (idx1 >= 0) {
        const idx2 = str.indexOf('}', idx1)
        if (idx2 >= 0) {
            const from = (_: Thenable<any>) => _.then(
                (ret: any) =>
                    (ret === undefined) ? Promise.reject() : Interpolate(str.slice(0, idx1) + ret + str.slice(idx2 + 1)),
                (err: any) =>
                    Promise.reject(err)
            )

            const expr = str.slice(idx1 + 2, idx2)
            let newval = ""

            if (expr.startsWith("env:"))
                newval = process.env[expr.slice("env:".length)]

            else if (expr.startsWith("config:"))
                newval = vsc.workspace.getConfiguration().get(expr.slice("config:".length))

            else if (expr.startsWith("command:")) {
                return from(vsc.commands.executeCommand(expr.slice("command:".length)))

            } else if (expr.startsWith("input:")) {

            } else if (expr === "workspaceFolder" || expr.startsWith("workspaceFolder:")) {

            } else if (expr === "workspaceFolderBasename" || expr.startsWith("workspaceFolderBasename:")) {

            } else if (expr === "file" || expr.startsWith("file:")) {

            } else if (expr === "relativeFile" || expr.startsWith("relativeFile:")) {

            } else if (expr === "relativeFileDirname" || expr.startsWith("relativeFileDirname:")) {

            } else if (expr === "fileBasename" || expr.startsWith("fileBasename:")) {

            } else if (expr === "fileBasenameNoExtension" || expr.startsWith("fileBasenameNoExtension:")) {

            } else if (expr === "fileDirname" || expr.startsWith("fileDirname:")) {

            } else if (expr === "fileExtname" || expr.startsWith("fileExtname:")) {

            } else if (expr === "cwd" || expr.startsWith("cwd:")) {

            } else if (expr === "lineNumber" || expr.startsWith("lineNumber:")) {

            } else if (expr === "selectedText" || expr.startsWith("selectedText:")) {

            } else if (expr === "execPath" || expr.startsWith("execPath:")) {

            } else
                return from(vsc.window.showInputBox({ ignoreFocusOut: true, prompt: "Enter the value for `${" + expr + "}`" }))

            str = str.slice(0, idx1) + newval + str.slice(idx2 + 1)
        }
    }

    return Promise.resolve<string>(
        (str.indexOf('${') < 0) ? str : Interpolate(str)
    )
}
