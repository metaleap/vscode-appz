"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-shared");
class Gen extends gen.Gen {
    gen(prep) {
        const pkgname = this.caseUp(prep.fromOrig.module[0]);
        let src = "// " + this.doNotEditComment("csharp") + "\n";
        src += `namespace ${pkgname} {\n`;
        src += "\tusing System;\n\n";
        src += "\tpublic interface IProtocol {\n";
        for (const it of prep.interfaces)
            src += `\t\tI${this.caseUp(it.name)} ${this.caseUp(it.name)} { get; }\n`;
        src += "\t}\n\n";
        src += "\tinternal partial class impl : IProtocol {\n";
        for (const it of prep.interfaces)
            src += `\t\tI${this.caseUp(it.name)} IProtocol.${this.caseUp(it.name)} { get { return this; } }\n`;
        src += "\t}\n\n";
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
            src += "\t\tpublic " + this.typeSpec(field.typeSpec) + " " + this.caseUp(field.name) + ";\n";
        }
        src += "\n\t\tpublic " + this.caseUp(it.name) + "() { }\n";
        src += "\t\tpublic " + this.caseUp(it.name) + "("
            + it.fields.map(_ => this.typeSpec(_.typeSpec) + " " + this.caseLo(_.name)).join(', ')
            + ") =>\n\t\t\t"
            + this.parensIfJoin(it.fields.map(_ => this.caseUp(_.name))) + " = "
            + this.parensIfJoin(it.fields.map(_ => this.caseLo(_.name))) + ";\n";
        src += "\t}\n\n";
        return src;
    }
    genInterface(it) {
        let src = "\tpublic interface I" + this.caseUp(it.name) + " {\n";
        for (const method of it.methods)
            src += "\t\tvoid " + this.caseUp(method.name) + "("
                + method.args.map(_ => this.typeSpec(_.typeSpec) + " " + this.caseLo(_.name)).join(', ')
                + ");\n";
        src += "\t}\n\n";
        src += "\tinternal partial class impl : I" + this.caseUp(it.name) + " {";
        for (const method of it.methods)
            src += "\n\t\tvoid I" + this.caseUp(it.name) + "." + this.caseUp(method.name) + "("
                + method.args.map(_ => this.typeSpec(_.typeSpec) + " " + this.caseLo(_.name)).join(', ')
                + ") {\n"
                + "\t\t}\n";
        src += "\t}\n\n";
        return src;
    }
    typeSpec(from, intoProm = false) {
        if (!from)
            return "";
        if (from === gen.ScriptPrimType.Any)
            return "object";
        if (from === gen.ScriptPrimType.Boolean)
            return "bool";
        if (from === gen.ScriptPrimType.String)
            return "string";
        if (from === gen.ScriptPrimType.Number)
            return "int";
        if (from === gen.ScriptPrimType.Null || from === gen.ScriptPrimType.Undefined)
            throw (from);
        const tarr = gen.typeArrOf(from);
        if (tarr)
            return this.typeSpec(tarr) + "[]";
        const tfun = gen.typeFun(from);
        if (tfun && tfun.length && tfun[0])
            return "Func<" + tfun[0].map(_ => this.typeSpec(_)).join(", ") + ", " + this.typeSpec(tfun[1]) + ">";
        let ttup = gen.typeTupOf(from);
        if (ttup && ttup.length)
            return "(" + ttup.map(_ => this.typeSpec(_)).join(', ') + ")";
        let tsum = gen.typeSumOf(from);
        if (tsum && tsum.length) {
            tsum = tsum.filter(_ => _ !== gen.ScriptPrimType.Null && _ !== gen.ScriptPrimType.Undefined && !gen.typeProm(_));
            return this.parensIfJoin(tsum.map(_ => this.typeSpec(_)), '|');
        }
        const tprom = gen.typeProm(from);
        if (tprom && tprom.length)
            if (tprom.length > 1)
                throw (from);
            else if (intoProm)
                return this.typeSpec(tprom[0]);
            else
                return "Action<" + this.typeSpec(tprom[0]) + ">";
        if (typeof from === 'string')
            return from;
        return "object";
    }
}
exports.Gen = Gen;
