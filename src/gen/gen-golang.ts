import * as gen_shared from './gen-shared'

export class Gen extends gen_shared.Gen implements gen_shared.IGen {
    gen() {
        console.log(`GO\tpref=${this.outFilePathPref}\tsuff=${this.outFilePathSuff}`)
    }
}
