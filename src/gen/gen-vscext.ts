import * as ts from 'typescript'
import * as gen from './gen'

export class Gen extends gen.Gen implements gen.IGen {

    pkg: string
    typeNamesUsed: { [_: string]: boolean }

    gen(prep: gen.Prep) {
        this.resetState()
        this.typeNamesUsed = {}
        this.pkg = prep.fromOrig.moduleName
        let src = "// " + this.doNotEditComment("vscext") + "\n\n"
        src += `import * as ${this.pkg} from '${this.pkg}'\n`
        src += "import * as ppio from './procspipeio'\n"
        src += "const noOp = (_:any) => {}\n"

        src += `\nexport function handle(msg: ppio.IpcMsg, prog: ppio.Prog, remoteCancellationTokens: string[]): Thenable<any> | ${this.pkg}.Disposable {\n`
        src += "\tconst idxdot = msg.qName.lastIndexOf('.')\n"
        src += `\tconst [apiname, methodname] = (idxdot > 0) ? [msg.qName.slice(0, idxdot), msg.qName.slice(idxdot + 1)] : ['', msg.qName]\n`
        src += "\tswitch (apiname) {\n"
        for (const it of prep.interfaces) {
            src += `\t\tcase "${it.name}":\n`
            src += "\t\t\tswitch (methodname) {\n"
            for (const method of it.methods)
                if (method.isProps) {
                    src += `\t\t\t\tcase "${method.name}": {\n`
                    src += `\t\t\t\t\treturn Promise.resolve({\n`
                    for (const fld of method.isProps.fields)
                        src += `\t\t\t\t\t\t${fld.name}: ${this.pkg}.${it.name}.${fld.name},\n`
                    src += `\t\t\t\t\t})\n`
                    src += `\t\t\t\t}\n`
                } else if (method.fromOrig) {
                    const isprop = method.fromOrig.decl as gen.MemberProp,
                        isevt = method.fromOrig.decl as gen.MemberEvent
                    src += `\t\t\t\tcase "${method.name}": {\n`
                    if (isprop && isprop.PropName && isprop.PropType)
                        src += `\t\t\t\t\treturn Promise.resolve(${method.fromOrig.qName})\n`
                    else if (isevt && isevt.EvtName && isevt.EvtName.length) {
                        const fnid = "_fnid_" + method.args[0].name
                        src += `\t\t\t\t\tconst ${fnid} = msg.data['${method.args[0].name}'] as string\n`
                        src += `\t\t\t\t\treturn (!(${fnid} && ${fnid}.length))\n`
                        src += `\t\t\t\t\t\t? ppio.promRej("${it.name}.${method.name}.${method.args[0].name}", msg.data)\n`
                        src += `\t\t\t\t\t\t: ${method.fromOrig.qName}((${isevt.EvtArgs.map((_ea, i) => 'a' + i).join(', ')}) => {\n`
                        src += `\t\t\t\t\t\t\tif (prog && prog.proc)\n`
                        src += `\t\t\t\t\t\t\t\tprog.callBack("${it.name}.${method.name}", false, ${fnid}, ${isevt.EvtArgs.map((_ea, i) => 'a' + i).join(', ')}).then(noOp, noOp)\n`
                        src += `\t\t\t\t\t\t})\n`
                    } else {
                        const args = method.args.filter(_ => !_.isFromRetThenable)
                        for (const arg of args)
                            src += this.argsSrc(prep, it.name + "." + method.name, arg)
                        src += this.retArgsSrc(method.fromOrig.qName, args)
                    }
                    src += `\t\t\t\t}\n`
                }
            src += "\t\t\t\tdefault:\n"
            src += "\t\t\t\t\tthrow (methodname)\n"
            src += "\t\t\t}\n"
        }
        for (const it of prep.structs)
            if (it.isDispObj) {
                this.typeNamesUsed[it.name] = true
                src += `\t\tcase "${it.name}":\n`
                src += `\t\t\tconst this${it.name} = prog.objects[msg.data[""]] as ${it.name}\n`
                src += `\t\t\tif (!this${it.name})\n`
                src += `\t\t\t\tthrow "Called ${this.pkg}.${it.name}." + methodname + " for an already disposed-and-forgotten instance"\n`
                src += "\t\t\tswitch (methodname) {\n"
                let tfun: [gen.TypeSpec[], gen.TypeSpec]
                let hasgets = false, hassets = false
                for (const mem of it.fields)
                    if (!(tfun = gen.typeFun(mem.typeSpec)))
                        [hasgets, hassets] = [true, hassets || !mem.readOnly]
                    else if (mem.name !== "dispose") {
                        const orig = mem.fromOrig
                        const isevt = (ts.isPropertySignature(orig) && ts.isTypeReferenceNode(orig.type) && orig.type.typeName.getText() === "Event")
                        const args = isevt ? [
                            { name: "handler", optional: false, typeSpec: (mem.typeSpec as gen.TypeSpecFun).From[0] },
                        ] : (tfun[0].map((_, i): gen.PrepArg => gen.argFrom(_, (orig as ts.MethodSignature).parameters[i])).filter(_ => !_.isFromRetThenable))
                        src += `\t\t\t\tcase "${mem.name}": {\n`
                        for (const arg of args)
                            src += this.argsSrc(prep, it.name + "." + mem.name + "." + arg.name, arg, isevt, it)
                        src += this.retArgsSrc(`this${it.name}.${mem.name}`, args, (mem.name === "dispose" || isevt) ? "" : ("{ " + this.propSrc(it) + " }"))
                        src += "\t\t\t\t}\n"
                    }
                if (hasgets) {
                    src += `\t\t\t\tcase "${gen.idents.methodObjBagPull}": {\n`
                    src += "\t\t\t\t\treturn Promise.resolve({ " + this.propSrc(it) + " })\n"
                    src += "\t\t\t\t}\n"
                }
                if (hassets) {
                    src += `\t\t\t\tcase "${gen.idents.methodObjBagPush}": {\n`
                    src += `\t\t\t\t\tconst upd = msg.data["${gen.idents.argUpd}"] as { [_:string]: any }\n`
                    src += `\t\t\t\t\tif (!upd)\n\t\t\t\t\t\treturn ppio.promRej("${it.name}.set#${gen.idents.argUpd}", msg.data)\n`
                    for (const prop of it.fields.filter(_ => (!_.readOnly) && !gen.typeFun(_.typeSpec))) {
                        const tcol = gen.typeNames(prop.typeSpec).includes("ThemeColor")
                        for (const tname of gen.typeNames(prop.typeSpec))
                            this.typeNamesUsed[tname] = true
                        src += `\t\t\t\t\tconst prop_${prop.name} = upd["${prop.name}"] as ${this.typeSpec(prop.typeSpec)}\n`
                        src += `\t\t\t\t\tif (prop_${prop.name} !== undefined) {\n`
                            + `\t\t\t\t\t\tlet val = `
                            + ((!tcol) ? `prop_${prop.name}`
                                : (`(!((typeof prop_${prop.name} === "string") && prop_${prop.name} && prop_${prop.name}.length)) ? undefined : prop_${prop.name}.startsWith("#") ? prop_${prop.name} : new ${this.pkg}.ThemeColor(prop_${prop.name})`))
                            + "\n"
                            + `\t\t\t\t\t\tif (val !== this${it.name}.${prop.name})\n`
                            + `\t\t\t\t\t\t\tthis${it.name}.${prop.name} = val\n`
                            + "\t\t\t\t\t}\n"
                    }
                    src += "\t\t\t\t\treturn Promise.resolve({ " + this.propSrc(it) + " })\n"
                    src += "\t\t\t\t}\n"
                }
                src += "\t\t\t\tdefault:\n"
                src += "\t\t\t\t\tthrow methodname\n"
                src += "\t\t\t}\n"
            }

        src += "\t\tdefault:\n"
        src += "\t\t\tthrow (apiname)\n"
        src += "\t}\n"
        src += "}\n\n"

        for (const it of prep.enums)
            if (this.typeNamesUsed[it.name])
                src += "type " + it.name + " = " + this.pkg + "." + it.name + "\n"
        for (const it of prep.structs)
            if (this.typeNamesUsed[it.name]) {
                const fieldsextra = it.fields.filter(_ => _.isExtBaggage)
                if (((!(it.isPropsOfIface || it.isPropsOfStruct)) && it.isOutgoing) && ((it.funcFields && it.funcFields.length) || (fieldsextra && fieldsextra.length))) {
                    src += "interface " + it.name + " extends " + this.pkg + "." + it.name + " {\n"
                    for (const f of fieldsextra)
                        src += `\t${f.name + (f.optional ? '?' : '')}: ${this.typeSpec(f.typeSpec)}\n`
                    for (const ff of it.funcFields)
                        src += `\t${ff}${gen.idents.fldSuffFuncId}: string\n`
                    src += "}\n"
                } else {
                    let tgen: string
                    if (it.fromOrig && it.fromOrig.decl && it.fromOrig.decl.typeParameters && it.fromOrig.decl.typeParameters.length)
                        tgen = ts.getEffectiveConstraintOfTypeParameter(it.fromOrig.decl.typeParameters[0]).getText()
                    src += "type " + it.name + " = " + this.pkg + "." + it.name + (tgen ? `<${tgen}>` : "") + "\n"
                }
            }

        this.writeFileSync(this.pkg, src)
    }

