import * as node_fs from 'fs'

import * as ts from 'typescript'



const dbgJsonPrintEnums = false, dbgJsonPrintStructs = false, dbgJsonPrintIfaces = false
export const docStrs = {
    extBaggage: "Free-form custom data, preserved across a roundtrip.",
    internalOnly: "For internal runtime use only."
}

export interface IGen {
    gen(prep: Prep): void
}

export interface GenJob {
    fromOrig: ts.ModuleDeclaration
    namespaces: { [_: string]: ts.NamespaceDeclaration }
    moduleName: string
    funcs: GenJobFunc[]
    structs: GenJobStruct[]
    enums: GenJobEnum[]
}

interface GenJobNamed {
    qName: string
}

export interface GenJobFunc extends GenJobNamed {
    ifaceNs: ts.NamespaceDeclaration
    overload: number
    decl: ts.FunctionDeclaration
}

export interface GenJobEnum extends GenJobNamed {
    decl: ts.EnumDeclaration
}

export interface GenJobStruct extends GenJobNamed {
    decl: ts.InterfaceDeclaration
}

export interface PrepEnum {
    fromOrig: GenJobEnum
    name: string
    enumerants: {
        name: string
        value: number
    }[]
}

export interface PrepStruct {
    fromOrig: GenJobStruct
    name: string
    fields: PrepField[]
    funcFields: string[]
}

export interface PrepField {
    fromOrig?: ts.MethodSignature | ts.PropertySignature
    name: string
    typeSpec: TypeSpec
    optional: boolean
    isExtBaggage: boolean
}

export interface PrepInterface {
    fromOrig: ts.NamespaceDeclaration
    name: string
    methods: PrepMethod[]
}

export interface PrepMethod {
    fromOrig: GenJobFunc
    name: string
    args: PrepArg[]
    nameOrig: string
}

export interface PrepArg {
    fromOrig?: ts.ParameterDeclaration
    name: string
    typeSpec: TypeSpec
    optional: boolean
    isFromRetThenable: boolean
    spreads: boolean
}

export class Prep {
    enums: PrepEnum[] = []
    structs: PrepStruct[] = []
    interfaces: PrepInterface[] = []

    readonly fromOrig: GenJob
    state: {
        genDecoders: { [_: string]: boolean }
    }

    constructor(job: GenJob) {
        this.fromOrig = job
        for (const enumjob of job.enums)
            this.addEnum(enumjob)
        for (const structjob of job.structs)
            this.addStruct(structjob)
        for (const funcjob of job.funcs)
            this.addFunc(funcjob)

        this.structs.forEach(struct => {
            let isretarg = false
            this.interfaces.forEach(iface => {
                if (!isretarg) iface.methods.forEach(method => {
                    if (!isretarg) method.args.forEach(arg => {
                        isretarg = isretarg || (arg.isFromRetThenable && typeRefersTo(arg.typeSpec, struct.name))
                    })
                })
            })
            if (isretarg) {
                const fieldname = pickName('my', ['', 'tags', 'ext', 'extra', 'meta', 'baggage', 'payload'], struct.fields)
                if (!fieldname)
                    throw (struct)
                struct.fields.push({ name: fieldname, isExtBaggage: true, optional: true, typeSpec: ScriptPrimType.Dict })
            }
        })

        this.interfaces.forEach(iface => iface.methods.forEach(method => {
            method.args = method.args.filter(arg =>
                arg.typeSpec !== 'CancellationToken')
        }))

        const printjson = (_: any) => console.log(JSON.stringify(_, function (this: any, key: string, val: any): any {
            return (key === 'parent') ? null : val
        }, 2))
        if (dbgJsonPrintEnums)
            printjson(this.enums)
        if (dbgJsonPrintStructs)
            printjson(this.structs)
        if (dbgJsonPrintIfaces)
            printjson(this.structs)
    }

    addEnum(enumJob: GenJobEnum) {
        const qname = this.qName(enumJob)
        this.enums.push({
            fromOrig: enumJob,
            name: qname.slice(1).join('_'),
            enumerants: enumJob.decl.members.map(_ => ({
                name: _.name.getText(),
                value: parseInt((_.initializer as ts.LiteralExpression).text)
            }))
        })
    }

