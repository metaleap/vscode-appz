"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    enumFrom(it) {
        return {
            name: it.name,
            Name: this.gen.nameRewriters.types.enums(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Enumerants: it.enumerants.map((_) => ({
                name: _.name,
                Name: this.gen.nameRewriters.enumerants(_.name),
                Docs: this.docs(gen.docs(_.fromOrig)),
                Value: _.value,
            })),
        };
    }
    interfaceFrom(it) {
        return {
            name: it.name,
            Name: this.gen.nameRewriters.types.interfaces(it.name),
            Docs: this.docs(gen.docs(it.fromOrig)),
            Methods: it.methods.map((_) => ({
                name: _.nameOrig,
                Name: this.gen.nameRewriters.methods(_.name),
                Docs: this.docs(gen.docs(_.fromOrig.decl, () => _.args.find(arg => arg.isFromRetThenable)), undefined, true, this.gen.options.doc.appendArgsToSummaryFor.methods),
                Type: null,
                Args: _.args.map((arg) => ({
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
            name: it.name,
            Name: this.gen.nameRewriters.types.structs(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Fields: it.fields.map((_) => ({
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
            return { Name: "Any" };
        const tarr = gen.typeArrOf(it);
        if (tarr)
            return { ArrOf: this.typeRef(tarr) };
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
                        name = "";
                    let dst = into.find(_ => _.ForParam === name);
                    if (isMethod || !(name && name.length)) {
                        if (!dst)
                            into.push(dst = { ForParam: name, Lines: [] });
                        dst.Lines.push(...doc.lines);
                    }
                    if (name && name.length && appendArgsAndRetsToSummaryToo && (dst = into.find(_ => _.ForParam === "")))
                        dst.Lines.push("", ...doc.lines.map((ln, idx) => ((idx) ? ln : gen.docPrependArgOrRetName(doc, ln, "return", this.gen.nameRewriters.args))));
                }
                if (doc.subs && doc.subs.length)
                    this.docs(doc.subs, undefined, isMethod, appendArgsAndRetsToSummaryToo, retNameFallback, into);
            }
        if (istop && extraSummaryLines && extraSummaryLines.length) {
            let dst = into.find(_ => _.ForParam === "");
            if (!dst)
                into.push(dst = { ForParam: "", Lines: [] });
            dst.Lines.push(...extraSummaryLines);
        }
        return into;
    }
}
class Gen extends gen.Gen {
    constructor() {
        super(...arguments);
        this.src = "";
        this.indent = 0;
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
                self: "self"
            }
        };
        this.ln = (...srcLns) => {
            for (const srcln of srcLns)
                this.src += ((srcln && srcln.length) ? ("\t".repeat(this.indent) + srcln) : "") + "\n";
        };
        this.indented = (andThen) => {
            this.indent++;
            andThen();
            this.indent--;
        };
        this.emitDocs = (it) => {
            if (it.name && it.Name && it.name !== it.Name)
                this.ln("# " + it.name + ":");
            for (const doc of it.Docs) {
                if (doc.ForParam && doc.ForParam.length) {
                    this.ln("#", "# @" + doc.ForParam + ":");
                }
                for (const docln of doc.Lines)
                    this.ln("# " + docln);
                if (doc.ForParam && doc.ForParam.length) { }
            }
        };
        this.emitEnum = (it) => {
            this.ln("", "");
            this.emitDocs(it);
            this.ln(it.Name + ": enum");
            this.indented(() => it.Enumerants.forEach(_ => {
                this.ln("");
                this.emitDocs(_);
                this.ln(`${_.Name}: ${_.Value}`);
            }));
            this.ln("", "");
        };
        this.emitInterface = (it) => {
            this.ln("", "");
            this.emitDocs(it);
            this.ln(it.Name + ": iface");
            this.indented(() => it.Methods.forEach(_ => {
                this.ln("");
                this.emitDocs(_);
                this.ln(`${_.Name}: ${_.Type ? this.emitTypeRef(_.Type) : ''}`);
                this.indented(() => _.Args.forEach(arg => {
                    this.ln(`${arg.Name}: ${this.emitTypeRef(arg.Type)}${(arg.name === arg.Name) ? '' : ('#' + arg.name)}`);
                }));
            }));
            this.ln("", "");
        };
        this.emitStruct = (it) => {
            this.ln("", "");
            this.emitDocs(it);
            this.ln(it.Name + ": struct");
            this.indented(() => it.Fields.forEach(_ => {
                this.ln("");
                this.emitDocs(_);
                this.ln("#", `# JSON FLAGS: ${JSON.stringify(_.Json)}`);
                this.ln(`${_.Name}: ${this.emitTypeRef(_.Type)}`);
            }));
            this.ln("", "");
        };
        this.emitTypeRef = (it) => {
            if (it === null)
                return "!";
            if (it === TypeRefPrim.Bool)
                return "yesno";
            if (it === TypeRefPrim.Int)
                return "intnum";
            if (it === TypeRefPrim.String)
                return "txt";
            if (it === TypeRefPrim.Dict)
                return "[txt:Any]";
            const tname = it;
            if (tname && tname.Name && tname.Name.length)
                return tname.Name;
            const ttup = it;
            if (ttup && ttup.TupOf && ttup.TupOf.length)
                return "[" + ttup.TupOf.map(_ => this.emitTypeRef(_)).join(',') + "]";
            const tarr = it;
            if (tarr && tarr.ArrOf)
                return "[" + this.emitTypeRef(tarr.ArrOf) + "]";
            const tfun = it;
            if (tfun && tfun.From && tfun.From.length)
                return "(" + tfun.From.map(_ => this.emitTypeRef(_)).join(' -> ') + " -> " + this.emitTypeRef(tfun.To) + ")";
            const tmay = it;
            if (tmay && tmay.Maybe)
                return "?" + this.emitTypeRef(tmay.Maybe);
            throw it;
        };
        this.emitFuncImpl = (it) => {
            this.ln("", "");
            this.ln(`${this.emitTypeRef(it.Type)}.${it.Name} (${it.Func.Args.map(_ => _.Name + ': ' + this.emitTypeRef(_.Type)).join(', ')}): ${this.emitTypeRef(it.Func.Type)}`);
            this.emitIBlock(it.Func.Body);
            this.ln("", "");
        };
        this.emitIBlock = (iBlock) => {
            this.indented(() => iBlock.Instrs.forEach(_ => this.emitInstr(_)));
            return this;
        };
        this.emitIRet = (iRet) => {
            this.ln("ret" + (iRet.Ret === null ? '' : (' ' + this.emitExpr(iRet.Ret))));
            return this;
        };
    }
    emitInstr(instr) {
        if (instr) {
            const iblock = instr;
            if (iblock && iblock.Instrs !== undefined)
                return this.emitIBlock(iblock);
            const iret = instr;
            if (iret && iret.Ret !== undefined)
                return this.emitIRet(iret);
            this.ln("<instr>" + JSON.stringify(instr));
        }
        return this;
    }
    emitExpr(expr) {
        const ename = expr;
        if (ename && ename.Name !== undefined)
            return this.emitEName(ename);
        return "<expr>" + JSON.stringify(expr);
    }
    emitEName(eName) {
        return eName.Name ? eName.Name : this.options.idents.self;
    }
    gen(prep) {
        this.resetState();
        this.src = "# NOTE, this is not a CoffeeScript file:\n# the .coffee extension is solely for the convenience of syntax-highlighting.\n#\n# A debug-print of our in-memory-only imperative-intermediate-representation\n# available to code-gens that want to stay lean & mean & low on LoCs for\n# maintainability & ease of porting.\n#\n# The format is again just a debug-print: it's never to be parsed or anything,\n# and exists merely to dump all knowledge held by generated in-memory\n# representations available to code-gens.\n#\n# Generated representations follow below.\n\n";
        const build = new Builder(prep, this);
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
        for (const it of [ifacemain].concat(...ifaces))
            it.Methods.forEach(_ => {
                this.emitFuncImpl({
                    name: _.name, Name: _.Name, Type: it, Func: {
                        Args: _.Args, Type: _.Type, Body: {
                            Instrs: [
                                { Ret: _.Type ? { Name: "" } : null }
                            ]
                        }
                    }
                });
            });
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src);
    }
}
exports.Gen = Gen;
