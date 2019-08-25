import * as node_fs from 'fs';
import * as ts from 'typescript';

const println = console.log
const filePathDts = "node_modules/@types/vscode/index.d.ts"
const genApiSurface = {
    "vscode": [
        "MessageOptions",
        "DoesntExist",
        "InputBoxOptions",
        "doesntExist",
        {
            "window": [
                "showErrorMessage",
                "showInformationMessage",
                "showWarningMessage"
            ]
        }
    ]
}

main()

function main() {
    const o = console.log
    const dtsfile = ts.createSourceFile(filePathDts, node_fs.readFileSync(filePathDts).toString(), ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS)

    for (const modulename in genApiSurface) {
        let nmod: ts.ModuleDeclaration = null
        dtsfile.forEachChild(astnode => {
            if ((!nmod) && (nmod = astnode as ts.ModuleDeclaration) && (nmod.name.text !== modulename))
                nmod = null
        })
        if (nmod)
            genMembers(modulename, nmod)
    }
}

function genMembers(prefix: string, parent: ts.Node) {

}
