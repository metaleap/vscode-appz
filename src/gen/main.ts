import * as node_fs from 'fs';
import * as ts from 'typescript';
import * as vs from 'vscode'

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
                "noSuchMemberHere",
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
            genMembers(md.body, genApiSurface[modulename], modulename)
    }
}

function genMembers(astNode: ts.Node, childItems: genApiMembers, ...prefixes: string[]) {
    for (var item of childItems)
        if (typeof item === 'string') {
            var member: ts.Node = undefined
            astNode.forEachChild(n => {
                if (!member) {
                    var decl: ts.DeclarationStatement
                    if ((decl = n as ts.DeclarationStatement) && decl.name && decl.name.text === item)
                        member = n
                }
            })
            if (!member)
                println("GONE FROM API:\tmember `" + prefixes.join(".") + "." + item + "`")
            else {
            }
        } else {
            const mem = item as genApiMember
            for (var key in mem) {
                var ns: ts.NamespaceDeclaration = undefined
                astNode.forEachChild(n => {
                    if ((!ns) && (ns = n as ts.NamespaceDeclaration)) {
                        if (!(ns.name && ns.name.text === key))
                            ns = undefined
                    }
                })
                if (!ns)
                    println("GONE FROM API:\tnamespace `" + prefixes.join(".") + "." + key + "`")
                else
                    genMembers(ns.body, mem[key], ...prefixes.concat(key))
            }
        }
}
