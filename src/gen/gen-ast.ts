import * as gen from './gen-basics'

export interface WithName { Name: string }
export interface WithType { Type: TypeRef }
export interface WithDocs { Docs: Doc[] }
export interface Doc { ForParam: string, Lines: string[] }

export interface TEnum extends WithDocs, WithName { Enumerants: Enumerant[] }
export interface TInterface extends WithDocs, WithName { Methods: Method[] }
export interface Enumerant extends WithDocs, WithName { Value: number }
export interface TStruct extends WithDocs, WithName { Fields: Field[] }
export interface Method extends WithDocs, WithName { Args: Arg[] }
export interface Arg extends WithDocs, WithName, WithType { }
export interface Field extends WithDocs, WithName, WithType {
    FuncFieldRel?: Field, Json: { Name: string, Required?: boolean, Ignore?: boolean }
}
export interface Func extends WithName, WithType { Func: EFunc }

export type TypeRef = WithName | TypeRefPrim | TypeRefArr | TypeRefFunc | TypeRefTup | TypeRefPtr
export enum TypeRefPrim {
    Bool = gen.ScriptPrimType.Boolean,
    Int = gen.ScriptPrimType.Number,
    String = gen.ScriptPrimType.String,
}
export interface TypeRefArr {
    ArrOf: TypeRef
}
export interface TypeRefFunc {
    From: TypeRef[]
    To: TypeRef
}
export interface TypeRefTup {
    TupOf: TypeRef[]
}
export interface TypeRefPtr {
    PtrTo: TypeRef
}

export type Expr = ELit | EName | ECall | EOp | EFunc | EDictNew | ELen | EConv | ENew
export interface ELit {
    Lit: boolean | number | string | null
}
export interface EName extends WithName {
}
export interface ECall {
    Call: Expr
    Args: Expr[]
}
export interface EOp extends WithName {
    Operands: Expr[]
}
export interface EFunc extends WithType {
    Args: Arg[]
    Body: IBlock
}
export interface EAddr {
    AddrOf: Expr
}
export interface EDeref {
    Deref: Expr
}
export interface EDictNew {
    Capacity: Expr
}
export interface ELen {
    LenOf: Expr
}
export interface EConv {
    Conv: Expr
    To: TypeRef
}
export interface ENew {
    New: TypeRef
}

export type Instr = IBlock | IRet | IVar | ISet | IDictDel
export interface IBlock {
    Instrs: Instr[]
    Lock?: boolean
    If?: [Expr, IBlock]
    ForEach?: [EName, Expr]
}
export interface IRet {
    Ret: Expr
}
export interface IVar extends WithName, WithType {
}
export interface ISet {
    SetNames: string[]
    SetTo: Expr
}
export interface IDictDel {
    DelFrom: Expr
    DelWhat: Expr
}



class Builder {
    prep: gen.Prep
    gen: Gen

    constructor(prep: gen.Prep, gen: Gen) { [this.prep, this.gen] = [prep, gen] }

