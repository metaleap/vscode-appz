"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-basics");
class Gen extends gen.Gen {
    gen(prep) {
        let src = "// " + this.doNotEditComment("csharp") + "\n";
        src += `namespace VscAppz {\n`;
        src += "\tusing System;\n";
        src += "\tusing System.Collections.Generic;\n";
        src += "\tusing Newtonsoft.Json;\n\n";
        src += "\tusing Any = System.Object;\n\n";
        const doclns = this.genDocLns(gen.docs(prep.fromOrig.fromOrig));
        src += this.genDocSrc('\t', doclns);
        src += `\tpublic interface I${this.caseUp(prep.fromOrig.moduleName)} {\n`;
        for (const it of prep.interfaces)
            src += '\n' + this.genDocSrc('\t\t', this.genDocLns(gen.docs(it.fromOrig)))
                + `\t\tI${this.caseUp(it.name)} ${this.caseUp(it.name)} { get; }\n`;
        src += "\t}\n\n";
        src += `\tinternal partial class impl : I${this.caseUp(prep.fromOrig.moduleName)} {\n`;
        for (const it of prep.interfaces)
            src += `\t\tI${this.caseUp(it.name)} I${this.caseUp(prep.fromOrig.moduleName)}.${this.caseUp(it.name)} { get { return this; } }\n`;
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
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), src);
    }
    genEnum(it) {
        const doclns = this.genDocLns(gen.docs(it.fromOrig.decl));
        let src = this.genDocSrc('\t', doclns);
        src += "\tpublic enum " + this.caseUp(it.name) + " {\n";
        src += "\t}\n\n";
        return src;
    }
    genStruct(it) {
        const doclns = this.genDocLns(gen.docs(it.fromOrig.decl));
        let src = this.genDocSrc('\t', doclns);
        src += "\tpublic partial class " + this.caseUp(it.name) + " {\n";
        let fielddocs = {};
        for (const field of it.fields) {
            fielddocs[field.name] = (field.isExtBaggage ? (`\t\t/// <summary>${gen.docStrs.extBaggage}</summary>\n`) : (this.genDocSrc("\t\t", this.genDocLns(gen.docs(field.fromOrig)))));
            src += '\n' + fielddocs[field.name]
                + "\t\t[" + (gen.typeFun(field.typeSpec) ? 'JsonIgnore' : `JsonProperty("${field.name}")${field.optional ? '' : ', JsonRequired'}`) + "]\n";
            src += `\t\tpublic ${this.typeSpec(field.typeSpec, false, field.optional)} ${this.caseUp(field.name)};\n`;
        }
        for (const ff of it.funcFields)
            src += `\n\t\t/// <summary>${gen.docStrs.internalOnly}</summary>\n\t\t[JsonProperty("${ff}_AppzFuncId")]\n\t\tpublic string ${this.caseUp(ff)}_AppzFuncId = "";\n`;
        src += '\n' + this.genDocSrc('\t\t', doclns);
        src += "\t\tpublic " + this.caseUp(it.name) + "() {}\n";
        src += '\n' + this.genDocSrc('\t\t', doclns.concat(...it.fields.map(_ => {
            let hacky = fielddocs[_.name], needle = '\n\t\t/// ';
            for (let idx = hacky.indexOf(needle); idx >= 0; idx = hacky.indexOf(needle))
                hacky = (hacky.slice(0, idx) + " " + hacky.slice(idx + needle.length));
            return hacky.replace('</summary>', '</param>').replace('<summary>', `<param name="${this.caseLo(_.name)}">`).trim();
        })));
        src += "\t\tpublic " + this.caseUp(it.name) + "("
            + it.fields.map(_ => this.typeSpec(_.typeSpec, false, _.optional) + " " + this.caseLo(_.name) + " = default").join(', ')
            + ") =>\n\t\t\t"
            + this.parensIfJoin(it.fields.map(_ => this.caseUp(_.name))) + " = "
            + this.parensIfJoin(it.fields.map(_ => this.caseLo(_.name))) + ";\n";
        src += "\t}\n\n";
        return src;
    }
    genInterface(prep, it) {
        const doclns = this.genDocLns(gen.docs(it.fromOrig));
        let src = this.genDocSrc('\t', doclns);
        src += "\tpublic interface I" + this.caseUp(it.name) + " {\n";
        for (const method of it.methods)
            src += '\n' + this.genDocSrc('\t\t', this.genDocLns(gen.docs(method.fromOrig.decl, () => method.args.find(_ => _.isFromRetThenable)), method))
                + "\t\tvoid " + this.caseUp(method.nameOrig) + "("
                + method.args.map(_ => this.typeSpec(_.typeSpec, false, _.optional) + " " + this.caseLo(_.name) + " = default").join(', ')
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
            + method.args.map(arg => this.typeSpec(arg.typeSpec, false, arg.optional) + " " + this.caseLo(arg.name)).join(', ')
            + ") {\n";
        const numargs = method.args.filter(_ => !_.isFromRetThenable).length;
        const __ = gen.idents(method.args, 'msg', 'on', 'fn', 'fnid', 'fnids', 'payload', 'result');
        src += `\t\t\tvar ${__.msg} = new ipcMsg("${it.name}.${method.name}", ${numargs});\n`;
        if (funcfields.length) {
            src += `\t\t\tvar ${__.fnids} = new List<string>(${funcfields.length});\n`;
            src += "\t\t\tlock (this) {\n";
            for (const ff of funcfields) {
                let facc = this.caseLo(ff.arg.name);
                src += `\t\t\t\tif (${ff.arg.optional ? (facc + ' != null') : 'true'}) {\n`;
                facc += '.' + this.caseUp(ff.name);
                src += `\t\t\t\t\t${facc}_AppzFuncId = "";\n`;
                src += `\t\t\t\t\tvar ${__.fn} = ${facc};\n`;
                src += `\t\t\t\t\tif (${__.fn} != null) {\n`;
                src += `\t\t\t\t\t\t${facc}_AppzFuncId = this.nextFuncId();\n`;
                src += `\t\t\t\t\t\t${__.fnids}.Add(${facc}_AppzFuncId);\n`;
                src += `\t\t\t\t\t\tthis.cbOther[${facc}_AppzFuncId] = (Any[] args) => {\n`;
                const args = gen.typeFun(ff.struct.fields.find(_ => _.name === ff.name).typeSpec)[0];
                src += `\t\t\t\t\t\t\tif (args != null && args.Length == ${args.length}) {\n`;
                for (let a = 0; a < args.length; a++) {
                    const tspec = this.typeSpec(args[a]);
                    src += `\t\t\t\t\t\t\t\t${tspec} a${a} = default;\n`;
                    src += `\t\t\t\t\t\t\t\tif (args[${a}] != null) {\n`;
                    src += this.genDecodeFromAny(prep, "\t\t\t\t\t\t\t\t\t", "args[" + a + "]", "a" + a, tspec, "", "return (null, false);", false);
                    src += `\t\t\t\t\t\t\t\t}\n`;
                }
                src += `\t\t\t\t\t\t\t\treturn (${__.fn}(${args.map((_, a) => 'a' + a).join(', ')}), true);\n`;
                src += `\t\t\t\t\t\t\t}\n`;
                src += `\t\t\t\t\t\t\treturn (null, false);\n`;
                src += `\t\t\t\t\t\t};\n`;
                src += `\t\t\t\t\t}\n`;
                src += `\t\t\t\t}\n`;
            }
            src += "\t\t\t}\n";
        }
        for (const arg of method.args)
            if (!arg.isFromRetThenable)
                src += `\t\t\t${__.msg}.data["${arg.name}"] = ${this.caseLo(arg.name)};\n`;
        src += `\n\t\t\tFunc<Any, bool> ${__.on} = null;\n`;
        const lastarg = method.args[method.args.length - 1];
        if (lastarg.isFromRetThenable) {
            let laname = this.caseLo(lastarg.name), tret = this.typeSpec(lastarg.typeSpec, true, true);
            src += `\t\t\tif (${laname} != null)\n`;
            src += `\t\t\t\t${__.on} = (Any ${__.payload}) => {\n`;
            src += `\t\t\t\t\t${tret} ${__.result} = default;\n`;
            src += `\t\t\t\t\tif (${__.payload} != null) {\n`;
            src += this.genDecodeFromAny(prep, "\t\t\t\t\t\t", __.payload, __.result, tret, "", "return false;");
            src += `\t\t\t\t\t}\n`;
            src += `\t\t\t\t\t${laname}(${__.result});\n`;
            src += `\t\t\t\t\treturn true;\n`;
            src += `\t\t\t\t};\n`;
        }
        if (funcfields.length) {
            src += `\n\t\t\tthis.send(${__.msg}, (Any ${__.payload}) => {\n`;
            src += `\t\t\t\tif (${__.fnids}.Count != 0)\n`;
            src += `\t\t\t\t\tlock (this)\n`;
            src += `\t\t\t\t\t\tforeach (var ${__.fnid} in ${__.fnids})\n`;
            src += `\t\t\t\t\t\t\t_ = this.cbOther.Remove(${__.fnid});\n`;
            src += `\t\t\t\treturn (${__.on} == null) || ${__.on}(${__.payload});\n`;
            src += `\t\t\t});\n`;
        }
        else
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
        src += `\t\tinternal (${typeName}, bool) populateFrom(Any payload) {\n`;
        src += "\t\t\tvar m = payload as Dictionary<string, Any>;\n";
        src += "\t\t\tif (m == null)\n\t\t\t\treturn (null, false);\n\n";
        for (const _ of struct.fields) {
            src += "\t\t\t{\n";
            src += `\t\t\t\tif (m.TryGetValue("${_.name}", out var val) && val != null) {\n`;
            src += this.genDecodeFromAny(prep, "\t\t\t\t\t", "val", this.caseUp(_.name), this.typeSpec(_.typeSpec), "", "return (null, false);");
            src += "\t\t\t\t" + (_.optional ? "}\n" : "} else return (null, false);\n");
            src += "\t\t\t}\n";
        }
        src += "\t\t\treturn (this, true);\n";
        src += "\t\t}\n\t}\n\n";
        return src;
    }
    genDocLns(docs, method = undefined, isSub = false) {
        let ret = [];
        if (docs && docs.length)
            for (const doc of docs) {
                if (doc.lines && doc.lines.length) {
                    ret.push("/// ");
                    for (const ln of doc.lines)
                        ret.push("/// " + ln);
                }
                if (doc.subs && doc.subs.length)
                    ret.push(...this.genDocLns(doc.subs, method, true));
            }
        if (ret.length && !isSub) {
            ret[0] = "/// <summary>";
            ret.push("/// </summary>");
        }
        if ((!isSub) && method && method.args && method.args.length)
            for (const arg of method.args) {
                let paramdocstrlns = [];
                gen.docsTraverse(docs, doc => {
                    if (paramdocstrlns.length === 0 && doc.lines && doc.lines.length && doc.lines[0].startsWith("`" + arg.name + "` ── ")) {
                        paramdocstrlns.push(...doc.lines);
                        paramdocstrlns[0] = paramdocstrlns[0].slice(paramdocstrlns[0].indexOf("` ── ") + 5);
                    }
                });
                if (paramdocstrlns.length) {
                    ret.push(`/// <param name="${this.caseLo(arg.name)}">`);
                    ret.push("/// " + paramdocstrlns.filter(_ => _ && _.length).join(' ').trim());
                    ret.push("/// </param>");
                }
            }
        return ret;
    }
    typeSpec(from, intoProm = false, needNullable = false) {
        if (!from)
            return "";
        if (from === gen.ScriptPrimType.Any)
            return "Any";
        if (from === gen.ScriptPrimType.Boolean)
            return "bool";
        if (from === gen.ScriptPrimType.String)
            return "string";
        if (from === gen.ScriptPrimType.Number)
            return needNullable ? "Nullable<bool>" : "int";
        if (from === gen.ScriptPrimType.Dict)
            return "Dictionary<string, Any>";
        if (from === gen.ScriptPrimType.Null || from === gen.ScriptPrimType.Undefined)
            throw (from);
        const tarr = gen.typeArrOf(from);
        if (tarr)
            return this.typeSpec(tarr) + "[]";
        const tfun = gen.typeFun(from);
        if (tfun && tfun.length && tfun[0])
            return "Func<" + tfun[0].map(_ => this.typeSpec(_)).join(", ") + ", " + this.typeSpec(tfun[1]) + ">";
        const ttup = gen.typeTupOf(from);
        if (ttup && ttup.length) {
            const ret = "(" + ttup.map(_ => this.typeSpec(_)).join(', ') + ")";
            return (!needNullable) ? ret : (`Nullable<${ret}>`);
        }
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
        return "Any";
    }
}
exports.Gen = Gen;
