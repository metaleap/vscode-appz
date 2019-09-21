"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
class Gen extends gen_ast.Gen {
    gen(prep) {
        this.options.indent = '\t';
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = true;
        this.nameRewriters.types.interfaces = _ => 'I' + this.caseUp(_);
        super.gen(prep);
    }
    emitIntro() {
        return this.lines('//' + this.doNotEditComment('csharp'), 'namespace VscAppz {').indent().lines('using System;', 'using System.Collections.Generic;', 'using Newtonsoft.Json;', '', 'using Any = System.Object;', '');
    }
    emitOutro() {
        return this.outdent().lines('}');
    }
    emitInterface(it) {
        this.line('public interface ' + it.Name + ' {')
            .indent()
            .outdent()
            .line('}');
    }
}
exports.Gen = Gen;