    argsSrc(prep: gen.Prep, hint: string, arg: gen.PrepArg, isEvt?: boolean, curDispObjInst?: gen.PrepStruct) {
        let src = ""
        let tfunc: [gen.TypeSpec[], gen.TypeSpec]
        if (arg.isCancellationToken !== undefined) {
            src += `\t\t\t\t\tlet ctid = msg.data['${arg.name}'] as string, arg_${arg.name} = prog.cancellerToken(ctid)\n`
            src += `\t\t\t\t\tif (!arg_${arg.name})\n`
            src += `\t\t\t\t\t\targ_${arg.name} = prog.cancellers[''].token\n`
            src += `\t\t\t\t\telse\n`
            src += `\t\t\t\t\t\tremoteCancellationTokens.push(ctid)\n`
        } else if ((tfunc = gen.typeFun(arg.typeSpec)) && (tfunc.length)) {
            for (const tname of gen.typeNames(arg.typeSpec))
                this.typeNamesUsed[tname] = true
            const fnid = arg.name + gen.idents.varSuffFnid
            src += `\t\t\t\t\tconst ${fnid} = msg.data['${arg.name}'] as string\n`
            src += `\t\t\t\t\tif (!(${fnid} && ${fnid}.length))\n`
            src += `\t\t\t\t\t\treturn ppio.promRej("${hint}", msg.data)\n`
            src += `\t\t\t\t\tconst arg_${arg.name} = (${tfunc[0].map((_, i) => (gen.typeArrSpreads(_) ? '...' : '') + '_' + i + ': ' + this.typeSpec(_)).join(', ')}): ${this.typeSpec(tfunc[1])} => {\n`
            src += "\t\t\t\t\t\tif (prog && prog.proc)\n"
            src += `\t\t\t\t\t\t\treturn prog.callBack("${hint}", ${!isEvt}, ${fnid}, ${tfunc[0].map((_, i) => '_' + i).join(', ') + ((!(isEvt && curDispObjInst)) ? "" : ("" + (tfunc[0].length ? ", " : "") + "({ " + this.propSrc(curDispObjInst) + " })"))})\n`
            src += "\t\t\t\t\t\treturn undefined\n"
            src += "\t\t\t\t\t}\n"
        } else {
            if (arg.typeSpec !== 'Uri') {
                for (const tname of gen.typeNames(arg.typeSpec))
                    this.typeNamesUsed[tname] = true
                src += `\t\t\t\t\tconst arg_${arg.name} = (msg.data['${arg.name}']${(gen.typeArr(arg.typeSpec) || gen.typeTup(arg.typeSpec)) ? ' || []' : ''}) as ${this.typeSpec(arg.typeSpec)}\n`
            } else {
                src += `\t\t\t\t\tconst arg_${arg.name} = ppio.tryUnmarshalUri(msg.data['${arg.name}'])\n`
                src += `\t\t\t\t\tif (!arg_${arg.name})\n`
                src += `\t\t\t\t\t\treturn ppio.promRej("${hint}", msg.data['${arg.name}'])\n`
            }
            const funcfields = gen.argsFuncFields(prep, [arg])
            if (funcfields && funcfields.length)
                for (const ff of funcfields) {
                    const tfn = gen.typeFun(ff.struct.fields.find(_ => _.name === ff.name).typeSpec)
                    if (tfn && tfn.length) {
                        src += `\t\t\t\t\tif (arg_${arg.name} && arg_${arg.name}.${ff.name}${gen.idents.fldSuffFuncId} && arg_${arg.name}.${ff.name}${gen.idents.fldSuffFuncId}.length)\n`
                        src += `\t\t\t\t\t\targ_${arg.name}.${ff.name} = (${tfn[0].map((_, idx) => 'a' + idx).join(', ')}) => prog.callBack("${hint}", true, arg_${arg.name}.${ff.name}${gen.idents.fldSuffFuncId}, ${tfn[0].map((_, idx) => 'a' + idx).join(', ')})\n`
                    }
                }
        }
        return src
    }

