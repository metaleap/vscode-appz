import * as node_fs from 'fs'

import * as gen from './gen-shared'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.GenPrep) {
        const pkgname = prep.fromOrig.module[0]
        let src = "// " + this.doNotEditComment("vscext") + "\n\n"

        node_fs.writeFileSync(`${this.outFilePathPref}${pkgname}${this.outFilePathSuff}`, src)
    }

}
