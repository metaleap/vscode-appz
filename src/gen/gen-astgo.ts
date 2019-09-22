import * as gen from './gen-basics'
import * as gen_ast from './gen-ast'

export class Gen extends gen_ast.Gen {

    gen(prep: gen.Prep) {
        this.options.oneIndent = "\t"
        this.options.doc.appendArgsToSummaryFor.funcFields = true
        this.options.doc.appendArgsToSummaryFor.methods = true
        super.gen(prep)
    }

    emitIntro(): Gen {
        return this.lines(
            "package vscAppz",
            "// " + this.doNotEditComment("golang"),
            "type " + this.options.idents.typeAny + " = interface{}",
            "type Dict = map[string]" + this.options.idents.typeAny,
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
            return this.s("func (").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(tfun.To ? ") " : ")").emitTypeRef(tfun.To)

        return super.emitTypeRef(it)
    }

}

function typeRefNilable(_: Gen, it: gen_ast.TypeRef, forceTrueForBools: boolean = false, forceTrueForInts: boolean = false, forceTrueForStrings: boolean = false) {
    return it === gen_ast.TypeRefPrim.Any || it === gen_ast.TypeRefPrim.Dict
        || _.typeArr(it) || _.typeMaybe(it) || _.typeFunc(it) || _.typeTup(it)
        || (forceTrueForBools && it === gen_ast.TypeRefPrim.Bool)
        || (forceTrueForInts && it === gen_ast.TypeRefPrim.Int)
        || (forceTrueForStrings && it === gen_ast.TypeRefPrim.String)
}
