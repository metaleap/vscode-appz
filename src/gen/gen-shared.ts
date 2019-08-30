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
            typeSpec: string
        }[]
    }[] = []

    interfaces: {
        name: string
        methods: {
            name: string
            args: { name: string, typeSpec: string }[]
            retTypeSpec: string
        }[]
    }[] = []

    constructor(job: GenJob) {
    }
}

export abstract class Gen {
    outFilePathPref: string
    outFilePathSuff: string

    constructor(outFilePathPref: string, outFilePathSuff: string) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff]
    }
}
