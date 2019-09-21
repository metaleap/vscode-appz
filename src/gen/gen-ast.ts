import * as node_util from 'util'
import * as gen from './gen-basics'


export interface WithName { Name: string, name?: string }
export interface WithType { Type: TypeRef }
export interface WithFrom<T> { fromPrep?: T }
export interface WithDocs { Docs?: Doc[] }
export interface Doc { ForParam: string, Lines: string[] }

export interface TEnum extends WithDocs, WithName, WithFrom<gen.PrepEnum> { Enumerants: Enumerant[] }
export interface TInterface extends WithDocs, WithName, WithFrom<gen.PrepInterface> { Methods: Method[] }
export interface Enumerant extends WithDocs, WithName, WithFrom<gen.PrepEnumerant> { Value: number }
export interface TStruct extends WithDocs, WithName, WithFrom<gen.PrepStruct> { Fields: Field[] }
export interface Method extends WithDocs, WithName, WithType, WithFrom<gen.PrepMethod> { Args: Arg[] }
export interface Arg extends WithDocs, WithName, WithType, WithFrom<gen.PrepArg> { }
export interface Field extends WithDocs, WithName, WithType, WithFrom<gen.PrepField> {
    FuncFieldRel?: Field, Json: { Excluded: boolean, Name: string, Required: boolean }
}
export interface Func extends WithName, WithType { Func: EFunc }

export type TypeRef = WithName | TypeRefPrim | TypeRefArr | TypeRefFunc | TypeRefTup | TypeRefMaybe
export enum TypeRefPrim {
    Any = gen.ScriptPrimType.Any,
    Bool = gen.ScriptPrimType.Boolean,
    Int = gen.ScriptPrimType.Number,
    String = gen.ScriptPrimType.String,
    Dict = gen.ScriptPrimType.Dict,
}
export interface TypeRefArr {
    ArrOf: TypeRef
    AsList?: boolean
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

export type Expr = ELit | EName | ECall | EOp | EFunc | ECollNew | ELen | EConv | ENew | ETup
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
export interface ECollNew {
    Capacity: Expr
    ElemTypeIfList?: TypeRef // else it's std dict (string-to-any)
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
export interface ETup {
    Items: Expr[]
    IsArr?: boolean
}

export type Instr = IBlock | IRet | IVar | ISet | IDictDel | ICollAdd | ECall
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
export interface ICollAdd {
    AddTo: Expr
    AddWhat: Expr
}
export interface IDictDel {
    DelFrom: Expr
    DelWhat: Expr
}



export enum BuilderOperators {
    Dot = '.',
    Idx = '@',
    Eq = '==',
    Neq = '!=',
    Or = '||',
    And = '&&',
    Not = '!',
    Is = '=?',
    Isnt = '=!',
}

export class Builder {
    prep: gen.Prep
    gen: Gen

    constructor(prep: gen.Prep, gen: Gen) { [this.prep, this.gen] = [prep, gen] }

