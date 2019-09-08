"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-shared");
class Gen extends gen.Gen {
    gen(prep) {
        const pkgname = this.caseUp(prep.fromOrig.module[0]);
        let src = `namespace ${pkgname} {\n`;
        src += "\t// " + this.doNotEditComment("csharp") + "\n\n";
        for (const it of prep.enums)
            src += this.genEnum(it);
        for (const it of prep.structs)
            src += this.genStruct(it);
        for (const it of prep.interfaces)
            src += this.genInterface(it);
        src += "}\n";
        this.writeFileSync(pkgname, src);
    }
    genEnum(it) {
        let src = "\tpublic enum " + this.caseUp(it.name) + " {\n";
        src += "\t}\n\n";
        return src;
    }
    genStruct(it) {
        let src = "\tpublic class " + this.caseUp(it.name) + " {\n";
        for (const field of it.fields) {
            src += "\t\tpublic object " + this.caseUp(field.name) + ";\n";
        }
        src += "\n\t\tpublic " + this.caseUp(it.name) + "() { }\n";
        src += "\n\t\tpublic " + this.caseUp(it.name) + "("
            + it.fields.map(_ => "object " + this.caseLo(_.name)).join(', ')
            + ") =>\n\t\t\t"
            + this.strParensIfJoin(it.fields.map(_ => this.caseUp(_.name))) + " = "
            + this.strParensIfJoin(it.fields.map(_ => this.caseLo(_.name))) + ";\n";
        src += "\t}\n\n";
        return src;
    }
    genInterface(it) {
        let src = "\tpublic interface I" + this.caseUp(it.name) + " {\n";
        for (const method of it.methods)
            src += "\t\tvoid " + this.caseUp(method.name) + "("
                + method.args.map(_ => "object " + this.caseLo(_.name)).join(', ')
                + ");\n";
        src += "\t}\n\n";
        return src;
    }
    strParensIfJoin(arr, joinSep = ', ') {
        return (arr && arr.length === 1) ? arr[0] : ('(' + arr.join(joinSep) + ')');
    }
}
exports.Gen = Gen;
