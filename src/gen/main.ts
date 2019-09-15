import * as node_fs from 'fs'
import * as ts from 'typescript'

import * as gen from './gen-basics'
import * as gen_ast from './gen-ast'
import * as gen_golang from './gen-golang'
import * as gen_csharp from './gen-csharp'
import * as gen_python from './gen-python'
import * as gen_vscext from './gen-vscext'



const filePathDts = 'node_modules/@types/vscode/index.d.ts'

const gens: gen.IGen[] = [
    new gen_ast.Gen('libs/tmpdbg/', '.gen.tmpdbg'),
    new gen_golang.Gen('libs/go/', '.gen.go'),
    new gen_csharp.Gen('libs/cs/', '.gen.cs'),
    new gen_python.Gen('libs/py/', '.gen.py'),
    new gen_vscext.Gen('src/', '.gen.ts'),
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
            ],
        },
    ],
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
            const job: gen.GenJob = {
                fromOrig: md, moduleName: modulename, enums: [], structs: [], funcs: [], namespaces: {}
            }
            gatherAll(job, md.body, genApiSurface[modulename], modulename)
            const prep = new gen.Prep(job)
            for (const gen of gens)
                gen.gen(prep)
        }
    }
}

function gatherAll(into: gen.GenJob, astNode: ts.Node, childItems: genApiMembers, ...prefixes: string[]) {
    for (const item of childItems)
        if (typeof item !== 'string') {
            for (const subns in item) {
                let ns: ts.NamespaceDeclaration = undefined
                astNode.forEachChild(n => {
                    if ((!ns) && (ns = n as ts.NamespaceDeclaration)
                        && (!(ns.name && ns.name.text === subns)))
                        ns = undefined
                })
                if (!ns)
                    throw ("GONE FROM API:\tnamespace `" + prefixes.join('.') + '.' + subns + '`')
                else {
                    into.namespaces[subns] = ns
                    gatherAll(into, ns.body, item[subns], ...prefixes.concat(subns))
                }
            }
        } else {
            const members: ts.Node[] = []
            astNode.forEachChild(n => {
                const decl = n as ts.DeclarationStatement
                if (decl && decl.name && decl.name.text === item)
                    members.push(n)
            })
            if (!members.length)
                throw ("GONE FROM API:\texport named `" + prefixes.join('.') + '.' + item + '`')
            else
                for (let i = 0; i < members.length; i++)
                    gatherMember(into, members[i], (members.length === 1) ? 0 : (i + 1), ...prefixes)
        }
}

function gatherMember(into: gen.GenJob, member: ts.Node, overload: number, ...prefixes: string[]) {
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
            throw (member.kind + '\t' + member.getText())
    }
}

function gatherFrom(into: gen.GenJob, typeNode: ts.TypeNode, typeParams: ts.NodeArray<ts.TypeParameterDeclaration> = undefined) {
    switch (typeNode.kind) {
        case ts.SyntaxKind.ArrayType:
            gatherFrom(into, (typeNode as ts.ArrayTypeNode).elementType, typeParams)
            break
        case ts.SyntaxKind.TupleType:
            (typeNode as ts.TupleTypeNode).elementTypes.forEach(_ => gatherFrom(into, _, typeParams))
            break
        case ts.SyntaxKind.UnionType:
            (typeNode as ts.UnionTypeNode).types.forEach(_ => gatherFrom(into, _, typeParams))
            break
        case ts.SyntaxKind.TypeReference:
            const tref = typeNode as ts.TypeReferenceNode,
                tname = tref.typeName.getText()
            const tparam = (!typeParams) ? null : typeParams.find(_ => _.name.getText() === tname)
            if (tparam) {
                const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam)
                if (tnode)
                    gatherAll(into, into.fromOrig.body, [tnode.getText()], into.moduleName)
            } else if (tname === 'Thenable')
                tref.typeArguments.forEach(_ => gatherFrom(into, _, typeParams))
            else if (tname !== 'CancellationToken')
                gatherAll(into, into.fromOrig.body, [tname], into.moduleName)
            break
        default:
            if (![ts.SyntaxKind.AnyKeyword, ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(typeNode.kind))
                throw (typeNode.kind + '\t' + typeNode.getText())
    }
}

function gatherFunc(into: gen.GenJob, decl: ts.FunctionDeclaration, overload: number, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.text).join('.')
    if (into.funcs.some(_ => _.qName === qname && _.overload === overload))
        return
    into.funcs.push({ qName: qname, overload: overload, decl: decl, ifaceNs: into.namespaces[prefixes.slice(1).join('.')] })
    decl.parameters.forEach(_ => gatherFrom(into, _.type, decl.typeParameters))
    gatherFrom(into, decl.type, decl.typeParameters)
}

function gatherEnum(into: gen.GenJob, decl: ts.EnumDeclaration, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.text).join('.')
    if (!into.enums.some(_ => _.qName === qname))
        into.enums.push({ qName: qname, decl: decl })
}

function gatherStruct(into: gen.GenJob, decl: ts.InterfaceDeclaration, ...prefixes: string[]) {
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
            case ts.SyntaxKind.CallSignature:
                const sig = member as ts.CallSignatureDeclaration
                gatherFrom(into, sig.type, sig.typeParameters)
                sig.parameters.forEach(_ => gatherFrom(into, _.type, sig.typeParameters))
                break
            default:
                throw (member.kind + '\t' + member.getText())
        }
    })
}





main()
