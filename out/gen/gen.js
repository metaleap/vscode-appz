"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const ts = require("typescript");
const gen_golang = require("./gen-golang");
const gen_csharp = require("./gen-csharp");
const println = console.log;
const filePathDts = 'node_modules/@types/vscode/index.d.ts';
const gens = [
    new gen_golang.Gen('libs/golang/', '.gen.go'),
    new gen_csharp.Gen('libs/csharp/', '.gen.cs'),
];
const genApiSurface = {
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
};
let _curmod;
function main() {
    const dtsfile = ts.createSourceFile(filePathDts, node_fs.readFileSync(filePathDts).toString(), ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
    for (const modulename in genApiSurface) {
        let md = null;
        dtsfile.forEachChild(astnode => {
            if ((!md) && (md = astnode) && (md.name.text !== modulename))
                md = null;
        });
        if (md) {
            _curmod = [modulename, md.body];
            gatherAll(md.body, genApiSurface[modulename], modulename);
        }
    }
    for (const gen of gens)
        gen.gen();
}
function gatherAll(astNode, childItems, ...prefixes) {
    for (var item of childItems)
        if (typeof item !== 'string') {
            for (var subns in item) {
                var ns = undefined;
                astNode.forEachChild(n => {
                    if ((!ns) && (ns = n)
                        && (!(ns.name && ns.name.text === subns)))
                        ns = undefined;
                });
                if (!ns)
                    throw ("GONE FROM API:\tnamespace `" + prefixes.join('.') + '.' + subns + '`');
                else
                    gatherAll(ns.body, item[subns], ...prefixes.concat(subns));
            }
        }
        else {
            var members = [];
            astNode.forEachChild(n => {
                var decl;
                if ((decl = n) && decl.name && decl.name.text === item)
                    members.push(n);
            });
            if (!members.length)
                throw ("GONE FROM API:\texport named `" + prefixes.join('.') + '.' + item + '`');
            else
                for (let i = 0; i < members.length; i++)
                    gatherMember(members[i], (members.length === 1) ? 0 : (i + 1), ...prefixes);
        }
}
const genAllFuncs = [], genAllStructs = [];
function gatherMember(member, overload, ...prefixes) {
    switch (member.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
            gatherFunc(member, overload, ...prefixes);
            break;
        case ts.SyntaxKind.InterfaceDeclaration:
            gatherStruct(member, ...prefixes);
            break;
        case ts.SyntaxKind.TupleType:
            member.elementTypes.forEach(_ => gatherFrom(_));
            break;
        default:
            throw (member.kind);
    }
}
function gatherFrom(typeNode, typeParams = undefined) {
    switch (typeNode.kind) {
        case ts.SyntaxKind.ArrayType:
            gatherFrom(typeNode.elementType, typeParams);
            break;
        case ts.SyntaxKind.TypeReference:
            const tref = typeNode, tname = tref.typeName.getText();
            const tparam = (!typeParams) ? null : typeParams.find(_ => _.name.getText() === tname);
            if (tparam) {
                const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam);
                if (tnode)
                    gatherAll(_curmod[1], [tnode.getText()], _curmod[0]);
            }
            else if (tname !== 'Thenable' && tname !== 'CancellationToken')
                gatherAll(_curmod[1], [tname], _curmod[0]);
            break;
        case ts.SyntaxKind.TupleType:
            typeNode.elementTypes.forEach(_ => gatherFrom(_, typeParams));
            break;
        case ts.SyntaxKind.UnionType:
            typeNode.types.forEach(_ => gatherFrom(_, typeParams));
            break;
        default:
            if (![ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(typeNode.kind))
                throw (typeNode.kind);
    }
}
function gatherFunc(decl, overload, ...prefixes) {
    const qname = prefixes.concat(decl.name.text).join('.');
    if (genAllFuncs.some(_ => _.qName === qname && _.overload === overload))
        return;
    genAllFuncs.push({ qName: qname, overload: overload, decl: decl });
    decl.parameters.forEach(_ => gatherFrom(_.type, decl.typeParameters));
    gatherFrom(decl.type, decl.typeParameters);
}
function gatherStruct(decl, ...prefixes) {
    const qname = prefixes.concat(decl.name.text).join('.');
    if (genAllStructs.some(_ => _.qName === qname))
        return;
    println("GENSTRUCT:\t" + qname);
    genAllStructs.push({ qName: qname, decl: decl });
    decl.members.forEach(member => {
        switch (member.kind) {
            case ts.SyntaxKind.PropertySignature:
                const prop = member;
                gatherFrom(prop.type);
                break;
            case ts.SyntaxKind.MethodSignature:
                const method = member;
                gatherFrom(method.type, method.typeParameters);
                method.parameters.forEach(_ => gatherFrom(_.type, method.typeParameters));
                break;
            default:
                throw (member.kind);
        }
    });
}
main();
