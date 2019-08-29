"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const ts = require("typescript");
const gen_golang = require("./gen-golang");
const gen_csharp = require("./gen-golang");
const println = console.log;
const filePathDts = 'node_modules/@types/vscode/index.d.ts';
const gens = [
    new gen_golang.Gen('libs/golang/generated.go'),
    new gen_csharp.Gen('libs/csharp/generated.cs'),
];
const genApiSurface = {
    'vscode': [
        {
            'window': [
                'showErrorMessage',
                'showInformationMessage',
                'showWarningMessage'
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
                for (let i = 0; i < members.length; i++) {
                    const member = members[i];
                    switch (member.kind) {
                        case ts.SyntaxKind.FunctionDeclaration:
                            gatherFunc(member, (members.length === 1) ? 0 : (i + 1), ...prefixes);
                            break;
                        case ts.SyntaxKind.InterfaceDeclaration:
                            gatherStruct(member, ...prefixes);
                            break;
                        default:
                            throw (member.kind);
                    }
                }
        }
}
const genAllFuncs = [], genAllStructs = [];
function gatherFunc(decl, overload, ...prefixes) {
    genAllFuncs.push({ qName: prefixes.concat(decl.name.text), overload: overload, decl: decl });
    println(decl.name.text);
    decl.parameters.forEach(param => gatherFrom(param.type));
    gatherFrom(decl.type);
}
function gatherFrom(typeNode) {
    switch (typeNode.kind) {
        case ts.SyntaxKind.ArrayType:
            gatherFrom(typeNode.elementType);
            break;
        case ts.SyntaxKind.TypeReference:
            const tref = typeNode, tname = tref.typeName.getText();
            if (tname != 'Thenable') {
                println(tref.flags + "\t" + (tref.typeArguments ? tref.typeArguments.length : -1));
                gatherAll(_curmod[1], [tname], _curmod[0]);
            }
            break;
        case ts.SyntaxKind.StringKeyword:
            break;
        default:
            throw (typeNode.kind);
    }
}
function gatherStruct(decl, ...prefixes) {
    println("GENSTRUCT:\t" + prefixes.concat(decl.name.text).join('~'));
    genAllStructs.push({ qName: prefixes.concat(decl.name.text), decl: decl });
}
main();
