"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const gen = require("./gen-shared");
class Gen extends gen.Gen {
    gen(prep) {
        const pkgname = prep.fromOrig.module[0];
        let src = "package " + pkgname + "\n\n// " + this.doNotEditComment("golang") + "\n\n";
        src += "type Protocol interface {\n";
        for (let i = 0; i < prep.interfaces.length; i++)
            src += "\t" + this.caseUp(prep.interfaces[i].name) + "() " + this.caseUp(prep.interfaces[i].name) + "\n";
        src += "}\n\n";
        for (let i = 0; i < prep.interfaces.length; i++)
            src += `func (me *impl) ${this.caseUp(prep.interfaces[i].name)}() ${this.caseUp(prep.interfaces[i].name)} { return me }\n\n`;
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
                        src += this.genPopulate(prep, name);
                        prep.state.genDecoders[name] = false;
                    }
            }
        }
        node_fs.writeFileSync(`${this.outFilePathPref}${pkgname}${this.outFilePathSuff}`, src);
    }
    genEnum(it) {
        const name = this.caseUp(it.name);
        let src = "type " + name + " int\n\nconst (\n";
        for (const enumerant of it.enumerants)
            src += "\t" + name + this.caseUp(enumerant.name) + " " + name + " = " + enumerant.value + "\n";
        return src + ")\n\n";
    }
    genStruct(it) {
        let src = "type " + this.caseUp(it.name) + " struct {\n";
        for (const field of it.fields)
            src += "\t" + this.caseUp(field.name) + " " + this.typeSpec(field.typeSpec)
                + ((gen.typeFun(field.typeSpec)) ? " `json:\"-\"`" : (" `json:\"" + field.name + (field.optional ? ",omitempty" : "") + "\"`"))
                + "\n";
        for (const field of it.funcFields) {
            src += "\t" + this.caseUp(field) + "_AppzFuncId string `json:\",omitempty\"`\n";
        }
        return src + "}\n\n";
    }
    genInterface(prep, it) {
        let src = "type " + this.caseUp(it.name) + " interface {\n";
        for (const method of it.methods) {
            src += "\t" + this.caseUp(method.name) + "(";
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
        let src = "func (me *impl) " + this.caseUp(method.name) + "(";
        const funcfields = [];
        for (const arg of method.args) {
            src += this.caseLo(arg.name) + " " + this.typeSpecNilable(arg.typeSpec, arg.optional, 'string') + ", ";
            for (const struct of prep.structs.filter(_ => _.name === arg.typeSpec))
                if (struct.funcFields && struct.funcFields.length)
                    for (const funcfield of struct.funcFields)
                        funcfields.push({ arg: arg.name, struct: struct, name: funcfield });
        }
        src += ") {\n";
        const numargs = method.args.filter(_ => !_.isFromRetThenable).length;
        src += `\tmsg := msgOutgoing{Ns: "${it.name}", Name: "${method.name}", Payload: make(map[string]Any, ${numargs})}\n`;
        if (funcfields.length) {
            src += `\tfuncids := make([]string, 0, ${funcfields.length})\n`;
            src += `\tme.callbacks.Lock()\n`;
            for (const ff of funcfields) {
                const facc = this.caseLo(ff.arg) + '.' + this.caseUp(ff.name);
                src += `\t${facc}_AppzFuncId = ""\n`;
                src += `\tif fn := ${facc}; fn != nil {\n`;
                src += `\t\t${facc}_AppzFuncId = me.nextFuncId()\n`;
                src += `\t\tfuncids = append(funcids, ${facc}_AppzFuncId)\n`;
                src += `\t\tme.callbacks.other[${facc}_AppzFuncId] = func(args...Any) (ret Any, ok bool) {\n`;
                const args = gen.typeFun(ff.struct.fields.find(_ => _.name === ff.name).typeSpec)[0];
                src += `\t\t\tif ok = (len(args) == ${args.length}); ok {\n`;
                for (let a = 0; a < args.length; a++) {
                    const tspec = this.typeSpec(args[a]);
                    src += `\t\t\t\tvar a${a} ${tspec}\n`;
                    src += this.genDecodeFromAny(prep, "\t\t\t\t", "args[" + a + "]", "a" + a, tspec, "", "return", true);
                }
                src += `\t\t\t\tret = fn(${args.map((_, a) => 'a' + a).join(', ')})\n`;
                src += `\t\t\t}\n`;
                src += `\t\t\treturn\n`;
                src += `\t\t}\n`;
                src += `\t}\n`;
            }
            src += `\tme.callbacks.Unlock()\n`;
        }
        for (const arg of method.args)
            if (!arg.isFromRetThenable)
                src += `\tmsg.Payload["${arg.name}"] = ${this.caseLo(arg.name)}\n`;
        src += `\n\tvar on func(Any, bool)\n`;
        const lastarg = method.args[method.args.length - 1];
        if (lastarg.isFromRetThenable) {
            let laname = this.caseLo(lastarg.name), tret = this.typeSpec(lastarg.typeSpec, true);
            src += `\tif ${laname} != nil {\n`;
            src += `\t\ton = func(payload Any, isFail bool) {\n`;
            src += `\t\t\tvar result ${tret}\n`;
            src += `\t\t\tvar reject Any\n`;
            src += `\t\t\tif isFail {\n`;
            src += `\t\t\t\treject = payload\n`;
            src += `\t\t\t} else {\n`;
            src += this.genDecodeFromAny(prep, "\t\t\t\t", "payload", "result", tret, "reject");
            src += `\t\t\t}\n`;
            src += `\t\t\tif reject == nil {\n`;
            src += `\t\t\t\t${laname}(result)\n`;
            src += `\t\t\t}\n`;
            src += `\t\t}\n`;
            src += `\t}\n`;
        }
        if (funcfields.length) {
            src += `\n\tme.send(&msg, func(payload Any, isFail bool) {\n`;
            src += `\t\tif len(funcids) != 0 {\n`;
            src += `\t\t\tme.callbacks.Lock()\n`;
            src += `\t\t\tfor _, funcid := range funcids {\n`;
            src += `\t\t\t\tdelete(me.callbacks.other, funcid)\n`;
            src += `\t\t\t}\n`;
            src += `\t\t\tme.callbacks.Unlock()\n`;
            src += `\t\t}\n`;
            src += `\t\tif on != nil {\n\t\t\ton(payload, isFail)\n\t\t}\n`;
            src += `\t})\n`;
        }
        else
            src += `\n\tme.send(&msg, on)\n`;
        src += "}\n\n";
        return src;
    }
    genDecodeFromAny(prep, pref, srcName, dstName, dstTypeGo, errName, errOther = "return false", haveOk = false) {
        if (dstTypeGo === 'interface{}' || dstTypeGo === 'Any')
            return `${pref}${dstName} = ${srcName}\n`;
        let src = haveOk ? "" : `${pref}var ok bool\n`;
        if (prep.structs.some(_ => _.name === dstTypeGo)) {
            prep.state.genDecoders[dstTypeGo] = true;
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
        return src;
    }
    genPopulate(prep, typeName) {
        const struct = prep.structs.find(_ => _.name === typeName);
        if (!struct)
            throw (typeName);
        let src = `func (me *${typeName}) populateFrom(payload Any) bool {\n`;
        src += "\tm, ok := payload.(map[string]Any)\n";
        src += "\tif ok && m != nil {\n";
        struct.fields.forEach(_ => {
            src += "\t\t{\n";
            src += `\t\t\tval, exists := m["${_.name}"]\n`;
            src += `\t\t\tif (exists) {\n`;
            src += `\t\t\t\tif val != nil {\n`;
            src += this.genDecodeFromAny(prep, "\t\t\t\t\t", "val", "me." + this.caseUp(_.name), this.typeSpec(_.typeSpec), "");
            src += `\t\t\t\t} else if ${!_.optional} {\n`;
            src += `\t\t\t\t\treturn false\n`;
            src += `\t\t\t\t}\n`;
            src += `\t\t\t} else if ${!_.optional} {\n`;
            src += `\t\t\t\treturn false\n`;
            src += `\t\t\t}\n`;
            src += "\t\t}\n";
        });
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
    typeSpecNilable(from, ensureNilable, ...assumeNilable) {
        const nullableprefixes = ['*', '[]', 'map[', 'interface{', 'func('];
        let src = this.typeSpec(from);
        if (ensureNilable && (!nullableprefixes.some(_ => src.startsWith(_)))
            && (assumeNilable && assumeNilable.length && !assumeNilable.some(_ => src === _)))
            src = "*" + src;
        return src;
    }
    typeSpec(from, intoProm = false) {
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
            return "[]" + (tname ? tname : "Any");
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
                return "func(" + this.typeSpec(tprom[0]) + ")";
        if (typeof from === 'string')
            return from;
        return "Any";
    }
}
exports.Gen = Gen;
