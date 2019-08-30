import * as ts from 'typescript'

import * as gen_shared from './gen-shared'

export class Gen extends gen_shared.Gen implements gen_shared.IGen {
    gen(module: [string, ts.ModuleBody], genFuncs: gen_shared.GenFunc[], genStructs: gen_shared.GenStruct[]) {
        console.log(`C#\t${this.outFilePathPref}${module[0]}${this.outFilePathSuff}`)
    }
}
