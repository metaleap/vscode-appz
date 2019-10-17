"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_syn = require("./gen-syn");
class Gen extends gen_syn.Gen {
    gen(prep) {
        this.options.oneIndent = "\t";
        this.options.doc.appendArgsToSummaryFor.funcFields = true;
        this.options.doc.appendArgsToSummaryFor.methods = true;
        this.options.idents.curInst = "me";
        this.options.idents.null = "nil";
        this.options.haveProps = false;
        this.options.optionalEnumsZeroNotZilch = true;
        super.gen(prep);
    }
    emitIntro() {
        return this.lines("package " + (this.isDemos ? "main" : "vscAppz"), "// " + this.doNotEditComment("golang"), (this.isDemos ? '\nimport (\n\t. "github.com/metaleap/vscode-appz/libs/go"\n)\n' : ""));
    }
    emitOutro() { return this; }
    emitDocs(it) {
        if (it.Docs && it.Docs.length)
            for (const doc of it.Docs)
                if (doc.Lines && doc.Lines.length)
                    if (!(doc.ForParam && doc.ForParam.length))
                        this.lines(...doc.Lines.map(_ => "// " + _));
        return this;
    }
    emitEnum(it) {
        this.emitDocs(it)
            .line("type " + it.Name + " int")
            .line("const (")
            .indented(() => this.each(it.Enumerants, "\n", e => this.emitDocs(e).line(it.Name + e.Name + " " + it.Name + " = " + e.Value)))
            .lines(")", "");
    }
    emitInterface(it) {
        this.emitDocs(it)
            .line("type " + it.Name + " interface {").indented(() => this.each(it.Methods, "\n", m => emitTypeRet(this.emitDocs(m).lf()
            .s(m.Name)
            .s("(").each(m.Args, ", ", a => this.s(a.Name, " ").emitTypeRef(a.Type))
            .s(") "), m.Type)
            .line()))
            .line("}")
            .when(!it.IsTop, () => this.line("type " + this.options.idents.typeImpl + it.Name + " struct{ *" + this.options.idents.typeImpl + " }"))
            .line("");
    }
    emitStruct(it) {
        this.emitDocs(it)
            .line("type " + it.Name + " struct {").indented(() => this.each(it.Fields.filter(_ => (!_.FuncFieldRel) || _.Type !== gen_syn.TypeRefPrim.String), "\n", f => this.emitDocs(f).ln(() => this.s(f.Name, " ").emitTypeRef(f.Type).when(f.Json, () => this.s(" `json:\"")
            .when(f.Json.Excluded, () => this.s("-"), () => this.s(f.Json.Name + (f.Json.Required ? "" : ",omitempty"))).s("\"`"))))).lines("}", "");
        const fflds = it.Fields.filter(_ => _.FuncFieldRel && _.Type === gen_syn.TypeRefPrim.String);
        if (fflds && fflds.length) {
            it.OutgoingTwin = "_" + it.Name;
            this.line("type " + it.OutgoingTwin + " struct {").indented(() => this.lf().emitTypeRef({ Maybe: it }).line()
                .each(fflds, "", f => this.ln(() => this.s(f.Name, " ").emitTypeRef(f.Type).s(!f.Json ? "" : (" `json:\"" + f.Json.Name + ",omitempty\"`"))))).lines("}", "");
        }
    }
    emitFuncImpl(it) {
        let struct = it.Type, iface = it.Type;
        [struct, iface] = [(struct && struct.Fields) ? struct : null, (iface && iface.Methods) ? iface : null];
        if (struct)
            this.emitDocs(it);
        this.lf("func ", (!(struct || iface)) ? ""
            : ("(" + this.options.idents.curInst + " " + (struct ? ("*" + struct.Name) : iface.IsTop ? ("*" + this.options.idents.typeImpl) : (this.options.idents.typeImpl + iface.Name)) + ") "), it.Name, "(")
            .each(it.Func.Args, ", ", a => this.s(a.Name, " ").emitTypeRef(a.Type)).s(") ").when(it.Func.Type, () => emitTypeRet(this, it.Func.Type).s(" "))
            .emitInstr(it.Func.Body).lines("", "");
    }
    emitInstr(it, inBlock = false) {
        if (it) {
            const ivar = it;
            if (ivar && ivar.Name && ivar.Type)
                return this.ln(() => this.s("var ", ivar.Name, " ").emitTypeRef(ivar.Type));
            const idictdel = it;
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() => this.s("delete(").emitExpr(idictdel.DelFrom).s(", ").emitExpr(idictdel.DelWhat).s(')'));
            const icolladd = it;
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() => this.emitExpr(icolladd.AddTo).s(" = append(").emitExpr(icolladd.AddTo).s(", ").emitExpr(icolladd.AddWhat).s(")"));
            const iblock = it;
            if (iblock && iblock.Instrs !== undefined) {
                let endeol = false;
                if (endeol = iblock.Lock ? true : false)
                    this.ln(() => this.emitExpr(iblock.Lock).s(".Lock()").line().lf("{"));
                else if (endeol = (iblock.ForEach && iblock.ForEach.length) ? true : false)
                    this.ln(() => this.s("for _, ", iblock.ForEach[0].Name, " := range ").emitExpr(iblock.ForEach[1]).s(" {"));
                else if (endeol = (iblock.If && iblock.If.length) ? true : false)
                    this.ln(() => this.s("if ").emitExpr(iblock.If[0]).s(" {"));
                else if (!iblock.Instrs.length)
                    return this;
                else {
                    if (endeol = inBlock)
                        this.lf();
                    this.s("{").line();
                }
                this.indented(() => iblock.Instrs.forEach(_ => this.emitInstr(_, true)));
                this.lf().s("}");
                if (iblock.Lock)
                    this.line().lf().emitExpr(iblock.Lock).s(".Unlock()");
                else if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                    this.s(" else ").emitInstr(iblock.If[1]);
                return endeol ? this.line() : this;
            }
        }
        return super.emitInstr(it, inBlock);
    }
    emitExpr(it) {
        if (it) {
            const ecollnew = it;
            if (ecollnew && (ecollnew.Cap !== undefined || ecollnew.Len !== undefined))
                if (ecollnew.KeyType && ecollnew.ElemType)
                    return this.s("make(map[").emitTypeRef(ecollnew.KeyType).s("]").emitTypeRef(ecollnew.ElemType).s(", ").emitExpr(ecollnew.Cap).s(")");
                else if (!ecollnew.ElemType)
                    return this.s("make(dict, ").emitExpr(ecollnew.Cap).s(")");
                else if (ecollnew.Cap !== undefined)
                    return this.s("make([]").emitTypeRef(ecollnew.ElemType).s(", 0, ").emitExpr(ecollnew.Cap).s(")");
                else if (ecollnew.Len !== undefined)
                    return this.s("make([]").emitTypeRef(ecollnew.ElemType).s(", ").emitExpr(ecollnew.Len).s(")");
                else // newly introduced bug
                    throw ecollnew;
            const enew = it;
            if (enew && enew.New)
                if (this.typeMaybe(enew.New))
                    return this.s("new(").emitTypeRef(typeRefUnMaybe(enew.New)).s(")");
                else
                    return this.s("*/*sorryButSuchIsCodeGenSometimes...*/new(").emitTypeRef(typeRefUnMaybe(enew.New)).s(")");
            const etup = it;
            if (etup && etup.Items !== undefined)
                return this.each(etup.Items, ", ", _ => { this.emitExpr(_); });
            const elen = it;
            if (elen && elen.LenOf)
                return this.s("len(").emitExpr(elen.LenOf).s(")");
            const eop = it;
            if (eop && eop.Name && eop.Operands && eop.Operands.length)
                if (eop.Name === gen_syn.BuilderOperators.Is)
                    return this.s("(nil != ").emitExpr(eop.Operands[0]).s(")");
                else if (eop.Name === gen_syn.BuilderOperators.Isnt)
                    return this.s("(nil == ").emitExpr(eop.Operands[0]).s(")");
                else if (eop.Name === gen_syn.BuilderOperators.Idx || eop.Name === gen_syn.BuilderOperators.IdxMay)
                    return this.emitExpr(eop.Operands[0]).s("[").emitExprs("][", ...eop.Operands.slice(1)).s("]");
            const efn = it;
            if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
                return emitTypeRet(this
                    .s("func(")
                    .each(efn.Args, ", ", _ => this.s(_.Name, " ").emitTypeRef(_.Type))
                    .s(") "), efn.Type).s(efn.Type ? " " : "").emitInstr(efn.Body);
            const elit = it;
            if (elit) {
                const earr = elit.Lit;
                if ((typeof elit.Lit !== 'string') && earr && earr.length !== undefined)
                    return this.s("[]string{").each(earr, ", ", _ => this.emitExpr({ Lit: _ })).s("}");
                if ((typeof elit.Lit === 'string') && elit.FmtArgs && elit.FmtArgs.length)
                    return this.s("strFmt(").emitExpr(this.b.eLit(elit.Lit)).s(", ")
                        .each(elit.FmtArgs, ", ", _ => this.emitExpr(_)).s(")");
            }
            const econv = it;
            if (econv && econv.Conv && econv.To) {
                const tnamed = econv.To;
                return econv.Cast
                    ? this.emitTypeRef(econv.To).s("(").emitExpr(econv.Conv).s(")")
                    : (tnamed && tnamed.Name)
                        ? this.s(tnamed.Name, "{").emitExpr(econv.Conv).s("}")
                        : this.emitExpr(econv.Conv).s(".(").emitTypeRef(econv.To).s(")");
            }
        }
        return super.emitExpr(it);
    }
    emitTypeRef(it) {
        if (it === null)
            return this;
        const ttup = this.typeTup(it);
        if (ttup) // until multi-typed tuples arrive for real..
            return this.s("[]").emitTypeRef(ttup.TupOf[0]);
        const tmay = this.typeMaybe(it);
        if (tmay) {
            const tnamed = this.typeOwn(tmay.Maybe);
            const tenum = (tnamed && tnamed.Name && tnamed.Name.length) ? this.allEnums.find(_ => _.Name === tnamed.Name) : null;
            return this.s(tenum || typeRefNilable(this, tmay.Maybe) ? "" : "*").emitTypeRef(tmay.Maybe);
        }
        const tcoll = this.typeColl(it);
        if (tcoll)
            return (!tcoll.KeysOf) ? this.s("[]").emitTypeRef(tcoll.ValsOf)
                : this.s("map[").emitTypeRef(tcoll.KeysOf).s("]").emitTypeRef(tcoll.ValsOf);
        const tfun = this.typeFunc(it);
        if (tfun)
            return this.s("func(").each(tfun.From, ", ", t => this.emitTypeRef(t)).s(tfun.To ? ") " : ")").emitTypeRef(tfun.To);
        if (it === gen_syn.TypeRefPrim.Real)
            return this.s("float64");
        return super.emitTypeRef(it);
    }
    typeRefForField(it, optional) {
        return typeRefUnMaybe(it, true, optional, optional);
    }
}
exports.Gen = Gen;
function emitTypeRet(_, it) {
    const ttup = _.typeTup(it);
    if (ttup)
        return _.s("(").each(ttup.TupOf, ", ", t => _.emitTypeRef(t)).s(")");
    return _.emitTypeRef(it);
}
function typeRefNilable(_, it, forceTrueForBools = false, forceTrueForNums = false, forceTrueForStrings = false) {
    return it === gen_syn.TypeRefPrim.Any || it === gen_syn.TypeRefPrim.Dict
        || _.typeColl(it) || _.typeMaybe(it) || _.typeFunc(it) || _.typeTup(it)
        || (forceTrueForBools && it === gen_syn.TypeRefPrim.Bool)
        || (forceTrueForNums && (it === gen_syn.TypeRefPrim.Int || it === gen_syn.TypeRefPrim.Real))
        || (forceTrueForStrings && it === gen_syn.TypeRefPrim.String);
}
function typeRefUnMaybe(it, unMaybeBools = true, unMaybeNums = true, unMaybeStrings = true) {
    const tmay = it;
    if (tmay && tmay.Maybe
        && (tmay.Maybe !== gen_syn.TypeRefPrim.String || unMaybeStrings)
        && (tmay.Maybe !== gen_syn.TypeRefPrim.Bool || unMaybeBools)
        && ((tmay.Maybe !== gen_syn.TypeRefPrim.Int && tmay.Maybe !== gen_syn.TypeRefPrim.Real) || unMaybeNums))
        return typeRefUnMaybe(tmay.Maybe, unMaybeBools, unMaybeNums, unMaybeStrings);
    return it;
}
