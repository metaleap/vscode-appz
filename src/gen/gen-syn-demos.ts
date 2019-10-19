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

    constructor(gen: Gen, b: Builder, ...names: string[]) {
        const _ = b
        this.gen = gen
        this.all = {

            "demo_Commands_GetCommands_and_ExecuteCommand": () =>
                this.genDemoOfStrListMenu(_, "Commands", "GetCommands", "command ID(s), pick one to execute or escape now:", [_.eLit(false)],
                    _.eFunc([{ Name: "item", Type: { Maybe: TypeRefPrim.String } }], null,
                        _.iIf(_.oIsnt(_.n("item")), [
                            this.genByeMsg(_, "Command selection cancelled, bye now!"),
                        ], this.genInput(_, "opts2", "cmdarg", [{ k: "PlaceHolder", v: _.eLit("Any param for `{0}` command? Else leave blank.", _.oDeref(_.n("item"))) }],
                            _.iVar("cmdargs", { ValsOf: TypeRefPrim.Any }),
                            _.iIf(_.oNeq(_.eLit(""), _.oDeref(_.n("cmdarg"))), [
                                _.iSet(_.n("cmdargs"), _.eCollNew(_.eLit(1), TypeRefPrim.Any, true)),
                                _.iSet(_.oIdx(_.n("cmdargs"), _.eLit(0)), _.oDeref(_.n("cmdarg"))),
                            ]),
                            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Commands"))), _.n("ExecuteCommand")),
                                _.oDeref(_.n("item")), _.n("cmdargs"),
                            ), _.eFunc([{ Name: "ret", Type: TypeRefPrim.Any }], null,
                                this.genInfoMsg(_, _.eLit("Command result was: {0}", _.n("ret"))),
                            ))
                        )),
                    ),
                ),

            "demo_Commands_RegisterCommand": () =>
                this.genInput(_, "opts", "cmdname", [{ k: "Value", v: _.eLit("foo.bar.baz") }, { k: "Prompt", v: _.eLit("Enter your command name. The command will accept a single text input and return a result built from it.") }],
                    _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Commands"))), _.n("RegisterCommand")),
                        _.oDeref(_.n("cmdname")), _.eFunc([{ Name: "cmdargs", Type: { ValsOf: TypeRefPrim.Any } }], TypeRefPrim.Any,
                            this.genStatusMsg(_, _.eLit("Command `{0}` invoked with: `{1}`", _.oDeref(_.n("cmdname")), _.oIdx(_.n("cmdargs"), _.eLit(0)))),
                            _.iRet(_.eLit("Input to command `{0}` was: `{1}`", _.oDeref(_.n("cmdname")), _.oIdx(_.n("cmdargs"), _.eLit(0)))),
                        ),
                    ), _.eFunc([{ Name: "useToUnregister", Type: { Maybe: { Name: "Disposable" } } }], null,
                        ...this.genInput(_, "opts2", "cmdarg", [{ k: "Prompt", v: _.eLit("Command `{0}` registered, try it now?", _.oDeref(_.n("cmdname"))) }, { k: "Value", v: _.eLit("Enter input to command `{0}` here", _.oDeref(_.n("cmdname"))) }],
                            _.iVar("cmdargs2", { ValsOf: TypeRefPrim.Any }),
                            _.iSet(_.n("cmdargs2"), _.eCollNew(_.eLit(1), TypeRefPrim.Any, true)),
                            _.iSet(_.oIdx(_.n("cmdargs2"), _.eLit(0)), _.oDeref(_.n("cmdarg"))),
                            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Commands"))), _.n("ExecuteCommand")),
                                _.oDeref(_.n("cmdname")), _.n("cmdargs2")),
                                _.eFunc([{ Name: "ret", Type: TypeRefPrim.Any }], null,
                                    this.genInfoMsg(_, _.eLit("Command result: {0}", _.n("ret"))),
                                ))
                        ),
                    ))
                ),

            "demo_Languages_GetLanguages": () =>
                this.genDemoOfStrListMenu(_, "Languages", "GetLanguages", "language ID(s)", []),

            "demo_Env_Properties": () =>
                this.genDemoOfPropsMenu(_, "Env"),

            "demo_Workspace_Properties": () =>
                this.genDemoOfPropsMenu(_, "Workspace"),

            "demo_Window_ShowOpenDialog": () =>
                this.genDemoOfDialog(_, "Open", true, "Note: won't actually read from specified file path(s)"),

            "demo_Window_ShowSaveDialog": () =>
                this.genDemoOfDialog(_, "Save", false, "Note: won't actually write to specified file path"),

            "demo_Window_ShowWorkspaceFolderPick": () => [
                _.iVar("opts", { Maybe: { Name: "WorkspaceFolderPickOptions" } }),
                _.iSet(_.n("opts"), _.eNew({ Maybe: { Name: "WorkspaceFolderPickOptions" } })),
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)),
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("PlaceHolder"))), _.eLit("Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side.")),
                _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("ShowWorkspaceFolderPick")), _.n("opts")),
                    _.eFunc([{ Name: "pickedfolder", Type: { Maybe: { Name: "WorkspaceFolder" } } }], null,
                        _.eCall(_.n("statusNoticeQuit")),
                        _.iIf(_.oIsnt(_.n("pickedfolder")), [
                            this.genByeMsg(_, "Cancelled pick input, bye now!"),
                        ], [
                            this.genInfoMsg(_, _.eLit("Selected `{0}` located at `{1}`, bye now!", _.oDot(_.n("pickedfolder"), _.n(this.fld("Name"))), _.oDot(_.n("pickedfolder"), _.n(this.fld("Uri"))))),
                        ]),
                    )
                )
            ],

            "demo_Env_OpenExternal": () => this.genInput(_, "opts", "uri", [{ k: "Value", v: _.eLit("http://foo.bar/baz") }, { k: "Prompt", v: _.eLit("Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol.") }],
                _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Env"))), _.n("OpenExternal")), _.oDeref(_.n("uri"))),
                    _.eFunc([{ Name: "ok", Type: TypeRefPrim.Bool }], null,
                        _.iVar("did", TypeRefPrim.String),
                        _.iSet(_.n("did"), _.eLit("Did")),
                        _.iIf(_.oNot(_.n("ok")), [
                            _.iSet(_.n("did"), _.eOp(" + ", _.n("did"), _.eLit(" not")))
                        ]),
                        this.genInfoMsg(_, _.eLit("{0} succeed in opening `{1}`, bye now!", _.n("did"), _.oDeref(_.n("uri")))),
                    )
                )
            ),

            "demo_Window_ShowQuickPick": () => {
                const items = [
                    ["One", "The first", "Das erste"],
                    ["Two", "The second", "Das zweite"],
                    ["Three", "The third", "Das dritte"],
                    ["Four", "The fourth", "Das vierte"],
                ]
                return ([
                    _.iVar("items", { ValsOf: { Name: "QuickPickItem" } }),
                    _.iSet(_.n("items"), _.eCollNew(_.eLit(items.length), { Name: "QuickPickItem" }, true)),
                ] as Instr[]).concat(
                    _.EACH(items, (item, idx) => [
                        _.iSet(_.oIdx(_.n("items"), _.eLit(idx)), _.eNew({ Name: "QuickPickItem" })),
                        _.iSet(_.oDot(_.oIdx(_.n("items"), _.eLit(idx)), _.n(this.fld("Label"))), _.eLit(item[0])),
                        _.iSet(_.oDot(_.oIdx(_.n("items"), _.eLit(idx)), _.n(this.fld("Description"))), _.eLit(item[1])),
                        _.iSet(_.oDot(_.oIdx(_.n("items"), _.eLit(idx)), _.n(this.fld("Detail"))), _.eLit(item[2])),
                    ])
                ).concat(
                    _.iVar("opts", { Name: "QuickPickOptions" }),
                    _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })),
                    _.iSet(_.oDot(_.n("opts"), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)),
                    _.iSet(_.oDot(_.n("opts"), _.n(this.fld("MatchOnDescription"))), _.eLit(true)),
                    _.iSet(_.oDot(_.n("opts"), _.n(this.fld("MatchOnDetail"))), _.eLit(true)),
                    _.iSet(_.oDot(_.n("opts"), _.n(this.fld("PlaceHolder"))), _.eLit("You have 42 seconds before auto-cancellation!")),
                    _.iSet(_.oDot(_.n("opts"), _.n(this.fld("OnDidSelectItem"))),
                        _.eFunc([{ Name: "item", Type: { Name: "QuickPickItem" } }], TypeRefPrim.Any,
                            this.genStatusMsg(_, _.eLit("Just selected: {0}", _.oDot(_.n("item"), _.n(this.fld("Label"))))),
                            _.iRet(_.eZilch()),
                        ),
                    ),
                    _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowQuickPick", 3))),
                        _.n("items"), _.n("opts"), _.eCall(_.n("cancelIn"), _.eLit(42)),
                    ), _.eFunc([{ Name: "pickeditems", Type: { ValsOf: { Name: "QuickPickItem" } } }], null,
                        _.eCall(_.n("statusNoticeQuit")),
                        _.iIf(_.oIsnt(_.n("pickeditems")), [
                            this.genByeMsg(_, "Cancelled pick input, bye now!"),
                        ], [
                            this.genInfoMsg(_, _.eLit("You picked {0} item(s), bye now!", _.eLen(_.n("pickeditems"), true))),
                        ]),
                    ))
                )
            },

            "subscribeToMiscEvents": () => this.genEventSubs(_, [
                { ns: "Extensions", evtName: "OnDidChange", msg: _.eLit("Some extension(s) were just (un)installed or (de)activated.") },
                { ns: "Window", evtName: "OnDidChangeWindowState", evtArgs: "WindowState", msg: _.eLit("Am I focused? {0}.", _.oDot(_.n("evt"), _.n(this.fld("Focused")))) },
                { ns: "Languages", evtName: "OnDidChangeDiagnostics", evtArgs: "DiagnosticChangeEvent", msg: _.eLit("Diag(s) changed for {0} file path(s).", _.eLen(_.oDot(_.n("evt"), _.n(this.fld("Uris"))), true)) },
            ]),

            "statusNoticeQuit": () => [
                this.genStatusMsg(_, _.eLit("Reacting to the 'bye now' WILL end the prog.")),
            ],

        }

        for (const name in this.all)
            if (name.startsWith("demo_"))
                names.push(name)
        this.all["demosMenu"] = () => ([
            _.iVar("items", { ValsOf: TypeRefPrim.String }),
            _.iSet(_.n("items"), _.eLit(names)),
        ] as Instr[]).concat(
            ...this.genMenu(_, _.eLit("Dismissing this menu WILL end the prog."),
                _.eFunc([{ Name: "menuitem", Type: { Maybe: TypeRefPrim.String } }], null,
                    _.iIf(_.oIsnt(_.n("menuitem")), [
                        _.eCall(_.n("quit"), _.eZilch()),
                    ], names.map(name => _.iIf(_.oEq(_.eLit(name), _.oDeref(_.n("menuitem"))), [
                        _.eCall(_.n(name)),
                    ]))),
                ),
            )
        )
    }

    genEventSubs(_: Builder, subs: { ns: string, evtName: string, evtArgs?: string, msg: Expr }[]): Instr[] {
        const ret: Instr[] = []
        for (const sub of subs)
            ret.push(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n(sub.ns))), _.n(sub.evtName)),
                _.eFunc(sub.evtArgs ? [{ Name: "evt", Type: { Name: sub.evtArgs } }] : [], null,
                    this.genStatusMsg(_, sub.msg))))
        return ret
    }

    genDemoOfDialog(_: Builder, which: string, mult: boolean, label: string): Instr[] {
        const fp = mult ? "filepaths" : "filepath"
        return [
            _.iVar("opts", { Name: which + "DialogOptions" }),
            _.iSet(_.n("opts"), _.eNew({ Name: which + "DialogOptions" })),
            _.iSet(_.oDot(_.n("opts"), _.n(this.fld(which + "Label"))), _.eLit(label)),
            _.iSet(_.oDot(_.n("opts"), _.n(this.fld("Filters"))), { KeyType: TypeRefPrim.String, ElemType: { ValsOf: TypeRefPrim.String }, Cap: _.eLit(2) }),
            _.iSet(_.oIdx(_.oDot(_.n("opts"), _.n(this.fld("Filters"))), _.eLit("All")), _.eLit(["*"])),
            _.iSet(_.oIdx(_.oDot(_.n("opts"), _.n(this.fld("Filters"))), _.eLit("Dummy Filter")), _.eLit(["dummy", "demo"])),
            _.iBlock(..._.WHEN(mult, () => [
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("CanSelectFiles"))), _.eLit(true)),
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("CanSelectFolders"))), _.eLit(false)),
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("CanSelectMany"))), _.eLit(true)),
            ])),
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(`Show${which}Dialog`)), _.n("opts")),
                _.eFunc([{ Name: fp, Type: mult ? { ValsOf: TypeRefPrim.String } : { Maybe: TypeRefPrim.String } }], null,
                    _.eCall(_.n("statusNoticeQuit")),
                    _.iIf(_.oIsnt(_.n(fp)), [
                        this.genByeMsg(_, `Cancelled File-${which} dialog, bye now!`),
                    ], [
                        this.genInfoMsg(_, _.eLit("Selected " + (mult ? "{0} file path(s)" : "file path `{0}`") + ", bye now!", mult ? (_.eLen(_.n(fp), true)) : _.oDeref(_.n(fp)))),
                    ]),
                ))
        ]
    }

    genByeMsg(_: Builder, msg: string): Instr {
        return _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowWarningMessage", 1))), _.eLit(msg), _.eZilch()), _.n("quit"))
    }

    genInfoMsg(_: Builder, msg: Expr): Instr {
        return _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowInformationMessage", 1))), msg, _.eZilch()), _.n("quit"))
    }

    genInput(_: Builder, nameOpts: string, nameInput: string, props: { k: string, v: Expr }[], ...withInput: Instr[]): Instr[] {
        return ([
            _.iVar(nameOpts, { Maybe: { Name: "InputBoxOptions" } }),
            _.iSet(_.n(nameOpts), _.eNew({ Maybe: { Name: "InputBoxOptions" } })),
            _.iSet(_.oDot(_.n(nameOpts), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)),
        ] as Instr[]).concat(..._.EACH(props, prop => [
            _.iSet(_.oDot(_.n(nameOpts), _.n(this.fld(prop.k))), prop.v)
        ] as Instr[])).concat(
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("ShowInputBox")),
                _.n(nameOpts), _.eZilch(),
            ), _.eFunc([{ Name: nameInput, Type: { Maybe: TypeRefPrim.String } }], null,
                _.iIf(_.oIsnt(_.n(nameInput)), [
                    this.genByeMsg(_, "You cancelled, bye now!"),
                ], withInput),
            )),
        )
    }

    genStatusMsg(_: Builder, msg: Expr): Instr {
        return _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("SetStatusBarMessage", 1))), msg, _.eLit(4242))
    }

    genDemoOfPropsMenu(_: Builder, ns: string): Instr[] {
        const struct = this.gen.allStructs[ns + "Properties"]

        return [
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n(ns))), _.n("Properties"))),
                _.eFunc([{ Name: "props", Type: { Name: struct.Name } }], null,
                    _.iVar("items", { ValsOf: TypeRefPrim.String }),
                    _.iSet(_.n("items"), _.eCollNew(_.eLit(struct.Fields.length), TypeRefPrim.String, true)),
                    _.iBlock(..._.EACH(struct.Fields, (f, i): Instr[] => [
                        _.iSet(_.oIdx(_.n("items"), _.eLit(i)), _.eLit(f.Name + "\t".repeat(f.Name.length < 8 ? 3 : f.Name.length >= 16 ? 1 : 2) + "{0}", _.oDot(_.n("props"), _.n(f.Name)))),
                    ]).concat(
                        ...this.genMenu(_, _.eLit(ns + " has {0} properties:", _.eLen(_.n("items"), true)), _.n("quit"))
                    )),
                ),
            ),
        ]
    }

    genDemoOfStrListMenu(_: Builder, ns: string, fn: string, desc: string, args: Expr[], onPick?: Expr): Instr[] {
        return [
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n(ns))), _.n(fn)),
                ...args
            ), _.eFunc([{ Name: "items", Type: { ValsOf: TypeRefPrim.String } }], null,
                ...this.genMenu(_, _.eLit("Retrieved {0} " + desc, _.eLen(_.n("items"), true)), onPick ? onPick : _.n("quit")),
            ))
        ]
    }

    genMenu(_: Builder, msg: Expr, onPick: Expr): Instr[] {
        return [
            _.iVar("opts", { Name: "QuickPickOptions" }),
            _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })),
            _.iSet(_.oDot(_.n("opts"), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)),
            _.iSet(_.oDot(_.n("opts"), _.n(this.fld("PlaceHolder"))), msg),
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowQuickPick", 2))),
                _.n("items"), _.oAddr(_.n("opts")), _.eZilch()
            ), onPick)
        ]
    }

    fn(name: string, overload: number): string {
        return name + overload
    }

    fld(name: string): string {
        return this.gen.nameRewriters.fields(name)
    }
}
