const main = require('./main')
Object.defineProperty(exports, "__esModule", { value: true })
// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-nodejs.ts via github.com/metaleap/vscode-appz/src/gen/main.ts
let vsc, appName, cmdName, strFmt, quit, cancelIn, demo_Window_ShowInputBox, setOutChan, logLn, strLo, strUp, nums1To
exports.onUpAndRunning = () => { /* crikey!.. */ vsc = main.vsc; appName = main.appName; cmdName = main.cmdName; strFmt = main.strFmt; quit = main.quit; cancelIn = main.cancelIn; demo_Window_ShowInputBox = main.demo_Window_ShowInputBox; setOutChan = main.setOutChan; logLn = main.logLn; strLo = main.strLo; strUp = main.strUp; nums1To = main.nums1To; onUpAndRunning() }
exports.demosMenu = demosMenu

function demo_promptToExit() {
    vsc.Window.ShowWarningMessage1(strFmt("Are you sure you want `{0}` to exit?", appName), ["Sure I'm sure"])((btn) => {
        if ((undefined !== btn && null !== btn)) {
            vsc.Window.ShowInformationMessage1(logLn("So fish and long for all the thanks!"), null)
            quit(null)
        } else {
            vsc.Window.ShowInformationMessage1(logLn("So I'm not a goner yet. I'll stick around then."), null)
        }
    })
}

function demo_clipboard() {
    vsc.Env.Clipboard().ReadText()((text) => {
        if ((undefined === text || null === text)) {
            vsc.Window.ShowWarningMessage1(logLn("No text in clipboard"), null)
        } else {
            let opts
            opts = {}
            opts.ignoreFocusOut = true
            opts.value = text
            logLn(strFmt("input/opts/{0}:\t{1}", "Prompt", "Enter new contents to write to your clipboard."))
            opts.prompt = "Enter new contents to write to your clipboard."
            vsc.Window.ShowInputBox(opts, null)((input) => {
                if ((undefined === input || null === input)) {
                    vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null)
                } else {
                    logLn(strFmt("input <- {0}", input))
                    vsc.Env.Clipboard().WriteText(input)(() => {
                        vsc.Window.ShowInformationMessage1(logLn("Okay. Now double-check by pasting somewhere."), null)
                    })
                }
            })
        }
    })
}

function demo_Commands_GetCommands_and_ExecuteCommand() {
    vsc.Commands.GetCommands(false)((items) => {
        let opts
        opts = {}
        opts.ignoreFocusOut = true
        opts.placeHolder = strFmt("Retrieved {0} command ID(s), pick one to execute or escape now:", items.length)
        vsc.Window.ShowQuickPick2(items, opts, null)((item) => {
            if ((undefined === item || null === item)) {
                vsc.Window.ShowWarningMessage1(logLn("Command selection cancelled, spooked?"), null)
            } else {
                let opts2
                opts2 = {}
                opts2.ignoreFocusOut = true
                logLn(strFmt("cmdarg/opts2/{0}:\t{1}", "PlaceHolder", strFmt("Any param for `{0}` command? Else leave blank.", item)))
                opts2.placeHolder = strFmt("Any param for `{0}` command? Else leave blank.", item)
                vsc.Window.ShowInputBox(opts2, null)((cmdarg) => {
                    if ((undefined === cmdarg || null === cmdarg)) {
                        vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null)
                    } else {
                        logLn(strFmt("cmdarg <- {0}", cmdarg))
                        let cmdargs
                        if ("" !== cmdarg) {
                            cmdargs = new Array(1)
                            cmdargs[0] = cmdarg
                        }
                        vsc.Commands.ExecuteCommand(item, cmdargs)((ret) => {
                            vsc.Window.ShowInformationMessage1(logLn(strFmt("Command result was: `{0}`, kudos!", ret)), null)
                        })
                    }
                })
            }
        })
    })
}

