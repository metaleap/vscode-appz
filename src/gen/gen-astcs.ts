import * as gen from './gen-basics'
import * as gen_ast from './gen-ast'

export class Gen extends gen_ast.Gen {

    gen(prep: gen.Prep) {
        this.options.oneIndent = "\t"
        this.options.doc.appendArgsToSummaryFor.funcFields = true
        this.options.doc.appendArgsToSummaryFor.methods = true
        this.options.funcOverloads = true
        this.nameRewriters.types.interfaces = _ => "I" + this.caseUp(_)
        super.gen(prep)
    }

    emitIntro(): Gen {
        return this.lines(
            "//" + this.doNotEditComment("csharp"),
            "namespace VscAppz {",
        ).indent().lines(
            "using System;",
            "using System.Collections.Generic;",
            "using Newtonsoft.Json;", "",
            "using " + this.options.idents.typeAny + " = System.Object;",
            "using " + this.options.idents.typeDict + " = Dictionary<string, " + this.options.idents.typeAny + ">;", ""
        )
    }

    emitOutro(): Gen {
        return this.undent().lines("}")
    }

    emitEnum(it: gen_ast.TEnum) {
        this.line("public enum " + it.Name + "{")
            .indented(() => this.each(it.Enumerants, "", e =>
                this.line(e.Name + " = " + e.Value + ",")
            ))
            .line("}")
    }

    emitInterface(it: gen_ast.TInterface) {
        this.line("public interface " + it.Name + " {")
            .indented(() => this.each(it.Methods, "", m => this.ln(() =>
                this.emitTypeRef(m.Type).s(" ", m.Name)
                    .when(m.Args && m.Args.length, () =>
                        this.s("(").each(m.Args, ", ", a =>
                            this.emitTypeRef(a.Type).s(" ", a.Name, " = default")
                        ).s(")"),
                    ).s(";")
            )))
            .line("}")
    }

    emitStruct(it: gen_ast.TStruct) {
        this.line("public partial class " + it.Name + " {")
            .indented(() => this.each(it.Fields, "", fld =>
                this.line(fld.Json.Excluded ? "[JsonIgnore]"
                    : `[JsonProperty("${fld.Json.Name}")` + (fld.Json.Required ? ", JsonRequired]" : "]")
                ).ln(() => this
                    .s("public ")
                    .emitTypeRef(typeRefUnmaybe(fld.Type, true))
                    .s(" ", fld.Name, ";")
                )))
            .line("}")
    }

    onBeforeEmitImpls(...interfaces: gen_ast.TInterface[]) {
        //internal partial class impl : IWindow {
        this.line("internal partial class "
            + this.options.idents.typeImpl + " : "
            + interfaces.map(_ => _.Name).join(", ") + " {").indent()
    }

    onAfterEmitImpls() {
        this.undent().line("}")
    }

    emitFuncImpl(it: gen_ast.Func) {
        const tstr = it.Type as gen_ast.TStruct
        const tif = it.Type as gen_ast.TInterface
        console.log(it.Name, (tstr && tstr.Fields) ? tstr.Name : "(nostruct)", (tif && tif.Methods) ? tif.Name : "(noiface)")
        super.emitFuncImpl(it)
    }

    emitTypeRef(it: gen_ast.TypeRef): Gen {
        if (it === gen_ast.TypeRefPrim.Dict)
            return this.s(this.options.idents.typeDict)

        const tmay = this.typeMaybe(it)
        if (tmay) return tmay.Maybe === gen_ast.TypeRefPrim.Bool || tmay.Maybe === gen_ast.TypeRefPrim.Int || this.typeTup(tmay.Maybe)
            ? this.s("Nullable<").emitTypeRef(tmay.Maybe).s(">")
            : this.emitTypeRef(tmay.Maybe)

        const tarr = this.typeArr(it)
        if (tarr) return (tarr.AsList)
            ? this.s("List<").emitTypeRef(tarr.ArrOf).s(">")
            : this.emitTypeRef(tarr.ArrOf).s("[]")

        const ttup = this.typeTup(it)
        if (ttup) return this.s("(").each(ttup.TupOf, ", ", t =>
            this.emitTypeRef(t)
        ).s(')')

        const tfun = this.typeFunc(it)
        if (tfun) return (!tfun.To)
            ? this.s("Action<").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(">")
            : this.s("Func<").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(", ").emitTypeRef(tfun.To).s(">")

        return super.emitTypeRef(it)
    }

}

function typeRefUnmaybe(it: gen_ast.TypeRef, unmaybeBools: boolean = false, unmaybeInts: boolean = false, unmaybeTuples: boolean = false): gen_ast.TypeRef {
    const tmay = it as gen_ast.TypeRefMaybe
    if (tmay && tmay.Maybe) {
        const ttup = tmay.Maybe as gen_ast.TypeRefTup
        if ((unmaybeTuples && ttup && ttup.TupOf && ttup.TupOf.length)
            || (unmaybeBools && tmay.Maybe === gen_ast.TypeRefPrim.Bool)
            || (unmaybeInts && tmay.Maybe === gen_ast.TypeRefPrim.Int))
            return tmay.Maybe
    }
    return it
}
