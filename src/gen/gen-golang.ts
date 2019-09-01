import * as node_fs from 'fs'

import * as gen from './gen-shared'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.GenPrep) {
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

    genEnum(prep: gen.GenPrep, idx: number): string {
        const it = prep.enums[idx]
        const name = this.caseUp(it.name)
        let src = "type " + name + " int\n\nconst (\n"
        for (const enumerant of it.enumerants)
            src += "\t" + name + this.caseUp(enumerant.name) + " " + name + " = " + enumerant.value + "\n"
        return src + ")\n\n"
    }

    genStruct(prep: gen.GenPrep, idx: number): string {
        const it = prep.structs[idx]
        let src = "type " + this.caseUp(it.name) + " struct {\n"
        for (const field of it.fields)
            src += "\t" + this.caseUp(field.name) + " " + this.typeSpec(field.typeSpec)
                + ((gen.typeFun(field.typeSpec)) ? " `json:\"-\"`" : (" `json:\"" + field.name + (field.optional ? ",omitempty" : "") + "\"`"))
                + "\n"
        return src + "}\n\n"
    }

    genInterface(prep: gen.GenPrep, idx: number): string {
        const it = prep.interfaces[idx]
        let src = "type " + this.caseUp(it.name) + " interface {\n"
        for (const method of it.methods) {
            src += "\t" + this.caseUp(method.name) + "("
            for (const arg of method.args)
                src += this.caseLo(arg.name) + " " + this.typeSpec(arg.typeSpec) + ", "
            src += ")" + (method.ret ? (" " + this.typeSpec(method.ret)) : "") + "\n"
        }
        return src + "}\n\n"
    }

    typeSpec(from: gen.TypeSpec): string {
        if (!from)
            return ""

        if (from === gen.ScriptPrimType.Any)
            return "interface{}"
        if (from === gen.ScriptPrimType.Boolean)
            return "bool"
        if (from === gen.ScriptPrimType.String)
            return "string"
        if (from === gen.ScriptPrimType.Number)
            return "int"
        if (from === gen.ScriptPrimType.Null || from === gen.ScriptPrimType.Undefined)
            throw (from)

        const tarr = gen.typeArrOf(from)
        if (tarr)
            return "[]" + this.typeSpec(tarr)

        const tfun = gen.typeFun(from)
        if (tfun && tfun.length && tfun[0])
            return "func(" + tfun[0].map(_ => this.typeSpec(_)).join(", ") + ") " + this.typeSpec(tfun[1])

        let ttup = gen.typeTupOf(from)
        if (ttup && ttup.length) {
            let tname: string = null
            for (const t of ttup) {
                const tn = this.typeSpec(t)
                if (!tname)
                    tname = tn
                else if (tn !== tname) {
                    tname = undefined
                    break
                }
            }
            return "[]" + (tname ? tname : "interface{}")
        }

        let tsum = gen.typeSumOf(from)
        if (tsum && tsum.length) {
            tsum = tsum.filter(_ =>
                _ !== gen.ScriptPrimType.Null && _ !== gen.ScriptPrimType.Undefined && !gen.typeProm(_))
            return tsum.map(_ => this.typeSpec(_)).join('|')
        }

        const tprom = gen.typeProm(from)
        if (tprom && tprom.length)
            if (tprom.length > 1)
                throw (from)
            else
                return "func(" + this.typeSpec(tprom[0]) + ")"

        if (typeof from === 'string')
            return from

        return "interface{}"
    }

}