function demo_Commands_RegisterCommand() {
    let opts
    opts = {}
    opts.ignoreFocusOut = true
    opts.value = "foo.bar.baz"
    logLn(strFmt("cmdname/opts/{0}:\t{1}", "Prompt", "Enter your command name. The command will accept a single text input and return a result built from it."))
    opts.prompt = "Enter your command name. The command will accept a single text input and return a result built from it."
    vsc.Window.ShowInputBox(opts, null)((cmdname) => {
        if ((undefined === cmdname || null === cmdname)) {
            vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null)
        } else {
            logLn(strFmt("cmdname <- {0}", cmdname))
            vsc.Commands.RegisterCommand(cmdname, (cmdargs) => {
                vsc.Window.SetStatusBarMessage1(logLn(strFmt("Command `{0}` invoked with: `{1}`", cmdname, cmdargs[0])), 4242)
                return strFmt("Input to command `{0}` was: `{1}`", cmdname, cmdargs[0])
            })((useToUnregister) => {
                let opts2
                opts2 = {}
                opts2.ignoreFocusOut = true
                logLn(strFmt("cmdarg/opts2/{0}:\t{1}", "Prompt", strFmt("Command `{0}` registered, try it now?", cmdname)))
                opts2.prompt = strFmt("Command `{0}` registered, try it now?", cmdname)
                opts2.value = strFmt("Enter input to command `{0}` here", cmdname)
                vsc.Window.ShowInputBox(opts2, null)((cmdarg) => {
                    if ((undefined === cmdarg || null === cmdarg)) {
                        vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null)
                    } else {
                        logLn(strFmt("cmdarg <- {0}", cmdarg))
                        let cmdargs2
                        cmdargs2 = new Array(1)
                        cmdargs2[0] = cmdarg
                        vsc.Commands.ExecuteCommand(cmdname, cmdargs2)((ret) => {
                            vsc.Window.ShowInformationMessage1(logLn(strFmt("Command result: `{0}`, mad props!", ret)), null)
                        })
                    }
                })
            })
        }
    })
}

function demo_Languages_GetLanguages() {
    vsc.Languages.GetLanguages()((items) => {
        let opts
        opts = {}
        opts.ignoreFocusOut = true
        opts.placeHolder = strFmt("Retrieved {0} language ID(s)", items.length)
        vsc.Window.ShowQuickPick2(items, opts, null)((menuitem) => {
            if ((undefined !== menuitem && null !== menuitem)) {
                logLn(menuitem)
            }
        })
    })
}

function demo_Env_Properties() {
    vsc.Env.AllProperties()((props) => {
        let items
        items = new Array(8)
        {
            items[0] = strFmt("appName\t\t\t{0}", props.appName)
            items[1] = strFmt("appRoot\t\t\t{0}", props.appRoot)
            items[2] = strFmt("language\t\t{0}", props.language)
            items[3] = strFmt("machineId\t\t{0}", props.machineId)
            items[4] = strFmt("remoteName\t\t{0}", props.remoteName)
            items[5] = strFmt("sessionId\t\t{0}", props.sessionId)
            items[6] = strFmt("shell\t\t\t{0}", props.shell)
            items[7] = strFmt("uriScheme\t\t{0}", props.uriScheme)
            let opts
            opts = {}
            opts.ignoreFocusOut = true
            opts.placeHolder = logLn(strFmt("Env has {0} properties", items.length)) + ":"
            vsc.Window.ShowQuickPick2(items, opts, null)((menuitem) => {
                if ((undefined !== menuitem && null !== menuitem)) {
                    logLn(menuitem)
                }
            })
        }
    })
}

function demo_Workspace_Properties() {
    vsc.Workspace.AllProperties()((props) => {
        let items
        items = new Array(3)
        {
            items[0] = strFmt("name\t\t\t{0}", props.name)
            items[1] = strFmt("workspaceFile\t\t{0}", props.workspaceFile)
            items[2] = strFmt("workspaceFolders\t{0}", props.workspaceFolders)
            let opts
            opts = {}
            opts.ignoreFocusOut = true
            opts.placeHolder = logLn(strFmt("Workspace has {0} properties", items.length)) + ":"
            vsc.Window.ShowQuickPick2(items, opts, null)((menuitem) => {
                if ((undefined !== menuitem && null !== menuitem)) {
                    logLn(menuitem)
                }
            })
        }
    })
}

function demo_Window_ShowOpenDialog() {
    let opts
    opts = {}
    opts.openLabel = "Note: won't actually read from specified file path(s)"
    opts.filters = {}
    opts.filters["All"] = ["*"]
    opts.filters["Dummy Filter"] = ["dummy", "demo"]
    {
        opts.canSelectFiles = true
        opts.canSelectFolders = false
        opts.canSelectMany = true
    }
    logLn("Showing File-Open dialog...")
    vsc.Window.ShowOpenDialog(opts)((filepaths) => {
        if ((undefined === filepaths || null === filepaths)) {
            vsc.Window.ShowWarningMessage1(logLn("Cancelled File-Open dialog, chicken?"), null)
        } else {
            vsc.Window.ShowInformationMessage1(logLn(strFmt("Selected {0} file path(s), excellent!", filepaths.length)), null)
        }
    })
}

