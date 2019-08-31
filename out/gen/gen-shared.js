"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
class GenPrep {
    constructor(job) {
        this.enums = [];
        this.structs = [];
        this.interfaces = [];
        this.fromOrig = job;
        for (var enumjob of job.enums)
            this.addEnum(enumjob);
        for (var structjob of job.structs)
            this.addStruct(structjob);
        for (var funcjob of job.funcs)
            this.addFunc(funcjob);
        console.log(JSON.stringify({
            e: this.enums,
            s: this.structs,
            i: this.interfaces,
        }, undefined, 2));
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
                    typeSpec: tspec
                };
            })
        });
    }
    addFunc(funcJob) {
        const qname = this.qName(funcJob);
        const ifacename = qname.slice(1, qname.length - 1).join('_');
        let iface = this.interfaces.find(_ => _.name === ifacename);
        if (!iface)
            this.interfaces.push(iface = { name: ifacename, methods: [] });
        iface.methods.push({
            name: qname[qname.length - 1] + ((funcJob.overload > 0) ? funcJob.overload : ''),
            args: funcJob.decl.parameters.map(_ => ({
                name: _.name.getText(),
                typeSpec: this.typeSpec(_.type, funcJob.decl.typeParameters)
            })),
            retTypeSpec: this.typeSpec(funcJob.decl.type, funcJob.decl.typeParameters)
        });
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
}
exports.Gen = Gen;