    iRet(ret: Expr): IRet { return { Ret: ret } }
    iVar(varName: string, varType: TypeRef): IVar { return { Name: varName, Type: varType } }
    iSet(setWhat: Expr, setTo: Expr): ISet { return { SetWhat: setWhat, SetTo: setTo } }
    iAdd(addTo: Expr, addWhat: Expr): ICollAdd { return { AddTo: addTo, AddWhat: addWhat } }
    iDel(delFrom: Expr, delWhat: Expr): IDictDel { return { DelFrom: delFrom, DelWhat: delWhat } }
    iBlock(...instrs: Instr[]): IBlock { return { Instrs: instrs } }
    iLock(lock: Expr, ...instrs: Instr[]): IBlock { return { Lock: lock, Instrs: instrs } }
    iIf(ifCond: Expr, thenInstrs: Instr[], elseInstrs: Instr[] = undefined): IBlock { return { Instrs: thenInstrs, If: [ifCond, { Instrs: elseInstrs }] } }
    iFor(iterVarName: EName, iterable: Expr, ...instrs: Instr[]): IBlock { return { Instrs: instrs, ForEach: [iterVarName, iterable] } }
    eNew(typeRef: TypeRef): ENew { return { New: typeRef } }
    eConv(typeRef: TypeRef, conv: Expr): EConv { return { Conv: conv, To: typeRef } }
    eTup(...items: Expr[]): ETup { return { Items: items } }
    eArr(...items: Expr[]): ETup { return { Items: items, IsArr: true } }
    eLen(lenOf: Expr): ELen { return { LenOf: lenOf } }
    eCollNew(cap: Expr, listElemType: TypeRef = undefined): ECollNew { return { ElemTypeIfList: listElemType, Capacity: cap } }
    eFunc(args: Arg[], retType: TypeRef, ...instrs: Instr[]): EFunc { return { Args: args, Type: retType, Body: { Instrs: instrs } } }
    eCall(callee: Expr, ...args: Expr[]): ECall { return { Call: callee, Args: args } }
    n(name: string): EName { return { Name: name } }
    eLit(litVal: string | number | boolean | null): ELit { return { Lit: litVal } }
    eNil(): ELit { return this.eLit(null) }
    eThis(): EName { return this.n(null) }
    eOp(op: string, ...args: Expr[]): EOp { return { Name: op, Operands: args } }
    oDot(...args: Expr[]): EOp { return (args.length === 1) ? this.eOp(this.op.Dot, ...[this.eThis() as Expr].concat(...args)) : this.eOp(this.op.Dot, ...args) }
    oIdx(...args: Expr[]): EOp { return this.eOp(this.op.Idx, ...args) }
    oEq(...args: Expr[]): EOp { return this.eOp(this.op.Eq, ...args) }
    oNeq(...args: Expr[]): EOp { return this.eOp(this.op.Neq, ...args) }
    oOr(...args: Expr[]): EOp { return this.eOp(this.op.Or, ...args) }
    oAnd(...args: Expr[]): EOp { return this.eOp(this.op.And, ...args) }
    oNot(arg: Expr): EOp { return this.eOp(this.op.Not, arg) }
    oIs(arg: Expr): EOp { return this.eOp(this.op.Is, arg) }
    oIsnt(arg: Expr): EOp { return this.eOp(this.op.Isnt, arg) }
    private readonly op = BuilderOperators // just a local shorthand for all the aboves

    EACH<TIn, TOut>(from: TIn[], fn: ((_: TIn, idx?: number) => TOut[])): TOut[] {
        const me: TOut[] = []
        for (let idx = 0; idx < from.length; idx++)
            me.push(...fn(from[idx], idx))
        return me
    }

    LET<TIn, TOut>(value: TIn, andThen: ((_: TIn) => TOut)) {
        return andThen(value)
    }

    LETS<TIn, TOut>(values: TIn[], andThen: ((..._: TIn[]) => TOut)) {
        return andThen(...values)
    }

