import * as gen from './gen'
import * as gen_syn from './gen-syn'


let prevImplTypeName: string
let jsMode: boolean = false


export class Gen extends gen_syn.Gen {

    gen(prep: gen.Prep) {
        jsMode = false
        this.options.oneIndent = " ".repeat(4)
        this.options.doc.appendArgsToSummary.forMethods = false
        this.nameRewriters.types.interfaces = _ => this.caseUp(_)
        this.nameRewriters.fields = _ => this.caseLo(_)
        prevImplTypeName = ""
        super.gen(prep)
    }

    genDemos() {
        jsMode = true
        super.genDemos()
    }

    emitIntro(): Gen {
        return this.isDemos ? this.lines(
            "const main = require('./main')",
            'Object.defineProperty(exports, "__esModule", { value: true })',
            "// " + this.doNotEditComment("nodejs"),
            "let vsc, appName, cmdName, strFmt, quit, cancelIn, demo_Window_ShowInputBox, setOutChan, logLn, strLo, strUp, nums1To, quickPickItemsFrom",
            "exports.onUpAndRunning = () => { /* crikey!.. */ vsc = main.vsc; appName = main.appName; cmdName = main.cmdName; strFmt = main.strFmt; quit = main.quit; cancelIn = main.cancelIn; demo_Window_ShowInputBox = main.demo_Window_ShowInputBox; setOutChan = main.setOutChan; logLn = main.logLn; strLo = main.strLo; strUp = main.strUp; nums1To = main.nums1To; quickPickItemsFrom = main.quickPickItemsFrom; onUpAndRunning() }",
            "exports.demosMenu = demosMenu",
            "",
        ) : this.lines(
            "// " + this.doNotEditComment("nodejs"),
            "import * as core from './core'",
            "import { " + gen.idents.coreMethodOnErr + " } from './vsc-appz'",
            "type " + gen.idents.coreTypeMsg + " = core." + gen.idents.coreTypeMsg + "",
            "type " + gen.idents.coreTypeCancel + " = core." + gen.idents.coreTypeCancel + "",
            "type " + gen.idents.coreTypeDisp + " = core." + gen.idents.coreTypeDisp + "",
            "interface fromJson { " + gen.idents.methodLoadFrom + ": (_: any) => boolean }",
            "interface withDisp { " + gen.idents.fldDisp + ": " + gen.idents.coreTypeDisp + " }",
            "interface with" + gen.idents.typeSuffBag + "<T extends fromJson> { " + gen.idents.fldDispObjBag + ": T, toJSON: () => any }",
            "",
            "abstract class implBase {",
            "    impl: impl",
            "    constructor(impl: impl) { this.impl = impl }",
            "    " + gen.idents.methodImpl + "() { return this.impl as any as core.impl /* crikey, codegen life.. */ }",
            "}",
            "",
            "function new" + gen.idents.coreTypeMsg + "() { return new core." + gen.idents.coreTypeMsg + "() }",
            "function new" + gen.idents.coreTypeDisp + "() { return new core." + gen.idents.coreTypeDisp + "() }",
            ""
        )
    }

    emitOutro(): Gen { return this }

    emitDocs(it: gen_syn.WithDocs): Gen {
        this.ensureMethodDocsArgsAndRet(it)
        if (it.Docs && it.Docs.length) {
            this.line("/**")
            for (const doc of it.Docs)
                if (doc.Lines && doc.Lines.length)
                    if (!(doc.ForParam && doc.ForParam.length))
                        this.lines(...doc.Lines.map(_ => " * " + _)).line()
                    else
                        this.line(" * @" + ((doc.ForParam === "return" || doc.ForParam === "returns") ? "" : "param ") + doc.ForParam + " " + doc.Lines.join(" "))
            this.line(" */")
        }
        return this
    }

    emitEnum(it: gen_syn.TEnum) {
        this.emitDocs(it)
            .line("export enum " + it.Name + " {")
            .indented(() => this.each(it.Enumerants, "\n", e =>
                this.emitDocs(e).line(e.Name + " = " + e.Value + ",")
            ))
            .lines("}", "")
    }

