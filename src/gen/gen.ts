import * as node_fs from 'fs'
import * as ts from 'typescript'

import * as gen_shared from './gen-shared'
import * as gen_golang from './gen-golang'
import * as gen_csharp from './gen-csharp'
import * as gen_python from './gen-python'



const filePathDts = 'node_modules/@types/vscode/index.d.ts'

const gens: gen_shared.IGen[] = [
    new gen_golang.Gen('libs/golang/', '.gen.go'),
    new gen_csharp.Gen('libs/csharp/', '.gen.cs'),
    new gen_python.Gen('libs/csharp/', '.gen.py'),
]

type genApiMember = { [_: string]: genApiMembers }
type genApiMembers = (string | genApiMember)[]

const genApiSurface: genApiMember = {
    'vscode': [
        {
            'window': [
                'showErrorMessage',
                'showInformationMessage',
                'showWarningMessage',
                'showInputBox',
            ]
        }
    ]
}

function main() {
    const dtsfile = ts.createSourceFile(filePathDts, node_fs.readFileSync(filePathDts).toString(), ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS)

    for (const modulename in genApiSurface) {
        let md: ts.ModuleDeclaration = null
        dtsfile.forEachChild(astnode => {
            if ((!md) && (md = astnode as ts.ModuleDeclaration) && (md.name.text !== modulename))
                md = null
        })
        if (!md)
            throw ("GONE FROM API:\tmodule `" + modulename + '`')
        else {
            const job: gen_shared.GenJob = {
                module: [modulename, md.body], enums: [], structs: [], funcs: []
            }
            gatherAll(job, md.body, genApiSurface[modulename], modulename)
            for (const gen of gens)
                gen.gen(job)
        }
    }
}

function gatherAll(into: gen_shared.GenJob, astNode: ts.Node, childItems: genApiMembers, ...prefixes: string[]) {
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
                    gatherAll(into, ns.body, item[subns], ...prefixes.concat(subns))
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
                for (let i = 0; i < members.length; i++)
                    gatherMember(into, members[i], (members.length === 1) ? 0 : (i + 1), ...prefixes)
        }
}

function gatherMember(into: gen_shared.GenJob, member: ts.Node, overload: number, ...prefixes: string[]) {
    switch (member.kind) {
        case ts.SyntaxKind.EnumDeclaration:
            gatherEnum(into, member as ts.EnumDeclaration, ...prefixes)
            break
        case ts.SyntaxKind.FunctionDeclaration:
            gatherFunc(into, member as ts.FunctionDeclaration, overload, ...prefixes)
            break
        case ts.SyntaxKind.InterfaceDeclaration:
            gatherStruct(into, member as ts.InterfaceDeclaration, ...prefixes)
            break
        case ts.SyntaxKind.TupleType:
            (member as ts.TupleTypeNode).elementTypes.forEach(_ => gatherFrom(into, _))
            break
        default:
            throw (member.kind)
    }
}

function gatherFrom(into: gen_shared.GenJob, typeNode: ts.TypeNode, typeParams: ts.NodeArray<ts.TypeParameterDeclaration> = undefined) {
    switch (typeNode.kind) {
        case ts.SyntaxKind.ArrayType:
            gatherFrom(into, (typeNode as ts.ArrayTypeNode).elementType, typeParams)
            break
        case ts.SyntaxKind.TypeReference:
            const tref = typeNode as ts.TypeReferenceNode,
                tname = tref.typeName.getText()
            const tparam = (!typeParams) ? null : typeParams.find(_ => _.name.getText() === tname)
            if (tparam) {
                const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam)
                if (tnode)
                    gatherAll(into, into.module[1], [tnode.getText()], into.module[0])
            } else if (tname !== 'Thenable' && tname !== 'CancellationToken')
                gatherAll(into, into.module[1], [tname], into.module[0])
            break
        case ts.SyntaxKind.TupleType:
            (typeNode as ts.TupleTypeNode).elementTypes.forEach(_ => gatherFrom(into, _, typeParams))
            break
        case ts.SyntaxKind.UnionType:
            (typeNode as ts.UnionTypeNode).types.forEach(_ => gatherFrom(into, _, typeParams))
            break
        default:
            if (![ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(typeNode.kind))
                throw (typeNode.kind)
    }
}

function gatherFunc(into: gen_shared.GenJob, decl: ts.FunctionDeclaration, overload: number, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.text).join('.')
    if (into.funcs.some(_ => _.qName === qname && _.overload === overload))
        return
    into.funcs.push({ qName: qname, overload: overload, decl: decl })
    decl.parameters.forEach(_ => gatherFrom(into, _.type, decl.typeParameters))
    gatherFrom(into, decl.type, decl.typeParameters)
}

function gatherEnum(into: gen_shared.GenJob, decl: ts.EnumDeclaration, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.text).join('.')
    if (!into.enums.some(_ => _.qName === qname))
        into.enums.push({ qName: qname, decl: decl })
}

function gatherStruct(into: gen_shared.GenJob, decl: ts.InterfaceDeclaration, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.text).join('.')
    if (into.structs.some(_ => _.qName === qname))
        return

    into.structs.push({ qName: qname, decl: decl })
    decl.members.forEach(member => {
        switch (member.kind) {
            case ts.SyntaxKind.PropertySignature:
                const prop = member as ts.PropertySignature
                gatherFrom(into, prop.type)
                break
            case ts.SyntaxKind.MethodSignature:
                const method = member as ts.MethodSignature
                gatherFrom(into, method.type, method.typeParameters)
                method.parameters.forEach(_ => gatherFrom(into, _.type, method.typeParameters))
                break
            default:
                throw (member.kind)
        }
    })
}





main()
