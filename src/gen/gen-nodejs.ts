import * as gen from './gen-basics'
import * as gen_ast from './gen-ast'


let prevImplTypeName: string


export class Gen extends gen_ast.Gen {

    gen(prep: gen.Prep) {
        this.options.oneIndent = " ".repeat(4)
        this.options.doc.appendArgsToSummaryFor.funcFields = true
        this.options.doc.appendArgsToSummaryFor.methods = false
        this.options.funcOverloads = false
        this.nameRewriters.types.interfaces = _ => this.caseUp(_)
        prevImplTypeName = ""
        super.gen(prep)
    }

    emitIntro(): Gen {
        return this.lines(
            "// " + this.doNotEditComment("nodesjs"),
            "import * as aux from './aux'",
            "import { OnError } from './vsc-appz'",
            "type ipcMsg = aux.ipcMsg",
            "type Cancel = aux.Cancel",
            "type Disposable = aux.Disposable",
            "interface fromJson { populateFrom: (_: any) => boolean }",
            "",
            "abstract class implBase {",
            "    impl: impl",
            "    constructor(impl: impl) { this.impl = impl }",
            "    Impl() { return this.impl as any as aux.impl /* crikey, codegen life.. */ }",
            "}",
            "",
            "function new_ipcMsg() { return new aux.ipcMsg() }",
            "function new_Disposable() { return new aux.Disposable() }",
            ""
        )
    }

    emitOutro(): Gen { return this }

    emitDocs(it: (gen_ast.WithDocs & gen_ast.WithName)): Gen {
        if (it.Docs && it.Docs.length) {
            this.line("/**")
            for (const doc of it.Docs)
                if (doc.Lines && doc.Lines.length)
                    if (!(doc.ForParam && doc.ForParam.length))
                        this.lines(...doc.Lines.map(_ => " * " + _)).line()
                    else
                        this.line(" * @" + (doc.ForParam === "return" ? "" : "param ") + doc.ForParam + " " + doc.Lines.join(" "))
            this.line(" */")
        }
        return this
    }

    emitEnum(it: gen_ast.TEnum) {
        this.emitDocs(it)
            .line("export enum " + it.Name + " {")
            .indented(() => this.each(it.Enumerants, "\n", e =>
                this.emitDocs(e).line(e.Name + " = " + e.Value + ",")
            ))
            .lines("}", "")
    }

    emitInterface(it: gen_ast.TInterface) {
        this.emitDocs(it)
            .line("export interface " + it.Name + " {").indented(() => {
                this.each(it.Methods, "\n", m =>
                    this.emitDocs(m).lf()
                        .s(m.Name)
                        .when(m.Args && m.Args.length,
                            () => {
                                this.s(": (")
                                    .each(m.Args, ", ", a =>
                                        this.s(a.Name)
                                            .s((a.fromPrep && a.fromPrep.optional) ? "?: " : ": ")
                                            .emitTypeRef(a.Type)
                                    )
                                    .s(") => ").emitTypeRef(m.Type)
                            },
                            () =>
                                this.s(": ").emitTypeRef(m.Type)
                        )
                        .line()
                )
            })
            .lines("}", "")
    }

    emitStruct(it: gen_ast.TStruct) {
        this.emitDocs(it)
            .line("export interface " + it.Name + (it.IsIncoming ? " extends fromJson {" : " {")).indented(() => {
                this.each(it.Fields, "\n", f =>
                    this.emitDocs(f)
                        .ln(() => {
                            this.s(f.Name)
                                .s((f.fromPrep && f.fromPrep.optional) ? "?: " : ": ")
                                .emitTypeRef(f.Type)
                        })
                )
            })
            .lines("}", "")
        if (it.IsIncoming)
            this.lines(
                "function new_" + it.Name + " () {",
                "    let me: " + it.Name,
                "    me = { populateFrom: _ => " + it.Name + "_populateFrom.call(me, _) } as " + it.Name,
                "    return me",
                "}",
                ""
            )
    }

    onBeforeEmitImpls(structs: boolean) {
        if (!structs) {
            const itop = this.allInterfaces.find(_ => _.IsTop)
            this
                .line("export abstract class impl implements " + itop.Name + " {")
                .indented(() => {
                    for (const iface of this.allInterfaces) if (iface !== itop)
                        this.line(iface.Name + ": " + iface.Name)
                    this.line("constructor() {").indented(() => {
                        for (const iface of this.allInterfaces) if (iface !== itop)
                            this.line(`this.${iface.Name} = new impl${iface.Name}(this)`)
                    }).lines("}")
                })
                .lines("}", "")
        }
    }

