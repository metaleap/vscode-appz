"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-basics");
class Gen extends gen.Gen {
    gen(prep) {
        const pkgname = prep.fromOrig.moduleName;
        let src = "// " + this.doNotEditComment("vscext") + "\n\n";
        src += "import * as node_proc from 'child_process'\n";
        src += "import * as vscode from 'vscode'\n\n";
        src += "import * as ipc from './ipcprotocol'\n";
        src += "import * as ppio from './procspipeio'\n\n";
        for (const it of prep.enums)
            src += "type " + it.name + " = vscode." + it.name + "\n";
        for (const it of prep.structs) {
            const fieldsextra = it.fields.filter(_ => _.isExtBaggage);
            if ((it.funcFields && it.funcFields.length) || (fieldsextra && fieldsextra.length)) {
                src += "interface " + it.name + " extends vscode." + it.name + " {\n";
                for (const f of fieldsextra)
                    src += `\t${f.name + (f.optional ? '?' : '')}: ${this.typeSpec(f.typeSpec)}\n`;
                for (const ff of it.funcFields)
                    src += `\t${ff}_AppzFuncId: string\n`;
                src += "}\n";
            }
            else
                src += "type " + it.name + " = vscode." + it.name + "\n";
        }
        src += "\nexport function handle(msg: ipc.MsgFromApp, proc: node_proc.ChildProcess): Thenable<any> {\n";
        src += "\tswitch (msg.ns) {\n";
        for (const it of prep.interfaces) {
            src += `\t\tcase "${it.name}":\n`;
            src += "\t\t\tswitch (msg.name) {\n";
            for (const method of it.methods) {
                src += `\t\t\t\tcase "${method.name}": {\n`;
                const lastarg = method.args[method.args.length - 1];
                for (const arg of method.args)
                    if (arg !== lastarg) {
                        src += `\t\t\t\t\tconst arg_${arg.name} = (msg.payload['${arg.name}']${(gen.typeArrOf(arg.typeSpec) || gen.typeTupOf(arg.typeSpec)) ? ' || []' : ''}) as ${this.typeSpec(arg.typeSpec)}\n`;
                        const struct = prep.structs.find(_ => _.name === arg.typeSpec);
                        if (struct && struct.funcFields && struct.funcFields.length)
                            for (const ff of struct.funcFields) {
                                const tfn = gen.typeFun(struct.fields.find(_ => _.name === ff).typeSpec);
                                if (tfn && tfn.length) {
                                    src += `\t\t\t\t\tif (arg_${arg.name}.${ff}_AppzFuncId && arg_${arg.name}.${ff}_AppzFuncId.length)\n`;
                                    src += `\t\t\t\t\t\targ_${arg.name}.${ff} = (${tfn[0].map((_, idx) => 'a' + idx).join(', ')}) => ppio.callBack(proc, arg_${arg.name}.${ff}_AppzFuncId, ${tfn[0].map((_, idx) => 'a' + idx).join(', ')})\n`;
                                }
                            }
                    }
                src += `\t\t\t\t\treturn ${method.fromOrig.qName}(`;
                for (const arg of method.args)
                    if (arg !== lastarg)
                        src += (arg.spreads ? '...' : '') + `arg_${arg.name}, `;
                src += ")\n\t\t\t\t}\n";
            }
            src += "\t\t\t\tdefault:\n";
            src += "\t\t\t\t\tthrow (msg.name)\n";
            src += "\t\t\t}\n";
        }
        src += "\t\tdefault:\n";
        src += "\t\t\tthrow (msg.ns)\n";
        src += "\t}\n";
        src += "}\n\n";
        this.writeFileSync(pkgname, src);
    }
    typeSpec(from, intoProm = false) {
        if (!from)
            return "undefined";
        if (from === gen.ScriptPrimType.Any)
            return "any";
        if (from === gen.ScriptPrimType.Boolean)
            return "boolean";
        if (from === gen.ScriptPrimType.String)
            return "string";
        if (from === gen.ScriptPrimType.Number)
            return "number";
        if (from === gen.ScriptPrimType.Null)
            return "null";
        if (from === gen.ScriptPrimType.Undefined)
            return "undefined";
        if (from === gen.ScriptPrimType.Dict)
            return "{ [_:string]: any }";
        const tarr = gen.typeArrOf(from);
        if (tarr)
            return this.typeSpec(tarr) + "[]";
        const tfun = gen.typeFun(from);
        if (tfun && tfun.length && tfun[0])
            return "(" + tfun[0].map(_ => this.typeSpec(_)).join(", ") + ")=>" + (tfun[1] ? this.typeSpec(tfun[1]) : "void");
        let ttup = gen.typeTupOf(from);
        if (ttup && ttup.length)
            return "[" + ttup.map(_ => this.typeSpec(_)).join(', ') + "]";
        let tsum = gen.typeSumOf(from);
        if (tsum && tsum.length)
            return this.parensIfJoin(tsum.map(_ => '(' + this.typeSpec(_) + ')'), '|');
        const tprom = gen.typeProm(from);
        if (tprom && tprom.length)
            if (tprom.length > 1)
                throw (from);
            else if (intoProm)
                return this.typeSpec(tprom[0]);
            else
                return "Thenable<" + this.typeSpec(tprom[0]) + ">";
        if (typeof from === 'string')
            return from;
        return "any";
    }
}
exports.Gen = Gen;
