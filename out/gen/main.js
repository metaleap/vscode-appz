"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const ts = require("typescript");
const println = console.log;
const filePathDts = "node_modules/@types/vscode/index.d.ts";
const genApiSurface = {
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
};
main();
function main() {
    const dtsfile = ts.createSourceFile(filePathDts, node_fs.readFileSync(filePathDts).toString(), ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
    for (const modulename in genApiSurface) {
        let md = null;
        dtsfile.forEachChild(astnode => {
            if ((!md) && (md = astnode) && (md.name.text !== modulename))
                md = null;
        });
        if (md)
            genMembers(md.body, genApiSurface[modulename], modulename);
    }
}
function genMembers(astNode, childItems, ...prefixes) {
    for (var item of childItems)
        if (typeof item === 'string') {
            var member = undefined;
            astNode.forEachChild(n => {
                if (!member) {
                    var decl;
                    if ((decl = n) && decl.name && decl.name.text === item)
                        member = n;
                }
            });
            if (!member)
                println("GONE FROM API:\tmember `" + prefixes.join(".") + "." + item + "`");
            else {
            }
        }
        else {
            const mem = item;
            for (var key in mem) {
                var ns = undefined;
                astNode.forEachChild(n => {
                    if ((!ns) && (ns = n)) {
                        if (!(ns.name && ns.name.text === key))
                            ns = undefined;
                    }
                });
                if (!ns)
                    println("GONE FROM API:\tnamespace `" + prefixes.join(".") + "." + key + "`");
                else
                    genMembers(ns.body, mem[key], ...prefixes.concat(key));
            }
        }
}
