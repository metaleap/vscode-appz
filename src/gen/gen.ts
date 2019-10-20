import * as node_fs from 'fs'
import * as ts from 'typescript'


const dbgJsonPrintEnums = false, dbgJsonPrintStructs = false, dbgJsonPrintIfaces = false
export const docStrs = {
    extBaggage: "Free-form custom data, preserved across a roundtrip.",
    internalOnly: "For internal runtime use only."
}

export interface TsNodeWithType { type?: ts.TypeNode }
export interface TsNodeWithTypeParams { typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration> }
export interface TsNodeWithParams { parameters: ts.NodeArray<ts.ParameterDeclaration> }

export interface IGen {
    gen(prep: Prep): void
}

export interface GenJob {
    fromOrig: ts.ModuleDeclaration
    namespaces: { [_: string]: ts.Node }
    moduleName: string
    funcs: GenJobFunc[]
    structs: GenJobStruct[]
    enums: GenJobEnum[]
}

interface GenJobNamed {
    qName: string
}

export interface GenJobFunc extends GenJobNamed {
    ifaceNs: ts.Node
    overload: number
    decl: ts.SignatureDeclarationBase | MemberProp | MemberEvent
}

export interface GenJobEnum extends GenJobNamed {
    decl: ts.EnumDeclaration
}

export interface GenJobStruct extends GenJobNamed {
    decl: ts.InterfaceDeclaration | ts.ClassDeclaration
}

export interface MemberEvent extends ts.VariableDeclaration {
    EvtName: string
    EvtArgs: ts.TypeNode[]
}

export interface MemberProp extends ts.VariableDeclaration {
    PropName: string
    PropType: ts.Node
}

export interface PrepEnum {
    fromOrig: GenJobEnum
    name: string
    enumerants: PrepEnumerant[]
}

export interface PrepEnumerant {
    fromOrig: ts.EnumMember,
    name: string
    value: number
}

export interface PrepStruct {
    fromOrig?: GenJobStruct
    name: string
    fields: PrepField[]
    funcFields: string[]
    isOutgoing?: boolean
    isIncoming?: boolean
    isPropsOfIface?: PrepInterface
    isPropsOfStruct?: PrepStruct
    isDispObj?: boolean
}

export interface PrepField {
    fromOrig?: ts.Node
    name: string
    typeSpec: TypeSpec
    optional?: boolean
    readOnly?: boolean
    isExtBaggage?: boolean
}

export interface PrepInterface {
    fromOrig: ts.Node
    name: string
    methods: PrepMethod[]
}

export interface PrepMethod {
    fromOrig?: GenJobFunc
    name: string
    args: PrepArg[]
    nameOrig?: string
    isProps?: PrepStruct
}

export interface PrepArg {
    fromOrig?: ts.ParameterDeclaration
    name: string
    typeSpec: TypeSpec
    optional: boolean
    isCancellationToken?: number
    isFromRetThenable?: boolean
    spreads?: boolean
}

export class Prep {
    enums: PrepEnum[] = []
    structs: PrepStruct[] = []
    interfaces: PrepInterface[] = []

    readonly fromOrig: GenJob

