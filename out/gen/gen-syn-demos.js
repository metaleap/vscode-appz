"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_syn_1 = require("./gen-syn");
class GenDemos {
    constructor(gen, b, ...names) {
        const _ = b;
        this.gen = gen;
        this.all = {
            "demo_promptToExit": () => [
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowWarningMessage", 1)), _.eLit("Are you sure you want `{0}` to exit?", _._("appName")), _.eLit(["Sure I'm sure"])), _.eFunc([{ Name: "btn", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIs(_._("btn")), [
                    this.genInfoMsg(_, _.eLit("So fish and long for all the thanks!")),
                    _.eCall(_._("quit"), _.eZilch()),
                ], [
                    this.genInfoMsg(_, _.eLit("So I'm not a goner yet. I'll stick around then.")),
                ])))
            ],
            "demo_clipboard": () => [
                _.eCall(_.eCall(_._(_.eCall(_._(_.eProp(_._("vsc", "Env")), "Clipboard")), "ReadText")), _.eFunc([{ Name: "text", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIsnt(_._("text")), [
                    this.genByeMsg(_, "No text in clipboard"),
                ], this.genInput(_, "opts", "input", [{ k: "Value", v: _.oDeref(_._("text")) }, { k: "Prompt", v: _.eLit("Enter new contents to write to your clipboard.") }], _.eCall(_.eCall(_._(_.eCall(_._(_.eProp(_._("vsc", "Env")), "Clipboard")), "WriteText"), _.oDeref(_._("input"))), _.eFunc([], null, this.genInfoMsg(_, _.eLit("Okay. Now double-check by pasting somewhere.")))))))),
            ],
            "demo_Commands_GetCommands_and_ExecuteCommand": () => this.genDemoOfStrListMenu(_, "Commands", "GetCommands", "command ID(s), pick one to execute or escape now:", [_.eLit(false)], _.eFunc([{ Name: "item", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIsnt(_._("item")), [
                this.genByeMsg(_, "Command selection cancelled, spooked?"),
            ], this.genInput(_, "opts2", "cmdarg", [{ k: "PlaceHolder", v: _.eLit("Any param for `{0}` command? Else leave blank.", _.oDeref(_._("item"))) }], _.iVar("cmdargs", { ValsOf: gen_syn_1.TypeRefPrim.Any }), _.iIf(_.oNeq(_.eLit(""), _.oDeref(_._("cmdarg"))), [
                _.iSet(_._("cmdargs"), _.eCollNew(_.eLit(1), gen_syn_1.TypeRefPrim.Any, true)),
                _.iSet(_.oIdx(_._("cmdargs"), _.eLit(0)), _.oDeref(_._("cmdarg"))),
            ]), _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Commands")), "ExecuteCommand"), _.oDeref(_._("item")), _._("cmdargs")), _.eFunc([{ Name: "ret", Type: gen_syn_1.TypeRefPrim.Any }], null, this.genInfoMsg(_, _.eLit("Command result was: `{0}`, kudos!", _._("ret"))))))))),
            "demo_Commands_RegisterCommand": () => this.genInput(_, "opts", "cmdname", [{ k: "Value", v: _.eLit("foo.bar.baz") }, { k: "Prompt", v: _.eLit("Enter your command name. The command will accept a single text input and return a result built from it.") }], _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Commands")), "RegisterCommand"), _.oDeref(_._("cmdname")), _.eFunc([{ Name: "cmdargs", Type: { ValsOf: gen_syn_1.TypeRefPrim.Any } }], gen_syn_1.TypeRefPrim.Any, this.genStatusMsg(_, _.eLit("Command `{0}` invoked with: `{1}`", _.oDeref(_._("cmdname")), _.oIdx(_._("cmdargs"), _.eLit(0)))), _.iRet(_.eLit("Input to command `{0}` was: `{1}`", _.oDeref(_._("cmdname")), _.oIdx(_._("cmdargs"), _.eLit(0)))))), _.eFunc([{ Name: "useToUnregister", Type: { Maybe: { Name: "Disposable" } } }], null, ...this.genInput(_, "opts2", "cmdarg", [{ k: "Prompt", v: _.eLit("Command `{0}` registered, try it now?", _.oDeref(_._("cmdname"))) }, { k: "Value", v: _.eLit("Enter input to command `{0}` here", _.oDeref(_._("cmdname"))) }], _.iVar("cmdargs2", { ValsOf: gen_syn_1.TypeRefPrim.Any }), _.iSet(_._("cmdargs2"), _.eCollNew(_.eLit(1), gen_syn_1.TypeRefPrim.Any, true)), _.iSet(_.oIdx(_._("cmdargs2"), _.eLit(0)), _.oDeref(_._("cmdarg"))), _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Commands")), "ExecuteCommand"), _.oDeref(_._("cmdname")), _._("cmdargs2")), _.eFunc([{ Name: "ret", Type: gen_syn_1.TypeRefPrim.Any }], null, this.genInfoMsg(_, _.eLit("Command result: `{0}`, mad props!", _._("ret"))))))))),
            "demo_Languages_GetLanguages": () => this.genDemoOfStrListMenu(_, "Languages", "GetLanguages", "language ID(s)", []),
            "demo_Env_Properties": () => this.genDemoOfPropsMenu(_, "Env"),
            "demo_Workspace_Properties": () => this.genDemoOfPropsMenu(_, "Workspace"),
            "demo_Window_ShowOpenDialog": () => this.genDemoOfDialog(_, "Open", true, "Note: won't actually read from specified file path(s)"),
            "demo_Window_ShowSaveDialog": () => this.genDemoOfDialog(_, "Save", false, "Note: won't actually write to specified file path"),
            "demo_Window_ShowWorkspaceFolderPick": () => [
                _.iVar("opts", { Maybe: { Name: "WorkspaceFolderPickOptions" } }),
                _.iSet(_._("opts"), _.eNew({ Maybe: { Name: "WorkspaceFolderPickOptions" } })),
                _.iSet(_._("opts", this.fld("IgnoreFocusOut")), _.eLit(true)),
                _.iSet(_._("opts", this.fld("PlaceHolder")), _.eLit("Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side.")),
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "ShowWorkspaceFolderPick"), _._("opts")), _.eFunc([{ Name: "pickedfolder", Type: { Maybe: { Name: "WorkspaceFolder" } } }], null, _.iIf(_.oIsnt(_._("pickedfolder")), [
                    this.genByeMsg(_, "Cancelled pick input, changed your mind?"),
                ], [
                    this.genInfoMsg(_, _.eLit("Selected `{0}` located at `{1}`, respect!", _._("pickedfolder", this.fld("Name")), _._("pickedfolder", this.fld("Uri")))),
                ])))
            ],
            "demo_Env_OpenExternal": () => this.genInput(_, "opts", "uri", [{ k: "Value", v: _.eLit("http://github.com/metaleap/vscode-appz") }, { k: "Prompt", v: _.eLit("Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol.") }], _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Env")), "OpenExternal"), _.oDeref(_._("uri"))), _.eFunc([{ Name: "ok", Type: gen_syn_1.TypeRefPrim.Bool }], null, _.iVar("did", gen_syn_1.TypeRefPrim.String), _.iSet(_._("did"), _.eLit("Did")), _.iIf(_.oNot(_._("ok")), [
                _.iSet(_._("did"), _.eOp(" + ", _._("did"), _.eLit(" not")))
            ]), this.genInfoMsg(_, _.eLit("{0} succeed in opening `{1}`, chapeau!", _._("did"), _.oDeref(_._("uri"))))))),
            "demo_Window_ShowQuickPick": () => {
                const items = [
                    ["One", "The first", "Das erste"],
                    ["Two", "The second", "Das zweite"],
                    ["Three", "The third", "Das dritte"],
                    ["Four", "The fourth", "Das vierte"],
                ];
                return [
                    _.iVar("items", { ValsOf: { Name: "QuickPickItem" } }),
                    _.iSet(_._("items"), _.eCollNew(_.eLit(items.length), { Name: "QuickPickItem" }, true)),
                ].concat(_.EACH(items, (item, idx) => [
                    _.iSet(_.oIdx(_._("items"), _.eLit(idx)), _.eNew({ Name: "QuickPickItem" })),
                    _.iSet(_._(_.oIdx(_._("items"), _.eLit(idx)), this.fld("Label")), _.eLit(item[0])),
                    _.iSet(_._(_.oIdx(_._("items"), _.eLit(idx)), this.fld("Description")), _.eLit(item[1])),
                    _.iSet(_._(_.oIdx(_._("items"), _.eLit(idx)), this.fld("Detail")), _.eLit(item[2])),
                ])).concat(_.iVar("opts", { Name: "QuickPickOptions" }), _.iSet(_._("opts"), _.eNew({ Name: "QuickPickOptions" })), _.iSet(_._("opts", this.fld("IgnoreFocusOut")), _.eLit(true)), _.iSet(_._("opts", this.fld("MatchOnDescription")), _.eLit(true)), _.iSet(_._("opts", this.fld("MatchOnDetail")), _.eLit(true)), _.iSet(_._("opts", this.fld("PlaceHolder")), _.eLit("You have 42 seconds before auto-cancellation!")), _.iSet(_._("opts", this.fld("OnDidSelectItem")), _.eFunc([{ Name: "item", Type: { Name: "QuickPickItem" } }], gen_syn_1.TypeRefPrim.Any, this.genStatusMsg(_, _.eLit("Just selected: {0}", _._("item", this.fld("Label")))), _.iRet(_.eZilch()))), _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowQuickPick", 3)), _._("items"), _._("opts"), _.eCall(_._("cancelIn"), _.eLit(42))), _.eFunc([{ Name: "pickeditems", Type: { ValsOf: { Name: "QuickPickItem" } } }], null, _.iIf(_.oIsnt(_._("pickeditems")), [
                    this.genByeMsg(_, "Cancelled pick input, not one to tick the boxes?"),
                ], [
                    this.genInfoMsg(_, _.eLit("You picked {0} item(s), good stuff!", _.eLen(_._("pickeditems"), true))),
                ]))));
            },
            "demo_Window_CreateQuickPick": () => [
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "CreateQuickPick")), _.eFunc([{ Name: "ctl", Type: { Name: "QuickPick" }, }, { Name: "cfg", Type: { Name: "QuickPickBag" } }], null, _.iSet(_._("cfg", "IgnoreFocusOut"), _.eLit(true)), _.iSet(_._("cfg", "Title"), _.eLit("I'm a full-fledged QuickPick")), _.iSet(_._("cfg", "Step"), _.eLit(23)), _.iSet(_._("cfg", "TotalSteps"), _.eLit(42)), _.iSet(_._("cfg", "Items"), _.eCollNew(_.eLit(88), { Name: "QuickPickItem" }, true)), _.iFor(_.eName("i"), _.eCall(_._("nums1To"), _.eLit(88)), _.iSet(_.oIdx(_._("cfg", "Items"), _._("i")), _.eNew({ Name: "QuickPickItem" })), _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Label"), _.eLit("$(eye) Label {0}", _._("i"))), _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Description"), _.eLit("$(gift) Description {0}", _._("i"))), _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "Detail"), _.eLit("$(globe~spin) Detail {0}", _._("i"))), _.iSet(_._(_.oIdx(_._("cfg", "Items"), _.eOp("-", _._("i"), _.eLit(1))), "AlwaysShow"), _.oEq(_._("i"), _.eLit(42)))), _.eCall(_._("ctl", "Set"), _._("cfg")), _.eCall(_._("ctl", "OnDidAccept"), _.eFunc([{ Name: "bag", Type: { Name: "QuickPickBag" } }], null, _.eCall(_._("logLn"), _.eLit("Picked: {0}", _._("bag", "SelectedItems"))), _.eCall(_._("ctl", "Hide")))), _.eCall(_._("ctl", "OnDidHide"), _.eFunc([{ Name: "_", Type: { Name: "QuickPickBag" } }], null, _.eCall(_._("ctl", "Dispose")))), _.eCall(_._("ctl", "Show")))),
            ],
            "demo_Window_CreateInputBox": () => [
                _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "CreateInputBox")), _.eFunc([{ Name: "ctl", Type: { Name: "InputBox" } }, { Name: "cfg", Type: { Name: "InputBoxBag" } }], null, _.iSet(_._("cfg", this.fld("IgnoreFocusOut")), _.eLit(true)), _.iSet(_._("cfg", this.fld("Placeholder")), _.eLit("The initial Placeholder")), _.iSet(_._("cfg", this.fld("Prompt")), _.eLit("The initial Prompt")), _.iSet(_._("cfg", this.fld("Title")), _.eLit("The initial Title")), _.eCall(_._("ctl", "Set"), _._("cfg")), _.eCall(_._("ctl", "OnDidChangeValue"), _.eFunc([{ Name: "input", Type: gen_syn_1.TypeRefPrim.String }, { Name: "bag", Type: { Name: "InputBoxBag" } }], null, _.iSet(_._("bag", this.fld("Prompt")), _.eLit("Lower: {0}", _.eCall(_._("strLo"), _._("bag", this.fld("Value"))))), _.iSet(_._("bag", this.fld("Title")), _.eLit("Upper: {0}", _.eCall(_._("strUp"), _._("bag", this.fld("Value"))))), _.eCall(_._("ctl", "Set"), _._("bag")))), _.iVar("finalinputvalue", { Maybe: gen_syn_1.TypeRefPrim.String }), _.eCall(_._("ctl", "OnDidAccept"), _.eFunc([{ Name: "bag", Type: { Name: "InputBoxBag" } }], null, _.iSet(_._("finalinputvalue"), _.oAddr(_._("bag", this.fld("Value")))), _.eCall(_._("ctl", "Hide")))), _.eCall(_._("ctl", "OnDidHide"), _.eFunc([{ Name: "bag", Type: { Name: "InputBoxBag" } }], null, _.eCall(_._("ctl", "Dispose")), _.iIf(_.oIs(_._("finalinputvalue")), [
                    this.genInfoMsg(_, _.eLit("You entered: `{0}`, ponderous!", _.oDeref(_._("finalinputvalue")))),
                ], [
                    this.genByeMsg(_, "Backing off or backing up?"),
                ]))), _.eCall(_._("ctl", "Show")))),
            ],
            "subscribeToMiscEvents": () => this.genEventSubs(_, [
                { ns: "Extensions", evtName: "OnDidChange", msg: _.eLit("Some extension(s) were just (un)installed or (de)activated.") },
                { ns: "Window", evtName: "OnDidChangeWindowState", evtArgs: "WindowState", msg: _.eLit("Am I focused? {0}.", _._("evt", this.fld("Focused"))) },
                { ns: "Languages", evtName: "OnDidChangeDiagnostics", evtArgs: "DiagnosticChangeEvent", msg: _.eLit("Diag(s) changed for {0} file path(s).", _.eLen(_._("evt", this.fld("Uris")), true)) },
            ]),
        };
        const allnames = [];
        for (const name in this.all)
            if (name.startsWith("demo_"))
                allnames.push(name);
        allnames.push(...names);
        this.all["demosMenu"] = () => [
            _.iVar("items", { ValsOf: gen_syn_1.TypeRefPrim.String }),
            _.iSet(_._("items"), _.eLit(allnames)),
        ].concat(...this.genMenu(_, _.eLit("This menu can be re-opened any time via our custom status-bar item."), _.eFunc([{ Name: "menuitem", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIs(_._("menuitem")), allnames.map(name => _.iIf(_.oEq(_.eLit(name), _.oDeref(_._("menuitem"))), [
            _.eCall(_._("logLn"), _.eLit("Picked `" + name + "` from main menu")),
            _.eCall(_._(name)),
        ]))))));
        this.all["onUpAndRunning"] = () => ([
            _.iBlock(_.eCall(_._("subscribeToMiscEvents"))),
            _.iVar("logchan", { Maybe: { Name: "OutputChannel" } }),
            _.iVar("toggleonclick", gen_syn_1.TypeRefPrim.Bool),
            _.iBlock(_.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "CreateOutputChannel"), _._("appName")), _.eFunc([{ Name: "it", Type: { Name: "OutputChannel" } }, { Name: "_unused", Type: { Name: "OutputChannelBag" } }], null, _.iSet(_._("logchan"), _.oAddr(_._("it"))), _.eCall(_._("setOutChan"), _._("logchan")), _.eCall(_._("logLn"), _.eCall(_._("strFmt"), _.eLit("Hi, I'm `{0}`, this is my own custom `OutputChannel` where I leisurely log all your interactions with me. When I'm ended, it too will disappear."), _._("appName"))), _.eCall(_._("logLn"), _.eLit("")), _.eCall(_._("logLn"), _.eLit("NOTE that for logging error messages, you won't need to manually create a custom `OutputChannel` at all: just have your prog print to its `stderr` as (presumably) usual, and `vscode-appz` will then create a dedicated `OutputChannel` for (both that initial and all subsequent) `stderr` prints from your prog while it's up and running.")), _.eCall(_._("logLn"), _.eLit("")), _.iIf(_._("toggleonclick"), [
                _.eCall(_._("logLn"), _.eLit("Note also that every click on my status-bar item will toggle my visibility.")),
                _.eCall(_._("logLn"), _.eLit("")),
            ]), _.eCall(_._("logchan", "Show"), _.eLit(true))))),
            _.iBlock(_.iVar("statusitem", { Name: "StatusBarItem" }), _.iVar("clickcount", gen_syn_1.TypeRefPrim.Int), _.iSet(_._("clickcount"), _.eLit(0)), _.iVar("mycmd", { From: [{ ValsOf: gen_syn_1.TypeRefPrim.Any }], To: gen_syn_1.TypeRefPrim.Any }), _.iSet(_._("mycmd"), _.eFunc([{ Name: "_unused", Type: { ValsOf: gen_syn_1.TypeRefPrim.Any } }], gen_syn_1.TypeRefPrim.Any, _.iSet(_._("clickcount"), _.eOp("+", _.eLit(1), _._("clickcount"))), _.eCall(_.eCall(_._("statusitem", "Get")), _.eFunc([{ Name: "props", Type: { Name: "StatusBarItemBag" } }], null, _.iSet(_._("props", this.fld("Text")), _.eCall(_._("logLn"), _.eLit("You clicked me {0} time(s).", _._("clickcount")))), _.iIf(_.oEq(_.eLit("editorLightBulb.foreground"), _._("props", this.fld("Color"))), [
                _.iSet(_._("props", this.fld("Color")), _.eLit("terminal.ansiGreen")),
                _.iIf(_.oAnd(_._("toggleonclick"), _.oIs(_._("logchan"))), [_.eCall(_._("logchan", "Hide"))]),
            ], [
                _.iSet(_._("props", this.fld("Color")), _.eLit("editorLightBulb.foreground")),
                _.iIf(_.oAnd(_._("toggleonclick"), _.oIs(_._("logchan"))), [_.eCall(_._("logchan", "Show"), _.eLit(true))]),
            ]), _.eCall(_.eCall(_._("statusitem", "Set"), _._("props")), _._("demosMenu")))), _.iRet(_.eZilch()))), _.eCall(_._(_.eProp(_._("vsc", "Commands")), "RegisterCommand"), _._("cmdName"), _._("mycmd")), _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "CreateStatusBarItem"), _.eLit(0), _.eZilch()), _.eFunc([{ Name: "it", Type: { Name: "StatusBarItem" } }, { Name: "cfg", Type: { Name: "StatusBarItemBag" } }], null, _.iSet(_._("statusitem"), _._("it")), _.iSet(_._("cfg", this.fld("Tooltip")), _.eLit("Hi from {0}!", _._("appName"))), _.iSet(_._("cfg", this.fld("Text")), _.eLit("You clicked me 0 time(s).")), _.iSet(_._("cfg", this.fld("Color")), _.eLit("#42BEEF")), _.iSet(_._("cfg", this.fld("Command")), _._("cmdName")), _.eCall(_._("statusitem", "Set"), _._("cfg")), _.eCall(_._("statusitem", "Show"))))),
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
            ret.push(_.eCall(_._(_.eProp(_._("vsc", sub.ns)), sub.evtName), _.eFunc(sub.evtArgs ? [{ Name: "evt", Type: { Name: sub.evtArgs } }] : [], null, this.genStatusMsg(_, sub.msg))));
        return ret;
    }
    genDemoOfDialog(_, which, mult, label) {
        const fp = mult ? "filepaths" : "filepath";
        return [
            _.iVar("opts", { Name: which + "DialogOptions" }),
            _.iSet(_._("opts"), _.eNew({ Name: which + "DialogOptions" })),
            _.iSet(_._("opts", this.fld(which + "Label")), _.eLit(label)),
            _.iSet(_._("opts", this.fld("Filters")), { KeyType: gen_syn_1.TypeRefPrim.String, ElemType: { ValsOf: gen_syn_1.TypeRefPrim.String }, Cap: _.eLit(2) }),
            _.iSet(_.oIdx(_._("opts", this.fld("Filters")), _.eLit("All")), _.eLit(["*"])),
            _.iSet(_.oIdx(_._("opts", this.fld("Filters")), _.eLit("Dummy Filter")), _.eLit(["dummy", "demo"])),
            _.iBlock(..._.WHEN(mult, () => [
                _.iSet(_._("opts", this.fld("CanSelectFiles")), _.eLit(true)),
                _.iSet(_._("opts", this.fld("CanSelectFolders")), _.eLit(false)),
                _.iSet(_._("opts", this.fld("CanSelectMany")), _.eLit(true)),
            ])),
            _.eCall(_._("logLn"), _.eLit(`Showing File-${which} dialog...`)),
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), `Show${which}Dialog`), _._("opts")), _.eFunc([{ Name: fp, Type: mult ? { ValsOf: gen_syn_1.TypeRefPrim.String } : { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIsnt(_._(fp)), [
                this.genByeMsg(_, `Cancelled File-${which} dialog, chicken?`),
            ], [
                this.genInfoMsg(_, _.eLit("Selected " + (mult ? "{0} file path(s)" : "file path `{0}`") + ", excellent!", mult ? (_.eLen(_._(fp), true)) : _.oDeref(_._(fp)))),
            ])))
        ];
    }
    genByeMsg(_, msg) {
        return _.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowWarningMessage", 1)), _.eCall(_._("logLn"), _.eLit(msg)), _.eZilch());
    }
    genInfoMsg(_, msg) {
        return _.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowInformationMessage", 1)), _.eCall(_._("logLn"), msg), _.eZilch());
    }
    genInput(_, nameOpts, nameInput, props, ...withInput) {
        return [
            _.iVar(nameOpts, { Maybe: { Name: "InputBoxOptions" } }),
            _.iSet(_._(nameOpts), _.eNew({ Maybe: { Name: "InputBoxOptions" } })),
            _.iSet(_._(nameOpts, this.fld("IgnoreFocusOut")), _.eLit(true)),
        ].concat(..._.EACH(props, (prop) => {
            return _.WHEN(prop.k === "Prompt" || prop.k === "PlaceHolder", () => [
                _.eCall(_._("logLn"), _.eLit(nameInput + "/" + nameOpts + "/{0}:\t{1}", _.eLit(prop.k), prop.v)),
            ]).concat([
                _.iSet(_._(nameOpts, this.fld(prop.k)), prop.v)
            ]);
        })).concat(_.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), "ShowInputBox"), _._(nameOpts), _.eZilch()), _.eFunc([{ Name: nameInput, Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIsnt(_._(nameInput)), [
            this.genByeMsg(_, "Cancelled text input, out of ideas?"),
        ], [
            _.eCall(_._("logLn"), _.eLit(nameInput + " <- {0}", _.oDeref(_._(nameInput)))),
        ].concat(withInput)))));
    }
    genStatusMsg(_, msg) {
        return _.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("SetStatusBarMessage", 1)), _.eCall(_._("logLn"), msg), _.eLit(4242));
    }
    genDemoOfPropsMenu(_, ns) {
        const struct = this.gen.allStructs[ns + "Bag"];
        return [
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", ns)), "AllProperties")), _.eFunc([{ Name: "props", Type: { Name: struct.Name } }], null, _.iVar("items", { ValsOf: gen_syn_1.TypeRefPrim.String }), _.iSet(_._("items"), _.eCollNew(_.eLit(struct.Fields.length), gen_syn_1.TypeRefPrim.String, true)), _.iBlock(..._.EACH(struct.Fields, (f, i) => [
                _.iSet(_.oIdx(_._("items"), _.eLit(i)), _.eLit(f.Name + "\t".repeat(f.Name.length < 8 ? 3 : f.Name.length >= 16 ? 1 : 2) + "{0}", _._("props", f.Name))),
            ]).concat(...this.genMenu(_, _.eOp("+", _.eCall(_._("logLn"), _.eLit(ns + " has {0} properties", _.eLen(_._("items"), true))), _.eLit(":"))))))),
        ];
    }
    genDemoOfStrListMenu(_, ns, fn, desc, args, onPick) {
        return [
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", ns)), fn), ...args), _.eFunc([{ Name: "items", Type: { ValsOf: gen_syn_1.TypeRefPrim.String } }], null, ...this.genMenu(_, _.eLit("Retrieved {0} " + desc, _.eLen(_._("items"), true)), onPick)))
        ];
    }
    genMenu(_, msg, onPick) {
        return [
            _.iVar("opts", { Name: "QuickPickOptions" }),
            _.iSet(_._("opts"), _.eNew({ Name: "QuickPickOptions" })),
            _.iSet(_._("opts", this.fld("IgnoreFocusOut")), _.eLit(true)),
            _.iSet(_._("opts", this.fld("PlaceHolder")), msg),
            _.eCall(_.eCall(_._(_.eProp(_._("vsc", "Window")), this.fn("ShowQuickPick", 2)), _._("items"), _.oAddr(_._("opts")), _.eZilch()), onPick ? onPick : _.eFunc([{ Name: "menuitem", Type: { Maybe: gen_syn_1.TypeRefPrim.String } }], null, _.iIf(_.oIs(_._("menuitem")), [_.eCall(_._("logLn"), _.oDeref(_._("menuitem")))])))
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
