"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
class Gen extends gen_ast.Gen {
    gen(prep) {
        this.options.oneIndent = "\t";
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = true;
        super.gen(prep);
    }
    emitIntro() {
        return this.lines("package vscAppz", "// " + this.doNotEditComment("golang"), "type " + this.options.idents.typeAny + " = interface{}", "type Dict = map[string]" + this.options.idents.typeAny, "");
    }
    emitOutro() { return this; }
    emitDocs(it) {
        if (it.Docs && it.Docs.length)
            for (const doc of it.Docs)
                if (doc.Lines && doc.Lines.length)
                    if (!(doc.ForParam && doc.ForParam.length))
                        this.lines(...doc.Lines.map(_ => "// " + _));
        return this;
    }
    emitEnum(it) {
        this.emitDocs(it)
            .line("type " + it.Name + " int")
            .line("const (")
            .indented(() => this.each(it.Enumerants, "\n", e => this.emitDocs(e).line(it.Name + e.Name + " " + it.Name + " = " + e.Value)))
            .lines(")", "");
    }
    emitInterface(it) {
        this.emitDocs(it)
            .line("type " + it.Name + " interface {").indented(() => this.each(it.Methods, "\n", m => this.emitDocs(m).lf()
            .s(m.Name)
            .s("(").each(m.Args, ", ", a => this.s(a.Name, " ").emitTypeRef(a.Type))
            .s(") ")
            .emitTypeRef(m.Type)
            .line()))
            .lines("}", "");
    }
    emitTypeRef(it) {
        if (it === null)
            return this;
        const tmay = this.typeMaybe(it);
        if (tmay)
            return this.s(typeRefNilable(this, tmay.Maybe) ? "" : "*").emitTypeRef(tmay.Maybe);
        const tarr = this.typeArr(it);
        if (tarr)
            return this.s("[]").emitTypeRef(tarr.ArrOf);
        const ttup = this.typeTup(it);
        if (ttup)
            return this.s("[]").emitTypeRef(ttup.TupOf[0]);
        const tfun = this.typeFunc(it);
        if (tfun)
            return this.s("func (").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(tfun.To ? ") " : ")").emitTypeRef(tfun.To);
        return super.emitTypeRef(it);
    }
}
exports.Gen = Gen;
function typeRefNilable(_, it, forceTrueForBools = false, forceTrueForInts = false, forceTrueForStrings = false) {
    return it === gen_ast.TypeRefPrim.Any || it === gen_ast.TypeRefPrim.Dict
        || _.typeArr(it) || _.typeMaybe(it) || _.typeFunc(it) || _.typeTup(it)
        || (forceTrueForBools && it === gen_ast.TypeRefPrim.Bool)
        || (forceTrueForInts && it === gen_ast.TypeRefPrim.Int)
        || (forceTrueForStrings && it === gen_ast.TypeRefPrim.String);
}
