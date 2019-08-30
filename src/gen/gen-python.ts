import * as gen_shared from './gen-shared'

export class Gen extends gen_shared.Gen implements gen_shared.IGen {
    gen(job: gen_shared.GenJob) {
        console.log(`Py\t${this.outFilePathPref}${job.module[0]}${this.outFilePathSuff}`)
    }
}
