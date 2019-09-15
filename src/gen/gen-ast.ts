import * as gen from './gen-basics'

export interface WithDocs { DocLns: string[] }
export interface WithName { Name: string }
export interface WithType { Type: TypeRef }

export interface TEnum extends WithDocs, WithName { Enumerants: Enumerant[] }
export interface TInterface extends WithDocs, WithName { Methods: Method[] }
export interface Enumerant extends WithDocs, WithName { Value: number }
export interface TStruct extends WithDocs, WithName { Fields: Field[] }
export interface Method extends WithDocs, WithName { Args: Arg[], Impl: IBlock }
export interface Arg extends WithDocs, WithName, WithType { }
export interface Field extends WithDocs, WithName, WithType {
    Json: { Name: string, Required: boolean, Ignore: boolean }
}

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



export class Gen extends gen.Gen implements gen.IGen {
    protected src: string = ""
    protected indent: number = 0

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
        for (const docln of it.DocLns)
            this.ln("# " + docln)
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
        for (const it of prep.enums)
            this.emitEnum(this.newEnumFrom(it))
        for (const it of prep.structs)
            this.emitStruct(this.newStructFrom(it))
        this.writeFileSync(this.caseLo(prep.fromOrig.moduleName), this.src)
    }

    private newEnumFrom(it: gen.PrepEnum): TEnum {
        return {
            DocLns: [], Name: it.name,
            Enumerants: it.enumerants.map((_, idx) =>
                this.newEnumerantFrom(it, idx)),
        }
    }

    private newEnumerantFrom(it: gen.PrepEnum, idx: number): Enumerant {
        return { DocLns: [], Name: it.enumerants[idx].name, Value: it.enumerants[idx].value }
    }

    private newStructFrom(it: gen.PrepStruct): TStruct {
        return {
            DocLns: [], Name: it.name,
            Fields: it.fields.map(_ => this.newFieldFrom(_)),
        }
    }

    private newFieldFrom(it: gen.PrepField): Field {
        return {
            DocLns: [], Name: it.name,
            Type: TypeRefPrim.Int,
            Json: { Ignore: false, Name: it.name, Required: false },
        }
    }

}
