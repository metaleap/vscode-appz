"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
class Gen extends gen_ast.Gen {
    gen(prep) {
        this.options.oneIndent = " ".repeat(4);
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = false;
        this.options.funcOverloads = false;
        this.nameRewriters.types.interfaces = _ => this.caseUp(_);
        super.gen(prep);
    }
    emitIntro() {
        return this
            .s("// ", this.doNotEditComment("nodesjs"), "\n")
            .s("import { ipcMsg } from './aux'\n\n")
            .s("");
    }
    emitOutro() {
        return this
            .s("class implBase {\n")
            .s("    impl: impl\n")
            .s("    constructor(impl: impl) { this.impl = impl }\n")
            .s("    send(msg: ipcMsg, on: (_: any) => boolean) { this.impl.send(msg, on) }\n")
            .s("}\n");
    }
    emitDocs(it) {
        if (it.Docs && it.Docs.length) {
            this.line("/**");
            for (const doc of it.Docs)
                if (doc.Lines && doc.Lines.length)
                    if (!(doc.ForParam && doc.ForParam.length))
                        this.lines(...doc.Lines.map(_ => " * " + _)).line();
                    else
                        this.line(" * @" + (doc.ForParam === "return" ? "" : "param ") + doc.ForParam + " " + doc.Lines.join(" "));
            this.line(" */");
        }
        return this;
    }
    emitEnum(it) {
        this.emitDocs(it)
            .line("export enum " + it.Name + " {")
            .indented(() => this.each(it.Enumerants, "\n", e => this.emitDocs(e).line(e.Name + " = " + e.Value + ",")))
            .lines("}", "");
    }
    emitInterface(it) {
        this.emitDocs(it)
            .line("export interface " + it.Name + " {").indented(() => {
            this.each(it.Methods, "\n", m => this.emitDocs(m).lf()
                .s(m.Name)
                .when(m.Args && m.Args.length, () => {
                this.s(": (")
                    .each(m.Args, ", ", a => this.s(a.Name)
                    .s((a.fromPrep && a.fromPrep.optional) ? "?: " : ": ")
                    .emitTypeRef(a.Type))
                    .s(") => ").emitTypeRef(m.Type);
            }, () => this.s(": ").emitTypeRef(m.Type))
                .line());
        })
            .lines("}", "");
    }
    emitTypeRef(it) {
        const tmay = this.typeMaybe(it);
        if (tmay)
            return this.emitTypeRef(tmay.Maybe);
        const tcoll = this.typeColl(it);
        if (tcoll)
            return (!tcoll.KeysOf) ? this.emitTypeRef(tcoll.ValsOf).s("[]")
                : this.s("{ [_:").emitTypeRef(tcoll.KeysOf).s("]: ").emitTypeRef(tcoll.ValsOf).s("}");
        const ttup = this.typeTup(it);
        if (ttup)
            return this.s("[").each(ttup.TupOf, ", ", t => this.emitTypeRef(t)).s("]");
        const tfun = this.typeFunc(it);
        if (tfun)
            return this.s("(")
                .each(tfun.From, ", ", t => this.s("_").s(": ").emitTypeRef(t))
                .s(") => ").emitTypeRef(tfun.To);
        if (it === gen_ast.TypeRefPrim.Real || it === gen_ast.TypeRefPrim.Int)
            return this.s("number");
        if (it === gen_ast.TypeRefPrim.Bool)
            return this.s("boolean");
        if (it === gen_ast.TypeRefPrim.Dict)
            return this.s("{ [_:string]:any}");
        return super.emitTypeRef(it);
    }
}
exports.Gen = Gen;
