"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
class Gen extends gen_ast.Gen {
    gen(prep) {
        this.options.oneIndent = "\t";
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = true;
        this.options.funcOverloads = false;
        this.nameRewriters.types.interfaces = _ => this.caseUp(_);
        super.gen(prep);
    }
    emitIntro() {
        return this
            .s("import { ipcMsg } from './aux'\n\n")
            .s("");
    }
}
exports.Gen = Gen;
