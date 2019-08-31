"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const ts = require("typescript");
const gen_shared = require("./gen-shared");
const gen_golang = require("./gen-golang");
const gen_csharp = require("./gen-csharp");
const gen_python = require("./gen-python");
const filePathDts = 'node_modules/@types/vscode/index.d.ts';
const gens = [
    new gen_golang.Gen('libs/golang/', '.gen.go'),
    new gen_csharp.Gen('libs/csharp/', '.gen.cs'),
    new gen_python.Gen('libs/csharp/', '.gen.py'),
];
const genApiSurface = {
    'vscode': [
        'TreeItemCollapsibleState',
        {
            'window': [
                'showErrorMessage',
                'showInformationMessage',
                'showWarningMessage',
            ],
        },
        'StatusBarAlignment',
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
            throw ("GONE FROM API:\tmodule `" + modulename + '`');
        else {
            const job = {
                module: [modulename, md.body], enums: [], structs: [], funcs: []
            };
            gatherAll(job, md.body, genApiSurface[modulename], modulename);
            const prep = new gen_shared.GenPrep(job);
            for (const gen of gens)
                gen.gen(prep);
        }
    }
}
function gatherAll(into, astNode, childItems, ...prefixes) {
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
                    gatherAll(into, ns.body, item[subns], ...prefixes.concat(subns));
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
                    gatherMember(into, members[i], (members.length === 1) ? 0 : (i + 1), ...prefixes);
        }
}
function gatherMember(into, member, overload, ...prefixes) {
    switch (member.kind) {
        case ts.SyntaxKind.EnumDeclaration:
            gatherEnum(into, member, ...prefixes);
            break;
        case ts.SyntaxKind.FunctionDeclaration:
            gatherFunc(into, member, overload, ...prefixes);
            break;
        case ts.SyntaxKind.InterfaceDeclaration:
            gatherStruct(into, member, ...prefixes);
            break;
        case ts.SyntaxKind.TupleType:
            member.elementTypes.forEach(_ => gatherFrom(into, _));
            break;
        default:
            throw (member.kind);
    }
}
function gatherFrom(into, typeNode, typeParams = undefined) {
    switch (typeNode.kind) {
        case ts.SyntaxKind.ArrayType:
            gatherFrom(into, typeNode.elementType, typeParams);
            break;
        case ts.SyntaxKind.TupleType:
            typeNode.elementTypes.forEach(_ => gatherFrom(into, _, typeParams));
            break;
        case ts.SyntaxKind.UnionType:
            typeNode.types.forEach(_ => gatherFrom(into, _, typeParams));
            break;
        case ts.SyntaxKind.TypeReference:
            const tref = typeNode, tname = tref.typeName.getText();
            const tparam = (!typeParams) ? null : typeParams.find(_ => _.name.getText() === tname);
            if (tparam) {
                const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam);
                if (tnode)
                    gatherAll(into, into.module[1], [tnode.getText()], into.module[0]);
            }
            else if (tname === 'Thenable')
                tref.typeArguments.forEach(_ => gatherFrom(into, _, typeParams));
            else
                gatherAll(into, into.module[1], [tname], into.module[0]);
            break;
        default:
            if (![ts.SyntaxKind.StringKeyword, ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.UndefinedKeyword, ts.SyntaxKind.NullKeyword].includes(typeNode.kind))
                throw (typeNode.kind);
    }
}
function gatherFunc(into, decl, overload, ...prefixes) {
    const qname = prefixes.concat(decl.name.text).join('.');
    if (into.funcs.some(_ => _.qName === qname && _.overload === overload))
        return;
    into.funcs.push({ qName: qname, overload: overload, decl: decl });
    decl.parameters.forEach(_ => gatherFrom(into, _.type, decl.typeParameters));
    gatherFrom(into, decl.type, decl.typeParameters);
}
function gatherEnum(into, decl, ...prefixes) {
    const qname = prefixes.concat(decl.name.text).join('.');
    if (!into.enums.some(_ => _.qName === qname))
        into.enums.push({ qName: qname, decl: decl });
}
function gatherStruct(into, decl, ...prefixes) {
    const qname = prefixes.concat(decl.name.text).join('.');
    if (into.structs.some(_ => _.qName === qname))
        return;
    into.structs.push({ qName: qname, decl: decl });
    decl.members.forEach(member => {
        switch (member.kind) {
            case ts.SyntaxKind.PropertySignature:
                const prop = member;
                gatherFrom(into, prop.type);
                break;
            case ts.SyntaxKind.MethodSignature:
                const method = member;
                gatherFrom(into, method.type, method.typeParameters);
                method.parameters.forEach(_ => gatherFrom(into, _.type, method.typeParameters));
                break;
            default:
                throw (member.kind);
        }
    });
}
main();