    addStruct(structJob: GenJobStruct) {
        const qname = this.qName(structJob)
        this.structs.push({
            fromOrig: structJob,
            name: qname.slice(1).join('_'),
            fields: structJob.decl.members.map(_ => {
                let tspec: TypeSpec = null
                switch (_.kind) {
                    case ts.SyntaxKind.PropertySignature:
                        tspec = this.typeSpec((_ as ts.PropertySignature).type, structJob.decl.typeParameters)
                        break
                    case ts.SyntaxKind.MethodSignature:
                        tspec = this.typeSpec((_ as ts.MethodSignature), structJob.decl.typeParameters)
                        break
                    default:
                        throw (_.kind)
                }
                return {
                    fromOrig: (_.kind === ts.SyntaxKind.PropertySignature) ? (_ as ts.PropertySignature) : (_ as ts.MethodSignature),
                    name: _.name.getText(),
                    typeSpec: tspec,
                    optional: _.questionToken ? true : false,
                    isExtBaggage: false,
                }
            }),
            funcFields: []
        })
        const struct = this.structs[this.structs.length - 1]
        struct.funcFields = struct.fields.filter(_ => typeFun(_.typeSpec)).map(_ => _.name)
    }

    addFunc(funcJob: GenJobFunc) {
        const qname = this.qName(funcJob)
        const ifacename = qname.slice(1, qname.length - 1).join('_')
        let iface = this.interfaces.find(_ => _.name === ifacename)
        if (!iface)
            this.interfaces.push(iface = { name: ifacename, methods: [], fromOrig: funcJob.ifaceNs })
        iface.methods.push({
            fromOrig: funcJob,
            nameOrig: qname[qname.length - 1],
            name: qname[qname.length - 1] + ((funcJob.overload > 0) ? funcJob.overload : ''),
            args: funcJob.decl.parameters.map(_ => ({
                fromOrig: _,
                name: _.name.getText(),
                typeSpec: this.typeSpec(_.type, funcJob.decl.typeParameters),
                optional: _.questionToken ? true : false,
                isFromRetThenable: false,
                spreads: _.dotDotDotToken ? true : false,
            })),
        })
        const tret = this.typeSpec(funcJob.decl.type, funcJob.decl.typeParameters)
        if (tret) {
            const method = iface.methods[iface.methods.length - 1]
            const argname = pickName('', ['andThen', 'onRet', 'onReturn', 'ret', 'cont', 'kont', 'continuation'], method.args)
            if (!argname)
                throw (method)
            method.args.push({ name: argname, typeSpec: tret, isFromRetThenable: true, optional: true, spreads: false })
        }
    }

    qName(memJob: GenJobNamed): string[] {
        const qname = memJob.qName.split('.')
        if ((!qname) || (!qname.length) || (qname.length < 2) || qname[0] !== this.fromOrig.moduleName)
            throw (memJob.qName)
        return qname
    }

    typeSpec(tNode: ts.TypeNode | ts.MethodSignature, tParams: ts.NodeArray<ts.TypeParameterDeclaration>, ): TypeSpec {
        if (ts.isMethodSignature(tNode)) {
            const tp = tNode.typeParameters ? ts.createNodeArray(tNode.typeParameters.concat(...tParams), tParams.hasTrailingComma) : tParams
            const rfun: TypeSpecFun = {
                From: tNode.parameters.map(_ => this.typeSpec(_.type, tp)),
                To: this.typeSpec(tNode.type, tp)
            }
            return rfun
        }
        switch (tNode.kind) {
            case ts.SyntaxKind.AnyKeyword:
                return ScriptPrimType.Any
            case ts.SyntaxKind.StringKeyword:
                return ScriptPrimType.String
            case ts.SyntaxKind.NumberKeyword:
                return ScriptPrimType.Number
            case ts.SyntaxKind.BooleanKeyword:
                return ScriptPrimType.Boolean
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
                const rsum: TypeSpecSum = {
                    SumOf: (tNode as ts.UnionTypeNode).types.map(_ => this.typeSpec(_, tParams))
                }
                return rsum
            case ts.SyntaxKind.TypeReference:
                const tref = tNode as ts.TypeReferenceNode,
                    tname = tref.typeName.getText()
                const tparam = (!tParams) ? null : tParams.find(_ => _.name.getText() === tname)
                if (tparam) {
                    const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam)
                    if (tnode)
                        return this.typeSpec(tnode, tParams)
                    else
                        throw (tparam)
                } else if (tname === 'Thenable') {
                    const tprom: TypeSpecProm = {
                        Thens: tref.typeArguments.map(_ => this.typeSpec(_, tParams))
                    }
                    return tprom
                } else
                    return tname
            default:
                throw (tNode.kind)
        }
    }
}

