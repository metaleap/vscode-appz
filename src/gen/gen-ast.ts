import * as ts from 'typescript'
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
    Json: { Name: string, Required: boolean, Ignore: boolean }
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

    docs(docs: gen.Docs, method: gen.PrepMethod = undefined, retNameFallback = "return", appendArgsAndRetsToSummaryToo = true, into: Doc[] = undefined) {
        const issub = (into === undefined)
        if (issub)
            into = []
        if (docs && docs.length) for (const doc of docs) {
            if (doc.lines && doc.lines.length) {
                let name = doc.isForArg
                if ((!(name && name.length)) && doc.isForRet !== null && doc.isForRet !== undefined)
                    name = (doc.isForRet && doc.isForRet.length) ? doc.isForRet : retNameFallback
                if (!name)
                    name = ""
                let dst = into.find(_ => _.ForParam === name)
                if (method || !(name && name.length)) {
                    if (!dst)
                        into.push(dst = { ForParam: name, Lines: [] })
                    dst.Lines.push(...doc.lines)
                }
                if (name && name.length && appendArgsAndRetsToSummaryToo && (dst = into.find(_ => _.ForParam === "")))
                    dst.Lines.push("", ...doc.lines.map((ln, idx) =>
                        ((idx) ? ln : gen.docPrependArgOrRetName(doc, ln, "return", this.gen.rewriteArgName))
                    ))
            }
            if (doc.subs && doc.subs.length)
                this.docs(doc.subs, method, retNameFallback, appendArgsAndRetsToSummaryToo, into)
        }
        if (into.length && !issub) { }
        return into
    }

    enumFrom(it: gen.PrepEnum): TEnum {
        return {
            Name: it.name,
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Enumerants: it.enumerants.map((_, idx) =>
                this.enumerantFrom(it, idx)),
        }
    }

    enumerantFrom(it: gen.PrepEnum, idx: number): Enumerant {
        return {
            Name: it.enumerants[idx].name,
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Value: it.enumerants[idx].value,
        }
    }

    structFrom(it: gen.PrepStruct): TStruct {
        return {
            Name: it.name,
            Docs: this.docs(gen.docs(it.fromOrig.decl)),
            Fields: it.fields.map(_ => this.fieldFrom(_)),
        }
    }

    fieldFrom(it: gen.PrepField): Field {
        return {
            Name: it.name,
            Docs: this.docs(gen.docs(it.fromOrig)),
            Type: TypeRefPrim.Int,
            Json: { Ignore: false, Name: it.name, Required: false },
        }
    }
}



export class Gen extends gen.Gen implements gen.IGen {
    protected src: string = ""
    protected indent: number = 0
    rewriteArgName: ((_: string) => string) = this.caseLo

    protected ln = (...srcLns: string[]) => {
        for (const srcln of srcLns)
            this.src += ((srcln && srcln.length) ? ("\t".repeat(this.indent) + srcln) : '') + "\n"
    }

    protected ind = (andThen: () => void) => {
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
        this.ind(() => {
            for (const _ of it.Enumerants) {
                this.ln("")
                this.emitDocs(_)
                this.ln(`${_.Name}: ${_.Value}`)
            }
        })
        this.ln("", "")
    }

    protected emitStruct = (it: TStruct) => {
        this.ln("", "")
        this.emitDocs(it)
        this.ln(it.Name + ": struct")
        this.ind(() => {
            for (const _ of it.Fields) {
                this.ln("")
                this.emitDocs(_)
                this.ln(`${_.Name}: ${this.emitTypeRef(_.Type)}`)
            }
        })
        this.ln("", "")
    }

    protected emitTypeRef = (it: TypeRef) => {
        return "tref"
    }

    protected emitInterface = (it: TInterface) => {
    }

    gen(prep: gen.Prep) {
        this.resetState()
        this.src = ""
        const build = new Builder(prep, this)

        for (const it of prep.enums)
            this.emitEnum(build.enumFrom(it))
        for (const it of prep.structs)
            this.emitStruct(build.structFrom(it))
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src)
    }

}
