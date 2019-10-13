import * as gen from './gen'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.Prep) {
        this.resetState()
        console.log(`Py\t${this.outFilePathPref}${prep.fromOrig.moduleName}${this.outFilePathSuff}`)
    }

}
