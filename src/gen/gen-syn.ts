import * as ts from 'typescript'
import * as node_fs from 'fs'
import * as node_util from 'util'
import * as gen from './gen'
import * as gen_demos from './gen-syn-demos'


export interface WithName { Name: string, name?: string }
export interface WithType { Type: TypeRef }
export interface WithFrom<T> { fromPrep?: T }
export interface WithDocs { Docs?: Doc[] }
export interface Doc { ForParam?: string, Lines: string[] }

export interface TEnum extends WithDocs, WithName, WithFrom<gen.PrepEnum> { Enumerants: Enumerant[] }
export interface TInterface extends WithDocs, WithName, WithFrom<gen.PrepInterface> { Methods: Method[], IsTop?: boolean }
export interface Enumerant extends WithDocs, WithName, WithFrom<gen.PrepEnumerant> { Value: number }
export interface TStruct extends WithDocs, WithName, WithFrom<gen.PrepStruct> { Fields: Field[], IsOutgoing: boolean, IsIncoming: boolean, OutgoingTwin?: string }
export interface Method extends WithDocs, WithName, WithType, WithFrom<gen.PrepMethod> { Args: Arg[], IsSubNs?: boolean, IsObjEvt?: boolean, IsObjCtor?: string }
export interface Arg extends WithDocs, WithName, WithType, WithFrom<gen.PrepArg> { }
export interface Field extends WithDocs, WithName, WithType, WithFrom<gen.PrepField> {
    FuncFieldRel?: Field, Json?: { Excluded: boolean, Name: string, Required: boolean }
}
export interface Func extends WithDocs, WithName, WithType { Func: EFunc }

export type TypeRef = TypeRefOwn | TypeRefPrim | TypeRefColl | TypeRefFunc | TypeRefTup | TypeRefMaybe
export enum TypeRefPrim {
    Any = gen.ScriptPrimType.Any,
    Bool = gen.ScriptPrimType.Boolean,
    Int = gen.ScriptPrimType.Number,
    Real = -1,
    String = gen.ScriptPrimType.String,
    Dict = gen.ScriptPrimType.Dict,
}
export interface TypeRefOwn extends WithName {
    Ands?: { [_: string]: Expr }
}
export interface TypeRefColl {
    ValsOf: TypeRef
    KeysOf?: TypeRef // undefined: array, null: list, other: dict
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
    Lit: boolean | number | string | null | string[]
    FmtArgs?: Expr[]
}
export interface EName extends WithName {
}
export interface ECall {
    Call: Expr
    Args: Expr[]
    Prop?: boolean
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
    ElemType?: TypeRef // else it's std dict (string-to-any)
    KeyType?: TypeRef // unless KeyType, then a dict even if ElemType
    Cap?: Expr // if so (and ElemType), a list not an array
    Len?: Expr // if so (and ElemType), an array not a list
}
export interface ELen {
    LenOf: Expr
    IsArr: boolean
}
export interface EConv {
    Conv: Expr
    To: TypeRef
    Cast?: boolean
}
export interface ENew {
    New: TypeRef
}
export interface ETup {
    Items: Expr[]
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
    IdxMay = '@?',
    Eq = '==',
    Neq = '!=',
    Or = '||',
    And = '&&',
    Not = '!',
    Is = '=?',
    Isnt = '=!',
    Addr = "&",
    Deref = "*",
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
    eConv(typeRef: TypeRef, conv: Expr, cast: boolean = false): EConv { return { Conv: conv, To: typeRef, Cast: cast } }
    eTup(...items: Expr[]): ETup { return { Items: items } }
    eLen(lenOf: Expr, isArr: boolean): ELen { return { LenOf: lenOf, IsArr: isArr } }
    eCollNew(capOrLen: Expr, arrOrListElemType: TypeRef = undefined, isArr: boolean = false): ECollNew { return { ElemType: arrOrListElemType, Cap: (arrOrListElemType && isArr) ? undefined : capOrLen, Len: (arrOrListElemType && isArr) ? capOrLen : undefined } }
    eFunc(args: Arg[], retType: TypeRef, ...instrs: Instr[]): EFunc { return { Args: args, Type: retType, Body: { Instrs: instrs } } }
    eCall(callee: Expr, ...args: Expr[]): ECall { return { Call: callee, Args: args } }
    eProp(callee: Expr, ...args: Expr[]): ECall { return { Call: callee, Args: args, Prop: true } }
    eName(name: string): EName { return { Name: name } }
    eLit(litVal: string | number | boolean | null | string[], ...fmtArgs: Expr[]): ELit { return { Lit: litVal, FmtArgs: fmtArgs } }
    eZilch(): ELit { return this.eLit(null) }
    eThis(): EName { return this.eName(null) }
    eOp(op: string, ...args: Expr[]): EOp { return { Name: op, Operands: args } }
    oIdx(...args: Expr[]): EOp { return this.eOp(BuilderOperators.Idx, ...args) }
    oIdxMay(coll: Expr, key: Expr): EOp { return this.eOp(BuilderOperators.IdxMay, coll, key) }
    oEq(...args: Expr[]): EOp { return this.eOp(BuilderOperators.Eq, ...args) }
    oNeq(...args: Expr[]): EOp { return this.eOp(BuilderOperators.Neq, ...args) }
    oOr(...args: Expr[]): EOp { return this.eOp(BuilderOperators.Or, ...args) }
    oAnd(...args: Expr[]): EOp { return this.eOp(BuilderOperators.And, ...args) }
    oAddr(arg: Expr): EOp { return this.eOp(BuilderOperators.Addr, arg) }
    oDeref(arg: Expr): EOp { return this.eOp(BuilderOperators.Deref, arg) }
    oNot(arg: Expr): EOp { return this.eOp(BuilderOperators.Not, arg) }
    oIs(arg: Expr): EOp { return this.eOp(BuilderOperators.Is, arg) }
    oIsnt(arg: Expr): EOp { return this.eOp(BuilderOperators.Isnt, arg) }
    _(...args: (Expr | string)[]): Expr {
        const expr = (_: Expr | string): Expr => typeof _ === "string" ? this.eName(_) : _
        return (args && args.length && args.length === 1) ? expr(args[0]) : this.eOp(BuilderOperators.Dot, ...args.map(expr))
    }
    oDot(...args: Expr[]): EOp { return (args.length === 1) ? this.oDot(this.eThis(), args[0]) : this.eOp(BuilderOperators.Dot, ...args) }

    EACH<TIn, TOut>(from: TIn[], fn: ((_: TIn, idx?: number) => TOut[])): TOut[] {
        const me: TOut[] = []
        for (let idx = 0; idx < from.length; idx++)
            me.push(...fn(from[idx], idx))
        return me
    }

    WHEN(check: any, ifTrue: () => Instr[], ifFalse: () => Instr[] = null) {
        return check ? ifTrue() : ifFalse ? ifFalse() : []
    }

    LET<TIn, TOut>(value: TIn, then: ((_: TIn) => TOut)) {
        return then(value)
    }

