import * as gen from './gen-basics'
import * as gen_ast from './gen-ast'


let anonVarCounter: number


export class Gen extends gen_ast.Gen {

    gen(prep: gen.Prep) {
        anonVarCounter = 1
        this.options.oneIndent = "\t"
        this.options.doc.appendArgsToSummaryFor.funcFields = true
        this.options.doc.appendArgsToSummaryFor.methods = true
        this.options.funcOverloads = true
        this.nameRewriters.types.interfaces = _ => "I" + this.caseUp(_)
        super.gen(prep)
    }

    emitIntro(): Gen {
        return this.lines(
            "// " + this.doNotEditComment("csharp"),
            "namespace VscAppz {",
        ).indent().lines(
            "using System;",
            "using System.Collections.Generic;",
            "using Newtonsoft.Json;", "",
            "using " + this.options.idents.typeAny + " = System.Object;",
            "using " + this.options.idents.typeDict + " = System.Collections.Generic.Dictionary<string, object>;", ""
        )
    }

    emitOutro(): Gen {
        return this.undent().lines("}")
    }

    emitDocs(it: (gen_ast.WithDocs & gen_ast.WithName)): Gen {
        if (it.Docs && it.Docs.length)
            for (const doc of it.Docs)
                if (doc.Lines && doc.Lines.length)
                    if (doc.ForParam && doc.ForParam.length)
                        this.line("/// <param name=\"" + doc.ForParam + "\">" + doc.Lines.join(" ") + "</param>")
                    else if (doc.Lines.length > 1)
                        this.line("/// <summary>")
                            .lines(...doc.Lines.map(_ => "/// " + _))
                            .line("/// </summary>")
                    else
                        this.line("/// <summary>" + doc.Lines[0] + "</summary>")
        return this
    }

    emitEnum(it: gen_ast.TEnum) {
        this.emitDocs(it)
            .line("public enum " + it.Name + " {")
            .indented(() => this.each(it.Enumerants, "\n", e =>
                this.emitDocs(e).line(e.Name + " = " + e.Value + ",")
            ))
            .lines("}", "")
    }

    emitInterface(it: gen_ast.TInterface) {
        this.emitDocs(it)
            .line("public interface " + it.Name + " {").indented(() =>
                this.each(it.Methods, "\n", m =>
                    this.emitDocs(m).lf()
                        .emitTypeRef(m.Type).s(" ", m.Name)
                        .when(m.Args && m.Args.length,
                            () => this.s("(").each(m.Args, ", ", a =>
                                this.emitTypeRef(a.Type).s(" ", a.Name, " = default"))
                                .s(");"),
                            () => this.s(" { get; }")
                        ).line()
                )
            )
            .lines("}", "")
    }

    emitStruct(it: gen_ast.TStruct) {
        this.emitDocs(it)
            .line("public partial class " + it.Name + " {").indented(() =>
                this.each(it.Fields, "\n", f =>
                    this.emitDocs(f).line(f.Json.Excluded
                        ? "[JsonIgnore]"
                        : `[JsonProperty("${f.Json.Name}")` + (this.typeTup(this.typeUnmaybe(f.Type)) ? ", JsonConverter(typeof(json.valueTuples))" : "") + (f.Json.Required ? ", JsonRequired]" : "]")
                    ).when((f.Type === gen_ast.TypeRefPrim.String && f.FuncFieldRel),
                        () => this.line("[System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]")
                    ).ln(() => this
                        .s("public ")
                        .emitTypeRef(f.Type)
                        .s(" ", f.Name, ";")
                    ))
            ).lines("}", "")
    }

    onBeforeEmitImpls(...interfaces: gen_ast.TInterface[]) {
        this.line("internal partial class "
            + this.options.idents.typeImpl + " : "
            + interfaces.map(_ => _.Name).join(", ") + " {").line().indent()
    }

    onAfterEmitImpls() {
        this.undent().lines("}", "")
    }

