"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const ts = require("typescript");
const gen = require("./gen");
const gen_syn = require("./gen-syn");
const gen_golang = require("./gen-golang");
const gen_csharp = require("./gen-csharp");
const gen_python = require("./gen-python");
const gen_nodets = require("./gen-nodejs");
const gen_vscext = require("./gen-vscext");
const filePathDts = 'node_modules/@types/vscode/index.d.ts';
const gens = [
    new gen_syn.Gen(['libs/tmpdbg/', '.gen.coffee']),
    new gen_golang.Gen(['libs/go/', '.gen.go'], 'demos/go/proper-cmd/go-vsc-appz-demo/miscdemos.gen.go'),
    new gen_csharp.Gen(['libs/cs/', '.gen.cs'], 'demos/csharp/miscdemos.gen.cs'),
    new gen_nodets.Gen(['libs/js/src/', '.gen.ts'], 'demos/nodejs/miscdemos.gen.js'),
    new gen_python.Gen(['libs/py/', '.gen.py']),
    new gen_vscext.Gen(['src/', '.gen.ts']),
];
const genApiSurface = {
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
                'createInputBox',
                'createQuickPick',
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
                'createFileSystemWatcher',
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
};
function main() {
    const dtsfile = ts.createSourceFile(filePathDts, node_fs.readFileSync(filePathDts).toString(), ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
    for (const modulename in genApiSurface) {
        let md = null;
        dtsfile.forEachChild(astnode => {
            if ((!md) && (md = astnode) && (md.name.text !== modulename))
                md = null;
        });
        if (!md)
            throw "GONE FROM API:\tmodule `" + modulename + "`";
        else {
            const job = {
                fromOrig: md, moduleName: modulename, enums: [], structs: [], funcs: [], namespaces: {}, mereBaseTypes: []
            };
            gatherAll(job, md.body, genApiSurface[modulename], modulename);
            const prep = new gen.Prep(job);
            for (const gen of gens)
                gen.gen(prep);
        }
    }
}
function gatherAll(into, astNode, childItems, ...prefixes) {
    for (const item of childItems) {
        if (typeof item !== "string") {
            for (const subns in item) {
                let ns, vd;
                astNode.forEachChild(n => {
                    if ((!ns) && (ns = n)
                        && (!(ns.name && ns.name.text === subns)))
                        ns = undefined;
                });
                if (!ns)
                    astNode.forEachChild(n => {
                        if ((!vd) && ts.isVariableStatement(n) && n.declarationList.declarations && n.declarationList.declarations.length)
                            for (const vardecl of n.declarationList.declarations)
                                if (vardecl.name && vardecl.name.getText() === subns) {
                                    vd = vardecl;
                                    break;
                                }
                    });
                if (vd)
                    gatherAll(into, vd, item[subns], ...prefixes.concat(subns));
                else if (ns) {
                    into.namespaces[prefixes.slice(1).concat(subns).join(".")] = ns;
                    gatherAll(into, ns.body, item[subns], ...prefixes.concat(subns));
                }
                else
                    throw "GONE FROM API:\tnamespace `" + prefixes.join(".") + "." + subns + "`";
            }
        }
        else {
            const members = [];
            // first: search for API methods
            astNode.forEachChild(n => {
                const decl = n;
                if (decl && decl.name && decl.name.text === item) {
                    const declfun = decl;
                    if ((!declfun) || (!declfun.parameters) || !declfun.parameters.find(_ => {
                        const t = _.type;
                        return (t && t.typeName && t.typeName.getText() === "Thenable");
                    }))
                        members.push(n);
                }
            });
            // second: search for events/props to be modeled as pretend API methods
            if (!members.length)
                astNode.forEachChild(ntop => {
                    if ((!members.length) && ntop.kind === 220 && ntop.getText().includes(item))
                        ntop.forEachChild(nsub => {
                            if ((!members.length) && nsub.getText().includes(item) && nsub.kind === ts.SyntaxKind.VariableDeclarationList)
                                nsub.forEachChild(nsubsub => {
                                    if ((!members.length) && nsubsub.getChildCount() && nsubsub.getText().includes(item) && nsubsub.kind === ts.SyntaxKind.VariableDeclaration) {
                                        const nname = nsubsub.getChildAt(0);
                                        if (nname && nname.getText() === item && nsubsub.getChildCount() > 2) {
                                            const ntype = nsubsub.getChildAt(2);
                                            const ntyperef = nsubsub.getChildAt(2);
                                            if (ntyperef && ntyperef.typeName && ntyperef.typeName.getText() === "Event" && ntyperef.typeArguments && ntyperef.typeArguments.length) {
                                                const n = nsubsub;
                                                [n.EvtName, n.EvtArgs] = [item, ntyperef.typeArguments.filter(_ => _.kind !== ts.SyntaxKind.VoidKeyword).map(_ => _)];
                                                members.push(n);
                                            }
                                            else {
                                                const n = nsubsub;
                                                [n.PropName, n.PropType] = [item, ntype];
                                                members.push(n);
                                            }
                                        }
                                    }
                                });
                        });
                });
            // third: faux-namespaces from property-like vars (such as `env.clipboard`)
            if ((!members.length) && ts.isVariableDeclaration(astNode) && astNode.type && ts.isTypeReferenceNode(astNode.type) && astNode.type.typeName) {
                const tname = astNode.type.typeName.getText();
                let iface;
                const find = (_) => {
                    if ((!iface) && _.getText().includes(tname))
                        if (ts.isInterfaceDeclaration(_))
                            iface = _;
                        else
                            _.forEachChild(find);
                };
                into.fromOrig.forEachChild(find);
                if (iface && iface.members && iface.members.length)
                    for (const mem of iface.members)
                        if (ts.isMethodSignature(mem) && mem.name.getText() === item) {
                            members.push(mem);
                            into.namespaces[prefixes.slice(1).join(".")] = iface;
                        }
            }
            if (!members.length)
                throw "GONE FROM API:\texport `" + prefixes.join(".") + "." + item + "` (kind=" + astNode.kind + ")";
            else
                for (let i = 0; i < members.length; i++)
                    if (!gen.seemsDeprecated(members[i]))
                        gatherMember(into, members[i], (members.length === 1) ? 0 : (i + 1), ...prefixes);
        }
    }
}
function gatherMember(into, member, overload, ...prefixes) {
    const evt = member, prop = member;
    if (evt && evt.EvtName && evt.EvtName.length)
        gatherEvent(into, evt, ...prefixes);
    else if (prop && prop.PropName && prop.PropType)
        gatherProp(into, prop, ...prefixes);
    else
        switch (member.kind) {
            case ts.SyntaxKind.EnumDeclaration:
                gatherEnum(into, member, ...prefixes);
                break;
            case ts.SyntaxKind.FunctionDeclaration:
                gatherFunc(into, member, overload, ...prefixes);
                break;
            case ts.SyntaxKind.MethodSignature:
                gatherFunc(into, member, 0, ...prefixes);
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                gatherStruct(into, member, ...prefixes);
                break;
            case ts.SyntaxKind.TupleType:
                member.elementTypes.forEach(_ => gatherFromTypeNode(into, _));
                break;
            case ts.SyntaxKind.ClassDeclaration:
                gatherStruct(into, member, ...prefixes);
                break;
            case ts.SyntaxKind.TypeAliasDeclaration:
                const talias = member;
                gatherFromTypeNode(into, talias.type, talias.typeParameters);
                break;
            default:
                throw member.kind + "\t" + member.getText();
        }
}
function gatherFromTypeElem(into, it, typeParams = undefined) {
    if (ts.isPropertySignature(it))
        gatherFromTypeNode(into, it.type, typeParams);
    else if (ts.isCallSignatureDeclaration(it) || ts.isConstructSignatureDeclaration(it) || ts.isMethodSignature(it) || ts.isIndexSignatureDeclaration(it)) {
        if (it.type)
            gatherFromTypeNode(into, it.type, (it.typeParameters && it.typeParameters.length) ? it.typeParameters : typeParams);
        for (const _ of it.parameters)
            gatherFromTypeNode(into, _.type, typeParams);
    }
}
function gatherFromTypeNode(into, it, typeParams = undefined) {
    switch (it.kind) {
        case ts.SyntaxKind.ArrayType:
            gatherFromTypeNode(into, it.elementType, typeParams);
            break;
        case ts.SyntaxKind.TupleType:
            it.elementTypes.forEach(_ => gatherFromTypeNode(into, _, typeParams));
            break;
        case ts.SyntaxKind.UnionType:
            const tunion = it;
            if (tunion && tunion.types && tunion.types.length && !tunion.types.find(_ => _.kind === ts.SyntaxKind.StringKeyword))
                it.types.forEach(_ => gatherFromTypeNode(into, _, typeParams));
            break;
        case ts.SyntaxKind.IntersectionType:
            it.types.forEach(_ => gatherFromTypeNode(into, _, typeParams));
            break;
        case ts.SyntaxKind.TypeLiteral:
            it.members.forEach(_ => gatherFromTypeElem(into, _, typeParams));
            break;
        case ts.SyntaxKind.LiteralType:
            const lit = it.literal;
            if (![ts.SyntaxKind.AnyKeyword, ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(lit.kind))
                throw lit.kind + "\t" + it.getText();
            break;
        case ts.SyntaxKind.TypeReference:
            const tref = it, tname = tref.typeName.getText();
            const tparam = (!typeParams) ? null : typeParams.find(_ => _.name.getText() === tname);
            if (tparam) {
                const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam);
                if (tnode)
                    gatherAll(into, into.fromOrig.body, [tnode.getText()], into.moduleName);
            }
            else if (tname === "Thenable" || tname === "ReadonlyArray")
                tref.typeArguments.forEach(_ => gatherFromTypeNode(into, _, typeParams));
            else if (tname !== "Uri" && tname !== "ThemeIcon" && tname !== "CancellationToken" && tname !== "Disposable" && /* crikey!.. */ tname.length > 1)
                gatherAll(into, into.fromOrig.body, [tname], into.moduleName);
            break;
        case ts.SyntaxKind.FunctionType:
            const tfun = it;
            if (tfun) {
                if (tfun.type)
                    gatherFromTypeNode(into, tfun.type, gen.combine(typeParams, tfun.typeParameters));
                if (tfun.parameters)
                    tfun.parameters.forEach(_ => gatherFromTypeNode(into, _.type, typeParams));
            }
            break;
        default:
            if (![ts.SyntaxKind.AnyKeyword, ts.SyntaxKind.VoidKeyword, ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(it.kind))
                throw it.kind + "\t" + it.getText();
    }
}
function gatherFunc(into, decl, overload, ...prefixes) {
    const qname = prefixes.concat(decl.name.getText()).join(".");
    if (into.funcs.some(_ => _.qName === qname && _.overload === overload))
        return;
    const owner = into.namespaces[prefixes.slice(1).join(".")];
    into.funcs.push({ qName: qname, overload: overload, decl: decl, ifaceNs: owner });
    decl.parameters.filter(_ => !gen.seemsDeprecated(_)).forEach(_ => gatherFromTypeNode(into, _.type, decl.typeParameters));
    gatherFromTypeNode(into, decl.type, decl.typeParameters);
}
function gatherProp(into, decl, ...prefixes) {
    const qname = prefixes.concat(decl.PropName).join(".");
    if (into.funcs.some(_ => _.qName === qname))
        return;
    into.funcs.push({ qName: qname, overload: 0, decl: decl, ifaceNs: into.namespaces[prefixes.slice(1).join(".")] });
    if (ts.isTypeNode(decl.PropType))
        gatherFromTypeNode(into, decl.PropType);
}
function gatherEvent(into, decl, ...prefixes) {
    const qname = prefixes.concat(decl.EvtName).join(".");
    if (into.funcs.some(_ => _.qName === qname))
        return;
    into.funcs.push({ qName: qname, overload: 0, decl: decl, ifaceNs: into.namespaces[prefixes.slice(1).join(".")] });
    for (const _ of decl.EvtArgs)
        gatherFromTypeNode(into, _);
}
function gatherEnum(into, decl, ...prefixes) {
    const qname = prefixes.concat(decl.name.text).join(".");
    if (!into.enums.some(_ => _.qName === qname))
        into.enums.push({ qName: qname, decl: decl });
}
function gatherStruct(into, decl, ...prefixes) {
    const qname = prefixes.concat(decl.name.text).join(".");
    if (into.structs.some(_ => _.qName === qname))
        return;
    if (decl.heritageClauses && decl.heritageClauses.length)
        for (const hc of decl.heritageClauses)
            if (hc.types && hc.types.length)
                for (const hct of hc.types) {
                    const tname = hct.getText();
                    if (tname !== "Disposable") {
                        if (!into.mereBaseTypes.includes(tname))
                            into.mereBaseTypes.push(tname);
                        gatherAll(into, into.fromOrig.body, [tname], into.moduleName);
                        if (hct.typeArguments && hct.typeArguments.length)
                            for (const hcta of hct.typeArguments)
                                gatherFromTypeNode(into, hcta, decl.typeParameters);
                    }
                }
    if (decl.name.text !== "Event")
        into.structs.push({ qName: qname, decl: decl });
    decl.members.forEach((member) => {
        if (!gen.seemsDeprecated(member)) {
            const memtype = member;
            const memtparams = member;
            const memparams = member;
            if (memtype && memtype.type)
                gatherFromTypeNode(into, memtype.type, memtparams ? gen.combine(memtparams.typeParameters, decl.typeParameters) : decl.typeParameters);
            if (memparams && memparams.parameters && memparams.parameters.length)
                memparams.parameters.filter(_ => !gen.seemsDeprecated(_)).forEach(_ => gatherFromTypeNode(into, _.type, memtparams ? gen.combine(memtparams.typeParameters, decl.typeParameters) : decl.typeParameters));
        }
    });
}
main();