    onAfterEmitImpls(structs: boolean) {
        if (!structs) {
            if (prevImplTypeName && prevImplTypeName.length)
                this.undent().lines("}", "")
            prevImplTypeName = ""
        }
    }

    emitMethodImpl(it: gen_ast.TypeRefOwn, method: gen_ast.Method, fillBody: ((interfaceOrStruct: gen_ast.TypeRefOwn, method: gen_ast.Method, _: gen_ast.Builder, bodyToFill: gen_ast.Instr[]) => void)) {
        const iface = this.allInterfaces.find(_ => _.Name === it.Name)
        if (iface) {
            if (iface.IsTop)
                return
            if (it.Name !== prevImplTypeName) {
                if (prevImplTypeName && prevImplTypeName.length)
                    this.undent().lines("}", "")
                prevImplTypeName = it.Name
                if (iface)
                    this.line("class impl" + it.Name + " extends implBase implements " + it.Name + " {")
                        .indent()
                        .line("constructor(impl: impl) { super(impl) }")
            }
        }
        super.emitMethodImpl(it, method, fillBody)
    }

    emitFuncImpl(it: gen_ast.Func) {
        const tnamed = it.Type as gen_ast.TypeRefOwn
        const struct = (tnamed && tnamed.Name && tnamed.Name.length) ? this.allStructs[tnamed.Name] : null
        this.lf().s((struct ? ("function " + struct.Name + "_") : "") + it.Name + "(")
            .s(struct ? ("this: " + struct.Name + ", ") : "")
            .each(it.Func.Args, ", ", a =>
                this.s(a.Name, (a.fromPrep && a.fromPrep.optional) ? "?: " : ": ").emitTypeRef(a.Type)
            )
            .s("): ")
            .emitTypeRef(it.Func.Type).s(" ")
            .emitInstr(it.Func.Body)
            .lines("", "")
    }

