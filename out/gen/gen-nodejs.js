"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_ast = require("./gen-ast");
let prevImplTypeName;
class Gen extends gen_ast.Gen {
    gen(prep) {
        this.options.oneIndent = " ".repeat(4);
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = false;
        this.options.funcOverloads = false;
        this.nameRewriters.types.interfaces = _ => this.caseUp(_);
        prevImplTypeName = "";
        super.gen(prep);
    }
    emitIntro() {
        return this.lines("// " + this.doNotEditComment("nodesjs"), "import { ipcMsg } from './aux'\n\n", "", "class implBase {", "    impl: impl", "    constructor(impl: impl) { this.impl = impl }", "    send(msg: ipcMsg, on: (_: any) => boolean) { this.impl.send(msg, on) }", "}", "");
    }
    emitOutro() { return this; }
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
    emitStruct(it) {
        this.emitDocs(it)
            .line("export interface " + it.Name + " {").indented(() => {
            this.each(it.Fields, "\n", f => this.emitDocs(f)
                .ln(() => {
                this.s(f.Json.Name ? f.Json.Name : f.Name)
                    .s((f.fromPrep && f.fromPrep.optional) ? "?: " : ": ")
                    .emitTypeRef(f.Type);
            }));
        })
            .lines("}", "");
    }
    onBeforeEmitImpls() {
        const itop = this.allInterfaces.find(_ => _.IsTop);
        this
            .line("export abstract class impl implements " + itop.Name + " {")
            .indented(() => {
            for (const iface of this.allInterfaces)
                if (iface !== itop)
                    this.line(iface.Name + ": " + iface.Name);
            this.line("constructor() {").indented(() => {
                for (const iface of this.allInterfaces)
                    if (iface !== itop)
                        this.line(`this.${iface.Name} = new impl${iface.Name}(this)`);
            }).lines("}", "abstract send(msg: ipcMsg, on: (_: any) => boolean): void");
        })
            .lines("}", "");
    }
    onAfterEmitImpls() {
        if (prevImplTypeName && prevImplTypeName.length)
            this.undent().lines("}", "");
    }
    emitMethodImpl(it, method, fillBody) {
        if (it === this.allInterfaces[0])
            return;
        if (it.Name !== prevImplTypeName) {
            if (prevImplTypeName && prevImplTypeName.length)
                this.lines("}", "");
            prevImplTypeName = it.Name;
            this.line("class impl" + it.Name + " extends implBase implements " + it.Name + " {")
                .indent()
                .line("constructor(impl: impl) { super(impl) }");
        }
        super.emitMethodImpl(it, method, fillBody);
    }
    emitFuncImpl(it) {
        super.emitFuncImpl(it);
    }
    emitExpr(it) {
        if (it) {
            const ecollnew = it;
            if (ecollnew && (ecollnew.Cap !== undefined || ecollnew.Len !== undefined))
                return this.s(ecollnew.ElemType ? "[]" : "{}");
            const enew = it;
            if (enew && enew.New)
                return this.s("new ").emitTypeRef(enew.New).s("()");
            const econv = it;
            if (econv && econv.Conv && econv.To)
                return this.emitExpr(econv.Conv);
            const elen = it;
            if (elen && elen.LenOf)
                return this.emitExpr(elen.LenOf).s(".length");
            const eop = it;
            if (eop && eop.Name && eop.Operands && eop.Operands.length)
                if (eop.Name === gen_ast.BuilderOperators.Is)
                    return this.s("(undefined !== ").emitExpr(eop.Operands[0]).s(" && null !== ").emitExpr(eop.Operands[0]).s(")");
                else if (eop.Name === gen_ast.BuilderOperators.Isnt)
                    return this.s("(undefined === ").emitExpr(eop.Operands[0]).s(" || null === ").emitExpr(eop.Operands[0]).s(")");
                else if (eop.Name === gen_ast.BuilderOperators.Addr || eop.Name === gen_ast.BuilderOperators.Deref)
                    return this.emitExpr(eop.Operands[0]);
                else if (eop.Name === gen_ast.BuilderOperators.Idx || eop.Name === gen_ast.BuilderOperators.IdxMay)
                    return this.emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]");
            const efn = it;
            if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
                return this
                    .s("(")
                    .each(efn.Args, ", ", _ => this.s(_.Name, (_.fromPrep && _.fromPrep.optional) ? "?: " : ": ")
                    .emitTypeRef(_.Type))
                    .s("): ").emitTypeRef(efn.Type).s(" ")
                    .emitInstr(efn.Body);
        }
        return super.emitExpr(it);
    }
    emitInstr(it) {
        if (it) {
            const ivar = it;
            if (ivar && ivar.Name && ivar.Type)
                return this.ln(() => this.s("let ", ivar.Name, ": ").emitTypeRef(ivar.Type));
            const idictdel = it;
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() => this.s("delete ").emitExpr(idictdel.DelFrom).s("[").emitExpr(idictdel.DelWhat).s("]"));
            const icolladd = it;
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() => this.emitExpr(icolladd.AddTo).s('.push(').emitExpr(icolladd.AddWhat).s(')'));
            const iblock = it;
            if (iblock && iblock.Instrs !== undefined) {
                let endeol = false;
                if (endeol = iblock.Lock ? true : false)
                    this.ln(() => this.s("{"));
                else if (endeol = (iblock.ForEach && iblock.ForEach.length) ? true : false)
                    this.ln(() => this.s("for (const ", iblock.ForEach[0].Name, " of ").emitExpr(iblock.ForEach[1]).s(") {"));
                else if (endeol = (iblock.If && iblock.If.length) ? true : false)
                    this.ln(() => this.s("if (").emitExpr(iblock.If[0]).s(") {"));
                else
                    this.s("{").line();
                this.indented(() => iblock.Instrs.forEach(_ => this.emitInstr(_)));
                this.lf().s("}");
                if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                    this.s(" else ").emitInstr(iblock.If[1]).lf();
                return endeol ? this.line() : this;
            }
        }
        return super.emitInstr(it);
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