    fromEnum(it: gen.PrepEnum): TEnum {
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

    fromInterface(it: gen.PrepInterface): TInterface {
        const me: TInterface = {
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.interfaces(it.name),
            Docs: this.docs(gen.docs(it.fromOrig)),
            Methods: it.methods.map((method: gen.PrepMethod): Method => {
                const me: Method = {
                    fromPrep: method,
                    name: (method.nameOrig && method.nameOrig.length) ? method.nameOrig : method.name,
                    Name: this.gen.nameRewriters.methods(method.name),
                    Docs: method.isProps
                        ? [{ Lines: ["Provides single-call access to numerous individual `" + this.gen.nameRewriters.types.interfaces(it.name) + "` properties at once."], ForParam: "" }]
                        : this.docs(gen.docs(method.fromOrig ? method.fromOrig.decl : it.fromOrig), undefined, true, this.gen.options.doc.appendArgsToSummary.forMethods),
                    Type: null,
                    Args: method.args.map((arg: gen.PrepArg): Arg => this.fromArg(arg, method)),
                }
                if (me.Args.length) {
                    const tf = this.gen.typeUnMaybe(me.Args[me.Args.length - 1].Type) as TypeRefFunc
                    if (tf.From && tf.From.length) {
                        const tn = this.gen.typeUnMaybe(tf.From[0]) as TypeRefOwn
                        if (tn && tn.Name && tn.Name.length) {
                            const struct = this.prep.structs.find(_ => this.gen.nameRewriters.types.structs(_.name) === tn.Name)
                            if (struct && struct.isDispObj)
                                me.IsObjCtor = tn.Name
                        }
                    }
                }
                me.Type = { From: [this.gen.typeUnMaybe(me.Args[me.Args.length - 1].Type)], To: null }
                me.Args = me.Args.slice(0, me.Args.length - 1)
                return me
            }),
        }
        return me
    }

    fromArg(arg: gen.PrepArg, method?: gen.PrepMethod): Arg {
        return {
            fromPrep: arg,
            name: arg.name,
            Name: this.gen.nameRewriters.args(arg.name),
            Docs: this.docs(gen.docs(arg.fromOrig)),
            Type: this.typeRef(arg.typeSpec, arg.optional, false, (method && ((method.fromOrig && method.fromOrig.decl && (method.fromOrig.decl as gen.MemberProp) && (method.fromOrig.decl as gen.MemberProp).PropType) || method.isProps)) ? true : false),
        }
    }

    fromStruct(it: gen.PrepStruct): TStruct {
        const structname = this.gen.nameRewriters.types.structs(it.name)
        let ret: TStruct = {
            fromPrep: it,
            name: it.name,
            Name: structname,
            Docs: it.isPropsOfIface ? [{
                Lines: [
                    structname + " gathers various properties of `" + this.gen.nameRewriters.types.interfaces(it.isPropsOfIface.name) + "`, obtainable via its `" + gen.idents.methodNsProps + "` method."
                ]
            }] : it.isPropsOfStruct ? [{
                Lines: [
                    structname + " (to be accessed only via `" + it.isPropsOfStruct.name + "." + gen.idents.fldDispObjBag + "`) is a snapshot of `" + this.gen.nameRewriters.types.structs(it.isPropsOfStruct.name) + "` state. It is auto-updated whenever `" + this.gen.nameRewriters.types.structs(it.isPropsOfStruct.name) + "` creations and method calls resolve or its event subscribers (if any) are invoked." + (it.fields.some(_ => _.readOnly) ? " All read-only properties are exposed as function-valued fields." : "") + (it.fields.some(_ => (!_.readOnly) && !gen.typeFun(_.typeSpec)) ? " Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `" + gen.idents.methodBagPublish + "` method." : "")
                ]
            }] : this.docs(gen.docs(it.fromOrig.decl)),
            IsOutgoing: it.isOutgoing ? true : false,
            IsIncoming: it.isIncoming ? true : false,
            Fields: it.isDispObj ? [{ Name: gen.idents.fldDisp, Type: { Maybe: { Name: gen.idents.coreTypeDisp } } }, {
                Name: gen.idents.fldDispObjBag, Type: { Maybe: { Name: structname + gen.idents.typeSuffBag } },
                Docs: [{
                    Lines: [gen.idents.fldDispObjBag + " represents this `" + structname + "`'s current state. All its members get auto-refreshed every time" + (it.fields.some(_ => {
                        const tfun = gen.typeFun(_.typeSpec)
                        return tfun && tfun[0] && tfun[0].length === 1 && tfun[0][0] && gen.typeFun(tfun[0][0])
                    }) ? (" a (subscribed) `" + structname + "` event fires or ") : " ") + "any `" + structname + "` method call (other than `Dispose`) resolves, but can also be manually refreshed via its `" + gen.idents.methodBagFetch + "` method." + (it.fields.some(_ => (!_.readOnly) && !gen.typeFun(_.typeSpec)) ? " Your local modifications to its members will **not** be auto-propagated to VSC, this must be done explicitly via its `" + gen.idents.methodBagPublish + "` method." : "")]
                }]
            },] : (((!it.isPropsOfStruct) ? [] : [{ Name: gen.idents.fldBagHolder, Json: { Excluded: true }, Type: { Maybe: { Name: this.gen.nameRewriters.types.structs(it.isPropsOfStruct.name) } } }]) as Field[]).concat(...it.fields.map((_: gen.PrepField): Field => ({
                fromPrep: _,
                name: _.name,
                Name: ((it.isPropsOfStruct && _.readOnly) ? this.gen.nameRewriters.methods : this.gen.nameRewriters.fields)(_.name),
                Docs: this.docs(gen.docs(_.fromOrig), _.isExtBaggage ? [gen.docStrs.extBaggage] : [], false, this.gen.options.doc.appendArgsToSummary.forFuncFields),
                Type: (it.isPropsOfStruct && _.readOnly) ? { From: [], To: this.typeRef(_.typeSpec, false, true, true) } : this.gen.typeRefForField(this.typeRef(_.typeSpec, _.optional), _.optional),
                Json: { Name: _.name, Required: !_.optional, Excluded: (it.isPropsOfStruct && _.readOnly) || it.funcFields.some(ff => _.name === ff) },
            })))
        }
        for (const ff of it.funcFields) {
            const ffname = this.gen.nameRewriters.fields(ff)
            const fldfn = ret.Fields.find(_ => _.Name === ffname)
            if (fldfn) {
                fldfn.FuncFieldRel = {
                    Name: ffname + gen.idents.fldSuffFuncId,
                    Type: TypeRefPrim.String,
                    Json: { Name: ff + gen.idents.fldSuffFuncId, Required: false, Excluded: false },
                    FuncFieldRel: fldfn,
                }
                ret.Fields.push(fldfn.FuncFieldRel)
            }
        }
        return ret
    }

    typeRefEnsureMaybe(it: TypeRef): TypeRefMaybe {
        let maybe: TypeRefMaybe = it as TypeRefMaybe
        if (!(maybe && maybe.Maybe))
            maybe = { Maybe: it }
        return maybe
    }

    typeRef(it: gen.TypeSpec, needMaybe: boolean = false, intoProm: boolean = false, propsRelated?: boolean): TypeRef {
        if (!it)
            return null

        if (needMaybe)
            return this.typeRefEnsureMaybe(this.typeRef(it, false, intoProm, propsRelated))

        if (it === gen.ScriptPrimType.Boolean || it === gen.ScriptPrimType.BooleanTrue || it === gen.ScriptPrimType.BooleanFalse)
            return TypeRefPrim.Bool
        if (it === gen.ScriptPrimType.Number)
            return TypeRefPrim.Int
        if (it === gen.ScriptPrimType.String)
            return TypeRefPrim.String
        if (it === gen.ScriptPrimType.Dict)
            return TypeRefPrim.Dict
        if (it === gen.ScriptPrimType.Any)
            return TypeRefPrim.Any

        const tarr = gen.typeArr(it)
        if (tarr)
            return { ValsOf: this.typeRef(tarr) }

        const ttup = gen.typeTup(it)
        if (ttup && ttup.length)
            return { TupOf: ttup.map(_ => this.typeRef(_)) }

        const tfun = gen.typeFun(it)
        if (tfun && tfun.length)
            return { From: tfun[0].map(_ => this.typeRef(_)), To: this.typeRef(tfun[1]) }

        let tsum = gen.typeSum(it)
        if (tsum && tsum.length) {
            let hadoptional = false
            tsum = tsum.filter(_ => {
                const optional = (_ === null || _ === gen.ScriptPrimType.Undefined || _ === gen.ScriptPrimType.Null)
                hadoptional = hadoptional || optional
                return (!optional) && !gen.typeProm(_)
            })
            if (tsum.length > 1)
                tsum = tsum.filter(_ => _ !== gen.ScriptPrimType.String)
            if (tsum.length > 1 && tsum.find(_ => _ === "Uri"))
                tsum = [gen.ScriptPrimType.String]
            if (tsum.length !== 1)
                throw it
            let ret = this.typeRef(tsum[0], needMaybe, intoProm, propsRelated)
            return hadoptional ? this.typeRefEnsureMaybe(ret) : ret
        }

        const tmul = gen.typeMul(it)
        if (tmul && tmul.length && typeof tmul[0] === 'string') {
            const ands: { [_: string]: Expr } = {}
            for (const _ of tmul.slice(1)) {
                let tobj = gen.typeObj(_)
                if (!(tobj && tobj.length))
                    throw _
                for (const tup of tobj)
                    if (tup[1] === gen.ScriptPrimType.BooleanTrue)
                        ands[tup[0]] = this.eLit(true)
                    else if (tup[1] === gen.ScriptPrimType.BooleanFalse)
                        ands[tup[0]] = this.eLit(false)
                    else
                        throw tup[1]
            }
            return { Name: tmul[0], Ands: ands }
        }

        const tobj = gen.typeObj(it)
        if (tobj && tobj.length)
            if (tobj.length === 1 && tobj[0] && tobj[0][0] === '' && tobj[0].length && tobj[0].length === 2) {
                const tfun = gen.typeFun(tobj[0][1])
                if (tfun.length === 2 && tfun[0] && tfun[0].length === 1) {
                    const tdictkey = tfun[0][0], tdictval = tfun[1]
                    return { ValsOf: this.typeRef(tdictval), KeysOf: this.typeRef(tdictkey) }
                }
            }

        const tprom = gen.typeProm(it)
        if (tprom && tprom.length)
            if (tprom.length > 1 && (intoProm || tprom[0] === gen.idents.coreTypeDisp))
                throw it
            else if (intoProm)
                return this.typeRef(tprom[0])
            else if (tprom[0] === gen.idents.coreTypeDisp)
                return { From: [{ Maybe: { Name: gen.idents.coreTypeDisp } }], To: null }
            else
                return { From: tprom.map(_ => this.typeRef(_, !(_ === gen.ScriptPrimType.Boolean || propsRelated))), To: null }

        if (typeof it === 'string')
            return this.gen.options.typeNamesToString.includes(it) ? TypeRefPrim.String : { Name: this.gen.nameRewriters.types.structs(it) }

        throw JSON.stringify(it)
    }

    docs(docs: gen.Docs, extraSummaryLines: string[] = undefined, isMethod = false, appendArgsAndRetsToSummaryToo = true, into: Doc[] = undefined) {
        const istop = (into === undefined)
        if (istop)
            into = []
        if (docs && docs.length) for (const doc of docs) {
            if (doc.lines && doc.lines.length) {
                let name = doc.isForArg
                if (!(name && name.length))
                    name = doc.isForRet ? this.gen.options.doc.appendArgsToSummary.retArgName : ""
                let dst = into.find(_ => _.ForParam === name)
                if (isMethod || !(name && name.length)) {
                    if (!dst)
                        into.push(dst = { ForParam: name, Lines: [] })
                    dst.Lines.push(...doc.lines)
                }
                if (name && name.length && appendArgsAndRetsToSummaryToo && (dst = into.find(_ => _.ForParam === '')))
                    dst.Lines.push('', ...doc.lines.map((ln, idx) =>
                        (idx ? ln : gen.docPrependArgOrRetName(doc, ln, this.gen.options.doc.appendArgsToSummary.retArgName, this.gen.options.doc.appendArgsToSummary.prefix, this.gen.options.doc.appendArgsToSummary.suffix, this.gen.nameRewriters.args))
                    ))
            }
            if (doc.subs && doc.subs.length)
                this.docs(doc.subs, undefined, isMethod, appendArgsAndRetsToSummaryToo, into)
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
    protected isDemos: boolean = false
    protected opDepth: number = 0

    allEnums: TEnum[] = null
    allInterfaces: TInterface[] = null
    allStructs: { [_: string]: TStruct } = null

    nameRewriters = {
        args: this.caseLo,
        fields: this.caseUp,
        methods: this.caseUp,
        enumerants: this.caseUp,
        types: { enums: this.caseUp, structs: this.caseUp, interfaces: this.caseUp },
    }
    options = {
        doc: {
            appendArgsToSummary: {
                forMethods: true,
                forFuncFields: true,
                prefix: "`",
                suffix: "` ── ",
                retArgName: "return",
            }
        },
        idents: {
            null: "null",
            curInst: "this",
            typeAny: "any",
            typeDict: "dict",
            typeImpl: "impl",
        },
        unMaybeOutgoingTypes: [TypeRefPrim.String, TypeRefPrim.Bool] as TypeRef[],
        oneIndent: '    ',
        optionalEnumsZeroNotZilch: false,
        haveProps: true,
        demoOutFilePath: "",
        typeNamesToString: ["Uri", "ThemeColor", "ThemeIcon"],
    }

    constructor(outFilePath: [string, string], demoOutFilePath: string = "") {
        super(outFilePath)
        this.options.demoOutFilePath = demoOutFilePath
    }

    indented(then: () => void): Gen {
        this.indents++
        then()
        this.indents--
        return this
    }

    indent(n: number = 1): Gen {
        this.indents += n
        return this
    }

    undent(n: number = 1): Gen {
        this.indents -= n
        return this
    }

    ln(then: (() => void)): Gen {
        this.src += this.options.oneIndent.repeat(this.indents)
        then()
        this.src += "\n"
        return this
    }

    each<T>(arr: T[], joinBy: string, then: ((_: T, i?: number) => void)): Gen {
        for (let i = 0; i < arr.length; i++) {
            if (i > 0)
                this.s(joinBy)
            then(arr[i], i)
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
        this.src += (this.options.oneIndent.repeat(this.indents) + s.join(''))
        return this
    }

    s(...s: string[]): Gen {
        this.src += s.join('')
        return this
    }

    caseOf(...cases: [any, () => void][]): Gen {
        for (const caseof of cases)
            if (caseof[0]) {
                caseof[1]()
                break
            }
        return this
    }

    when(check: any, ifTrue: () => void, ifFalse: () => void = undefined): Gen {
        if (check) ifTrue()
        else if (ifFalse) ifFalse()
        return this
    }

    ensureMethodDocsArgsAndRet(it: WithDocs): Gen {
        if (!(it.Docs && it.Docs.length)) {
            const named = it as WithName
            if (named && named.Name && named.Name.length)
                switch (named.Name) {
                    case "Dispose":
                        it.Docs = [{ Lines: ["Dispose requests the VSC side to forget about this object and release or destroy all resources associated with or occupied by it. All subsequent usage attempts will be rejected."] }]
                        break
                }
        }
        if (it.Docs && it.Docs.length) {
            const me = it as Method
            if (me && me.Name && me.Name.length && me.Args !== undefined && me.Args !== null) {
                let docarg = "", docret = ""
                if (me.IsObjCtor)
                    docret = "a thenable that resolves to the newly created `" + me.IsObjCtor + "`."
                else if (me.IsObjEvt)
                    [docarg, docret] = ["will be invoked whenever the `" + me.Name + "` event fires (mandatory, not optional).", "A `" + gen.idents.coreTypeDisp + "` that will unsubscribe `" + gen.idents.argHandler + "` from the `" + me.Name + "` event on `Dispose`."]
                else if (me.Args.length === 1 && me.Args[0].Name === gen.idents.argListener && this.typeFunc(me.Args[0].Type) && this.typeFunc(me.Type) && gen.typePromOf(me.fromPrep.args.find(_ => _.isFromRetThenable).typeSpec, gen.idents.coreTypeDisp))
                    [docarg, docret] = ["will be invoked whenever the `" + me.Name + "` event fires (mandatory, not optional).", "A `" + gen.idents.coreTypeDisp + "` that will unsubscribe `" + gen.idents.argListener + "` from the `" + me.Name + "` event on `Dispose`."]
                else if (me.IsSubNs)
                    docarg = "TODO_ARG_SUB"
                else if (me.fromPrep && me.fromPrep.isProps)
                    docarg = "TODO_ARG_PROPS"
                if ((!docret) && this.typeFunc(me.Type) && (me.Type as TypeRefFunc).From && (me.Type as TypeRefFunc).From.length && this.typeFunc((me.Type as TypeRefFunc).From[0])) {
                    const tret = this.typeUnMaybe(((this.typeFunc((me.Type as TypeRefFunc).From[0])) as TypeRefFunc).From[0]) as TypeRefOwn
                    docret = "a thenable that resolves when this `" + me.Name + "` call has successfully completed at the VSC side" + ((!tret) ? "" : (" and its" + ((!tret.Name) ? " " : (" `" + tret.Name + "` ")) + "result received back at our end")) + "."
                }

                const docsadded: string[] = []
                for (const arg of me.Args)
                    if (!me.Docs.some(_ => _.ForParam === arg.Name)) {
                        docsadded.push(arg.Name)
                        me.Docs.push({ ForParam: arg.Name, Lines: [docarg] })
                    }
                if (docret && docret.length && me.Type && !me.Docs.some(_ => _.ForParam === this.options.doc.appendArgsToSummary.retArgName)) {
                    me.Docs.push({ ForParam: this.options.doc.appendArgsToSummary.retArgName, Lines: [docret] })
                    docsadded.push("")
                }

                const summary = me.Docs.find(_ => !_.ForParam)
                if (docsadded.length && summary && this.options.doc.appendArgsToSummary.forMethods) {
                    const retpos = -1 + summary.Lines.findIndex(_ => _.startsWith(this.options.doc.appendArgsToSummary.prefix + this.options.doc.appendArgsToSummary.retArgName + this.options.doc.appendArgsToSummary.suffix))
                    const fromret = (retpos < 0) ? [] : summary.Lines.slice(retpos)
                    if (fromret && fromret.length)
                        summary.Lines = summary.Lines.slice(0, retpos)

                    for (const argname of docsadded)
                        if (argname && argname.length)
                            summary.Lines.push("", this.options.doc.appendArgsToSummary.prefix + argname + this.options.doc.appendArgsToSummary.suffix + docarg)

                    if (fromret && fromret.length)
                        summary.Lines.push(...fromret)

                    if (docsadded.includes(""))
                        summary.Lines.push("", this.options.doc.appendArgsToSummary.prefix + this.options.doc.appendArgsToSummary.retArgName + this.options.doc.appendArgsToSummary.suffix + docret)
                }
            }
        }
        return this
    }

    emitDocs(it: (WithDocs & WithName)): Gen {
        this.ensureMethodDocsArgsAndRet(it)
        if (it.name && it.Name && it.name !== it.Name)
            this.line("# " + it.name + ":")
        if (it.Docs && it.Docs.length)
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
        if (it === TypeRefPrim.Real)
            return this.s("real")
        if (it === TypeRefPrim.String)
            return this.s("string")
        if (it === TypeRefPrim.Dict)
            return this.s(this.options.idents.typeDict)

        const ttup = this.typeTup(it)
        if (ttup)
            return this.s("[").each(ttup.TupOf, ',', _ => this.emitTypeRef(_)).s(']')

        const tarr = this.typeColl(it)
        if (tarr)
            return this.s('[').emitTypeRef(tarr.ValsOf).s(']')

        const tfun = this.typeFunc(it)
        if (tfun)
            return this.s('(').each(tfun.From, '->', _ => this.emitTypeRef(_)).s('->').emitTypeRef(tfun.To).s(')')

        const tmay = this.typeMaybe(it)
        if (tmay)
            return this.s('?').emitTypeRef(tmay.Maybe)

        const tname = this.typeOwn(it)
        if (tname)
            return this.s(tname.Name)

        throw JSON.stringify(it)
    }

    emitMethodImpl(interfaceOrStruct: TypeRefOwn, method: Method, fillBody: ((interfaceOrStruct: TypeRefOwn, method: Method, _: Builder, bodyToFill: Instr[]) => void)) {
        this.ensureMethodDocsArgsAndRet(method)
        const me: Func = {
            name: method.name, Name: method.Name, Type: interfaceOrStruct, Func: {
                Args: method.Args, Type: method.Type, Body: { Instrs: [] }
            }, Docs: method.Docs
        }
        fillBody.call(this, interfaceOrStruct, method, this.b, me.Func.Body.Instrs)
        this.emitFuncImpl(me)
    }

    emitFuncImpl(it: Func) {
        this.lines('', '')
            .ln(() => this.emitTypeRef(it.Type).s('·', it.Name, ': (').each(it.Func.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type)).s(' -> ').emitTypeRef(it.Func.Type).s(')'))
            .emitInstr(it.Func.Body)
            .lines('', '')
    }

    emitInstr(it: Instr, _inBlock: boolean = false): Gen {
        if (it) {

            const iret = it as IRet
            if (iret && iret.Ret !== undefined)
                return this.ln(() =>
                    this.s("return ").emitExpr((!iret.Ret) ? undefined : iret.Ret))

            const ivar = it as IVar
            if (ivar && ivar.Name && ivar.Type)
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

            const ecall = it as ECall
            if (ecall && ecall.Call)
                return this.ln(() =>
                    this.emitExpr(ecall))

            const iblock = it as IBlock
            if (iblock && iblock.Instrs !== undefined) {
                if (iblock.Lock)
                    this.ln(() => this.s('lock ').emitExpr(iblock.Lock))
                else if (iblock.ForEach && iblock.ForEach.length)
                    this.ln(() => this.s("for ", iblock.ForEach[0].Name, " in ").emitExpr(iblock.ForEach[1]))
                else if (iblock.If && iblock.If.length)
                    this.ln(() => this.s("if ").emitExpr(iblock.If[0]))

                this.indented(() =>
                    iblock.Instrs.forEach(_ => this.emitInstr(_, true)))

                if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                    this.line("else")
                        .emitInstr(iblock.If[1])
                return this
            }

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
            return this.s(this.options.idents.null)

        const elit = it as ELit
        if (elit && elit.Lit !== undefined)
            return this.s((elit.Lit === null) ? this.options.idents.null : node_util.format("%j", elit.Lit))

        const ecollnew = it as ECollNew
        if (ecollnew && (ecollnew.Cap !== undefined || ecollnew.Len !== undefined))
            return this.when(ecollnew.ElemType,
                () => this.s('[').emitTypeRef(ecollnew.ElemType).s(']'),
                () => this.s(this.options.idents.typeDict)
            ).s('·new(').emitExpr(ecollnew.Cap ? ecollnew.Cap : ecollnew.Len).s(')')

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
            return this.s('[').each(etup.Items, ', ', _ => { this.emitExpr(_) }).s(']')

        const ecall = it as ECall
        if (ecall && ecall.Call)
            return (ecall.Prop && this.options.haveProps && !(ecall.Args && ecall.Args.length))
                ? this.emitExpr(ecall.Call)
                : this.emitExpr(ecall.Call).s("(").emitExprs(", ", ...ecall.Args).s(")")

        const eop = it as EOp
        if (eop && eop.Name && eop.Operands && eop.Operands.length) {
            this.opDepth++
            const notactualoperator = (eop.Name === BuilderOperators.Idx || eop.Name === BuilderOperators.IdxMay || eop.Name === BuilderOperators.Dot)
            this.s(((this.opDepth === 1 || notactualoperator) ? '' : '(') + ((eop.Operands.length > 1) ? '' : /* unary*/ eop.Name))
                .emitExprs(notactualoperator ? eop.Name : (' ' + eop.Name + ' '), ...eop.Operands)
                .s((this.opDepth === 1 || notactualoperator) ? '' : ')')
            this.opDepth--
            return this
        }

        const efn = it as EFunc
        if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
            return this
                .s('(')
                .each(efn.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type))
                .s(' -> ').emitTypeRef(efn.Type)
                .s(')\n')
                .emitInstr(efn.Body)
                .lf()

        const ename = it as EName
        if (ename && ename.Name !== undefined)
            return this.s(ename.Name ? ename.Name : this.options.idents.curInst)

        throw "<expr>" + JSON.stringify(it)
    }

    private convOrRet(dstVarName: string, src: Expr, dstType: TypeRef, onErrRet: Expr = undefined): Instr[] {
        const _ = this.b

        if (!onErrRet)
            onErrRet = _.eLit(false)
        const retifnotok = _.iIf(_.oNot(_._(gen.idents.varOk)), [_.iRet(onErrRet),])

        if (dstType === TypeRefPrim.Any || this.typeUnMaybe(dstType) === TypeRefPrim.Any)
            return [
                _.iSet(_.eTup(_._(dstVarName), _._(gen.idents.varOk)), _.eTup(src, _.eLit(true))),
                _.iIf(_._(gen.idents.varOk), []),
            ]

        const tdstnamed = this.typeOwn(this.typeUnMaybe(dstType))
        if (tdstnamed) {
            const tstruct = this.allStructs[tdstnamed.Name], tenum = tstruct ? null : this.allEnums.find(_ => _.Name === tdstnamed.Name)
            if (tenum) {
                const tmpvarname = "i_" + dstVarName
                return ([
                    _.iVar(tmpvarname, TypeRefPrim.Int),
                ] as Instr[]).concat(...this.convOrRet(tmpvarname, src, TypeRefPrim.Int, onErrRet)).concat(...[
                    _.iSet(_._(dstVarName), _.eConv(dstType, _._(tmpvarname), true)),
                ])
            } else {
                if (tdstnamed.Name !== gen.idents.coreTypeDisp && (!this.options.typeNamesToString.includes(tdstnamed.Name)) && this.state.genPopulateFor[tdstnamed.Name] !== false) // why this peculiar checking construct?..
                    this.state.genPopulateFor[tdstnamed.Name] = true // ..see the consumer of genPopulateFor to grasp it
                return ([
                    _.iSet(_._(dstVarName), _.eNew(dstType)),
                    _.iSet(_._(gen.idents.varOk), _.eCall(_._(dstVarName, gen.idents.methodLoadFrom), src)),
                    retifnotok,
                ] as Instr[]).concat(..._.WHEN(tstruct && tstruct.fromPrep && tstruct.fromPrep.isDispObj, () => [
                    _.iSet(_._(gen.idents.varRes, gen.idents.fldDisp, gen.idents.fldImpl), _.eCall(_._(_.eThis(), gen.idents.methodImpl))),
                ] as Instr[]))
            }
        }

        const tdstmaybe = this.typeMaybe(dstType)
        if (tdstmaybe && (tdstmaybe.Maybe === TypeRefPrim.Bool || tdstmaybe.Maybe === TypeRefPrim.Int || tdstmaybe.Maybe === TypeRefPrim.Real || tdstmaybe.Maybe === TypeRefPrim.String)) {
            const tmpname = "_" + dstVarName + "_"
            return [
                _.iVar(tmpname, tdstmaybe.Maybe),
                _.iSet(_.eTup(_._(tmpname), _._(gen.idents.varOk)), _.eConv(tdstmaybe.Maybe, src)),
                retifnotok,
                _.iSet(_._(dstVarName), _.oAddr(_._(tmpname))),
            ]
        }

        const tdstcoll = this.typeColl(this.typeUnMaybe(dstType))
        if (tdstcoll && tdstcoll.ValsOf && tdstcoll.KeysOf === undefined) {
            const tcoll: TypeRefColl = { ValsOf: TypeRefPrim.Any }
            const tncoll = "__coll__" + dstVarName, tnidx = "__idx__" + dstVarName, tnitem = "__item__" + dstVarName, tnval = "__val__" + dstVarName
            return (tdstcoll.ValsOf === TypeRefPrim.Any) ? [
                _.iSet(_.eTup(_._(dstVarName), _._(gen.idents.varOk)), _.eConv(tcoll, src)),
                retifnotok,
            ] : [
                    _.iVar(tncoll, tcoll),
                    _.iSet(_.eTup(_._(tncoll), _._(gen.idents.varOk)), _.eConv(tcoll, src)),
                    retifnotok,
                    _.iSet(_._(dstVarName), _.eCollNew(_.eLen(_._(tncoll), true), tdstcoll.ValsOf, true)),
                    _.iVar(tnidx, TypeRefPrim.Int),
                    _.iSet(_._(tnidx), _.eLit(0)),
                    _.iFor(_.eName(tnitem), _._(tncoll),
                        ...[
                            _.iVar(tnval, tdstcoll.ValsOf) as Instr,
                        ].concat(
                            ...this.convOrRet(tnval, _._(tnitem), tdstcoll.ValsOf, onErrRet)
                        ).concat(
                            _.iSet(_.oIdx(_._(dstVarName), _._(tnidx)), _._(tnval)),
                            _.iSet(_._(tnidx), _.eOp('+', _._(tnidx), _.eLit(1))),
                        )
                    ),
                ]
        }

        if (dstType === TypeRefPrim.Int || dstType === TypeRefPrim.Real) {
            const alttype = (dstType === TypeRefPrim.Int) ? TypeRefPrim.Real : TypeRefPrim.Int
            const altname = "__" + dstVarName + "__"
            return [
                _.iSet(_.eTup(_._(dstVarName), _._(gen.idents.varOk)), _.eConv(dstType, src)),
                _.iIf(_.oNot(_._(gen.idents.varOk)), [
                    _.iVar(altname, alttype),
                    _.iSet(_.eTup(_._(altname), _._(gen.idents.varOk)), _.eConv(alttype, src)),
                    retifnotok,
                    _.iSet(_._(dstVarName), _.eConv(dstType, _._(altname), true)),
                ]),
            ]
        }

        return [
            _.iSet(_.eTup(_._(dstVarName), _._(gen.idents.varOk)), _.eConv(dstType, src)),
            retifnotok,
        ]
    }

    private genMethodImpl_TopInterface(_iface: TypeRefOwn, method: Method, _: Builder, body: Instr[]) {
        body.push(_.iRet(_.eConv({ Name: this.options.idents.typeImpl + method.Name }, _.eThis())))
    }

    private genMethodImpl_PopulateFrom(struct: TypeRefOwn, _method: Method, _: Builder, body: Instr[]) {
        const tstruct = struct as TStruct
        if (!(tstruct && tstruct.Fields))
            throw struct

        if (tstruct.fromPrep && tstruct.fromPrep.isDispObj) {
            body.push(
                _.iVar(gen.idents.varOk, TypeRefPrim.Bool),
                _.iSet(_._(_.eThis(), gen.idents.fldDisp), _.eNew({ Maybe: { Name: gen.idents.coreTypeDisp } })),
                _.iSet(_._(gen.idents.varOk), _.eCall(_._(_.eThis(), gen.idents.fldDisp, gen.idents.methodLoadFrom), _._(gen.idents.argPayload))),
                _.iRet(_._(gen.idents.varOk)),
            )
        } else {
            body.push(
                _.iVar(gen.idents.varIt, TypeRefPrim.Dict),
                _.iVar(gen.idents.varOk, TypeRefPrim.Bool),
                _.iVar(gen.idents.varVal, TypeRefPrim.Any),
            )
            body.push(...this.convOrRet(gen.idents.varIt, _._(gen.idents.argPayload), TypeRefPrim.Dict))

            for (const fld of tstruct.Fields) {
                const isreadonly = tstruct.fromPrep && tstruct.fromPrep.isPropsOfStruct && fld.fromPrep && fld.fromPrep.readOnly
                if (fld.Json && ((!fld.Json.Excluded) || isreadonly)) {
                    const tfld = isreadonly ? (fld.Type as TypeRefFunc).To : this.typeRefForField(fld.Type, fld.fromPrep && fld.fromPrep.optional)
                    body.push(
                        _.iSet(_.eTup(_._(gen.idents.varVal), _._(gen.idents.varOk)), _.oIdxMay(_._(gen.idents.varIt), _.eLit(fld.Json.Name))),
                        _.iIf(_._(gen.idents.varOk), [
                            _.iVar(fld.name, tfld),
                            _.iIf(_.oIs(_._(gen.idents.varVal)),
                                this.convOrRet(fld.name, _._(gen.idents.varVal), tfld),
                            ),
                            _.iSet(_._(_.eThis(), fld.Name), isreadonly ? _.eFunc(
                                [], (fld.Type as TypeRefFunc).To, _.iRet(_._(fld.name))
                            ) : _._(fld.name)),
                        ],
                            fld.Json.Required ? [_.iRet(_.eLit(false))] : []
                        ),
                    )
                }
            }
            body.push(_.iRet(_.eLit(true)))
        }
    }

    private genMethodImpl_ObjPropsGet(struct: TypeRefOwn, method: Method, _: Builder, body: Instr[]) {
        this.genMethodImpl_methodCall(struct, method, _, body, _._(_.eThis(), gen.idents.fldDisp, gen.idents.coreFldId), _._(_.eThis(), gen.idents.fldDisp, gen.idents.fldImpl), gen.idents.fldDispObjBag)
    }

    private genMethodImpl_ObjPropsSet(struct: TypeRefOwn, method: Method, _: Builder, body: Instr[]) {
        this.genMethodImpl_methodCall(struct, method, _, body, _._(_.eThis(), gen.idents.fldDisp, gen.idents.coreFldId), _._(_.eThis(), gen.idents.fldDisp, gen.idents.fldImpl))
    }

    private genMethodImpl_ObjMethodCall(struct: TypeRefOwn, method: Method, _: Builder, body: Instr[]) {
        if (method.Name === "Dispose")
            body.push(
                _.iRet(_.eCall(_._(_.eThis(), gen.idents.fldDisp, "Dispose"))),
            )
        else
            this.genMethodImpl_methodCall(struct, method, _, body, _._(_.eThis(), gen.idents.fldDisp, gen.idents.coreFldId), _._(_.eThis(), gen.idents.fldDisp, gen.idents.fldImpl))
    }

    private genMethodImpl_ApiMethodCall(typeRef: TypeRefOwn, method: Method, _: Builder, body: Instr[]) {
        if (method.IsSubNs)
            body.push(_.iRet(_.eConv({ Name: this.options.idents.typeImpl + method.Name }, _.eCall(_._(_.eThis(), gen.idents.methodImpl)))))
        else
            this.genMethodImpl_methodCall(typeRef, method, _, body)
    }

    private genMethodImpl_methodCall(ifaceOrStruct: TypeRefOwn, method: Method, _: Builder, body: Instr[], idVal?: Expr, impl?: Expr, retIntoFld?: string) {
        const funcfields = method.fromPrep ? gen.argsFuncFields(_.prep, method.fromPrep.args) : []
        const numargs = method.fromPrep ? method.fromPrep.args.filter(_ => !_.isFromRetThenable).length : method.Args.length

        if (!impl)
            impl = _.eCall(_._(_.eThis(), gen.idents.methodImpl))

        body.push(
            _.iVar(gen.idents.varMsg, { Maybe: { Name: gen.idents.coreTypeMsg } }),
            _.iSet(_._(gen.idents.varMsg), _.eNew({ Maybe: { Name: gen.idents.coreTypeMsg } })),
            _.iSet(_._(gen.idents.varMsg, gen.idents.coreFldMsgQn), _.eLit(
                (ifaceOrStruct.name + '.' + (method.fromPrep ? method.fromPrep.name : method.Name))
            )),
            _.iSet(_._(gen.idents.varMsg, gen.idents.coreFldMsgData), _.eCollNew(_.eLit(numargs + (idVal ? 1 : 0)))),
        )
        if (idVal)
            body.push(_.iSet(_.oIdx(_._(gen.idents.varMsg, gen.idents.coreFldMsgData), _.eLit("")), idVal))

        const twinargs: { [_: string]: { origStruct: TStruct, twinStructName: string, altName: string } } = {}
        if (funcfields.length) {
            for (const ff of funcfields)
                for (const structname in this.allStructs) {
                    const struct = this.allStructs[structname]
                    if (struct && struct.fromPrep && struct.fromPrep === ff.struct && struct.OutgoingTwin && struct.OutgoingTwin.length) {
                        const twinarg = (twinargs[ff.arg.name] = { origStruct: struct, twinStructName: struct.OutgoingTwin, altName: "__" + ff.arg.name + "__" })
                        body.push(_.iVar(twinarg.altName, { Maybe: { Name: twinarg.twinStructName } }))
                        break
                    }
                }

            body.push(
                _.iVar(gen.idents.varFnids, { ValsOf: TypeRefPrim.String, KeysOf: null }),
                _.iSet(_._(gen.idents.varFnids), _.eCollNew(_.eLit(funcfields.length), TypeRefPrim.String)),
            )
            for (const ff of funcfields) {
                let ffname = this.nameRewriters.fields(ff.name),
                    ffld = ff.struct.fields.find(_ => _.name === ff.name),
                    structfield = this.allStructs[this.nameRewriters.types.structs(ff.struct.name)].Fields.find(_ => _.fromPrep === ffld),
                    fnargs = gen.typeFun(ffld.typeSpec)[0],
                    twinarg = twinargs[ff.arg.name],
                    origargname = this.nameRewriters.args(ff.arg.name),
                    argname = (twinarg && twinarg.altName && twinarg.altName.length) ? twinarg.altName : origargname
                body.push(_.iIf((!ff.arg.optional) ? _.eLit(true) : _.oIs(_._(origargname)),
                    _.WHEN(twinarg, () => [
                        _.iSet(_._(argname), _.eNew({ Maybe: { Name: twinarg.twinStructName } })),
                        _.iSet(_._(argname, twinarg.origStruct.Name), ff.arg.optional ? _._(origargname) : _.oAddr(_._(origargname))),
                    ]).concat(
                        _.iSet(_._(argname, ffname + gen.idents.fldSuffFuncId), _.eLit("")),
                        _.iVar(gen.idents.varFn, structfield.Type),
                        _.iSet(_._(gen.idents.varFn), _._(argname, ffname)),
                        _.iIf(_.oIs(_._(gen.idents.varFn)), [_.iLock(_.eThis(),
                            _.iSet(_._(argname, ffname + gen.idents.fldSuffFuncId), _.eCall(_._(impl, gen.idents.coreMethodNextId))),
                            _.iAdd(_._(gen.idents.varFnids), _._(argname, ffname + gen.idents.fldSuffFuncId)),
                            _.iSet(_.oIdx(_._(impl, gen.idents.coreFldCbOther), _._(argname, ffname + gen.idents.fldSuffFuncId)),
                                _.eFunc([{ Name: gen.idents.argArgs, Type: { ValsOf: TypeRefPrim.Any } }], { TupOf: [TypeRefPrim.Any, TypeRefPrim.Bool] },
                                    _.iIf(_.oNeq(_.eLit((fnargs.length)), _.eLen(_._(gen.idents.argArgs), true)), [
                                        _.iRet(_.eTup(_.eZilch(), _.eLit(false))),
                                    ], [_.iVar(gen.idents.varOk, TypeRefPrim.Bool) as Instr].concat(
                                        ..._.EACH(fnargs, (fnarg, idx) => [
                                            _.iVar('__' + idx, this.b.typeRef(fnarg)),
                                            _.iIf(_.oIs(_.oIdx(_._(gen.idents.argArgs), _.eLit(idx))),
                                                this.convOrRet('__' + idx, _.oIdx(_._(gen.idents.argArgs), _.eLit(idx)), this.b.typeRef(fnarg), _.eTup(_.eZilch(), _.eLit(false))),
                                                (fnarg === gen.ScriptPrimType.Number || this.typeOwn(this.b.typeRef(fnarg))) ? [
                                                    _.iRet(_.eTup(_.eZilch(), _.eLit(false))),
                                                ] : [],
                                            ),
                                            _.iRet(_.eTup(_.eCall(_._(gen.idents.varFn), ...fnargs.map((_a, idx) => _._('__' + idx))), _.eLit(true))),
                                        ] as Instr[]))
                                    ),
                                )
                            ),
                        )]),
                    )
                ))
            }
        }

        let evtsubfnids: string[] = []
        const eventlike = (arg: Arg) => {
            const fnid = arg.Name + gen.idents.varSuffFnid
            const tfun = this.typeFunc(arg.Type)
            evtsubfnids.push(fnid)
            const numargs = (isevt && isevt.EvtArgs) ? isevt.EvtArgs.length : tfun.From.length
            const argtypes: TypeRef[] = (!(isevt && isevt.EvtArgs)) ? tfun.From : isevt.EvtArgs.map(t => this.b.typeRef(this.b.prep.typeSpec(t)))
            const rettype = tfun ? tfun.To : null
            let call: Instr = _.eCall(_._(arg.Name), ...argtypes.map((_a, i) => _._(`_a_${i}_`)))
            let onerrret: Expr
            if (rettype)
                [call, onerrret] = [_.iSet(_._(gen.idents.varRet), call), _.eTup(_.eZilch(), _.eLit(false))]
            if (method.IsObjEvt)
                call = _.iBlock(
                    _.iLock(_._(_.eThis(), gen.idents.fldDispObjBag),
                        _.iSet(_._(gen.idents.varOk), _.eCall(_._(_.eThis(), gen.idents.fldDispObjBag, gen.idents.methodLoadFrom), _.oIdx(_._(gen.idents.argArgs), _.eLit(numargs)))),
                    ),
                    _.iIf(_.oNot(_._(gen.idents.varOk)), [_.iRet(_.eLit(false))]),
                    call,
                )
            const handler = _.eFunc([{ Name: gen.idents.argArgs, Type: { ValsOf: TypeRefPrim.Any } }], rettype ? { TupOf: [TypeRefPrim.Any, TypeRefPrim.Bool] } : TypeRefPrim.Bool,
                ...[
                    _.iVar(gen.idents.varOk, TypeRefPrim.Bool) as Instr,
                    _.iIf(_.oNeq(_.eLit((method.IsObjEvt ? 1 : 0) + numargs), _.eLen(_._(gen.idents.argArgs), true)), [
                        _.iRet(rettype ? _.eTup(_.eZilch(), _._(gen.idents.varOk)) : _._(gen.idents.varOk)),
                    ]) as Instr,
                ].concat(..._.WHEN(rettype, () => [
                    _.iVar(gen.idents.varRet, TypeRefPrim.Any) as Instr,
                ])).concat(
                    _.EACH(argtypes, (atype, i): Instr[] =>
                        _.LET(`_a_${i}_`, aname =>
                            [_.iVar(aname, atype) as Instr].concat(
                                this.convOrRet(aname, _.oIdx(_._(gen.idents.argArgs), _.eLit(i)), atype, onerrret),
                            )
                        ),
                    )).concat(
                        call,
                        _.iRet(rettype ? _.eTup(_._(gen.idents.varRet), _.eLit(true)) : _.eLit(true)),
                    ),
            )
            body.push(
                _.iVar(fnid, TypeRefPrim.String),
                _.iIf(_.oIsnt(_._(arg.Name)), [
                    _.eCall(_._(gen.idents.coreMethodOnErr), impl, _.eLit(`${ifaceOrStruct.Name}.${method.Name}: the '${arg.Name}' arg (which is not optional but required) was not passed by the caller`), _.eZilch()),
                    _.iRet(_.eZilch()),
                ]),
                _.iSet(_._(fnid), _.eCall(_._(impl, gen.idents.coreMethodNextSub),
                    rettype ? _.eZilch() : handler, rettype ? handler : _.eZilch(),
                )),
                _.iSet(_.oIdx(_._(gen.idents.varMsg, gen.idents.coreFldMsgData), _.eLit(arg.name)), _._(fnid)),
            )
            return fnid
        }

        if ((!method.Type) || (method.Type as TypeRefFunc).From.length !== 1 || (method.Type as TypeRefFunc).To || ((method.Type as TypeRefFunc).From[0] as TypeRefFunc).To)
            throw method.Type
        const rettype = ((method.Type as TypeRefFunc).From[0] as TypeRefFunc).From[0]
        const isdisp = this.typeOwnOf(rettype, gen.idents.coreTypeDisp)
        const isevt: gen.MemberEvent = (method.fromPrep && method.fromPrep.fromOrig) ? method.fromPrep.fromOrig.decl as gen.MemberEvent : null
        if (isevt && isevt.EvtName && isevt.EvtName.length)
            eventlike(method.Args[0])
        else
            for (const arg of method.Args)
                if ((!arg.fromPrep) || (!arg.fromPrep.isFromRetThenable))
                    if (arg.fromPrep && arg.fromPrep.isCancellationToken !== undefined)
                        body.push(_.iIf(_.oIs(_._(arg.Name)), [
                            _.iSet(_._(arg.Name, gen.idents.fldImpl), impl),
                            _.iIf(_.oEq(_.eLit(""), _._(arg.Name, gen.idents.coreFldFnId)), [
                                _.iLock(_.eThis(),
                                    _.iSet(_._(arg.Name, gen.idents.coreFldFnId), _.eCall(_._(impl, gen.idents.coreMethodNextId))),
                                ),
                            ]),
                            _.iSet(_.oIdx(_._(gen.idents.varMsg, gen.idents.coreFldMsgData), _.eLit(arg.name)), _._(arg.Name, gen.idents.coreFldFnId)),
                        ]))
                    else if (this.typeFunc(arg.Type)) {
                        const fnid = eventlike(arg)
                        if (method.IsObjEvt)
                            body.push(_.eCall(_._(_.eThis(), gen.idents.fldDisp, gen.idents.coreMethodAddSub), _._(fnid)))
                    } else {
                        let town = this.typeOwn(arg.Type)
                        if (town && town.Ands) {
                            let tstructmul: TStruct
                            for (const structname in this.allStructs)
                                if (structname === town.Name) {
                                    tstructmul = this.allStructs[structname]
                                    break
                                }
                            if (tstructmul)
                                for (const and in town.Ands)
                                    for (const fld of tstructmul.Fields.filter(_ => _.name === and))
                                        body.push(_.iSet(_._(arg.Name, fld.Name), town.Ands[and]))
                        }

                        const twinarg = twinargs[arg.Name]
                        let set: Instr = _.iSet(
                            _.oIdx(_._(gen.idents.varMsg, gen.idents.coreFldMsgData), _.eLit((arg.name && arg.name.length) ? arg.name : arg.Name)),
                            _._((twinarg && twinarg.altName && twinarg.altName.length) ? twinarg.altName : arg.Name),
                        )
                        if (arg.fromPrep && arg.fromPrep.optional && !this.options.unMaybeOutgoingTypes.includes(arg.Type)) {
                            const town = this.typeOwn(this.typeUnMaybe(arg.Type))
                            const tenum = (town && town.Name && town.Name.length) ? this.allEnums.find(_ => _.Name === town.Name) : null
                            set = _.iIf((tenum && this.options.optionalEnumsZeroNotZilch) ? _.oNeq(_.eLit(0), _._(arg.Name)) : _.oIs(_._(arg.Name)), [
                                set
                            ])
                        }
                        body.push(set)
                    }

        body.push(
            _.iVar(gen.idents.varOnResp, { From: [TypeRefPrim.Any], To: TypeRefPrim.Bool }),
            _.iVar(gen.idents.varOnRet, (method.Type as TypeRefFunc).From[0]),
        )

        // const meprop = (method.fromPrep && method.fromPrep.fromOrig) ? method.fromPrep.fromOrig.decl as gen.MemberProp : null
        // const isprop = meprop && meprop.PropType
        const isprops = method.fromPrep && method.fromPrep.isProps
        const isval = rettype === TypeRefPrim.Bool || rettype === TypeRefPrim.Int || rettype === TypeRefPrim.Real
        let dsttype = (isval || isprops) ? this.typeUnMaybe(rettype) : rettype
        if (this.typeMaybe(dsttype) && !this.typeMaybe(dsttype).Maybe)
            dsttype = null
        const tstruct = (ifaceOrStruct as TStruct).Fields ? (ifaceOrStruct as TStruct) : null
        const retintofld = retIntoFld ? tstruct.Fields.find(_ => _.Name === retIntoFld) : null
        if (retintofld)
            dsttype = retintofld.Type

        const result: Expr = retIntoFld ? _._(_.eThis(), retIntoFld) : _._(gen.idents.varRes)
        body.push(
            _.iSet(_._(gen.idents.varOnResp), _.eFunc([{ Name: gen.idents.argPayload, Type: TypeRefPrim.Any }], TypeRefPrim.Bool,
                ..._.WHEN(dsttype,
                    () => ((retIntoFld ? [
                        _.iVar(gen.idents.varOk, TypeRefPrim.Bool),
                        _.iIf(_.oIsnt(_._(_.eThis(), retIntoFld)), [_.iSet(_._(_.eThis(), retIntoFld), _.eNew(dsttype))]),
                        _.iSet(_._(_.eThis(), retIntoFld, gen.idents.fldBagHolder), _.eThis()),
                        _.iLock(_._(_.eThis(), retIntoFld),
                            _.iSet(_._(gen.idents.varOk), _.eCall(_._(_.eThis(), retIntoFld, gen.idents.methodLoadFrom), _._(gen.idents.argPayload))),
                        ),
                        _.iIf(_.oNot(_._(gen.idents.varOk)), [_.iRet(_.eLit(false))]),
                    ] as Instr[] : [
                        _.iVar(gen.idents.varOk, TypeRefPrim.Bool),
                        _.iVar(gen.idents.varRes, dsttype),
                        _.iIf(_.oIs(_._(gen.idents.argPayload)),
                            this.convOrRet(gen.idents.varRes, _._(gen.idents.argPayload), dsttype),
                            _.WHEN(isdisp || isval || isprops || method.IsObjCtor, () => [_.iRet(_.eLit(false))], () => []),
                        ),
                    ] as Instr[])).concat(..._.WHEN(isdisp,
                        () => [_.iIf(_.oIs(_._(gen.idents.varOnRet)), [
                            _.eCall(_._(gen.idents.varOnRet), _.eCall(_._(result, gen.idents.coreMethodBind), ...[impl].concat(...evtsubfnids.map(fnid => _._(fnid))))),
                        ])],
                        () => (!(method.IsObjCtor && method.IsObjCtor.length))
                            ? [_.iIf(_.oIs(_._(gen.idents.varOnRet)), [
                                _.eCall(_._(gen.idents.varOnRet), ...retintofld ? [] : [_._(result)]),
                            ])]
                            : [_.eCall(_.eCall(_._(result, gen.idents.methodObjBagPull)),
                                _.eFunc([], null,
                                    _.iIf(_.oIs(_._(gen.idents.varOnRet)), [
                                        _.eCall(_._(gen.idents.varOnRet), _._(result)),
                                    ]),
                                ),
                            )],
                    )).concat(_.iRet(_.eLit(true))),
                    () => {
                        const isdispobj = tstruct && tstruct.fromPrep && tstruct.fromPrep.isDispObj
                        const refetch = (isdispobj && !(method.IsObjCtor || method.IsObjEvt || method.Name === gen.idents.methodObjBagPush))
                        if (refetch) {
                            const tmp = gen.typeProm(method.fromPrep.args.find(_ => _.isFromRetThenable).typeSpec)
                            if (!(tmp && tmp.length && tmp.length === 1 && tmp[0] === null))
                                throw "TODO because new: non-void dispObj methods, specifically: " + ifaceOrStruct.Name + "." + method.Name
                        }
                        return refetch ?
                            ([
                                _.iVar(gen.idents.varIt, { ValsOf: TypeRefPrim.Any }),
                                _.iVar(gen.idents.varOk, TypeRefPrim.Bool),
                            ] as Instr[]).concat(...this.convOrRet(gen.idents.varIt, _._(gen.idents.argPayload), { ValsOf: TypeRefPrim.Any })).concat(...[
                                _.iIf(_.oOr(_.oNeq(_.eLit(2), _.eLen(_._(gen.idents.varIt), true)), _.oIsnt(_.oIdx(_._(gen.idents.varIt), _.eLit(1)))), [
                                    _.iRet(_.eLit(false)),
                                ]),
                                _.iLock(_._(_.eThis(), gen.idents.fldDispObjBag),
                                    _.iSet(_._(gen.idents.varOk), _.eCall(_._(_.eThis(), gen.idents.fldDispObjBag, gen.idents.methodLoadFrom), _.oIdx(_._(gen.idents.varIt), _.eLit(1)))),
                                ),
                                _.iIf(_.oNot(_._(gen.idents.varOk)), [_.iRet(_.eLit(false))]),
                                _.iIf(_.oIs(_._(gen.idents.varOnRet)), [_.eCall(_._(gen.idents.varOnRet))]),
                                _.iRet(_.eLit(true)),
                            ]) : (isdispobj && method.Name === gen.idents.methodObjBagPush) ? [
                                _.iVar(gen.idents.varOk, TypeRefPrim.Bool),
                                _.iLock(_._(_.eThis(), gen.idents.fldDispObjBag),
                                    _.iSet(_._(gen.idents.varOk), _.eCall(_._(_.eThis(), gen.idents.fldDispObjBag, gen.idents.methodLoadFrom), _._(gen.idents.argPayload))),
                                ),
                                _.iIf(_.oNot(_._(gen.idents.varOk)), [_.iRet(_.eLit(false))]),
                                _.iIf(_.oIs(_._(gen.idents.varOnRet)), [_.eCall(_._(gen.idents.varOnRet))]),
                                _.iRet(_.eLit(true)),
                            ] : [
                                    _.iIf(_.oIs(_._(gen.idents.argPayload)), [_.iRet(_.eLit(false))]),
                                    _.iIf(_.oIs(_._(gen.idents.varOnRet)), [_.eCall(_._(gen.idents.varOnRet))]),
                                    _.iRet(_.eLit(true)),
                                ]
                    },
                )
            )),
        )

        if (!funcfields.length) body.push(
            _.eCall(_._(impl, gen.idents.coreMethodSend), _._(gen.idents.varMsg), _._(gen.idents.varOnResp)),
        )
        else body.push(
            _.eCall(_._(impl, gen.idents.coreMethodSend), _._(gen.idents.varMsg), _.eFunc([{ Name: gen.idents.argPayload, Type: TypeRefPrim.Any }], TypeRefPrim.Bool,
                _.iIf(_.oNeq(_.eLen(_._(gen.idents.varFnids), false), _.eLit(0)), [
                    _.iLock(_.eThis(),
                        _.iFor(_.eName(gen.idents.varFnid), _._(gen.idents.varFnids),
                            _.iDel(_._(impl, gen.idents.coreFldCbOther), _._(gen.idents.varFnid)),
                        ),
                    ),
                ]),
                _.iRet(_.eCall(_._(gen.idents.varOnResp), _._(gen.idents.argPayload))),
            )),
        )
        body.push(_.iRet(_.eFunc((method.Type as TypeRefFunc).From.map((_, i) => ({ Name: "a" + i, Type: _ })), null,
            _.iSet(_._(gen.idents.varOnRet), _._("a0")),
        )))
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

    onBeforeEmitImpls(_structs: boolean) { }
    onAfterEmitImpls(_structs: boolean) { }

    gen(prep: gen.Prep) {
        this.resetState()
        this.isDemos = false
        const build = (this.b = new Builder(prep, this))

        const ifacetop: TInterface = {
            name: prep.fromOrig.moduleName,
            Name: this.nameRewriters.types.interfaces(prep.fromOrig.moduleName),
            Docs: build.docs(gen.docs(prep.fromOrig.fromOrig)),
            Methods: prep.interfaces.filter(_ => _.fromOrig.kind === ts.SyntaxKind.ModuleDeclaration).map((_: gen.PrepInterface): Method => ({
                name: _.name,
                Name: this.nameRewriters.methods(_.name),
                Docs: build.docs(gen.docs(_.fromOrig)),
                Type: build.typeRef(this.nameRewriters.types.interfaces(_.name)),
                Args: [],
            })),
            IsTop: true,
        }

        this.allEnums = prep.enums.map(_ =>
            build.fromEnum(_))
        this.allInterfaces = [ifacetop].concat(...prep.interfaces.map(_ =>
            build.fromInterface(_)))
        for (const ns in prep.fromOrig.namespaces)
            if (ns.includes('.')) {
                const parts = ns.split('.')
                const iface_mod = this.allInterfaces.find(_ => _.name === parts[0] || (_.fromPrep && _.fromPrep.name === parts[0]))
                const iface_sub = this.allInterfaces.find(_ => _.name === parts[parts.length - 1] || (_.fromPrep && _.fromPrep.name === parts[parts.length - 1]))
                if (!(iface_mod && iface_sub))
                    throw ns

                iface_mod.Methods.push({
                    Name: this.nameRewriters.methods(parts.slice(1).join('_')),
                    Args: [], Type: iface_sub, Docs: iface_sub.Docs, IsSubNs: true,
                })
            }
        this.allStructs = {}
        for (const it of prep.structs) {
            const struct = build.fromStruct(it)
            this.allStructs[struct.Name] = struct
        }

        {   // set all structs' Outgoing & Incoming bools only now that all ifaces and structs are complete
            const traversed: { [_: string]: boolean } = {}
            const traverse = (t: TypeRef, forIncoming: boolean) => {
                this.typeRefTraverse(t, argtype => {
                    const tnamed = this.typeOwn(argtype)
                    if (tnamed) {
                        const tstruct = this.allStructs[tnamed.Name]
                        if (tstruct && !traversed[tnamed.Name + forIncoming]) {
                            traversed[tnamed.Name + forIncoming] = true
                            if (forIncoming)
                                tstruct.IsIncoming = true
                            else
                                tstruct.IsOutgoing = true
                            for (const fld of tstruct.Fields)
                                traverse(fld.Type, this.typeFunc(fld.Type) ? false : forIncoming)
                        }
                    }
                    return undefined
                })
            }
            let evtsub: gen.MemberEvent
            for (const iface of this.allInterfaces)
                for (const method of iface.Methods) {
                    const isevtsub = (method.fromPrep && method.fromPrep.fromOrig && (evtsub = method.fromPrep.fromOrig.decl as gen.MemberEvent) && evtsub.EvtName && evtsub.EvtName.length) ? true : false
                    for (const arg of method.Args)
                        traverse(arg.Type, (arg.fromPrep && arg.fromPrep.isFromRetThenable) || isevtsub)
                    if (method.Type)
                        traverse(method.Type, true)
                }
        }
        for (const structname in this.allStructs) {
            const struct = this.allStructs[structname]
            if (struct.IsOutgoing) {
                for (const fld of struct.Fields) {
                    this.typeRefTraverse(fld.Type, t => {
                        const tmay = this.typeMaybe(t)
                        if (tmay && this.options.unMaybeOutgoingTypes.some(_ => this.typeRefEq(_, tmay.Maybe)))
                            return tmay.Maybe
                        return undefined
                    }, tref => {
                        if (struct.fromPrep && struct.fromPrep.isPropsOfStruct) {
                            fld.Type = tref
                            fld.Json.Required = false
                        }
                    })
                }
            }
        }

        this.emitIntro()

        for (const it of this.allEnums)
            this.emitEnum(it)
        for (const it of this.allInterfaces)
            this.emitInterface(it)
        for (const structname in this.allStructs)
            this.emitStruct(this.allStructs[structname])

        this.onBeforeEmitImpls(false)
        for (const it of this.allInterfaces)
            for (const method of it.Methods)
                this.emitMethodImpl(it, method, it === ifacetop
                    ? this.genMethodImpl_TopInterface
                    : this.genMethodImpl_ApiMethodCall)
        this.onAfterEmitImpls(false)

        this.onBeforeEmitImpls(true)

        for (const structname in this.allStructs) {
            let tfun: [gen.TypeSpec[], gen.TypeSpec]
            const struct = this.allStructs[structname]
            if (struct && struct.fromPrep)
                if (struct.fromPrep.isPropsOfStruct) {
                    let propsfields = struct.fromPrep.fields.filter(_ => !gen.typeFun(_.typeSpec))
                    this.emitMethodImpl(struct, {
                        Name: gen.idents.methodBagFetch, Type: { From: [{ From: [], To: null }], To: null }, Args: [], Docs: [
                            { Lines: [gen.idents.methodBagFetch + " requests the current `" + struct.fromPrep.isPropsOfStruct.name + "` state from the VSC side and upon response refreshes this `" + struct.Name + "`'s property value" + (propsfields.length > 1 ? 's' : '') + " for `" + propsfields.map(_ => _.name).join("`, `") + "` to reflect it."] }
                        ]
                    }, (_t: TypeRefOwn, _m: Method, _: Builder, b: Instr[]) => {
                        b.push(_.iRet(_.eCall(_._(_.eThis(), gen.idents.fldBagHolder, gen.idents.methodObjBagPull))))
                    })
                    if ((propsfields = propsfields.filter(_ => !_.readOnly)).length)
                        this.emitMethodImpl(struct, {
                            Name: gen.idents.methodBagPublish, Type: { From: [{ From: [], To: null }], To: null }, Args: [], Docs: [{
                                Lines: [gen.idents.methodBagPublish + " propagates this `" + struct.Name + "`'s current property value" + (propsfields.length > 1 ? 's' : '') + " for `" + propsfields.map(_ => _.name).join("`, `") + "` to the VSC side to immediately become active there. Note that **all** those property values are transmitted, no omissions."]
                            }]
                        }, (_t: TypeRefOwn, _m: Method, _: Builder, b: Instr[]) => {
                            b.push(
                                _.iVar(gen.idents.varRet, { From: [{ From: [], To: null }], To: null }),
                                _.iLock(_.eThis(),
                                    _.iSet(_._(gen.idents.varRet), _.eCall(_._(_.eThis(), gen.idents.fldBagHolder, gen.idents.methodObjBagPush), _.eThis())),
                                ),
                                _.iRet(_._(gen.idents.varRet)),
                            )
                        })
                } if (struct.fromPrep.isDispObj) {
                    for (const field of struct.fromPrep.fields)
                        if (tfun = gen.typeFun(field.typeSpec)) {
                            const orig = field.fromOrig
                            const isevt = (orig && ts.isPropertySignature(orig) && ts.isTypeReferenceNode(orig.type) && orig.type.typeName.getText() === "Event")
                            const prepargs = isevt
                                ? [{ name: gen.idents.argHandler, optional: false, typeSpec: (field.typeSpec as gen.TypeSpecFun).From[0] }]
                                : (tfun[0].map((_, i): gen.PrepArg => gen.argFrom(_, (orig as ts.MethodSignature).parameters[i])))
                            let tret = tfun[1]
                            tret = { Thens: [tret] }
                            prepargs.push({ name: "?", isFromRetThenable: true, optional: true, typeSpec: tret })
                            const me: Method = {
                                name: field.name, Name: this.nameRewriters.methods(field.name),
                                Args: prepargs.map(_ => {
                                    const arg = this.b.fromArg(_)
                                    const tmay = this.typeMaybe(arg.Type)
                                    if (_.optional && tmay && tmay.Maybe && this.options.unMaybeOutgoingTypes.includes(tmay.Maybe))
                                        arg.Type = tmay.Maybe
                                    return arg
                                }),
                                Type: null, IsObjEvt: isevt,
                                Docs: this.b.docs(gen.docs(orig), [], true, true),
                                fromPrep: { args: prepargs, name: field.name, nameOrig: orig ? orig.getText() : field.name }
                            }
                            me.Type = { From: [this.typeUnMaybe(me.Args[me.Args.length - 1].Type)], To: null }
                            me.Args = me.Args.slice(0, me.Args.length - 1)
                            this.emitMethodImpl(struct, me, this.genMethodImpl_ObjMethodCall)
                        }
                    let propsfields = struct.fromPrep.fields.filter(_ => !gen.typeFun(_.typeSpec))
                    if (propsfields && propsfields.length) {
                        const mget: Method = {
                            name: gen.idents.methodObjBagPull, Name: gen.idents.methodObjBagPull, Args: [],
                            Type: { From: [{ From: [], To: null }], To: null },
                        }
                        this.state.genPopulateFor[struct.Name + gen.idents.typeSuffBag] = true
                        this.emitMethodImpl(struct, mget, this.genMethodImpl_ObjPropsGet)
                        propsfields = propsfields.filter(_ => !_.readOnly)
                        if (propsfields.length) {
                            const mset: Method = {
                                name: gen.idents.methodObjBagPull, Name: gen.idents.methodObjBagPush,
                                Args: [{ Name: gen.idents.argUpd, Type: { Maybe: { Name: struct.Name + gen.idents.typeSuffBag } } }],
                                Type: { From: [{ From: [null], To: null }], To: null },
                            }
                            this.emitMethodImpl(struct, mset, this.genMethodImpl_ObjPropsSet)
                        }
                    }
                }
        }

        let anydecoderstogenerate = true
        while (anydecoderstogenerate) {
            anydecoderstogenerate = false
            for (const name in this.state.genPopulateFor)
                if (anydecoderstogenerate = this.state.genPopulateFor[name]) {
                    this.state.genPopulateFor[name] = false
                    const struct = this.allStructs[name]
                    if (struct)
                        this.emitMethodImpl(struct, {
                            Name: gen.idents.methodLoadFrom, Type: TypeRefPrim.Bool,
                            Args: [{ Name: gen.idents.argPayload, Type: TypeRefPrim.Any }]
                        }, this.genMethodImpl_PopulateFrom)
                }
        }
        this.onAfterEmitImpls(true)

        this.emitOutro()
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src)

        if (this.options.demoOutFilePath && this.options.demoOutFilePath.length)
            this.genDemos()
    }

    genDemos() {
        this.isDemos = true
        this.src = ""
        this.resetState()
        new gen_demos.GenDemos(this, this.b, "demo_Window_ShowInputBox").genDemos()
        node_fs.writeFileSync(this.options.demoOutFilePath, this.src)
    }

    typeUnMaybe(it: TypeRef): TypeRef {
        const me = this.typeMaybe(it)
        return me ? this.typeUnMaybe(me.Maybe) : it
    }

    typeOwn(it: TypeRef): TypeRefOwn {
        const me = it as TypeRefOwn
        return (me && me.Name && me.Name.length) ? me : null
    }

    typeOwnOf(it: TypeRef, name: string): boolean {
        const me = this.typeOwn(this.typeUnMaybe(it))
        return me && me.Name === name
    }

    typeMaybe(it: TypeRef): TypeRefMaybe {
        const me = it as TypeRefMaybe
        return (me && me.Maybe !== undefined) ? me : null
    }

    typeFunc(it: TypeRef): TypeRefFunc {
        const me = it as TypeRefFunc
        return (me && me.From !== undefined) ? me : null
    }

    typeColl(it: TypeRef): TypeRefColl {
        const me = it as TypeRefColl
        return (me && me.ValsOf) ? me : null
    }

    typeTup(it: TypeRef): TypeRefTup {
        const me = it as TypeRefTup
        return (me && me.TupOf && me.TupOf.length && me.TupOf.length > 1) ? me : null
    }

    typeRefForField(it: TypeRef, _optional: boolean): TypeRef {
        return it
    }

    typeRefEq(t1: TypeRef, t2: TypeRef): boolean {
        if (t1 === t2)
            return true

        const t1may = this.typeMaybe(t1), t2may = this.typeMaybe(t2)
        if (t1may && t2may)
            return this.typeRefEq(t1may.Maybe, t2may.Maybe)

        const t1coll = this.typeColl(t1), t2coll = this.typeColl(t2)
        if (t1coll && t2coll)
            return this.typeRefEq(t1coll, t2coll)

        const t1tup = this.typeTup(t1), t2tup = this.typeTup(t2)
        if (t1tup && t2tup)
            return t1tup.TupOf.length === t2tup.TupOf.length
                && t1tup.TupOf.every((t, i) => this.typeRefEq(t, t2tup.TupOf[i]))

        const t1fun = this.typeFunc(t1), t2fun = this.typeFunc(t2)
        if (t1fun && t2fun)
            return t1fun.From.length === t2fun.From.length
                && this.typeRefEq(t1fun.To, t2fun.To)
                && t1fun.From.every((t, i) => this.typeRefEq(t, t2fun.From[i]))

        const t1n = this.typeOwn(t1), t2n = this.typeOwn(t2)
        if (t1n && t2n) return t1n.Name === t2n.Name && t1n.name === t2n.name

        return false
    }

    typeRefTraverse(it: TypeRef, on: (_: TypeRef) => TypeRef, set?: (_: TypeRef) => void) {
        const tnew = on(it)
        if (set && tnew !== undefined)
            set(tnew)

        const tmay = this.typeMaybe(it)
        if (tmay) {
            this.typeRefTraverse(tmay.Maybe, on, _ => tmay.Maybe = _)
            return
        }
        const tcoll = this.typeColl(it)
        if (tcoll) {
            this.typeRefTraverse(tcoll.ValsOf, on, _ => tcoll.ValsOf = _)
            return
        }
        const ttup = this.typeTup(it)
        if (ttup) {
            ttup.TupOf.forEach((t, i) => this.typeRefTraverse(t, on, _ => ttup.TupOf[i] = _))
            return
        }
        const tfun = this.typeFunc(it)
        if (tfun) {
            tfun.From.forEach((t, i) => this.typeRefTraverse(t, on, _ => tfun.From[i] = _))
            this.typeRefTraverse(tfun.To, on, _ => tfun.To = _)
            return
        }
    }

    typeRefersTo(it: TypeRef, to: TypeRef): boolean {
        if (this.typeRefEq(it, to))
            return true
        const tmay = this.typeMaybe(it)
        if (tmay)
            return this.typeRefersTo(tmay.Maybe, to)
        const tcoll = this.typeColl(it)
        if (tcoll)
            return this.typeRefersTo(tcoll.ValsOf, to)
        const ttup = this.typeTup(it)
        if (ttup)
            return ttup.TupOf.some(t => this.typeRefersTo(t, to))
        const tfun = this.typeFunc(it)
        if (tfun)
            return this.typeRefersTo(tfun.To, to) || tfun.From.some(t => this.typeRefersTo(t, to))
        return false
    }

}
