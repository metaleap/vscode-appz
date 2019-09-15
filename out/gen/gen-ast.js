"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-basics");
var TypeRefPrim;
(function (TypeRefPrim) {
    TypeRefPrim[TypeRefPrim["Bool"] = 124] = "Bool";
    TypeRefPrim[TypeRefPrim["Int"] = 136] = "Int";
    TypeRefPrim[TypeRefPrim["String"] = 139] = "String";
})(TypeRefPrim = exports.TypeRefPrim || (exports.TypeRefPrim = {}));
class Builder {
    constructor(prep, gen) { [this.prep, this.gen] = [prep, gen]; }
    enumFrom(it) {
        return {
            name: it.name,
            Name: this.gen.nameRewriters.types.enums(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Enumerants: it.enumerants.map(_ => ({
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
            Methods: it.methods.map(_ => ({
                name: _.nameOrig,
                Name: this.gen.nameRewriters.methods(_.name),
                Docs: this.docs(gen.docs(_.fromOrig.decl, () => _.args.find(arg => arg.isFromRetThenable)), undefined, true, this.gen.options.doc.appendArgsToSummaryFor.methods),
                Args: _.args.map(arg => ({
                    name: arg.name,
                    Name: this.gen.nameRewriters.args(arg.name),
                    Docs: this.docs(gen.docs(arg.fromOrig)),
                    Type: TypeRefPrim.Bool,
                })),
            })),
        };
    }
    structFrom(it) {
        let ret = {
            name: it.name,
            Name: this.gen.nameRewriters.types.structs(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Fields: it.fields.map(_ => ({
                name: _.name,
                Name: this.gen.nameRewriters.fields(_.name),
                Docs: this.docs(gen.docs(_.fromOrig), _.isExtBaggage ? [gen.docStrs.extBaggage] : [], false, this.gen.options.doc.appendArgsToSummaryFor.funcFields),
                Type: TypeRefPrim.Int,
                Json: { Name: _.name, Required: !_.optional, Ignore: it.funcFields.some(ff => _.name === ff) },
            }))
        };
        for (const ff of it.funcFields) {
            const ffname = this.gen.nameRewriters.fields(ff);
            const fldfn = ret.Fields.find(_ => _.Name === ffname);
            fldfn.FuncFieldRel = {
                Name: ffname + "_AppzFuncId",
                Docs: this.docs(null, [gen.docStrs.internalOnly]),
                Type: TypeRefPrim.String,
                Json: { Name: ff + "_AppzFuncId" },
                FuncFieldRel: fldfn,
            };
            ret.Fields.push(fldfn.FuncFieldRel);
        }
        return ret;
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
                    this.ln("# ", "# @" + doc.ForParam + ":");
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
                this.ln(`${_.Name}: method`);
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
                this.ln(`${_.Name}: ${this.emitTypeRef(_.Type)}`);
            }));
            this.ln("", "");
        };
        this.emitTypeRef = (it) => {
            if (it === TypeRefPrim.Bool)
                return "bool";
            if (it === TypeRefPrim.Int)
                return "intnum";
            if (it === TypeRefPrim.String)
                return "str";
            return "Any";
        };
    }
    gen(prep) {
        this.resetState();
        this.src = "";
        const build = new Builder(prep, this);
        for (const it of prep.enums)
            this.emitEnum(build.enumFrom(it));
        for (const it of prep.structs)
            this.emitStruct(build.structFrom(it));
        for (const it of prep.interfaces)
            this.emitInterface(build.interfaceFrom(it));
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src);
    }
}
exports.Gen = Gen;
