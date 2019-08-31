import * as node_fs from 'fs'

import * as gen_shared from './gen-shared'

export class Gen extends gen_shared.Gen implements gen_shared.IGen {

    gen(prep: gen_shared.GenPrep) {
        const pkgname = prep.fromOrig.module[0]
        let src: string = "package " + pkgname + "\n\n"
        for (let i = 0; i < prep.enums.length; i++)
            src += this.genEnum(prep, i)
        node_fs.writeFileSync(`${this.outFilePathPref}${pkgname}${this.outFilePathSuff}`, src)
    }

    genEnum(prep: gen_shared.GenPrep, idx: number): string {
        const it = prep.enums[idx]
        let src = "type " + it.name + " int\n\nconst (\n"
        for (const enumerant of it.enumerants)
            src += enumerant.name + " " + it.name + " = " + enumerant.value + "\n"
        return src + ")\n\n"
    }

}
