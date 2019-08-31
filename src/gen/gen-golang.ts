import * as node_fs from 'fs'

import * as gen_shared from './gen-shared'

export class Gen extends gen_shared.Gen implements gen_shared.IGen {

    gen(prep: gen_shared.GenPrep) {
        const pkgname = prep.fromOrig.module[0]
        let src: string = "package " + pkgname + "\n\n"
        for (let i = 0; i < prep.enums.length; i++)
            src += this.genEnum(prep, i)
        for (let i = 0; i < prep.structs.length; i++)
            src += this.genStruct(prep, i)
        for (let i = 0; i < prep.interfaces.length; i++)
            src += this.genInterface(prep, i)
        node_fs.writeFileSync(`${this.outFilePathPref}${pkgname}${this.outFilePathSuff}`, src)
    }

    genEnum(prep: gen_shared.GenPrep, idx: number): string {
        const it = prep.enums[idx]
        const name = this.ensureCaseUp(it.name)
        let src = "type " + name + " int\n\nconst (\n"
        for (const enumerant of it.enumerants)
            src += "\t" + name + this.ensureCaseUp(enumerant.name) + " " + name + " = " + enumerant.value + "\n"
        return src + ")\n\n"
    }

    genStruct(prep: gen_shared.GenPrep, idx: number): string {
        const it = prep.structs[idx]
        let src = "type " + this.ensureCaseUp(it.name) + " struct {\n"
        for (const field of it.fields)
            src += "\t" + this.ensureCaseUp(field.name) + " " + this.typeSpec(field.typeSpec) + " `json:\"" + field.name + (field.optional ? ",omitempty" : "") + "\"`\n"
        return src + "}\n\n"
    }

    genInterface(prep: gen_shared.GenPrep, idx: number): string {
        const it = prep.interfaces[idx]
        let src = "type " + this.ensureCaseUp(it.name) + " interface {\n"
        for (const method of it.methods) {
            src += "\t" + this.ensureCaseUp(method.name) + "("
            for (const arg of method.args)
                src += this.ensureCaseLo(arg.name) + " " + this.typeSpec(arg.typeSpec) + ", "
            src += ")\n"
        }
        return src + "}\n\n"
    }

    typeSpec(from: gen_shared.TypeSpec): string {
        return "interface{}"
    }

}