function demo_Window_ShowSaveDialog() {
    let opts
    opts = {}
    opts.saveLabel = "Note: won't actually write to specified file path"
    opts.filters = {}
    opts.filters["All"] = ["*"]
    opts.filters["Dummy Filter"] = ["dummy", "demo"]
    logLn("Showing File-Save dialog...")
    vsc.Window.ShowSaveDialog(opts)((filepath) => {
        if ((undefined === filepath || null === filepath)) {
            vsc.Window.ShowWarningMessage1(logLn("Cancelled File-Save dialog, chicken?"), null)
        } else {
            vsc.Window.ShowInformationMessage1(logLn(strFmt("Selected file path `{0}`, excellent!", filepath)), null)
        }
    })
}

function demo_Window_ShowWorkspaceFolderPick() {
    let opts
    opts = {}
    opts.ignoreFocusOut = true
    opts.placeHolder = "Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side."
    vsc.Window.ShowWorkspaceFolderPick(opts)((pickedfolder) => {
        if ((undefined === pickedfolder || null === pickedfolder)) {
            vsc.Window.ShowWarningMessage1(logLn("Cancelled pick input, changed your mind?"), null)
        } else {
            vsc.Window.ShowInformationMessage1(logLn(strFmt("Selected `{0}` located at `{1}`, respect!", pickedfolder.name, pickedfolder.uri)), null)
        }
    })
}

function demo_Env_OpenExternal() {
    let opts
    opts = {}
    opts.ignoreFocusOut = true
    opts.value = "http://github.com/metaleap/vscode-appz"
    logLn(strFmt("uri/opts/{0}:\t{1}", "Prompt", "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol."))
    opts.prompt = "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol."
    vsc.Window.ShowInputBox(opts, null)((uri) => {
        if ((undefined === uri || null === uri)) {
            vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null)
        } else {
            logLn(strFmt("uri <- {0}", uri))
            vsc.Env.OpenExternal(uri)((ok) => {
                let did
                did = "Did"
                if (!ok) {
                    did = did  +  " not"
                }
                vsc.Window.ShowInformationMessage1(logLn(strFmt("{0} succeed in opening `{1}`, chapeau!", did, uri)), null)
            })
        }
    })
}

function demo_Window_ShowQuickPick() {
    let items
    items = new Array(4)
    items[0] = {}
    items[0].label = "One"
    items[0].description = "The first"
    items[0].detail = "Das erste"
    items[1] = {}
    items[1].label = "Two"
    items[1].description = "The second"
    items[1].detail = "Das zweite"
    items[2] = {}
    items[2].label = "Three"
    items[2].description = "The third"
    items[2].detail = "Das dritte"
    items[3] = {}
    items[3].label = "Four"
    items[3].description = "The fourth"
    items[3].detail = "Das vierte"
    let opts
    opts = {}
    opts.ignoreFocusOut = true
    opts.matchOnDescription = true
    opts.matchOnDetail = true
    opts.placeHolder = "You have 42 seconds before auto-cancellation!"
    opts.onDidSelectItem = (item) => {
        vsc.Window.SetStatusBarMessage1(logLn(strFmt("Just selected: {0}", item.label)), 4242)
        return null
    }
    vsc.Window.ShowQuickPick3(items, opts, cancelIn(42))((pickeditems) => {
        if ((undefined === pickeditems || null === pickeditems)) {
            vsc.Window.ShowWarningMessage1(logLn("Cancelled pick input, not one to tick the boxes?"), null)
        } else {
            vsc.Window.ShowInformationMessage1(logLn(strFmt("You picked {0} item(s), good stuff!", pickeditems.length)), null)
        }
    })
}

