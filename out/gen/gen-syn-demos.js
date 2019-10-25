"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_syn_1 = require("./gen-syn");
class GenDemos {
    constructor(gen, b, ...names) {
        const _ = b;
        this.gen = gen;
        this.all = {
            "demo_promptToExit": () => [
                _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowWarningMessage", 1))), _.eLit("Are you sure you want `{0}` to exit?", _.n("appName")), _.eLit(["Sure I'm sure"])), _.eFunc([{ Name: "btn", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIs(_.n("btn")), [
                    this.genInfoMsg(_, _.eLit("So fish and long for all the thanks!")),
                    _.eCall(_.n("quit"), _.eZilch()),
                ], [
                    this.genInfoMsg(_, _.eLit("So I'm not a goner yet. I'll stick around then.")),
                ])))
            ],
            "demo_clipboard": () => [
                _.eCall(_.eCall(_.oDot(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Env"))), _.n("Clipboard"))), _.n("ReadText"))), _.eFunc([{ Name: "text", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIsnt(_.n("text")), [
                    this.genByeMsg(_, "No text in clipboard"),
                ], this.genInput(_, "opts", "input", [{ k: "Value", v: _.oDeref(_.n("text")) }, { k: "Prompt", v: _.eLit("Enter new contents to write to your clipboard.") }], _.eCall(_.eCall(_.oDot(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Env"))), _.n("Clipboard"))), _.n("WriteText")), _.oDeref(_.n("input"))), _.eFunc([], null, this.genInfoMsg(_, _.eLit("Okay. Now double-check by pasting somewhere.")))))))),
            ],
            "demo_Commands_GetCommands_and_ExecuteCommand": () => this.genDemoOfStrListMenu(_, "Commands", "GetCommands", "command ID(s), pick one to execute or escape now:", [_.eLit(false)], _.eFunc([{ Name: "item", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIsnt(_.n("item")), [
                this.genByeMsg(_, "Command selection cancelled, spooked?"),
            ], this.genInput(_, "opts2", "cmdarg", [{ k: "PlaceHolder", v: _.eLit("Any param for `{0}` command? Else leave blank.", _.oDeref(_.n("item"))) }], _.iVar("cmdargs", { ValsOf: gen_syn_1.TypeRefPrim.Any }), _.iIf(_.oNeq(_.eLit(""), _.oDeref(_.n("cmdarg"))), [
                _.iSet(_.n("cmdargs"), _.eCollNew(_.eLit(1), gen_syn_1.TypeRefPrim.Any, true)),
                _.iSet(_.oIdx(_.n("cmdargs"), _.eLit(0)), _.oDeref(_.n("cmdarg"))),
            ]), _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Commands"))), _.n("ExecuteCommand")), _.oDeref(_.n("item")), _.n("cmdargs")), _.eFunc([{ Name: "ret", Type: gen_syn_1.TypeRefPrim.Any }], null, this.genInfoMsg(_, _.eLit("Command result was: `{0}`, kudos!", _.n("ret"))))))))),
            "demo_Commands_RegisterCommand": () => this.genInput(_, "opts", "cmdname", [{ k: "Value", v: _.eLit("foo.bar.baz") }, { k: "Prompt", v: _.eLit("Enter your command name. The command will accept a single text input and return a result built from it.") }], _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Commands"))), _.n("RegisterCommand")), _.oDeref(_.n("cmdname")), _.eFunc([{ Name: "cmdargs", Type: { ValsOf: gen_syn_1.TypeRefPrim.Any } }], gen_syn_1.TypeRefPrim.Any, this.genStatusMsg(_, _.eLit("Command `{0}` invoked with: `{1}`", _.oDeref(_.n("cmdname")), _.oIdx(_.n("cmdargs"), _.eLit(0)))), _.iRet(_.eLit("Input to command `{0}` was: `{1}`", _.oDeref(_.n("cmdname")), _.oIdx(_.n("cmdargs"), _.eLit(0)))))), _.eFunc([{ Name: "useToUnregister", Type: { Maybe: { Name: "Disposable" } } }], null, ...this.genInput(_, "opts2", "cmdarg", [{ k: "Prompt", v: _.eLit("Command `{0}` registered, try it now?", _.oDeref(_.n("cmdname"))) }, { k: "Value", v: _.eLit("Enter input to command `{0}` here", _.oDeref(_.n("cmdname"))) }], _.iVar("cmdargs2", { ValsOf: gen_syn_1.TypeRefPrim.Any }), _.iSet(_.n("cmdargs2"), _.eCollNew(_.eLit(1), gen_syn_1.TypeRefPrim.Any, true)), _.iSet(_.oIdx(_.n("cmdargs2"), _.eLit(0)), _.oDeref(_.n("cmdarg"))), _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Commands"))), _.n("ExecuteCommand")), _.oDeref(_.n("cmdname")), _.n("cmdargs2")), _.eFunc([{ Name: "ret", Type: gen_syn_1.TypeRefPrim.Any }], null, this.genInfoMsg(_, _.eLit("Command result: `{0}`, mad props!", _.n("ret"))))))))),
            "demo_Languages_GetLanguages": () => this.genDemoOfStrListMenu(_, "Languages", "GetLanguages", "language ID(s)", []),
            "demo_Env_Properties": () => this.genDemoOfPropsMenu(_, "Env"),
            "demo_Workspace_Properties": () => this.genDemoOfPropsMenu(_, "Workspace"),
            "demo_Window_ShowOpenDialog": () => this.genDemoOfDialog(_, "Open", true, "Note: won't actually read from specified file path(s)"),
            "demo_Window_ShowSaveDialog": () => this.genDemoOfDialog(_, "Save", false, "Note: won't actually write to specified file path"),
            "demo_Window_ShowWorkspaceFolderPick": () => [
                _.iVar("opts", { Maybe: { Name: "WorkspaceFolderPickOptions" } }),
                _.iSet(_.n("opts"), _.eNew({ Maybe: { Name: "WorkspaceFolderPickOptions" } })),
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)),
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("PlaceHolder"))), _.eLit("Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side.")),
                _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("ShowWorkspaceFolderPick")), _.n("opts")), _.eFunc([{ Name: "pickedfolder", Type: { Maybe: { Name: "WorkspaceFolder" } } }], null, _.iIf(_.oIsnt(_.n("pickedfolder")), [
                    this.genByeMsg(_, "Cancelled pick input, changed your mind?"),
                ], [
                    this.genInfoMsg(_, _.eLit("Selected `{0}` located at `{1}`, respect!", _.oDot(_.n("pickedfolder"), _.n(this.fld("Name"))), _.oDot(_.n("pickedfolder"), _.n(this.fld("Uri"))))),
                ])))
            ],
            "demo_Env_OpenExternal": () => this.genInput(_, "opts", "uri", [{ k: "Value", v: _.eLit("http://github.com/metaleap/vscode-appz") }, { k: "Prompt", v: _.eLit("Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol.") }], _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Env"))), _.n("OpenExternal")), _.oDeref(_.n("uri"))), _.eFunc([{ Name: "ok", Type: gen_syn_1.TypeRefPrim.Bool }], null, _.iVar("did", gen_syn_1.TypeRefPrim.String), _.iSet(_.n("did"), _.eLit("Did")), _.iIf(_.oNot(_.n("ok")), [
                _.iSet(_.n("did"), _.eOp(" + ", _.n("did"), _.eLit(" not")))
            ]), this.genInfoMsg(_, _.eLit("{0} succeed in opening `{1}`, chapeau!", _.n("did"), _.oDeref(_.n("uri"))))))),
            "demo_Window_ShowQuickPick": () => {
                const items = [
                    ["One", "The first", "Das erste"],
                    ["Two", "The second", "Das zweite"],
                    ["Three", "The third", "Das dritte"],
                    ["Four", "The fourth", "Das vierte"],
                ];
                return [
                    _.iVar("items", { ValsOf: { Name: "QuickPickItem" } }),
                    _.iSet(_.n("items"), _.eCollNew(_.eLit(items.length), { Name: "QuickPickItem" }, true)),
                ].concat(_.EACH(items, (item, idx) => [
                    _.iSet(_.oIdx(_.n("items"), _.eLit(idx)), _.eNew({ Name: "QuickPickItem" })),
                    _.iSet(_.oDot(_.oIdx(_.n("items"), _.eLit(idx)), _.n(this.fld("Label"))), _.eLit(item[0])),
                    _.iSet(_.oDot(_.oIdx(_.n("items"), _.eLit(idx)), _.n(this.fld("Description"))), _.eLit(item[1])),
                    _.iSet(_.oDot(_.oIdx(_.n("items"), _.eLit(idx)), _.n(this.fld("Detail"))), _.eLit(item[2])),
                ])).concat(_.iVar("opts", { Name: "QuickPickOptions" }), _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })), _.iSet(_.oDot(_.n("opts"), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)), _.iSet(_.oDot(_.n("opts"), _.n(this.fld("MatchOnDescription"))), _.eLit(true)), _.iSet(_.oDot(_.n("opts"), _.n(this.fld("MatchOnDetail"))), _.eLit(true)), _.iSet(_.oDot(_.n("opts"), _.n(this.fld("PlaceHolder"))), _.eLit("You have 42 seconds before auto-cancellation!")), _.iSet(_.oDot(_.n("opts"), _.n(this.fld("OnDidSelectItem"))), _.eFunc([{ Name: "item", Type: { Name: "QuickPickItem" } }], gen_syn_1.TypeRefPrim.Any, this.genStatusMsg(_, _.eLit("Just selected: {0}", _.oDot(_.n("item"), _.n(this.fld("Label"))))), _.iRet(_.eZilch()))), _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowQuickPick", 3))), _.n("items"), _.n("opts"), _.eCall(_.n("cancelIn"), _.eLit(42))), _.eFunc([{ Name: "pickeditems", Type: { ValsOf: { Name: "QuickPickItem" } } }], null, _.iIf(_.oIsnt(_.n("pickeditems")), [
                    this.genByeMsg(_, "Cancelled pick input, not one to tick the boxes?"),
                ], [
                    this.genInfoMsg(_, _.eLit("You picked {0} item(s), good stuff!", _.eLen(_.n("pickeditems"), true))),
                ]))));
            },
            "demo_Window_CreateQuickPick": () => [
                _.iVar("cfg", { Name: "QuickPickBag" }),
                _.iSet(_._("cfg"), _.eNew({ Name: "QuickPickBag" })),
                _.iSet(_._("cfg", "IgnoreFocusOut"), _.eLit(true)),
                _.iSet(_._("cfg", "Title"), _.eLit("I'm a full-fledged QuickPick")),
                _.iSet(_._("cfg", "Step"), _.eLit(23)),
                _.iSet(_._("cfg", "TotalSteps"), _.eLit(42)),
                _.iSet(_._("cfg", "Items"), _.eCollNew(_.eLit(88), { Name: "QuickPickItem" }, true)),
                _.iFor(_.n("i"), _.eCall(_._("nums1To"), _.eLit(88)), _.iSet(_.oIdx(_._("cfg", "Items"), _.n("i")), _.eNew({ Name: "QuickPickItem" })), _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Label"), _.eLit("$(eye) Label {0}", _._("i"))), _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Description"), _.eLit("$(gift) Description {0}", _._("i"))), _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Detail"), _.eLit("$(globe~spin) Detail {0}", _._("i"))), _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "AlwaysShow"), _.oEq(_._("i"), _.eLit(42)))),
                _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("CreateQuickPick")), _.oAddr(_._("cfg"))), _.eFunc([{ Name: "ctl", Type: { Name: "QuickPick" }, }, { Name: "_unused", Type: { Name: "QuickPickBag" } }], null, _.eCall(_._("ctl", "OnDidAccept"), _.eFunc([{ Name: "props", Type: { Name: "QuickPickBag" } }], null, _.eCall(_._("logLn"), _.eLit("Picked: {0}", _._("props", "SelectedItems"))), _.eCall(_._("ctl", "Hide")))), _.eCall(_._("ctl", "OnDidHide"), _.eFunc([{ Name: "_", Type: { Name: "QuickPickBag" } }], null, _.eCall(_._("ctl", "Dispose")))), _.eCall(_._("ctl", "Show")))),
            ],
            "demo_Window_CreateInputBox": () => [
                _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("CreateInputBox")), _.eZilch()), _.eFunc([{ Name: "inputbox", Type: { Name: "InputBox" } }, { Name: "props", Type: { Name: "InputBoxBag" } }], null, _.iSet(_.oDot(_.n("props"), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)), _.iSet(_.oDot(_.n("props"), _.n(this.fld("Placeholder"))), _.eLit("The initial Placeholder")), _.iSet(_.oDot(_.n("props"), _.n(this.fld("Prompt"))), _.eLit("The initial Prompt")), _.iSet(_.oDot(_.n("props"), _.n(this.fld("Title"))), _.eLit("The initial Title")), _.eCall(_.oDot(_.n("inputbox"), _.n("Set")), _.n("props")), _.eCall(_.oDot(_.n("inputbox"), _.n("OnDidChangeValue")), _.eFunc([{ Name: "input", Type: gen_syn_1.TypeRefPrim.String }, { Name: "ctl", Type: { Name: "InputBoxBag" } }], null, _.iSet(_.oDot(_.n("ctl"), _.n(this.fld("Prompt"))), _.eLit("Lower: {0}", _.eCall(_.n("strLo"), _.oDot(_.n("ctl"), _.n(this.fld("Value")))))), _.iSet(_.oDot(_.n("ctl"), _.n(this.fld("Title"))), _.eLit("Upper: {0}", _.eCall(_.n("strUp"), _.oDot(_.n("ctl"), _.n(this.fld("Value")))))), _.eCall(_.oDot(_.n("inputbox"), _.n("Set")), _.n("ctl")))), _.iVar("finalinputvalue", { Maybe: gen_syn_1.TypeRefPrim.String }), _.eCall(_.oDot(_.n("inputbox"), _.n("OnDidAccept")), _.eFunc([{ Name: "ctl", Type: { Name: "InputBoxBag" } }], null, _.iSet(_.n("finalinputvalue"), _.oAddr(_.oDot(_.n("ctl"), _.n(this.fld("Value"))))), _.eCall(_.oDot(_.n("inputbox"), _.n("Hide"))))), _.eCall(_.oDot(_.n("inputbox"), _.n("OnDidHide")), _.eFunc([{ Name: "ctl", Type: { Name: "InputBoxBag" } }], null, _.eCall(_.oDot(_.n("inputbox"), _.n("Dispose"))), _.iIf(_.oIs(_.n("finalinputvalue")), [
                    this.genInfoMsg(_, _.eLit("You entered: `{0}`, ponderous!", _.oDeref(_.n("finalinputvalue")))),
                ], [
                    this.genByeMsg(_, "Backing off or backing up?"),
                ]))), _.eCall(_.oDot(_.n("inputbox"), _.n("Show"))))),
            ],
            "subscribeToMiscEvents": () => this.genEventSubs(_, [
                { ns: "Extensions", evtName: "OnDidChange", msg: _.eLit("Some extension(s) were just (un)installed or (de)activated.") },
                { ns: "Window", evtName: "OnDidChangeWindowState", evtArgs: "WindowState", msg: _.eLit("Am I focused? {0}.", _.oDot(_.n("evt"), _.n(this.fld("Focused")))) },
                { ns: "Languages", evtName: "OnDidChangeDiagnostics", evtArgs: "DiagnosticChangeEvent", msg: _.eLit("Diag(s) changed for {0} file path(s).", _.eLen(_.oDot(_.n("evt"), _.n(this.fld("Uris"))), true)) },
            ]),
        };
        const allnames = [];
        for (const name in this.all)
            if (name.startsWith("demo_"))
                allnames.push(name);
        allnames.push(...names);
        this.all["demosMenu"] = () => [
            _.iVar("items", { ValsOf: gen_syn_1.TypeRefPrim.String }),
            _.iSet(_.n("items"), _.eLit(allnames)),
        ].concat(...this.genMenu(_, _.eLit("This menu can be re-opened any time via our custom status-bar item."), _.eFunc([{ Name: "menuitem", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIs(_.n("menuitem")), allnames.map(name => _.iIf(_.oEq(_.eLit(name), _.oDeref(_.n("menuitem"))), [
            _.eCall(_.n("logLn"), _.eLit("Picked `" + name + "` from main menu")),
            _.eCall(_.n(name)),
        ]))))));
        this.all["onUpAndRunning"] = () => ([
            _.iBlock(_.eCall(_.n("subscribeToMiscEvents"))),
            _.iVar("logchan", { Maybe: { Name: "OutputChannel" } }),
            _.iVar("toggleonclick", gen_syn_1.TypeRefPrim.Bool),
            _.iBlock(_.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("CreateOutputChannel")), _.n("appName")), _.eFunc([{ Name: "it", Type: { Name: "OutputChannel" } }, { Name: "_unused", Type: { Name: "OutputChannelBag" } }], null, _.iSet(_.n("logchan"), _.oAddr(_.n("it"))), _.eCall(_.n("setOutChan"), _.n("logchan")), _.eCall(_.n("logLn"), _.eCall(_.n("strFmt"), _.eLit("Hi, I'm `{0}`, this is my own custom `OutputChannel` where I leisurely log all your interactions with me. When I'm ended, it too will disappear."), _.n("appName"))), _.eCall(_.n("logLn"), _.eLit("")), _.eCall(_.n("logLn"), _.eLit("NOTE that for logging error messages, you won't need to manually create a custom `OutputChannel` at all: just have your prog print to its `stderr` as (presumably) usual, and `vscode-appz` will then create a dedicated `OutputChannel` for (both that initial and all subsequent) `stderr` prints from your prog while it's up and running.")), _.eCall(_.n("logLn"), _.eLit("")), _.iIf(_.n("toggleonclick"), [
                _.eCall(_.n("logLn"), _.eLit("Note also that every click on my status-bar item will toggle my visibility.")),
                _.eCall(_.n("logLn"), _.eLit("")),
            ]), _.eCall(_.oDot(_.n("logchan"), _.n("Show")), _.eLit(true))))),
            _.iBlock(_.iVar("statusitem", { Name: "StatusBarItem" }), _.iVar("clickcount", gen_syn_1.TypeRefPrim.Int), _.iSet(_.n("clickcount"), _.eLit(0)), _.iVar("mycmd", { From: [{ ValsOf: gen_syn_1.TypeRefPrim.Any }], To: gen_syn_1.TypeRefPrim.Any }), _.iSet(_.n("mycmd"), _.eFunc([{ Name: "_unused", Type: { ValsOf: gen_syn_1.TypeRefPrim.Any } }], gen_syn_1.TypeRefPrim.Any, _.iSet(_.n("clickcount"), _.eOp("+", _.eLit(1), _.n("clickcount"))), _.eCall(_.eCall(_.oDot(_.n("statusitem"), _.n("Get"))), _.eFunc([{ Name: "props", Type: { Name: "StatusBarItemBag" } }], null, _.iSet(_.oDot(_.n("props"), _.n(this.fld("Text"))), _.eCall(_.n("logLn"), _.eLit("You clicked me {0} time(s).", _.n("clickcount")))), _.iIf(_.oEq(_.eLit("editorLightBulb.foreground"), _.oDot(_.n("props"), _.n(this.fld("Color")))), [
                _.iSet(_.oDot(_.n("props"), _.n(this.fld("Color"))), _.eLit("terminal.ansiGreen")),
                _.iIf(_.oAnd(_.n("toggleonclick"), _.oIs(_.n("logchan"))), [_.eCall(_.oDot(_.n("logchan"), _.n("Hide")))]),
            ], [
                _.iSet(_.oDot(_.n("props"), _.n(this.fld("Color"))), _.eLit("editorLightBulb.foreground")),
                _.iIf(_.oAnd(_.n("toggleonclick"), _.oIs(_.n("logchan"))), [_.eCall(_.oDot(_.n("logchan"), _.n("Show")), _.eLit(true))]),
            ]), _.eCall(_.eCall(_.oDot(_.n("statusitem"), _.n("Set")), _.n("props")), _.n("demosMenu")))), _.iRet(_.eZilch()))), _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Commands"))), _.n("RegisterCommand")), _.n("cmdName"), _.n("mycmd")), _.eFunc([{ Name: "_commandRegisteredAtThisPoint", Type: { Maybe: { Name: "Disposable" } } }], null, _.iVar("cfg", { Name: "StatusBarItemBag" }), _.iSet(_.n("cfg"), _.eNew({ Name: "StatusBarItemBag" })), _.iSet(_.oDot(_.n("cfg"), _.n(this.fld("Tooltip"))), _.eLit("Hi from {0}!", _.n("appName"))), _.iSet(_.oDot(_.n("cfg"), _.n(this.fld("Text"))), _.eLit("You clicked me 0 time(s).")), _.iSet(_.oDot(_.n("cfg"), _.n(this.fld("Color"))), _.eLit("#42BEEF")), _.iSet(_.oDot(_.n("cfg"), _.n(this.fld("Command"))), _.n("cmdName")), _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("CreateStatusBarItem")), _.eLit(0), _.eZilch(), _.oAddr(_.n("cfg"))), _.eFunc([{ Name: "it", Type: { Name: "StatusBarItem" } }, { Name: "_unused", Type: { Name: "StatusBarItemBag" } }], null, _.iSet(_.n("statusitem"), _.n("it")), _.eCall(_.oDot(_.n("statusitem"), _.n("Show")))))))),
        ]);
    }
    genDemos() {
        this.gen.emitIntro();
        for (const name in this.all)
            this.gen.emitFuncImpl({
                Name: name, Type: null, Func: {
                    Args: [], Type: null, Body: { Instrs: this.all[name]() }
                }
            });
        this.gen.emitOutro();
    }
    genEventSubs(_, subs) {
        const ret = [];
        for (const sub of subs)
            ret.push(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n(sub.ns))), _.n(sub.evtName)), _.eFunc(sub.evtArgs ? [{ Name: "evt", Type: { Name: sub.evtArgs } }] : [], null, this.genStatusMsg(_, sub.msg))));
        return ret;
    }
    genDemoOfDialog(_, which, mult, label) {
        const fp = mult ? "filepaths" : "filepath";
        return [
            _.iVar("opts", { Name: which + "DialogOptions" }),
            _.iSet(_.n("opts"), _.eNew({ Name: which + "DialogOptions" })),
            _.iSet(_.oDot(_.n("opts"), _.n(this.fld(which + "Label"))), _.eLit(label)),
            _.iSet(_.oDot(_.n("opts"), _.n(this.fld("Filters"))), { KeyType: gen_syn_1.TypeRefPrim.String, ElemType: { ValsOf: gen_syn_1.TypeRefPrim.String }, Cap: _.eLit(2) }),
            _.iSet(_.oIdx(_.oDot(_.n("opts"), _.n(this.fld("Filters"))), _.eLit("All")), _.eLit(["*"])),
            _.iSet(_.oIdx(_.oDot(_.n("opts"), _.n(this.fld("Filters"))), _.eLit("Dummy Filter")), _.eLit(["dummy", "demo"])),
            _.iBlock(..._.WHEN(mult, () => [
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("CanSelectFiles"))), _.eLit(true)),
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("CanSelectFolders"))), _.eLit(false)),
                _.iSet(_.oDot(_.n("opts"), _.n(this.fld("CanSelectMany"))), _.eLit(true)),
            ])),
            _.eCall(_.n("logLn"), _.eLit(`Showing File-${which} dialog...`)),
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(`Show${which}Dialog`)), _.n("opts")), _.eFunc([{ Name: fp, Type: mult ? { ValsOf: gen_syn_1.TypeRefPrim.String } : { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIsnt(_.n(fp)), [
                this.genByeMsg(_, `Cancelled File-${which} dialog, chicken?`),
            ], [
                this.genInfoMsg(_, _.eLit("Selected " + (mult ? "{0} file path(s)" : "file path `{0}`") + ", excellent!", mult ? (_.eLen(_.n(fp), true)) : _.oDeref(_.n(fp)))),
            ])))
        ];
    }
    genByeMsg(_, msg) {
        return _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowWarningMessage", 1))), _.eCall(_.n("logLn"), _.eLit(msg)), _.eZilch());
    }
    genInfoMsg(_, msg) {
        return _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowInformationMessage", 1))), _.eCall(_.n("logLn"), msg), _.eZilch());
    }
    genInput(_, nameOpts, nameInput, props, ...withInput) {
        return [
            _.iVar(nameOpts, { Maybe: { Name: "InputBoxOptions" } }),
            _.iSet(_.n(nameOpts), _.eNew({ Maybe: { Name: "InputBoxOptions" } })),
            _.iSet(_.oDot(_.n(nameOpts), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)),
        ].concat(..._.EACH(props, (prop) => {
            return _.WHEN(prop.k === "Prompt" || prop.k === "PlaceHolder", () => [
                _.eCall(_.n("logLn"), _.eLit(nameInput + "/" + nameOpts + "/{0}:\t{1}", _.eLit(prop.k), prop.v)),
            ]).concat([
                _.iSet(_.oDot(_.n(nameOpts), _.n(this.fld(prop.k))), prop.v)
            ]);
        })).concat(_.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("ShowInputBox")), _.n(nameOpts), _.eZilch()), _.eFunc([{ Name: nameInput, Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIsnt(_.n(nameInput)), [
            this.genByeMsg(_, "Cancelled text input, out of ideas?"),
        ], [
            _.eCall(_.n("logLn"), _.eLit(nameInput + " <- {0}", _.oDeref(_.n(nameInput)))),
        ].concat(withInput)))));
    }
    genStatusMsg(_, msg) {
        return _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("SetStatusBarMessage", 1))), _.eCall(_.n("logLn"), msg), _.eLit(4242));
    }
    genDemoOfPropsMenu(_, ns) {
        const struct = this.gen.allStructs[ns + "Bag"];
        return [
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n(ns))), _.n("AllProperties"))), _.eFunc([{ Name: "props", Type: { Name: struct.Name } }], null, _.iVar("items", { ValsOf: gen_syn_1.TypeRefPrim.String }), _.iSet(_.n("items"), _.eCollNew(_.eLit(struct.Fields.length), gen_syn_1.TypeRefPrim.String, true)), _.iBlock(..._.EACH(struct.Fields, (f, i) => [
                _.iSet(_.oIdx(_.n("items"), _.eLit(i)), _.eLit(f.Name + "\t".repeat(f.Name.length < 8 ? 3 : f.Name.length >= 16 ? 1 : 2) + "{0}", _.oDot(_.n("props"), _.n(f.Name)))),
            ]).concat(...this.genMenu(_, _.eOp("+", _.eCall(_.n("logLn"), _.eLit(ns + " has {0} properties", _.eLen(_.n("items"), true))), _.eLit(":"))))))),
        ];
    }
    genDemoOfStrListMenu(_, ns, fn, desc, args, onPick) {
        return [
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n(ns))), _.n(fn)), ...args), _.eFunc([{ Name: "items", Type: { ValsOf: gen_syn_1.TypeRefPrim.String } }], null, ...this.genMenu(_, _.eLit("Retrieved {0} " + desc, _.eLen(_.n("items"), true)), onPick)))
        ];
    }
    genMenu(_, msg, onPick) {
        return [
            _.iVar("opts", { Name: "QuickPickOptions" }),
            _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })),
            _.iSet(_.oDot(_.n("opts"), _.n(this.fld("IgnoreFocusOut"))), _.eLit(true)),
            _.iSet(_.oDot(_.n("opts"), _.n(this.fld("PlaceHolder"))), msg),
            _.eCall(_.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n(this.fn("ShowQuickPick", 2))), _.n("items"), _.oAddr(_.n("opts")), _.eZilch()), onPick ? onPick : _.eFunc([{ Name: "menuitem", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIs(_.n("menuitem")), [_.eCall(_.n("logLn"), _.oDeref(_.n("menuitem")))])))
        ];
    }
    fn(name, overload) {
        return name + overload;
    }
    fld(name) {
        return this.gen.nameRewriters.fields(name);
    }
}
exports.GenDemos = GenDemos;