    emitInterface(it: gen_syn.TInterface) {
        this.emitDocs(it)
            .line("export interface " + it.Name + " {").indented(() => {
                this.each(it.Methods, "\n", m =>
                    this.emitDocs(m).lf()
                        .s(m.Name)
                        .when(m.IsSubNs || (m.Args && m.Args.length),
                            () => {
                                this.s(": (")
                                    .each(m.Args, ", ", (a, i) =>
                                        this.s(a.Name)
                                            .s(((a.fromPrep && a.fromPrep.optional) || (this.typeMaybe(a.Type) && i === m.Args.length - 1)) ? "?: " : ": ")
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

    emitStruct(it: gen_syn.TStruct) {
        const isdispobj = it.fromPrep && it.fromPrep.isDispObj
        const dispobjffuncs = isdispobj ? it.fromPrep.fields.filter(_ => gen.typeFun(_.typeSpec)) : []
        const dispobjfprops = isdispobj ? it.fromPrep.fields.filter(_ => !gen.typeFun(_.typeSpec)) : []
        const dispobjmethods: gen.PrepField[] = []
        const isobjpropsof = it.fromPrep ? it.fromPrep.isPropsOfStruct : null
        const objpropssetter = isobjpropsof ? it.fromPrep.fields.some(_ => (!_.readOnly) && !gen.typeFun(_.typeSpec)) : false
        this.emitDocs(it)
            .line("export interface " + it.Name + (it.IsIncoming ? " extends fromJson" + (isdispobj ? (", withDisp" + (dispobjfprops.length ? (", with" + gen.idents.typeSuffBag + "<" + it.Name + gen.idents.typeSuffBag + ">") : "")) : "") + " {" : " {")).indented(() => {
                if (isdispobj) {
                    if (dispobjfprops && dispobjfprops.length) {
                        dispobjffuncs.push({ name: gen.idents.methodObjBagPull, typeSpec: { From: [], To: null } })
                        if (dispobjfprops.find(_ => !_.readOnly))
                            dispobjffuncs.push({ name: gen.idents.methodObjBagPush, typeSpec: { From: [it.Name + gen.idents.typeSuffBag], To: null } })
                    }
                    this.each(dispobjffuncs, "\n", f => {
                        const tfun = gen.typeFun(f.typeSpec)
                        dispobjmethods.push(f)
                        this.emitDocs({ Docs: this.b.docs(gen.docs(f.fromOrig)) })
                            .ln(() => {
                                this.s(this.nameRewriters.methods(f.name), ": ")
                                    .emitTypeRef(this.b.typeRef({ From: tfun[0], To: { From: [{ From: [tfun[1]], To: null }], To: null } }))
                            })
                    })
                }
                else {
                    this.each(it.Fields, "\n", f => {
                        const isreadonly = isobjpropsof && f.fromPrep && f.fromPrep.readOnly
                        const isoptional = f.fromPrep && f.fromPrep.optional
                        this.emitDocs(f)
                            .ln(() => {
                                this.s(f.Name)
                                    .s((isoptional && !isreadonly) ? "?: " : ": ")
                                    .emitTypeRef(f.Type)
                            })
                    }).when(isobjpropsof && it.fromPrep.fields.some(_ => !gen.typeFun(_.typeSpec)), () => {
                        if (objpropssetter)
                            this.lines("", gen.idents.methodBagPublish + ": () => (_: () => void) => void")
                        this.lines("", gen.idents.methodBagFetch + ": () => (_: () => void) => void")
                    })
                }
            })
            .lines("}", "")
        if (it.IsIncoming)
            this.lines(
                (it.IsOutgoing ? "export " : "") + "function new" + it.Name + " (): " + it.Name + " {",
                "    let me: " + it.Name,
                "    me = { " + gen.idents.methodLoadFrom + ": _ => " + it.Name + "_" + gen.idents.methodLoadFrom + ".call(me, _), toString: () => JSON.stringify(me, (_, v) => (typeof v === 'function') ? undefined : v)"
                + (isdispobj ? (", toJSON: () => undefined") : (isobjpropsof ? ((objpropssetter ? `, ${gen.idents.methodBagPublish}: () => ${it.Name}_${gen.idents.methodBagPublish}.call(me)` : "") + `, ${gen.idents.methodBagFetch}: () => ${it.Name}_${gen.idents.methodBagFetch}.call(me)`) : ""))
                + " } as " + it.Name
            ).each(dispobjmethods, "", f => {
                const tfun = gen.typeFun(f.typeSpec)
                const args = tfun[0].map((_, i) => 'a' + i).join(', ')
                this.line(`    me.${this.nameRewriters.methods(f.name)} = (${args}) => ${it.Name}_${this.nameRewriters.methods(f.name)}.call(me, ${args})`)
            }).lines(
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
                    this.line("toJSON(): any { return undefined }")
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

    emitMethodImpl(it: gen_syn.TypeRefOwn, method: gen_syn.Method, fillBody: ((interfaceOrStruct: gen_syn.TypeRefOwn, method: gen_syn.Method, _: gen_syn.Builder, bodyToFill: gen_syn.Instr[]) => void)) {
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
        if (method.IsSubNs)
            super.emitMethodImpl(it, method, (_t: gen_syn.TypeRefOwn, _m: gen_syn.Method, _: gen_syn.Builder, body: gen_syn.Instr[]) => {
                body.length = 1
                body[0] = _.iRet(_._(_.eCall(_._(_.eThis(), gen.idents.methodImpl)), method.Name))
            })
        else
            super.emitMethodImpl(it, method, fillBody)
    }

    emitFuncImpl(it: gen_syn.Func) {
        const tnamed = it.Type as gen_syn.TypeRefOwn
        const struct = (tnamed && tnamed.Name && tnamed.Name.length) ? this.allStructs[tnamed.Name] : null
        this.lf().s((struct ? ("function " + struct.Name + "_") : this.isDemos ? "function " : "") + it.Name + "(")
            .s(struct ? ("this: " + struct.Name + ", ") : "")
            .each(it.Func.Args, ", ", (a, i) =>
                this.s(a.Name, jsMode ? "" : (((a.fromPrep && a.fromPrep.optional) || (this.typeMaybe(a.Type) && i === it.Func.Args.length - 1)) ? "?: " : ": ")).emitTypeRef(a.Type)
            )
            .s(jsMode ? ")" : "): ")
            .emitTypeRef(it.Func.Type).s(" ")
            .emitInstr(it.Func.Body)
            .lines("", "")
    }

    emitExpr(it: gen_syn.Expr): Gen {
        if (it) {
            const ecollnew = it as gen_syn.ECollNew
            if (ecollnew && (ecollnew.Cap !== undefined || ecollnew.Len !== undefined))
                return (ecollnew.Len !== undefined) ? this.s("new Array(").emitExpr(ecollnew.Len).s(")")
                    : this.s((ecollnew.ElemType && !ecollnew.KeyType) ? "[]" : "{}")

            const enew = it as gen_syn.ENew
            if (enew && enew.New)
                return this.isDemos ? this.s('{}') : this.s("new", (this.typeUnMaybe(enew.New) as gen_syn.TypeRefOwn).Name, "()")

            const elen = it as gen_syn.ELen
            if (elen && elen.LenOf)
                return this.emitExpr(elen.LenOf).s(".length")

            const elit = it as gen_syn.ELit
            if (elit) {
                const earr = elit.Lit as string[]
                if ((typeof elit.Lit !== 'string') && earr && earr.length !== undefined)
                    return this.s("[").each(earr, ", ", _ => this.emitExpr({ Lit: _ })).s("]")
                if ((typeof elit.Lit === 'string') && elit.FmtArgs && elit.FmtArgs.length)
                    return this.s("strFmt(").emitExpr(this.b.eLit(elit.Lit)).s(", ")
                        .each(elit.FmtArgs, ", ", _ => this.emitExpr(_)).s(")")
            }

            const eop = it as gen_syn.EOp
            if (eop && eop.Name && eop.Operands && eop.Operands.length)
                if (eop.Name === gen_syn.BuilderOperators.Is)
                    return this.s("(undefined !== ").emitExpr(eop.Operands[0]).s(" && null !== ").emitExpr(eop.Operands[0]).s(")")
                else if (eop.Name === gen_syn.BuilderOperators.Isnt)
                    return this.s("(undefined === ").emitExpr(eop.Operands[0]).s(" || null === ").emitExpr(eop.Operands[0]).s(")")
                else if (eop.Name === gen_syn.BuilderOperators.Addr || eop.Name === gen_syn.BuilderOperators.Deref)
                    return this.emitExpr(eop.Operands[0])
                else if (eop.Name === gen_syn.BuilderOperators.Idx)
                    return this.emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]")
                else if (eop.Name === gen_syn.BuilderOperators.IdxMay)
                    return this.s("[").emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]").s(", undefined !== ").emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]").s("]")
                else if (eop.Name === gen_syn.BuilderOperators.Eq)
                    return this.emitExprs(' === ', ...eop.Operands)
                else if (eop.Name === gen_syn.BuilderOperators.Neq)
                    return this.emitExprs(' !== ', ...eop.Operands)

            const efn = it as gen_syn.EFunc
            if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
                return this
                    .s("(")
                    .each(efn.Args, ", ", (_, i) =>
                        this.s(_.Name, jsMode ? "" : (((_.fromPrep && _.fromPrep.optional) || (this.typeMaybe(_.Type) && i === efn.Args.length - 1)) ? "?: " : ": "))
                            .emitTypeRef(_.Type))
                    .s(jsMode ? ")" : "): ").emitTypeRef(efn.Type).s(" => ")
                    .emitInstr(efn.Body)

            const econv = it as gen_syn.EConv
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
                            [t === gen_syn.TypeRefPrim.Dict, () =>
                                this.s('typeof ').emitExpr(econv.Conv).s(' === "object"')
                            ],
                            [t === gen_syn.TypeRefPrim.Bool, () =>
                                this.s('typeof ').emitExpr(econv.Conv).s(' === "boolean"')
                            ],
                            [t === gen_syn.TypeRefPrim.Int || t === gen_syn.TypeRefPrim.Real, () =>
                                this.s('typeof ').emitExpr(econv.Conv).s(' === "number"')
                            ],
                            [t === gen_syn.TypeRefPrim.String, () =>
                                this.s('typeof ').emitExpr(econv.Conv).s(' === "string"')
                            ],
                            [true, () => this.s('true')],
                        )
                        .s(']')
                }
        }
        return super.emitExpr(it)
    }

    emitInstr(it: gen_syn.Instr, inBlock: boolean = false): Gen {
        if (it) {
            const ivar = it as gen_syn.IVar
            if (ivar && ivar.Name && ivar.Type)
                return this.ln(() =>
                    this.s("let ", ivar.Name, jsMode ? "" : ": ").emitTypeRef(ivar.Type))

            const idictdel = it as gen_syn.IDictDel
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() =>
                    this.s("delete ").emitExpr(idictdel.DelFrom).s("[").emitExpr(idictdel.DelWhat).s("]"))

            const icolladd = it as gen_syn.ICollAdd
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() =>
                    this.emitExpr(icolladd.AddTo).s('.push(').emitExpr(icolladd.AddWhat).s(')'))

            const iblock = it as gen_syn.IBlock
            if (iblock && iblock.Instrs !== undefined) {
                let endeol = false
                if (endeol = iblock.Lock ? true : false)
                    this.ln(() => this.s("{"))
                else if (endeol = (iblock.ForEach && iblock.ForEach.length) ? true : false)
                    this.ln(() => this.s("for (const ", iblock.ForEach[0].Name, " of ").emitExpr(iblock.ForEach[1]).s(") {"))
                else if (endeol = (iblock.If && iblock.If.length) ? true : false)
                    this.ln(() => this.s("if (").emitExpr(iblock.If[0]).s(") {"))
                else if (!iblock.Instrs.length)
                    return this
                else {
                    if (endeol = inBlock)
                        this.lf()
                    this.s("{").line()
                }

                this.indented(() =>
                    iblock.Instrs.forEach(_ => this.emitInstr(_, true)))

                this.lf().s("}")

                if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                    this.s(" else ").emitInstr(iblock.If[1])

                return endeol ? this.line() : this
            }
        }
        return super.emitInstr(it, inBlock)
    }

    emitTypeRef(it: gen_syn.TypeRef): Gen {
        if (jsMode)
            return this
        const tmay = this.typeMaybe(it)
        if (tmay) return this.emitTypeRef(tmay.Maybe)

        const tcoll = this.typeColl(it)
        if (tcoll)
            return (!tcoll.KeysOf) ? this.emitTypeRef(tcoll.ValsOf).s("[]")
                : this.s("{ [_:").emitTypeRef(tcoll.KeysOf).s("]: ").emitTypeRef(tcoll.ValsOf).s(" }")

        const ttup = this.typeTup(it)
        if (ttup) return this.s("[").each(ttup.TupOf, ", ", t =>
            this.emitTypeRef(t)
        ).s("]")

        const tfun = this.typeFunc(it)
        if (tfun)
            return this.s("(")
                .each(tfun.From.filter(_ => _ ? true : false), ", ", (t, i) => this.s("_".repeat(i + 1)).s(": ").emitTypeRef(t))
                .s(") => ").emitTypeRef(tfun.To)

        if (it === gen_syn.TypeRefPrim.Real || it === gen_syn.TypeRefPrim.Int)
            return this.s("number")
        if (it === gen_syn.TypeRefPrim.Bool)
            return this.s("boolean")
        if (it === gen_syn.TypeRefPrim.Dict)
            return this.s("{ [_: string]: any }")

        return super.emitTypeRef(it)
    }

}