export type TypeSpec = ScriptPrimType | string | TypeSpecArr | TypeSpecTup | TypeSpecSum | TypeSpecFun | TypeSpecProm

export interface TypeSpecArr {
    ArrOf: TypeSpec
}

export interface TypeSpecSum {
    SumOf: TypeSpec[]
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
    Undefined = ts.SyntaxKind.UndefinedKeyword,
    Null = ts.SyntaxKind.NullKeyword,
    Dict = ts.SyntaxKind.ObjectLiteralExpression,
}

export type Doc = { fromOrig: ts.JSDoc, lines: string[], subs: Docs }
export type Docs = Doc[]

export abstract class Gen {
    outFilePathPref: string
    outFilePathSuff: string

    constructor(outFilePathPref: string, outFilePathSuff: string) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff]
    }

    doNotEditComment(moniker: string): string {
        return "DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-" + moniker + ".ts via github.com/metaleap/vscode-appz/src/gen/main.ts"
    }

    caseLo(name: string): string {
        return name.charAt(0).toLowerCase() + name.slice(1)
    }

    caseUp(name: string): string {
        return name.charAt(0).toUpperCase() + name.slice(1)
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

export function typeArrOf(typeSpec: TypeSpec): TypeSpec {
    const tarr = typeSpec as TypeSpecArr
    return (tarr && tarr.ArrOf) ? tarr.ArrOf : null
}

export function typeTupOf(typeSpec: TypeSpec): TypeSpec[] {
    const ttup = typeSpec as TypeSpecTup
    return (ttup && ttup.TupOf) ? ttup.TupOf : null
}

export function typeSumOf(typeSpec: TypeSpec): TypeSpec[] {
    const tsum = typeSpec as TypeSpecSum
    return (tsum && tsum.SumOf) ? tsum.SumOf : null
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
    const tarr = typeArrOf(typeSpec)
    if (tarr) return typeRefersTo(tarr, name)

    const ttup = typeTupOf(typeSpec)
    if (ttup) return ttup.some(_ => typeRefersTo(_, name))

    const tsum = typeSumOf(typeSpec)
    if (tsum) return tsum.some(_ => typeRefersTo(_, name))

    const tfun = typeFun(typeSpec)
    if (tfun) return typeRefersTo(tfun[1], name) || tfun[0].some(_ => typeRefersTo(_, name))

    const tprom = typeProm(typeSpec)
    if (tprom) return tprom.some(_ => typeRefersTo(_, name))

    return typeSpec === name
}

export function argsFuncFields(prep: Prep, args: PrepArg[]) {
    const funcfields: { arg: PrepArg, struct: PrepStruct, name: string }[] = []
    for (const arg of args)
        for (const struct of prep.structs.filter(_ => _.name === arg.typeSpec))
            if (struct.funcFields && struct.funcFields.length)
                for (const funcfield of struct.funcFields)
                    funcfields.push({ arg: arg, struct: struct, name: funcfield })
    return funcfields
}

function docFrom(from: ts.JSDoc, retName: () => { name: string }): Doc {
    let ret: Doc = null, txt: string
    if (from) {
        ret = { fromOrig: from, subs: [], lines: [] }
        if (txt = from.comment) {
            if (ts.isJSDocParameterTag(from))
                txt = "`" + from.name.getText() + "` ── " + txt
            else if (ts.isJSDocReturnTag(from)) {
                const rn = retName ? retName() : null
                txt = "`" + ((rn && rn.name && rn.name.length) ? rn.name : 'return') + "` ── " + txt
            }
            ret.lines.push(...txt.split('\n').filter(_ =>
                _ !== null
                && (!(_.startsWith('[') && _.endsWith(')') && _.includes('](#')))
                && (!(_.startsWith("`token` ── ") && _.includes('cancellation')))
            ))
        }
        from.forEachChild(_ => {
            const sub = docFrom(_ as ts.JSDoc, retName)
            if (sub) ret.subs.push(sub)
        })
    }
    return ret
}

export function docs(from: ts.Node, retName: () => { name: string } = undefined): Docs {
    const docs = jsDocs(from), ret: Docs = []
    if (docs && docs.length)
        ret.push(...docs.map(_ => docFrom(_, retName)))
    return ret
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
    const have = (from as any) as { jsDoc: ts.JSDoc[] }
    return (have && have.jsDoc && have.jsDoc.length) ? have.jsDoc : null
}

function pickName(forcePrefix: string, pickFrom: string[], dontCollideWith: { name: string }[]): string {
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
