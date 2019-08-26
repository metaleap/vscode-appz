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
            genMembers(modulename, md, genApiSurface[modulename]);
    }
}
function genMembers(prefix, astNode, childItems) {
    println(prefix);
    println(123);
}