    retArgsSrc(callee: string, args: gen.PrepArg[], altRet?: string): string {
        let src = ""

        src += `\t\t\t\t\tconst ret = ${callee}(`
        for (const arg of args)
            src += (arg.spreads ? '...' : '') + 'arg_' + arg.name + ', '
        src += ")\n"
        if (altRet && altRet.length)
            src += "\t\t\t\t\treturn Promise.resolve([ret, " + altRet + "])\n"
        else {
            src += `\t\t\t\t\tconst retdisp = ret as any as ${this.pkg}.Disposable\n`
            src += `\t\t\t\t\tconst retprom = ret as any as Thenable<any>\n`
            src += `\t\t\t\t\treturn (retprom && retprom.then) ? retprom : ((retdisp && retdisp.dispose) ? retdisp : Promise.resolve(ret))\n`
        }
        return src
    }

    propSrc(it: gen.PrepStruct): string {
        return it.fields.filter(_ => !gen.typeFun(_.typeSpec)).map(prop =>
            `${prop.name}: ` + (!gen.typeSumOf(prop.typeSpec, 'ThemeColor') ? `this${it.name}.${prop.name}` : `(this${it.name}.${prop.name} && ((this${it.name}.${prop.name} as any)["id"])) ? ((this${it.name}.${prop.name} as any)["id"]) : this${it.name}.${prop.name}`)
        ).join(", ")
    }

