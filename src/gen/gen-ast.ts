import * as gen from './gen-basics'


export interface WithName { Name: string, name?: string }
export interface WithType { Type: TypeRef }
export interface WithDocs { Docs: Doc[] }
export interface Doc { ForParam: string, Lines: string[] }

export interface TEnum extends WithDocs, WithName { Enumerants: Enumerant[] }
export interface TInterface extends WithDocs, WithName { Methods: Method[] }
export interface Enumerant extends WithDocs, WithName { Value: number }
export interface TStruct extends WithDocs, WithName { Fields: Field[] }
export interface Method extends WithDocs, WithName, WithType { Args: Arg[] }
export interface Arg extends WithDocs, WithName, WithType { }
export interface Field extends WithDocs, WithName, WithType {
    FuncFieldRel?: Field, Json: { Excluded: boolean, Name: string, Required: boolean }
}
export interface Func extends WithName, WithType { Func: EFunc }

export type TypeRef = WithName | TypeRefPrim | TypeRefArr | TypeRefFunc | TypeRefTup | TypeRefMaybe
export enum TypeRefPrim {
    Bool = gen.ScriptPrimType.Boolean,
    Int = gen.ScriptPrimType.Number,
    String = gen.ScriptPrimType.String,
    Dict = gen.ScriptPrimType.Dict,
}
export interface TypeRefArr {
    ArrOf: TypeRef
}
export interface TypeRefFunc {
    From: TypeRef[]
    To: TypeRef
}
export interface TypeRefTup {
    TupOf: TypeRef[]
}
export interface TypeRefMaybe {
    Maybe: TypeRef
}

export type Expr = ELit | EName | ECall | EOp | EFunc | EDictNew | ELen | EConv | ENew
export interface ELit {
    Lit: boolean | number | string | null
}
export interface EName extends WithName {
}
export interface ECall {
    Call: Expr
    Args: Expr[]
}
export interface EOp extends WithName {
    Operands: Expr[]
}
export interface EFunc extends WithType {
    Args: Arg[]
    Body: IBlock
}
export interface EAddr {
    AddrOf: Expr
}
export interface EDeref {
    Deref: Expr
}
export interface EDictNew {
    Capacity: Expr
}
export interface ELen {
    LenOf: Expr
}
export interface EConv {
    Conv: Expr
    To: TypeRef
}
export interface ENew {
    New: TypeRef
}

export type Instr = IBlock | IRet | IVar | ISet | IDictDel
export interface IBlock {
    Instrs: Instr[]
    Lock?: Expr
    If?: [Expr, IBlock]
    ForEach?: [EName, Expr]
}
export interface IRet {
    Ret: Expr
}
export interface IVar extends WithName, WithType {
}
export interface ISet {
    SetWhat: Expr,
    SetTo: Expr
}
export interface IDictDel {
    DelFrom: Expr
    DelWhat: Expr
}



export class Builder {
    prep: gen.Prep
    gen: Gen

    constructor(prep: gen.Prep, gen: Gen) { [this.prep, this.gen] = [prep, gen] }

    iRet(ret: Expr): IRet { return { Ret: ret } }
    iVar(varName: string, varType: TypeRef): IVar { return { Name: varName, Type: varType } }
    iSet(setWhat: Expr, setTo: Expr): ISet { return { SetWhat: setWhat, SetTo: setTo } }
    iDel(delFrom: Expr, delWhat: Expr): IDictDel { return { DelFrom: delFrom, DelWhat: delWhat } }
    iBlock(...instrs: Instr[]): IBlock { return { Instrs: instrs } }
    iLock(lock: Expr, ...instrs: Instr[]): IBlock { return { Lock: lock, Instrs: instrs } }
    iIf(ifCond: Expr, thenInstrs: Instr[], elseInstrs: Instr[] = undefined): IBlock { return { Instrs: thenInstrs, If: [ifCond, { Instrs: elseInstrs }] } }
    iFor(iterVarName: EName, iterable: Expr, ...instrs: Instr[]): IBlock { return { Instrs: instrs, ForEach: [iterVarName, iterable] } }
    eNew(typeRef: TypeRef): ENew { return { New: typeRef } }
    eConv(typeRef: TypeRef, conv: Expr): EConv { return { Conv: conv, To: typeRef } }
    eLen(lenOf: Expr): ELen { return { LenOf: lenOf } }
    eDictNew(cap: Expr): EDictNew { return { Capacity: cap } }
    eFunc(args: Arg[], retType: TypeRef, ...instrs: Instr[]): EFunc { return { Args: args, Type: retType, Body: { Instrs: instrs } } }
    eOp(op: string, ...args: Expr[]): EOp { return { Name: op, Operands: args } }
    eCall(callee: Expr, ...args: Expr[]): ECall { return { Call: callee, Args: args } }
    eName(name: string): EName { return { Name: name } }
    eLit(litVal: string | number | boolean | null): ELit { return { Lit: litVal } }

