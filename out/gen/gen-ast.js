"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_util = require("util");
const gen = require("./gen-basics");
var TypeRefPrim;
(function (TypeRefPrim) {
    TypeRefPrim[TypeRefPrim["Bool"] = 124] = "Bool";
    TypeRefPrim[TypeRefPrim["Int"] = 136] = "Int";
    TypeRefPrim[TypeRefPrim["String"] = 139] = "String";
    TypeRefPrim[TypeRefPrim["Dict"] = 189] = "Dict";
})(TypeRefPrim = exports.TypeRefPrim || (exports.TypeRefPrim = {}));
class Builder {
    constructor(prep, gen) { [this.prep, this.gen] = [prep, gen]; }
    iRet(ret) { return { Ret: ret }; }
    iVar(varName, varType) { return { Name: varName, Type: varType }; }
    iSet(setWhat, setTo) { return { SetWhat: setWhat, SetTo: setTo }; }
    iDel(delFrom, delWhat) { return { DelFrom: delFrom, DelWhat: delWhat }; }
    iBlock(...instrs) { return { Instrs: instrs }; }
    iLock(lock, ...instrs) { return { Lock: lock, Instrs: instrs }; }
    iIf(ifCond, thenInstrs, elseInstrs = undefined) { return { Instrs: thenInstrs, If: [ifCond, { Instrs: elseInstrs }] }; }
    iFor(iterVarName, iterable, ...instrs) { return { Instrs: instrs, ForEach: [iterVarName, iterable] }; }
    eNew(typeRef) { return { New: typeRef }; }
    eConv(typeRef, conv) { return { Conv: conv, To: typeRef }; }
    eLen(lenOf) { return { LenOf: lenOf }; }
    eCollNew(cap, listElemType = undefined) { return { ElemTypeIfList: listElemType, Capacity: cap }; }
    eFunc(args, retType, ...instrs) { return { Args: args, Type: retType, Body: { Instrs: instrs } }; }
    eCall(callee, ...args) { return { Call: callee, Args: args }; }
    n(name) { return { Name: name }; }
    eLit(litVal) { return { Lit: litVal }; }
    eNil() { return this.eLit(null); }
    eThis() { return this.n(null); }
    eOp(op, ...args) { return { Name: op, Operands: args }; }
    oDot(...args) { return this.eOp('.', ...args); }
    oIdx(...args) { return this.eOp('@', ...args); }
    oEq(...args) { return this.eOp('==', ...args); }
    oNeq(...args) { return this.eOp('!=', ...args); }
    oOr(...args) { return this.eOp('||', ...args); }
    oAnd(...args) { return this.eOp('&&', ...args); }
    oNot(arg) { return this.eOp("!", arg); }
    each(from, fn) {
        const me = [];
        for (const it of from)
            me.push(...fn(it));
        return me;
    }
    let(value, andThen) {
        return andThen(value);
    }
    lets(values, andThen) {
        return andThen(...values);
    }
    enumFrom(it) {
        return {
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.enums(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Enumerants: it.enumerants.map((_) => ({
                fromPrep: _,
                name: _.name,
                Name: this.gen.nameRewriters.enumerants(_.name),
                Docs: this.docs(gen.docs(_.fromOrig)),
                Value: _.value,
            })),
        };
    }
    interfaceFrom(it) {
        return {
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.interfaces(it.name),
            Docs: this.docs(gen.docs(it.fromOrig)),
            Methods: it.methods.map((_) => ({
                fromPrep: _,
                name: _.nameOrig,
                Name: this.gen.nameRewriters.methods(_.name),
                Docs: this.docs(gen.docs(_.fromOrig.decl, () => _.args.find(arg => arg.isFromRetThenable)), undefined, true, this.gen.options.doc.appendArgsToSummaryFor.methods),
                Type: null,
                Args: _.args.map((arg) => ({
                    fromPrep: arg,
                    name: arg.name,
                    Name: this.gen.nameRewriters.args(arg.name),
                    Docs: this.docs(gen.docs(arg.fromOrig)),
                    Type: this.typeRef(arg.typeSpec, arg.optional),
                })),
            })),
        };
    }
    structFrom(it) {
        let ret = {
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.structs(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Fields: it.fields.map((_) => ({
                fromPrep: _,
                name: _.name,
                Name: this.gen.nameRewriters.fields(_.name),
                Docs: this.docs(gen.docs(_.fromOrig), _.isExtBaggage ? [gen.docStrs.extBaggage] : [], false, this.gen.options.doc.appendArgsToSummaryFor.funcFields),
                Type: this.typeRef(_.typeSpec, _.optional),
                Json: { Name: _.name, Required: !_.optional, Excluded: it.funcFields.some(ff => _.name === ff) },
            }))
        };
        for (const ff of it.funcFields) {
            const ffname = this.gen.nameRewriters.fields(ff);
            const fldfn = ret.Fields.find(_ => _.Name === ffname);
            fldfn.FuncFieldRel = {
                Name: ffname + "_AppzFuncId",
                Docs: this.docs(null, [gen.docStrs.internalOnly]),
                Type: TypeRefPrim.String,
                Json: { Name: ff + "_AppzFuncId", Required: false, Excluded: false },
                FuncFieldRel: fldfn,
            };
            ret.Fields.push(fldfn.FuncFieldRel);
        }
        return ret;
    }
    typeRefEnsureMaybe(of) {
        let maybe = of;
        if (!(maybe && maybe.Maybe))
            maybe = { Maybe: of };
        return maybe;
    }
    typeRef(it, needMaybe = false, intoProm = false) {
        if (!it)
            return null;
        if (needMaybe)
            return this.typeRefEnsureMaybe(this.typeRef(it, false, intoProm));
        if (it === gen.ScriptPrimType.Boolean)
            return TypeRefPrim.Bool;
        if (it === gen.ScriptPrimType.Number)
            return TypeRefPrim.Int;
        if (it === gen.ScriptPrimType.String)
            return TypeRefPrim.String;
        if (it === gen.ScriptPrimType.Dict)
            return TypeRefPrim.Dict;
        if (it === gen.ScriptPrimType.Any)
            return { Name: this.gen.options.idents.typeAny };
        const tarr = gen.typeArrOf(it);
        if (tarr)
            return { ArrOf: this.typeRef(tarr), AsList: false };
        const ttup = gen.typeTupOf(it);
        if (ttup && ttup.length)
            return { TupOf: ttup.map(_ => this.typeRef(_)) };
        const tfun = gen.typeFun(it);
        if (tfun && tfun.length)
            return { From: tfun[0].map(_ => this.typeRef(_)), To: this.typeRef(tfun[1]) };
        let tsum = gen.typeSumOf(it);
        if (tsum && tsum.length) {
            let hadoptional = false;
            tsum = tsum.filter(_ => {
                const optional = (_ === gen.ScriptPrimType.Undefined || _ === gen.ScriptPrimType.Null);
                hadoptional = hadoptional || optional;
                return (!optional) && !gen.typeProm(_);
            });
            if (tsum.length !== 1)
                throw it;
            let ret = this.typeRef(tsum[0]);
            return ret;
        }
        const tprom = gen.typeProm(it);
        if (tprom && tprom.length)
            if (tprom.length > 1)
                throw it;
            else if (intoProm)
                return this.typeRef(tprom[0]);
            else
                return { From: tprom.map(_ => this.typeRef(_)), To: null };
        if (typeof it === 'string')
            return { Name: it };
        throw it;
    }
    docs(docs, extraSummaryLines = undefined, isMethod = false, appendArgsAndRetsToSummaryToo = true, retNameFallback = "return", into = undefined) {
        const istop = (into === undefined);
        if (istop)
            into = [];
        if (docs && docs.length)
            for (const doc of docs) {
                if (doc.lines && doc.lines.length) {
                    let name = doc.isForArg;
                    if ((!(name && name.length)) && doc.isForRet !== null && doc.isForRet !== undefined)
                        name = (doc.isForRet && doc.isForRet.length) ? doc.isForRet : retNameFallback;
                    if (!name)
                        name = '';
                    let dst = into.find(_ => _.ForParam === name);
                    if (isMethod || !(name && name.length)) {
                        if (!dst)
                            into.push(dst = { ForParam: name, Lines: [] });
                        dst.Lines.push(...doc.lines);
                    }
                    if (name && name.length && appendArgsAndRetsToSummaryToo && (dst = into.find(_ => _.ForParam === '')))
                        dst.Lines.push('', ...doc.lines.map((ln, idx) => ((idx) ? ln : gen.docPrependArgOrRetName(doc, ln, "return", this.gen.nameRewriters.args))));
                }
                if (doc.subs && doc.subs.length)
                    this.docs(doc.subs, undefined, isMethod, appendArgsAndRetsToSummaryToo, retNameFallback, into);
            }
        if (istop && extraSummaryLines && extraSummaryLines.length) {
            let dst = into.find(_ => _.ForParam === '');
            if (!dst)
                into.push(dst = { ForParam: '', Lines: [] });
            dst.Lines.push(...extraSummaryLines);
        }
        return into;
    }
}
exports.Builder = Builder;
class Gen extends gen.Gen {
    constructor() {
        super(...arguments);
        this.src = '';
        this.indent = 0;
        this.b = null;
        this.nameRewriters = {
            args: this.caseLo,
            fields: this.caseUp,
            methods: this.caseUp,
            enumerants: this.caseUp,
            types: { enums: this.caseUp, structs: this.caseUp, interfaces: this.caseUp },
        };
        this.options = {
            doc: {
                appendArgsToSummaryFor: {
                    methods: false,
                    funcFields: true,
                }
            },
            idents: {
                curInst: "$",
                typeAny: "Any",
            }
        };
        this.indented = (andThen) => {
            this.indent++;
            andThen();
            this.indent--;
            return this;
        };
        this.ln = (andThen) => {
            this.src += "\t".repeat(this.indent);
            andThen();
            this.src += "\n";
            return this;
        };
        this.line = (srcLn = '') => this.lines(srcLn);
        this.lines = (...srcLns) => {
            for (const srcln of srcLns)
                this.src += ((srcln && srcln.length) ? ("\t".repeat(this.indent) + srcln) : '') + "\n";
            return this;
        };
        this.s = (...s) => {
            for (const str of s)
                this.src += str;
            return this;
        };
        this.emitDocs = (it) => {
            if (it.name && it.Name && it.name !== it.Name)
                this.line("# " + it.name + ":");
            for (const doc of it.Docs) {
                if (doc.ForParam && doc.ForParam.length)
                    this.lines('#', "# @" + doc.ForParam + ":");
                for (const docln of doc.Lines)
                    this.line("# " + docln);
            }
            return this;
        };
        this.emitEnum = (it) => {
            this.lines('', '')
                .emitDocs(it)
                .line(it.Name + ": enum")
                .indented(() => it.Enumerants.forEach(_ => this.line()
                .emitDocs(_)
                .line(`${_.Name}: ${_.Value}`)))
                .lines('', '');
        };
        this.emitInterface = (it) => {
            this.lines('', '')
                .emitDocs(it)
                .line(it.Name + ": iface")
                .indented(() => it.Methods.forEach(_ => {
                this.line()
                    .emitDocs(_)
                    .ln(() => this.s(_.Name, ': ').emitTypeRef(_.Type))
                    .indented(() => _.Args.forEach(arg => this.ln(() => this.s(arg.Name, ': ').emitTypeRef(arg.Type).s((arg.name === arg.Name) ? '' : (' # ' + arg.name)))));
            })).lines('', '');
        };
        this.emitStruct = (it) => {
            this.lines('', '')
                .emitDocs(it)
                .line(it.Name + ": struct")
                .indented(() => it.Fields.forEach(_ => {
                this.line()
                    .emitDocs(_)
                    .lines('#', `# JSON FLAGS: ${JSON.stringify(_.Json)}`)
                    .ln(() => this.s(_.Name, ': ').emitTypeRef(_.Type));
            })).lines('', '');
        };
        this.emitTypeRef = (it) => {
            if (it === null)
                return this.s("void");
            if (it === TypeRefPrim.Bool)
                return this.s("bool");
            if (it === TypeRefPrim.Int)
                return this.s("int");
            if (it === TypeRefPrim.String)
                return this.s("string");
            if (it === TypeRefPrim.Dict)
                return this.s("[string:", this.options.idents.typeAny, "]");
            const tname = it;
            if (tname && tname.Name && tname.Name.length)
                return this.s(tname.Name);
            const ttup = it;
            if (ttup && ttup.TupOf && ttup.TupOf.length)
                return this.s("[").each(ttup.TupOf, ',', _ => this.emitTypeRef(_)).s(']');
            const tarr = it;
            if (tarr && tarr.ArrOf)
                return this.s('[').emitTypeRef(tarr.ArrOf).s(']');
            const tfun = it;
            if (tfun && tfun.From && tfun.From.length)
                return this.s('(').each(tfun.From, '->', _ => this.emitTypeRef(_)).s('->').emitTypeRef(tfun.To).s(')');
            const tmay = it;
            if (tmay && tmay.Maybe)
                return this.s('?').emitTypeRef(tmay.Maybe);
            throw it;
        };
        this.emitFuncImpl = (it) => {
            this.lines('', '')
                .ln(() => this.emitTypeRef(it.Type).s(it.Name, ': (').each(it.Func.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type)).s(' -> ').emitTypeRef(it.Func.Type).s(')'))
                .emitInstr(it.Func.Body)
                .lines('', '');
        };
    }
    each(arr, joinBy, andThen) {
        for (let i = 0; i < arr.length; i++) {
            if (i > 0)
                this.s(joinBy);
            andThen(arr[i]);
        }
        return this;
    }
    when(check, ifTrue, ifFalse) {
        if (check)
            ifTrue();
        else
            ifFalse();
        return this;
    }
    emitMethodImpl(iface, method, isMainInterface) {
        const _ = this.b, me = {
            name: method.name, Name: method.Name, Type: iface, Func: {
                Args: method.Args, Type: method.Type, Body: { Instrs: [] }
            }
        };
        const body = me.Func.Body.Instrs;
        if (isMainInterface)
            body.push(_.iRet(_.n(this.options.idents.curInst)));
        else {
            const __ = gen.idents(method.fromPrep.args, 'msg', 'on', 'fn', 'fnid', 'fnids', 'payload', 'result', 'resultptr');
            const funcfields = gen.argsFuncFields(_.prep, method.fromPrep.args);
            const numargs = method.fromPrep.args.filter(_ => !_.isFromRetThenable).length;
            body.push(_.iVar(__.msg, _.n('ipcMsg')), _.iSet(_.n(__.msg), _.eNew(_.n('ipcMsg'))), _.iSet(_.oDot(_.n(__.msg), _.n('QName')), _.eLit(iface.name + '.' + method.fromPrep.name)), _.iSet(_.oDot(_.n(__.msg), _.n('Data')), _.eCollNew(_.eLit(numargs))));
            if (funcfields.length)
                body.push(_.iVar(__.fnids, { ArrOf: TypeRefPrim.String, AsList: true }), _.iSet(_.n(__.fnids), _.eCollNew(_.eLit(funcfields.length), TypeRefPrim.String)), _.iLock(_.eThis(), ..._.each(funcfields, ff => [
                    _.let(this.nameRewriters.args(ff.arg.name), argname => _.let(this.nameRewriters.fields(ff.name), fld => _.iIf((!ff.arg.optional) ? _.eNil() : _.oNeq(_.n(argname), _.eNil()), [
                        _.iSet(_.oDot(_.n(argname), _.n(fld + '_AppzFuncId')), _.eLit("")),
                    ]))),
                ])));
            for (const arg of method.Args)
                if (!arg.fromPrep.isFromRetThenable)
                    body.push(_.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n('Data')), _.eLit(arg.name)), arg));
            const lastarg = method.Args[method.Args.length - 1];
            body.push(_.iVar(__.on, { From: [_.n(this.options.idents.typeAny)], To: TypeRefPrim.Bool }));
            if (lastarg.fromPrep.isFromRetThenable)
                body.push(_.iIf(_.oNeq(_.n(lastarg.Name), _.eNil()), [
                    _.iSet(_.n(__.on), _.eFunc([{ Name: __.payload, Type: _.n(this.options.idents.typeAny) }], TypeRefPrim.Bool, _.iRet(_.eLit(true)))),
                ]));
            if (!funcfields.length)
                body.push(_.eCall(_.oDot(_.eThis(), _.n('send')), _.n(__.msg), _.n(__.on)));
            else
                body.push(_.eCall(_.oDot(_.eThis(), _.n('send')), _.n(__.msg), _.eFunc([{ Name: __.payload, Type: _.n(this.options.idents.typeAny) }], TypeRefPrim.Bool, _.iIf(_.oNeq(_.eLen(_.n(__.fnids)), _.eLit(0)), [
                    _.iLock(_.eThis(), _.iFor(_.n(__.fnid), _.n(__.fnids), _.iDel(_.oDot(_.eThis(), _.n('cbOther')), _.n(__.fnid)))),
                ]), _.iRet(_.oOr(_.oEq(_.n(__.on), _.eNil()), _.eCall(_.n(__.on), _.n(__.payload)))))));
        }
        this.emitFuncImpl(me);
    }
    emitInstr(it) {
        if (it) {
            const iret = it;
            if (iret && iret.Ret !== undefined)
                return this.ln(() => this.s("ret ").emitExpr(iret.Ret === null ? undefined : iret.Ret));
            const ivar = it;
            if (ivar && ivar.Name)
                return this.ln(() => this.s(ivar.Name, ": ").emitTypeRef(ivar.Type));
            const iset = it;
            if (iset && iset.SetWhat && iset.SetTo)
                return this.ln(() => this.emitExpr(iset.SetWhat).s(" = ").emitExpr(iset.SetTo));
            const idictdel = it;
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() => this.emitExpr(idictdel.DelFrom).s('·del(').emitExpr(idictdel.DelWhat).s(')'));
            const iblock = it;
            if (iblock && iblock.Instrs !== undefined) {
                if (iblock.Lock)
                    this.ln(() => this.emitExpr(iblock.Lock).s("·lock"));
                else if (iblock.ForEach && iblock.ForEach.length)
                    this.ln(() => this.s("for ", iblock.ForEach[0].Name, " in ").emitExpr(iblock.ForEach[1]));
                else if (iblock.If && iblock.If.length)
                    this.ln(() => this.s("if ").emitExpr(iblock.If[0]));
                this.indented(() => iblock.Instrs.forEach(_ => this.emitInstr(_)));
                if (iblock.If && iblock.If.length > 1 && iblock.If[1] && iblock.If[1].Instrs && iblock.If[1].Instrs.length)
                    this.line("else")
                        .emitInstr(iblock.If[1]);
                return this;
            }
            const ecall = it;
            if (ecall && ecall.Call)
                return this.ln(() => this.emitExpr(ecall));
            throw "<instr>" + JSON.stringify(it);
        }
        return this;
    }
    emitExprs(joinBy, ...arr) {
        return this.each(arr, joinBy, (_) => this.emitExpr(_));
    }
    emitExpr(it) {
        if (it === undefined)
            return this;
        if (it === null)
            return this.s('null');
        const elit = it;
        if (elit && elit.Lit !== undefined)
            return this.s(node_util.format("%j", elit.Lit));
        const ecollnew = it;
        if (ecollnew && ecollnew.Capacity !== undefined)
            return this.when(ecollnew.ElemTypeIfList, () => this.s('[').emitTypeRef(ecollnew.ElemTypeIfList).s(']'), () => this.s('dict')).s('·new(').emitExpr(ecollnew.Capacity).s(')');
        const enew = it;
        if (enew && enew.New)
            return this.emitTypeRef(enew.New).s("·new");
        const econv = it;
        if (econv && econv.Conv && econv.To)
            return this.s('((').emitTypeRef(econv.To).s(')(').emitExpr(econv.Conv).s('))');
        const elen = it;
        if (elen && elen.LenOf)
            return this.emitExpr(elen.LenOf).s("·len");
        const ecall = it;
        if (ecall && ecall.Call)
            return this.emitExpr(ecall.Call).s("(").emitExprs(', ', ...ecall.Args).s(")");
        const eop = it;
        if (eop && eop.Name && eop.Operands && eop.Operands.length) {
            const notactualoperator = (eop.Name === '@' || eop.Name === '.');
            return this
                .s((notactualoperator ? '' : '(')
                + ((eop.Operands.length > 1) ? '' : eop.Name))
                .emitExprs(notactualoperator ? eop.Name : (' ' + eop.Name + ' '), ...eop.Operands)
                .s(notactualoperator ? '' : ')');
        }
        const efn = it;
        if (efn && efn.Body !== undefined && efn.Type !== undefined && efn.Args !== undefined)
            return this
                .s('(')
                .each(efn.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type))
                .s(' -> ').emitTypeRef(efn.Type)
                .s(')\n')
                .emitInstr(efn.Body)
                .s('\t'.repeat(this.indent));
        const ename = it;
        if (ename && ename.Name !== undefined)
            return this.s(ename.Name ? ename.Name : this.options.idents.curInst);
        throw "<expr>" + JSON.stringify(it);
    }
    gen(prep) {
        this.resetState();
        this.src = "# NOTE, this is not a CoffeeScript file:\n# the .coffee extension is solely for the convenience of syntax-highlighting.\n#\n# A debug-print of our in-memory-only imperative-intermediate-representation\n# available to code-gens that want to stay lean & mean & low on LoCs for\n# maintainability & ease of porting.\n#\n# The format is again just a debug-print: it's never to be parsed or anything,\n# and exists merely to dump all knowledge held by generated in-memory\n# representations available to code-gens.\n#\n# Generated representations follow below.\n\n";
        const build = (this.b = new Builder(prep, this));
        const ifacemain = {
            name: prep.fromOrig.moduleName,
            Name: this.nameRewriters.types.interfaces(prep.fromOrig.moduleName),
            Docs: build.docs(gen.docs(prep.fromOrig.fromOrig)),
            Methods: prep.interfaces.map((_) => ({
                name: _.name,
                Name: this.nameRewriters.methods(_.name),
                Docs: build.docs(gen.docs(_.fromOrig)),
                Type: build.typeRef(this.nameRewriters.types.interfaces(_.name)),
                Args: [],
            })),
        };
        this.emitInterface(ifacemain);
        for (const it of prep.enums)
            this.emitEnum(build.enumFrom(it));
        for (const it of prep.structs)
            this.emitStruct(build.structFrom(it));
        const ifaces = prep.interfaces.map(_ => build.interfaceFrom(_));
        for (const it of ifaces)
            this.emitInterface(it);
        for (const it of ifacemain.Methods)
            this.emitMethodImpl(ifacemain, it, true);
        for (const it of ifaces)
            for (const method of it.Methods)
                this.emitMethodImpl(it, method, false);
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src);
    }
}
exports.Gen = Gen;
