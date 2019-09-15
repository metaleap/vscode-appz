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
    constructor(prep) { this.prep = prep; }
    docs(from, method = undefined, isSub = false) {
        const docs = gen.docs(from);
    }
    enumFrom(it) {
        return {
            Docs: [], Name: it.name,
            Enumerants: it.enumerants.map((_, idx) => this.enumerantFrom(it, idx)),
        };
    }
    enumerantFrom(it, idx) {
        return { Docs: [], Name: it.enumerants[idx].name, Value: it.enumerants[idx].value };
    }
    structFrom(it) {
        return {
            Docs: [], Name: it.name,
            Fields: it.fields.map(_ => this.fieldFrom(_)),
        };
    }
    fieldFrom(it) {
        return {
            Docs: [], Name: it.name,
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
                    this.indent++;
                    this.ln("# @" + doc.ForParam + ":");
                }
                for (const docln of doc.Lines)
                    this.ln("# " + docln);
                if (doc.ForParam && doc.ForParam.length)
                    this.indent--;
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
        const build = new Builder(prep);
        for (const it of prep.enums)
            this.emitEnum(build.enumFrom(it));
        for (const it of prep.structs)
            this.emitStruct(build.structFrom(it));
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src);
    }
}
exports.Gen = Gen;
