import * as node_fs from 'fs';
import * as ts from 'typescript';

const println = console.log
const filePathDts = "node_modules/@types/vscode/index.d.ts"

type genApiMember = { [_: string]: genApiMembers }
type genApiMembers = (string | genApiMember)[]

const genApiSurface: genApiMember = {
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
    const dtsfile = ts.createSourceFile(filePathDts, node_fs.readFileSync(filePathDts).toString(), ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS)

    for (const modulename in genApiSurface) {
        let md: ts.ModuleDeclaration = null
        dtsfile.forEachChild(astnode => {
            if ((!md) && (md = astnode as ts.ModuleDeclaration) && (md.name.text !== modulename))
                md = null
        })
        if (md)
            genMembers(modulename, md, genApiSurface[modulename])
    }
}

function genMembers(prefix: string, astNode: ts.Node, childItems: genApiMembers) {
    println(prefix)
    println(123)
}
