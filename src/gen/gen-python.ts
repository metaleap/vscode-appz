import * as gen from './gen-basics'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.Prep) {
        console.log(`Py\t${this.outFilePathPref}${prep.fromOrig.moduleName}${this.outFilePathSuff}`)
    }

}
