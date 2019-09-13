"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-basics");
class Gen extends gen.Gen {
    gen(prep) {
        let src = "package vscAppz\n\n// " + this.doNotEditComment("golang") + "\n\n";
        const doclns = this.genDocLns(gen.docs(prep.fromOrig.fromOrig));
        src += this.genDocSrc('', doclns);
        src += `type ${this.caseUp(prep.fromOrig.moduleName)} interface {\n`;
        for (const it of prep.interfaces)
            src += '\n' + this.genDocSrc('\t', this.genDocLns(gen.docs(it.fromOrig)))
                + "\t" + this.caseUp(it.name) + "() " + this.caseUp(it.name) + "\n";
        src += "}\n\n";
        for (const it of prep.interfaces)
            src += `func (me *impl) ${this.caseUp(it.name)}() ${this.caseUp(it.name)} { return me }\n\n`;
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
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), src);
    }
    genEnum(it) {
        const name = this.caseUp(it.name);
        const doclns = this.genDocLns(gen.docs(it.fromOrig.decl));
        let src = this.genDocSrc('', doclns);
        src += "type " + name + " int\n\nconst (\n";
        for (const enumerant of it.enumerants)
            src += "\t" + name + this.caseUp(enumerant.name) + " " + name + " = " + enumerant.value + "\n";
        return src + ")\n\n";
    }
    genStruct(it) {
        const doclns = this.genDocLns(gen.docs(it.fromOrig.decl));
        let src = this.genDocSrc('', doclns);
        src += "type " + this.caseUp(it.name) + " struct {\n";
        for (const field of it.fields)
            src += '\n' + (field.isExtBaggage ? ("\t// " + gen.docStrs.extBaggage + "\n") : this.genDocSrc('\t', this.genDocLns(gen.docs(field.fromOrig))))
                + "\t" + this.caseUp(field.name) + " " + this.typeSpec(field.typeSpec)
                + (gen.typeFun(field.typeSpec) ? " `json:\"-\"`" : (" `json:\"" + field.name + (field.optional ? ",omitempty" : "") + "\"`"))
                + "\n";
        for (const ff of it.funcFields)
            src += "\n\t// " + gen.docStrs.internalOnly + "\n"
                + "\t" + this.caseUp(ff) + "_AppzFuncId string `json:\"" + ff + "_AppzFuncId,omitempty\"`\n";
        return src + "}\n\n";
    }
    genInterface(prep, it) {
        const doclns = this.genDocLns(gen.docs(it.fromOrig));
        let src = this.genDocSrc('', doclns);
        src += "type " + this.caseUp(it.name) + " interface {\n";
        for (const method of it.methods) {
            src += '\n' + this.genDocSrc('\t', this.genDocLns(gen.docs(method.fromOrig.decl, () => method.args.find(_ => _.isFromRetThenable))))
                + "\t" + this.caseUp(method.name) + "(";
            for (const arg of method.args)
                src += this.caseLo(arg.name) + " " + this.typeSpecNilable(arg.typeSpec, arg.optional, 'string') + ", ";
            src += ")\n";
        }
        src += "}\n\n";
        for (const method of it.methods)
            src += this.genImpl(prep, it, method);
        return src;
    }
    genImpl(prep, it, method) {
        const funcfields = gen.argsFuncFields(prep, method.args);
        let src = "func (me *impl) " + this.caseUp(method.name) + "("
            + method.args.map(arg => this.caseLo(arg.name) + " " + this.typeSpecNilable(arg.typeSpec, arg.optional, 'string')).join(', ')
            + ") {\n";
        const numargs = method.args.filter(_ => !_.isFromRetThenable).length;
        const __ = gen.idents(method.args, 'msg', 'on', 'fn', 'fnid', 'fnids', 'payload', 'result');
        src += `\t${__.msg} := msgToVsc{Ns: "${it.name}", Name: "${method.name}", Payload: make(map[string]Any, ${numargs})}\n`;
        if (funcfields.length) {
            src += `\t${__.fnids} := make([]string, 0, ${funcfields.length})\n`;
            src += `\tme.state.Lock()\n`;
            for (const ff of funcfields) {
                let facc = this.caseLo(ff.arg.name);
                src += `\tif ${ff.arg.optional ? (facc + ' != nil') : 'true'} {\n`;
                facc += '.' + this.caseUp(ff.name);
                src += `\t\t${facc}_AppzFuncId = ""\n`;
                src += `\t\tif ${__.fn} := ${facc}; ${__.fn} != nil {\n`;
                src += `\t\t\t${facc}_AppzFuncId = me.nextFuncId()\n`;
                src += `\t\t\t${__.fnids} = append(${__.fnids}, ${facc}_AppzFuncId)\n`;
                src += `\t\t\tme.state.callbacks.other[${facc}_AppzFuncId] = func(args...Any) (ret Any, ok bool) {\n`;
                const args = gen.typeFun(ff.struct.fields.find(_ => _.name === ff.name).typeSpec)[0];
                src += `\t\t\t\tif ok = (len(args) == ${args.length}); ok {\n`;
                for (let a = 0; a < args.length; a++) {
                    const tspec = this.typeSpec(args[a]);
                    src += `\t\t\t\t\tvar a${a} ${tspec}\n`;
                    src += this.genDecodeFromAny(prep, "\t\t\t\t\t", "args[" + a + "]", "a" + a, tspec, true, "", "return", true);
                }
                src += `\t\t\t\t\tret = ${__.fn}(${args.map((_, a) => 'a' + a).join(', ')})\n`;
                src += `\t\t\t\t}\n`;
                src += `\t\t\t\treturn\n`;
                src += `\t\t\t}\n`;
                src += `\t\t}\n`;
                src += `\t}\n`;
            }
            src += `\tme.state.Unlock()\n`;
        }
        for (const arg of method.args)
            if (!arg.isFromRetThenable)
                src += `\t${__.msg}.Payload["${arg.name}"] = ${this.caseLo(arg.name)}\n`;
        src += `\n\tvar ${__.on} func(Any)\n`;
        const lastarg = method.args[method.args.length - 1];
        if (lastarg.isFromRetThenable) {
            let laname = this.caseLo(lastarg.name), tret = this.typeSpec(lastarg.typeSpec, true, true);
            src += `\tif ${laname} != nil {\n`;
            src += `\t\t${__.on} = func(${__.payload} Any) {\n`;
            src += `\t\t\tvar ${__.result} ${tret}\n`;
            src += this.genDecodeFromAny(prep, "\t\t\t", __.payload, __.result, tret, true, "", "return");
            src += `\t\t\t${laname}(${__.result})\n`;
            src += `\t\t}\n`;
            src += `\t}\n`;
        }
        if (funcfields.length) {
            src += `\n\tme.send(&${__.msg}, func(payload Any) {\n`;
            src += `\t\tif len(${__.fnids}) != 0 {\n`;
            src += `\t\t\tme.state.Lock()\n`;
            src += `\t\t\tfor _, ${__.fnid} := range ${__.fnids} {\n`;
            src += `\t\t\t\tdelete(me.state.callbacks.other, ${__.fnid})\n`;
            src += `\t\t\t}\n`;
            src += `\t\t\tme.state.Unlock()\n`;
            src += `\t\t}\n`;
            src += `\t\tif ${__.on} != nil {\n\t\t\t${__.on}(payload)\n\t\t}\n`;
            src += `\t})\n`;
        }
        else
            src += `\n\tme.send(&${__.msg}, ${__.on})\n`;
        src += "}\n\n";
        return src;
    }
    genDecodeFromAny(prep, pref, srcName, dstName, dstTypeGo, nilToZeroOk, errName, errOther = "return false", haveOk = false) {
        if (dstTypeGo === 'interface{}' || dstTypeGo === 'Any')
            return `${pref}${dstName} = ${srcName}\n`;
        let src = "";
        if (nilToZeroOk)
            [src, pref] = [src + `${pref}if ${srcName} != nil {\n`, pref + '\t'];
        src += haveOk ? "" : `${pref}var ok bool\n`;
        const dsttypego = dstTypeGo.startsWith('*') ? dstTypeGo.slice(1) : dstTypeGo;
        if (prep.structs.some(_ => _.name === dsttypego)) {
            prep.state.genDecoders[dsttypego] = true;
            if (dstTypeGo !== dsttypego)
                src += `${pref}${dstName} = new(${dsttypego})\n`;
            src += `${pref}ok = ${dstName}.populateFrom(${srcName})\n`;
        }
        else
            src += `${pref}${dstName}, ok = ${srcName}.(${dstTypeGo})\n`;
        src += `${pref}if !ok {\n`;
        if (errName)
            src += `${pref}\t${errName} = ${srcName}\n`;
        else if (errOther)
            src += `${pref}\t${errOther}\n`;
        src += `${pref}}\n`;
        if (nilToZeroOk)
            src += pref.substr(0, pref.length - 1) + '}\n';
        return src;
    }
    genPopulateFrom(prep, typeName) {
        const struct = prep.structs.find(_ => _.name === typeName);
        if (!struct)
            throw (typeName);
        let src = `func (me *${typeName}) populateFrom(payload Any) bool {\n`;
        src += "\tm, ok := payload.(map[string]Any)\n";
        src += "\tif ok && m != nil {\n";
        for (const _ of struct.fields) {
            src += "\t\t{\n";
            src += `\t\t\tval, exists := m["${_.name}"]\n`;
            src += `\t\t\tif (exists) {\n`;
            src += `\t\t\t\tif val != nil {\n`;
            src += this.genDecodeFromAny(prep, "\t\t\t\t\t", "val", "me." + this.caseUp(_.name), this.typeSpec(_.typeSpec), false, "");
            src += `\t\t\t\t} else if ${!_.optional} {\n`;
            src += `\t\t\t\t\treturn false\n`;
            src += `\t\t\t\t}\n`;
            src += `\t\t\t} else if ${!_.optional} {\n`;
            src += `\t\t\t\treturn false\n`;
            src += `\t\t\t}\n`;
            src += "\t\t}\n";
        }
        src += "\t\treturn true\n";
        src += "\t}\n";
        src += "\treturn false\n";
        src += "}\n\n";
        return src;
    }
    genNonZeroCheck(name, from) {
        if (from) {
            if (from === gen.ScriptPrimType.Boolean)
                return `${name}`;
            if (from === gen.ScriptPrimType.String)
                return `len(${name}) != 0`;
            if (from === gen.ScriptPrimType.Number)
                return "${name} != 0";
            const tarr = gen.typeArrOf(from);
            if (tarr)
                return `len(${name}) != 0`;
            const ttup = gen.typeTupOf(from);
            if (ttup && ttup.length)
                return `len(${name}) != 0`;
        }
        return `${name} != nil`;
    }
    genDocLns(docs, isSub = false) {
        let ret = [];
        if (docs && docs.length)
            for (const doc of docs) {
                if (doc.lines && doc.lines.length) {
                    ret.push("// ");
                    for (const ln of doc.lines)
                        ret.push("// " + ln);
                }
                if (doc.subs && doc.subs.length)
                    ret.push(...this.genDocLns(doc.subs, true));
            }
        return isSub ? ret : ret.slice(1);
    }
    typeSpecNilable(from, ensureNilable, ...assumeNilable) {
        const nullableprefixes = ['*', '[]', 'map[', 'interface{', 'func('];
        let src = this.typeSpec(from);
        if (ensureNilable && (!nullableprefixes.some(_ => src.startsWith(_)))
            && (assumeNilable && assumeNilable.length && !assumeNilable.some(_ => src === _)))
            src = "*" + src;
        return src;
    }
    typeSpec(from, intoProm = false, ptrIfStruct = false) {
        if (!from)
            return "";
        if (from === gen.ScriptPrimType.Any)
            return "Any";
        if (from === gen.ScriptPrimType.Boolean)
            return "bool";
        if (from === gen.ScriptPrimType.String)
            return "string";
        if (from === gen.ScriptPrimType.Number)
            return "int";
        if (from === gen.ScriptPrimType.Dict)
            return "map[string]Any";
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
                const tn = this.typeSpec(t, intoProm, ptrIfStruct);
                if (!tname)
                    tname = tn;
                else if (tn !== tname) {
                    tname = undefined;
                    break;
                }
            }
            return "[]" + (tname ? tname : "Any");
        }
        let tsum = gen.typeSumOf(from);
        if (tsum && tsum.length) {
            tsum = tsum.filter(_ => _ !== gen.ScriptPrimType.Null && _ !== gen.ScriptPrimType.Undefined && !gen.typeProm(_));
            return this.parensIfJoin(tsum.map(_ => this.typeSpec(_, intoProm, ptrIfStruct)), '|');
        }
        const tprom = gen.typeProm(from);
        if (tprom && tprom.length)
            if (tprom.length > 1)
                throw (from);
            else if (intoProm)
                return this.typeSpec(tprom[0], false, ptrIfStruct);
            else
                return "func(" + this.typeSpec(tprom[0], false, true) + ")";
        if (typeof from === 'string')
            return ptrIfStruct ? ('*' + from) : from;
        return "Any";
    }
}
exports.Gen = Gen;