    emitFuncImpl(it: gen_ast.Func) {
        let struct = it.Type as gen_ast.TStruct,
            iface = it.Type as gen_ast.TInterface
        [struct, iface] = [(struct && struct.Fields) ? struct : null, (iface && iface.Methods) ? iface : null]

        const isproperty = !(it.Func.Args && it.Func.Args.length)
        const emitsigheadln = () =>
            this.lf(iface ? "" : "internal ").emitTypeRef(it.Func.Type)
                .s(" ", (iface ? (iface.Name + ".") : "") + it.Name)
                .when(isproperty,
                    () => this.s(" { get "),
                    () => this.s("(")
                        .each(it.Func.Args, ", ", a => this.emitTypeRef(a.Type).s(" ", a.Name))
                        .s(") "),
                )

        if (struct)
            this.line("public partial class " + struct.Name + " {")
                .indented(() =>
                    emitsigheadln().emitInstr(it.Func.Body).line()
                ).lines("}", "")
        else if (iface)
            emitsigheadln()
                .emitInstr(it.Func.Body)
                .s(isproperty ? " }" : "").lines("", "")
        else
            throw it;
    }

    emitInstr(it: gen_ast.Instr): Gen {
        if (it) {
            const iret = it as gen_ast.IRet
            if (iret && iret.Ret !== undefined)
                return this.ln(() =>
                    this.s("return ").emitExpr((!iret.Ret) ? undefined : iret.Ret).s(";"))

            const ivar = it as gen_ast.IVar
            if (ivar && ivar.Name)
                return this.ln(() =>
                    this.emitTypeRef(ivar.Type).s(" ", ivar.Name, " = default;"))

            const iset = it as gen_ast.ISet
            if (iset && iset.SetWhat && iset.SetTo)
                return this.ln(() =>
                    this.emitExpr(iset.SetWhat).s(" = ").emitExpr(iset.SetTo).s(";"))

            const idictdel = it as gen_ast.IDictDel
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() =>
                    this.emitExpr(idictdel.DelFrom).s(".Remove(").emitExpr(idictdel.DelWhat).s(");"))

            const icolladd = it as gen_ast.ICollAdd
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() =>
                    this.emitExpr(icolladd.AddTo).s('.Add(').emitExpr(icolladd.AddWhat).s(");"))

            const ecall = it as gen_ast.ECall
            if (ecall && ecall.Call)
                return this.ln(() =>
                    this.emitExpr(ecall).s(";"))