    enumFrom(it: gen.PrepEnum): TEnum {
        return {
            name: it.name,
            Name: this.gen.nameRewriters.types.enums(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Enumerants: it.enumerants.map((_): Enumerant => ({
                name: _.name,
                Name: this.gen.nameRewriters.enumerants(_.name),
                Docs: this.docs(gen.docs(_.fromOrig)),
                Value: _.value,
            })),
        }
    }

    interfaceFrom(it: gen.PrepInterface): TInterface {
        return {
            name: it.name,
            Name: this.gen.nameRewriters.types.interfaces(it.name),
            Docs: this.docs(gen.docs(it.fromOrig)),
            Methods: it.methods.map((_: gen.PrepMethod): Method => ({
                name: _.nameOrig,
                Name: this.gen.nameRewriters.methods(_.name),
                Docs: this.docs(gen.docs(_.fromOrig.decl, () => _.args.find(arg => arg.isFromRetThenable)), undefined, true, this.gen.options.doc.appendArgsToSummaryFor.methods),
                Type: null,
                Args: _.args.map((arg: gen.PrepArg): Arg => ({
                    name: arg.name,
                    Name: this.gen.nameRewriters.args(arg.name),
                    Docs: this.docs(gen.docs(arg.fromOrig)),
                    Type: this.typeRef(arg.typeSpec, arg.optional),
                })),
            })),
        }
    }

    structFrom(it: gen.PrepStruct): TStruct {
        let ret: TStruct = {
            name: it.name,
            Name: this.gen.nameRewriters.types.structs(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Fields: it.fields.map((_: gen.PrepField): Field => ({
                name: _.name,
                Name: this.gen.nameRewriters.fields(_.name),
                Docs: this.docs(gen.docs(_.fromOrig), _.isExtBaggage ? [gen.docStrs.extBaggage] : [], false, this.gen.options.doc.appendArgsToSummaryFor.funcFields),
                Type: this.typeRef(_.typeSpec, _.optional),
                Json: { Name: _.name, Required: !_.optional, Excluded: it.funcFields.some(ff => _.name === ff) },
            }))
        }
        for (const ff of it.funcFields) {
            const ffname = this.gen.nameRewriters.fields(ff)
            const fldfn = ret.Fields.find(_ => _.Name === ffname)
            fldfn.FuncFieldRel = {
                Name: ffname + "_AppzFuncId",
                Docs: this.docs(null, [gen.docStrs.internalOnly]),
                Type: TypeRefPrim.String,
                Json: { Name: ff + "_AppzFuncId", Required: false, Excluded: false },
                FuncFieldRel: fldfn,
            }
            ret.Fields.push(fldfn.FuncFieldRel)
        }
        return ret
    }

    typeRefEnsureMaybe(of: TypeRef): TypeRefMaybe {
        let maybe: TypeRefMaybe = of as TypeRefMaybe
        if (!(maybe && maybe.Maybe))
            maybe = { Maybe: of }
        return maybe
    }

    typeRef(it: gen.TypeSpec, needMaybe: boolean = false, intoProm: boolean = false): TypeRef {
        if (!it)
            return null

        if (needMaybe)
            return this.typeRefEnsureMaybe(this.typeRef(it, false, intoProm))

        if (it === gen.ScriptPrimType.Boolean)
            return TypeRefPrim.Bool
        if (it === gen.ScriptPrimType.Number)
            return TypeRefPrim.Int
        if (it === gen.ScriptPrimType.String)
            return TypeRefPrim.String
        if (it === gen.ScriptPrimType.Dict)
            return TypeRefPrim.Dict
        if (it === gen.ScriptPrimType.Any)
            return { Name: this.gen.options.idents.typeAny }

        const tarr = gen.typeArrOf(it)
        if (tarr)
            return { ArrOf: this.typeRef(tarr) }

        const ttup = gen.typeTupOf(it)
        if (ttup && ttup.length)
            return { TupOf: ttup.map(_ => this.typeRef(_)) }

        const tfun = gen.typeFun(it)
        if (tfun && tfun.length)
            return { From: tfun[0].map(_ => this.typeRef(_)), To: this.typeRef(tfun[1]) }

        let tsum = gen.typeSumOf(it)
        if (tsum && tsum.length) {
            let hadoptional = false
            tsum = tsum.filter(_ => {
                const optional = (_ === gen.ScriptPrimType.Undefined || _ === gen.ScriptPrimType.Null)
                hadoptional = hadoptional || optional
                return (!optional) && !gen.typeProm(_)
            })
            if (tsum.length !== 1)
                throw it
            let ret = this.typeRef(tsum[0])

            return ret
        }

        const tprom = gen.typeProm(it)
        if (tprom && tprom.length)
            if (tprom.length > 1)
                throw it
            else if (intoProm)
                return this.typeRef(tprom[0])
            else
                return { From: tprom.map(_ => this.typeRef(_)), To: null }

        if (typeof it === 'string')
            return { Name: it }

        throw it
    }

    docs(docs: gen.Docs, extraSummaryLines: string[] = undefined, isMethod = false, appendArgsAndRetsToSummaryToo = true, retNameFallback = "return", into: Doc[] = undefined) {
        const istop = (into === undefined)
        if (istop)
            into = []
        if (docs && docs.length) for (const doc of docs) {
            if (doc.lines && doc.lines.length) {
                let name = doc.isForArg
                if ((!(name && name.length)) && doc.isForRet !== null && doc.isForRet !== undefined)
                    name = (doc.isForRet && doc.isForRet.length) ? doc.isForRet : retNameFallback
                if (!name)
                    name = ""
                let dst = into.find(_ => _.ForParam === name)
                if (isMethod || !(name && name.length)) {
                    if (!dst)
                        into.push(dst = { ForParam: name, Lines: [] })
                    dst.Lines.push(...doc.lines)
                }
                if (name && name.length && appendArgsAndRetsToSummaryToo && (dst = into.find(_ => _.ForParam === "")))
                    dst.Lines.push("", ...doc.lines.map((ln, idx) =>
                        ((idx) ? ln : gen.docPrependArgOrRetName(doc, ln, "return", this.gen.nameRewriters.args))
                    ))
            }
            if (doc.subs && doc.subs.length)
                this.docs(doc.subs, undefined, isMethod, appendArgsAndRetsToSummaryToo, retNameFallback, into)
        }
        if (istop && extraSummaryLines && extraSummaryLines.length) {
            let dst = into.find(_ => _.ForParam === "")
            if (!dst)
                into.push(dst = { ForParam: "", Lines: [] })
            dst.Lines.push(...extraSummaryLines)
        }
        return into
    }

}



export class Gen extends gen.Gen implements gen.IGen {
    private src: string = ""
    private indent: number = 0

    protected b: Builder = null

    nameRewriters = {
        args: this.caseLo,
        fields: this.caseUp,
        methods: this.caseUp,
        enumerants: this.caseUp,
        types: { enums: this.caseUp, structs: this.caseUp, interfaces: this.caseUp },
    }
    options = {
        doc: {
            appendArgsToSummaryFor: {
                methods: false,
                funcFields: true,
            }
        },
        idents: {
            curInst: "$",
            typeAny: "Any",
        }
    }

    protected indented = (andThen: () => void): Gen => {
        this.indent++
        andThen()
        this.indent--
        return this
    }

    protected ln = (andThen: (() => void)): Gen => {
        this.src += "\t".repeat(this.indent)
        andThen()
        this.src += "\n"
        return this
    }

    protected each<T>(arr: T[], joinBy: string, andThen: ((_: T) => void)): Gen {
        for (let i = 0; i < arr.length; i++) {
            if (i > 0)
                this.s(joinBy)
            andThen(arr[i])
        }
        return this
    }

    protected line = (srcLn: string = ""): Gen =>
        this.lines(srcLn)

    protected lines = (...srcLns: string[]): Gen => {
        for (const srcln of srcLns)
            this.src += ((srcln && srcln.length) ? ("\t".repeat(this.indent) + srcln) : "") + "\n"
        return this
    }

    protected s = (...s: string[]): Gen => {
        for (const str of s)
            this.src += str
        return this
    }

    protected emitDocs = (it: (WithDocs & WithName)): Gen => {
        if (it.name && it.Name && it.name !== it.Name)
            this.line("# " + it.name + ":")
        for (const doc of it.Docs) {
            if (doc.ForParam && doc.ForParam.length)
                this.lines("#", "# @" + doc.ForParam + ":")
            for (const docln of doc.Lines)
                this.line("# " + docln)
        }
        return this
    }

    protected emitEnum = (it: TEnum) => {
        this.lines("", "")
            .emitDocs(it)
            .line(it.Name + ": enum")
            .indented(() => it.Enumerants.forEach(_ =>
                this.line()
                    .emitDocs(_)
                    .line(`${_.Name}: ${_.Value}`)))
            .lines("", "")
    }

    protected emitInterface = (it: TInterface) => {
        this.lines("", "")
            .emitDocs(it)
            .line(it.Name + ": iface")
            .indented(() => it.Methods.forEach(_ => {
                this.line()
                    .emitDocs(_)
                    .ln(() => this.s(_.Name, ': ').emitTypeRef(_.Type))
                    .indented(() => _.Args.forEach(arg =>
                        this.ln(() => this.s(arg.Name, ': ').emitTypeRef(arg.Type).s((arg.name === arg.Name) ? '' : (' # ' + arg.name)))
                    ))
            })).lines("", "")
    }

    protected emitStruct = (it: TStruct) => {
        this.lines("", "")
            .emitDocs(it)
            .line(it.Name + ": struct")
            .indented(() => it.Fields.forEach(_ => {
                this.line()
                    .emitDocs(_)
                    .lines("#", `# JSON FLAGS: ${JSON.stringify(_.Json)}`)
                    .ln(() => this.s(_.Name, ': ').emitTypeRef(_.Type))
            })).lines("", "")
    }

    protected emitTypeRef = (it: TypeRef): Gen => {
        if (it === null)
            return this.s("void")

        if (it === TypeRefPrim.Bool)
            return this.s("bool")
        if (it === TypeRefPrim.Int)
            return this.s("int")
        if (it === TypeRefPrim.String)
            return this.s("string")
        if (it === TypeRefPrim.Dict)
            return this.s("[string:", this.options.idents.typeAny, "]")

        const tname = it as WithName
        if (tname && tname.Name && tname.Name.length)
            return this.s(tname.Name)

        const ttup = it as TypeRefTup
        if (ttup && ttup.TupOf && ttup.TupOf.length)
            return this.s("[").each(ttup.TupOf, ',', _ => this.emitTypeRef(_)).s(']')

        const tarr = it as TypeRefArr
        if (tarr && tarr.ArrOf)
            return this.s('[').emitTypeRef(tarr.ArrOf).s(']')

        const tfun = it as TypeRefFunc
        if (tfun && tfun.From && tfun.From.length)
            return this.s('(').each(tfun.From, '->', _ => this.emitTypeRef(_)).s('->').emitTypeRef(tfun.To).s(')')

        const tmay = it as TypeRefMaybe
        if (tmay && tmay.Maybe)
            return this.s('?').emitTypeRef(tmay.Maybe)

        throw it
    }

    protected emitMethodImpl(iface: TInterface, method: Method, isMainInterface: boolean) {
        const b = this.b, me: Func = {
            name: method.name, Name: method.Name, Type: iface, Func: {
                Args: method.Args, Type: method.Type, Body: { Instrs: [] }
            }
        }
        if (isMainInterface)
            me.Func.Body.Instrs.push(b.iRet(b.eName(this.options.idents.curInst)))
        else {
            me.Func.Body.Instrs.push(
                b.iVar("msg", { Name: "ipcMsg" }),
                b.iSet(["msg"], b.eNew({ Name: "ipcMsg" })),

            )
        }
        this.emitFuncImpl(me)
    }

    protected emitFuncImpl = (it: Func) => {
        this.lines("", "")
            .ln(() => this.emitTypeRef(it.Type).s(it.Name, ': (').each(it.Func.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type)).s(' -> ').emitTypeRef(it.Func.Type).s(')'))
            .emitInstr(it.Func.Body)
            .lines("", "")
    }

    protected emitInstr(it: Instr): Gen {
        if (it) {

            const iret = it as IRet
            if (iret && iret.Ret !== undefined)
                return this.ln(() =>
                    this.s("ret ").emitExpr(iret.Ret === null ? undefined : iret.Ret))

            const ivar = it as IVar
            if (ivar && ivar.Name)
                return this.ln(() =>
                    this.s(ivar.Name, ": ").emitTypeRef(ivar.Type))

            const iset = it as ISet
            if (iset && iset.SetWhat && iset.SetTo)
                return this.ln(() =>
                    this.emitExpr(iset.SetWhat).s(" = ").emitExpr(iset.SetTo))

            const idictdel = it as IDictDel
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() =>
                    this.emitExpr(idictdel.DelFrom).s('·del(').emitExpr(idictdel.DelWhat).s(')'))

            const iblock = it as IBlock
            if (iblock && iblock.Instrs !== undefined) {
                if (iblock.Lock)
                    this.ln(() => this.emitExpr(iblock.Lock).s("·lock"))
                else if (iblock.ForEach && iblock.ForEach.length)
                    this.ln(() => this.s("for ", iblock.ForEach[0].Name, " in ").emitExpr(iblock.ForEach[1]))
                else if (iblock.If && iblock.If.length)
                    this.ln(() => this.s("if ").emitExpr(iblock.If[0]))

                this.indented(() =>
                    iblock.Instrs.forEach(_ => this.emitInstr(_)))

                if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                    this.line("else")
                        .emitInstr(iblock.If[1])
                return this
            }

            throw "<instr>" + JSON.stringify(it)
        }
        return this
    }