    typeSpec(from: gen.TypeSpec, intoProm: boolean = false): string {
        if (!from)
            return "unknown"

        if (from === gen.ScriptPrimType.Any)
            return "any"
        if (from === gen.ScriptPrimType.Boolean)
            return "boolean"
        if (from === gen.ScriptPrimType.BooleanTrue)
            return "true"
        if (from === gen.ScriptPrimType.BooleanFalse)
            return "false"
        if (from === gen.ScriptPrimType.String)
            return "string"
        if (from === gen.ScriptPrimType.Number)
            return "number"
        if (from === gen.ScriptPrimType.Null)
            return "null"
        if (from === gen.ScriptPrimType.Undefined)
            return "undefined"
        if (from === gen.ScriptPrimType.Dict)
            return "{ [_: string]: any }"

        const tarr = gen.typeArr(from)
        if (tarr)
            return this.typeSpec(tarr) + "[]"

        const tfun = gen.typeFun(from)
        if (tfun && tfun.length && tfun[0])
            return "(" + tfun[0].map(_ => this.typeSpec(_)).join(", ") + ")=>" + (tfun[1] ? this.typeSpec(tfun[1]) : "void")

        let ttup = gen.typeTup(from)
        if (ttup && ttup.length)
            return "[" + ttup.map(_ => this.typeSpec(_)).join(', ') + "]"

        let tsum = gen.typeSum(from)
        if (tsum && tsum.length)
            // return this.parensIfJoin(tsum.map(_ => '(' + this.typeSpec(_) + ')'), ' | ')
            return this.typeSpec(tsum[0])

        let tmul = gen.typeMul(from)
        if (tmul && tmul.length)
            // return this.parensIfJoin(tmul.map(_ => '(' + this.typeSpec(_) + ')'), ' & ')
            return this.typeSpec(tmul[0])

        let tobj = gen.typeObj(from)
        if (tobj)
            return '{' + tobj.map(_ => _[0] + ':' + this.typeSpec(_[1])).join(', ') + '}'

        const tprom = gen.typeProm(from)
        if (tprom && tprom.length)
            if (tprom.length > 1)
                throw (from)
            else if (intoProm)
                return this.typeSpec(tprom[0])
            else
                return "Thenable<" + this.typeSpec(tprom[0]) + ">"

        if (typeof from === 'string')
            return from

        return "any"
    }

}