    constructor(job: GenJob) {
        this.fromOrig = job
        for (const enumjob of job.enums)
            this.addEnum(enumjob)
        for (const structjob of job.structs)
            this.addStruct(structjob)
        for (const funcjob of job.funcs)
            this.addFunc(funcjob)

        for (const iface of this.interfaces) {
            const propmethods: PrepMethod[] = []
            for (const method of iface.methods) {
                let n: number = 0
                for (const arg of method.args)
                    if (arg.typeSpec === 'CancellationToken')
                        [arg.isCancellationToken, arg.typeSpec] = [n++, 'Cancel']
                const fromprop = method.fromOrig.decl as MemberProp
                if (fromprop && fromprop.PropType)
                    propmethods.push(method)
            }
            if (propmethods.length > 1) {
                const struct: PrepStruct = {
                    isPropsOfIface: iface, name: iface.name + "Properties", funcFields: [],
                    fields: propmethods.map(me => ({
                        fromOrig: me.fromOrig.decl,
                        name: me.name,
                        typeSpec: typeProm(me.args[0].typeSpec)[0],
                        optional: true,
                        isExtBaggage: false,
                    })),
                }
                this.structs.push(struct)
                iface.methods.push({
                    name: pickName("", ['Properties', 'Props', 'Info', 'Current', 'Self', 'It', 'Cur'], iface.methods),
                    isProps: struct, args: [{
                        isFromRetThenable: true, name: "onDone", optional: false,
                        typeSpec: { Thens: [struct.name] },
                    }],
                })
            }
        }

        for (const struct of this.structs) {
            let isargout = false, isargin = false
            for (const iface of this.interfaces) if (isargin && isargout) break
            else for (const method of iface.methods) if (isargin && isargout) break
            else for (const arg of method.args) if (isargin && isargout) break
            else if (typeRefersTo(arg.typeSpec, struct.name)) {
                const isinfunc = typeFun(arg.typeSpec) ? true : false
                if (arg.isFromRetThenable || isinfunc) isargin = true
                if (!arg.isFromRetThenable) isargout = !isinfunc
            }
            if (((struct.isOutgoing = struct.isOutgoing || isargout) && (struct.isIncoming = struct.isIncoming || isargin)) && !(struct.isPropsOfStruct || struct.isPropsOfIface)) {
                const fieldname = pickName('my', ['', 'tags', 'ext', 'extra', 'meta', 'baggage', 'payload'], struct.fields)
                if (!fieldname)
                    throw struct
                struct.fields.push({ name: fieldname, isExtBaggage: true, optional: true, typeSpec: ScriptPrimType.Dict })
            }

            if (struct.isIncoming && struct.fields.find(_ => typeFun(_.typeSpec))) {
                struct.isDispObj = true
                if (struct.fields.find(_ => !typeFun(_.typeSpec))) {
                    const propstruct: PrepStruct = {
                        funcFields: [], name: struct.name + "Properties", isPropsOfStruct: struct,
                        fromOrig: struct.fromOrig, isIncoming: true, isOutgoing: true,
                        fields: struct.fields.filter(_ => !typeFun(_.typeSpec)).map(_ => {
                            _.optional = true
                            return _
                        }),
                    }
                    this.structs.push(propstruct)
                }
            }
        }

        const printjson = (_: any) => console.log(JSON.stringify(_, function (this: any, key: string, val: any): any {
            return (key === 'parent') ? null : val
        }, 2))
        if (dbgJsonPrintEnums)
            printjson(this.enums)
        if (dbgJsonPrintStructs)
            printjson(this.structs)
        if (dbgJsonPrintIfaces)
            printjson(this.interfaces)
    }

    addEnum(enumJob: GenJobEnum) {
        if (seemsDeprecated(enumJob.decl))
            return

        const qname = this.qName(enumJob)
        this.enums.push({
            fromOrig: enumJob,
            name: qname.slice(1).join('_'),
            enumerants: enumJob.decl.members.filter(_ => !seemsDeprecated(_)).map(_ => ({
                fromOrig: _,
                name: _.name.getText(),
                value: parseInt(_.initializer.getText())
            }))
        })
    }