    private emitExprs(joinBy: string, ...arr: Expr[]): Gen {
        return this.each(arr, joinBy, (_) => this.emitExpr(_))
    }

    private emitExpr(it: Expr): Gen {
        if (it === undefined)
            return this
        if (it === null)
            return this.s('null')

        const ename = it as EName
        if (ename && ename.Name !== undefined)
            return this.s(ename.Name ? ename.Name : this.options.idents.curInst)

        const elit = it as ELit
        if (elit && elit.Lit !== undefined)
            return this.s((elit.Lit === null) ? 'null' : elit.Lit.toString())

        const edictnew = it as EDictNew
        if (edictnew && edictnew.Capacity !== undefined)
            return this.s("dict·new(" + edictnew.Capacity + ")")

        const enew = it as ENew
        if (enew && enew.New)
            return this.emitTypeRef(enew.New).s("·new")

        const econv = it as EConv
        if (econv && econv.Conv && econv.To)
            return this.s('((').emitTypeRef(econv.To).s(')(').emitExpr(econv.Conv).s('))')

        const elen = it as ELen
        if (elen && elen.LenOf)
            return this.emitExpr(elen.LenOf).s("·len")

        const ecall = it as ECall
        if (ecall && ecall.Call)
            return this.emitExpr(ecall.Call).s("(").emitExprs(', ', ...ecall.Args).s(")")

        const eop = it as EOp
        if (eop && eop.Name && eop.Operands && eop.Operands.length)
            return this.s("(" + ((eop.Operands.length > 1) ? '' : eop.Name)).emitExprs(' ' + eop.Name + ' ', ...eop.Operands).s(')')

        const efn = it as EFunc
        if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
            return this
                .s('(')
                .each(efn.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type))
                .s(' -> ').emitTypeRef(efn.Type)
                .emitInstr(efn.Body)
                .s(')')

