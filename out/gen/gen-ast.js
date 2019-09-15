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
    docs(docs, method = undefined, retNameFallback = "return", appendArgsAndRetsToSummaryToo = true, into = undefined) {
        const issub = (into === undefined);
        if (issub)
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
                    if (method || !(name && name.length)) {
                        if (!dst)
                            into.push(dst = { ForParam: name, Lines: [] });
                        dst.Lines.push(...doc.lines);
                    }
                    if (name && name.length && appendArgsAndRetsToSummaryToo && (dst = into.find(_ => _.ForParam === "")))
                        dst.Lines.push("", ...doc.lines.map((ln, idx) => ((idx) ? ln : gen.docPrependArgOrRetName(doc, ln, "return", this.gen.rewriteArgName))));
                }
                if (doc.subs && doc.subs.length)
                    this.docs(doc.subs, method, retNameFallback, appendArgsAndRetsToSummaryToo, into);
            }
        if (into.length && !issub) { }
        return into;
    }
    enumFrom(it) {
        return {
            Name: it.name,
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Enumerants: it.enumerants.map((_, idx) => this.enumerantFrom(it, idx)),
        };
    }
    enumerantFrom(it, idx) {
        return {
            Name: it.enumerants[idx].name,
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Value: it.enumerants[idx].value,
        };
    }
    structFrom(it) {
        return {
            Name: it.name,
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Fields: it.fields.map(_ => this.fieldFrom(_)),
        };
    }
    fieldFrom(it) {
        return {
            Name: it.name,
            Docs: this.docs(gen.docs(it.fromOrig)),
            Type: TypeRefPrim.Int,
            Json: { Ignore: false, Name: it.name, Required: false },
        };
    }
}
class Gen extends gen.Gen {
    constructor() {
        super(...arguments);
        this.src = "";
        this.indent = 0;
        this.rewriteArgName = this.caseLo;
        this.ln = (...srcLns) => {
            for (const srcln of srcLns)
                this.src += ((srcln && srcln.length) ? ("\t".repeat(this.indent) + srcln) : '') + "\n";
        };
        this.ind = (andThen) => {
            this.indent++;
            andThen();
            this.indent--;
        };
        this.emitDocs = (it) => {
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
            this.ind(() => {
                for (const _ of it.Enumerants) {
                    this.ln("");
                    this.emitDocs(_);
                    this.ln(`${_.Name}: ${_.Value}`);
                }
            });
            this.ln("", "");
        };
        this.emitStruct = (it) => {
            this.ln("", "");
            this.emitDocs(it);
            this.ln(it.Name + ": struct");
            this.ind(() => {
                for (const _ of it.Fields) {
                    this.ln("");
                    this.emitDocs(_);
                    this.ln(`${_.Name}: ${this.emitTypeRef(_.Type)}`);
                }
            });
            this.ln("", "");
        };
        this.emitTypeRef = (it) => {
            return "tref";
        };
        this.emitInterface = (it) => {
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
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src);
    }
}
exports.Gen = Gen;
