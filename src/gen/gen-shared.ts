import * as ts from 'typescript'

export interface IGen {
    gen(module: [string, ts.ModuleBody], genFuncs: GenFunc[], genStructs: GenStruct[]): void
}

export interface GenFunc {
    qName: string
    overload: number
    decl: ts.FunctionDeclaration
}

export interface GenStruct {
    qName: string
    decl: ts.InterfaceDeclaration
}

export abstract class Gen {
    outFilePathPref: string
    outFilePathSuff: string

    constructor(outFilePathPref: string, outFilePathSuff: string) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff]
    }
}
