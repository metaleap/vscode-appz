import * as ts from 'typescript'

export interface IGen {
    gen(prep: GenPrep): void
}

export interface GenJob {
    module: [string, ts.ModuleBody]
    funcs: GenJobFunc[]
    structs: GenJobStruct[]
    enums: GenJobEnum[]
}

interface GenJobNamed {
    qName: string
}

export interface GenJobFunc extends GenJobNamed {
    overload: number
    decl: ts.FunctionDeclaration
}

export interface GenJobEnum extends GenJobNamed {
    decl: ts.EnumDeclaration
}

export interface GenJobStruct extends GenJobNamed {
    decl: ts.InterfaceDeclaration
}

export class GenPrep {
    enums: {
        name: string
        enumerants: {
            name: string
            value: number
        }[]
    }[] = []

    structs: {
        name: string
        fields: {
            name: string
            typeSpec: TypeSpec
            optional: boolean
            isExtBaggage: boolean
        }[]
    }[] = []

    interfaces: {
        name: string
        methods: {
            name: string
            args: {
                name: string
                typeSpec: TypeSpec
                optional: boolean
                isFromRetThenable: boolean
            }[]
            // ret: TypeSpec
        }[]
    }[] = []

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
            let isarg = false
            this.interfaces.forEach(iface => {
                if (!isarg) iface.methods.forEach(method => {
                    if (!isarg) method.args.forEach(arg => {
                        isarg = isarg || typeRefersTo(arg.typeSpec, struct.name)
                    })
                })
            })
            if (isarg) {
                const fieldname = pickName(true, ['tag', 'ext', 'extra', 'meta', 'baggage', 'payload'], struct.fields)
                if (!fieldname)
                    throw (struct)
                struct.fields.push({ name: fieldname, isExtBaggage: true, optional: true, typeSpec: ScriptPrimType.Any })
            }
        })

        this.interfaces.forEach(iface => iface.methods.forEach(method => {
            method.args = method.args.filter(arg =>
                arg.typeSpec !== 'CancellationToken')
        }))
        console.log(JSON.stringify({
            e: this.enums,
            s: this.structs,
            i: this.interfaces,
        }, undefined, 2))
    }

    addEnum(enumJob: GenJobEnum) {
        const qname = this.qName(enumJob)
        this.enums.push({
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
                    name: _.name.getText(),
                    typeSpec: tspec,
                    optional: _.questionToken ? true : false,
                    isExtBaggage: false,
                }
            })
        })
    }

    addFunc(funcJob: GenJobFunc) {
        const qname = this.qName(funcJob)
        const ifacename = qname.slice(1, qname.length - 1).join('_')
        let iface = this.interfaces.find(_ => _.name === ifacename)
        if (!iface)
            this.interfaces.push(iface = { name: ifacename, methods: [] })
        iface.methods.push({
            name: qname[qname.length - 1] + ((funcJob.overload > 0) ? funcJob.overload : ''),
            args: funcJob.decl.parameters.map(_ => ({
                name: _.name.getText(),
                typeSpec: this.typeSpec(_.type, funcJob.decl.typeParameters),
                optional: _.questionToken ? true : false,
                isFromRetThenable: false,
            }))
        })
        const tret = this.typeSpec(funcJob.decl.type, funcJob.decl.typeParameters)
        if (tret) {
            const method = iface.methods[iface.methods.length - 1]
            const argname = pickName(false, ['andThen', 'onRet', 'onReturn', 'ret', 'cont', 'kont', 'continuation'], method.args)
            if (!argname)
                throw (method)
            method.args.push({ name: argname, typeSpec: tret, isFromRetThenable: true, optional: true, })
        }
    }

    qName(memJob: GenJobNamed): string[] {
        const qname = memJob.qName.split('.')
        if ((!qname) || (!qname.length) || (qname.length < 2) || qname[0] !== this.fromOrig.module[0])
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
}

export abstract class Gen {
    outFilePathPref: string
    outFilePathSuff: string

    constructor(outFilePathPref: string, outFilePathSuff: string) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff]
    }

    caseLo(name: string): string {
        return name.charAt(0).toLowerCase() + name.slice(1)
    }

    caseUp(name: string): string {
        return name.charAt(0).toUpperCase() + name.slice(1)
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

export function typeRefersTo(typeSpec: TypeSpec, name: string): boolean {
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

export function pickName(forcePrefix: boolean, pickFrom: string[], dontCollideWith: { name: string }[]): string {
    if (!forcePrefix)
        for (const name of pickFrom)
            if (!dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                return name
    for (const pref of ['appz', 'vscAppz'])
        for (let name of pickFrom) {
            name = pref + name.charAt(0).toUpperCase() + name.slice(1)
            if (!dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                return name
        }
    return undefined
}