            const iblock = it as gen_ast.IBlock
            if (iblock && iblock.Instrs !== undefined) {
                let endeol = false
                if (endeol = iblock.Lock ? true : false)
                    this.ln(() => this.s("lock (").emitExpr(iblock.Lock).s(") {"))
                else if (endeol = (iblock.ForEach && iblock.ForEach.length) ? true : false)
                    this.ln(() => this.s("foreach (var ", iblock.ForEach[0].Name, " in ").emitExpr(iblock.ForEach[1]).s(") {"))
                else if (endeol = (iblock.If && iblock.If.length) ? true : false)
                    this.ln(() => this.s("if (").emitExpr(iblock.If[0]).s(") {"))
                else
                    this.s("{").line()

                this.indented(() =>
                    iblock.Instrs.forEach(_ => this.emitInstr(_)))

                this.lf().s("}")

                if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                    this.s(" else ").emitInstr(iblock.If[1]).lf()

                return endeol ? this.line() : this
            }

        }
        return super.emitInstr(it)
    }

    emitExpr(it: gen_ast.Expr): Gen {
        const ecollnew = it as gen_ast.ECollNew
        if (ecollnew && ecollnew.Capacity !== undefined)
            return this.when(ecollnew.ElemTypeIfList,
                () => this.s("new List<").emitTypeRef(ecollnew.ElemTypeIfList).s(">"),
                () => this.s("new " + this.options.idents.typeDict)
            ).s("(").emitExpr(ecollnew.Capacity).s(")")

        const enew = it as gen_ast.ENew
        if (enew && enew.New)
            return this.s("new ").emitTypeRef(enew.New).s("()")

        const econv = it as gen_ast.EConv
        if (econv && econv.Conv && econv.To) {
            const tval = typeRefUnMaybe(econv.To, true, true, true)
            return this.s("(").emitExpr(econv.Conv).s(" is ").emitTypeRef(tval).s(") ? (((").emitTypeRef(tval).s(")(").emitExpr(econv.Conv).s(")), true) : (default, false)")
        }

        const elen = it as gen_ast.ELen
        if (elen && elen.LenOf)
            return this.emitExpr(elen.LenOf).s(elen.IsArr ? ".Length" : ".Count")

        const etup = it as gen_ast.ETup
        if (etup && etup.Items !== undefined)
            return this.s("(").each(etup.Items, ", ", _ => { this.emitExpr(_) }).s(")")

        const eop = it as gen_ast.EOp
        if (eop && eop.Name && eop.Operands && eop.Operands.length)
            if (eop.Name === gen_ast.BuilderOperators.Is)
                return this.s("(null != ").emitExpr(eop.Operands[0]).s(")")
            else if (eop.Name === gen_ast.BuilderOperators.Isnt)
                return this.s("(null == ").emitExpr(eop.Operands[0]).s(")")
            else if (eop.Name === gen_ast.BuilderOperators.Idx)
                return this.emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]")
            else if (eop.Name === gen_ast.BuilderOperators.IdxMay)
                return this.s("(").emitExpr(eop.Operands[0]).s(".TryGetValue(").emitExpr(eop.Operands[1]).s(", out var " + "_".repeat(++anonVarCounter) + ") ? (" + "_".repeat(anonVarCounter) + ", true) : (default, false))")

        const efn = it as gen_ast.EFunc
        if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
            return this
                .s("(")
                .each(efn.Args, ", ", _ => this.emitTypeRef(_.Type).s(" ").s(_.Name))
                .s(") => ").emitInstr(efn.Body)

        return super.emitExpr(it)
    }

    emitTypeRef(it: gen_ast.TypeRef): Gen {
        const tmay = this.typeMaybe(it)
        if (tmay) return this.emitTypeRef(tmay.Maybe)
            .s(typeRefNullable(tmay.Maybe) ? "" : "?")

        const tarr = this.typeArr(it)
        if (tarr) return (tarr.AsList)
            ? this.s("List<").emitTypeRef(tarr.ArrOf).s(">")
            : this.emitTypeRef(tarr.ArrOf).s("[]")

        const ttup = this.typeTup(it)
        if (ttup) return this.s("(").each(ttup.TupOf, ", ", t =>
            this.emitTypeRef(t)
        ).s(")")

        const tfun = this.typeFunc(it)
        if (tfun) return (!tfun.To)
            ? this.s("Action<").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(">")
            : this.s("Func<").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(", ").emitTypeRef(tfun.To).s(">")

        return super.emitTypeRef(it)
    }

    typeRefForField(it: gen_ast.TypeRef, _optional: boolean): gen_ast.TypeRef {
        return typeRefUnMaybe(it, true, false, false)
    }

}

function typeRefNullable(it: gen_ast.TypeRef, forceTrueForBools: boolean = false, forceTrueForInts: boolean = false, forceTrueForTups: boolean = false) {
    const ttup = it as gen_ast.TypeRefTup
    const isvt = ((it === gen_ast.TypeRefPrim.Bool && !forceTrueForBools)
        || (it === gen_ast.TypeRefPrim.Int && !forceTrueForInts)
        || (ttup && ttup.TupOf && ttup.TupOf.length && !forceTrueForTups)
    )
    return !isvt
}

function typeRefUnMaybe(it: gen_ast.TypeRef, unMaybeBools: boolean, unMaybeInts: boolean, unMaybeTuples: boolean): gen_ast.TypeRef {
    const tmay = it as gen_ast.TypeRefMaybe
    if (tmay && tmay.Maybe) {
        const ttup = tmay.Maybe as gen_ast.TypeRefTup
        if ((unMaybeTuples && ttup && ttup.TupOf && ttup.TupOf.length)
            || (unMaybeBools && tmay.Maybe === gen_ast.TypeRefPrim.Bool)
            || (unMaybeInts && tmay.Maybe === gen_ast.TypeRefPrim.Int))
            return typeRefUnMaybe(tmay.Maybe, unMaybeBools, unMaybeInts, unMaybeTuples)
    }
    return it
}
