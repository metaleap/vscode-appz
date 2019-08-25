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
    const o = console.log;
    const dtsfile = ts.createSourceFile(filePathDts, node_fs.readFileSync(filePathDts).toString(), ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
    for (const modulename in genApiSurface) {
        let nmod = null;
        dtsfile.forEachChild(astnode => {
            if ((!nmod) && (nmod = astnode) && (nmod.name.text !== modulename))
                nmod = null;
        });
        if (nmod)
            genMembers(modulename, nmod);
    }
}
function genMembers(prefix, parent) {
}
