"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
let anonVarCounter;
class Gen extends gen_ast.Gen {
    gen(prep) {
        anonVarCounter = 1;
        this.options.oneIndent = "\t";
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = true;
        this.options.funcOverloads = true;
        this.nameRewriters.types.interfaces = _ => "I" + this.caseUp(_);
        super.gen(prep);
    }
    emitIntro() {
        return this.lines("// " + this.doNotEditComment("csharp"), "namespace VscAppz {").indent().lines("using System;", "using System.Collections.Generic;", "using Newtonsoft.Json;", "", "using GlobPattern = System.String;", "using " + this.options.idents.typeAny + " = System.Object;", "using " + this.options.idents.typeDict + " = System.Collections.Generic.Dictionary<string, object>;", "");
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
            .line("public interface " + it.Name + " {").indented(() => this.each(it.Methods, "\n", m => this.emitDocs(m).lf()
            .emitTypeRef(m.Type).s(" ", m.Name)
            .when(m.Args && m.Args.length, () => this.s("(").each(m.Args, ", ", a => this.emitTypeRef(a.Type).s(" ", a.Name, " = default"))
            .s(");"), () => this.s(" { get; }")).line()))
            .lines("}", "");
    }
    emitStruct(it) {
        this.emitDocs(it)
            .line("public partial class " + it.Name + " {").indented(() => this.each(it.Fields, "\n", f => this.emitDocs(f).line(f.Json.Excluded
            ? "[JsonIgnore]"
            : `[JsonProperty("${f.Json.Name}")` + (this.typeTup(this.typeUnMaybe(f.Type)) ? ", JsonConverter(typeof(json.valueTuples))" : "") + (f.Json.Required ? ", JsonRequired]" : "]")).when((f.Type === gen_ast.TypeRefPrim.String && f.FuncFieldRel), () => this.line("[System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]")).ln(() => this
            .s("public ")
            .emitTypeRef(f.Type)
            .s(" ", f.Name, ";")))).lines("}", "");
    }
    onBeforeEmitImpls() {
        this.line("internal partial class "
            + this.options.idents.typeImpl + " : "
            + this.allInterfaces.map(_ => _.Name).join(", ") + " {").line().indent();
    }
    onAfterEmitImpls() {
        this.undent().lines("}", "");
    }
    emitFuncImpl(it) {
        anonVarCounter = 1;
        let struct = it.Type, iface = it.Type;
        [struct, iface] = [(struct && struct.Fields) ? struct : null, (iface && iface.Methods) ? iface : null];
        const isproperty = !(it.Func.Args && it.Func.Args.length);
        const emitsigheadln = () => this.lf(iface ? "" : "internal ").emitTypeRef(it.Func.Type)
            .s(" ", (iface ? (iface.Name + ".") : "") + it.Name)
            .when(isproperty, () => this.s(" { get "), () => this.s("(")
            .each(it.Func.Args, ", ", a => this.emitTypeRef(a.Type).s(" ", a.Name))
            .s(") "));
        if (struct)
            this.line("public partial class " + struct.Name + " {")
                .indented(() => emitsigheadln().emitInstr(it.Func.Body).line()).lines("}", "");
        else if (iface)
            emitsigheadln()
                .emitInstr(it.Func.Body)
                .s(isproperty ? " }" : "").lines("", "");
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
                return this.ln(() => this.emitExpr(idictdel.DelFrom).s(".Remove(").emitExpr(idictdel.DelWhat).s(");"));
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
                    this.ln(() => this.s("foreach (var ", iblock.ForEach[0].Name, " in ").emitExpr(iblock.ForEach[1]).s(") {"));
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
        if (ecollnew && (ecollnew.Cap !== undefined || ecollnew.Len !== undefined))
            if (!ecollnew.ElemType)
                return this.s("new ", this.options.idents.typeDict, "(").emitExpr(ecollnew.Cap).s(")");
            else if (ecollnew.Len !== undefined)
                return this.s("new ").emitTypeRef(ecollnew.ElemType).s("[").emitExpr(ecollnew.Len).s("]");
            else if (ecollnew.Cap !== undefined)
                return this.s("new List<").emitTypeRef(ecollnew.ElemType).s(">(").emitExpr(ecollnew.Cap).s(")");
            else // newly introduced bug
                throw ecollnew;
        const enew = it;
        if (enew && enew.New)
            return this.s("new ").emitTypeRef(enew.New).s("()");
        const econv = it;
        if (econv && econv.Conv && econv.To) {
            const tnamed = econv.To;
            return econv.Cast
                ? this.s("((").emitTypeRef(econv.To).s(")(").emitExpr(econv.Conv).s("))")
                : (tnamed && tnamed.Name)
                    ? this.emitExpr(this.b.eThis())
                    : this.s("(").emitExpr(econv.Conv).s(" is ").emitTypeRef(econv.To).s(") ? (((").emitTypeRef(econv.To).s(")(").emitExpr(econv.Conv).s(")), true) : (default, false)");
        }
        const elen = it;
        if (elen && elen.LenOf)
            return this.emitExpr(elen.LenOf).s(elen.IsArr ? ".Length" : ".Count");
        const etup = it;
        if (etup && etup.Items !== undefined)
            return this.s("(").each(etup.Items, ", ", _ => { this.emitExpr(_); }).s(")");
        const eop = it;
        if (eop && eop.Name && eop.Operands && eop.Operands.length)
            if (eop.Name === gen_ast.BuilderOperators.Is)
                return this.s("(null != ").emitExpr(eop.Operands[0]).s(")");
            else if (eop.Name === gen_ast.BuilderOperators.Isnt)
                return this.s("(null == ").emitExpr(eop.Operands[0]).s(")");
            else if (eop.Name === gen_ast.BuilderOperators.Addr || eop.Name === gen_ast.BuilderOperators.Deref)
                return this.emitExpr(eop.Operands[0]);
            else if (eop.Name === gen_ast.BuilderOperators.Idx)
                return this.emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]");
            else if (eop.Name === gen_ast.BuilderOperators.IdxMay)
                return this.s("(").emitExpr(eop.Operands[0]).s(".TryGetValue(").emitExpr(eop.Operands[1]).s(", out var " + "_".repeat(++anonVarCounter) + ") ? (" + "_".repeat(anonVarCounter) + ", true) : (default, false))");
        const efn = it;
        if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
            return this
                .s("(")
                .each(efn.Args, ", ", _ => this.emitTypeRef(_.Type).s(" ").s(_.Name))
                .s(") => ").emitInstr(efn.Body);
        return super.emitExpr(it);
    }
    emitTypeRef(it) {
        const tmay = this.typeMaybe(it);
        if (tmay)
            return this.emitTypeRef(tmay.Maybe)
                .s(typeRefNullable(tmay.Maybe) ? "" : "?");
        const tcoll = this.typeColl(it);
        if (tcoll)
            return (tcoll.KeysOf === null) ? this.s("List<").emitTypeRef(tcoll.ValsOf).s(">") :
                (tcoll.KeysOf === undefined) ? this.emitTypeRef(tcoll.ValsOf).s("[]") :
                    this.s("Dictionary<").emitTypeRef(tcoll.KeysOf).s(", ").emitTypeRef(tcoll.ValsOf).s(">");
        const ttup = this.typeTup(it);
        if (ttup)
            return this.s("(").each(ttup.TupOf, ", ", t => this.emitTypeRef(t)).s(")");
        const tfun = this.typeFunc(it);
        if (tfun)
            return (!tfun.To)
                ? this.s(tfun.From.length ? "Action<" : "Action").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(tfun.From.length ? ">" : "")
                : this.s("Func<").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(", ").emitTypeRef(tfun.To).s(">");
        if (it === gen_ast.TypeRefPrim.Real)
            return this.s("double");
        return super.emitTypeRef(it);
    }
    typeRefForField(it, _optional) {
        return typeRefUnMaybe(it, true, false, false);
    }
}
exports.Gen = Gen;
function typeRefNullable(it, forceTrueForBools = false, forceTrueForNums = false, forceTrueForTups = false) {
    const ttup = it;
    const isvt = ((it === gen_ast.TypeRefPrim.Bool && !forceTrueForBools)
        || ((it === gen_ast.TypeRefPrim.Int || it === gen_ast.TypeRefPrim.Real) && !forceTrueForNums)
        || (ttup && ttup.TupOf && ttup.TupOf.length && !forceTrueForTups));
    return !isvt;
}
function typeRefUnMaybe(it, unMaybeBools, unMaybeNums, unMaybeTuples) {
    const tmay = it;
    if (tmay && tmay.Maybe) {
        const ttup = tmay.Maybe;
        if ((unMaybeTuples && ttup && ttup.TupOf && ttup.TupOf.length)
            || (unMaybeBools && tmay.Maybe === gen_ast.TypeRefPrim.Bool)
            || (unMaybeNums && (tmay.Maybe === gen_ast.TypeRefPrim.Int || tmay.Maybe === gen_ast.TypeRefPrim.Real)))
            return typeRefUnMaybe(tmay.Maybe, unMaybeBools, unMaybeNums, unMaybeTuples);
    }
    return it;
}
