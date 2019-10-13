import { Gen, Builder, Instr, TypeRefPrim, Expr } from './gen-syn'

export class GenDemos {
    private all: { [_: string]: () => Instr[] }
    private gen: Gen

    genDemos() {
        this.gen.emitIntro()
        for (const name in this.all)
            this.gen.emitFuncImpl({
                Name: name, Type: null, Func: {
                    Args: [], Type: null, Body: { Instrs: this.all[name]() }
                }
            })
        this.gen.emitOutro()
    }

    constructor(gen: Gen, b: Builder) {
        const _ = b
        this.gen = gen
        this.all = {

            "demo_Commands_GetCommands": () =>
                this.genDemoOfStrListMenu(_, "Commands", "GetCommands", "command ID(s)", _.eLit(false)),

            "demo_Languages_GetLanguages": () =>
                this.genDemoOfStrListMenu(_, "Languages", "GetLanguages", "language ID(s)"),

            "demo_Env_Properties": () =>
                this.genDemoOfPropsMenu(_, "Env"),

            "demo_Workspace_Properties": () =>
                this.genDemoOfPropsMenu(_, "Workspace"),

        }
    }

    genDemoOfPropsMenu(_: Builder, ns: string): Instr[] {
        const struct = this.gen.allStructs[ns + "Properties"]

        return [
            _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n(ns))), _.n("Properties")),
                _.eFunc([{ Name: "props", Type: { Name: struct.Name } }], null,
                    _.iVar("items", { ValsOf: TypeRefPrim.String }),
                    _.iSet(_.n("items"), _.eCollNew(_.eLit(struct.Fields.length), TypeRefPrim.String, true)),
                    _.iBlock(..._.EACH(struct.Fields, (f, i): Instr[] => [
                        _.iSet(_.oIdx(_.n("items"), _.eLit(i)), _.eLit(f.Name + "\t".repeat(f.Name.length < 8 ? 3 : f.Name.length >= 16 ? 1 : 2) + "{0}", _.oDot(_.n("props"), _.n(f.Name)))),
                    ])),
                    _.iVar("opts", { Name: "QuickPickOptions" }),
                    _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })),
                    _.iSet(_.oDot(_.n("opts"), _.n("IgnoreFocusOut")), _.eLit(true)),
                    _.iSet(_.oDot(_.n("opts"), _.n("PlaceHolder")), _.eLit(ns + " has {0} properties:", _.eLen(_.n("items"), true))),
                    _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("ShowQuickPick" + (this.gen.options.funcOverloads ? "" : "2"))),
                        _.n("items"), _.oAddr(_.n("opts")), _.eZilch(), _.n("quit")
                    )
                ),
            ),
        ]
    }

    genDemoOfStrListMenu(_: Builder, ns: string, fn: string, desc: string, ...args: Expr[]): Instr[] {
        return [
            _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n(ns))), _.n(fn)),
                ...args.concat(_.eFunc([{ Name: "items", Type: { ValsOf: TypeRefPrim.String } }], null,
                    _.iVar("opts", { Name: "QuickPickOptions" }),
                    _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })),
                    _.iSet(_.oDot(_.n("opts"), _.n("IgnoreFocusOut")), _.eLit(true)),
                    _.iSet(_.oDot(_.n("opts"), _.n("PlaceHolder")), _.eLit("Retrieved {0} " + desc, _.eLen(_.n("items"), true))),
                    _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("ShowQuickPick" + (this.gen.options.funcOverloads ? "" : "2"))),
                        _.n("items"), _.oAddr(_.n("opts")), _.eZilch(), _.n("quit")
                    )
                ))
            )
        ]
    }
}
