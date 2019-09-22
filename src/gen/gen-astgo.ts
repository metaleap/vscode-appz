import * as gen from './gen-basics'
import * as gen_ast from './gen-ast'

export class Gen extends gen_ast.Gen {

    gen(prep: gen.Prep) {
        this.options.oneIndent = "\t"
        this.options.doc.appendArgsToSummaryFor.funcFields = true
        this.options.doc.appendArgsToSummaryFor.methods = true
        this.options.idents.curInst = "me"
        super.gen(prep)
    }

    emitIntro(): Gen {
        return this.lines(
            "package vscAppz",
            "// " + this.doNotEditComment("golang"),
            "")
    }

    emitOutro(): Gen { return this }

    emitDocs(it: (gen_ast.WithDocs & gen_ast.WithName)): Gen {
        if (it.Docs && it.Docs.length)
            for (const doc of it.Docs)
                if (doc.Lines && doc.Lines.length)
                    if (!(doc.ForParam && doc.ForParam.length))
                        this.lines(...doc.Lines.map(_ => "// " + _))
        return this
    }

    emitEnum(it: gen_ast.TEnum) {
        this.emitDocs(it)
            .line("type " + it.Name + " int")
            .line("const (")
            .indented(() => this.each(it.Enumerants, "\n", e =>
                this.emitDocs(e).line(it.Name + e.Name + " " + it.Name + " = " + e.Value)
            ))
            .lines(")", "")
    }

    emitInterface(it: gen_ast.TInterface) {
        this.emitDocs(it)
            .line("type " + it.Name + " interface {").indented(() =>
                this.each(it.Methods, "\n", m =>
                    this.emitDocs(m).lf()
                        .s(m.Name)
                        .s("(").each(m.Args, ", ", a =>
                            this.s(a.Name, " ").emitTypeRef(a.Type))
                        .s(") ")
                        .emitTypeRef(m.Type)
                        .line()
                )
            )
            .lines("}", "")
    }

    emitStruct(it: gen_ast.TStruct) {
        this.emitDocs(it)
            .line("type " + it.Name + " struct {").indented(() =>
                this.each(it.Fields, "\n", f => this.emitDocs(f).ln(() =>
                    this.s(f.Name, " ").emitTypeRef(f.Type).s(" `json:\"")
                        .when(f.Json.Excluded,
                            () => this.s("-"),
                            () => this.s(f.Json.Name + (f.Json.Required ? "" : ",omitempty"))
                        ).s("\"`")
                ))
            ).lines("}", "")
    }

    emitFuncImpl(it: gen_ast.Func) {
        let struct = it.Type as gen_ast.TStruct,
            iface = it.Type as gen_ast.TInterface
        [struct, iface] = [(struct && struct.Fields) ? struct : null, (iface && iface.Methods) ? iface : null]

        const emitsigheadln = () =>
            this.lf("func (", this.options.idents.curInst, " *", struct ? struct.Name : this.options.idents.typeImpl, ") ",
                it.Name, "(").each(it.Func.Args, ", ", a =>
                    this.s(a.Name, " ").emitTypeRef(a.Type)
                ).s(") ").when(it.Func.Type,
                    () => this.emitTypeRef(it.Func.Type).s(" {"),
                    () => this.s("{"),
                ).indent().line()

        if (struct)
            emitsigheadln().undent().lines("}", "")
        else if (iface)
            emitsigheadln().undent().lines("}", "")
    }

    emitTypeRef(it: gen_ast.TypeRef): Gen {
        if (it === null)
            return this

        const tmay = this.typeMaybe(it)
        if (tmay)
            return this.s(typeRefNilable(this, tmay.Maybe) ? "" : "*").emitTypeRef(tmay.Maybe)

        const tarr = this.typeArr(it)
        if (tarr)
            return this.s("[]").emitTypeRef(tarr.ArrOf)

        const ttup = this.typeTup(it)
        if (ttup) // until multi-typed tuples arrive for real..
            return this.s("[]").emitTypeRef(ttup.TupOf[0])

        const tfun = this.typeFunc(it)
        if (tfun)
            return this.s("func(").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(tfun.To ? ") " : ")").emitTypeRef(tfun.To)

        return super.emitTypeRef(it)
    }

    typeRefForField(it: gen_ast.TypeRef, optional: boolean): gen_ast.TypeRef {
        return typeRefUnMaybe(it, true, optional, optional)
    }

}

function typeRefNilable(_: Gen, it: gen_ast.TypeRef, forceTrueForBools: boolean = false, forceTrueForInts: boolean = false, forceTrueForStrings: boolean = false) {
    return it === gen_ast.TypeRefPrim.Any || it === gen_ast.TypeRefPrim.Dict
        || _.typeArr(it) || _.typeMaybe(it) || _.typeFunc(it) || _.typeTup(it)
        || (forceTrueForBools && it === gen_ast.TypeRefPrim.Bool)
        || (forceTrueForInts && it === gen_ast.TypeRefPrim.Int)
        || (forceTrueForStrings && it === gen_ast.TypeRefPrim.String)
}

function typeRefUnMaybe(it: gen_ast.TypeRef, unMaybeBools: boolean, unMaybeInts: boolean, unMaybeStrings: boolean): gen_ast.TypeRef {
    const tmay = it as gen_ast.TypeRefMaybe
    if (tmay && tmay.Maybe) {
        if ((unMaybeStrings && tmay.Maybe === gen_ast.TypeRefPrim.String)
            || (unMaybeBools && tmay.Maybe === gen_ast.TypeRefPrim.Bool)
            || (unMaybeInts && tmay.Maybe === gen_ast.TypeRefPrim.Int))
            return typeRefUnMaybe(tmay.Maybe, unMaybeBools, unMaybeInts, unMaybeStrings)
    }
    return it
}
