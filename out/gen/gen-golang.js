"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const gen = require("./gen-shared");
class Gen extends gen.Gen {
    gen(prep) {
        const pkgname = prep.fromOrig.module[0];
        let src = "package " + pkgname + "\n\n// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-golang.ts via github.com/metaleap/vscode-appz/src/gen/main.ts\n\n";
        src += "type Impl interface {\n";
        for (let i = 0; i < prep.interfaces.length; i++)
            src += "\t" + this.caseUp(prep.interfaces[i].name) + "\n";
        src += "}\n\n";
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
        const name = this.caseUp(it.name);
        let src = "type " + name + " int\n\nconst (\n";
        for (const enumerant of it.enumerants)
            src += "\t" + name + this.caseUp(enumerant.name) + " " + name + " = " + enumerant.value + "\n";
        return src + ")\n\n";
    }
    genStruct(prep, idx) {
        const it = prep.structs[idx];
        let src = "type " + this.caseUp(it.name) + " struct {\n";
        for (const field of it.fields)
            src += "\t" + this.caseUp(field.name) + " " + this.typeSpec(field.typeSpec)
                + ((gen.typeFun(field.typeSpec)) ? " `json:\"-\"`" : (" `json:\"" + field.name + (field.optional ? ",omitempty" : "") + "\"`"))
                + "\n";
        return src + "}\n\n";
    }
    genInterface(prep, idx) {
        const it = prep.interfaces[idx];
        let src = "type " + this.caseUp(it.name) + " interface {\n";
        for (const method of it.methods) {
            src += "\t" + this.caseUp(method.name) + "(";
            for (const arg of method.args)
                src += this.caseLo(arg.name) + " " + this.typeSpecNullable(arg.typeSpec, arg.optional) + ", ";
            src += ")" + (method.ret ? (" " + this.typeSpec(method.ret)) : "") + "\n";
        }
        src += "}\n\n";
        for (const method of it.methods) {
            src += "func (me *impl) " + this.caseUp(method.name) + "(";
            for (const arg of method.args)
                src += this.caseLo(arg.name) + " " + this.typeSpecNullable(arg.typeSpec, arg.optional) + ", ";
            src += ")" + (method.ret ? (" " + this.typeSpec(method.ret)) : "") + "{\n";
            const numargs = method.args.filter(_ => !_.isFromRetThenable).length;
            src += `\tmsg := msgOutgoing{Ns: "${it.name}", Name: "${method.name}", Payload: make(map[string]interface{}, ${numargs})}\n`;
            for (var arg of method.args)
                if (!arg.isFromRetThenable)
                    src += `\tmsg.Payload["${arg.name}"] = ${this.caseLo(arg.name)}\n`;
            src += `\n\tvar on func(interface{}, bool)\n`;
            const lastarg = method.args[method.args.length - 1];
            if (lastarg.isFromRetThenable) {
                let laname = this.caseLo(lastarg.name), tret = this.typeSpec(lastarg.typeSpec, true);
                src += `\tif ${laname} != nil {\n`;
                src += `\t\ton = func(payload interface{}, isFail bool) {\n`;
                src += `\t\t\tvar result ${tret}\n`;
                src += `\t\t\tvar failure interface{}\n`;
                src += `\t\t\tif isFail {\n`;
                src += `\t\t\t\tfailure = payload\n`;
                src += `\t\t\t} else {\n`;
                src += `\t\t\t\tresult = payload.(${tret})\n`;
                src += `\t\t\t}\n`;
                src += `\t\t\t${laname}(result, failure)\n`;
                src += `\t\t}\n`;
                src += `\t}\n`;
            }
            src += `\n\tme.send(&msg, on)\n`;
            src += "}\n\n";
        }
        return src;
    }
    typeSpecNullable(from, ensureNullable) {
        const nullableprefixes = ['*', '[]', 'map[', 'interface{', 'func('];
        var ret = this.typeSpec(from);
        if (ensureNullable && !nullableprefixes.some(_ => ret.startsWith(_)))
            ret = "*" + ret;
        return ret;
    }
    typeSpec(from, intoProm = false) {
        if (!from)
            return "";
        if (from === gen.ScriptPrimType.Any)
            return "interface{}";
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
            return "[]" + this.typeSpec(tarr);
        const tfun = gen.typeFun(from);
        if (tfun && tfun.length && tfun[0])
            return "func(" + tfun[0].map(_ => this.typeSpec(_)).join(", ") + ") " + this.typeSpec(tfun[1]);
        let ttup = gen.typeTupOf(from);
        if (ttup && ttup.length) {
            let tname = null;
            for (const t of ttup) {
                const tn = this.typeSpec(t);
                if (!tname)
                    tname = tn;
                else if (tn !== tname) {
                    tname = undefined;
                    break;
                }
            }
            return "[]" + (tname ? tname : "interface{}");
        }
        let tsum = gen.typeSumOf(from);
        if (tsum && tsum.length) {
            tsum = tsum.filter(_ => _ !== gen.ScriptPrimType.Null && _ !== gen.ScriptPrimType.Undefined && !gen.typeProm(_));
            return tsum.map(_ => this.typeSpec(_)).join('|');
        }
        const tprom = gen.typeProm(from);
        if (tprom && tprom.length)
            if (tprom.length > 1)
                throw (from);
            else if (intoProm)
                return this.typeSpec(tprom[0]);
            else
                return "func(result " + this.typeSpec(tprom[0]) + ", failure interface{})";
        if (typeof from === 'string')
            return from;
        return "interface{}";
    }
}
exports.Gen = Gen;
