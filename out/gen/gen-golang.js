"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const gen_shared = require("./gen-shared");
class Gen extends gen_shared.Gen {
    gen(prep) {
        const pkgname = prep.fromOrig.module[0];
        let src = "package " + pkgname + "\n\n";
        for (let i = 0; i < prep.enums.length; i++)
            src += this.genEnum(prep, i);
        for (let i = 0; i < prep.structs.length; i++)
            src += this.genStruct(prep, i);
        for (let i = 0; i < prep.interfaces.length; i++)
            src += this.genInterface(prep, i);
        node_fs.writeFileSync(`${this.outFilePathPref}${pkgname}${this.outFilePathSuff}`, src);
    }
    genEnum(prep, idx) {
        const it = prep.enums[idx];
        const name = this.ensureCaseUp(it.name);
        let src = "type " + name + " int\n\nconst (\n";
        for (const enumerant of it.enumerants)
            src += "\t" + name + this.ensureCaseUp(enumerant.name) + " " + name + " = " + enumerant.value + "\n";
        return src + ")\n\n";
    }
    genStruct(prep, idx) {
        const it = prep.structs[idx];
        let src = "type " + this.ensureCaseUp(it.name) + " struct {\n";
        for (const field of it.fields)
            src += "\t" + this.ensureCaseUp(field.name) + " " + this.typeSpec(field.typeSpec) + " `json:\"" + field.name + (field.optional ? ",omitempty" : "") + "\"`\n";
        return src + "}\n\n";
    }
    genInterface(prep, idx) {
        const it = prep.interfaces[idx];
        let src = "type " + this.ensureCaseUp(it.name) + " interface {\n";
        for (const method of it.methods) {
            src += "\t" + this.ensureCaseUp(method.name) + "(";
            for (const arg of method.args)
                src += this.ensureCaseLo(arg.name) + " " + this.typeSpec(arg.typeSpec) + ", ";
            src += ")\n";
        }
        return src + "}\n\n";
    }
    typeSpec(from) {
        return "interface{}";
    }
}
exports.Gen = Gen;
