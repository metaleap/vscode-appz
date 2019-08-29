import * as node_fs from 'fs';
import * as ts from 'typescript';
import * as vs from 'vscode'

import * as gen_golang from './gen-golang'
import * as gen_csharp from './gen-golang'



const println = console.log
const filePathDts = 'node_modules/@types/vscode/index.d.ts'

export interface IGen {
    outFilePath: string
    gen: () => void
}

const gens: IGen[] = [
    new gen_golang.Gen('libs/golang/generated.go'),
    new gen_csharp.Gen('libs/csharp/generated.cs'),
]

type genApiMember = { [_: string]: genApiMembers }
type genApiMembers = (string | genApiMember)[]

const genApiSurface: genApiMember = {
    'vscode': [
        {
            'window': [
                'showErrorMessage',
                'showInformationMessage',
                'showWarningMessage'
            ]
        }
    ]
}

let _curmod: [string, ts.ModuleBody]

function main() {
    const dtsfile = ts.createSourceFile(filePathDts, node_fs.readFileSync(filePathDts).toString(), ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS)

    for (const modulename in genApiSurface) {
        let md: ts.ModuleDeclaration = null
        dtsfile.forEachChild(astnode => {
            if ((!md) && (md = astnode as ts.ModuleDeclaration) && (md.name.text !== modulename))
                md = null
        })
        if (md) {
            _curmod = [modulename, md.body]
            gatherAll(md.body, genApiSurface[modulename], modulename)
        }
    }
}

function gatherAll(astNode: ts.Node, childItems: genApiMembers, ...prefixes: string[]) {
    for (var item of childItems)
        if (typeof item !== 'string') {
            for (var subns in item) {
                var ns: ts.NamespaceDeclaration = undefined
                astNode.forEachChild(n => {
                    if ((!ns) && (ns = n as ts.NamespaceDeclaration)
                        && (!(ns.name && ns.name.text === subns)))
                        ns = undefined
                })
                if (!ns)
                    throw ("GONE FROM API:\tnamespace `" + prefixes.join('.') + '.' + subns + '`')
                else
                    gatherAll(ns.body, item[subns], ...prefixes.concat(subns))
            }
        } else {
            var members: ts.Node[] = []
            astNode.forEachChild(n => {
                var decl: ts.DeclarationStatement
                if ((decl = n as ts.DeclarationStatement) && decl.name && decl.name.text === item)
                    members.push(n)
            })
            if (!members.length)
                throw ("GONE FROM API:\texport named `" + prefixes.join('.') + '.' + item + '`')
            else
                for (let i = 0; i < members.length; i++) {
                    const member = members[i]
                    switch (member.kind) {
                        case ts.SyntaxKind.FunctionDeclaration:
                            gatherFunc(member as ts.FunctionDeclaration, (members.length === 1) ? 0 : (i + 1), ...prefixes)
                            break
                        case ts.SyntaxKind.InterfaceDeclaration:
                            gatherStruct(member as ts.InterfaceDeclaration, ...prefixes)
                            break
                        default:
                            throw (member.kind)
                    }
                }
        }
}

const
    genAllFuncs: {
        qName: string[]
        overload: number
        decl: ts.FunctionDeclaration
    }[] = [],
    genAllStructs: {
        qName: string[]
        decl: ts.InterfaceDeclaration
    }[] = []

function gatherFunc(decl: ts.FunctionDeclaration, overload: number, ...prefixes: string[]) {
    genAllFuncs.push({ qName: prefixes.concat(decl.name.text), overload: overload, decl: decl })
    println(decl.name.text)
    decl.parameters.forEach(param => gatherFrom(param.type))
    gatherFrom(decl.type)
}

function gatherFrom(typeNode: ts.TypeNode) {
    switch (typeNode.kind) {
        case ts.SyntaxKind.ArrayType:
            gatherFrom((typeNode as ts.ArrayTypeNode).elementType)
            break
        case ts.SyntaxKind.TypeReference:
            const tref = typeNode as ts.TypeReferenceNode,
                tname = tref.typeName.getText()
            if (tname != 'Thenable') {
                println(tref.flags + "\t" + (tref.typeArguments ? tref.typeArguments.length : -1))
                gatherAll(_curmod[1], [tname], _curmod[0])
            }
            break
        case ts.SyntaxKind.StringKeyword:
            break
        default:
            throw (typeNode.kind)
    }
}

function gatherStruct(decl: ts.InterfaceDeclaration, ...prefixes: string[]) {
    println("GENSTRUCT:\t" + prefixes.concat(decl.name.text).join('~'))
    genAllStructs.push({ qName: prefixes.concat(decl.name.text), decl: decl })
}





main()
