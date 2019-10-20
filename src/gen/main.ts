import * as node_fs from 'fs'
import * as ts from 'typescript'

import * as gen from './gen'
import * as gen_syn from './gen-syn'
import * as gen_golang from './gen-golang'
import * as gen_csharp from './gen-csharp'
import * as gen_python from './gen-python'
import * as gen_nodets from './gen-nodejs'
import * as gen_vscext from './gen-vscext'



const filePathDts = 'node_modules/@types/vscode/index.d.ts'

const gens: gen.IGen[] = [
    new gen_syn.Gen(['libs/tmpdbg/', '.gen.coffee']),
    new gen_golang.Gen(['libs/go/', '.gen.go'], 'demos/go-vsc-appz-demo/miscdemos.gen.go'),
    new gen_csharp.Gen(['libs/cs/', '.gen.cs'], 'demos/cs-vsc-appz-demo/miscdemos.gen.cs'),
    new gen_nodets.Gen(['libs/js/src/', '.gen.ts'], 'demos/nodejs-vsc-appz-demo/miscdemos.gen.js'),
    new gen_python.Gen(['libs/py/', '.gen.py']),
    new gen_vscext.Gen(['src/', '.gen.ts']),
]

type genApiMember = { [_: string]: genApiMembers }
type genApiMembers = (string | genApiMember)[]