    addStruct(structJob: GenJobStruct) {
        if (seemsDeprecated(structJob.decl))
            return

        const qname = this.qName(structJob)
        const fields: PrepField[] = []
        for (const _ of structJob.decl.members)
            if (_.name && !seemsDeprecated(_)) {
                let tspec: TypeSpec = null
                const mtyped = _ as TsNodeWithType
                const mtparams = (_.kind === ts.SyntaxKind.MethodSignature || _.kind === ts.SyntaxKind.MethodDeclaration) ? _ as TsNodeWithTypeParams : null
                if ((!mtparams) && mtyped && mtyped.type)
                    tspec = this.typeSpec(mtyped.type, structJob.decl.typeParameters)
                else if (mtparams && ts.isInterfaceDeclaration(structJob.decl))
                    tspec = this.typeSpec(_, combine(structJob.decl.typeParameters, mtparams.typeParameters))
                if (tspec)
                    fields.push({
                        fromOrig: _,
                        name: _.name.getText(),
                        typeSpec: tspec,
                        optional: (ts.isTypeElement(_) && _.questionToken) ? true : false,
                        readOnly: (_.modifiers && _.modifiers.find(_ => _.getText() === 'readonly')) ? true : false,
                        isExtBaggage: false,
                    })
            }
        this.structs.push({
            fromOrig: structJob, isOutgoing: false, isIncoming: false,
            name: qname.slice(1).join('_'),
            fields: fields,
            funcFields: []
        })
        const struct = this.structs[this.structs.length - 1]
        struct.funcFields = struct.fields.filter(_ => typeFun(_.typeSpec)).map(_ => _.name)
    }

    addFunc(funcJob: GenJobFunc) {
        if (seemsDeprecated(funcJob.decl))
            return

        const qname = this.qName(funcJob)
        const ifacename = qname[qname.length - 2]
        let iface = this.interfaces.find(_ => _.name === ifacename)
        if (!iface)
            this.interfaces.push(iface = { name: ifacename, methods: [], fromOrig: funcJob.ifaceNs })
        const declf = funcJob.decl as ts.FunctionDeclaration, declp = funcJob.decl as MemberProp, decle = funcJob.decl as MemberEvent
        const me: PrepMethod = {
            fromOrig: funcJob,
            nameOrig: qname[qname.length - 1],
            name: qname[qname.length - 1] + ((funcJob.overload > 0) ? funcJob.overload : ''),
            args: (declf && declf.parameters && declf.parameters.length) ?
                declf.parameters.filter(_ => _.name.getText() !== 'thisArg' && !seemsDeprecated(_)).map(_ => ({
                    fromOrig: _,
                    name: _.name.getText(),
                    typeSpec: this.typeSpec(_.type, declf.typeParameters),
                    optional: (_.questionToken && _.type.kind !== ts.SyntaxKind.BooleanKeyword) ? true : false,
                    isFromRetThenable: false,
                    spreads: _.dotDotDotToken ? true : false,
                })) : [],
        }
        iface.methods.push(me)
        if (decle && decle.EvtName && decle.EvtName.length) {
            const evtargs: TypeSpec[] = []
            for (const _ of decle.EvtArgs) {
                const typespec = this.typeSpec(_)
                evtargs.push(typespec)
                if (typeof typespec === 'string') {
                    const struct = this.structs.find(_ => _.name === typespec)
                    if (struct)
                        struct.isIncoming = true
                }
            }
            me.args.push({
                name: pickName('', ['listener', 'handler', 'eventHandler', 'onEvent', 'onEventRaised', 'onEventFired', 'onEventTriggered', 'onFired', 'onTriggered', 'onRaised'], me.args),
                optional: false, typeSpec: { From: decle.EvtArgs.map((_, i) => evtargs[i]), To: null },
            })
        }
        let tret = (declp && declp.PropType) ?
            this.typeSpec(declp.PropType) :
            (decle && decle.EvtName && decle.EvtName.length) ?
                "Disposable" :
                this.typeSpec(declf.type, declf.typeParameters)
        if (typeof tret === 'string') {
            const struct = this.structs.find(_ => _.name === tret)
            if (struct)
                struct.isIncoming = true
        }
        const tprom = typeProm(tret)
        if (!(tprom && tprom.length))
            tret = { Thens: [tret] }
        if (tret) {
            const argname = pickName('', ['onDone', 'andThen', 'onRet', 'onReturn', 'ret', 'cont', 'kont', 'continuation'], me.args)
            if (!argname)
                throw me
            me.args.push({ name: argname, typeSpec: tret, isFromRetThenable: true, optional: true })
        }
    }

