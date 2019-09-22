"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
class Gen extends gen_ast.Gen {
    gen(prep) {
        this.options.oneIndent = "\t";
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = true;
        this.options.idents.curInst = "me";
        super.gen(prep);
    }
    emitIntro() {
        return this.lines("package vscAppz", "// " + this.doNotEditComment("golang"), "");
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
    emitStruct(it) {
        this.emitDocs(it)
            .line("type " + it.Name + " struct {").indented(() => this.each(it.Fields, "\n", f => this.emitDocs(f).ln(() => this.s(f.Name, " ").emitTypeRef(f.Type).s(" `json:\"")
            .when(f.Json.Excluded, () => this.s("-"), () => this.s(f.Json.Name + (f.Json.Required ? "" : ",omitempty"))).s("\"`")))).lines("}", "");
    }
    emitFuncImpl(it) {
        let struct = it.Type, iface = it.Type;
        [struct, iface] = [(struct && struct.Fields) ? struct : null, (iface && iface.Methods) ? iface : null];
        const emitsigheadln = () => this.lf("func (", this.options.idents.curInst, " *", struct ? struct.Name : this.options.idents.typeImpl, ") ", it.Name, "(").each(it.Func.Args, ", ", a => this.s(a.Name, " ").emitTypeRef(a.Type)).s(") ").when(it.Func.Type, () => this.emitTypeRef(it.Func.Type).s(" "));
        if (struct)
            emitsigheadln().emitInstr(it.Func.Body).lines("", "");
        else if (iface)
            emitsigheadln().emitInstr(it.Func.Body).lines("", "");
    }
    emitInstr(it) {
        if (it) {
            const ivar = it;
            if (ivar && ivar.Name && ivar.Type)
                return this.ln(() => this.s("var ", ivar.Name, " ").emitTypeRef(ivar.Type));
            const idictdel = it;
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() => this.s("delete(").emitExpr(idictdel.DelFrom).s(", ").emitExpr(idictdel.DelWhat).s(')'));
            const icolladd = it;
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() => this.emitExpr(icolladd.AddTo).s(" = append(").emitExpr(icolladd.AddTo).s(", ").emitExpr(icolladd.AddWhat).s(")"));
            const iblock = it;
            if (iblock && iblock.Instrs !== undefined)
                if (iblock.Lock && false)
                    return this.ln(() => this.emitExpr(iblock.Lock).s(".Lock()"))
                        .each(iblock.Instrs, "FOOOOBAR", _ => this.emitInstr(_))
                        .ln(() => this.emitExpr(iblock.Lock).s(".Unlock()"));
                else {
                    let endeol = false;
                    if (endeol = iblock.Lock ? true : false)
                        this.ln(() => this.emitExpr(iblock.Lock).s(".Lock()").line().lf("{"));
                    else if (endeol = (iblock.ForEach && iblock.ForEach.length) ? true : false)
                        this.ln(() => this.s("for _, ", iblock.ForEach[0].Name, " := range ").emitExpr(iblock.ForEach[1]).s(" {"));
                    else if (endeol = (iblock.If && iblock.If.length) ? true : false)
                        this.ln(() => this.s("if ").emitExpr(iblock.If[0]).s(" {"));
                    else
                        this.s("{").line();
                    this.indented(() => iblock.Instrs.forEach(_ => this.emitInstr(_)));
                    this.lf().s("}");
                    if (iblock.Lock)
                        this.line().lf().emitExpr(iblock.Lock).s(".Unlock()");
                    else if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                        this.s(" else ").emitInstr(iblock.If[1]).lf();
                    return endeol ? this.line() : this;
                }
        }
        return super.emitInstr(it);
    }
    emitExpr(it) {
        if (it === null)
            return this.s("null");
        const ecollnew = it;
        if (ecollnew && ecollnew.Capacity !== undefined)
            if (ecollnew.ElemTypeIfList)
                return this.s("make([]").emitTypeRef(ecollnew.ElemTypeIfList).s(", 0, ").emitExpr(ecollnew.Capacity).s(")");
            else
                return this.s("make(dict, ").emitExpr(ecollnew.Capacity).s(")");
        const enew = it;
        if (enew && enew.New)
            return this.s("new(").emitTypeRef(typeRefUnMaybe(enew.New)).s(")");
        const etup = it;
        if (etup && etup.Items !== undefined)
            return this.each(etup.Items, ", ", _ => { this.emitExpr(_); });
        const elen = it;
        if (elen && elen.LenOf)
            return this.s("len(").emitExpr(elen.LenOf).s(")");
        const eop = it;
        if (eop && eop.Name && eop.Operands && eop.Operands.length)
            if (eop.Name === gen_ast.BuilderOperators.Is)
                return this.s("(nil != ").emitExpr(eop.Operands[0]).s(")");
            else if (eop.Name === gen_ast.BuilderOperators.Isnt)
                return this.s("(nil == ").emitExpr(eop.Operands[0]).s(")");
            else if (eop.Name === gen_ast.BuilderOperators.Idx || eop.Name === gen_ast.BuilderOperators.IdxMay)
                return this.emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]");
        const efn = it;
        if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
            return this
                .s("func(")
                .each(efn.Args, ", ", _ => this.s(_.Name, " ").emitTypeRef(_.Type))
                .s(") ").emitTypeRef(efn.Type).s(efn.Type ? " " : "").emitInstr(efn.Body);
        const econv = it;
        if (econv && econv.Conv && econv.To) {
            const tval = typeRefUnMaybe(econv.To, true, true, true);
            return this.emitExpr(econv.Conv).s(".(").emitTypeRef(tval).s(")");
        }
        return super.emitExpr(it);
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
            return this.s("func(").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(tfun.To ? ") " : ")").emitTypeRef(tfun.To);
        return super.emitTypeRef(it);
    }
    typeRefForField(it, optional) {
        return typeRefUnMaybe(it, true, optional, optional);
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
function typeRefUnMaybe(it, unMaybeBools = true, unMaybeInts = true, unMaybeStrings = true) {
    const tmay = it;
    if (tmay && tmay.Maybe
        && (tmay.Maybe !== gen_ast.TypeRefPrim.String || unMaybeStrings)
        && (tmay.Maybe !== gen_ast.TypeRefPrim.Bool || unMaybeBools)
        && (tmay.Maybe !== gen_ast.TypeRefPrim.Int || unMaybeInts))
        return typeRefUnMaybe(tmay.Maybe, unMaybeBools, unMaybeInts, unMaybeStrings);
    return it;
}
