import * as gen from './gen-basics'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.Prep) {
        this.resetState()
        const pkgname = prep.fromOrig.moduleName
        let src = "// " + this.doNotEditComment("vscext") + "\n\n"
        src += `import * as ${pkgname} from '${pkgname}'\n\n`
        src += "import * as ppio from './procspipeio'\n\n"

        for (const it of prep.enums)
            src += "type " + it.name + " = " + pkgname + "." + it.name + "\n"
        for (const it of prep.structs) if (it.isOutgoing) {
            const fieldsextra = it.fields.filter(_ => _.isExtBaggage)
            if ((it.funcFields && it.funcFields.length) || (fieldsextra && fieldsextra.length)) {
                src += "interface " + it.name + " extends " + pkgname + "." + it.name + " {\n"
                for (const f of fieldsextra)
                    src += `\t${f.name + (f.optional ? '?' : '')}: ${this.typeSpec(f.typeSpec)}\n`
                for (const ff of it.funcFields)
                    src += `\t${ff}_AppzFuncId: string\n`
                src += "}\n"
            } else
                src += "type " + it.name + " = " + pkgname + "." + it.name + "\n"
        }

        src += `\nexport function handle(msg: ppio.IpcMsg, prog: ppio.Prog, remoteCancellationTokens: string[]): Thenable<any> | ${pkgname}.Disposable {\n`
        src += "\tconst idxdot = msg.qName.lastIndexOf('.')\n"
        src += `\tconst [apiname, methodname] = (idxdot > 0) ? [msg.qName.slice(0, idxdot), msg.qName.slice(idxdot + 1)] : ['', msg.qName]\n`
        src += "\tswitch (apiname) {\n"
        for (const it of prep.interfaces) {
            src += `\t\tcase "${it.name}":\n`
            src += "\t\t\tswitch (methodname) {\n"
            for (const method of it.methods) {
                const isprop = method.fromOrig.decl as gen.MemberProp,
                    isevt = method.fromOrig.decl as gen.MemberEvent
                src += `\t\t\t\tcase "${method.name}": {\n`
                if (isprop && isprop.PropName && isprop.PropType)
                    src += `\t\t\t\t\treturn Promise.resolve(${method.fromOrig.qName})\n`
                else if (isevt && isevt.EvtArgs && isevt.EvtArgs.length)
                    src += `\t\t\t\t\treturn Promise.resolve(${method.fromOrig.qName})\n`
                else {
                    const lastarg = method.args[method.args.length - 1]
                    for (const arg of method.args)
                        if (arg !== lastarg)
                            if (arg.isCancellationToken !== undefined) {
                                src += `\t\t\t\t\tlet ctid = msg.data['${arg.name}'] as string, arg_${arg.name} = prog.cancellerToken(ctid)\n`
                                src += `\t\t\t\t\tif (!arg_${arg.name})\n`
                                src += `\t\t\t\t\t\targ_${arg.name} = prog.cancellers[''].token\n`
                                src += `\t\t\t\t\telse \n`
                                src += `\t\t\t\t\t\tremoteCancellationTokens.push(ctid)\n`
                            } else {
                                src += `\t\t\t\t\tconst arg_${arg.name} = (msg.data['${arg.name}']${(gen.typeArr(arg.typeSpec) || gen.typeTup(arg.typeSpec)) ? ' || []' : ''}) as ${this.typeSpec(arg.typeSpec)}\n`
                                const funcfields = gen.argsFuncFields(prep, [arg])
                                if (funcfields && funcfields.length)
                                    for (const ff of funcfields) {
                                        const tfn = gen.typeFun(ff.struct.fields.find(_ => _.name === ff.name).typeSpec)
                                        if (tfn && tfn.length) {
                                            src += `\t\t\t\t\tif (arg_${arg.name}.${ff.name}_AppzFuncId && arg_${arg.name}.${ff.name}_AppzFuncId.length)\n`
                                            src += `\t\t\t\t\t\targ_${arg.name}.${ff.name} = (${tfn[0].map((_, idx) => 'a' + idx).join(', ')}) => prog.callBack(arg_${arg.name}.${ff.name}_AppzFuncId, ${tfn[0].map((_, idx) => 'a' + idx).join(', ')})\n`
                                        }
                                    }
                            }

                    src += `\t\t\t\t\treturn ${method.fromOrig.qName}(`
                    for (const arg of method.args)
                        if (arg !== lastarg)
                            src += (arg.spreads ? '...' : '') + 'arg_' + arg.name + ', '
                    src += ")\n"
                }
                src += `\t\t\t\t}\n`
            }
            src += "\t\t\t\tdefault:\n"
            src += "\t\t\t\t\tthrow (methodname)\n"
            src += "\t\t\t}\n"
        }
        src += "\t\tdefault:\n"
        src += "\t\t\tthrow (apiname)\n"
        src += "\t}\n"
        src += "}\n\n"

        this.writeFileSync(pkgname, src)
    }


    typeSpec(from: gen.TypeSpec, intoProm: boolean = false): string {
        if (!from)
            return "undefined"

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
