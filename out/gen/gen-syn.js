"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const node_fs = require("fs");
const node_util = require("util");
const gen = require("./gen");
const gen_demos = require("./gen-syn-demos");
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
    eProp(callee, ...args) { return { Call: callee, Args: args, Prop: true }; }
    n(name) { return { Name: name }; }
    eLit(litVal, ...fmtArgs) { return { Lit: litVal, FmtArgs: fmtArgs }; }
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
    _(...args) {
        const expr = (_) => typeof _ === "string" ? this.n(_) : _;
        return (args && args.length && args.length === 1) ? expr(args[0]) : this.eOp(BuilderOperators.Dot, ...args.map(expr));
    }
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
    fromEnum(it) {
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
    fromInterface(it) {
        const me = {
            fromPrep: it,
            name: it.name,
            Name: this.gen.nameRewriters.types.interfaces(it.name),
            Docs: this.docs(gen.docs(it.fromOrig)),
            Methods: it.methods.map((method) => {
                const me = {
                    fromPrep: method,
                    name: (method.nameOrig && method.nameOrig.length) ? method.nameOrig : method.name,
                    Name: this.gen.nameRewriters.methods(method.name),
                    Docs: method.isProps
                        ? [{ Lines: ["Provides single-call access to numerous individual `" + this.gen.nameRewriters.types.interfaces(it.name) + "` properties at once."], ForParam: "" }]
                        : this.docs(gen.docs(method.fromOrig ? method.fromOrig.decl : it.fromOrig), undefined, true, this.gen.options.doc.appendArgsToSummaryFor.methods),
                    Type: null,
                    Args: method.args.map((arg) => this.fromArg(arg, method)),
                };
                if (me.Args.length) {
                    const tf = this.gen.typeUnMaybe(me.Args[me.Args.length - 1].Type);
                    if (tf.From && tf.From.length) {
                        const tn = this.gen.typeUnMaybe(tf.From[0]);
                        if (tn && tn.Name && tn.Name.length) {
                            const struct = this.prep.structs.find(_ => this.gen.nameRewriters.types.structs(_.name) === tn.Name);
                            if (struct && struct.isDispObj) {
                                me.IsObjCtor = tn.Name;
                                me.Args[me.Args.length - 1].Type = { From: [tn, { Name: tn.Name + "State" }], To: null };
                                if (struct.fields.some(_ => (!gen.typeFun(_.typeSpec)) && !_.readOnly)) {
                                    const lastarg = me.Args[me.Args.length - 1];
                                    me.Args = me.Args.slice(0, me.Args.length - 1);
                                    me.Args.push({ Name: this.gen.options.idents.dispObjCtorArg, Type: { Maybe: { Name: me.IsObjCtor + "State" } } }, lastarg);
                                }
                            }
                        }
                    }
                }
                me.Type = { From: [this.gen.typeUnMaybe(me.Args[me.Args.length - 1].Type)], To: null };
                me.Args = me.Args.slice(0, me.Args.length - 1);
                return me;
            }),
        };
        return me;
    }
    fromArg(arg, method) {
        return {
            fromPrep: arg,
            name: arg.name,
            Name: this.gen.nameRewriters.args(arg.name),
            Docs: this.docs(gen.docs(arg.fromOrig)),
            Type: this.typeRef(arg.typeSpec, arg.optional, false, (method && ((method.fromOrig && method.fromOrig.decl && method.fromOrig.decl && method.fromOrig.decl.PropType) || method.isProps)) ? true : false),
        };
    }
    fromStruct(it) {
        const docssrcnode = it.fromOrig ? it.fromOrig.decl : it.isPropsOfIface ? it.isPropsOfIface.fromOrig : it.isPropsOfStruct.fromOrig.decl;
        const structname = this.gen.nameRewriters.types.structs(it.name);
        let ret = {
            fromPrep: it,
            name: it.name,
            Name: structname,
            Docs: this.docs(gen.docs(docssrcnode)),
            IsOutgoing: it.isOutgoing ? true : false,
            IsIncoming: it.isIncoming ? true : false,
            Fields: it.isDispObj ? [
                { Name: "disp", Type: { Maybe: { Name: "Disposable" } } },
            ] : it.fields.map((_) => ({
                fromPrep: _,
                name: _.name,
                Name: ((it.isPropsOfStruct && _.readOnly) ? this.gen.nameRewriters.methods : this.gen.nameRewriters.fields)(_.name),
                Docs: this.docs(gen.docs(_.fromOrig), _.isExtBaggage ? [gen.docStrs.extBaggage] : [], false, this.gen.options.doc.appendArgsToSummaryFor.funcFields),
                Type: (it.isPropsOfStruct && _.readOnly) ? { From: [], To: this.typeRef(_.typeSpec, false, true, true) } : this.gen.typeRefForField(this.typeRef(_.typeSpec, _.optional), _.optional),
                Json: { Name: _.name, Required: !_.optional, Excluded: (it.isPropsOfStruct && _.readOnly) || it.funcFields.some(ff => _.name === ff) },
            }))
        };
        for (const ff of it.funcFields) {
            const ffname = this.gen.nameRewriters.fields(ff);
            const fldfn = ret.Fields.find(_ => _.Name === ffname);
            if (fldfn) {
                fldfn.FuncFieldRel = {
                    Name: ffname + "_AppzFuncId",
                    Docs: this.docs(null, [gen.docStrs.internalOnly]),
                    Type: TypeRefPrim.String,
                    Json: { Name: ff + "_AppzFuncId", Required: false, Excluded: false },
                    FuncFieldRel: fldfn,
                };
                ret.Fields.push(fldfn.FuncFieldRel);
            }
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
            if (tsum.length > 1 && tsum.find(_ => _ === "Uri"))
                tsum = [gen.ScriptPrimType.String];
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
                        throw tup[1];
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
            return this.gen.options.typeNamesToString.includes(it) ? TypeRefPrim.String : { Name: this.gen.nameRewriters.types.structs(it) };
        throw JSON.stringify(it);
    }
    docs(docs, extraSummaryLines = undefined, isMethod = false, appendArgsAndRetsToSummaryToo = true, into = undefined) {
        const istop = (into === undefined);
        if (istop)
            into = [];
        if (docs && docs.length)
            for (const doc of docs) {
                if (doc.lines && doc.lines.length) {
                    let name = doc.isForArg;
                    if (!(name && name.length))
                        name = doc.isForRet ? "return" : "";
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
                    this.docs(doc.subs, undefined, isMethod, appendArgsAndRetsToSummaryToo, into);
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
    constructor(outFilePath, demoOutFilePath = "") {
        super(outFilePath);
        this.src = '';
        this.indents = 0;
        this.b = null;
        this.isDemos = false;
        this.opDepth = 0;
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
                dispObjCtorArg: "optionallyInitialStateToApplyUponCreation",
            },
            unMaybeOutgoingTypes: [TypeRefPrim.String, TypeRefPrim.Bool],
            oneIndent: '    ',
            optionalEnumsZeroNotZilch: false,
            haveProps: true,
            demoOutFilePath: "",
            typeNamesToString: ["Uri", "ThemeColor", "ThemeIcon"],
            objPropsGetSetNamePicks: ["", "Props", "Properties", "P", "Ps", "Details"]
        };
        this.options.demoOutFilePath = demoOutFilePath;
    }
    indented(then) {
        this.indents++;
        then();
        this.indents--;
        return this;
    }
    indent(n = 1) {
        this.indents += n;
        return this;
    }
    undent(n = 1) {
        this.indents -= n;
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
            then(arr[i], i);
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
    ensureMethodDocsArgsAndRet(it) {
        if (it.Docs && it.Docs.length) {
            const me = it;
            if (me && me.Name && me.Name.length && me.Args !== undefined && me.Args !== null) {
                let docarg = "", docret = "";
                if (me.IsObjCtor)
                    [docarg, docret] = ["If specified, the newly created `" + me.IsObjCtor + "` will be initialized with all the property values herein well before your return-continuation, if any, is invoked.", "A thenable that resolves when the `" + me.IsObjCtor + "` has been created and initialized."];
                else if (me.IsObjEvt)
                    [docarg, docret] = ["Will be invoked whenever this event fires; mandatory, not optional.", "A `Disposable` that will unsubscribe `handler` from the `" + me.Name + "` event on `Dispose`."];
                else if (me.Args.length === 1 && me.Args[0].Name === "listener" && this.typeFunc(me.Args[0].Type) && this.typeFunc(me.Type) && gen.typePromOf(me.fromPrep.args.find(_ => _.isFromRetThenable).typeSpec, "Disposable"))
                    [docarg, docret] = ["Will be invoked whenever this event fires; mandatory, not optional.", "A `Disposable` that will unsubscribe `listener` from the `" + me.Name + "` event on `Dispose`."];
                else if (me.IsSubNs)
                    docarg = "TODO_ARG_SUB";
                else if (me.fromPrep && me.fromPrep.isProps)
                    docarg = "TODO_ARG_PROPS";
                else if (this.typeFunc(me.Type) && me.Type.From && me.Type.From.length && this.typeFunc(me.Type.From[0]))
                    docret = "A thenable that resolves when this call has completed at the counterparty and its result (if any) obtained.";
                for (const arg of me.Args)
                    if (!me.Docs.some(_ => _.ForParam === arg.Name))
                        me.Docs.push({ ForParam: arg.Name, Lines: [docarg] });
                if (docret && docret.length && me.Type && !me.Docs.some(_ => _.ForParam === "return"))
                    me.Docs.push({ ForParam: "return", Lines: [docret] });
            }
        }
        return this;
    }
    emitDocs(it) {
        this.ensureMethodDocsArgsAndRet(it);
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
        throw JSON.stringify(it);
    }
    emitMethodImpl(interfaceOrStruct, method, fillBody) {
        const me = {
            name: method.name, Name: method.Name, Type: interfaceOrStruct, Func: {
                Args: method.Args, Type: method.Type, Body: { Instrs: [] }
            }, Docs: method.Docs
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
    emitInstr(it, _inBlock = false) {
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
                this.indented(() => iblock.Instrs.forEach(_ => this.emitInstr(_, true)));
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
            return (ecall.Prop && this.options.haveProps && !(ecall.Args && ecall.Args.length))
                ? this.emitExpr(ecall.Call)
                : this.emitExpr(ecall.Call).s("(").emitExprs(", ", ...ecall.Args).s(")");
        const eop = it;
        if (eop && eop.Name && eop.Operands && eop.Operands.length) {
            this.opDepth++;
            const notactualoperator = (eop.Name === BuilderOperators.Idx || eop.Name === BuilderOperators.IdxMay || eop.Name === BuilderOperators.Dot);
            this.s(((this.opDepth === 1 || notactualoperator) ? '' : '(') + ((eop.Operands.length > 1) ? '' : /* unary*/ eop.Name))
                .emitExprs(notactualoperator ? eop.Name : (' ' + eop.Name + ' '), ...eop.Operands)
                .s((this.opDepth === 1 || notactualoperator) ? '' : ')');
            this.opDepth--;
            return this;
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
        if (dstType === TypeRefPrim.Any || this.typeUnMaybe(dstType) === TypeRefPrim.Any)
            return [
                _.iSet(_.eTup(_.n(dstVarName), _.n(okBoolName)), _.eTup(src, _.eLit(true))),
                _.iIf(_.n(okBoolName), []),
            ];
        const tdstnamed = this.typeOwn(this.typeUnMaybe(dstType));
        if (tdstnamed) {
            const tstruct = this.allStructs[tdstnamed.Name], tenum = tstruct ? null : this.allEnums.find(_ => _.Name === tdstnamed.Name);
            if (tenum) {
                const tmpvarname = "i_" + dstVarName;
                return [
                    _.iVar(tmpvarname, TypeRefPrim.Int),
                ].concat(...this.convOrRet(tmpvarname, src, TypeRefPrim.Int, okBoolName, onErrRet)).concat(...[
                    _.iSet(_.n(dstVarName), _.eConv(dstType, _.n(tmpvarname), true)),
                ]);
            }
            else {
                if (tdstnamed.Name !== 'Disposable' && (!this.options.typeNamesToString.includes(tdstnamed.Name)) && this.state.genPopulateFor[tdstnamed.Name] !== false) // why this peculiar checking construct?..
                    this.state.genPopulateFor[tdstnamed.Name] = true; // ..see the consumer of genPopulateFor to grasp it
                return [
                    _.iSet(_.n(dstVarName), _.eNew(dstType)),
                    _.iSet(_.n(okBoolName), _.eCall(_.oDot(_.n(dstVarName), _.n("populateFrom")), src)),
                    retifnotok,
                ].concat(..._.WHEN(tstruct && tstruct.fromPrep && tstruct.fromPrep.isDispObj, () => [
                    _.iSet(_.oDot(_.n("result"), _.n("disp"), _.n("impl")), _.eCall(_.oDot(_.n("Impl")))),
                ]));
            }
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
            return (tdstcoll.ValsOf === TypeRefPrim.Any) ? [
                _.iSet(_.eTup(_.n(dstVarName), _.n(okBoolName)), _.eConv(tcoll, src)),
                retifnotok,
            ] : [
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
        body.push(_.iRet(_.eConv({ Name: this.options.idents.typeImpl + method.Name }, _.eThis())));
    }
    genMethodImpl_PopulateFrom(struct, _method, _, body) {
        const tstruct = struct;
        if (!(tstruct && tstruct.Fields))
            throw struct;
        if (tstruct.fromPrep && tstruct.fromPrep.isDispObj) {
            body.push(_.iVar('ok', TypeRefPrim.Bool), _.iSet(_.oDot(_.n("disp")), _.eNew({ Maybe: { Name: "Disposable" } })), _.iSet(_.n("ok"), _.eCall(_.oDot(_.oDot(_.n("disp")), _.n("populateFrom")), _.n("payload"))), _.iRet(_.n("ok")));
        }
        else {
            body.push(_.iVar('it', TypeRefPrim.Dict), _.iVar('ok', TypeRefPrim.Bool), _.iVar('val', TypeRefPrim.Any));
            body.push(...this.convOrRet('it', _.n('payload'), TypeRefPrim.Dict));
            for (const fld of tstruct.Fields) {
                const isreadonly = tstruct.fromPrep && tstruct.fromPrep.isPropsOfStruct && fld.fromPrep && fld.fromPrep.readOnly;
                if (fld.Json && ((!fld.Json.Excluded) || isreadonly)) {
                    const tfld = isreadonly ? fld.Type.To : this.typeRefForField(fld.Type, fld.fromPrep && fld.fromPrep.optional);
                    body.push(_.iSet(_.eTup(_.n('val'), _.n('ok')), _.oIdxMay(_.n('it'), _.eLit(fld.Json.Name))), _.iIf(_.n('ok'), [
                        _.iVar(fld.name, tfld),
                        _.iIf(_.oIs(_.n('val')), this.convOrRet(fld.name, _.n('val'), tfld)),
                        _.iSet(_.oDot(_.eThis(), _.n(fld.Name)), isreadonly ? _.eFunc([], fld.Type.To, _.iRet(_.n(fld.name))) : _.n(fld.name)),
                    ], fld.Json.Required ? [_.iRet(_.eLit(false))] : []));
                }
            }
            body.push(_.iRet(_.eLit(true)));
        }
    }
    genMethodImpl_ObjPropsGet(struct, method, _, body) {
        this.genMethodImpl_methodCall(struct, method, _, body, _.oDot(_.eThis(), _.n("disp"), _.n("id")), _.oDot(_.eThis(), _.n("disp"), _.n("impl")));
    }
    genMethodImpl_ObjPropsSet(struct, method, _, body) {
        this.genMethodImpl_methodCall(struct, method, _, body, _.oDot(_.eThis(), _.n("disp"), _.n("id")), _.oDot(_.eThis(), _.n("disp"), _.n("impl")));
    }
    genMethodImpl_ObjMethodCall(struct, method, _, body) {
        if (method.Name === "Dispose")
            body.push(_.iRet(_.eCall(_.oDot(_.eThis(), _.n("disp"), _.n("Dispose")))));
        else
            this.genMethodImpl_methodCall(struct, method, _, body, _.oDot(_.eThis(), _.n("disp"), _.n("id")), _.oDot(_.eThis(), _.n("disp"), _.n("impl")));
    }
    genMethodImpl_ApiMethodCall(typeRef, method, _, body) {
        if (method.IsSubNs)
            body.push(_.iRet(_.eConv({ Name: this.options.idents.typeImpl + method.Name }, _.eCall(_.oDot(_.eThis(), _.n("Impl"))))));
        else
            this.genMethodImpl_methodCall(typeRef, method, _, body);
    }
    genMethodImpl_methodCall(ifaceOrStruct, method, _, body, idVal, impl) {
        const __ = gen.idents(method.fromPrep ? method.fromPrep.args : [], 'msg', 'onresp', 'onret', 'fn', 'fnid', 'fnids', 'payload', 'result', 'args', 'ok', 'ret', 'state');
        const funcfields = method.fromPrep ? gen.argsFuncFields(_.prep, method.fromPrep.args) : [];
        const numargs = method.fromPrep ? method.fromPrep.args.filter(_ => !_.isFromRetThenable).length : method.Args.length;
        if (!impl)
            impl = _.eCall(_.oDot(_.n("Impl")));
        body.push(_.iVar(__.msg, { Maybe: { Name: 'ipcMsg' } }), _.iSet(_.n(__.msg), _.eNew({ Maybe: { Name: 'ipcMsg' } })), _.iSet(_.oDot(_.n(__.msg), _.n('QName')), _.eLit((ifaceOrStruct.name + '.' + (method.fromPrep ? method.fromPrep.name : (method.name && method.name.startsWith("appz")) ? method.name : method.Name)))), _.iSet(_.oDot(_.n(__.msg), _.n("Data")), _.eCollNew(_.eLit(numargs + (idVal ? 1 : 0)))));
        if (idVal)
            body.push(_.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n("Data")), _.eLit("")), idVal));
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
                ]).concat(_.iSet(_.oDot(_.n(argname), _.n(ffname + '_AppzFuncId')), _.eLit("")), _.iVar(__.fn, structfield.Type), _.iSet(_.n(__.fn), _.oDot(_.n(argname), _.n(ffname))), _.iIf(_.oIs(_.n(__.fn)), [_.iLock(_.eThis(), _.iSet(_.oDot(_.n(argname), _.n(ffname + '_AppzFuncId')), _.eCall(_.oDot(impl, _.n('nextFuncId')))), _.iAdd(_.n(__.fnids), _.oDot(_.n(argname), _.n(ffname + '_AppzFuncId'))), _.iSet(_.oIdx(_.oDot(impl, _.n('cbOther')), _.oDot(_.n(argname), _.n(ffname + '_AppzFuncId'))), _.eFunc([{ Name: __.args, Type: { ValsOf: TypeRefPrim.Any } }], { TupOf: [TypeRefPrim.Any, TypeRefPrim.Bool] }, _.iIf(_.oNeq(_.eLit((fnargs.length)), _.eLen(_.n(__.args), true)), [
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
        let evtsubfnids = [];
        const eventlike = (arg) => {
            const fnid = "_fnid_" + arg.Name;
            const tfun = this.typeFunc(arg.Type);
            evtsubfnids.push(fnid);
            const numargs = (isevt && isevt.EvtArgs) ? isevt.EvtArgs.length : tfun.From.length;
            const argtypes = (!(isevt && isevt.EvtArgs)) ? tfun.From : isevt.EvtArgs.map(t => this.b.typeRef(this.b.prep.typeSpec(t)));
            const rettype = tfun ? tfun.To : null;
            let call = _.eCall(_.n(arg.Name), ...argtypes.map((_a, i) => _.n(`_a_${i}_`)));
            let onerrret;
            if (rettype)
                [call, onerrret] = [_.iSet(_.n(__.ret), call), _.eTup(_.eZilch(), _.eLit(false))];
            const handler = _.eFunc([{ Name: "args", Type: { ValsOf: TypeRefPrim.Any } }], rettype ? { TupOf: [TypeRefPrim.Any, TypeRefPrim.Bool] } : TypeRefPrim.Bool, ...[
                _.iVar(__.ok, TypeRefPrim.Bool),
                _.iIf(_.oNeq(_.eLit(numargs), _.eLen(_.n("args"), true)), [
                    _.iRet(rettype ? _.eTup(_.eZilch(), _.n(__.ok)) : _.n(__.ok)),
                ]),
            ].concat(..._.WHEN(rettype, () => [
                _.iVar(__.ret, TypeRefPrim.Any),
            ])).concat(_.EACH(argtypes, (atype, i) => _.LET(`_a_${i}_`, aname => [_.iVar(aname, atype)].concat(this.convOrRet(aname, _.oIdx(_.n("args"), _.eLit(i)), atype, __.ok, onerrret))))).concat(call, _.iRet(rettype ? _.eTup(_.n(__.ret), _.eLit(true)) : _.eLit(true))));
            body.push(_.iVar(fnid, TypeRefPrim.String), _.iIf(_.oIsnt(_.n(arg.Name)), [
                _.eCall(_.n("OnError"), impl, _.eLit(`${ifaceOrStruct.Name}.${method.Name}: the '${arg.Name}' arg (which is not optional but required) was not passed by the caller`), _.eZilch()),
                _.iRet(_.eZilch()),
            ]), _.iSet(_.n(fnid), _.eCall(_.oDot(impl, _.n("nextSub")), rettype ? _.eZilch() : handler, rettype ? handler : _.eZilch())), _.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n("Data")), _.eLit(arg.name)), _.n(fnid)));
        };
        if ((!method.Type) || method.Type.From.length !== 1 || method.Type.To || method.Type.From[0].To)
            throw method.Type;
        const rettype = method.Type.From[0].From[0];
        const isdisp = this.typeOwnOf(rettype, "Disposable");
        const isevt = (method.fromPrep && method.fromPrep.fromOrig) ? method.fromPrep.fromOrig.decl : null;
        if (isevt && isevt.EvtName && isevt.EvtName.length)
            eventlike(method.Args[0]);
        else
            for (const arg of method.Args)
                if ((!arg.fromPrep) || (!arg.fromPrep.isFromRetThenable))
                    if (arg.fromPrep && arg.fromPrep.isCancellationToken !== undefined)
                        body.push(_.iIf(_.oIs(_.n(arg.Name)), [
                            _.iSet(_.oDot(_.n(arg.Name), _.n("impl")), impl),
                            _.iIf(_.oEq(_.eLit(""), _.oDot(_.n(arg.Name), _.n("fnId"))), [
                                _.iLock(_.eThis(), _.iSet(_.oDot(_.n(arg.Name), _.n("fnId")), _.eCall(_.oDot(impl, _.n("nextFuncId"))))),
                            ]),
                            _.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n("Data")), _.eLit(arg.name)), _.oDot(_.n(arg.Name), _.n("fnId"))),
                        ]));
                    else if (this.typeFunc(arg.Type))
                        eventlike(arg);
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
                        if (!(arg.Name === this.options.idents.dispObjCtorArg && this.typeMaybe(arg.Type))) {
                            let set = _.iSet(_.oIdx(_.oDot(_.n(__.msg), _.n("Data")), _.eLit((arg.name && arg.name.length) ? arg.name : arg.Name)), _.n((twinarg && twinarg.altName && twinarg.altName.length) ? twinarg.altName : arg.Name));
                            if (arg.fromPrep && arg.fromPrep.optional && !this.options.unMaybeOutgoingTypes.includes(arg.Type)) {
                                const town = this.typeOwn(this.typeUnMaybe(arg.Type));
                                const tenum = (town && town.Name && town.Name.length) ? this.allEnums.find(_ => _.Name === town.Name) : null;
                                set = _.iIf((tenum && this.options.optionalEnumsZeroNotZilch) ? _.oNeq(_.eLit(0), _.n(arg.Name)) : _.oIs(_.n(arg.Name)), [
                                    set
                                ]);
                            }
                            body.push(set);
                        }
                    }
        body.push(_.iVar(__.onresp, { From: [TypeRefPrim.Any], To: TypeRefPrim.Bool }), _.iVar(__.onret, method.Type.From[0]));
        // const meprop = (method.fromPrep && method.fromPrep.fromOrig) ? method.fromPrep.fromOrig.decl as gen.MemberProp : null
        // const isprop = meprop && meprop.PropType
        const isprops = method.fromPrep && method.fromPrep.isProps;
        const isval = rettype === TypeRefPrim.Bool || rettype === TypeRefPrim.Int || rettype === TypeRefPrim.Real;
        let dsttype = (isval || isprops) ? this.typeUnMaybe(rettype) : rettype;
        if (this.typeMaybe(dsttype) && !this.typeMaybe(dsttype).Maybe)
            dsttype = null;
        body.push(_.iSet(_.n(__.onresp), _.eFunc([{ Name: __.payload, Type: TypeRefPrim.Any }], TypeRefPrim.Bool, ..._.WHEN(dsttype, () => [
            _.iVar(__.ok, TypeRefPrim.Bool),
            _.iVar(__.result, dsttype),
            _.iIf(_.oIs(_.n(__.payload)), this.convOrRet(__.result, _.n(__.payload), dsttype, __.ok), _.WHEN(isdisp || isval || isprops, () => [_.iRet(_.eLit(false))], () => [])),
            _.iBlock(..._.WHEN(isdisp, () => [_.iIf(_.oIs(_.n(__.onret)), [
                    _.eCall(_.n(__.onret), _.eCall(_.oDot(_.n(__.result), _.n('bind')), ...[impl].concat(...evtsubfnids.map(fnid => _.n(fnid))))),
                ])], () => (!(method.IsObjCtor && method.IsObjCtor.length))
                ? [_.iIf(_.oIs(_.n(__.onret)), [
                        _.eCall(_.n(__.onret), _.n(__.result)),
                    ])]
                : _.WHEN(method.Args.some(_ => _.Name === this.options.idents.dispObjCtorArg && this.typeMaybe(_.Type)), () => [_.iIf(_.oIs(_.n(this.options.idents.dispObjCtorArg)), [
                        _.eCall(_.oDot(_.n(__.result), _.n("Set")), _.oDeref(_.n(this.options.idents.dispObjCtorArg))),
                    ])], () => []).concat(...[_.eCall(_.eCall(_.oDot(_.n(__.result), _.n("Get"))), _.eFunc([{ Name: __.state, Type: { Name: method.IsObjCtor + "State" } }], null, _.iIf(_.oIs(_.n(__.onret)), [
                        _.eCall(_.n(__.onret), _.n(__.result), _.n(__.state)),
                    ])))]))),
            _.iRet(_.eLit(true)),
        ], () => [
            _.iIf(_.oIs(_.n(__.payload)), [_.iRet(_.eLit(false))]),
            _.iIf(_.oIs(_.n(__.onret)), [_.eCall(_.n(__.onret))]),
            _.iRet(_.eLit(true)),
        ]))));
        if (!funcfields.length)
            body.push(_.eCall(_.oDot(impl, _.n('send')), _.n(__.msg), _.n(__.onresp)));
        else
            body.push(_.eCall(_.oDot(impl, _.n('send')), _.n(__.msg), _.eFunc([{ Name: __.payload, Type: TypeRefPrim.Any }], TypeRefPrim.Bool, _.iIf(_.oNeq(_.eLen(_.n(__.fnids), false), _.eLit(0)), [
                _.iLock(_.eThis(), _.iFor(_.n(__.fnid), _.n(__.fnids), _.iDel(_.oDot(impl, _.n('cbOther')), _.n(__.fnid)))),
            ]), _.iRet(_.oOr(_.oIsnt(_.n(__.onresp)), _.eCall(_.n(__.onresp), _.n(__.payload)))))));
        body.push(_.iRet(_.eFunc(method.Type.From.map((_, i) => ({ Name: "a" + i, Type: _ })), null, _.iSet(_.n(__.onret), _.n("a0")))));
    }
    emitIntro() {
        return this.lines("#", "# NOTE, this is not a CoffeeScript file: the .coffee extension is solely", "# for the convenience of syntax-highlighting in editors & source viewers.", "#", "# A debug-print of our in-memory-only intermediate-representation prepared", "# for code-gens that choose to inherit from `gen-ast.Gen` to stay lean &", "# mean & low on LoCs for maintainability & ease of porting & consistency.", "#", "# Again, all the below is just a debug-print: it's never to be parsed (and", "# the in-mem IR never to be interpreted, other than for actual code-gen).", "# Just a dump of all the structures available to a code-gen for emitting.", "#", "", "");
    }
    emitOutro() {
        return this.lines("# override `emitOutro` for this trailing part..");
    }
    onBeforeEmitImpls(_structs) { }
    onAfterEmitImpls(_structs) { }
    gen(prep) {
        this.resetState();
        this.isDemos = false;
        const build = (this.b = new Builder(prep, this));
        const ifacetop = {
            name: prep.fromOrig.moduleName,
            Name: this.nameRewriters.types.interfaces(prep.fromOrig.moduleName),
            Docs: build.docs(gen.docs(prep.fromOrig.fromOrig)),
            Methods: prep.interfaces.filter(_ => _.fromOrig.kind === ts.SyntaxKind.ModuleDeclaration).map((_) => ({
                name: _.name,
                Name: this.nameRewriters.methods(_.name),
                Docs: build.docs(gen.docs(_.fromOrig)),
                Type: build.typeRef(this.nameRewriters.types.interfaces(_.name)),
                Args: [],
            })),
            IsTop: true,
        };
        this.allEnums = prep.enums.map(_ => build.fromEnum(_));
        this.allInterfaces = [ifacetop].concat(...prep.interfaces.map(_ => build.fromInterface(_)));
        for (const ns in prep.fromOrig.namespaces)
            if (ns.includes('.')) {
                const parts = ns.split('.');
                const iface_mod = this.allInterfaces.find(_ => _.name === parts[0] || (_.fromPrep && _.fromPrep.name === parts[0]));
                const iface_sub = this.allInterfaces.find(_ => _.name === parts[parts.length - 1] || (_.fromPrep && _.fromPrep.name === parts[parts.length - 1]));
                if (!(iface_mod && iface_sub))
                    throw ns;
                iface_mod.Methods.push({
                    Name: this.nameRewriters.methods(parts.slice(1).join('_')),
                    Args: [], Type: iface_sub, Docs: iface_sub.Docs, IsSubNs: true,
                });
            }
        this.allStructs = {};
        for (const it of prep.structs) {
            const struct = build.fromStruct(it);
            this.allStructs[struct.Name] = struct;
        }
        { // set all structs' Outgoing & Incoming bools only now that all ifaces and structs are complete
            const traversed = {};
            const traverse = (t, forIncoming) => {
                this.typeRefTraverse(t, argtype => {
                    const tnamed = this.typeOwn(argtype);
                    if (tnamed) {
                        const tstruct = this.allStructs[tnamed.Name];
                        if (tstruct && !traversed[tnamed.Name + forIncoming]) {
                            traversed[tnamed.Name + forIncoming] = true;
                            if (forIncoming)
                                tstruct.IsIncoming = true;
                            else
                                tstruct.IsOutgoing = true;
                            for (const fld of tstruct.Fields)
                                traverse(fld.Type, this.typeFunc(fld.Type) ? false : forIncoming);
                        }
                    }
                    return undefined;
                });
            };
            let evtsub;
            for (const iface of this.allInterfaces)
                for (const method of iface.Methods) {
                    const isevtsub = (method.fromPrep && method.fromPrep.fromOrig && (evtsub = method.fromPrep.fromOrig.decl) && evtsub.EvtName && evtsub.EvtName.length) ? true : false;
                    for (const arg of method.Args)
                        traverse(arg.Type, (arg.fromPrep && arg.fromPrep.isFromRetThenable) || isevtsub);
                    if (method.Type)
                        traverse(method.Type, true);
                }
        }
        for (const structname in this.allStructs) {
            const struct = this.allStructs[structname];
            if (struct.IsOutgoing) {
                for (const fld of struct.Fields) {
                    this.typeRefTraverse(fld.Type, t => {
                        const tmay = this.typeMaybe(t);
                        if (tmay && this.options.unMaybeOutgoingTypes.some(_ => this.typeRefEq(_, tmay.Maybe)))
                            return tmay.Maybe;
                        return undefined;
                    }, tref => {
                        if (struct.fromPrep && struct.fromPrep.isPropsOfStruct) {
                            fld.Type = tref;
                            fld.Json.Required = false;
                        }
                    });
                }
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
                    : this.genMethodImpl_ApiMethodCall);
        this.onAfterEmitImpls(false);
        this.onBeforeEmitImpls(true);
        for (const structname in this.allStructs) {
            let tfun;
            const struct = this.allStructs[structname];
            if (struct && struct.fromPrep && struct.fromPrep.isDispObj) {
                for (const field of struct.fromPrep.fields) {
                    const orig = field.fromOrig;
                    if (tfun = gen.typeFun(field.typeSpec)) {
                        const isevt = (ts.isPropertySignature(orig) && ts.isTypeReferenceNode(orig.type) && orig.type.typeName.getText() === "Event");
                        const prepargs = isevt
                            ? [{ name: "handler", optional: false, typeSpec: field.typeSpec.From[0] }]
                            : (tfun[0].map((_, i) => gen.argFrom(_, orig.parameters[i])));
                        if (isevt) {
                            const tf = gen.typeFun(prepargs[0].typeSpec);
                            if (tf)
                                prepargs[0].typeSpec = { From: tf[0].concat(struct.Name + "State"), To: tf[1] };
                        }
                        let tret = tfun[1];
                        if (!gen.typeProm(tret))
                            if (field.name !== "dispose" && !tret)
                                tret = struct.Name + "State";
                        tret = { Thens: [tret] };
                        prepargs.push({ name: "onDone", isFromRetThenable: true, optional: true, typeSpec: tret });
                        const me = {
                            name: field.name, Name: this.nameRewriters.methods(field.name),
                            Args: prepargs.map(_ => {
                                const arg = this.b.fromArg(_);
                                const tmay = this.typeMaybe(arg.Type);
                                if (_.optional && tmay && tmay.Maybe && this.options.unMaybeOutgoingTypes.includes(tmay.Maybe))
                                    arg.Type = tmay.Maybe;
                                return arg;
                            }),
                            Type: null, IsObjEvt: isevt,
                            Docs: this.b.docs(gen.docs(orig), [], true, true),
                            fromPrep: { args: prepargs, name: field.name, nameOrig: orig.getText() }
                        };
                        me.Type = { From: [this.typeUnMaybe(me.Args[me.Args.length - 1].Type)], To: null };
                        me.Args = me.Args.slice(0, me.Args.length - 1);
                        this.ensureMethodDocsArgsAndRet(me);
                        this.emitMethodImpl(struct, me, this.genMethodImpl_ObjMethodCall);
                    }
                }
                let propsfields = struct.fromPrep.fields.filter(_ => !gen.typeFun(_.typeSpec));
                if (propsfields && propsfields.length) {
                    const nameget = gen.pickName("get", this.options.objPropsGetSetNamePicks, struct.fromPrep.fields), nameset = gen.pickName("set", this.options.objPropsGetSetNamePicks, struct.fromPrep.fields);
                    const mget = {
                        name: "appzObjPropsGet", Name: this.nameRewriters.methods(nameget), Args: [],
                        Type: { From: [{ From: [{ Name: struct.Name + "State" }], To: null }], To: null },
                        Docs: [{ Lines: ["Obtains this `" + struct.Name + "`'s current property value" + (propsfields.length > 1 ? 's' : '') + " for: `" + propsfields.map(_ => _.name).join("`, `") + "`."] }]
                    };
                    this.state.genPopulateFor[struct.Name + "State"] = true;
                    this.emitMethodImpl(struct, mget, this.genMethodImpl_ObjPropsGet);
                    propsfields = propsfields.filter(_ => !_.readOnly);
                    if (propsfields.length) {
                        const mset = {
                            name: "appzObjPropsSet", Name: this.nameRewriters.methods(nameset),
                            Args: [{ Name: "allUpdates", Type: { Name: struct.Name + "State" } }],
                            Type: { From: [{ From: [null], To: null }], To: null },
                            Docs: [{ Lines: ["Updates this `" + struct.Name + "`'s current property value" + (propsfields.length > 1 ? 's' : '') + " for: `" + propsfields.map(_ => _.name).join("`, `") + "`."] }]
                        };
                        this.emitMethodImpl(struct, mset, this.genMethodImpl_ObjPropsSet);
                    }
                }
            }
        }
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
        if (this.options.demoOutFilePath && this.options.demoOutFilePath.length)
            this.genDemos();
    }
    genDemos() {
        this.isDemos = true;
        this.src = "";
        this.resetState();
        new gen_demos.GenDemos(this, this.b, "demo_Window_ShowInputBox").genDemos();
        node_fs.writeFileSync(this.options.demoOutFilePath, this.src);
    }
    typeUnMaybe(it) {
        const me = this.typeMaybe(it);
        return me ? this.typeUnMaybe(me.Maybe) : it;
    }
    typeOwn(it) {
        const me = it;
        return (me && me.Name && me.Name.length) ? me : null;
    }
    typeOwnOf(it, name) {
        const me = this.typeOwn(this.typeUnMaybe(it));
        return me && me.Name === name;
    }
    typeMaybe(it) {
        const me = it;
        return (me && me.Maybe !== undefined) ? me : null;
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