    qName(memJob: GenJobNamed): string[] {
        const qname = memJob.qName.split('.')
        if ((!qname) || (!qname.length) || (qname.length < 2) || qname[0] !== this.fromOrig.moduleName)
            throw memJob.qName
        return qname
    }

    typeSpec(tNode: ts.Node, tParams?: ts.NodeArray<ts.TypeParameterDeclaration>): TypeSpec {
        if (ts.isTypeElement(tNode)) {
            if (ts.isPropertySignature(tNode)) {
                return this.typeSpec(tNode.type, tParams)
            } else if (ts.isMethodSignature(tNode) || ts.isCallSignatureDeclaration(tNode) || ts.isConstructSignatureDeclaration(tNode) || ts.isIndexSignatureDeclaration(tNode)) {
                const tps = combine(tParams, tNode.typeParameters)
                const rfun: TypeSpecFun = {
                    From: tNode.parameters.map(_ => this.typeSpec(_.type, tps)),
                    To: this.typeSpec(tNode.type, tps)
                }
                return rfun
            } else
                throw tNode.getText()
        }
        switch (tNode.kind) {
            case ts.SyntaxKind.VoidKeyword:
                return null
            case ts.SyntaxKind.AnyKeyword:
                return ScriptPrimType.Any
            case ts.SyntaxKind.StringKeyword:
                return ScriptPrimType.String
            case ts.SyntaxKind.NumberKeyword:
                return ScriptPrimType.Number
            case ts.SyntaxKind.BooleanKeyword:
                return ScriptPrimType.Boolean
            case ts.SyntaxKind.TrueKeyword:
                return ScriptPrimType.BooleanTrue
            case ts.SyntaxKind.FalseKeyword:
                return ScriptPrimType.BooleanFalse
            case ts.SyntaxKind.NullKeyword:
                return ScriptPrimType.Null
            case ts.SyntaxKind.UndefinedKeyword:
                return ScriptPrimType.Undefined
            case ts.SyntaxKind.ArrayType:
                const rarr: TypeSpecArr = {
                    ArrOf: this.typeSpec((tNode as ts.ArrayTypeNode).elementType, tParams)
                }
                return rarr
            case ts.SyntaxKind.TupleType:
                const rtup: TypeSpecTup = {
                    TupOf: (tNode as ts.TupleTypeNode).elementTypes.map(_ => this.typeSpec(_, tParams))
                }
                return rtup
            case ts.SyntaxKind.UnionType:
                const tunion = tNode as ts.UnionTypeNode
                const rsum: TypeSpecSum = {
                    SumOf: tunion.types.map(_ => this.typeSpec(_, tParams))
                }
                return rsum
            case ts.SyntaxKind.IntersectionType:
                const rmul: TypeSpecMul = {
                    ProdOf: (tNode as ts.IntersectionTypeNode).types.map(_ => this.typeSpec(_, tParams))
                }
                return rmul
            case ts.SyntaxKind.TypeLiteral:
                const robj: TypeSpecObj = {
                    Members: (tNode as ts.TypeLiteralNode).members.map(_ => [_.name ? _.name.getText() : '', this.typeSpec(_, tParams)])
                }
                return robj
            case ts.SyntaxKind.TypeReference:
                const tref = tNode as ts.TypeReferenceNode,
                    tname = tref.typeName.getText()
                const tparam = (!tParams) ? null : tParams.find(_ => _.name.getText() === tname)
                if (tparam) {
                    const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam)
                    return tnode ? this.typeSpec(tnode, tParams) : ScriptPrimType.Any
                } else if (tname === 'Thenable') {
                    const tprom: TypeSpecProm = {
                        Thens: tref.typeArguments.map(_ => this.typeSpec(_, tParams))
                    }
                    return tprom
                } else if (tname === 'ReadonlyArray' && tref.typeArguments && tref.typeArguments.length === 1) {
                    const tarr: TypeSpecArr = {
                        ArrOf: this.typeSpec(tref.typeArguments[0], tParams)
                    }
                    return tarr
                } else if (tname === 'GlobPattern')
                    return ScriptPrimType.String
                return tname
            case ts.SyntaxKind.LiteralType:
                const lit = (tNode as ts.LiteralTypeNode).literal
                switch (lit.kind) {
                    case ts.SyntaxKind.BooleanKeyword:
                        return ScriptPrimType.Boolean
                    case ts.SyntaxKind.TrueKeyword:
                        return ScriptPrimType.BooleanTrue
                    case ts.SyntaxKind.FalseKeyword:
                        return ScriptPrimType.BooleanFalse
                }
                throw lit.kind + "\t" + lit.getText()
            case ts.SyntaxKind.FunctionType:
                const tfun = tNode as ts.FunctionTypeNode
                if (tfun) {
                    const tparams = combine(tParams, tfun.typeParameters)
                    return {
                        From: tfun.parameters.map(_ => {
                            const ret = this.typeSpec(_.type, tparams)
                            const rarr = ret as TypeSpecArr
                            if (rarr && rarr.ArrOf && _.dotDotDotToken)
                                rarr.Spreads = true
                            return ret
                        }),
                        To: this.typeSpec(tfun.type, tparams)
                    }
                }
                throw tNode
            default:
                throw tNode.kind + "\t" + tNode.getText()
        }
    }
}

