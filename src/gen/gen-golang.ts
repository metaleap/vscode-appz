import * as gen_shared from './gen-shared'

export class Gen extends gen_shared.Gen implements gen_shared.IGen {

    gen(prep: gen_shared.GenPrep) {
        console.log(`Go\t${this.outFilePathPref}${prep.fromOrig.module[0]}${this.outFilePathSuff}`)
    }

}