        throw "<expr>" + JSON.stringify(it)
    }

    gen(prep: gen.Prep) {
        this.resetState()
        this.src = "# NOTE, this is not a CoffeeScript file:\n# the .coffee extension is solely for the convenience of syntax-highlighting.\n#\n# A debug-print of our in-memory-only imperative-intermediate-representation\n# available to code-gens that want to stay lean & mean & low on LoCs for\n# maintainability & ease of porting.\n#\n# The format is again just a debug-print: it's never to be parsed or anything,\n# and exists merely to dump all knowledge held by generated in-memory\n# representations available to code-gens.\n#\n# Generated representations follow below.\n\n"
        const build = (this.b = new Builder(prep, this))

        const ifacemain: TInterface = {
            name: prep.fromOrig.moduleName,
            Name: this.nameRewriters.types.interfaces(prep.fromOrig.moduleName),
            Docs: build.docs(gen.docs(prep.fromOrig.fromOrig)),
            Methods: prep.interfaces.map((_: gen.PrepInterface): Method => ({
                name: _.name,
                Name: this.nameRewriters.methods(_.name),
                Docs: build.docs(gen.docs(_.fromOrig)),
                Type: build.typeRef(this.nameRewriters.types.interfaces(_.name)),
                Args: [],
            })),
        }
        this.emitInterface(ifacemain)

        for (const it of prep.enums)
            this.emitEnum(build.enumFrom(it))
        for (const it of prep.structs)
            this.emitStruct(build.structFrom(it))
        const ifaces = prep.interfaces.map(_ => build.interfaceFrom(_))
        for (const it of ifaces)
            this.emitInterface(it)

        for (const it of ifacemain.Methods)
            this.emitMethodImpl(ifacemain, it, true)
        for (const it of ifaces)
            for (const method of it.Methods)
                this.emitMethodImpl(it, method, false)

        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src)
    }

}
