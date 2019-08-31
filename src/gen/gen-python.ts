import * as gen from './gen-shared'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.GenPrep) {
        console.log(`Py\t${this.outFilePathPref}${prep.fromOrig.module[0]}${this.outFilePathSuff}`)
    }

}