function demo_Window_CreateQuickPick() {
    vsc.Window.CreateQuickPick()((ctl) => {
        ctl.CfgBag.IgnoreFocusOut = true
        ctl.CfgBag.Title = "I'm a full-fledged QuickPick"
        ctl.CfgBag.Step = 23
        ctl.CfgBag.TotalSteps = 42
        ctl.CfgBag.Items = new Array(88)
        for (const i of nums1To(88)) {
            ctl.CfgBag.Items[i] = {}
            ctl.CfgBag.Items[(i - 1)].Label = strFmt("$(eye) Label {0}", i)
            ctl.CfgBag.Items[(i - 1)].Description = strFmt("$(gift) Description {0}", i)
            ctl.CfgBag.Items[(i - 1)].Detail = strFmt("$(globe~spin) Detail {0}", i)
            ctl.CfgBag.Items[(i - 1)].AlwaysShow = i === 42
        }
        ctl.CfgBag.ApplyChanges()
        ctl.OnDidAccept((bag) => {
            logLn(strFmt("Picked: {0}", bag.SelectedItems))
            ctl.Hide()
        })
        ctl.OnDidHide((_) => {
            ctl.Dispose()
        })
        ctl.Show()
    })
}

function demo_Window_CreateInputBox() {
    vsc.Window.CreateInputBox()((ctl) => {
        ctl.CfgBag.ignoreFocusOut = true
        ctl.CfgBag.placeholder = "The initial Placeholder"
        ctl.CfgBag.prompt = "The initial Prompt"
        ctl.CfgBag.title = "The initial Title"
        ctl.CfgBag.ApplyChanges()
        ctl.OnDidChangeValue((input, bag) => {
            ctl.CfgBag.prompt = strFmt("Lower: {0}", strLo(ctl.CfgBag.value))
            ctl.CfgBag.title = strFmt("Upper: {0}", strUp(ctl.CfgBag.value))
            ctl.CfgBag.ApplyChanges()
        })
        let finalinputvalue
        ctl.OnDidAccept((bag) => {
            finalinputvalue = bag.value
            ctl.Hide()
        })
        ctl.OnDidHide((bag) => {
            ctl.Dispose()
            if ((undefined !== finalinputvalue && null !== finalinputvalue)) {
                vsc.Window.ShowInformationMessage1(logLn(strFmt("You entered: `{0}`, ponderous!", finalinputvalue)), null)
            } else {
                vsc.Window.ShowWarningMessage1(logLn("Backing off or backing up?"), null)
            }
        })
        ctl.Show()
    })
}

function subscribeToMiscEvents() {
    vsc.Extensions.OnDidChange(() => {
        vsc.Window.SetStatusBarMessage1(logLn("Some extension(s) were just (un)installed or (de)activated."), 4242)
    })
    vsc.Window.OnDidChangeWindowState((evt) => {
        vsc.Window.SetStatusBarMessage1(logLn(strFmt("Am I focused? {0}.", evt.focused)), 4242)
    })
    vsc.Languages.OnDidChangeDiagnostics((evt) => {
        vsc.Window.SetStatusBarMessage1(logLn(strFmt("Diag(s) changed for {0} file path(s).", evt.uris.length)), 4242)
    })
}

