import * as ts from 'typescript'

export interface IGen {
    gen(job: GenJob, prep: GenPrep): void
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
        }[]
    }[] = []

    interfaces: {
        name: string
        methods: {
            name: string
            args: { name: string, typeSpec: TypeSpec }[]
            retTypeSpec: TypeSpec
        }[]
    }[] = []

    private readonly job: GenJob;

    constructor(job: GenJob) {
        this.job = job
        for (var enumjob of job.enums)
            this.addEnum(enumjob)
        for (var structjob of job.structs)
            this.addStruct(structjob)
        for (var funcjob of job.funcs)
            this.addFunc(funcjob)
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
                    typeSpec: tspec
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
                typeSpec: this.typeSpec(_.type, funcJob.decl.typeParameters)
            })),
            retTypeSpec: this.typeSpec(funcJob.decl.type, funcJob.decl.typeParameters)
        })
    }

    qName(memJob: GenJobNamed): string[] {
        const qname = memJob.qName.split('.')
        if ((!qname) || (!qname.length) || (qname.length < 2) || qname[0] !== this.job.module[0])
            throw (memJob.qName)
        return qname
    }

    typeSpec(tNode: ts.TypeNode | ts.MethodSignature, tParams: ts.NodeArray<ts.TypeParameterDeclaration>): TypeSpec {
        if (ts.isMethodSignature(tNode)) {
            const tp = tNode.typeParameters ? ts.createNodeArray(tNode.typeParameters.concat(...tParams), tParams.hasTrailingComma) : tParams
            const rfun: TypeSpecFun = {
                From: tNode.parameters.map(_ => this.typeSpec(_.type, tp)),
                To: this.typeSpec(tNode.type, tp)
            }
            return rfun
        }
        switch (tNode.kind) {
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
                        Then: tref.typeArguments.map(_ => this.typeSpec(_, tParams))
                    }
                    return tprom
                } else
                    return tname
            default:
                throw (tNode.kind)
        }
    }
}

export type TypeSpec = ScriptPrimType | null | string | TypeSpecArr | TypeSpecTup | TypeSpecSum | TypeSpecFun | TypeSpecProm

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
    Then: TypeSpec[]
}

export enum ScriptPrimType {
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
}
