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

            "demo_promptToExit": () => [
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowWarningMessage", 1)), _.eLit("Are you sure you want `{0}` to exit?", _.n("appName")), _.eLit(["Sure I'm sure"])),
                    _.eFunc([{ Name: "btn", Type: { Maybe: TypeRefPrim.String } }], null,
                        _.iIf(_.oIs(_.n("btn")), [
                            this.genInfoMsg(_, _.eLit("So fish and long for all the thanks!")),
                            _.eCall(_.n("quit"), _.eZilch()),
                        ], [
                            this.genInfoMsg(_, _.eLit("So I'm not a goner yet. I'll stick around then.")),
                        ]),
                    ),
                )
            ],

            "demo_clipboard": () => [
                _.eCall(_.eCall(_._(_.eCall(_._(_.eProp(_._("vsc", "Env")), "Clipboard")), "ReadText")),
                    _.eFunc([{ Name: "text", Type: { Maybe: TypeRefPrim.String } }], null,
                        _.iIf(_.oIsnt(_.n("text")), [
                            this.genByeMsg(_, "No text in clipboard"),
                        ], this.genInput(
                            _, "opts", "input", [{ k: "Value", v: _.oDeref(_.n("text")) }, { k: "Prompt", v: _.eLit("Enter new contents to write to your clipboard.") }],
                            _.eCall(_.eCall(_._(_.eCall(_._(_.eProp(_._("vsc", "Env")), "Clipboard")), "WriteText"), _.oDeref(_.n("input"))),
                                _.eFunc([], null,
                                    this.genInfoMsg(_, _.eLit("Okay. Now double-check by pasting somewhere.")),
                                ),
                            ),
                        )),
                    ),
                ),
            ],

            "demo_Commands_GetCommands_and_ExecuteCommand": () =>
                this.genDemoOfStrListMenu(_, "Commands", "GetCommands", "command ID(s), pick one to execute or escape now:", [_.eLit(false)],
                    _.eFunc([{ Name: "item", Type: { Maybe: TypeRefPrim.String } }], null,
                        _.iIf(_.oIsnt(_.n("item")), [
                            this.genByeMsg(_, "Command selection cancelled, spooked?"),
                        ], this.genInput(_, "opts2", "cmdarg", [{ k: "PlaceHolder", v: _.eLit("Any param for `{0}` command? Else leave blank.", _.oDeref(_.n("item"))) }],
                            _.iVar("cmdargs", { ValsOf: TypeRefPrim.Any }),
                            _.iIf(_.oNeq(_.eLit(""), _.oDeref(_.n("cmdarg"))), [
                                _.iSet(_.n("cmdargs"), _.eCollNew(_.eLit(1), TypeRefPrim.Any, true)),
                                _.iSet(_.oIdx(_.n("cmdargs"), _.eLit(0)), _.oDeref(_.n("cmdarg"))),
                            ]),
                            _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Commands")), "ExecuteCommand"),
                                _.oDeref(_.n("item")), _.n("cmdargs"),
                            ), _.eFunc([{ Name: "ret", Type: TypeRefPrim.Any }], null,
                                this.genInfoMsg(_, _.eLit("Command result was: `{0}`, kudos!", _.n("ret"))),
                            ))
                        )),
                    ),
                ),

            "demo_Commands_RegisterCommand": () =>
                this.genInput(_, "opts", "cmdname", [{ k: "Value", v: _.eLit("foo.bar.baz") }, { k: "Prompt", v: _.eLit("Enter your command name. The command will accept a single text input and return a result built from it.") }],
                    _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Commands")), "RegisterCommand"),
                        _.oDeref(_.n("cmdname")), _.eFunc([{ Name: "cmdargs", Type: { ValsOf: TypeRefPrim.Any } }], TypeRefPrim.Any,
                            this.genStatusMsg(_, _.eLit("Command `{0}` invoked with: `{1}`", _.oDeref(_.n("cmdname")), _.oIdx(_.n("cmdargs"), _.eLit(0)))),
                            _.iRet(_.eLit("Input to command `{0}` was: `{1}`", _.oDeref(_.n("cmdname")), _.oIdx(_.n("cmdargs"), _.eLit(0)))),
                        ),
                    ), _.eFunc([{ Name: "useToUnregister", Type: { Maybe: { Name: "Disposable" } } }], null,
                        ...this.genInput(_, "opts2", "cmdarg", [{ k: "Prompt", v: _.eLit("Command `{0}` registered, try it now?", _.oDeref(_.n("cmdname"))) }, { k: "Value", v: _.eLit("Enter input to command `{0}` here", _.oDeref(_.n("cmdname"))) }],
                            _.iVar("cmdargs2", { ValsOf: TypeRefPrim.Any }),
                            _.iSet(_.n("cmdargs2"), _.eCollNew(_.eLit(1), TypeRefPrim.Any, true)),
                            _.iSet(_.oIdx(_.n("cmdargs2"), _.eLit(0)), _.oDeref(_.n("cmdarg"))),
                            _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Commands")), "ExecuteCommand"),
                                _.oDeref(_.n("cmdname")), _.n("cmdargs2")),
                                _.eFunc([{ Name: "ret", Type: TypeRefPrim.Any }], null,
                                    this.genInfoMsg(_, _.eLit("Command result: `{0}`, mad props!", _.n("ret"))),
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
                _.iSet(_._("opts", this.fld("IgnoreFocusOut")), _.eLit(true)),
                _.iSet(_._("opts", this.fld("PlaceHolder")), _.eLit("Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side.")),
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "ShowWorkspaceFolderPick"), _.n("opts")),
                    _.eFunc([{ Name: "pickedfolder", Type: { Maybe: { Name: "WorkspaceFolder" } } }], null,
                        _.iIf(_.oIsnt(_.n("pickedfolder")), [
                            this.genByeMsg(_, "Cancelled pick input, changed your mind?"),
                        ], [
                            this.genInfoMsg(_, _.eLit("Selected `{0}` located at `{1}`, respect!", _._("pickedfolder", this.fld("Name")), _._("pickedfolder", this.fld("Uri")))),
                        ]),
                    )
                )
            ],

            "demo_Env_OpenExternal": () => this.genInput(_, "opts", "uri", [{ k: "Value", v: _.eLit("http://github.com/metaleap/vscode-appz") }, { k: "Prompt", v: _.eLit("Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol.") }],
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Env")), "OpenExternal"), _.oDeref(_.n("uri"))),
                    _.eFunc([{ Name: "ok", Type: TypeRefPrim.Bool }], null,
                        _.iVar("did", TypeRefPrim.String),
                        _.iSet(_.n("did"), _.eLit("Did")),
                        _.iIf(_.oNot(_.n("ok")), [
                            _.iSet(_.n("did"), _.eOp(" + ", _.n("did"), _.eLit(" not")))
                        ]),
                        this.genInfoMsg(_, _.eLit("{0} succeed in opening `{1}`, chapeau!", _.n("did"), _.oDeref(_.n("uri")))),
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
                        _.iSet(_._(_.oIdx(_._("items"), _.eLit(idx)), this.fld("Label")), _.eLit(item[0])),
                        _.iSet(_._(_.oIdx(_._("items"), _.eLit(idx)), this.fld("Description")), _.eLit(item[1])),
                        _.iSet(_._(_.oIdx(_._("items"), _.eLit(idx)), this.fld("Detail")), _.eLit(item[2])),
                    ])
                ).concat(
                    _.iVar("opts", { Name: "QuickPickOptions" }),
                    _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })),
                    _.iSet(_._("opts", this.fld("IgnoreFocusOut")), _.eLit(true)),
                    _.iSet(_._("opts", this.fld("MatchOnDescription")), _.eLit(true)),
                    _.iSet(_._("opts", this.fld("MatchOnDetail")), _.eLit(true)),
                    _.iSet(_._("opts", this.fld("PlaceHolder")), _.eLit("You have 42 seconds before auto-cancellation!")),
                    _.iSet(_._("opts", this.fld("OnDidSelectItem")),
                        _.eFunc([{ Name: "item", Type: { Name: "QuickPickItem" } }], TypeRefPrim.Any,
                            this.genStatusMsg(_, _.eLit("Just selected: {0}", _._("item", this.fld("Label")))),
                            _.iRet(_.eZilch()),
                        ),
                    ),
                    _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowQuickPick", 3)),
                        _._("items"), _._("opts"), _.eCall(_.n("cancelIn"), _.eLit(42)),
                    ), _.eFunc([{ Name: "pickeditems", Type: { ValsOf: { Name: "QuickPickItem" } } }], null,
                        _.iIf(_.oIsnt(_.n("pickeditems")), [
                            this.genByeMsg(_, "Cancelled pick input, not one to tick the boxes?"),
                        ], [
                            this.genInfoMsg(_, _.eLit("You picked {0} item(s), good stuff!", _.eLen(_.n("pickeditems"), true))),
                        ]),
                    ))
                )
            },

            "demo_Window_CreateQuickPick": () => [
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "CreateQuickPick")),
                    _.eFunc([{ Name: "ctl", Type: { Name: "QuickPick" }, }, { Name: "cfg", Type: { Name: "QuickPickBag" } }], null,
                        _.iSet(_._("cfg", "IgnoreFocusOut"), _.eLit(true)),
                        _.iSet(_._("cfg", "Title"), _.eLit("I'm a full-fledged QuickPick")),
                        _.iSet(_._("cfg", "Step"), _.eLit(23)),
                        _.iSet(_._("cfg", "TotalSteps"), _.eLit(42)),
                        _.iSet(_._("cfg", "Items"), _.eCollNew(_.eLit(88), { Name: "QuickPickItem" }, true)),
                        _.iFor(_.n("i"), _.eCall(_._("nums1To"), _.eLit(88)),
                            _.iSet(_.oIdx(_._("cfg", "Items"), _._("i")), _.eNew({ Name: "QuickPickItem" })),
                            _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Label"), _.eLit("$(eye) Label {0}", _._("i"))),
                            _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Description"), _.eLit("$(gift) Description {0}", _._("i"))),
                            _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Detail"), _.eLit("$(globe~spin) Detail {0}", _._("i"))),
                            _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "AlwaysShow"), _.oEq(_._("i"), _.eLit(42))),
                        ),
                        _.eCall(_._("ctl", "Set"), _._("cfg")),
                        _.eCall(_._("ctl", "OnDidAccept"), _.eFunc([{ Name: "bag", Type: { Name: "QuickPickBag" } }], null,
                            _.eCall(_._("logLn"), _.eLit("Picked: {0}", _._("bag", "SelectedItems"))),
                            _.eCall(_._("ctl", "Hide")),
                        )),
                        _.eCall(_._("ctl", "OnDidHide"), _.eFunc([{ Name: "_", Type: { Name: "QuickPickBag" } }], null, _.eCall(_._("ctl", "Dispose")))),
                        _.eCall(_._("ctl", "Show")),
                    ),
                ),
            ],

            "demo_Window_CreateInputBox": () => [
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "CreateInputBox")),
                    _.eFunc([{ Name: "ctl", Type: { Name: "InputBox" } }, { Name: "cfg", Type: { Name: "InputBoxBag" } }], null,
                        _.iSet(_._("cfg", this.fld("IgnoreFocusOut")), _.eLit(true)),
                        _.iSet(_._("cfg", this.fld("Placeholder")), _.eLit("The initial Placeholder")),
                        _.iSet(_._("cfg", this.fld("Prompt")), _.eLit("The initial Prompt")),
                        _.iSet(_._("cfg", this.fld("Title")), _.eLit("The initial Title")),
                        _.eCall(_._("ctl", "Set"), _.n("cfg")),
                        _.eCall(_._("ctl", "OnDidChangeValue"), _.eFunc([{ Name: "input", Type: TypeRefPrim.String }, { Name: "bag", Type: { Name: "InputBoxBag" } }], null,
                            _.iSet(_._("bag", this.fld("Prompt")), _.eLit("Lower: {0}", _.eCall(_.n("strLo"), _._("bag", this.fld("Value"))))),
                            _.iSet(_._("bag", this.fld("Title")), _.eLit("Upper: {0}", _.eCall(_.n("strUp"), _._("bag", this.fld("Value"))))),
                            _.eCall(_._("ctl", "Set"), _.n("bag")),
                        )),
                        _.iVar("finalinputvalue", { Maybe: TypeRefPrim.String }),
                        _.eCall(_._("ctl", "OnDidAccept"), _.eFunc([{ Name: "bag", Type: { Name: "InputBoxBag" } }], null,
                            _.iSet(_.n("finalinputvalue"), _.oAddr(_._("bag", this.fld("Value")))),
                            _.eCall(_._("ctl", "Hide")),
                        )),
                        _.eCall(_._("ctl", "OnDidHide"), _.eFunc([{ Name: "bag", Type: { Name: "InputBoxBag" } }], null,
                            _.eCall(_._("ctl", "Dispose")),
                            _.iIf(_.oIs(_.n("finalinputvalue")), [
                                this.genInfoMsg(_, _.eLit("You entered: `{0}`, ponderous!", _.oDeref(_.n("finalinputvalue")))),
                            ], [
                                this.genByeMsg(_, "Backing off or backing up?"),
                            ]),
                        )),
                        _.eCall(_._("ctl", "Show")),
                    ),
                ),
            ],

            "subscribeToMiscEvents": () => this.genEventSubs(_, [
                { ns: "Extensions", evtName: "OnDidChange", msg: _.eLit("Some extension(s) were just (un)installed or (de)activated.") },
                { ns: "Window", evtName: "OnDidChangeWindowState", evtArgs: "WindowState", msg: _.eLit("Am I focused? {0}.", _._("evt", this.fld("Focused"))) },
                { ns: "Languages", evtName: "OnDidChangeDiagnostics", evtArgs: "DiagnosticChangeEvent", msg: _.eLit("Diag(s) changed for {0} file path(s).", _.eLen(_._("evt", this.fld("Uris")), true)) },
            ]),

        }

        const allnames: string[] = []
        for (const name in this.all)
            if (name.startsWith("demo_"))
                allnames.push(name)
        allnames.push(...names)

        this.all["demosMenu"] = () => ([
            _.iVar("items", { ValsOf: TypeRefPrim.String }),
            _.iSet(_.n("items"), _.eLit(allnames)),
        ] as Instr[]).concat(
            ...this.genMenu(_, _.eLit("This menu can be re-opened any time via our custom status-bar item."),
                _.eFunc([{ Name: "menuitem", Type: { Maybe: TypeRefPrim.String } }], null,
                    _.iIf(_.oIs(_.n("menuitem")), allnames.map(name => _.iIf(_.oEq(_.eLit(name), _.oDeref(_.n("menuitem"))), [
                        _.eCall(_.n("logLn"), _.eLit("Picked `" + name + "` from main menu")),
                        _.eCall(_.n(name)),
                    ]))),
                ),
            )
        )

        this.all["onUpAndRunning"] = () => ([
            _.iBlock(
                _.eCall(_.n("subscribeToMiscEvents")),
            ),
            _.iVar("logchan", { Maybe: { Name: "OutputChannel" } }),
            _.iVar("toggleonclick", TypeRefPrim.Bool),
            _.iBlock(
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "CreateOutputChannel"),
                    _.n("appName")), _.eFunc([{ Name: "it", Type: { Name: "OutputChannel" } }, { Name: "_unused", Type: { Name: "OutputChannelBag" } }], null,
                        _.iSet(_.n("logchan"), _.oAddr(_.n("it"))),
                        _.eCall(_._("setOutChan"), _._("logchan")),
                        _.eCall(_.n("logLn"), _.eCall(_.n("strFmt"), _.eLit("Hi, I'm `{0}`, this is my own custom `OutputChannel` where I leisurely log all your interactions with me. When I'm ended, it too will disappear."), _._("appName"))),
                        _.eCall(_.n("logLn"), _.eLit("")),
                        _.eCall(_.n("logLn"), _.eLit("NOTE that for logging error messages, you won't need to manually create a custom `OutputChannel` at all: just have your prog print to its `stderr` as (presumably) usual, and `vscode-appz` will then create a dedicated `OutputChannel` for (both that initial and all subsequent) `stderr` prints from your prog while it's up and running.")),
                        _.eCall(_.n("logLn"), _.eLit("")),
                        _.iIf(_.n("toggleonclick"), [
                            _.eCall(_.n("logLn"), _.eLit("Note also that every click on my status-bar item will toggle my visibility.")),
                            _.eCall(_.n("logLn"), _.eLit("")),
                        ]),
                        _.eCall(_._("logchan", "Show"), _.eLit(true)),
                    )
                ),
            ),
            _.iBlock(
                _.iVar("statusitem", { Name: "StatusBarItem" }),
                _.iVar("clickcount", TypeRefPrim.Int),
                _.iSet(_.n("clickcount"), _.eLit(0)),
                _.iVar("mycmd", { From: [{ ValsOf: TypeRefPrim.Any }], To: TypeRefPrim.Any }),
                _.iSet(_.n("mycmd"), _.eFunc([{ Name: "_unused", Type: { ValsOf: TypeRefPrim.Any } }], TypeRefPrim.Any,
                    _.iSet(_.n("clickcount"), _.eOp("+", _.eLit(1), _.n("clickcount"))),
                    _.eCall(_.eCall(_._("statusitem", "Get")), _.eFunc([{ Name: "props", Type: { Name: "StatusBarItemBag" } }], null,
                        _.iSet(_._("props", this.fld("Text")), _.eCall(_.n("logLn"), _.eLit("You clicked me {0} time(s).", _.n("clickcount")))),
                        _.iIf(_.oEq(_.eLit("editorLightBulb.foreground"), _._("props", this.fld("Color"))), [
                            _.iSet(_._("props", this.fld("Color")), _.eLit("terminal.ansiGreen")),
                            _.iIf(_.oAnd(_.n("toggleonclick"), _.oIs(_.n("logchan"))), [_.eCall(_._("logchan", "Hide"))]),
                        ], [
                            _.iSet(_._("props", this.fld("Color")), _.eLit("editorLightBulb.foreground")),
                            _.iIf(_.oAnd(_.n("toggleonclick"), _.oIs(_.n("logchan"))), [_.eCall(_._("logchan", "Show"), _.eLit(true))]),
                        ]),
                        _.eCall(_.eCall(_._("statusitem", "Set"), _.n("props")), _.n("demosMenu")),
                    )),
                    _.iRet(_.eZilch()),
                )),
                _.eCall(_._(_.eProp(_._("vsc", "Commands")), "RegisterCommand"), _._("cmdName"), _._("mycmd")),
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "CreateStatusBarItem"),
                    _.eLit(0), _.eZilch(),
                ), _.eFunc([{ Name: "it", Type: { Name: "StatusBarItem" } }, { Name: "cfg", Type: { Name: "StatusBarItemBag" } }], null,
                    _.iSet(_._("statusitem"), _._("it")),
                    _.iSet(_._("cfg", this.fld("Tooltip")), _.eLit("Hi from {0}!", _.n("appName"))),
                    _.iSet(_._("cfg", this.fld("Text")), _.eLit("You clicked me 0 time(s).")),
                    _.iSet(_._("cfg", this.fld("Color")), _.eLit("#42BEEF")),
                    _.iSet(_._("cfg", this.fld("Command")), _.n("cmdName")),
                    _.eCall(_._("statusitem", "Set"), _._("cfg")),
                    _.eCall(_._("statusitem", "Show")),
                )),
            ),
        ])
    }

    genEventSubs(_: Builder, subs: { ns: string, evtName: string, evtArgs?: string, msg: Expr }[]): Instr[] {
        const ret: Instr[] = []
        for (const sub of subs)
            ret.push(_.eCall(_._(_.eProp(_._("vsc", sub.ns)), sub.evtName),
                _.eFunc(sub.evtArgs ? [{ Name: "evt", Type: { Name: sub.evtArgs } }] : [], null,
                    this.genStatusMsg(_, sub.msg))))
        return ret
    }

    genDemoOfDialog(_: Builder, which: string, mult: boolean, label: string): Instr[] {
        const fp = mult ? "filepaths" : "filepath"
        return [
            _.iVar("opts", { Name: which + "DialogOptions" }),
            _.iSet(_.n("opts"), _.eNew({ Name: which + "DialogOptions" })),
            _.iSet(_._("opts", this.fld(which + "Label")), _.eLit(label)),
            _.iSet(_._("opts", this.fld("Filters")), { KeyType: TypeRefPrim.String, ElemType: { ValsOf: TypeRefPrim.String }, Cap: _.eLit(2) }),
            _.iSet(_.oIdx(_._("opts", this.fld("Filters")), _.eLit("All")), _.eLit(["*"])),
            _.iSet(_.oIdx(_._("opts", this.fld("Filters")), _.eLit("Dummy Filter")), _.eLit(["dummy", "demo"])),
            _.iBlock(..._.WHEN(mult, () => [
                _.iSet(_._("opts", this.fld("CanSelectFiles")), _.eLit(true)),
                _.iSet(_._("opts", this.fld("CanSelectFolders")), _.eLit(false)),
                _.iSet(_._("opts", this.fld("CanSelectMany")), _.eLit(true)),
            ])),
            _.eCall(_.n("logLn"), _.eLit(`Showing File-${which} dialog...`)),
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), `Show${which}Dialog`), _.n("opts")),
                _.eFunc([{ Name: fp, Type: mult ? { ValsOf: TypeRefPrim.String } : { Maybe: TypeRefPrim.String } }], null,
                    _.iIf(_.oIsnt(_.n(fp)), [
                        this.genByeMsg(_, `Cancelled File-${which} dialog, chicken?`),
                    ], [
                        this.genInfoMsg(_, _.eLit("Selected " + (mult ? "{0} file path(s)" : "file path `{0}`") + ", excellent!", mult ? (_.eLen(_.n(fp), true)) : _.oDeref(_.n(fp)))),
                    ]),
                ))
        ]
    }

    genByeMsg(_: Builder, msg: string): Instr {
        return _.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowWarningMessage", 1)), _.eCall(_.n("logLn"), _.eLit(msg)), _.eZilch())
    }

    genInfoMsg(_: Builder, msg: Expr): Instr {
        return _.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowInformationMessage", 1)), _.eCall(_.n("logLn"), msg), _.eZilch())
    }

    genInput(_: Builder, nameOpts: string, nameInput: string, props: { k: string, v: Expr }[], ...withInput: Instr[]): Instr[] {
        return ([
            _.iVar(nameOpts, { Maybe: { Name: "InputBoxOptions" } }),
            _.iSet(_.n(nameOpts), _.eNew({ Maybe: { Name: "InputBoxOptions" } })),
            _.iSet(_._(nameOpts, this.fld("IgnoreFocusOut")), _.eLit(true)),
        ] as Instr[]).concat(..._.EACH(props, (prop): Instr[] => {
            return _.WHEN(prop.k === "Prompt" || prop.k === "PlaceHolder", () => [
                _.eCall(_.n("logLn"), _.eLit(nameInput + "/" + nameOpts + "/{0}:\t{1}", _.eLit(prop.k), prop.v)),
            ]).concat([
                _.iSet(_._(nameOpts, this.fld(prop.k)), prop.v)
            ])
        })).concat(
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "ShowInputBox"),
                _.n(nameOpts), _.eZilch(),
            ), _.eFunc([{ Name: nameInput, Type: { Maybe: TypeRefPrim.String } }], null,
                _.iIf(_.oIsnt(_.n(nameInput)), [
                    this.genByeMsg(_, "Cancelled text input, out of ideas?"),
                ], ([
                    _.eCall(_.n("logLn"), _.eLit(nameInput + " <- {0}", _.oDeref(_.n(nameInput)))),
                ] as Instr[]).concat(withInput)),
            )),
        )
    }

    genStatusMsg(_: Builder, msg: Expr): Instr {
        return _.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("SetStatusBarMessage", 1)), _.eCall(_.n("logLn"), msg), _.eLit(4242))
    }

    genDemoOfPropsMenu(_: Builder, ns: string): Instr[] {
        const struct = this.gen.allStructs[ns + "Bag"]

        return [
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", ns)), "AllProperties")),
                _.eFunc([{ Name: "props", Type: { Name: struct.Name } }], null,
                    _.iVar("items", { ValsOf: TypeRefPrim.String }),
                    _.iSet(_.n("items"), _.eCollNew(_.eLit(struct.Fields.length), TypeRefPrim.String, true)),
                    _.iBlock(..._.EACH(struct.Fields, (f, i): Instr[] => [
                        _.iSet(_.oIdx(_.n("items"), _.eLit(i)), _.eLit(f.Name + "\t".repeat(f.Name.length < 8 ? 3 : f.Name.length >= 16 ? 1 : 2) + "{0}", _._("props", f.Name))),
                    ]).concat(
                        ...this.genMenu(_, _.eOp("+", _.eCall(_.n("logLn"), _.eLit(ns + " has {0} properties", _.eLen(_.n("items"), true))), _.eLit(":")))
                    )),
                ),
            ),
        ]
    }

    genDemoOfStrListMenu(_: Builder, ns: string, fn: string, desc: string, args: Expr[], onPick?: Expr): Instr[] {
        return [
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", ns)), fn),
                ...args
            ), _.eFunc([{ Name: "items", Type: { ValsOf: TypeRefPrim.String } }], null,
                ...this.genMenu(_, _.eLit("Retrieved {0} " + desc, _.eLen(_.n("items"), true)), onPick),
            ))
        ]
    }

    genMenu(_: Builder, msg: Expr, onPick?: Expr): Instr[] {
        return [
            _.iVar("opts", { Name: "QuickPickOptions" }),
            _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })),
            _.iSet(_._("opts", this.fld("IgnoreFocusOut")), _.eLit(true)),
            _.iSet(_._("opts", this.fld("PlaceHolder")), msg),
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowQuickPick", 2)),
                _.n("items"), _.oAddr(_.n("opts")), _.eZilch()
            ), onPick ? onPick : _.eFunc([{ Name: "menuitem", Type: { Maybe: TypeRefPrim.String } }], null,
                _.iIf(_.oIs(_.n("menuitem")), [_.eCall(_.n("logLn"), _.oDeref(_.n("menuitem")))]),
            ))
        ]
    }

    fn(name: string, overload: number): string {
        return name + overload
    }

    fld(name: string): string {
        return this.gen.nameRewriters.fields(name)
    }
}
