export abstract class Gen {
    outFilePathPref: string
    outFilePathSuff: string

    constructor(outFilePathPref: string, outFilePathSuff: string) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff]
    }

}

export interface IGen {
    gen(): void
}
