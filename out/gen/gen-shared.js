"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const ts = require("typescript");
class GenPrep {
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
        this.structs.forEach(struct => {
            let isretarg = false;
            this.interfaces.forEach(iface => {
                if (!isretarg)
                    iface.methods.forEach(method => {
                        if (!isretarg)
                            method.args.forEach(arg => {
                                isretarg = isretarg || (arg.isFromRetThenable && typeRefersTo(arg.typeSpec, struct.name));
                            });
                    });
            });
            if (isretarg) {
                const fieldname = pickName(true, ['tag', 'ext', 'extra', 'meta', 'baggage', 'payload'], struct.fields);
                if (!fieldname)
                    throw (struct);
                struct.fields.push({ name: fieldname, isExtBaggage: true, optional: true, typeSpec: ScriptPrimType.Any });
            }
        });
        this.interfaces.forEach(iface => iface.methods.forEach(method => {
            method.args = method.args.filter(arg => arg.typeSpec !== 'CancellationToken');
        }));
        console.log(JSON.stringify({
            e: this.enums,
            s: this.structs,
            i: this.interfaces,
        }, function (key, val) {
            return (key === 'parent') ? null : val;
        }, 2));
    }
    addEnum(enumJob) {
        const qname = this.qName(enumJob);
        this.enums.push({
            name: qname.slice(1).join('_'),
            enumerants: enumJob.decl.members.map(_ => ({
                name: _.name.getText(),
                value: parseInt(_.initializer.text)
            }))
        });
    }
    addStruct(structJob) {
        const qname = this.qName(structJob);
        this.structs.push({
            name: qname.slice(1).join('_'),
            fields: structJob.decl.members.map(_ => {
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
            this.interfaces.push(iface = { name: ifacename, methods: [] });
        iface.methods.push({
            nameOrig: qname[qname.length - 1],
            name: qname[qname.length - 1] + ((funcJob.overload > 0) ? funcJob.overload : ''),
            args: funcJob.decl.parameters.map(_ => ({
                name: _.name.getText(),
                typeSpec: this.typeSpec(_.type, funcJob.decl.typeParameters),
                optional: _.questionToken ? true : false,
                isFromRetThenable: false,
                spreads: _.dotDotDotToken ? true : false,
            })),
            fromOrig: funcJob
        });
        const tret = this.typeSpec(funcJob.decl.type, funcJob.decl.typeParameters);
        if (tret) {
            const method = iface.methods[iface.methods.length - 1];
            const argname = pickName(false, ['andThen', 'onRet', 'onReturn', 'ret', 'cont', 'kont', 'continuation'], method.args);
            if (!argname)
                throw (method);
            method.args.push({ name: argname, typeSpec: tret, isFromRetThenable: true, optional: true, spreads: false });
        }
    }
    qName(memJob) {
        const qname = memJob.qName.split('.');
        if ((!qname) || (!qname.length) || (qname.length < 2) || qname[0] !== this.fromOrig.module[0])
            throw (memJob.qName);
        return qname;
    }
    typeSpec(tNode, tParams) {
        if (ts.isMethodSignature(tNode)) {
            const tp = tNode.typeParameters ? ts.createNodeArray(tNode.typeParameters.concat(...tParams), tParams.hasTrailingComma) : tParams;
            const rfun = {
                From: tNode.parameters.map(_ => this.typeSpec(_.type, tp)),
                To: this.typeSpec(tNode.type, tp)
            };
            return rfun;
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
            default:
                throw (tNode.kind);
        }
    }
}
exports.GenPrep = GenPrep;
var ScriptPrimType;
(function (ScriptPrimType) {
    ScriptPrimType[ScriptPrimType["Any"] = 121] = "Any";
    ScriptPrimType[ScriptPrimType["String"] = 139] = "String";
    ScriptPrimType[ScriptPrimType["Number"] = 136] = "Number";
    ScriptPrimType[ScriptPrimType["Boolean"] = 124] = "Boolean";
    ScriptPrimType[ScriptPrimType["Undefined"] = 142] = "Undefined";
    ScriptPrimType[ScriptPrimType["Null"] = 97] = "Null";
})(ScriptPrimType = exports.ScriptPrimType || (exports.ScriptPrimType = {}));
class Gen {
    constructor(outFilePathPref, outFilePathSuff) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff];
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
    parensIfJoin(arr, joinSep = ', ') {
        return (arr && arr.length === 1) ? arr[0] : ('(' + arr.join(joinSep) + ')');
    }
    writeFileSync(pkgName, src) {
        node_fs.writeFileSync(`${this.outFilePathPref}${this.caseLo(pkgName)}${this.outFilePathSuff}`, src);
    }
}
exports.Gen = Gen;
function typeArrOf(typeSpec) {
    const tarr = typeSpec;
    return (tarr && tarr.ArrOf) ? tarr.ArrOf : null;
}
exports.typeArrOf = typeArrOf;
function typeTupOf(typeSpec) {
    const ttup = typeSpec;
    return (ttup && ttup.TupOf) ? ttup.TupOf : null;
}
exports.typeTupOf = typeTupOf;
function typeSumOf(typeSpec) {
    const tsum = typeSpec;
    return (tsum && tsum.SumOf) ? tsum.SumOf : null;
}
exports.typeSumOf = typeSumOf;
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
    const tarr = typeArrOf(typeSpec);
    if (tarr)
        return typeRefersTo(tarr, name);
    const ttup = typeTupOf(typeSpec);
    if (ttup)
        return ttup.some(_ => typeRefersTo(_, name));
    const tsum = typeSumOf(typeSpec);
    if (tsum)
        return tsum.some(_ => typeRefersTo(_, name));
    const tfun = typeFun(typeSpec);
    if (tfun)
        return typeRefersTo(tfun[1], name) || tfun[0].some(_ => typeRefersTo(_, name));
    const tprom = typeProm(typeSpec);
    if (tprom)
        return tprom.some(_ => typeRefersTo(_, name));
    return typeSpec === name;
}
exports.typeRefersTo = typeRefersTo;
function pickName(forcePrefix, pickFrom, dontCollideWith) {
    if (!forcePrefix)
        for (const name of pickFrom)
            if (!dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                return name;
    for (const pref of ['appz', 'vscAppz'])
        for (let name of pickFrom) {
            name = pref + name.charAt(0).toUpperCase() + name.slice(1);
            if (!dontCollideWith.find(_ => _.name.toLowerCase() === name.toLowerCase()))
                return name;
        }
    return undefined;
}
exports.pickName = pickName;