const genApiSurface: genApiMember = {
    'vscode': [
        {
            'window': [
                'showInformationMessage',
                'showWarningMessage',
                'showErrorMessage',
                'showInputBox',
                'showQuickPick',
                'setStatusBarMessage',
                'showSaveDialog',
                'showOpenDialog',
                'showWorkspaceFolderPick',
                'state',
                'onDidChangeWindowState',
                'createStatusBarItem',
                'createOutputChannel',
                'createTextEditorDecorationType',
            ],
            'env': [
                'openExternal',
                'appName',
                'appRoot',
                'language',
                'machineId',
                'remoteName',
                'sessionId',
                'shell',
                'uriScheme',
                { 'clipboard': ['readText', 'writeText'] }
            ],
            'workspace': [
                'name',
                'workspaceFile',
                'saveAll',

                'onDidChangeWorkspaceFolders',
                'getWorkspaceFolder',
                'workspaceFolders',
                'findFiles',
                'asRelativePath',
            ],
            'languages': [
                'getLanguages',
                'onDidChangeDiagnostics',
            ],
            'extensions': [
                'onDidChange',
            ],
            'commands': [
                'registerCommand',
                'executeCommand',
                'getCommands',
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
            throw "GONE FROM API:\tmodule `" + modulename + '`'
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
                let ns: ts.NamespaceDeclaration, vd: ts.VariableDeclaration
                astNode.forEachChild(n => {
                    if ((!ns) && (ns = n as ts.NamespaceDeclaration)
                        && (!(ns.name && ns.name.text === subns)))
                        ns = undefined
                })
                if (!ns)
                    astNode.forEachChild(n => {
                        if ((!vd) && ts.isVariableStatement(n) && n.declarationList.declarations && n.declarationList.declarations.length)
                            for (const vardecl of n.declarationList.declarations)
                                if (vardecl.name && vardecl.name.getText() === subns) {
                                    vd = vardecl
                                    break
                                }
                    })
                if (vd)
                    gatherAll(into, vd, item[subns], ...prefixes.concat(subns))
                else if (ns) {
                    into.namespaces[prefixes.slice(1).concat(subns).join('.')] = ns
                    gatherAll(into, ns.body, item[subns], ...prefixes.concat(subns))
                } else
                    throw "GONE FROM API:\tnamespace `" + prefixes.join('.') + '.' + subns + '`'
            }
        } else {
            const members: ts.Node[] = []
            // first: search for API methods
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
            // second: search for events/props to be modeled as pretend API methods
            if (!members.length)
                astNode.forEachChild(ntop => {
                    if ((!members.length) && ntop.kind === 220 && ntop.getText().includes(item))
                        ntop.forEachChild(nsub => {
                            if ((!members.length) && nsub.getText().includes(item) && nsub.kind === ts.SyntaxKind.VariableDeclarationList)
                                nsub.forEachChild(nsubsub => {
                                    if ((!members.length) && nsubsub.getChildCount() && nsubsub.getText().includes(item) && nsubsub.kind === ts.SyntaxKind.VariableDeclaration) {
                                        const nname = nsubsub.getChildAt(0) as ts.Identifier
                                        if (nname && nname.getText() === item && nsubsub.getChildCount() > 2) {
                                            const ntype = nsubsub.getChildAt(2)
                                            const ntyperef = nsubsub.getChildAt(2) as ts.TypeReferenceNode
                                            if (ntyperef && ntyperef.typeName && ntyperef.typeName.getText() === 'Event' && ntyperef.typeArguments && ntyperef.typeArguments.length) {
                                                const n: gen.MemberEvent = nsubsub as gen.MemberEvent
                                                [n.EvtName, n.EvtArgs] = [item, ntyperef.typeArguments.filter(_ => _.kind !== ts.SyntaxKind.VoidKeyword).map(_ => _)]
                                                members.push(n)
                                            } else {
                                                const n: gen.MemberProp = nsubsub as gen.MemberProp
                                                [n.PropName, n.PropType] = [item, ntype]
                                                members.push(n)
                                            }
                                        }
                                    }
                                })
                        })
                })
            // third: faux-namespaces from property-like vars (such as `env.clipboard`)
            if ((!members.length) && ts.isVariableDeclaration(astNode) && astNode.type && ts.isTypeReferenceNode(astNode.type) && astNode.type.typeName) {
                const tname = astNode.type.typeName.getText()
                let iface: ts.InterfaceDeclaration
                const find = (_: ts.Node) => {
                    if ((!iface) && _.getText().includes(tname))
                        if (ts.isInterfaceDeclaration(_))
                            iface = _
                        else
                            _.forEachChild(find)
                }
                into.fromOrig.forEachChild(find)
                if (iface && iface.members && iface.members.length)
                    for (const mem of iface.members)
                        if (ts.isMethodSignature(mem) && mem.name.getText() === item) {
                            members.push(mem)
                            into.namespaces[prefixes.slice(1).join('.')] = iface
                        }
            }

            if (!members.length)
                throw "GONE FROM API:\texport `" + prefixes.join('.') + '.' + item + '`' + astNode.kind
            else
                for (let i = 0; i < members.length; i++)
                    if (!gen.seemsDeprecated(members[i]))
                        gatherMember(into, members[i], (members.length === 1) ? 0 : (i + 1), ...prefixes)
        }
}

function gatherMember(into: gen.GenJob, member: ts.Node, overload: number, ...prefixes: string[]) {
    const evt = member as gen.MemberEvent, prop = member as gen.MemberProp
    if (evt && evt.EvtName && evt.EvtName.length)
        gatherEvent(into, evt, ...prefixes)
    else if (prop && prop.PropName && prop.PropType)
        gatherProp(into, prop, ...prefixes)
    else
        switch (member.kind) {
            case ts.SyntaxKind.EnumDeclaration:
                gatherEnum(into, member as ts.EnumDeclaration, ...prefixes)
                break
            case ts.SyntaxKind.FunctionDeclaration:
                gatherFunc(into, member as ts.FunctionDeclaration, overload, ...prefixes)
                break
            case ts.SyntaxKind.MethodSignature:
                gatherFunc(into, member as ts.MethodSignature, 0, ...prefixes)
                break
            case ts.SyntaxKind.InterfaceDeclaration:
                gatherStruct(into, member as ts.InterfaceDeclaration, ...prefixes)
                break
            case ts.SyntaxKind.TupleType:
                (member as ts.TupleTypeNode).elementTypes.forEach(_ => gatherFromTypeNode(into, _))
                break
            case ts.SyntaxKind.ClassDeclaration:
                gatherStruct(into, member as ts.ClassDeclaration, ...prefixes)
                break
            case ts.SyntaxKind.TypeAliasDeclaration:
                const talias = member as ts.TypeAliasDeclaration
                gatherFromTypeNode(into, talias.type, talias.typeParameters)
                break
            default:
                throw member.kind + '\t' + member.getText()
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
            const tunion = it as ts.UnionTypeNode
            if (tunion && tunion.types && tunion.types.length && !tunion.types.find(_ => _.kind === ts.SyntaxKind.StringKeyword))
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
                throw lit.kind + '\t' + it.getText()
            break
        case ts.SyntaxKind.TypeReference:
            const tref = it as ts.TypeReferenceNode,
                tname = tref.typeName.getText()
            const tparam = (!typeParams) ? null : typeParams.find(_ => _.name.getText() === tname)
            if (tparam) {
                const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam)
                if (tnode)
                    gatherAll(into, into.fromOrig.body, [tnode.getText()], into.moduleName)
            } else if (tname === 'Thenable' || tname === 'ReadonlyArray')
                tref.typeArguments.forEach(_ => gatherFromTypeNode(into, _, typeParams))
            else if (tname !== 'Uri' && tname !== 'CancellationToken' && tname !== 'Disposable')
                gatherAll(into, into.fromOrig.body, [tname], into.moduleName)
            break
        case ts.SyntaxKind.FunctionType:
            const tfun = it as ts.FunctionTypeNode
            if (tfun) {
                if (tfun.type)
                    gatherFromTypeNode(into, tfun.type, gen.combine(typeParams, tfun.typeParameters))
                if (tfun.parameters)
                    tfun.parameters.forEach(_ => gatherFromTypeNode(into, _.type, typeParams))
            }
            break
        default:
            if (![ts.SyntaxKind.AnyKeyword, ts.SyntaxKind.VoidKeyword, ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(it.kind))
                throw it.kind + '\t' + it.getText()
    }
}

function gatherFunc(into: gen.GenJob, decl: ts.SignatureDeclarationBase, overload: number, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.getText()).join('.')
    if (into.funcs.some(_ => _.qName === qname && _.overload === overload))
        return
    const owner = into.namespaces[prefixes.slice(1).join('.')]
    into.funcs.push({ qName: qname, overload: overload, decl: decl, ifaceNs: owner })
    decl.parameters.filter(_ => !gen.seemsDeprecated(_)).forEach(_ =>
        gatherFromTypeNode(into, _.type, decl.typeParameters))
    gatherFromTypeNode(into, decl.type, decl.typeParameters)
}