    emitExpr(it: gen_ast.Expr): Gen {
        if (it) {
            const ecollnew = it as gen_ast.ECollNew
            if (ecollnew && (ecollnew.Cap !== undefined || ecollnew.Len !== undefined))
                return (ecollnew.Len !== undefined) ? this.s("new Array(").emitExpr(ecollnew.Len).s(")")
                    : this.s(ecollnew.ElemType ? "[]" : "{}")

            const enew = it as gen_ast.ENew
            if (enew && enew.New)
                return this.s("new_").emitTypeRef(enew.New).s("()")

            const elen = it as gen_ast.ELen
            if (elen && elen.LenOf)
                return this.emitExpr(elen.LenOf).s(".length")

            const eop = it as gen_ast.EOp
            if (eop && eop.Name && eop.Operands && eop.Operands.length)
                if (eop.Name === gen_ast.BuilderOperators.Is)
                    return this.s("(undefined !== ").emitExpr(eop.Operands[0]).s(" && null !== ").emitExpr(eop.Operands[0]).s(")")
                else if (eop.Name === gen_ast.BuilderOperators.Isnt)
                    return this.s("(undefined === ").emitExpr(eop.Operands[0]).s(" || null === ").emitExpr(eop.Operands[0]).s(")")
                else if (eop.Name === gen_ast.BuilderOperators.Addr || eop.Name === gen_ast.BuilderOperators.Deref)
                    return this.emitExpr(eop.Operands[0])
                else if (eop.Name === gen_ast.BuilderOperators.Idx)
                    return this.emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]")
                else if (eop.Name === gen_ast.BuilderOperators.IdxMay)
                    return this.s("[").emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]").s(", undefined !== ").emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]").s("]")
                else if (eop.Name === gen_ast.BuilderOperators.Eq)
                    return this.emitExprs(' === ', ...eop.Operands)
                else if (eop.Name === gen_ast.BuilderOperators.Neq)
                    return this.emitExprs(' !== ', ...eop.Operands)

            const efn = it as gen_ast.EFunc
            if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
                return this
                    .s("(")
                    .each(efn.Args, ", ", _ =>
                        this.s(_.Name, (_.fromPrep && _.fromPrep.optional) ? "?: " : ": ")
                            .emitTypeRef(_.Type))
                    .s("): ").emitTypeRef(efn.Type).s(" => ")
                    .emitInstr(efn.Body)

            const econv = it as gen_ast.EConv
            if (econv && econv.Conv && econv.To)
                if (econv.Cast)
                    return this.emitExpr(econv.Conv)
                else {
                    const t = this.typeUnMaybe(econv.To)
                    const iscoll = this.typeColl(t)
                    return this.s('[').emitExpr(econv.Conv).s(' as ').emitTypeRef(t).s(', ')
                        .caseOf(
                            [iscoll, () =>
                                this.s('(typeof ').emitExpr(econv.Conv).s(' === "object") && ').when(
                                    iscoll.KeysOf, () => this.s('true'), () => this.s('(typeof ').emitExpr(econv.Conv).s('["length"] === "number")'))
                            ],
                            [t === gen_ast.TypeRefPrim.Dict, () =>
                                this.s('typeof ').emitExpr(econv.Conv).s(' === "object"')
                            ],
                            [t === gen_ast.TypeRefPrim.Bool, () =>
                                this.s('typeof ').emitExpr(econv.Conv).s(' === "boolean"')
                            ],
                            [t === gen_ast.TypeRefPrim.Int || t === gen_ast.TypeRefPrim.Real, () =>
                                this.s('typeof ').emitExpr(econv.Conv).s(' === "number"')
                            ],
                            [t === gen_ast.TypeRefPrim.String, () =>
                                this.s('typeof ').emitExpr(econv.Conv).s(' === "string"')
                            ],
                            [true, () => this.s('true')],
                        )
                        .s(']')
                }
        }
        return super.emitExpr(it)
    }

    emitInstr(it: gen_ast.Instr): Gen {
        if (it) {
            const ivar = it as gen_ast.IVar
            if (ivar && ivar.Name && ivar.Type)
                return this.ln(() =>
                    this.s("let ", ivar.Name, ": ").emitTypeRef(ivar.Type))

            const idictdel = it as gen_ast.IDictDel
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() =>
                    this.s("delete ").emitExpr(idictdel.DelFrom).s("[").emitExpr(idictdel.DelWhat).s("]"))

            const icolladd = it as gen_ast.ICollAdd
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() =>
                    this.emitExpr(icolladd.AddTo).s('.push(').emitExpr(icolladd.AddWhat).s(')'))

            const iblock = it as gen_ast.IBlock
            if (iblock && iblock.Instrs !== undefined) {
                let endeol = false
                if (endeol = iblock.Lock ? true : false)
                    this.ln(() => this.s("{"))
                else if (endeol = (iblock.ForEach && iblock.ForEach.length) ? true : false)
                    this.ln(() => this.s("for (const ", iblock.ForEach[0].Name, " of ").emitExpr(iblock.ForEach[1]).s(") {"))
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

    emitTypeRef(it: gen_ast.TypeRef): Gen {
        const tmay = this.typeMaybe(it)
        if (tmay) return this.emitTypeRef(tmay.Maybe)

        const tcoll = this.typeColl(it)
        if (tcoll)
            return (!tcoll.KeysOf) ? this.emitTypeRef(tcoll.ValsOf).s("[]")
                : this.s("{ [_:").emitTypeRef(tcoll.KeysOf).s("]: ").emitTypeRef(tcoll.ValsOf).s("}")

        const ttup = this.typeTup(it)
        if (ttup) return this.s("[").each(ttup.TupOf, ", ", t =>
            this.emitTypeRef(t)
        ).s("]")

        const tfun = this.typeFunc(it)
        if (tfun)
            return this.s("(")
                .each(tfun.From, ", ", t => this.s("_").s(": ").emitTypeRef(t))
                .s(") => ").emitTypeRef(tfun.To)

        if (it === gen_ast.TypeRefPrim.Real || it === gen_ast.TypeRefPrim.Int)
            return this.s("number")
        if (it === gen_ast.TypeRefPrim.Bool)
            return this.s("boolean")
        if (it === gen_ast.TypeRefPrim.Dict)
            return this.s("{ [_: string]: any}")

        return super.emitTypeRef(it)
    }

}
