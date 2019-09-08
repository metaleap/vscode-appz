import * as gen from './gen-shared'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.GenPrep) {
        const pkgname = this.caseUp(prep.fromOrig.module[0])
        let src = `namespace ${pkgname} {\n`
        src += "\t// " + this.doNotEditComment("csharp") + "\n\n"

        for (const it of prep.enums)
            src += this.genEnum(it)
        for (const it of prep.structs)
            src += this.genStruct(it)
        for (const it of prep.interfaces)
            src += this.genInterface(it)

        src += "}\n"

        this.writeFileSync(pkgname, src)
    }

    genEnum(it: gen.GenPrepEnum): string {
        let src = "\tpublic enum " + this.caseUp(it.name) + " {\n"
        src += "\t}\n\n"
        return src
    }

    genStruct(it: gen.GenPrepStruct): string {
        let src = "\tpublic class " + this.caseUp(it.name) + " {\n"
        for (const field of it.fields) {
            src += "\t\tpublic object " + this.caseUp(field.name) + ";\n"
        }
        src += "\n\t\tpublic " + this.caseUp(it.name) + "() { }\n"
        src += "\n\t\tpublic " + this.caseUp(it.name) + "("
            + it.fields.map(_ => "object " + this.caseLo(_.name)).join(', ')
            + ") =>\n\t\t\t"
            + this.strParensIfJoin(it.fields.map(_ => this.caseUp(_.name))) + " = "
            + this.strParensIfJoin(it.fields.map(_ => this.caseLo(_.name))) + ";\n"
        src += "\t}\n\n"
        return src
    }

    genInterface(it: gen.GenPrepInterface): string {
        let src = "\tpublic interface I" + this.caseUp(it.name) + " {\n"
        for (const method of it.methods)
            src += "\t\tvoid " + this.caseUp(method.name) + "("
                + method.args.map(_ => "object " + this.caseLo(_.name)).join(', ')
                + ");\n"
        src += "\t}\n\n"
        return src
    }

    strParensIfJoin(arr: string[], joinSep: string = ', '): string {
        return (arr && arr.length === 1) ? arr[0] : ('(' + arr.join(joinSep) + ')')
    }

}
