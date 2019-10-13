"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_util = require("util");
const gen = require("./gen-basics");
var TypeRefPrim;
(function (TypeRefPrim) {
    TypeRefPrim[TypeRefPrim["Any"] = 121] = "Any";
    TypeRefPrim[TypeRefPrim["Bool"] = 124] = "Bool";
    TypeRefPrim[TypeRefPrim["Int"] = 136] = "Int";
    TypeRefPrim[TypeRefPrim["Real"] = -1] = "Real";
    TypeRefPrim[TypeRefPrim["String"] = 139] = "String";
    TypeRefPrim[TypeRefPrim["Dict"] = 189] = "Dict";
})(TypeRefPrim = exports.TypeRefPrim || (exports.TypeRefPrim = {}));
var BuilderOperators;
(function (BuilderOperators) {
    BuilderOperators["Dot"] = ".";
    BuilderOperators["Idx"] = "@";
    BuilderOperators["IdxMay"] = "@?";
    BuilderOperators["Eq"] = "==";
    BuilderOperators["Neq"] = "!=";
    BuilderOperators["Or"] = "||";
    BuilderOperators["And"] = "&&";
    BuilderOperators["Not"] = "!";
    BuilderOperators["Is"] = "=?";
    BuilderOperators["Isnt"] = "=!";
    BuilderOperators["Addr"] = "&";
    BuilderOperators["Deref"] = "*";
})(BuilderOperators = exports.BuilderOperators || (exports.BuilderOperators = {}));
class Builder {
    constructor(prep, gen) { [this.prep, this.gen] = [prep, gen]; }
    iRet(ret) { return { Ret: ret }; }
    iVar(varName, varType) { return { Name: varName, Type: varType }; }
    iSet(setWhat, setTo) { return { SetWhat: setWhat, SetTo: setTo }; }
    iAdd(addTo, addWhat) { return { AddTo: addTo, AddWhat: addWhat }; }
    iDel(delFrom, delWhat) { return { DelFrom: delFrom, DelWhat: delWhat }; }
    iBlock(...instrs) { return { Instrs: instrs }; }
    iLock(lock, ...instrs) { return { Lock: lock, Instrs: instrs }; }
    iIf(ifCond, thenInstrs, elseInstrs = undefined) { return { Instrs: thenInstrs, If: [ifCond, { Instrs: elseInstrs }] }; }
    iFor(iterVarName, iterable, ...instrs) { return { Instrs: instrs, ForEach: [iterVarName, iterable] }; }
    eNew(typeRef) { return { New: typeRef }; }
    eConv(typeRef, conv, cast = false) { return { Conv: conv, To: typeRef, Cast: cast }; }
    eTup(...items) { return { Items: items }; }
    eLen(lenOf, isArr) { return { LenOf: lenOf, IsArr: isArr }; }
    eCollNew(capOrLen, arrOrListElemType = undefined, isArr = false) { return { ElemType: arrOrListElemType, Cap: (arrOrListElemType && isArr) ? undefined : capOrLen, Len: (arrOrListElemType && isArr) ? capOrLen : undefined }; }
    eFunc(args, retType, ...instrs) { return { Args: args, Type: retType, Body: { Instrs: instrs } }; }
    eCall(callee, ...args) { return { Call: callee, Args: args }; }
    n(name) { return { Name: name }; }
    eLit(litVal) { return { Lit: litVal }; }
    eZilch() { return this.eLit(null); }
    eThis() { return this.n(null); }
    eOp(op, ...args) { return { Name: op, Operands: args }; }
    oIdx(...args) { return this.eOp(BuilderOperators.Idx, ...args); }
    oIdxMay(coll, key) { return this.eOp(BuilderOperators.IdxMay, coll, key); }
    oEq(...args) { return this.eOp(BuilderOperators.Eq, ...args); }
    oNeq(...args) { return this.eOp(BuilderOperators.Neq, ...args); }
    oOr(...args) { return this.eOp(BuilderOperators.Or, ...args); }
    oAnd(...args) { return this.eOp(BuilderOperators.And, ...args); }
    oAddr(arg) { return this.eOp(BuilderOperators.Addr, arg); }
    oDeref(arg) { return this.eOp(BuilderOperators.Deref, arg); }
    oNot(arg) { return this.eOp(BuilderOperators.Not, arg); }
    oIs(arg) { return this.eOp(BuilderOperators.Is, arg); }
    oIsnt(arg) { return this.eOp(BuilderOperators.Isnt, arg); }
    oDot(...args) { return (args.length === 1) ? this.oDot(this.eThis(), args[0]) : this.eOp(BuilderOperators.Dot, ...args); }
    EACH(from, fn) {
        const me = [];
        for (let idx = 0; idx < from.length; idx++)
            me.push(...fn(from[idx], idx));
        return me;
    }
    WHEN(check, ifTrue, ifFalse = null) {
        return check ? ifTrue() : ifFalse ? ifFalse() : [];
    }
    LET(value, then) {
        return then(value);
    }
    LETS(values, then) {
        return then(...values);
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
            Methods: it.methods.map((method) => ({
                fromPrep: method,
                name: (method.nameOrig && method.nameOrig.length) ? method.nameOrig : method.name,
                Name: this.gen.nameRewriters.methods((this.gen.options.funcOverloads && method.nameOrig && method.nameOrig.length) ? method.nameOrig : method.name),
                Docs: method.isProps
                    ? [{ Lines: ["Provides single-call access to numerous individual `" + this.gen.nameRewriters.types.interfaces(it.name) + "` properties at once."], ForParam: "" }]
                    : this.docs(gen.docs(method.fromOrig ? method.fromOrig.decl : it.fromOrig, () => method.args.find(arg => arg.isFromRetThenable)), undefined, true, this.gen.options.doc.appendArgsToSummaryFor.methods),
                Type: null,
                Args: method.args.map((arg) => ({
                    fromPrep: arg,
                    name: arg.name,
                    Name: this.gen.nameRewriters.args(arg.name),
                    Docs: this.docs(gen.docs(arg.fromOrig)),
                    Type: this.typeRef(arg.typeSpec, arg.optional, false, ((method.fromOrig && method.fromOrig.decl && method.fromOrig.decl && method.fromOrig.decl.PropType) || method.isProps) ? true : false),
                })),
            })),
        };
    }
    structFrom(it) {
        let ret = {
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.structs(it.name),
            Docs: this.docs(gen.docs(it.fromOrig ? it.fromOrig.decl : it.isPropsOf.fromOrig)),
            IsOutgoing: it.isOutgoing ? true : false,
            IsIncoming: it.isIncoming ? true : false,
            Fields: it.fields.map((_) => ({
                fromPrep: _,
                name: _.name,
                Name: this.gen.nameRewriters.fields(_.name),
                Docs: this.docs(gen.docs(_.fromOrig), _.isExtBaggage ? [gen.docStrs.extBaggage] : [], false, this.gen.options.doc.appendArgsToSummaryFor.funcFields),
                Type: this.gen.typeRefForField(this.typeRef(_.typeSpec, _.optional), _.optional),
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
    typeRefEnsureMaybe(it) {
        let maybe = it;
        if (!(maybe && maybe.Maybe))
            maybe = { Maybe: it };
        return maybe;
    }
    typeRef(it, needMaybe = false, intoProm = false, propsRelated) {
        if (!it)
            return null;
        if (needMaybe)
            return this.typeRefEnsureMaybe(this.typeRef(it, false, intoProm, propsRelated));
        if (it === gen.ScriptPrimType.Boolean || it === gen.ScriptPrimType.BooleanTrue || it === gen.ScriptPrimType.BooleanFalse)
            return TypeRefPrim.Bool;
        if (it === gen.ScriptPrimType.Number)
            return TypeRefPrim.Int;
        if (it === gen.ScriptPrimType.String)
            return TypeRefPrim.String;
        if (it === gen.ScriptPrimType.Dict)
            return TypeRefPrim.Dict;
        if (it === gen.ScriptPrimType.Any)
            return TypeRefPrim.Any;
        const tarr = gen.typeArr(it);
        if (tarr)
            return { ValsOf: this.typeRef(tarr) };
        const ttup = gen.typeTup(it);
        if (ttup && ttup.length)
            return { TupOf: ttup.map(_ => this.typeRef(_)) };
        const tfun = gen.typeFun(it);
        if (tfun && tfun.length)
            return { From: tfun[0].map(_ => this.typeRef(_)), To: this.typeRef(tfun[1]) };
        let tsum = gen.typeSum(it);
        if (tsum && tsum.length) {
            let hadoptional = false;
            tsum = tsum.filter(_ => {
                const optional = (_ === gen.ScriptPrimType.Undefined || _ === gen.ScriptPrimType.Null);
                hadoptional = hadoptional || optional;
                return (!optional) && !gen.typeProm(_);
            });
            if (tsum.length > 1)
                tsum = tsum.filter(_ => _ !== gen.ScriptPrimType.String);
            if (tsum.length !== 1)
                throw it;
            let ret = this.typeRef(tsum[0], needMaybe, intoProm, propsRelated);
            return hadoptional ? this.typeRefEnsureMaybe(ret) : ret;
        }
        const tmul = gen.typeMul(it);
        if (tmul && tmul.length && typeof tmul[0] === 'string') {
            const ands = {};
            for (const _ of tmul.slice(1)) {
                let tobj = gen.typeObj(_);
                if (!(tobj && tobj.length))
                    throw _;
                for (const tup of tobj)
                    if (tup[1] === gen.ScriptPrimType.BooleanTrue)
                        ands[tup[0]] = this.eLit(true);
                    else if (tup[1] === gen.ScriptPrimType.BooleanFalse)
                        ands[tup[0]] = this.eLit(false);
                    else
                        throw (tup[1]);
            }
            return { Name: tmul[0], Ands: ands };
        }
        const tobj = gen.typeObj(it);
        if (tobj && tobj.length)
            if (tobj.length === 1 && tobj[0] && tobj[0][0] === '' && tobj[0].length && tobj[0].length === 2) {
                const tfun = gen.typeFun(tobj[0][1]);
                if (tfun.length === 2 && tfun[0] && tfun[0].length === 1) {
                    const tdictkey = tfun[0][0], tdictval = tfun[1];
                    return { ValsOf: this.typeRef(tdictval), KeysOf: this.typeRef(tdictkey) };
                }
            }
        const tprom = gen.typeProm(it);
        if (tprom && tprom.length)
            if (tprom.length > 1 && (intoProm || tprom[0] === 'Disposable'))
                throw it;
            else if (intoProm)
                return this.typeRef(tprom[0]);
            else if (tprom[0] === 'Disposable')
                return { From: [{ Maybe: { Name: 'Disposable' } }], To: null };
            else
                return { From: tprom.map(_ => this.typeRef(_, !(_ === gen.ScriptPrimType.Boolean || propsRelated))), To: null };
        if (typeof it === 'string')
            return (it === 'Uri') ? TypeRefPrim.String : { Name: this.gen.nameRewriters.types.structs(it) };
        throw JSON.stringify(it);
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
                        dst.Lines.push('', ...doc.lines.map((ln, idx) => (idx ? ln : gen.docPrependArgOrRetName(doc, ln, "return", this.gen.nameRewriters.args))));
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
        this.indents = 0;
        this.b = null;
        this.allEnums = null;
        this.allInterfaces = null;
        this.allStructs = null;
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
                null: "null",
                curInst: "this",
                typeAny: "any",
                typeDict: "dict",
                typeImpl: "impl",
            },
            unMaybeOutgoingTypes: [TypeRefPrim.String],
            oneIndent: '    ',
            funcOverloads: false,
        };
    }
    indented(then) {
        this.indents++;
        then();
        this.indents--;
        return this;
    }
    indent() {
        this.indents++;
        return this;
    }
    undent() {
        this.indents--;
        return this;
    }
    ln(then) {
        this.src += this.options.oneIndent.repeat(this.indents);
        then();
        this.src += "\n";
        return this;
    }
    each(arr, joinBy, then) {
        for (let i = 0; i < arr.length; i++) {
            if (i > 0)
                this.s(joinBy);
            then(arr[i]);
        }
        return this;
    }
    line(srcLn = '') {
        return this.lines(srcLn);
    }
    lines(...srcLns) {
        for (const srcln of srcLns)
            this.src += ((srcln && srcln.length) ? (this.options.oneIndent.repeat(this.indents) + srcln) : '') + "\n";
        return this;
    }
    lf(...s) {
        this.src += (this.options.oneIndent.repeat(this.indents) + s.join(''));
        return this;
    }
    s(...s) {
        this.src += s.join('');
        return this;
    }
    caseOf(...cases) {
        for (const caseof of cases)
            if (caseof[0]) {
                caseof[1]();
                break;
            }
        return this;
    }
    when(check, ifTrue, ifFalse = undefined) {
        if (check)
            ifTrue();
        else if (ifFalse)
            ifFalse();
        return this;
    }
    emitDocs(it) {
        if (it.name && it.Name && it.name !== it.Name)
            this.line("# " + it.name + ":");
        if (it.Docs && it.Docs.length)
            for (const doc of it.Docs) {
                if (doc.ForParam && doc.ForParam.length)
                    this.lines('#', "# @" + doc.ForParam + ":");
                for (const docln of doc.Lines)
                    this.line("# " + docln);
            }
        return this;
    }
    emitEnum(it) {
        this.lines('', '')
            .emitDocs(it)
            .line(it.Name + ": enum")
            .indented(() => it.Enumerants.forEach(_ => this.line()
            .emitDocs(_)
            .line(`${_.Name}: ${_.Value}`)))
            .lines('', '');
    }
    emitInterface(it) {
        this.lines('', '')
            .emitDocs(it)
            .line(it.Name + ": interface")
            .indented(() => it.Methods.forEach(_ => {
            this.line()
                .emitDocs(_)
                .ln(() => this.s(_.Name, ': ').emitTypeRef(_.Type))
                .indented(() => _.Args.forEach(arg => this.ln(() => this.s(arg.Name, ': ').emitTypeRef(arg.Type).s((arg.name === arg.Name) ? '' : (' # ' + arg.name)))));
        })).lines('', '');
    }
    emitStruct(it) {
        this.lines('', '')
            .emitDocs(it)
            .line(it.Name + ": class")
            .indented(() => it.Fields.forEach(_ => {
            this.line()
                .emitDocs(_)
                .lines('#', `# JSON FLAGS: ${JSON.stringify(_.Json)}`)
                .ln(() => this.s(_.Name, ': ').emitTypeRef(_.Type));
        })).lines('', '');
    }
    emitTypeRef(it) {
        if (it === null)
            return this.s("void");
        if (it === TypeRefPrim.Any)
            return this.s(this.options.idents.typeAny);
        if (it === TypeRefPrim.Bool)
            return this.s("bool");
        if (it === TypeRefPrim.Int)
            return this.s("int");
        if (it === TypeRefPrim.Real)
            return this.s("real");
        if (it === TypeRefPrim.String)
            return this.s("string");
        if (it === TypeRefPrim.Dict)
            return this.s(this.options.idents.typeDict);
        const ttup = this.typeTup(it);
        if (ttup)
            return this.s("[").each(ttup.TupOf, ',', _ => this.emitTypeRef(_)).s(']');
        const tarr = this.typeColl(it);
        if (tarr)
            return this.s('[').emitTypeRef(tarr.ValsOf).s(']');
        const tfun = this.typeFunc(it);
        if (tfun)
            return this.s('(').each(tfun.From, '->', _ => this.emitTypeRef(_)).s('->').emitTypeRef(tfun.To).s(')');
        const tmay = this.typeMaybe(it);
        if (tmay)
            return this.s('?').emitTypeRef(tmay.Maybe);
        const tname = this.typeOwn(it);
        if (tname)
            return this.s(tname.Name);
        throw it;
    }
    emitMethodImpl(interfaceOrStruct, method, fillBody) {
        const me = {
            name: method.name, Name: method.Name, Type: interfaceOrStruct, Func: {
                Args: method.Args, Type: method.Type, Body: { Instrs: [] }
            }
        };
        fillBody.call(this, interfaceOrStruct, method, this.b, me.Func.Body.Instrs);
        this.emitFuncImpl(me);
    }
    emitFuncImpl(it) {
        this.lines('', '')
            .ln(() => this.emitTypeRef(it.Type).s('·', it.Name, ': (').each(it.Func.Args, ' -> ', _ => this.s(_.Name, ':').emitTypeRef(_.Type)).s(' -> ').emitTypeRef(it.Func.Type).s(')'))
            .emitInstr(it.Func.Body)
            .lines('', '');
    }
    emitInstr(it) {
        if (it) {
            const iret = it;
            if (iret && iret.Ret !== undefined)
                return this.ln(() => this.s("return ").emitExpr((!iret.Ret) ? undefined : iret.Ret));
            const ivar = it;
            if (ivar && ivar.Name && ivar.Type)
                return this.ln(() => this.s("var ", ivar.Name, " of ").emitTypeRef(ivar.Type));
            const iset = it;
            if (iset && iset.SetWhat && iset.SetTo)
                return this.ln(() => this.emitExpr(iset.SetWhat).s(" = ").emitExpr(iset.SetTo));
            const idictdel = it;
            if (idictdel && idictdel.DelFrom && idictdel.DelWhat)
                return this.ln(() => this.emitExpr(idictdel.DelFrom).s('·del(').emitExpr(idictdel.DelWhat).s(')'));
            const icolladd = it;
            if (icolladd && icolladd.AddTo && icolladd.AddWhat)
                return this.ln(() => this.emitExpr(icolladd.AddTo).s('·add(').emitExpr(icolladd.AddWhat).s(')'));
            const ecall = it;
            if (ecall && ecall.Call)
                return this.ln(() => this.emitExpr(ecall));
            const iblock = it;
            if (iblock && iblock.Instrs !== undefined) {
                if (iblock.Lock)
                    this.ln(() => this.s('lock ').emitExpr(iblock.Lock));
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
            return this.s(this.options.idents.null);
        const elit = it;
        if (elit && elit.Lit !== undefined)
            return this.s((elit.Lit === null) ? this.options.idents.null : node_util.format("%j", elit.Lit));
        const ecollnew = it;
        if (ecollnew && (ecollnew.Cap !== undefined || ecollnew.Len !== undefined))
            return this.when(ecollnew.ElemType, () => this.s('[').emitTypeRef(ecollnew.ElemType).s(']'), () => this.s(this.options.idents.typeDict)).s('·new(').emitExpr(ecollnew.Cap ? ecollnew.Cap : ecollnew.Len).s(')');
        const enew = it;
        if (enew && enew.New)
            return this.emitTypeRef(enew.New).s("·new");
        const econv = it;
        if (econv && econv.Conv && econv.To)
            return this.s('((').emitExpr(econv.Conv).s(')·(').emitTypeRef(econv.To).s('))');
        const elen = it;
        if (elen && elen.LenOf)
            return this.emitExpr(elen.LenOf).s("·len");
        const etup = it;
        if (etup && etup.Items !== undefined)
            return this.s('[').each(etup.Items, ', ', _ => { this.emitExpr(_); }).s(']');
        const ecall = it;
        if (ecall && ecall.Call)
            return this.emitExpr(ecall.Call).s("(").emitExprs(", ", ...ecall.Args).s(")");
        const eop = it;
        if (eop && eop.Name && eop.Operands && eop.Operands.length) {
            const notactualoperator = (eop.Name === BuilderOperators.Idx || eop.Name === BuilderOperators.IdxMay || eop.Name === BuilderOperators.Dot);
            return this
                .s((notactualoperator ? '' : '(')
                + ((eop.Operands.length > 1) ? '' : /* unary*/ eop.Name))
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
                .lf();
        const ename = it;
        if (ename && ename.Name !== undefined)
            return this.s(ename.Name ? ename.Name : this.options.idents.curInst);
        throw "<expr>" + JSON.stringify(it);
    }
    convOrRet(dstVarName, src, dstType, okBoolName = 'ok', onErrRet = undefined) {
        const _ = this.b;
        if (!onErrRet)
            onErrRet = _.eLit(false);
        const retifnotok = _.iIf(_.oNot(_.n(okBoolName)), [_.iRet(onErrRet),]);
        const tdstnamed = this.typeOwn(this.typeUnMaybe(dstType));
        if (tdstnamed) {
            if (tdstnamed.Name !== 'Disposable' && tdstnamed.Name !== 'Uri' && this.state.genPopulateFor[tdstnamed.Name] !== false) // why this peculiar checking construct?..
                this.state.genPopulateFor[tdstnamed.Name] = true; // ..see the consumer of genDecoders to grasp it
            return [
                _.iSet(_.n(dstVarName), _.eNew(dstType)),
                _.iSet(_.n(okBoolName), _.eCall(_.oDot(_.n(dstVarName), _.n('populateFrom')), src)),
                retifnotok,
            ];
        }
        const tdstmaybe = this.typeMaybe(dstType);
        if (tdstmaybe && (tdstmaybe.Maybe === TypeRefPrim.Bool || tdstmaybe.Maybe === TypeRefPrim.Int || tdstmaybe.Maybe === TypeRefPrim.Real || tdstmaybe.Maybe === TypeRefPrim.String)) {
            const tmpname = "_" + dstVarName + "_";
            return [
                _.iVar(tmpname, tdstmaybe.Maybe),
                _.iSet(_.eTup(_.n(tmpname), _.n(okBoolName)), _.eConv(tdstmaybe.Maybe, src)),
                retifnotok,
                _.iSet(_.n(dstVarName), _.oAddr(_.n(tmpname))),
            ];
        }
        const tdstcoll = this.typeColl(this.typeUnMaybe(dstType));
        if (tdstcoll && tdstcoll.ValsOf && tdstcoll.KeysOf === undefined) {
            const tcoll = { ValsOf: TypeRefPrim.Any };
            const tncoll = "__coll__" + dstVarName, tnidx = "__idx__" + dstVarName, tnitem = "__item__" + dstVarName, tnval = "__val__" + dstVarName;
            return [
                _.iVar(tncoll, tcoll),
                _.iSet(_.eTup(_.n(tncoll), _.n(okBoolName)), _.eConv(tcoll, src)),
                retifnotok,
                _.iSet(_.n(dstVarName), _.eCollNew(_.eLen(_.n(tncoll), true), tdstcoll.ValsOf, true)),
                _.iVar(tnidx, TypeRefPrim.Int),
                _.iSet(_.n(tnidx), _.eLit(0)),
                _.iFor(_.n(tnitem), _.n(tncoll), ...[
                    _.iVar(tnval, tdstcoll.ValsOf),
                ].concat(...this.convOrRet(tnval, _.n(tnitem), tdstcoll.ValsOf, okBoolName, onErrRet)).concat(_.iSet(_.oIdx(_.n(dstVarName), _.n(tnidx)), _.n(tnval)), _.iSet(_.n(tnidx), _.eOp('+', _.n(tnidx), _.eLit(1))))),
            ];
        }
        if (dstType === TypeRefPrim.Any)
            return [_.iSet(_.n(dstVarName), src)];
        if (dstType === TypeRefPrim.Int || dstType === TypeRefPrim.Real) {
            const alttype = (dstType === TypeRefPrim.Int) ? TypeRefPrim.Real : TypeRefPrim.Int;
            const altname = "__" + dstVarName + "__";
            return [
                _.iSet(_.eTup(_.n(dstVarName), _.n(okBoolName)), _.eConv(dstType, src)),
                _.iIf(_.oNot(_.n(okBoolName)), [
                    _.iVar(altname, alttype),
                    _.iSet(_.eTup(_.n(altname), _.n(okBoolName)), _.eConv(alttype, src)),
                    retifnotok,
                    _.iSet(_.n(dstVarName), _.eConv(dstType, _.n(altname), true)),
                ]),
            ];
        }
        return [
            _.iSet(_.eTup(_.n(dstVarName), _.n(okBoolName)), _.eConv(dstType, src)),
            retifnotok,
        ];
    }
    genMethodImpl_TopInterface(_iface, method, _, body) {
        body.push(_.iRet(_.eConv({ Name: this.options.idents.typeImpl + method.Name }, _.n(this.options.idents.curInst))));
    }
    genMethodImpl_PopulateFrom(struct, _method, _, body) {
        body.push(_.iVar('it', TypeRefPrim.Dict), _.iVar('ok', TypeRefPrim.Bool), _.iVar('val', TypeRefPrim.Any));
        body.push(...this.convOrRet('it', _.n('payload'), TypeRefPrim.Dict));
        const tstruct = struct;
        if (!(tstruct && tstruct.Fields))
            throw struct;
        for (const fld of tstruct.Fields)
            if (!fld.Json.Excluded) {
                const tfld = this.typeRefForField(fld.Type, fld.fromPrep && fld.fromPrep.optional);
                body.push(_.iSet(_.eTup(_.n('val'), _.n('ok')), _.oIdxMay(_.n('it'), _.eLit(fld.Json.Name))), _.iIf(_.n('ok'), [
                    _.iVar(fld.name, tfld),
                    _.iIf(_.oIs(_.n('val')), this.convOrRet(fld.name, _.n('val'), tfld)),
                    _.iSet(_.oDot(_.eThis(), _.n(fld.Name)), _.n(fld.name)),
                ], fld.Json.Required ? [_.iRet(_.eLit(false))] : []));
            }
        body.push(_.iRet(_.eLit(true)));
    }
    genMethodImpl_MessageDispatch(iface, method, _, body) {
        const __ = gen.idents(method.fromPrep.args, 'msg', 'on', 'fn', 'fnid', 'fnids', 'payload', 'result', 'args', 'ok');
        const funcfields = gen.argsFuncFields(_.prep, method.fromPrep.args);
        const numargs = method.fromPrep.args.filter(_ => !_.isFromRetThenable).length;
        body.push(_.iVar(__.msg, { Maybe: { Name: 'ipcMsg' } }), _.iSet(_.n(__.msg), _.eNew({ Maybe: { Name: 'ipcMsg' } })), _.iSet(_.oDot(_.n(__.msg), _.n('QName')), _.eLit(iface.name + '.' + method.fromPrep.name)), _.iSet(_.oDot(_.n(__.msg), _.n('Data')), _.eCollNew(_.eLit(numargs))));
        const twinargs = {};
        if (funcfields.length) {
            for (const ff of funcfields)
                for (const structname in this.allStructs) {
                    const struct = this.allStructs[structname];
                    if (struct && struct.fromPrep && struct.fromPrep === ff.struct && struct.OutgoingTwin && struct.OutgoingTwin.length) {
                        const twinarg = (twinargs[ff.arg.name] = { origStruct: struct, twinStructName: struct.OutgoingTwin, altName: "__" + ff.arg.name + "__" });
                        body.push(_.iVar(twinarg.altName, { Maybe: { Name: twinarg.twinStructName } }));
                        break;
                    }
                }
            body.push(_.iVar(__.fnids, { ValsOf: TypeRefPrim.String, KeysOf: null }), _.iSet(_.n(__.fnids), _.eCollNew(_.eLit(funcfields.length), TypeRefPrim.String)));
            for (const ff of funcfields) {
                let ffname = this.nameRewriters.fields(ff.name), ffld = ff.struct.fields.find(_ => _.name === ff.name), structfield = this.allStructs[this.nameRewriters.types.structs(ff.struct.name)].Fields.find(_ => _.fromPrep === ffld), fnargs = gen.typeFun(ffld.typeSpec)[0], twinarg = twinargs[ff.arg.name], origargname = this.nameRewriters.args(ff.arg.name), argname = (twinarg && twinarg.altName && twinarg.altName.length) ? twinarg.altName : origargname;
                body.push(_.iIf((!ff.arg.optional) ? _.eLit(true) : _.oIs(_.n(origargname)), _.WHEN(twinarg, () => [
                    _.iSet(_.n(argname), _.eNew({ Maybe: { Name: twinarg.twinStructName } })),
                    _.iSet(_.oDot(_.n(argname), _.n(twinarg.origStruct.Name)), ff.arg.optional ? _.n(origargname) : _.oAddr(_.n(origargname))),
                ]).concat(_.iSet(_.oDot(_.n(argname), _.n(ffname + '_AppzFuncId')), _.eLit("")), _.iVar(__.fn, structfield.Type), _.iSet(_.n(__.fn), _.oDot(_.n(argname), _.n(ffname))), _.iIf(_.oIs(_.n(__.fn)), [_.iLock(_.eThis(), _.iSet(_.oDot(_.n(argname), _.n(ffname + '_AppzFuncId')), _.eCall(_.oDot(_.eCall(_.oDot(_.n('Impl'))), _.n('nextFuncId')))), _.iAdd(_.n(__.fnids), _.oDot(_.n(argname), _.n(ffname + '_AppzFuncId'))), _.iSet(_.oIdx(_.oDot(_.eCall(_.oDot(_.n('Impl'))), _.n('cbOther')), _.oDot(_.n(argname), _.n(ffname + '_AppzFuncId'))), _.eFunc([{ Name: __.args, Type: { ValsOf: TypeRefPrim.Any } }], { TupOf: [TypeRefPrim.Any, TypeRefPrim.Bool] }, _.iIf(_.oNeq(_.eLit((fnargs.length)), _.eLen(_.n(__.args), true)), [
                        _.iRet(_.eTup(_.eZilch(), _.eLit(false))),
                    ], [_.iVar(__.ok, TypeRefPrim.Bool)].concat(..._.EACH(fnargs, (fnarg, idx) => [
                        _.iVar('__' + idx, this.b.typeRef(fnarg)),
                        _.iIf(_.oIs(_.oIdx(_.n(__.args), _.eLit(idx))), this.convOrRet('__' + idx, _.oIdx(_.n(__.args), _.eLit(idx)), this.b.typeRef(fnarg), __.ok, _.eTup(_.eZilch(), _.eLit(false))), (fnarg === gen.ScriptPrimType.Number || this.typeOwn(this.b.typeRef(fnarg))) ? [
                            _.iRet(_.eTup(_.eZilch(), _.eLit(false))),
                        ] : []),
                        _.iRet(_.eTup(_.eCall(_.n(__.fn), ...fnargs.map((_a, idx) => _.n('__' + idx))), _.eLit(true))),
                    ]))))))]))));
            }
        }
        const isevt = (method.fromPrep && method.fromPrep.fromOrig) ? method.fromPrep.fromOrig.decl : null;
        let nameevtsub = undefined;
        if (isevt && isevt.EvtName && isevt.EvtName.length) {
            const arg = method.Args[0];
            nameevtsub = "_fnid_" + arg.Name;
            body.push(_.iVar(nameevtsub, TypeRefPrim.String), _.iIf(_.oIsnt(_.n(arg.Name)), [
                _.eCall(_.n("OnError"), _.eCall(_.oDot(_.n('Impl'))), _.eLit(`${iface.Name}.${method.Name}: the '${arg.Name}' arg (which is not optional but required) was not passed by the caller`), _.eZilch()),
                _.iRet(null),
            ]), _.iSet(_.n(nameevtsub), _.eCall(_.oDot(_.eCall(_.oDot(_.n('Impl'))), _.n("nextSub")), _.eFunc([{ Name: "args", Type: { ValsOf: TypeRefPrim.Any } }], TypeRefPrim.Bool, ...[
                _.iVar(__.ok, TypeRefPrim.Bool),
                _.iIf(_.oNeq(_.eLit(isevt.EvtArgs.length), _.eLen(_.n("args"), true)), [
                    _.iRet(_.n(__.ok)),
                ]),
            ].concat(_.EACH(isevt.EvtArgs, (t, i) => _.LET(`_a_${i}_`, aname => _.LET(this.b.typeRef(this.b.prep.typeSpec(t)), atype => [_.iVar(aname, atype)].concat(this.convOrRet(aname, _.oIdx(_.n("args"), _.eLit(i)), atype)))))).concat(_.eCall(_.n(arg.Name), ...isevt.EvtArgs.map((_a, i) => _.n(`_a_${i}_`))), _.iRet(_.eLit(true)))))), _.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n('Data')), _.eLit(arg.name)), _.n(nameevtsub)));
        }
        else
            for (const arg of method.Args)
                if (!arg.fromPrep.isFromRetThenable)
                    if (arg.fromPrep.isCancellationToken !== undefined)
                        body.push(_.iIf(_.oIs(_.n(arg.Name)), [
                            _.iSet(_.oDot(_.n(arg.Name), _.n("impl")), _.eCall(_.oDot(_.eThis(), _.n("Impl")))),
                            _.iIf(_.oEq(_.eLit(""), _.oDot(_.n(arg.Name), _.n("fnId"))), [
                                _.iLock(_.eThis(), _.iSet(_.oDot(_.n(arg.Name), _.n("fnId")), _.eCall(_.oDot(_.eCall(_.oDot(_.n('Impl'))), _.n("nextFuncId"))))),
                            ]),
                            _.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n('Data')), _.eLit(arg.name)), _.oDot(_.n(arg.Name), _.n("fnId"))),
                        ]));
                    else {
                        let town = this.typeOwn(arg.Type);
                        if (town && town.Ands) {
                            let tstructmul;
                            for (const structname in this.allStructs)
                                if (structname === town.Name) {
                                    tstructmul = this.allStructs[structname];
                                    break;
                                }
                            if (tstructmul)
                                for (const and in town.Ands)
                                    for (const fld of tstructmul.Fields.filter(_ => _.name === and))
                                        body.push(_.iSet(_.oDot(_.n(arg.Name), _.n(fld.Name)), town.Ands[and]));
                        }
                        const twinarg = twinargs[arg.Name];
                        body.push(_.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n('Data')), _.eLit(arg.name)), _.n((twinarg && twinarg.altName && twinarg.altName.length) ? twinarg.altName : arg.Name)));
                    }
        const lastarg = method.Args[method.Args.length - 1];
        body.push(_.iVar(__.on, { From: [TypeRefPrim.Any], To: TypeRefPrim.Bool }));
        if (lastarg.fromPrep.isFromRetThenable) {
            const isdisp = gen.typePromOf(lastarg.fromPrep.typeSpec, 'Disposable');
            const meprop = (method.fromPrep && method.fromPrep.fromOrig) ? method.fromPrep.fromOrig.decl : null;
            const isprop = meprop && meprop.PropType;
            const isprops = method.fromPrep && method.fromPrep.isProps;
            const isval = gen.typePromOf(lastarg.fromPrep.typeSpec, gen.ScriptPrimType.Boolean) || gen.typePromOf(lastarg.fromPrep.typeSpec, gen.ScriptPrimType.Number);
            const dsttype = _.typeRef(lastarg.fromPrep.typeSpec, !(isval || isprop || isprops), true);
            body.push(_.iIf(_.oIs(_.n(lastarg.Name)), [
                _.iSet(_.n(__.on), _.eFunc([{ Name: __.payload, Type: TypeRefPrim.Any }], TypeRefPrim.Bool, _.iVar(__.ok, TypeRefPrim.Bool), _.iVar(__.result, dsttype), _.iIf(_.oIs(_.n(__.payload)), this.convOrRet(__.result, _.n(__.payload), dsttype, __.ok), _.WHEN(isdisp || isval || isprops, () => [_.iRet(_.eLit(false))], () => [])), _.WHEN(isdisp, () => [
                    _.eCall(_.n(lastarg.Name), _.eCall(_.oDot(_.n(__.result), _.n('bind')), _.eCall(_.oDot(_.eThis(), _.n("Impl"))), nameevtsub ? _.n(nameevtsub) : _.eLit(""))),
                ], () => [
                    _.eCall(_.n(lastarg.Name), _.n(__.result)),
                ])[0], _.iRet(_.eLit(true)))),
            ]));
        }
        if (!funcfields.length)
            body.push(_.eCall(_.oDot(_.eCall(_.oDot(_.n('Impl'))), _.n('send')), _.n(__.msg), _.n(__.on)));
        else
            body.push(_.eCall(_.oDot(_.eCall(_.oDot(_.n('Impl'))), _.n('send')), _.n(__.msg), _.eFunc([{ Name: __.payload, Type: TypeRefPrim.Any }], TypeRefPrim.Bool, _.iIf(_.oNeq(_.eLen(_.n(__.fnids), false), _.eLit(0)), [
                _.iLock(_.eThis(), _.iFor(_.n(__.fnid), _.n(__.fnids), _.iDel(_.oDot(_.eCall(_.oDot(_.n('Impl'))), _.n('cbOther')), _.n(__.fnid)))),
            ]), _.iRet(_.oOr(_.oIsnt(_.n(__.on)), _.eCall(_.n(__.on), _.n(__.payload)))))));
    }
    emitIntro() {
        return this.lines("#", "# NOTE, this is not a CoffeeScript file: the .coffee extension is solely", "# for the convenience of syntax-highlighting in editors & source viewers.", "#", "# A debug-print of our in-memory-only intermediate-representation prepared", "# for code-gens that choose to inherit from `gen-ast.Gen` to stay lean &", "# mean & low on LoCs for maintainability & ease of porting & consistency.", "#", "# Again, all the below is just a debug-print: it's never to be parsed (and", "# the in-mem IR never to be interpreted, other than for actual code-gen).", "# Just a dump of all the structures available to a code-gen for emitting.", "#", "", "");
    }
    emitOutro() {
        return this.lines("# override `emitOutro` for this trailing part..");
    }
    gen(prep) {
        this.resetState();
        const build = (this.b = new Builder(prep, this));
        const ifacetop = {
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
            IsTop: true,
        };
        this.allEnums = prep.enums.map(_ => build.enumFrom(_));
        this.allInterfaces = [ifacetop].concat(...prep.interfaces.map(_ => build.interfaceFrom(_)));
        this.allStructs = {};
        for (const it of prep.structs) {
            const struct = build.structFrom(it);
            this.allStructs[struct.Name] = struct;
        }
        { // set all structs' Outgoing & Incoming bools only now that all ifaces and structs are complete
            const traversed = {};
            const traverse = (t, forIncoming) => {
                this.typeRefTraverse(t, argtype => {
                    const tnamed = this.typeOwn(argtype);
                    if (tnamed) {
                        const tstruct = this.allStructs[tnamed.Name];
                        if (tstruct && !traversed[tnamed.Name]) {
                            traversed[tnamed.Name] = true;
                            if (forIncoming)
                                tstruct.IsIncoming = true;
                            else
                                tstruct.IsOutgoing = true;
                            for (const fld of tstruct.Fields) {
                                const tfun = this.typeFunc(fld.Type);
                                traverse(fld.Type, tfun ? false : forIncoming);
                            }
                        }
                    }
                    return undefined;
                });
            };
            for (const iface of this.allInterfaces)
                for (const method of iface.Methods)
                    for (const arg of method.Args)
                        traverse(arg.Type, arg.fromPrep && arg.fromPrep.isFromRetThenable);
        }
        for (const structname in this.allStructs) {
            const struct = this.allStructs[structname];
            if (struct.IsOutgoing)
                for (const fld of struct.Fields) {
                    this.typeRefTraverse(fld.Type, t => {
                        const tmay = this.typeMaybe(t);
                        if (tmay && this.options.unMaybeOutgoingTypes.some(_ => this.typeRefEq(_, tmay.Maybe)))
                            return tmay.Maybe;
                        return undefined;
                    });
                }
        }
        this.emitIntro();
        for (const it of this.allEnums)
            this.emitEnum(it);
        for (const it of this.allInterfaces)
            this.emitInterface(it);
        for (const structname in this.allStructs)
            this.emitStruct(this.allStructs[structname]);
        this.onBeforeEmitImpls(false);
        for (const it of this.allInterfaces)
            for (const method of it.Methods)
                this.emitMethodImpl(it, method, it === ifacetop
                    ? this.genMethodImpl_TopInterface
                    : this.genMethodImpl_MessageDispatch);
        this.onAfterEmitImpls(false);
        this.onBeforeEmitImpls(true);
        let anydecoderstogenerate = true;
        while (anydecoderstogenerate) {
            anydecoderstogenerate = false;
            for (const name in this.state.genPopulateFor)
                if (anydecoderstogenerate = this.state.genPopulateFor[name]) {
                    this.state.genPopulateFor[name] = false;
                    const struct = this.allStructs[name];
                    if (struct)
                        this.emitMethodImpl(struct, {
                            Name: "populateFrom", Type: TypeRefPrim.Bool,
                            Args: [{ Name: "payload", Type: TypeRefPrim.Any }]
                        }, this.genMethodImpl_PopulateFrom);
                }
        }
        this.onAfterEmitImpls(true);
        this.emitOutro();
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src);
    }
    onBeforeEmitImpls(_structs) { }
    onAfterEmitImpls(_structs) { }
    typeUnMaybe(it) {
        const me = this.typeMaybe(it);
        return me ? this.typeUnMaybe(me.Maybe) : it;
    }
    typeOwn(it) {
        const me = it;
        return (me && me.Name && me.Name.length) ? me : null;
    }
    typeMaybe(it) {
        const me = it;
        return (me && me.Maybe) ? me : null;
    }
    typeFunc(it) {
        const me = it;
        return (me && me.From !== undefined) ? me : null;
    }
    typeColl(it) {
        const me = it;
        return (me && me.ValsOf) ? me : null;
    }
    typeTup(it) {
        const me = it;
        return (me && me.TupOf && me.TupOf.length && me.TupOf.length > 1) ? me : null;
    }
    typeRefForField(it, _optional) {
        return it;
    }
    typeRefEq(t1, t2) {
        if (t1 === t2)
            return true;
        const t1may = this.typeMaybe(t1), t2may = this.typeMaybe(t2);
        if (t1may && t2may)
            return this.typeRefEq(t1may.Maybe, t2may.Maybe);
        const t1coll = this.typeColl(t1), t2coll = this.typeColl(t2);
        if (t1coll && t2coll)
            return this.typeRefEq(t1coll, t2coll);
        const t1tup = this.typeTup(t1), t2tup = this.typeTup(t2);
        if (t1tup && t2tup)
            return t1tup.TupOf.length === t2tup.TupOf.length
                && t1tup.TupOf.every((t, i) => this.typeRefEq(t, t2tup.TupOf[i]));
        const t1fun = this.typeFunc(t1), t2fun = this.typeFunc(t2);
        if (t1fun && t2fun)
            return t1fun.From.length === t2fun.From.length
                && this.typeRefEq(t1fun.To, t2fun.To)
                && t1fun.From.every((t, i) => this.typeRefEq(t, t2fun.From[i]));
        const t1n = this.typeOwn(t1), t2n = this.typeOwn(t2);
        if (t1n && t2n)
            return t1n.Name === t2n.Name && t1n.name === t2n.name;
        return false;
    }
    typeRefTraverse(it, on, set) {
        const tnew = on(it);
        if (set && tnew !== undefined)
            set(tnew);
        const tmay = this.typeMaybe(it);
        if (tmay) {
            this.typeRefTraverse(tmay.Maybe, on, _ => tmay.Maybe = _);
            return;
        }
        const tcoll = this.typeColl(it);
        if (tcoll) {
            this.typeRefTraverse(tcoll.ValsOf, on, _ => tcoll.ValsOf = _);
            return;
        }
        const ttup = this.typeTup(it);
        if (ttup) {
            ttup.TupOf.forEach((t, i) => this.typeRefTraverse(t, on, _ => ttup.TupOf[i] = _));
            return;
        }
        const tfun = this.typeFunc(it);
        if (tfun) {
            tfun.From.forEach((t, i) => this.typeRefTraverse(t, on, _ => tfun.From[i] = _));
            this.typeRefTraverse(tfun.To, on, _ => tfun.To = _);
            return;
        }
    }
    typeRefersTo(it, to) {
        if (this.typeRefEq(it, to))
            return true;
        const tmay = this.typeMaybe(it);
        if (tmay)
            return this.typeRefersTo(tmay.Maybe, to);
        const tcoll = this.typeColl(it);
        if (tcoll)
            return this.typeRefersTo(tcoll.ValsOf, to);
        const ttup = this.typeTup(it);
        if (ttup)
            return ttup.TupOf.some(t => this.typeRefersTo(t, to));
        const tfun = this.typeFunc(it);
        if (tfun)
            return this.typeRefersTo(tfun.To, to) || tfun.From.some(t => this.typeRefersTo(t, to));
        return false;
    }
}
exports.Gen = Gen;
