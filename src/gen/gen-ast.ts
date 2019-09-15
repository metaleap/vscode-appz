import * as gen from './gen-basics'

export interface WithDocs {
    DocLns: string[]
}

export interface WithName {
    Name: string
}

export interface WithType {
    Type: TypeRef
}

export interface TypeEnum extends WithDocs, WithName {
    Enumerants: Enumerant[]
}

export interface Enumerant extends WithDocs, WithName {
    Value: number
}

export interface TypeInterface extends WithDocs, WithName {
    Methods: Method[]
}

export interface Method extends WithDocs, WithName {
    Args: Arg[]
}

export interface Arg extends WithDocs, WithName, WithType {
}

export interface TypeStruct extends WithDocs, WithName {
    Fields: Field[]
}

export interface Field extends WithDocs, WithName, WithType {
    Json: {
        Name: string
        Required: boolean
        Ignore: boolean
    }
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