function gatherProp(into: gen.GenJob, decl: gen.MemberProp, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.PropName).join('.')
    if (into.funcs.some(_ => _.qName === qname))
        return
    into.funcs.push({ qName: qname, overload: 0, decl: decl, ifaceNs: into.namespaces[prefixes.slice(1).join('.')] })
    if (ts.isTypeNode(decl.PropType))
        gatherFromTypeNode(into, decl.PropType)
}

function gatherEvent(into: gen.GenJob, decl: gen.MemberEvent, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.EvtName).join('.')
    if (into.funcs.some(_ => _.qName === qname))
        return
    into.funcs.push({ qName: qname, overload: 0, decl: decl, ifaceNs: into.namespaces[prefixes.slice(1).join('.')] })
    for (const _ of decl.EvtArgs)
        gatherFromTypeNode(into, _)
}

function gatherEnum(into: gen.GenJob, decl: ts.EnumDeclaration, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.text).join('.')
    if (!into.enums.some(_ => _.qName === qname))
        into.enums.push({ qName: qname, decl: decl })
}

function gatherStruct(into: gen.GenJob, decl: ts.InterfaceDeclaration | ts.ClassDeclaration, ...prefixes: string[]) {
    const qname = prefixes.concat(decl.name.text).join('.')
    if (into.structs.some(_ => _.qName === qname))
        return

    into.structs.push({ qName: qname, decl: decl })
    decl.members.forEach((member: ts.NamedDeclaration) => {
        if (!gen.seemsDeprecated(member)) {
            const memtype = member as gen.TsNodeWithType
            const memtparams = member as gen.TsNodeWithTypeParams
            const memparams = member as any as gen.TsNodeWithParams
            if (memtype && memtype.type)
                gatherFromTypeNode(into, memtype.type, memtparams ? memtparams.typeParameters : undefined)
            if (memparams && memparams.parameters && memparams.parameters.length)
                memparams.parameters.filter(_ => !gen.seemsDeprecated(_)).forEach(_ => gatherFromTypeNode(into, _.type, memtparams ? memtparams.typeParameters : undefined))
        }
    })
}





main()
