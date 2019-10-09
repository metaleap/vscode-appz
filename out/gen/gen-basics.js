"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const ts = require("typescript");
const dbgJsonPrintEnums = false, dbgJsonPrintStructs = false, dbgJsonPrintIfaces = false;
exports.docStrs = {
    extBaggage: "Free-form custom data, preserved across a roundtrip.",
    internalOnly: "For internal runtime use only."
};
class Prep {
    constructor(job) {
        this.enums = [];
        this.structs = [];
        this.interfaces = [];
        this.fromOrig = job;
        for (const enumjob of job.enums)
            this.addEnum(enumjob);
        for (const structjob of job.structs)
            this.addStruct(structjob);
        for (const funcjob of job.funcs)
            this.addFunc(funcjob);
        for (const iface of this.interfaces) {
            const propmethods = [];
            for (const method of iface.methods) {
                let n = 0;
                for (const arg of method.args)
                    if (arg.typeSpec === 'CancellationToken')
                        [arg.isCancellationToken, arg.typeSpec] = [n++, 'Cancel'];
                const fromprop = method.fromOrig.decl;
                if (fromprop && fromprop.PropType)
                    propmethods.push(method);
            }
            if (propmethods.length > 1) {
                const struct = {
                    isPropsOf: iface, name: iface.name + "Properties", funcFields: [],
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
                    name: pickName("", ['Properties', 'Props', 'Info', 'Current', 'Self', 'It', 'Cur'], iface.methods),
                    isProps: true, args: [{
                            isFromRetThenable: true, name: "andThen", optional: false,
                            typeSpec: { Thens: [struct.name] },
                        }],
                });
            }
        }
        this.structs.forEach(struct => {
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
            if ((struct.isOutgoing = isargout) && (struct.isIncoming = isargin)) {
                const fieldname = pickName('my', ['', 'tags', 'ext', 'extra', 'meta', 'baggage', 'payload'], struct.fields);
                if (!fieldname)
                    throw (struct);
                struct.fields.push({ name: fieldname, isExtBaggage: true, optional: true, typeSpec: ScriptPrimType.Dict });
            }
        });
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
    addEnum(enumJob) {
        const qname = this.qName(enumJob);
        this.enums.push({
            fromOrig: enumJob,
            name: qname.slice(1).join('_'),
            enumerants: enumJob.decl.members.map(_ => ({
                fromOrig: _,
                name: _.name.getText(),
                value: parseInt(_.initializer.text)
            }))
        });
    }
    addStruct(structJob) {
        const qname = this.qName(structJob);
        this.structs.push({
            fromOrig: structJob, isOutgoing: false, isIncoming: false,
            name: qname.slice(1).join('_'),
            fields: structJob.decl.members.filter(_ => _.name.getText() !== 'defaultUri').map(_ => {
                let tspec = null;
                switch (_.kind) {
                    case ts.SyntaxKind.PropertySignature:
                        tspec = this.typeSpec(_.type, structJob.decl.typeParameters);
                        break;
                    case ts.SyntaxKind.MethodSignature:
                        tspec = this.typeSpec(_, structJob.decl.typeParameters);
                        break;
                    default:
                        throw (_.kind);
                }
                return {
                    fromOrig: (_.kind === ts.SyntaxKind.PropertySignature) ? _ : _,
                    name: _.name.getText(),
                    typeSpec: tspec,
                    optional: _.questionToken ? true : false,
                    isExtBaggage: false,
                };
            }),
            funcFields: []
        });
        const struct = this.structs[this.structs.length - 1];
        struct.funcFields = struct.fields.filter(_ => typeFun(_.typeSpec)).map(_ => _.name);
    }
    addFunc(funcJob) {
        const qname = this.qName(funcJob);
        const ifacename = qname.slice(1, qname.length - 1).join('_');
        let iface = this.interfaces.find(_ => _.name === ifacename);
        if (!iface)
            this.interfaces.push(iface = { name: ifacename, methods: [], fromOrig: funcJob.ifaceNs });
        const declf = funcJob.decl, declp = funcJob.decl, decle = funcJob.decl;
        const me = {
            fromOrig: funcJob,
            nameOrig: qname[qname.length - 1],
            name: qname[qname.length - 1] + ((funcJob.overload > 0) ? funcJob.overload : ''),
            args: (declf && declf.parameters && declf.parameters.length) ?
                declf.parameters.map(_ => ({
                    fromOrig: _,
                    name: _.name.getText(),
                    typeSpec: this.typeSpec(_.type, declf.typeParameters),
                    optional: _.questionToken ? true : false,
                    isFromRetThenable: false,
                    spreads: _.dotDotDotToken ? true : false,
                })) : [],
        };
        iface.methods.push(me);
        if (decle && decle.EvtName && decle.EvtArgs && decle.EvtArgs.length)
            me.args.push({
                name: pickName('', ['listener', 'handler', 'eventHandler', 'onEvent', 'onEventRaised', 'onEventFired', 'onEventTriggered', 'onFired', 'onTriggered', 'onRaised'], me.args),
                optional: false, typeSpec: { From: decle.EvtArgs.map(_ => this.typeSpec(_)), To: null },
            });
        let tret = (declp && declp.PropType) ?
            this.typeSpec(declp.PropType) :
            (decle && decle.EvtArgs && decle.EvtArgs.length) ?
                "Disposable" :
                this.typeSpec(declf.type, declf.typeParameters);
        const tprom = typeProm(tret);
        if (!(tprom && tprom.length))
            tret = { Thens: [tret] };
        if (tret) {
            const argname = pickName('', ['andThen', 'onRet', 'onReturn', 'ret', 'cont', 'kont', 'continuation'], me.args);
            if (!argname)
                throw (me);
            me.args.push({ name: argname, typeSpec: tret, isFromRetThenable: true, optional: true, spreads: false });
        }
    }
    qName(memJob) {
        const qname = memJob.qName.split('.');
        if ((!qname) || (!qname.length) || (qname.length < 2) || qname[0] !== this.fromOrig.moduleName)
            throw (memJob.qName);
        return qname;
    }
    typeSpec(tNode, tParams) {
        if (ts.isTypeElement(tNode)) {
            if (ts.isPropertySignature(tNode)) {
                return this.typeSpec(tNode.type, tParams);
            }
            else if (ts.isMethodSignature(tNode) || ts.isCallSignatureDeclaration(tNode) || ts.isConstructSignatureDeclaration(tNode) || ts.isIndexSignatureDeclaration(tNode)) {
                const tp = tNode.typeParameters ? ts.createNodeArray(tNode.typeParameters.concat(...(tParams ? tParams : [])), tParams && tParams.hasTrailingComma) : tParams;
                const rfun = {
                    From: tNode.parameters.map(_ => this.typeSpec(_.type, tp)),
                    To: this.typeSpec(tNode.type, tp)
                };
                return rfun;
            }
            else
                throw tNode.getText();
        }
        switch (tNode.kind) {
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
                const rsum = {
                    SumOf: tNode.types.map(_ => this.typeSpec(_, tParams))
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
                    if (tnode)
                        return this.typeSpec(tnode, tParams);
                    else
                        throw (tparam);
                }
                else if (tname === 'Thenable') {
                    const tprom = {
                        Thens: tref.typeArguments.map(_ => this.typeSpec(_, tParams))
                    };
                    return tprom;
                }
                else
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
                throw (lit.kind + "\t" + lit.getText());
            default:
                throw (tNode.kind + "\t" + tNode.getText());
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
    constructor(outFilePathPref, outFilePathSuff) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff];
        this.resetState();
    }
    resetState() {
        this.state = { genPopulateFor: {} };
    }
    doNotEditComment(moniker) {
        return "DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-" + moniker + ".ts via github.com/metaleap/vscode-appz/src/gen/main.ts";
    }
    caseLo(name) {
        return name.charAt(0).toLowerCase() + name.slice(1);
    }
    caseUp(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
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
function typePromOf(typeSpec, promOf) {
    const tprom = typeProm(typeSpec);
    return (tprom && tprom.length && tprom[0] === promOf);
}
exports.typePromOf = typePromOf;
function typeProm(typeSpec) {
    const tprom = typeSpec;
    return (tprom && tprom.Thens) ? tprom.Thens : null;
}
exports.typeProm = typeProm;
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
function docFrom(from, retName) {
    let ret = null, txt;
    if (from) {
        ret = { fromOrig: from, subs: [], lines: [] };
        if (txt = from.comment) {
            if (ts.isJSDocParameterTag(from))
                ret.isForArg = from.name.getText();
            else if (ts.isJSDocReturnTag(from)) {
                const rn = retName ? retName() : null;
                ret.isForRet = (rn && rn.name && rn.name.length) ? rn.name : "";
            }
            ret.lines.push(...txt.split('\n').filter(_ => _ !== null && (!(_.startsWith('[') && _.endsWith(')') && _.includes('](#')))));
        }
        from.forEachChild(_ => {
            const sub = docFrom(_, retName);
            if (sub)
                ret.subs.push(sub);
        });
    }
    return ret;
}
function docs(from, retName = undefined) {
    const docs = jsDocs(from), ret = [];
    if (docs && docs.length)
        ret.push(...docs.map(_ => docFrom(_, retName)));
    return ret;
}
exports.docs = docs;
function docPrependArgOrRetName(doc, ln, retFallback, argNameRewrite = undefined, pref = "`", suff = "` ── ") {
    let isfor = doc.isForArg;
    if (isfor && isfor.length)
        isfor = argNameRewrite ? argNameRewrite(isfor) : isfor;
    else if (doc.isForRet !== undefined && doc.isForRet !== null)
        isfor = (doc.isForRet && doc.isForRet.length) ? doc.isForRet : retFallback;
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
function idents(dontCollideWith, ...names) {
    const ret = {};
    for (const name of names)
        ret[name] = pickName('', [name], dontCollideWith);
    return ret;
}
exports.idents = idents;
function jsDocs(from) {
    while (from) {
        const have = from;
        if (have && have.jsDoc && have.jsDoc.length)
            return have.jsDoc;
        from = from.parent;
    }
    return null;
}
function pickName(forcePrefix, pickFrom, dontCollideWith) {
    if (!(forcePrefix && forcePrefix.length)) {
        for (const name of pickFrom)
            if (name && name.length && !dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                return name;
        if (pickFrom.length === 1 && pickFrom[0] && pickFrom[0].length)
            for (let i = 1; true; i++) {
                var name = '_'.repeat(i) + pickFrom[0];
                if (!dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                    return name;
            }
    }
    for (const pref of [forcePrefix, 'appz', 'vscAppz'])
        if (pref && pref.length)
            for (let name of pickFrom) {
                name = pref + (name ? (name.charAt(0).toUpperCase() + name.slice(1)) : '');
                if (!dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                    return name;
            }
    return undefined;
}
