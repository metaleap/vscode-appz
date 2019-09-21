"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
class Gen extends gen_ast.Gen {
    gen(prep) {
        this.options.oneIndent = "\t";
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = true;
        this.nameRewriters.types.interfaces = _ => "I" + this.caseUp(_);
        super.gen(prep);
    }
    emitIntro() {
        return this.lines("//" + this.doNotEditComment("csharp"), "namespace VscAppz {").indent().lines("using System;", "using System.Collections.Generic;", "using Newtonsoft.Json;", "", "using Any = System.Object;", "");
    }
    emitOutro() {
        return this.undent().lines("}");
    }
    emitInterface(it) {
        this.line("public interface " + it.Name + " {")
            .indented(() => this.each(it.Methods, "", m => this.ln(() => this.emitTypeRef(m.Type).s(" ", m.Name)
            .when(m.Args && m.Args.length, () => this.s("(").each(m.Args, ", ", a => this.emitTypeRef(a.Type).s(" ", a.Name, " = default")).s(")")).s(";"))))
            .line("}");
    }
    emitEnum(it) {
        this.line("public enum " + it.Name + "{")
            .indented(() => this.each(it.Enumerants, "", e => this.line(e.Name + " = " + e.Value)))
            .line("}");
    }
    emitTypeRef(it) {
        const tfun = this.typeFunc(it);
        if (tfun)
            return (!tfun.To)
                ? this.s("Action<").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(">")
                : this.s("Func<").s(">");
        const tmay = this.typeMaybe(it);
        if (tmay)
            return tmay.Maybe === gen_ast.TypeRefPrim.Bool || tmay.Maybe === gen_ast.TypeRefPrim.Int || this.typeTup(tmay.Maybe)
                ? this.s("Nullable<").emitTypeRef(tmay.Maybe).s(">")
                : this.emitTypeRef(tmay.Maybe);
        const tarr = this.typeArr(it);
        if (tarr)
            return (tarr.AsList)
                ? this.s("List<").emitTypeRef(tarr.ArrOf).s(">")
                : this.emitTypeRef(tarr.ArrOf).s("[]");
        const ttup = this.typeTup(it);
        if (ttup)
            return this.s("(").each(ttup.TupOf, ", ", t => this.emitTypeRef(t)).s(')');
        return super.emitTypeRef(it);
    }
}
exports.Gen = Gen;