    enumFrom(it: gen.PrepEnum): TEnum {
        return {
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.enums(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Enumerants: it.enumerants.map((_): Enumerant => ({
                fromPrep: _,
                name: _.name,
                Name: this.gen.nameRewriters.enumerants(_.name),
                Docs: this.docs(gen.docs(_.fromOrig)),
                Value: _.value,
            })),
        }
    }

    interfaceFrom(it: gen.PrepInterface): TInterface {
        return {
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.interfaces(it.name),
            Docs: this.docs(gen.docs(it.fromOrig)),
            Methods: it.methods.map((_: gen.PrepMethod): Method => ({
                fromPrep: _,
                name: _.nameOrig,
                Name: this.gen.nameRewriters.methods(_.name),
                Docs: this.docs(gen.docs(_.fromOrig.decl, () => _.args.find(arg => arg.isFromRetThenable)), undefined, true, this.gen.options.doc.appendArgsToSummaryFor.methods),
                Type: null,
                Args: _.args.map((arg: gen.PrepArg): Arg => ({
                    fromPrep: arg,
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
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.structs(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Fields: it.fields.map((_: gen.PrepField): Field => ({
                fromPrep: _,
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
            return TypeRefPrim.Any

        const tarr = gen.typeArrOf(it)
        if (tarr)
            return { ArrOf: this.typeRef(tarr), AsList: false }

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
            return hadoptional ? this.typeRefEnsureMaybe(ret) : ret
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
                    name = ''
                let dst = into.find(_ => _.ForParam === name)
                if (isMethod || !(name && name.length)) {
                    if (!dst)
                        into.push(dst = { ForParam: name, Lines: [] })
                    dst.Lines.push(...doc.lines)
                }
                if (name && name.length && appendArgsAndRetsToSummaryToo && (dst = into.find(_ => _.ForParam === '')))
                    dst.Lines.push('', ...doc.lines.map((ln, idx) =>
                        ((idx) ? ln : gen.docPrependArgOrRetName(doc, ln, "return", this.gen.nameRewriters.args))
                    ))
            }
            if (doc.subs && doc.subs.length)
                this.docs(doc.subs, undefined, isMethod, appendArgsAndRetsToSummaryToo, retNameFallback, into)
        }
        if (istop && extraSummaryLines && extraSummaryLines.length) {
            let dst = into.find(_ => _.ForParam === '')
            if (!dst)
                into.push(dst = { ForParam: '', Lines: [] })
            dst.Lines.push(...extraSummaryLines)
        }
        return into
    }

}



export class Gen extends gen.Gen implements gen.IGen {
    private src: string = ''
    private indents: number = 0

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
            curInst: "this",
            typeAny: "Any",
        },
        oneIndent: '    '
    }

    indented(andThen: () => void): Gen {
        this.indents++
        andThen()
        this.indents--
        return this
    }

    indent(): Gen {
        this.indents++
        return this
    }

    undent(): Gen {
        this.indents--
        return this
    }

    ln(andThen: (() => void)): Gen {
        this.src += this.options.oneIndent.repeat(this.indents)
        andThen()
        this.src += "\n"
        return this
    }

    each<T>(arr: T[], joinBy: string, andThen: ((_: T) => void)): Gen {
        for (let i = 0; i < arr.length; i++) {
            if (i > 0)
                this.s(joinBy)
            andThen(arr[i])
        }
        return this
    }

    line(srcLn: string = ''): Gen {
        return this.lines(srcLn)
    }

    lines(...srcLns: string[]): Gen {
        for (const srcln of srcLns)
            this.src += ((srcln && srcln.length) ? (this.options.oneIndent.repeat(this.indents) + srcln) : '') + "\n"
        return this
    }

    lf(...s: string[]): Gen {
        this.src += this.options.oneIndent.repeat(this.indents)
        this.src += s.join('')
        return this
    }

    s(...s: string[]): Gen {
        this.src += s.join('')
        return this
    }

    when(check: any, ifTrue: () => void, ifFalse: () => void = undefined): Gen {
        if (check) ifTrue()
        else if (ifFalse) ifFalse()
        return this
    }

    emitDocs(it: (WithDocs & WithName)): Gen {
        if (it.name && it.Name && it.name !== it.Name)
            this.line("# " + it.name + ":")
        for (const doc of it.Docs) {
            if (doc.ForParam && doc.ForParam.length)
                this.lines('#', "# @" + doc.ForParam + ":")
            for (const docln of doc.Lines)
                this.line("# " + docln)
        }
        return this
    }

    emitEnum(it: TEnum) {
        this.lines('', '')
            .emitDocs(it)
            .line(it.Name + ": enum")
            .indented(() => it.Enumerants.forEach(_ =>
                this.line()
                    .emitDocs(_)
                    .line(`${_.Name}: ${_.Value}`)))
            .lines('', '')
    }

    emitInterface(it: TInterface) {
        this.lines('', '')
            .emitDocs(it)
            .line(it.Name + ": interface")
            .indented(() => it.Methods.forEach(_ => {
                this.line()
                    .emitDocs(_)
                    .ln(() => this.s(_.Name, ': ').emitTypeRef(_.Type))
                    .indented(() => _.Args.forEach(arg =>
                        this.ln(() => this.s(arg.Name, ': ').emitTypeRef(arg.Type).s((arg.name === arg.Name) ? '' : (' # ' + arg.name)))
                    ))
            })).lines('', '')
    }

    emitStruct(it: TStruct) {
        this.lines('', '')
            .emitDocs(it)
            .line(it.Name + ": class")
            .indented(() => it.Fields.forEach(_ => {
                this.line()
                    .emitDocs(_)
                    .lines('#', `# JSON FLAGS: ${JSON.stringify(_.Json)}`)
                    .ln(() => this.s(_.Name, ': ').emitTypeRef(_.Type))
            })).lines('', '')
    }

    emitTypeRef(it: TypeRef): Gen {
        if (it === null)
            return this.s("void")

        if (it === TypeRefPrim.Any)
            return this.s(this.options.idents.typeAny)
        if (it === TypeRefPrim.Bool)
            return this.s("bool")
        if (it === TypeRefPrim.Int)
            return this.s("int")
        if (it === TypeRefPrim.String)
            return this.s("string")
        if (it === TypeRefPrim.Dict)
            return this.s("[string:", this.options.idents.typeAny, "]")

        const tname = this.typeNamed(it)
        if (tname)
            return this.s(tname.Name)

        const ttup = this.typeTup(it)
        if (ttup)
            return this.s("[").each(ttup.TupOf, ',', _ => this.emitTypeRef(_)).s(']')

        const tarr = this.typeArr(it)
        if (tarr)
            return this.s('[').emitTypeRef(tarr.ArrOf).s(']')

        const tfun = this.typeFunc(it)
        if (tfun)
            return this.s('(').each(tfun.From, '->', _ => this.emitTypeRef(_)).s('->').emitTypeRef(tfun.To).s(')')

        const tmay = this.typeMaybe(it)
        if (tmay)
            return this.s('?').emitTypeRef(tmay.Maybe)

        throw it
    }

    emitMethodImpl(iface: WithName, method: Method, fillBody: ((iface: WithName, method: Method, _: Builder, bodyToFill: Instr[]) => void)) {
        const me: Func = {
            name: method.name, Name: method.Name, Type: iface, Func: {
                Args: method.Args, Type: method.Type, Body: { Instrs: [] }
            }
        }
        fillBody.call(this, iface, method, this.b, me.Func.Body.Instrs)
        this.emitFuncImpl(me)
    }

    emitFuncImpl(it: Func) {
        this.lines('', '')
            .ln(() => this.emitTypeRef(it.Type).s('·', it.Name, ': (').each(it.Func.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type)).s(' -> ').emitTypeRef(it.Func.Type).s(')'))
            .emitInstr(it.Func.Body)
            .lines('', '')
    }

    emitInstr(it: Instr): Gen {
        if (it) {

            const iret = it as IRet
            if (iret && iret.Ret !== undefined)
                return this.ln(() =>
                    this.s("return ").emitExpr((!iret.Ret) ? undefined : iret.Ret))

            const ivar = it as IVar
            if (ivar && ivar.Name)
                return this.ln(() =>
                    this.s("var ", ivar.Name, " of ").emitTypeRef(ivar.Type))

            const iset = it as ISet
            if (iset && iset.SetWhat && iset.SetTo)
                return this.ln(() =>
                    this.emitExpr(iset.SetWhat).s(" = ").emitExpr(iset.SetTo))

            const idictdel = it as IDictDel
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() =>
                    this.emitExpr(idictdel.DelFrom).s('·del(').emitExpr(idictdel.DelWhat).s(')'))

            const icolladd = it as ICollAdd
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() =>
                    this.emitExpr(icolladd.AddTo).s('·add(').emitExpr(icolladd.AddWhat).s(')'))

            const iblock = it as IBlock
            if (iblock && iblock.Instrs !== undefined) {
                if (iblock.Lock)
                    this.ln(() => this.s('lock ').emitExpr(iblock.Lock))
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

            const ecall = it as ECall
            if (ecall && ecall.Call)
                return this.ln(() =>
                    this.emitExpr(ecall))

            throw "<instr>" + JSON.stringify(it)
        }
        return this
    }

    emitExprs(joinBy: string, ...arr: Expr[]): Gen {
        return this.each(arr, joinBy, (_) => this.emitExpr(_))
    }

    emitExpr(it: Expr): Gen {
        if (it === undefined)
            return this
        if (it === null)
            return this.s('null')

        const elit = it as ELit
        if (elit && elit.Lit !== undefined)
            return this.s(node_util.format("%j", elit.Lit))

        const ecollnew = it as ECollNew
        if (ecollnew && ecollnew.Capacity !== undefined)
            return this.when(ecollnew.ElemTypeIfList,
                () => this.s('[').emitTypeRef(ecollnew.ElemTypeIfList).s(']'),
                () => this.s('dict')
            ).s('·new(').emitExpr(ecollnew.Capacity).s(')')

        const enew = it as ENew
        if (enew && enew.New)
            return this.emitTypeRef(enew.New).s("·new")

        const econv = it as EConv
        if (econv && econv.Conv && econv.To)
            return this.s('((').emitExpr(econv.Conv).s(')·(').emitTypeRef(econv.To).s('))')

        const elen = it as ELen
        if (elen && elen.LenOf)
            return this.emitExpr(elen.LenOf).s("·len")

        const etup = it as ETup
        if (etup && etup.Items !== undefined)
            return this.s('[').each(etup.Items, ',', _ => { this.emitExpr(_) }).s(']')

        const ecall = it as ECall
        if (ecall && ecall.Call)
            return this.emitExpr(ecall.Call).s("(").emitExprs(', ', ...ecall.Args).s(")")

        const eop = it as EOp
        if (eop && eop.Name && eop.Operands && eop.Operands.length) {
            const notactualoperator = (eop.Name === BuilderOperators.Idx || eop.Name === BuilderOperators.Dot)
            return this
                .s((notactualoperator ? '' : '(')
                    + ((eop.Operands.length > 1) ? '' : /* unary*/ eop.Name))
                .emitExprs(notactualoperator ? eop.Name : (' ' + eop.Name + ' '), ...eop.Operands)
                .s(notactualoperator ? '' : ')')
        }

        const efn = it as EFunc
        if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
            return this
                .s('(')
                .each(efn.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type))
                .s(' -> ').emitTypeRef(efn.Type)
                .s(')\n')
                .emitInstr(efn.Body)
                .s(this.options.oneIndent.repeat(this.indents))

        const ename = it as EName
        if (ename && ename.Name !== undefined)
            return this.s(ename.Name ? ename.Name : this.options.idents.curInst)

        throw "<expr>" + JSON.stringify(it)
    }

    private genConvertOrReturn(dstVarName: string, src: Expr, dstType: TypeRef, okBoolName: string = 'ok', onErrRet: Expr = undefined): Instr[] {
        const _ = this.b
        if (!onErrRet)
            onErrRet = _.eLit(false)
        const retifnotok = _.iIf(_.oNot(_.n(okBoolName)), [_.iRet(onErrRet),])
        const dstnamedtype = this.typeNamed(this.typeUnmaybe(dstType))
        if (dstnamedtype && dstnamedtype.Name) {
            if (dstnamedtype.Name === this.options.idents.typeAny)
                return [_.iSet(_.n(dstVarName), src)]
            else {
                if (this.state.genPopulateFor[dstnamedtype.Name] !== false) // why this peculiar checking construct?..
                    this.state.genPopulateFor[dstnamedtype.Name] = true // ..see the consumer of genDecoders to grasp it
                return [
                    _.iSet(_.n(dstVarName), _.eNew(dstType)),
                    _.iSet(_.n(okBoolName), _.eCall(_.oDot(_.n(dstVarName), _.n('populateFrom')), src)),
                    retifnotok,
                ]
            }
        }
        return [
            _.iSet(_.eTup(_.n(dstVarName), _.n(okBoolName)), _.eConv(dstType, src)),
            retifnotok,
        ]
    }

    private genMethodImpl_TopInterface(_iface: WithName, _method: Method, _: Builder, body: Instr[]) {
        body.push(_.iRet(_.n(this.options.idents.curInst)))
    }

    private genMethodImpl_PopulateFrom(struct: WithName, _method: Method, _: Builder, body: Instr[]) {
        body.push(
            _.iVar('dict', TypeRefPrim.Dict),
            _.iVar('ok', TypeRefPrim.Bool),
            _.iVar('val', TypeRefPrim.Any),
        )
        body.push(...this.genConvertOrReturn('dict', _.n('payload'), TypeRefPrim.Dict))
        for (const fld of (struct as TStruct).Fields)
            if (!fld.Json.Excluded)
                body.push(
                    _.iSet(_.eTup(_.n('val'), _.n('ok')), _.oIdx(_.n('dict'), _.eLit(fld.Json.Name))),
                    _.iIf(_.n('ok'), [
                        _.iVar(fld.name, fld.Type) as Instr,
                    ].concat(
                        this.genConvertOrReturn(fld.name, _.n('val'), fld.Type),
                        _.iSet(_.oDot(_.eThis(), _.n(fld.Name)), _.n(fld.name)),
                    ),
                        fld.Json.Required ? [_.iRet(_.eLit(false))] : []
                    ),
                )

        body.push(_.iRet(_.eLit(true)))
    }

    private genMethodImpl_MessageDispatch(iface: WithName, method: Method, _: Builder, body: Instr[]) {
        const __ = gen.idents(method.fromPrep.args, 'msg', 'on', 'fn', 'fnid', 'fnids', 'payload', 'result', 'args', 'ok')
        const funcfields = gen.argsFuncFields(_.prep, method.fromPrep.args)
        const numargs = method.fromPrep.args.filter(_ => !_.isFromRetThenable).length

        body.push(
            _.iVar(__.msg, _.n('ipcMsg')),
            _.iSet(_.n(__.msg), _.eNew(_.n('ipcMsg'))),
            _.iSet(_.oDot(_.n(__.msg), _.n('QName')), _.eLit(iface.name + '.' + method.fromPrep.name)),
            _.iSet(_.oDot(_.n(__.msg), _.n('Data')), _.eCollNew(_.eLit(numargs))),
        )

        if (funcfields.length) body.push(
            _.iVar(__.fnids, { ArrOf: TypeRefPrim.String, AsList: true }),
            _.iSet(_.n(__.fnids), _.eCollNew(_.eLit(funcfields.length), TypeRefPrim.String)),
            _.iLock(_.eThis(), ..._.EACH(funcfields, ff => [
                _.LET(this.nameRewriters.args(ff.arg.name), argname =>
                    _.LET(this.nameRewriters.fields(ff.name), ffname =>
                        _.LET(ff.struct.fields.find(_ => _.name === ff.name), ffld =>
                            _.LET(gen.typeFun(ffld.typeSpec)[0], fnargs =>
                                _.iIf((!ff.arg.optional) ? _.eLit(true) : _.oIs(_.n(argname)), [
                                    _.iSet(_.oDot(_.n(argname), _.n(ffname + '_AppzFuncId')), _.eLit("")),
                                    _.iVar(__.fn, _.typeRef(ffld.typeSpec, ffld.optional)),
                                    _.iSet(_.n(__.fn), _.oDot(_.n(argname), _.n(ffname))),
                                    _.iIf(_.oIs(_.n(__.fn)), [
                                        _.iSet(_.oDot(_.n(argname), _.n(ffname + '_AppzFuncId')), _.eCall(_.oDot(_.n('nextFuncId')))),
                                        _.iAdd(_.n(__.fnids), _.oDot(_.n(argname), _.n(ffname + '_AppzFuncId'))),
                                        _.iSet(_.oIdx(_.oDot(_.n('cbOther')), _.oDot(_.n(argname), _.n(ffname + '_AppzFuncId'))),
                                            _.eFunc([{ Name: __.args, Type: { ArrOf: TypeRefPrim.Any } }], { TupOf: [TypeRefPrim.Any, TypeRefPrim.Bool] },
                                                _.iIf(_.oNeq(_.eLit((fnargs.length)), _.eLen(_.n(__.args))), [
                                                    _.iRet(_.eTup(_.eNil(), _.eLit(false))),
                                                ], [_.iVar(__.ok, TypeRefPrim.Bool) as Instr].concat(
                                                    ..._.EACH(fnargs, (fnarg, idx) => [
                                                        _.iVar('__' + idx, this.b.typeRef(fnarg)),
                                                        _.iIf(_.oIs(_.oIdx(_.n(__.args), _.eLit(idx))),
                                                            this.genConvertOrReturn('__' + idx, _.oIdx(_.n(__.args), _.eLit(idx)), this.b.typeRef(fnarg), __.ok, _.eTup(_.eNil(), _.eLit(false))),
                                                        ),
                                                        _.iRet(_.eTup(_.eCall(_.n(__.fn), ...fnargs.map((_a, idx) => _.n('__' + idx))), _.eLit(true))),
                                                    ] as Instr[]))
                                                ),
                                            )
                                        ),
                                    ]),
                                ])
                            )
                        )
                    )
                ),
            ] as Instr[])),
        )

        for (const arg of method.Args)
            if (!arg.fromPrep.isFromRetThenable)
                body.push(
                    _.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n('Data')), _.eLit(arg.name)), arg)
                )

        const lastarg = method.Args[method.Args.length - 1]
        body.push(_.iVar(__.on, { From: [TypeRefPrim.Any], To: TypeRefPrim.Bool }))
        if (lastarg.fromPrep.isFromRetThenable) {
            const dsttype = _.typeRef(lastarg.fromPrep.typeSpec, true, true)
            body.push(
                _.iIf(_.oIs(_.n(lastarg.Name)), [
                    _.iSet(_.n(__.on), _.eFunc([{ Name: __.payload, Type: TypeRefPrim.Any }], TypeRefPrim.Bool,
                        _.iVar(__.ok, TypeRefPrim.Bool),
                        _.iVar(__.result, dsttype),
                        _.iIf(_.oIs(_.n(__.payload)),
                            this.genConvertOrReturn(__.result, _.n(__.payload), dsttype, __.ok)
                        ),
                        _.eCall(_.n(lastarg.Name), _.n(__.result)),
                        _.iRet(_.eLit(true)),
                    )),
                ]),
            )
        }
        if (!funcfields.length) body.push(
            _.eCall(_.oDot(_.n('send')), _.n(__.msg), _.n(__.on)),
        )
        else body.push(
            _.eCall(_.oDot(_.n('send')), _.n(__.msg), _.eFunc([{ Name: __.payload, Type: TypeRefPrim.Any }], TypeRefPrim.Bool,
                _.iIf(_.oNeq(_.eLen(_.n(__.fnids)), _.eLit(0)), [
                    _.iLock(_.eThis(),
                        _.iFor(_.n(__.fnid), _.n(__.fnids),
                            _.iDel(_.oDot(_.n('cbOther')), _.n(__.fnid)),
                        ),
                    ),
                ]),
                _.iRet(_.oOr(_.oIsnt(_.n(__.on)), _.eCall(_.n(__.on), _.n(__.payload)))),
            )),
        )
    }

    emitIntro(): Gen {
        return this.lines("#",
            "# NOTE, this is not a CoffeeScript file: the .coffee extension is solely",
            "# for the convenience of syntax-highlighting in editors & source viewers.",
            "#",
            "# A debug-print of our in-memory-only intermediate-representation prepared",
            "# for code-gens that choose to inherit from `gen-ast.Gen` to stay lean &",
            "# mean & low on LoCs for maintainability & ease of porting & consistency.",
            "#",
            "# Again, all the below is just a debug-print: it's never to be parsed (and",
            "# the in-mem IR never to be interpreted, other than for actual code-gen).",
            "# Just a dump of all the structures available to a code-gen for emitting.",
            "#", "", "")
    }

    emitOutro(): Gen {
        return this.lines("# override `emitOutro` for this trailing part..")
    }

    gen(prep: gen.Prep) {
        this.resetState()
        const build = (this.b = new Builder(prep, this))
        this.emitIntro()

        const ifacetop: TInterface = {
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
        this.emitInterface(ifacetop)

        for (const it of prep.enums)
            this.emitEnum(build.enumFrom(it))
        const structs: { [_: string]: TStruct } = {}
        for (const it of prep.structs) {
            const struct = build.structFrom(it)
            structs[struct.Name] = struct
            this.emitStruct(struct)
        }
        const ifaces = prep.interfaces.map(_ => build.interfaceFrom(_))
        for (const it of ifaces)
            this.emitInterface(it)

        for (const it of ifacetop.Methods)
            this.emitMethodImpl(ifacetop, it, this.genMethodImpl_TopInterface)
        for (const it of ifaces)
            for (const method of it.Methods)
                this.emitMethodImpl(it, method, this.genMethodImpl_MessageDispatch)

        {
            let anydecoderstogenerate = true
            while (anydecoderstogenerate) {
                anydecoderstogenerate = false
                for (const name in this.state.genPopulateFor)
                    if (anydecoderstogenerate = this.state.genPopulateFor[name]) {
                        this.state.genPopulateFor[name] = false
                        this.emitMethodImpl(structs[name], {
                            Name: "populateFrom", Type: TypeRefPrim.Bool,
                            Args: [{ Name: "payload", Type: TypeRefPrim.Any }]
                        }, this.genMethodImpl_PopulateFrom)
                    }
            }
        }

        this.emitOutro()
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src)
    }

    typeUnmaybe(typeRef: TypeRef): TypeRef {
        const me = typeRef as TypeRefMaybe
        return (me && me.Maybe) ? this.typeUnmaybe(me.Maybe) : typeRef
    }

    typeNamed(typeRef: TypeRef): WithName {
        const me = typeRef as WithName
        return (me && me.Name && me.Name.length) ? me : null
    }

    typeMaybe(typeRef: TypeRef): TypeRefMaybe {
        const me = typeRef as TypeRefMaybe
        return (me && me.Maybe) ? me : null
    }

    typeFunc(typeRef: TypeRef): TypeRefFunc {
        const me = typeRef as TypeRefFunc
        return (me && me.From !== undefined) ? me : null

    }

    typeArr(typeRef: TypeRef): TypeRefArr {
        const me = typeRef as TypeRefArr
        return (me && me.ArrOf) ? me : null
    }

    typeTup(typeRef: TypeRef): TypeRefTup {
        const me = typeRef as TypeRefTup
        return (me && me.TupOf && me.TupOf.length) ? me : null
    }

}