    enumFrom(it: gen.PrepEnum): TEnum {
        return {
            Name: this.gen.nameRewriters.types.enums(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Enumerants: it.enumerants.map(_ => ({
                Name: this.gen.nameRewriters.enumerants(_.name),
                Docs: this.docs(gen.docs(_.fromOrig)),
                Value: _.value,
            })),
        }
    }

    interfaceFrom(it: gen.PrepInterface): TInterface {
        return {
            Name: this.gen.nameRewriters.types.interfaces(it.name),
            Docs: this.docs(gen.docs(it.fromOrig)),
            Methods: it.methods.map(_ => ({
                Name: this.gen.nameRewriters.methods(_.name),
                Docs: this.docs(gen.docs(_.fromOrig.decl, () => _.args.find(arg => arg.isFromRetThenable)), undefined, true, this.gen.options.doc.appendArgsToSummaryFor.methods),
                Args: _.args.map(arg => ({
                    Name: this.gen.nameRewriters.args(arg.name),
                    Docs: this.docs(gen.docs(arg.fromOrig)),
                    Type: TypeRefPrim.Bool,
                })),
            })),
        }
    }

    structFrom(it: gen.PrepStruct): TStruct {
        let ret: TStruct = {
            Name: this.gen.nameRewriters.types.structs(it.name),
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Fields: it.fields.map(_ => ({
                Name: this.gen.nameRewriters.fields(_.name),
                Docs: this.docs(gen.docs(_.fromOrig), _.isExtBaggage ? [gen.docStrs.extBaggage] : [], false, this.gen.options.doc.appendArgsToSummaryFor.funcFields),
                Type: TypeRefPrim.Int,
                Json: { Name: _.name, Required: !_.optional, Ignore: it.funcFields.some(ff => _.name === ff) },
            }))
        }
        for (const ff of it.funcFields) {
            const ffname = this.gen.nameRewriters.fields(ff)
            const fldfn = ret.Fields.find(_ => _.Name === ffname)
            fldfn.FuncFieldRel = {
                Name: ffname + "_AppzFuncId",
                Docs: this.docs(null, [gen.docStrs.internalOnly]),
                Type: TypeRefPrim.String,
                Json: { Name: ff + "_AppzFuncId" },
                FuncFieldRel: fldfn,
            }
            ret.Fields.push(fldfn.FuncFieldRel)
        }
        return ret
    }

    docs(docs: gen.Docs, extraSummaryLines: string[] = undefined, isMethod = false, appendArgsAndRetsToSummaryToo = true, retNameFallback = "return", into: Doc[] = undefined) {
        const istop = (into === undefined)
        if (istop)
            into = []
        if (docs && docs.length) for (const doc of docs) {
            if (doc.lines && doc.lines.length) {
                let name = doc.isForArg
                if ((!(name && name.length)) && doc.isForRet !== null && doc.isForRet !== undefined)
                    name = (doc.isForRet && doc.isForRet.length) ? doc.isForRet : retNameFallback
                if (!name)
                    name = ""
                let dst = into.find(_ => _.ForParam === name)
                if (isMethod || !(name && name.length)) {
                    if (!dst)
                        into.push(dst = { ForParam: name, Lines: [] })
                    dst.Lines.push(...doc.lines)
                }
                if (name && name.length && appendArgsAndRetsToSummaryToo && (dst = into.find(_ => _.ForParam === "")))
                    dst.Lines.push("", ...doc.lines.map((ln, idx) =>
                        ((idx) ? ln : gen.docPrependArgOrRetName(doc, ln, "return", this.gen.nameRewriters.args))
                    ))
            }
            if (doc.subs && doc.subs.length)
                this.docs(doc.subs, undefined, isMethod, appendArgsAndRetsToSummaryToo, retNameFallback, into)
        }
        if (istop && extraSummaryLines && extraSummaryLines.length) {
            let dst = into.find(_ => _.ForParam === "")
            if (!dst)
                into.push(dst = { ForParam: "", Lines: [] })
            dst.Lines.push(...extraSummaryLines)
        }
        return into
    }

}



export class Gen extends gen.Gen implements gen.IGen {
    private src: string = ""
    private indent: number = 0
    nameRewriters = {
        args: this.caseLo,
        fields: this.caseUp,
        methods: this.caseUp,
        enumerants: this.caseUp,
        types: { enums: this.caseUp, structs: this.caseUp, interfaces: this.caseUp },
    }
    options = {
        doc: {
            appendArgsToSummaryFor: {
                methods: false,
                funcFields: true,
            }
        }
    }

    protected ln = (...srcLns: string[]) => {
        for (const srcln of srcLns)
            this.src += ((srcln && srcln.length) ? ("\t".repeat(this.indent) + srcln) : '') + "\n"
    }

    protected indented = (andThen: () => void) => {
        this.indent++
        andThen()
        this.indent--
    }

    protected emitDocs = (it: WithDocs) => {
        for (const doc of it.Docs) {
            if (doc.ForParam && doc.ForParam.length) {
                this.ln("# ", "# @" + doc.ForParam + ":")
            }
            for (const docln of doc.Lines)
                this.ln("# " + docln)
            if (doc.ForParam && doc.ForParam.length) { }
        }
    }

    protected emitEnum = (it: TEnum) => {
        this.ln("", "")
        this.emitDocs(it)
        this.ln(it.Name + ": enum")
        this.indented(() => it.Enumerants.forEach(_ => {
            this.ln("")
            this.emitDocs(_)
            this.ln(`${_.Name}: ${_.Value}`)
        }))
        this.ln("", "")
    }

    protected emitInterface = (it: TInterface) => {
        this.ln("", "")
        this.emitDocs(it)
        this.ln(it.Name + ": interface")
        this.indented(() => it.Methods.forEach(_ => {
            this.ln("")
            this.emitDocs(_)
            this.ln(`${_.Name}: method`)
            this.indented(() => _.Args.forEach(arg => {
                this.ln(`${arg.Name}: ${this.emitTypeRef(arg.Type)}`)
            }))
        }))
        this.ln("", "")
    }

    protected emitStruct = (it: TStruct) => {
        this.ln("", "")
        this.emitDocs(it)
        this.ln(it.Name + ": struct")
        this.indented(() => it.Fields.forEach(_ => {
            this.ln("")
            this.emitDocs(_)
            this.ln(`${_.Name}: ${this.emitTypeRef(_.Type)}`)
        }))
        this.ln("", "")
    }

    protected emitTypeRef = (it: TypeRef) => {
        if (it === TypeRefPrim.Bool)
            return "bool"
        if (it === TypeRefPrim.Int)
            return "intnum"
        if (it === TypeRefPrim.String)
            return "str"

        return "Any"
    }

    gen(prep: gen.Prep) {
        this.resetState()
        this.src = ""
        const build = new Builder(prep, this)

        for (const it of prep.enums)
            this.emitEnum(build.enumFrom(it))
        for (const it of prep.structs)
            this.emitStruct(build.structFrom(it))
        for (const it of prep.interfaces)
            this.emitInterface(build.interfaceFrom(it))
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src)
    }

}
