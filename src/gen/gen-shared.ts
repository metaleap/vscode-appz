import * as ts from 'typescript'

export interface IGen {
    gen(job: GenJob): void
}

export abstract class Gen {
    outFilePathPref: string
    outFilePathSuff: string
    constructor(outFilePathPref: string, outFilePathSuff: string) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff]
    }
}

export interface GenJob {
    module: [string, ts.ModuleBody]
    funcs: GenFunc[]
    structs: GenStruct[]
    enums: GenEnum[]
}

interface GenWhat {
    qName: string
}

export interface GenFunc extends GenWhat {
    overload: number
    decl: ts.FunctionDeclaration
}

export interface GenEnum extends GenWhat {
    decl: ts.EnumDeclaration
}

export interface GenStruct extends GenWhat {
    decl: ts.InterfaceDeclaration
}
