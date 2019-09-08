import * as gen from './gen-shared'

export class Gen extends gen.Gen implements gen.IGen {

    gen(prep: gen.GenPrep) {
        const pkgname = prep.fromOrig.module[0]
        let src = "// " + this.doNotEditComment("vscext") + "\n\n"
        src += "import * as vscode from 'vscode'\n\n"
        src += "import * as ipc from './ipcprotocol'\n\n"

        for (const it of prep.enums)
            src += "type " + it.name + " = vscode." + it.name + "\n"
        for (const it of prep.structs) {
            const fieldsextra = it.fields.filter(_ => _.isExtBaggage)
            if (!fieldsextra.length)
                src += "type " + it.name + " = vscode." + it.name + "\n"
            else {
                src += "interface " + it.name + " extends vscode." + it.name + " {\n"
                for (const f of fieldsextra)
                    src += `\t${f.name + (f.optional ? '?' : '')}: ${this.typeSpec(f.typeSpec)}\n`
                src += "}\n"
            }
        }

        src += "\nexport function handle(msg: ipc.MsgFromApp): Thenable<any> {\n"
        src += "\tswitch (msg.ns) {\n"
        for (const it of prep.interfaces) {
            src += `\t\tcase "${it.name}":\n`
            src += "\t\t\tswitch (msg.name) {\n"
            for (const method of it.methods) {
                src += `\t\t\t\tcase "${method.name}":\n`
                const lastarg = method.args[method.args.length - 1]
                src += `\t\t\t\t\treturn ${method.fromOrig.qName}(`
                for (const arg of method.args)
                    if (arg !== lastarg)
                        src += (arg.spreads ? '...' : '') + `(msg.payload['${arg.name}']${(gen.typeArrOf(arg.typeSpec) || gen.typeTupOf(arg.typeSpec)) ? ' || []' : ''}) as ${this.typeSpec(arg.typeSpec)}, `
                src += ")\n"
                // src += "\t\t\t\t\tbreak\n"
            }
            src += "\t\t\t\tdefault:\n"
            src += "\t\t\t\t\tthrow (msg.name)\n"
            src += "\t\t\t}\n"
            // src += "\t\t\tbreak\n"
        }
        src += "\t\tdefault:\n"
        src += "\t\t\tthrow (msg.ns)\n"
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
        if (from === gen.ScriptPrimType.String)
            return "string"
        if (from === gen.ScriptPrimType.Number)
            return "number"
        if (from === gen.ScriptPrimType.Null)
            return "null"
        if (from === gen.ScriptPrimType.Undefined)
            return "undefined"

        const tarr = gen.typeArrOf(from)
        if (tarr)
            return this.typeSpec(tarr) + "[]"

        const tfun = gen.typeFun(from)
        if (tfun && tfun.length && tfun[0])
            return "(" + tfun[0].map(_ => this.typeSpec(_)).join(", ") + ")=>" + (tfun[1] ? this.typeSpec(tfun[1]) : "void")

        let ttup = gen.typeTupOf(from)
        if (ttup && ttup.length)
            return "[" + ttup.map(_ => this.typeSpec(_)).join(', ') + "]"

        let tsum = gen.typeSumOf(from)
        if (tsum && tsum.length)
            return this.parensIfJoin(tsum.map(_ => '(' + this.typeSpec(_) + ')'), '|')

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
