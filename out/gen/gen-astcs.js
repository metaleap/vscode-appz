"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
class Gen extends gen_ast.Gen {
    gen(prep) {
        this.options.oneIndent = "\t";
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = true;
        this.options.funcOverloads = true;
        this.nameRewriters.types.interfaces = _ => "I" + this.caseUp(_);
        super.gen(prep);
    }
    emitIntro() {
        return this.lines("//" + this.doNotEditComment("csharp"), "namespace VscAppz {").indent().lines("using System;", "using System.Collections.Generic;", "using Newtonsoft.Json;", "", "using " + this.options.idents.typeAny + " = System.Object;", "using " + this.options.idents.typeDict + " = Dictionary<string, " + this.options.idents.typeAny + ">;", "");
    }
    emitOutro() {
        return this.undent().lines("}");
    }
    emitDocs(it) {
        if (it.Docs && it.Docs.length)
            for (const doc of it.Docs)
                if (doc.Lines && doc.Lines.length)
                    if (doc.ForParam && doc.ForParam.length)
                        this.line("/// <param name=\"" + doc.ForParam + "\">" + doc.Lines.join(" ") + "</param>");
                    else if (doc.Lines.length > 1)
                        this.line("/// <summary>")
                            .lines(...doc.Lines.map(_ => "/// " + _))
                            .line("/// </summary>");
                    else
                        this.line("/// <summary>" + doc.Lines[0] + "</summary>");
        return this;
    }
    emitEnum(it) {
        this.emitDocs(it)
            .line("public enum " + it.Name + " {")
            .indented(() => this.each(it.Enumerants, "\n", e => this.emitDocs(e).line(e.Name + " = " + e.Value + ",")))
            .lines("}", "");
    }
    emitInterface(it) {
        this.emitDocs(it)
            .line("public interface " + it.Name + " {")
            .indented(() => this.each(it.Methods, "\n", m => this.emitDocs(m).lf()
            .emitTypeRef(m.Type).s(" ", m.Name)
            .when(m.Args && m.Args.length, () => this.s("(").each(m.Args, ", ", a => this.emitTypeRef(a.Type).s(" ", a.Name, " = default")).s(")")).s(";").line()))
            .lines("}", "");
    }
    emitStruct(it) {
        this.line("public partial class " + it.Name + " {").indented(() => this.each(it.Fields, "", fld => this.line(fld.Json.Excluded ? "[JsonIgnore]"
            : `[JsonProperty("${fld.Json.Name}")` + (fld.Json.Required ? ", JsonRequired]" : "]")).ln(() => this
            .s("public ")
            .emitTypeRef(fld.Type)
            .s(" ", fld.Name, ";")))).line("}");
    }
    onBeforeEmitImpls(...interfaces) {
        this.line("internal partial class "
            + this.options.idents.typeImpl + " : "
            + interfaces.map(_ => _.Name).join(", ") + " {").indent();
    }
    onAfterEmitImpls() {
        this.undent().line("}");
    }
    emitFuncImpl(it) {
        let struct = it.Type, iface = it.Type;
        [struct, iface] = [(struct && struct.Fields) ? struct : null, (iface && iface.Methods) ? iface : null];
        const isproperty = !(it.Func.Args && it.Func.Args.length);
        const emitsigheadln = () => this.lf(iface ? "" : "internal ").emitTypeRef(it.Func.Type)
            .s(" ", (iface ? (iface.Name + ".") : "") + it.Name)
            .when(isproperty, () => this.s(" { get "), () => this.s("(")
            .each(it.Func.Args, ", ", a => this.emitTypeRef(a.Type).s(" ", a.Name))
            .s(") "));
        if (struct)
            this.line("internal partial class " + struct.Name + " {")
                .indented(() => emitsigheadln().emitInstr(it.Func.Body).line()).line("}");
        else if (iface)
            emitsigheadln()
                .emitInstr(it.Func.Body)
                .s(isproperty ? " }" : "").line();
        else
            throw it;
    }
    emitInstr(it) {
        if (it) {
            const iret = it;
            if (iret && iret.Ret !== undefined)
                return this.ln(() => this.s("return ").emitExpr((!iret.Ret) ? undefined : iret.Ret).s(";"));
            const ivar = it;
            if (ivar && ivar.Name)
                return this.ln(() => this.emitTypeRef(ivar.Type).s(" ", ivar.Name, " = default;"));
            const iset = it;
            if (iset && iset.SetWhat && iset.SetTo)
                return this.ln(() => this.emitExpr(iset.SetWhat).s(" = ").emitExpr(iset.SetTo).s(";"));
            const idictdel = it;
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() => this.emitExpr(idictdel.DelFrom).s(".Delete(").emitExpr(idictdel.DelWhat).s(");"));
            const icolladd = it;
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() => this.emitExpr(icolladd.AddTo).s('.Add(').emitExpr(icolladd.AddWhat).s(");"));
            const ecall = it;
            if (ecall && ecall.Call)
                return this.ln(() => this.emitExpr(ecall).s(";"));
            const iblock = it;
            if (iblock && iblock.Instrs !== undefined) {
                let endeol = false;
                if (endeol = iblock.Lock ? true : false)
                    this.ln(() => this.s("lock (").emitExpr(iblock.Lock).s(") {"));
                else if (endeol = (iblock.ForEach && iblock.ForEach.length) ? true : false)
                    this.ln(() => this.s("for (var ", iblock.ForEach[0].Name, " in ").emitExpr(iblock.ForEach[1]).s(") {"));
                else if (endeol = (iblock.If && iblock.If.length) ? true : false)
                    this.ln(() => this.s("if (").emitExpr(iblock.If[0]).s(") {"));
                else
                    this.s("{").line();
                this.indented(() => iblock.Instrs.forEach(_ => this.emitInstr(_)));
                this.lf().s("}");
                if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                    this.s(" else ").emitInstr(iblock.If[1]).lf();
                return endeol ? this.line() : this;
            }
        }
        return super.emitInstr(it);
    }
    emitExpr(it) {
        const ecollnew = it;
        if (ecollnew && ecollnew.Capacity !== undefined)
            return this.when(ecollnew.ElemTypeIfList, () => this.s("new List<").emitTypeRef(ecollnew.ElemTypeIfList).s(">"), () => this.s("new Dict")).s("(").emitExpr(ecollnew.Capacity).s(")");
        const enew = it;
        if (enew && enew.New)
            return this.s("new ").emitTypeRef(enew.New).s("()");
        const econv = it;
        if (econv && econv.Conv && econv.To) {
            const tval = typeRefUnMaybe(econv.To, true, true, true);
            return this.when(typeRefNullable(econv.To) && !econv.WontBeNull, () => this.s("(null == ").emitExpr(econv.Conv).s(") ? (default, true) : ")).s("(").emitExpr(econv.Conv).s(" is ").emitTypeRef(tval).s(") ? (((").emitTypeRef(tval).s(")(").emitExpr(econv.Conv).s(")), true) : (default, false)");
        }
        const elen = it;
        if (elen && elen.LenOf)
            return this.emitExpr(elen.LenOf).s(".Count");
        const etup = it;
        if (etup && etup.Items !== undefined)
            return this.s("(").each(etup.Items, ", ", _ => { this.emitExpr(_); }).s(")");
        const eop = it;
        if (eop && eop.Name && eop.Operands && eop.Operands.length)
            if (eop.Name === gen_ast.BuilderOperators.Is)
                return this.s("(null != ").emitExpr(eop.Operands[0]).s(")");
            else if (eop.Name === gen_ast.BuilderOperators.Isnt)
                return this.s("(null == ").emitExpr(eop.Operands[0]).s(")");
            else if (eop.Name === gen_ast.BuilderOperators.Idx)
                return this.emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]");
        const efn = it;
        if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
            return this
                .s("(")
                .each(efn.Args, ", ", _ => this.emitTypeRef(_.Type).s(" ").s(_.Name))
                .s(") => ").emitInstr(efn.Body);
        return super.emitExpr(it);
    }
    emitTypeRef(it) {
        if (it === gen_ast.TypeRefPrim.Dict)
            return this.s(this.options.idents.typeDict);
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
            return this.s("(").each(ttup.TupOf, ", ", t => this.emitTypeRef(t)).s(")");
        const tfun = this.typeFunc(it);
        if (tfun)
            return (!tfun.To)
                ? this.s("Action<").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(">")
                : this.s("Func<").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(", ").emitTypeRef(tfun.To).s(">");
        return super.emitTypeRef(it);
    }
    typeRefForField(it) {
        return typeRefUnMaybe(it, true, false, false);
    }
}
exports.Gen = Gen;
function typeRefNullable(it, forceTrueForBools = false, forceTrueForInts = false, forceTrueForTups = false) {
    const ttup = it;
    const isvt = ((it === gen_ast.TypeRefPrim.Bool && !forceTrueForBools)
        || (it === gen_ast.TypeRefPrim.Int && !forceTrueForInts)
        || (ttup && ttup.TupOf && ttup.TupOf.length && !forceTrueForTups));
    return !isvt;
}
function typeRefUnMaybe(it, unMaybeBools, unMaybeInts, unMaybeTuples) {
    const tmay = it;
    if (tmay && tmay.Maybe) {
        const ttup = tmay.Maybe;
        if ((unMaybeTuples && ttup && ttup.TupOf && ttup.TupOf.length)
            || (unMaybeBools && tmay.Maybe === gen_ast.TypeRefPrim.Bool)
            || (unMaybeInts && tmay.Maybe === gen_ast.TypeRefPrim.Int))
            return typeRefUnMaybe(tmay.Maybe, unMaybeBools, unMaybeInts, unMaybeTuples);
    }
    return it;
}
