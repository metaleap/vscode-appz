"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-shared");
class Gen extends gen.Gen {
    gen(prep) {
        const pkgname = this.caseUp(prep.fromOrig.module[0]);
        let src = "// " + this.doNotEditComment("csharp") + "\n";
        src += `namespace ${pkgname} {\n`;
        src += "\tusing System;\n\n";
        src += "\tusing System.Collections.Generic;\n\n";
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
            src += this.genInterface(prep, it);
        {
            let anydec = true;
            while (anydec) {
                anydec = false;
                for (const name in prep.state.genDecoders)
                    if (anydec = prep.state.genDecoders[name]) {
                        src += this.genPopulateFrom(prep, name);
                        prep.state.genDecoders[name] = false;
                    }
            }
        }
        src += "}\n";
        this.writeFileSync(pkgname, src);
    }
    genEnum(it) {
        let src = "\tpublic enum " + this.caseUp(it.name) + " {\n";
        src += "\t}\n\n";
        return src;
    }
    genStruct(it) {
        let src = "\tpublic partial class " + this.caseUp(it.name) + " {\n";
        for (const field of it.fields)
            src += "\t\tpublic " + this.typeSpec(field.typeSpec) + " " + this.caseUp(field.name) + " = default;\n";
        for (const ff of it.funcFields)
            src += "\t\tinternal string " + this.caseUp(ff) + "_AppzFuncId = \"\";\n";
        src += "\n\t\tpublic " + this.caseUp(it.name) + "() { }\n";
        src += "\t\tpublic " + this.caseUp(it.name) + "("
            + it.fields.map(_ => this.typeSpec(_.typeSpec) + " " + this.caseLo(_.name) + " = default").join(', ')
            + ") =>\n\t\t\t"
            + this.parensIfJoin(it.fields.map(_ => this.caseUp(_.name))) + " = "
            + this.parensIfJoin(it.fields.map(_ => this.caseLo(_.name))) + ";\n";
        src += "\t}\n\n";
        return src;
    }
    genInterface(prep, it) {
        let src = "\tpublic interface I" + this.caseUp(it.name) + " {\n";
        for (const method of it.methods)
            src += "\t\tvoid " + this.caseUp(method.nameOrig) + "("
                + method.args.map(_ => this.typeSpec(_.typeSpec) + " " + this.caseLo(_.name) + " = default").join(', ')
                + ");\n";
        src += "\t}\n\n";
        src += "\tinternal partial class impl : I" + this.caseUp(it.name) + " {";
        for (const method of it.methods)
            src += this.genImpl(prep, it, method);
        src += "\t}\n\n";
        return src;
    }
    genImpl(prep, it, method) {
        const funcfields = gen.argsFuncFields(prep, method.args);
        let src = "\n\t\tvoid I" + this.caseUp(it.name) + "." + this.caseUp(method.nameOrig) + "("
            + method.args.map(arg => this.typeSpec(arg.typeSpec) + " " + this.caseLo(arg.name)).join(', ')
            + ") {\n";
        const numargs = method.args.filter(_ => !_.isFromRetThenable).length;
        const __ = gen.idents(method.args, 'msg', 'on', 'fn', 'fnid', 'fnids', 'payload', 'result');
        src += `\t\t\tvar ${__.msg} = new msgToVsc("${it.name}", "${method.name}", ${numargs});\n`;
        for (const arg of method.args)
            if (!arg.isFromRetThenable)
                src += `\t\t\t${__.msg}.Payload["${arg.name}"] = ${this.caseLo(arg.name)};\n`;
        src += `\t\t\tAction<object> ${__.on} = null;\n`;
        const lastarg = method.args[method.args.length - 1];
        if (lastarg.isFromRetThenable) {
            let laname = this.caseLo(lastarg.name), tret = this.typeSpec(lastarg.typeSpec, true);
            src += `\t\t\tif (${laname} != null)\n`;
            src += `\t\t\t\t${__.on} = (object ${__.payload}) => {\n`;
            src += `\t\t\t\t\t${tret} result = default;\n`;
            src += this.genDecodeFromAny(prep, "\t\t\t\t\t", __.payload, __.result, tret, "", "return;");
            src += `\t\t\t\t\t${laname}(${__.result});\n`;
            src += `\t\t\t\t};\n`;
        }
        src += `\n\t\t\tthis.send(${__.msg}, ${__.on});\n`;
        src += "\t\t}\n";
        return src;
    }
    genDecodeFromAny(prep, pref, srcName, dstName, dstTypeCs, errName, errOther, haveOk = false) {
        if (dstTypeCs === 'object' || dstTypeCs === 'Any')
            return `${pref}${dstName} = ${srcName};\n`;
        let src = haveOk ? "" : `${pref}bool ok;\n`;
        if (prep.structs.some(_ => _.name === dstTypeCs)) {
            prep.state.genDecoders[dstTypeCs] = true;
            src += `${pref}(${dstName}, ok) = new ${dstTypeCs}().populateFrom(${srcName});\n`;
        }
        else
            src += `${pref}if (ok = (${srcName} is ${dstTypeCs}))\n${pref}\t${dstName} = (${dstTypeCs})${srcName};\n`;
        src += `${pref}if (!ok)\n`;
        if (errName)
            src += `${pref}\t${errName} = ${srcName};\n`;
        else if (errOther)
            src += `${pref}\t${errOther}\n`;
        return src;
    }
    genPopulateFrom(prep, typeName) {
        const struct = prep.structs.find(_ => _.name === typeName);
        if (!struct)
            throw (typeName);
        let src = `\tpublic partial class ${typeName} {\n`;
        src += `\t\tinternal (${typeName}, bool) populateFrom(object payload) {\n`;
        src += "\t\t\tvar m = payload as Dictionary<string, object>;\n";
        src += "\t\t\tif (m == null) return (null, false);\n";
        for (const _ of struct.fields) {
            src += "\t\t\t{\n";
            src += `\t\t\t\tif (m.TryGetValue("${_.name}", out var val)${_.optional ? "" : " && val != null"}) {\n`;
            src += this.genDecodeFromAny(prep, "\t\t\t\t\t", "val", this.caseUp(_.name), this.typeSpec(_.typeSpec), "", "return (null, false);");
            src += "\t\t\t\t" + (_.optional ? "}\n" : "} else return (null, false);\n");
            src += "\t\t\t}\n";
        }
        src += "\t\t\treturn (this, true);\n";
        src += "\t\t}\n\t}\n\n";
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