export type TypeSpec = ScriptPrimType | string | TypeSpecArr | TypeSpecTup | TypeSpecSum | TypeSpecMul | TypeSpecObj | TypeSpecFun | TypeSpecProm

export interface TypeSpecArr {
    ArrOf: TypeSpec
    Spreads?: boolean
}

export interface TypeSpecSum {
    SumOf: TypeSpec[]
}

export interface TypeSpecMul {
    ProdOf: TypeSpec[]
}

export interface TypeSpecObj {
    Members: [string, TypeSpec][]
}

export interface TypeSpecTup {
    TupOf: TypeSpec[]
}

export interface TypeSpecFun {
    From: TypeSpec[]
    To: TypeSpec
}

export interface TypeSpecProm {
    Thens: TypeSpec[]
}

export enum ScriptPrimType {
    Any = ts.SyntaxKind.AnyKeyword,
    String = ts.SyntaxKind.StringKeyword,
    Number = ts.SyntaxKind.NumberKeyword,
    Boolean = ts.SyntaxKind.BooleanKeyword,
    BooleanTrue = ts.SyntaxKind.TrueKeyword,
    BooleanFalse = ts.SyntaxKind.FalseKeyword,
    Undefined = ts.SyntaxKind.UndefinedKeyword,
    Null = ts.SyntaxKind.NullKeyword,
    Dict = ts.SyntaxKind.ObjectLiteralExpression,
}

export type Doc = { fromOrig: ts.JSDoc, lines: string[], subs: Docs, isForArg?: string, isForRet?: boolean }
export type Docs = Doc[]

export abstract class Gen {
    outFilePathPref: string
    outFilePathSuff: string
    state: {
        genPopulateFor: { [_: string]: boolean }
    }

    constructor(outFilePath: [string, string]) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePath[0], outFilePath[1]]
        this.resetState()
    }

    resetState() {
        this.state = { genPopulateFor: {} }
    }

    doNotEditComment(moniker: string): string {
        return "DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-" + moniker + ".ts via github.com/metaleap/vscode-appz/src/gen/main.ts"
    }

    caseLo(name: string): string {
        return caseLo(name)
    }

    caseUp(name: string): string {
        return caseUp(name)
    }

    genDocSrc(lnPref: string, docLns: string[]): string {
        let src = ""
        if (docLns && docLns.length)
            src = docLns.map(_ => lnPref + _).join('\n') + '\n'
        return src
    }

    parensIfJoin(arr: string[], joinSep: string = ', '): string {
        return (arr && arr.length === 1) ? arr[0] : ('(' + arr.join(joinSep) + ')')
    }

    writeFileSync(pkgName: string, src: string) {
        node_fs.writeFileSync(`${this.outFilePathPref}${this.caseLo(pkgName)}${this.outFilePathSuff}`, src)
    }

}

