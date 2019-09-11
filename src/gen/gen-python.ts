import * as gen from './gen-shared'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.Prep) {
        console.log(`Py\t${this.outFilePathPref}${prep.fromOrig.module[0]}${this.outFilePathSuff}`)
    }

}
