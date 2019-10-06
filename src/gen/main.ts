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
    new gen_ast.Gen('libs/tmpdbg/', '.gen.coffee'),
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
                'showQuickPick',
                'setStatusBarMessage',
                'showSaveDialog',
                'showOpenDialog',
                'showWorkspaceFolderPick',
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
                if (decl && decl.name && decl.name.text === item) {
                    const declfun = decl as ts.FunctionDeclaration
                    if ((!declfun) || (!declfun.parameters) || !declfun.parameters.find(_ => {
                        const t = _.type as ts.TypeReferenceNode
                        return (t && t.typeName && t.typeName.getText() === 'Thenable')
                    }))
                        members.push(n)
                }
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
            (member as ts.TupleTypeNode).elementTypes.forEach(_ => gatherFromTypeNode(into, _))
            break
        default:
            throw (member.kind + '\t' + member.getText())
    }
}

function gatherFromTypeElem(into: gen.GenJob, it: ts.TypeElement, typeParams: ts.NodeArray<ts.TypeParameterDeclaration> = undefined) {
    if (ts.isPropertySignature(it))
        gatherFromTypeNode(into, (it as ts.PropertySignature).type, typeParams)
    else if (ts.isCallSignatureDeclaration(it) || ts.isConstructSignatureDeclaration(it) || ts.isMethodSignature(it) || ts.isIndexSignatureDeclaration(it)) {
        if (it.type)
            gatherFromTypeNode(into, it.type, (it.typeParameters && it.typeParameters.length) ? it.typeParameters : typeParams)
        for (const _ of it.parameters)
            gatherFromTypeNode(into, _.type, typeParams)
    }
}

function gatherFromTypeNode(into: gen.GenJob, it: ts.TypeNode, typeParams: ts.NodeArray<ts.TypeParameterDeclaration> = undefined) {
    switch (it.kind) {
        case ts.SyntaxKind.ArrayType:
            gatherFromTypeNode(into, (it as ts.ArrayTypeNode).elementType, typeParams)
            break
        case ts.SyntaxKind.TupleType:
            (it as ts.TupleTypeNode).elementTypes.forEach(_ => gatherFromTypeNode(into, _, typeParams))
            break
        case ts.SyntaxKind.UnionType:
            (it as ts.UnionTypeNode).types.forEach(_ => gatherFromTypeNode(into, _, typeParams))
            break
        case ts.SyntaxKind.IntersectionType:
            (it as ts.IntersectionTypeNode).types.forEach(_ => gatherFromTypeNode(into, _, typeParams))
            break
        case ts.SyntaxKind.TypeLiteral:
            (it as ts.TypeLiteralNode).members.forEach(_ => gatherFromTypeElem(into, _, typeParams))
            break
        case ts.SyntaxKind.LiteralType:
            const lit = (it as ts.LiteralTypeNode).literal
            if (![ts.SyntaxKind.AnyKeyword, ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(lit.kind))
                throw (lit.kind + '\t' + it.getText())
            break
        case ts.SyntaxKind.TypeReference:
            const tref = it as ts.TypeReferenceNode,
                tname = tref.typeName.getText()
            const tparam = (!typeParams) ? null : typeParams.find(_ => _.name.getText() === tname)
            if (tparam) {
                const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam)
                if (tnode)
                    gatherAll(into, into.fromOrig.body, [tnode.getText()], into.moduleName)
            } else if (tname === 'Thenable')
                tref.typeArguments.forEach(_ => gatherFromTypeNode(into, _, typeParams))
            else if (tname !== 'Uri' && tname !== 'CancellationToken' && tname !== 'Disposable')
                gatherAll(into, into.fromOrig.body, [tname], into.moduleName)
            break
        default:
            if (![ts.SyntaxKind.AnyKeyword, ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(it.kind))
                throw (it.kind + '\t' + it.getText())
    }
}

function gatherFunc(into: gen.GenJob, decl: ts.FunctionDeclaration, overload: number, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.text).join('.')
    if (into.funcs.some(_ => _.qName === qname && _.overload === overload))
        return
    into.funcs.push({ qName: qname, overload: overload, decl: decl, ifaceNs: into.namespaces[prefixes.slice(1).join('.')] })
    decl.parameters.forEach(_ => gatherFromTypeNode(into, _.type, decl.typeParameters))
    gatherFromTypeNode(into, decl.type, decl.typeParameters)
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
                gatherFromTypeNode(into, prop.type)
                break
            case ts.SyntaxKind.MethodSignature:
                const method = member as ts.MethodSignature
                gatherFromTypeNode(into, method.type, method.typeParameters)
                method.parameters.forEach(_ => gatherFromTypeNode(into, _.type, method.typeParameters))
                break
            case ts.SyntaxKind.CallSignature:
                const sig = member as ts.CallSignatureDeclaration
                gatherFromTypeNode(into, sig.type, sig.typeParameters)
                sig.parameters.forEach(_ => gatherFromTypeNode(into, _.type, sig.typeParameters))
                break
            default:
                throw (member.kind + '\t' + member.getText())
        }
    })
}





main()