export function typeArr(typeSpec: TypeSpec): TypeSpec {
    const tarr = typeSpec as TypeSpecArr
    return (tarr && tarr.ArrOf) ? tarr.ArrOf : null
}

export function typeArrSpreads(typeSpec: TypeSpec): boolean {
    const tarr = typeSpec as TypeSpecArr
    return (tarr && tarr.ArrOf) ? tarr.Spreads : false
}

export function typeTup(typeSpec: TypeSpec): TypeSpec[] {
    const ttup = typeSpec as TypeSpecTup
    return (ttup && ttup.TupOf) ? ttup.TupOf : null
}

export function typeSum(typeSpec: TypeSpec): TypeSpec[] {
    const tsum = typeSpec as TypeSpecSum
    return (tsum && tsum.SumOf) ? tsum.SumOf : null
}

export function typeMul(typeSpec: TypeSpec): TypeSpec[] {
    const tmul = typeSpec as TypeSpecMul
    return (tmul && tmul.ProdOf) ? tmul.ProdOf : null
}

export function typeObj(typeSpec: TypeSpec): [string, TypeSpec][] {
    const tobj = typeSpec as TypeSpecObj
    return (tobj && tobj.Members) ? tobj.Members : null
}

export function typeSumOf(typeSpec: TypeSpec, sumOf: TypeSpec): boolean {
    const tsum = typeSum(typeSpec)
    return tsum && tsum.length && tsum.some(_ => _ === sumOf)
}

export function typePromOf(typeSpec: TypeSpec, promOf: TypeSpec): boolean {
    const tprom = typeProm(typeSpec)
    return (tprom && tprom.length && tprom[0] === promOf)
}

export function typeProm(typeSpec: TypeSpec): TypeSpec[] {
    const tprom = typeSpec as TypeSpecProm
    return (tprom && tprom.Thens) ? tprom.Thens : null
}

export function typeFun(typeSpec: TypeSpec): [TypeSpec[], TypeSpec] {
    const tfun = typeSpec as TypeSpecFun
    return (tfun && tfun.From) ? [tfun.From, tfun.To] : null
}

function typeRefersTo(typeSpec: TypeSpec, name: string): boolean {
    const tarr = typeArr(typeSpec)
    if (tarr) return typeRefersTo(tarr, name)

    const ttup = typeTup(typeSpec)
    if (ttup) return ttup.some(_ => typeRefersTo(_, name))

    const tsum = typeSum(typeSpec)
    if (tsum) return tsum.some(_ => typeRefersTo(_, name))

    const tmul = typeMul(typeSpec)
    if (tmul) return tmul.some(_ => typeRefersTo(_, name))

    const tobj = typeObj(typeSpec)
    if (tobj) return tobj.some(_ => typeRefersTo(_[1], name))

    const tfun = typeFun(typeSpec)
    if (tfun) return typeRefersTo(tfun[1], name) || tfun[0].some(_ => typeRefersTo(_, name))

    const tprom = typeProm(typeSpec)
    if (tprom) return tprom.some(_ => typeRefersTo(_, name))

    return typeSpec === name
}

export function argFrom(typeSpec: TypeSpec, orig: ts.ParameterDeclaration): PrepArg {
    return {
        typeSpec: typeSpec, name: orig.name.getText(), fromOrig: orig,
        optional: orig.questionToken ? true : false,
        spreads: orig.dotDotDotToken ? true : false,
    }
}

export function argsFuncFields(prep: Prep, args: PrepArg[]) {
    const funcfields: { arg: PrepArg, struct: PrepStruct, name: string }[] = []
    for (const arg of args) {
        let targ = arg.typeSpec
        const tmul = typeMul(targ)
        if (tmul && tmul.length)
            targ = tmul[0]
        if (typeof targ === 'string')
            for (const struct of prep.structs.filter(_ => _.name === targ))
                if (struct.funcFields && struct.funcFields.length)
                    for (const funcfield of struct.funcFields)
                        funcfields.push({ arg: arg, struct: struct, name: funcfield })
    }
    return funcfields
}