function demosMenu() {
    let items
    items = ["demo_promptToExit", "demo_clipboard", "demo_Commands_GetCommands_and_ExecuteCommand", "demo_Commands_RegisterCommand", "demo_Languages_GetLanguages", "demo_Env_Properties", "demo_Workspace_Properties", "demo_Window_ShowOpenDialog", "demo_Window_ShowSaveDialog", "demo_Window_ShowWorkspaceFolderPick", "demo_Env_OpenExternal", "demo_Window_ShowQuickPick", "demo_Window_CreateQuickPick", "demo_Window_CreateInputBox", "demo_Window_ShowInputBox"]
    let opts
    opts = {}
    opts.ignoreFocusOut = true
    opts.placeHolder = "This menu can be re-opened any time via our custom status-bar item."
    vsc.Window.ShowQuickPick2(items, opts, null)((menuitem) => {
        if ((undefined !== menuitem && null !== menuitem)) {
            if ("demo_promptToExit" === menuitem) {
                logLn("Picked `demo_promptToExit` from main menu")
                demo_promptToExit()
            }
            if ("demo_clipboard" === menuitem) {
                logLn("Picked `demo_clipboard` from main menu")
                demo_clipboard()
            }
            if ("demo_Commands_GetCommands_and_ExecuteCommand" === menuitem) {
                logLn("Picked `demo_Commands_GetCommands_and_ExecuteCommand` from main menu")
                demo_Commands_GetCommands_and_ExecuteCommand()
            }
            if ("demo_Commands_RegisterCommand" === menuitem) {
                logLn("Picked `demo_Commands_RegisterCommand` from main menu")
                demo_Commands_RegisterCommand()
            }
            if ("demo_Languages_GetLanguages" === menuitem) {
                logLn("Picked `demo_Languages_GetLanguages` from main menu")
                demo_Languages_GetLanguages()
            }
            if ("demo_Env_Properties" === menuitem) {
                logLn("Picked `demo_Env_Properties` from main menu")
                demo_Env_Properties()
            }
            if ("demo_Workspace_Properties" === menuitem) {
                logLn("Picked `demo_Workspace_Properties` from main menu")
                demo_Workspace_Properties()
            }
            if ("demo_Window_ShowOpenDialog" === menuitem) {
                logLn("Picked `demo_Window_ShowOpenDialog` from main menu")
                demo_Window_ShowOpenDialog()
            }
            if ("demo_Window_ShowSaveDialog" === menuitem) {
                logLn("Picked `demo_Window_ShowSaveDialog` from main menu")
                demo_Window_ShowSaveDialog()
            }
            if ("demo_Window_ShowWorkspaceFolderPick" === menuitem) {
                logLn("Picked `demo_Window_ShowWorkspaceFolderPick` from main menu")
                demo_Window_ShowWorkspaceFolderPick()
            }
            if ("demo_Env_OpenExternal" === menuitem) {
                logLn("Picked `demo_Env_OpenExternal` from main menu")
                demo_Env_OpenExternal()
            }
            if ("demo_Window_ShowQuickPick" === menuitem) {
                logLn("Picked `demo_Window_ShowQuickPick` from main menu")
                demo_Window_ShowQuickPick()
            }
            if ("demo_Window_CreateQuickPick" === menuitem) {
                logLn("Picked `demo_Window_CreateQuickPick` from main menu")
                demo_Window_CreateQuickPick()
            }
            if ("demo_Window_CreateInputBox" === menuitem) {
                logLn("Picked `demo_Window_CreateInputBox` from main menu")
                demo_Window_CreateInputBox()
            }
            if ("demo_Window_ShowInputBox" === menuitem) {
                logLn("Picked `demo_Window_ShowInputBox` from main menu")
                demo_Window_ShowInputBox()
            }
        }
    })
}

function onUpAndRunning() {
    {
        subscribeToMiscEvents()
    }
    let logchan
    let toggleonclick
    {
        vsc.Window.CreateOutputChannel(appName)((it) => {
            logchan = it
            setOutChan(logchan)
            logLn(strFmt("Hi, I'm `{0}`, this is my own custom `OutputChannel` where I leisurely log all your interactions with me. When I'm ended, it too will disappear.", appName))
            logLn("")
            logLn("NOTE that for logging error messages, you won't need to manually create a custom `OutputChannel` at all: just have your prog print to its `stderr` as (presumably) usual, and `vscode-appz` will then create a dedicated `OutputChannel` for (both that initial and all subsequent) `stderr` prints from your prog while it's up and running.")
            logLn("")
            if (toggleonclick) {
                logLn("Note also that every click on my status-bar item will toggle my visibility.")
                logLn("")
            }
            logchan.Show(true)
        })
    }
    {
        let statusitem
        let clickcount
        clickcount = 0
        let mycmd
        mycmd = (_unused) => {
            clickcount = 1 + clickcount
            statusitem.CfgBag.ReFetch()(() => {
                statusitem.CfgBag.text = logLn(strFmt("You clicked me {0} time(s).", clickcount))
                if ("editorLightBulb.foreground" === statusitem.CfgBag.color) {
                    statusitem.CfgBag.color = "terminal.ansiGreen"
                    if (toggleonclick && (undefined !== logchan && null !== logchan)) {
                        logchan.Hide()
                    }
                } else {
                    statusitem.CfgBag.color = "editorLightBulb.foreground"
                    if (toggleonclick && (undefined !== logchan && null !== logchan)) {
                        logchan.Show(true)
                    }
                }
                statusitem.CfgBag.ApplyChanges()(demosMenu)
            })
            return null
        }
        vsc.Commands.RegisterCommand(cmdName, mycmd)
        vsc.Window.CreateStatusBarItem(0, null)((it) => {
            statusitem = it
            statusitem.CfgBag.tooltip = strFmt("Hi from {0}!", appName)
            statusitem.CfgBag.text = "You clicked me 0 time(s)."
            statusitem.CfgBag.color = "#42BEEF"
            statusitem.CfgBag.command = cmdName
            statusitem.CfgBag.ApplyChanges()
            statusitem.Show()
        })
    }
}

