"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const ts = require("typescript");
const dbgJsonPrintEnums = false, dbgJsonPrintStructs = false, dbgJsonPrintIfaces = false;
const tmpSuppressObjMembers = {
    "QuickPick": ["onDidTriggerButton", "buttons"],
    "InputBox": ["onDidTriggerButton", "buttons"],
};
exports.docStrs = {
    extBaggage: "Free-form custom data, preserved across a roundtrip.",
};
exports.idents = {
    typeSuffBag: "State",
    methodNsProps: "AllProperties",
    methodBagFetch: "ReFetch",
    methodBagPublish: "ApplyChanges",
    methodObjBagPull: "__appzObjBagPullFromPeer__",
    methodObjBagPush: "__appzObjBagPushToPeer__",
    methodLoadFrom: "__loadFromJsonish__",
    methodImpl: "Impl",
    argHandler: "handler",
    argListener: "listener",
    argPayload: "payload",
    argArgs: "args",
    argUpd: "allUpdates",
    fldMyTags: "my",
    fldDisp: "__disp__",
    fldImpl: "impl",
    fldBagHolder: "__holder__",
    fldSuffFuncId: "_AppzFuncId",
    fldDispObjBag: "Cfg",
    varOk: "ok",
    varRes: "result",
    varRet: "ret",
    varIt: "it",
    varVal: "val",
    varMsg: "msg",
    varFn: "fn",
    varFnid: "fnid",
    varFnids: "fnids",
    varSuffFnid: "FnId",
    varOnResp: "onresp",
    varOnRet: "onret",
    coreTypeCancel: "Cancel",
    coreTypeDisp: "Disposable",
    coreTypeMsg: "ipcMsg",
    coreFldId: "id",
    coreFldFnId: "fnId",
    coreFldMsgQn: "QName",
    coreFldMsgData: "Data",
    coreFldCbOther: "cbOther",
    coreMethodNextId: "nextFuncId",
    coreMethodNextSub: "nextSub",
    coreMethodAddSub: "addSub",
    coreMethodBind: "bind",
    coreMethodSend: "send",
    coreMethodOnErr: "OnError",
};
class Prep {
    constructor(job) {
        this.enums = [];
        this.structs = [];
        this.interfaces = [];
        this.fromOrig = job;
        for (const enumjob of job.enums)
            this.addEnum(enumjob);
        for (const structjob of job.structs.filter(_ => job.mereBaseTypes.includes(_.decl.name.text)))
            this.addStruct(structjob);
        for (const structjob of job.structs.filter(_ => !job.mereBaseTypes.includes(_.decl.name.text)))
            this.addStruct(structjob);
        this.structs = this.structs.filter(_ => !job.mereBaseTypes.includes(_.fromOrig.decl.name.text));
        for (const funcjob of job.funcs)
            this.addFunc(funcjob);
        for (const iface of this.interfaces) {
            const propmethods = [];
            for (const method of iface.methods) {
                let n = 0;
                for (const arg of method.args)
                    if (arg.typeSpec === 'CancellationToken')
                        [arg.isCancellationToken, arg.typeSpec] = [n++, exports.idents.coreTypeCancel];
                const fromprop = method.fromOrig.decl;
                if (fromprop && fromprop.PropType)
                    propmethods.push(method);
            }
            if (propmethods.length > 1) {
                const struct = {
                    isPropsOfIface: iface, name: iface.name + exports.idents.typeSuffBag, funcFields: [],
                    fields: propmethods.map(me => ({
                        fromOrig: me.fromOrig.decl,
                        name: me.name,
                        typeSpec: typeProm(me.args[0].typeSpec)[0],
                        optional: true,
                        isExtBaggage: false,
                    })),
                };
                this.structs.push(struct);
                iface.methods.push({
                    name: exports.idents.methodNsProps,
                    isProps: struct, args: [{
                            isFromRetThenable: true, name: "?", optional: false,
                            typeSpec: { Thens: [struct.name] },
                        }],
                });
            }
        }
        for (const struct of this.structs) {
            let isargout = false, isargin = false;
            for (const iface of this.interfaces)
                if (isargin && isargout)
                    break;
                else
                    for (const method of iface.methods)
                        if (isargin && isargout)
                            break;
                        else
                            for (const arg of method.args)
                                if (isargin && isargout)
                                    break;
                                else if (typeRefersTo(arg.typeSpec, struct.name)) {
                                    const isinfunc = typeFun(arg.typeSpec) ? true : false;
                                    if (arg.isFromRetThenable || isinfunc)
                                        isargin = true;
                                    if (!arg.isFromRetThenable)
                                        isargout = !isinfunc;
                                }
            if (((struct.isOutgoing = struct.isOutgoing || isargout) && (struct.isIncoming = struct.isIncoming || isargin)) && !(struct.isPropsOfStruct || struct.isPropsOfIface))
                struct.fields.push({ name: exports.idents.fldMyTags, isExtBaggage: true, optional: true, typeSpec: ScriptPrimType.Dict });
            if (struct.isIncoming && struct.fields.find(_ => typeFun(_.typeSpec))) {
                struct.isDispObj = true;
                if (!struct.fields.some(_ => _.name === "dispose"))
                    struct.fields.push({ name: "dispose", typeSpec: { From: [], To: null } });
                const propfields = struct.fields.filter(_ => (!typeProm(_.typeSpec)) && !typeFun(_.typeSpec));
                if (propfields.length) {
                    const propstruct = {
                        funcFields: [], name: struct.name + exports.idents.typeSuffBag, isPropsOfStruct: struct,
                        fromOrig: struct.fromOrig, isIncoming: true, isOutgoing: true,
                        fields: propfields.map(_ => {
                            _.optional = true;
                            for (const tname of typeNames(_.typeSpec)) {
                                const tstruct = this.structs.find(_ => _.name === tname);
                                if (tstruct)
                                    tstruct.isOutgoing = tstruct.isIncoming = true;
                            }
                            return _;
                        }),
                    };
                    this.structs.push(propstruct);
                }
            }
        }
        const printjson = (_) => console.log(JSON.stringify(_, function (key, val) {
            return (key === 'parent') ? null : val;
        }, 2));
        if (dbgJsonPrintEnums)
            printjson(this.enums);
        if (dbgJsonPrintStructs)
            printjson(this.structs);
        if (dbgJsonPrintIfaces)
            printjson(this.interfaces);
    }
    addEnum(it) {
        if (seemsDeprecated(it.decl))
            return;
        const qname = this.qName(it);
        this.enums.push({
            fromOrig: it,
            name: qname.slice(1).join('_'),
            enumerants: it.decl.members.filter(_ => !seemsDeprecated(_)).map(_ => ({
                fromOrig: _,
                name: _.name.getText(),
                value: parseInt(_.initializer.getText())
            }))
        });
    }
    addStruct(it) {
        if (seemsDeprecated(it.decl))
            return;
        const addMember = (_) => {
            if (_.name && !seemsDeprecated(_)) {
                const tmpsuppress = tmpSuppressObjMembers[it.qName.slice(it.qName.indexOf('.') + 1)];
                if (tmpsuppress && tmpsuppress.length && tmpsuppress.includes(_.name.getText()))
                    return;
                let tspec = null;
                const mtyped = _;
                const mtparams = (_.kind === ts.SyntaxKind.MethodSignature || _.kind === ts.SyntaxKind.MethodDeclaration) ? _ : null;
                if ((!mtparams) && mtyped && mtyped.type)
                    tspec = this.typeSpec(mtyped.type, it.decl.typeParameters);
                else if (mtparams && ts.isInterfaceDeclaration(it.decl))
                    tspec = this.typeSpec(_, combine(it.decl.typeParameters, mtparams.typeParameters));
                if (tspec) {
                    if (typeof tspec === "string" && this.fromOrig.mereBaseTypes.includes(tspec))
                        this.fromOrig.mereBaseTypes = this.fromOrig.mereBaseTypes.filter(tname => tname !== tspec);
                    let field = {
                        fromOrig: _,
                        name: _.name.getText(),
                        typeSpec: tspec,
                        optional: (ts.isTypeElement(_) && _.questionToken) ? true : false,
                        readOnly: (_.modifiers && _.modifiers.find(_ => _.getText() === 'readonly')) ? true : false,
                        isExtBaggage: false,
                    };
                    if (ts.isPropertySignature(_) && ts.isTypeReferenceNode(_.type) && _.type.typeName.getText() === "Event")
                        field.typeSpec = { From: [{ From: _.type.typeArguments.map(_ => this.typeSpec(_, combine(it.decl.typeParameters, mtparams ? mtparams.typeParameters : []))).filter(_ => _ ? true : false), To: null }], To: exports.idents.coreTypeDisp };
                    fields.push(field);
                }
            }
        };
        const qname = this.qName(it);
        const fields = [];
        for (const _ of it.decl.members)
            addMember(_);
        if (it.decl.heritageClauses && it.decl.heritageClauses.length)
            for (const hc of it.decl.heritageClauses)
                for (const hct of hc.types) {
                    const tbase = this.structs.find(_ => _.name === hct.getText());
                    if (tbase)
                        fields.push(...tbase.fields);
                }
        this.structs.push({
            fromOrig: it, isOutgoing: false, isIncoming: false,
            name: qname.slice(1).join('_'),
            fields: fields,
            funcFields: []
        });
        const struct = this.structs[this.structs.length - 1];
        struct.funcFields = struct.fields.filter(_ => typeFun(_.typeSpec)).map(_ => _.name);
    }
    addFunc(it) {
        if (seemsDeprecated(it.decl))
            return;
        const qname = this.qName(it);
        const ifacename = qname[qname.length - 2];
        let iface = this.interfaces.find(_ => _.name === ifacename);
        if (!iface)
            this.interfaces.push(iface = { name: ifacename, methods: [], fromOrig: it.ifaceNs });
        const declf = it.decl, declp = it.decl, decle = it.decl;
        const me = {
            fromOrig: it,
            nameOrig: qname[qname.length - 1],
            name: qname[qname.length - 1] + ((it.overload > 0) ? it.overload : ''),
            args: (declf && declf.parameters && declf.parameters.length) ?
                declf.parameters.filter(_ => _.name.getText() !== 'thisArg' && !seemsDeprecated(_)).map(_ => ({
                    fromOrig: _,
                    name: _.name.getText(),
                    typeSpec: this.typeSpec(_.type, declf.typeParameters),
                    optional: (_.questionToken && _.type.kind !== ts.SyntaxKind.BooleanKeyword) ? true : false,
                    isFromRetThenable: false,
                    spreads: _.dotDotDotToken ? true : false,
                })) : [],
        };
        iface.methods.push(me);
        if (decle && decle.EvtName && decle.EvtName.length) {
            const evtargs = [];
            for (const _ of decle.EvtArgs) {
                const typespec = this.typeSpec(_);
                evtargs.push(typespec);
                if (typeof typespec === 'string') {
                    const struct = this.structs.find(_ => _.name === typespec);
                    if (struct)
                        struct.isIncoming = true;
                }
            }
            me.args.push({
                name: exports.idents.argListener,
                optional: false, typeSpec: { From: decle.EvtArgs.map((_, i) => evtargs[i]), To: null },
            });
        }
        let tret = (declp && declp.PropType) ? this.typeSpec(declp.PropType) :
            (decle && decle.EvtName && decle.EvtName.length) ? exports.idents.coreTypeDisp :
                this.typeSpec(declf.type, declf.typeParameters);
        if (typeof tret === 'string') {
            const struct = this.structs.find(_ => _.name === tret);
            if (struct)
                struct.isIncoming = true;
        }
        const tprom = typeProm(tret);
        if (!(tprom && tprom.length))
            tret = { Thens: [tret] };
        if (tret)
            me.args.push({ name: "?", typeSpec: tret, isFromRetThenable: true, optional: true });
    }
    qName(memJob) {
        const qname = memJob.qName.split('.');
        if ((!qname) || (!qname.length) || (qname.length < 2) || qname[0] !== this.fromOrig.moduleName)
            throw memJob.qName;
        return qname;
    }
    typeSpec(tNode, tParams) {
        if (ts.isTypeElement(tNode)) {
            if (ts.isPropertySignature(tNode)) {
                return this.typeSpec(tNode.type, tParams);
            }
            else if (ts.isMethodSignature(tNode) || ts.isCallSignatureDeclaration(tNode) || ts.isConstructSignatureDeclaration(tNode) || ts.isIndexSignatureDeclaration(tNode)) {
                const tps = combine(tParams, tNode.typeParameters);
                const rfun = {
                    From: tNode.parameters.map(_ => this.typeSpec(_.type, tps)),
                    To: this.typeSpec(tNode.type, tps)
                };
                return rfun;
            }
            else
                throw tNode.getText();
        }
        switch (tNode.kind) {
            case ts.SyntaxKind.VoidKeyword:
                return null;
            case ts.SyntaxKind.AnyKeyword:
                return ScriptPrimType.Any;
            case ts.SyntaxKind.StringKeyword:
                return ScriptPrimType.String;
            case ts.SyntaxKind.NumberKeyword:
                return ScriptPrimType.Number;
            case ts.SyntaxKind.BooleanKeyword:
                return ScriptPrimType.Boolean;
            case ts.SyntaxKind.TrueKeyword:
                return ScriptPrimType.BooleanTrue;
            case ts.SyntaxKind.FalseKeyword:
                return ScriptPrimType.BooleanFalse;
            case ts.SyntaxKind.NullKeyword:
                return ScriptPrimType.Null;
            case ts.SyntaxKind.UndefinedKeyword:
                return ScriptPrimType.Undefined;
            case ts.SyntaxKind.ArrayType:
                const rarr = {
                    ArrOf: this.typeSpec(tNode.elementType, tParams)
                };
                return rarr;
            case ts.SyntaxKind.TupleType:
                const rtup = {
                    TupOf: tNode.elementTypes.map(_ => this.typeSpec(_, tParams))
                };
                return rtup;
            case ts.SyntaxKind.UnionType:
                const tunion = tNode;
                const rsum = {
                    SumOf: tunion.types.map(_ => this.typeSpec(_, tParams))
                };
                return rsum;
            case ts.SyntaxKind.IntersectionType:
                const rmul = {
                    ProdOf: tNode.types.map(_ => this.typeSpec(_, tParams))
                };
                return rmul;
            case ts.SyntaxKind.TypeLiteral:
                const robj = {
                    Members: tNode.members.map(_ => [_.name ? _.name.getText() : '', this.typeSpec(_, tParams)])
                };
                return robj;
            case ts.SyntaxKind.TypeReference:
                const tref = tNode, tname = tref.typeName.getText();
                const tparam = (!tParams) ? null : tParams.find(_ => _.name.getText() === tname);
                if (tparam) {
                    const tnode = ts.getEffectiveConstraintOfTypeParameter(tparam);
                    return tnode ? this.typeSpec(tnode, tParams) : ScriptPrimType.Any;
                }
                else if (tname === 'Thenable') {
                    const tprom = {
                        Thens: tref.typeArguments.map(_ => this.typeSpec(_, tParams))
                    };
                    return tprom;
                }
                else if (tname === 'ReadonlyArray' && tref.typeArguments && tref.typeArguments.length === 1) {
                    const tarr = {
                        ArrOf: this.typeSpec(tref.typeArguments[0], tParams)
                    };
                    return tarr;
                }
                else if (tname === 'GlobPattern')
                    return ScriptPrimType.String;
                return tname;
            case ts.SyntaxKind.LiteralType:
                const lit = tNode.literal;
                switch (lit.kind) {
                    case ts.SyntaxKind.BooleanKeyword:
                        return ScriptPrimType.Boolean;
                    case ts.SyntaxKind.TrueKeyword:
                        return ScriptPrimType.BooleanTrue;
                    case ts.SyntaxKind.FalseKeyword:
                        return ScriptPrimType.BooleanFalse;
                }
                throw lit.kind + "\t" + lit.getText();
            case ts.SyntaxKind.FunctionType:
                const tfun = tNode;
                if (tfun) {
                    const tparams = combine(tParams, tfun.typeParameters);
                    return {
                        From: tfun.parameters.map(_ => {
                            const ret = this.typeSpec(_.type, tparams);
                            const rarr = ret;
                            if (rarr && rarr.ArrOf && _.dotDotDotToken)
                                rarr.Spreads = true;
                            return ret;
                        }),
                        To: this.typeSpec(tfun.type, tparams)
                    };
                }
                throw tNode;
            default:
                throw tNode.kind + "\t" + tNode.getText();
        }
    }
}
exports.Prep = Prep;
var ScriptPrimType;
(function (ScriptPrimType) {
    ScriptPrimType[ScriptPrimType["Any"] = 121] = "Any";
    ScriptPrimType[ScriptPrimType["String"] = 139] = "String";
    ScriptPrimType[ScriptPrimType["Number"] = 136] = "Number";
    ScriptPrimType[ScriptPrimType["Boolean"] = 124] = "Boolean";
    ScriptPrimType[ScriptPrimType["BooleanTrue"] = 103] = "BooleanTrue";
    ScriptPrimType[ScriptPrimType["BooleanFalse"] = 88] = "BooleanFalse";
    ScriptPrimType[ScriptPrimType["Undefined"] = 142] = "Undefined";
    ScriptPrimType[ScriptPrimType["Null"] = 97] = "Null";
    ScriptPrimType[ScriptPrimType["Dict"] = 189] = "Dict";
})(ScriptPrimType = exports.ScriptPrimType || (exports.ScriptPrimType = {}));
class Gen {
    constructor(outFilePath) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePath[0], outFilePath[1]];
        this.resetState();
    }
    resetState() {
        this.state = { genPopulateFor: {} };
    }
    doNotEditComment(moniker) {
        return "DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-" + moniker + ".ts via github.com/metaleap/vscode-appz/src/gen/main.ts";
    }
    caseLo(name) {
        return caseLo(name);
    }
    caseUp(name) {
        return caseUp(name);
    }
    genDocSrc(lnPref, docLns) {
        let src = "";
        if (docLns && docLns.length)
            src = docLns.map(_ => lnPref + _).join('\n') + '\n';
        return src;
    }
    parensIfJoin(arr, joinSep = ', ') {
        return (arr && arr.length === 1) ? arr[0] : ('(' + arr.join(joinSep) + ')');
    }
    writeFileSync(pkgName, src) {
        node_fs.writeFileSync(`${this.outFilePathPref}${this.caseLo(pkgName)}${this.outFilePathSuff}`, src);
    }
}
exports.Gen = Gen;
function typeArr(typeSpec) {
    const tarr = typeSpec;
    return (tarr && tarr.ArrOf) ? tarr.ArrOf : null;
}
exports.typeArr = typeArr;
function typeArrSpreads(typeSpec) {
    const tarr = typeSpec;
    return (tarr && tarr.ArrOf) ? tarr.Spreads : false;
}
exports.typeArrSpreads = typeArrSpreads;
function typeTup(typeSpec) {
    const ttup = typeSpec;
    return (ttup && ttup.TupOf) ? ttup.TupOf : null;
}
exports.typeTup = typeTup;
function typeSum(typeSpec) {
    const tsum = typeSpec;
    return (tsum && tsum.SumOf) ? tsum.SumOf : null;
}
exports.typeSum = typeSum;
function typeMul(typeSpec) {
    const tmul = typeSpec;
    return (tmul && tmul.ProdOf) ? tmul.ProdOf : null;
}
exports.typeMul = typeMul;
function typeObj(typeSpec) {
    const tobj = typeSpec;
    return (tobj && tobj.Members) ? tobj.Members : null;
}
exports.typeObj = typeObj;
function typeSumOf(typeSpec, sumOf) {
    const tsum = typeSum(typeSpec);
    return tsum && tsum.length && tsum.some(_ => _ === sumOf);
}
exports.typeSumOf = typeSumOf;
function typePromOf(typeSpec, promOf) {
    const tprom = typeProm(typeSpec);
    return (tprom && tprom.length && (promOf ? (tprom[0] === promOf) : (tprom[0] === ScriptPrimType.Boolean || tprom[0] === ScriptPrimType.String || tprom[0] === ScriptPrimType.Number)));
}
exports.typePromOf = typePromOf;
function typeProm(typeSpec) {
    const tprom = typeSpec;
    return (tprom && tprom.Thens) ? tprom.Thens : null;
}
exports.typeProm = typeProm;
function typeNamesGather(typeSpec, dict) {
    if (typeof typeSpec === 'string')
        dict[typeSpec] = true;
    else {
        const tarr = typeArr(typeSpec);
        if (tarr)
            return typeNamesGather(tarr, dict);
        const ttup = typeTup(typeSpec);
        if (ttup)
            return ttup.forEach(_ => typeNamesGather(_, dict));
        const tsum = typeSum(typeSpec);
        if (tsum)
            return tsum.forEach(_ => typeNamesGather(_, dict));
        const tmul = typeMul(typeSpec);
        if (tmul)
            return tmul.forEach(_ => typeNamesGather(_, dict));
        const tobj = typeObj(typeSpec);
        if (tobj)
            return tobj.forEach(_ => typeNamesGather(_[1], dict));
        const tfun = typeFun(typeSpec);
        if (tfun)
            return tfun[0].concat(tfun[1]).forEach(_ => typeNamesGather(_, dict));
        const tprom = typeProm(typeSpec);
        if (tprom)
            return tprom.forEach(_ => typeNamesGather(_, dict));
    }
}
function typeNames(typeSpec) {
    const dict = {};
    typeNamesGather(typeSpec, dict);
    const me = [];
    for (const name in dict)
        if (!me.includes(name))
            me.push(name);
    return me;
}
exports.typeNames = typeNames;
function typeFun(typeSpec) {
    const tfun = typeSpec;
    return (tfun && tfun.From) ? [tfun.From, tfun.To] : null;
}
exports.typeFun = typeFun;
function typeRefersTo(typeSpec, name) {
    const tarr = typeArr(typeSpec);
    if (tarr)
        return typeRefersTo(tarr, name);
    const ttup = typeTup(typeSpec);
    if (ttup)
        return ttup.some(_ => typeRefersTo(_, name));
    const tsum = typeSum(typeSpec);
    if (tsum)
        return tsum.some(_ => typeRefersTo(_, name));
    const tmul = typeMul(typeSpec);
    if (tmul)
        return tmul.some(_ => typeRefersTo(_, name));
    const tobj = typeObj(typeSpec);
    if (tobj)
        return tobj.some(_ => typeRefersTo(_[1], name));
    const tfun = typeFun(typeSpec);
    if (tfun)
        return typeRefersTo(tfun[1], name) || tfun[0].some(_ => typeRefersTo(_, name));
    const tprom = typeProm(typeSpec);
    if (tprom)
        return tprom.some(_ => typeRefersTo(_, name));
    return typeSpec === name;
}
function argFrom(typeSpec, orig) {
    return {
        typeSpec: typeSpec, name: orig.name.getText(), fromOrig: orig,
        optional: orig.questionToken ? true : false,
        spreads: orig.dotDotDotToken ? true : false,
    };
}
exports.argFrom = argFrom;
function argsFuncFields(prep, args) {
    const funcfields = [];
    for (const arg of args) {
        let targ = arg.typeSpec;
        const tmul = typeMul(targ);
        if (tmul && tmul.length)
            targ = tmul[0];
        if (typeof targ === 'string')
            for (const struct of prep.structs.filter(_ => _.name === targ))
                if (struct.funcFields && struct.funcFields.length)
                    for (const funcfield of struct.funcFields)
                        funcfields.push({ arg: arg, struct: struct, name: funcfield });
    }
    return funcfields;
}
exports.argsFuncFields = argsFuncFields;
function docFrom(from) {
    let ret = null, txt, argname;
    if (from) {
        ret = { fromOrig: from, subs: [], lines: [] };
        if (txt = from.comment) {
            if (ts.isJSDocParameterTag(from)) {
                if ('thisArg' === (argname = from.name.getText()))
                    return null;
                ret.isForArg = argname;
            }
            else if (ts.isJSDocReturnTag(from))
                ret.isForRet = true;
            ret.lines.push(...txt.split('\n').filter(_ => _ !== null && (!(_.startsWith('[') && _.endsWith(')') && _.includes('](#')))));
        }
        from.forEachChild(_ => {
            const sub = docFrom(_);
            if (sub)
                ret.subs.push(sub);
        });
    }
    let relined = false;
    ret.lines = ret.lines.map(_ => {
        if (_.startsWith("```")) {
            relined = true;
            return ("\n" + _ + "\n");
        }
        return _.replace("](#", "](https://code.visualstudio.com/api/references/vscode-api#");
    });
    if (relined)
        ret.lines = ret.lines.join("\n").split("\n");
    return ret;
}
function docs(from) {
    const docs = jsDocs(from), ret = [];
    if (docs && docs.length)
        for (const _ of docs.map(_ => docFrom(_)))
            if (_)
                ret.push(_);
    return ret;
}
exports.docs = docs;
function docPrependArgOrRetName(doc, ln, retFallback, pref, suff, argNameRewrite = undefined) {
    let isfor = doc.isForArg;
    if (isfor && isfor.length)
        isfor = argNameRewrite ? argNameRewrite(isfor) : isfor;
    else if (doc.isForRet)
        isfor = retFallback;
    return (!(isfor && isfor.length)) ? ln : (pref + isfor + suff + ln);
}
exports.docPrependArgOrRetName = docPrependArgOrRetName;
function docsTraverse(docs, on) {
    for (const doc of docs) {
        on(doc);
        docsTraverse(doc.subs, on);
    }
}
exports.docsTraverse = docsTraverse;
function jsDocs(from) {
    while (from) {
        const have = from;
        if (have && have.jsDoc && have.jsDoc.length)
            return have.jsDoc;
        from = from.parent;
    }
    return null;
}
function combine(...arrs) {
    const all = [];
    let only = null;
    for (const arr of arrs)
        if (arr && arr.length) {
            all.push(...arr);
            const narr = arr;
            if (only !== null)
                only = undefined;
            else if (narr && (narr.hasTrailingComma !== undefined || narr.pos !== undefined || narr.end !== undefined))
                only = narr;
        }
    return only ? only : (all.length ? ts.createNodeArray(all) : undefined);
}
exports.combine = combine;
function seemsDeprecated(it) {
    let deprecated = false;
    for (const jsdoc of jsDocs(it))
        if ((!deprecated) && jsdoc.getText().includes("@deprecated "))
            deprecated = true;
    return deprecated;
}
exports.seemsDeprecated = seemsDeprecated;
function caseLo(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
}
exports.caseLo = caseLo;
function caseUp(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
exports.caseUp = caseUp;