function docFrom(from: ts.JSDoc): Doc {
    let ret: Doc = null, txt: string, argname: string
    if (from) {
        ret = { fromOrig: from, subs: [], lines: [] }
        if (txt = from.comment) {
            if (ts.isJSDocParameterTag(from)) {
                if ('thisArg' === (argname = from.name.getText()))
                    return null
                ret.isForArg = argname
            } else if (ts.isJSDocReturnTag(from))
                ret.isForRet = true
            ret.lines.push(...txt.split('\n').filter(_ => _ !== null && (!(_.startsWith('[') && _.endsWith(')') && _.includes('](#')))))
        }
        from.forEachChild(_ => {
            const sub = docFrom(_ as ts.JSDoc)
            if (sub)
                ret.subs.push(sub)
        })
    }
    return ret
}

export function docs(from: ts.Node): Docs {
    const docs = jsDocs(from), ret: Docs = []
    if (docs && docs.length)
        for (const _ of docs.map(_ => docFrom(_)))
            if (_)
                ret.push(_)
    return ret
}

export function docPrependArgOrRetName(doc: Doc, ln: string, retFallback: string, argNameRewrite: ((_: string) => string) = undefined, pref = "`", suff = "` ── ") {
    let isfor = doc.isForArg
    if (isfor && isfor.length)
        isfor = argNameRewrite ? argNameRewrite(isfor) : isfor
    else if (doc.isForRet)
        isfor = retFallback
    return (!(isfor && isfor.length)) ? ln : (pref + isfor + suff + ln)
}

export function docsTraverse(docs: Docs, on: ((_: Doc) => void)) {
    for (const doc of docs) {
        on(doc)
        docsTraverse(doc.subs, on)
    }
}

export function idents(dontCollideWith: { name: string }[], ...names: string[]) {
    const ret: { [_: string]: string } = {}
    for (const name of names)
        ret[name] = pickName('', [name], dontCollideWith)
    return ret
}

function jsDocs(from: ts.Node): ts.JSDoc[] {
    while (from) {
        const have = (from as any) as { jsDoc: ts.JSDoc[] }
        if (have && have.jsDoc && have.jsDoc.length)
            return have.jsDoc
        from = from.parent
    }
    return null
}

export function pickName(forcePrefix: string, pickFrom: string[], dontCollideWith: { name: string }[]): string {
    if (!(forcePrefix && forcePrefix.length)) {
        for (const name of pickFrom)
            if (name && name.length && !dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                return name
        if (pickFrom.length === 1 && pickFrom[0] && pickFrom[0].length)
            for (let i = 1; true; i++) {
                var name = '_'.repeat(i) + pickFrom[0]
                if (!dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                    return name
            }
    }
    for (const pref of [forcePrefix, 'appz', 'vscAppz'])
        if (pref && pref.length)
            for (let name of pickFrom) {
                name = pref + (name ? (name.charAt(0).toUpperCase() + name.slice(1)) : '')
                if (!dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                    return name
            }
    return undefined
}

export function combine<T extends ts.Node>(...arrs: (T[] | ts.NodeArray<T>)[]) {
    const all: T[] = []
    let only: ts.NodeArray<T> = null
    for (const arr of arrs)
        if (arr && arr.length) {
            all.push(...arr)
            const narr = arr as ts.NodeArray<T>
            if (only !== null)
                only = undefined
            else if (narr && (narr.hasTrailingComma !== undefined || narr.pos !== undefined || narr.end !== undefined))
                only = narr
        }
    return only ? only : (all.length ? ts.createNodeArray<T>(all) : undefined)
}

export function seemsDeprecated(it: ts.Node) {
    let deprecated: boolean = false
    for (const jsdoc of jsDocs(it))
        if ((!deprecated) && jsdoc.getText().includes("@deprecated "))
            deprecated = true;
    return deprecated
}

export function caseLo(name: string): string {
    return name.charAt(0).toLowerCase() + name.slice(1)
}

export function caseUp(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1)
}
