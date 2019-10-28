// Auto-merged-and-`sed`ed from `./proper-cmd/go-vsc-appz-demo` .go files to have a readily `go run`-able (even outside GOPATH) demo proggie that always imports our extension-local `../../libs/go` package
package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	. "../../libs/go"
)

type any = interface{}

const appName = "go-vsc-appz-demo"

var cmdName = appName + strconv.FormatInt(time.Now().UnixNano(), 10)
var vsc Vscode
var win Window
var logChan *OutputChannel

func main() {
	Main(func(vscode Vscode) {
		vsc = vscode
		win = vsc.Window()

		onUpAndRunning()

		win.SetStatusBarMessage2("React to the Welcome msg-box to remove me..")(func(statusmsg *Disposable) {
			buttons := []string{"Demo Text Input", "All Demos"}
			win.ShowInformationMessage1(
				"What to try out? (If you cancel here, I quit.)", buttons)(
				func(btn *string) {
					statusmsg.Dispose()
					if btn == nil {
						quit(btn) // msgbox dismissed via close / esc key
					} else {
						switch button := *btn; button {
						case buttons[0]:
							demo_Window_ShowInputBox()
						case buttons[1]:
							demosMenu()
						default:
							win.ShowErrorMessage1("Unknown: `"+button+"`", nil)(demosmenu)
						}
					}
				})
		})
	}, nil, nil)
}

func demo_Window_ShowInputBox() {
	win.ShowInputBox(&InputBoxOptions{
		IgnoreFocusOut: true,
		Value:          "Enter almost anything...",
		ValueSelection: []int{6, 12},
		Prompt:         "Enter anything containing nothing looking like `foo` (it would be rejected by my real-time ValidateInput func)",
		ValidateInput: func(input string) (complaint string) {
			if input = strings.ToLower(input); strings.Contains(input, "foo") || strings.Contains(input, "f0o") || strings.Contains(input, "fo0") || strings.Contains(input, "f00") {
				complaint = "Contains something looking like `foo`."
			}
			return
		},
	}, nil)(
		func(input *string) {
			if input == nil {
				win.ShowWarningMessage1("Drat! Was itching to hear that.", nil)(demosmenu)
			} else {
				win.ShowInformationMessage1("You entered: `"+(*input)+"`, merci!", nil)(demosmenu)
			}
		})
}

func demosmenu(*string) { demosMenu() }
func quit(*string)      { os.Exit(0) }

func cancelIn(seconds int64) *Cancel {
	return CancelIn(time.Duration(seconds * int64(time.Second)))
}

func logLn(msgLn string) string {
	if msgln := msgLn; logChan != nil {
		if msgln != "" {
			msgln = time.Now().Format("15:04:05") + "\t" + msgln
		}
		logChan.AppendLine(msgln)
	}
	return msgLn
}
func setOutChan(outChan *OutputChannel) { logChan = outChan }

func strFmt(s string, args ...any) string {
	for i := range args {
		s = strings.Replace(s, "{"+strconv.Itoa(i)+"}", fmt.Sprintf("%v", args[i]), -1)
	}
	return s
}
func strLo(s string) string { return strings.ToLower(s) }
func strUp(s string) string { return strings.ToUpper(s) }

func nums1To(n int) (nums []int) {
	nums = make([]int, n)
	for i := range nums {
		nums[i] = i + 1
	}
	return
}

func demo_promptToExit() {
	vsc.Window().ShowWarningMessage1(strFmt("Are you sure you want `{0}` to exit?", appName), []string{"Sure I'm sure"})(func(btn *string) {
		if (nil != btn) {
			vsc.Window().ShowInformationMessage1(logLn("So fish and long for all the thanks!"), nil)
			quit(nil)
		} else {
			vsc.Window().ShowInformationMessage1(logLn("So I'm not a goner yet. I'll stick around then."), nil)
		}
	})
}

func demo_clipboard() {
	vsc.Env().Clipboard().ReadText()(func(text *string) {
		if (nil == text) {
			vsc.Window().ShowWarningMessage1(logLn("No text in clipboard"), nil)
		} else {
			var opts *InputBoxOptions
			opts = new(InputBoxOptions)
			opts.IgnoreFocusOut = true
			opts.Value = *text
			logLn(strFmt("input@opts/{0}:\t{1}", "Prompt", "Enter new contents to write to your clipboard."))
			opts.Prompt = "Enter new contents to write to your clipboard."
			vsc.Window().ShowInputBox(opts, nil)(func(input *string) {
				if (nil == input) {
					vsc.Window().ShowWarningMessage1(logLn("Don't be bashful.."), nil)
				} else {
					logLn(strFmt("input <- {0}", *input))
					vsc.Env().Clipboard().WriteText(*input)(func() {
						vsc.Window().ShowInformationMessage1(logLn("Okay. Now double-check by pasting somewhere."), nil)
					})
				}
			})
		}
	})
}

func demo_Commands_GetCommands_and_ExecuteCommand() {
	vsc.Commands().GetCommands(false)(func(items []string) {
		var opts QuickPickOptions
		opts.IgnoreFocusOut = true
		opts.PlaceHolder = strFmt("Retrieved {0} command ID(s), pick one to execute or escape now:", len(items))
		vsc.Window().ShowQuickPick2(items, &opts, nil)(func(item *string) {
			if (nil == item) {
				vsc.Window().ShowWarningMessage1(logLn("Command selection cancelled, spooked?"), nil)
			} else {
				var opts2 *InputBoxOptions
				opts2 = new(InputBoxOptions)
				opts2.IgnoreFocusOut = true
				logLn(strFmt("cmdarg@opts2/{0}:\t{1}", "PlaceHolder", strFmt("Any param for `{0}` command? Else leave blank.", *item)))
				opts2.PlaceHolder = strFmt("Any param for `{0}` command? Else leave blank.", *item)
				vsc.Window().ShowInputBox(opts2, nil)(func(cmdarg *string) {
					if (nil == cmdarg) {
						vsc.Window().ShowWarningMessage1(logLn("Don't be bashful.."), nil)
					} else {
						logLn(strFmt("cmdarg <- {0}", *cmdarg))
						var cmdargs []any
						if "" != (*cmdarg) {
							cmdargs = make([]any, 1)
							cmdargs[0] = *cmdarg
						}
						vsc.Commands().ExecuteCommand(*item, cmdargs)(func(ret any) {
							vsc.Window().ShowInformationMessage1(logLn(strFmt("Command result was: `{0}`, kudos!", ret)), nil)
						})
					}
				})
			}
		})
	})
}

func demo_Commands_RegisterCommand() {
	var opts *InputBoxOptions
	opts = new(InputBoxOptions)
	opts.IgnoreFocusOut = true
	opts.Value = "foo.bar.baz"
	logLn(strFmt("cmdname@opts/{0}:\t{1}", "Prompt", "Enter your command name. The command will accept a single text input and return a result built from it."))
	opts.Prompt = "Enter your command name. The command will accept a single text input and return a result built from it."
	vsc.Window().ShowInputBox(opts, nil)(func(cmdname *string) {
		if (nil == cmdname) {
			vsc.Window().ShowWarningMessage1(logLn("Don't be bashful.."), nil)
		} else {
			logLn(strFmt("cmdname <- {0}", *cmdname))
			vsc.Commands().RegisterCommand(*cmdname, func(cmdargs []any) any {
				vsc.Window().SetStatusBarMessage1(logLn(strFmt("Command `{0}` invoked with: `{1}`", *cmdname, cmdargs[0])), 4242)
				return strFmt("Input to command `{0}` was: `{1}`", *cmdname, cmdargs[0])
			})(func(useToUnregister *Disposable) {
				var opts2 *InputBoxOptions
				opts2 = new(InputBoxOptions)
				opts2.IgnoreFocusOut = true
				logLn(strFmt("cmdarg@opts2/{0}:\t{1}", "Prompt", strFmt("Command `{0}` registered, try it now?", *cmdname)))
				opts2.Prompt = strFmt("Command `{0}` registered, try it now?", *cmdname)
				opts2.Value = strFmt("Enter input to command `{0}` here", *cmdname)
				vsc.Window().ShowInputBox(opts2, nil)(func(cmdarg *string) {
					if (nil == cmdarg) {
						vsc.Window().ShowWarningMessage1(logLn("Don't be bashful.."), nil)
					} else {
						logLn(strFmt("cmdarg <- {0}", *cmdarg))
						var cmdargs2 []any
						cmdargs2 = make([]any, 1)
						cmdargs2[0] = *cmdarg
						vsc.Commands().ExecuteCommand(*cmdname, cmdargs2)(func(ret any) {
							vsc.Window().ShowInformationMessage1(logLn(strFmt("Command result: `{0}`, mad props!", ret)), nil)
						})
					}
				})
			})
		}
	})
}

func demo_Languages_GetLanguages() {
	vsc.Languages().GetLanguages()(func(items []string) {
		var opts QuickPickOptions
		opts.IgnoreFocusOut = true
		opts.PlaceHolder = strFmt("Retrieved {0} language ID(s)", len(items))
		vsc.Window().ShowQuickPick2(items, &opts, nil)(func(menuitem *string) {
			if (nil != menuitem) {
				logLn(*menuitem)
			}
		})
	})
}

func demo_Env_Properties() {
	vsc.Env().AllProperties()(func(props EnvState) {
		var items []string
		items = make([]string, 8)
		{
			items[0] = strFmt("AppName\t\t\t{0}", props.AppName)
			items[1] = strFmt("AppRoot\t\t\t{0}", props.AppRoot)
			items[2] = strFmt("Language\t\t{0}", props.Language)
			items[3] = strFmt("MachineId\t\t{0}", props.MachineId)
			items[4] = strFmt("RemoteName\t\t{0}", props.RemoteName)
			items[5] = strFmt("SessionId\t\t{0}", props.SessionId)
			items[6] = strFmt("Shell\t\t\t{0}", props.Shell)
			items[7] = strFmt("UriScheme\t\t{0}", props.UriScheme)
			var opts QuickPickOptions
			opts.IgnoreFocusOut = true
			opts.PlaceHolder = logLn(strFmt("Env has {0} properties", len(items))) + ":"
			vsc.Window().ShowQuickPick2(items, &opts, nil)(func(menuitem *string) {
				if (nil != menuitem) {
					logLn(*menuitem)
				}
			})
		}
	})
}

func demo_Workspace_Properties() {
	vsc.Workspace().AllProperties()(func(props WorkspaceState) {
		var items []string
		items = make([]string, 3)
		{
			items[0] = strFmt("Name\t\t\t{0}", props.Name)
			items[1] = strFmt("WorkspaceFile\t\t{0}", props.WorkspaceFile)
			items[2] = strFmt("WorkspaceFolders\t{0}", props.WorkspaceFolders)
			var opts QuickPickOptions
			opts.IgnoreFocusOut = true
			opts.PlaceHolder = logLn(strFmt("Workspace has {0} properties", len(items))) + ":"
			vsc.Window().ShowQuickPick2(items, &opts, nil)(func(menuitem *string) {
				if (nil != menuitem) {
					logLn(*menuitem)
				}
			})
		}
	})
}

func demo_Window_ShowOpenDialog() {
	var opts OpenDialogOptions
	opts.OpenLabel = "Note: won't actually read from specified file path(s)"
	opts.Filters = make(map[string][]string, 2)
	opts.Filters["All"] = []string{"*"}
	opts.Filters["Dummy Filter"] = []string{"dummy", "demo"}
	{
		opts.CanSelectFiles = true
		opts.CanSelectFolders = false
		opts.CanSelectMany = true
	}
	logLn("Showing File-Open dialog...")
	vsc.Window().ShowOpenDialog(opts)(func(filepaths []string) {
		if (nil == filepaths) {
			vsc.Window().ShowWarningMessage1(logLn("Cancelled File-Open dialog, chicken?"), nil)
		} else {
			vsc.Window().ShowInformationMessage1(logLn(strFmt("Selected {0} file path(s), excellent!", len(filepaths))), nil)
		}
	})
}

func demo_Window_ShowSaveDialog() {
	var opts SaveDialogOptions
	opts.SaveLabel = "Note: won't actually write to specified file path"
	opts.Filters = make(map[string][]string, 2)
	opts.Filters["All"] = []string{"*"}
	opts.Filters["Dummy Filter"] = []string{"dummy", "demo"}
	logLn("Showing File-Save dialog...")
	vsc.Window().ShowSaveDialog(opts)(func(filepath *string) {
		if (nil == filepath) {
			vsc.Window().ShowWarningMessage1(logLn("Cancelled File-Save dialog, chicken?"), nil)
		} else {
			vsc.Window().ShowInformationMessage1(logLn(strFmt("Selected file path `{0}`, excellent!", *filepath)), nil)
		}
	})
}

func demo_Window_ShowWorkspaceFolderPick() {
	var opts *WorkspaceFolderPickOptions
	opts = new(WorkspaceFolderPickOptions)
	opts.IgnoreFocusOut = true
	opts.PlaceHolder = "Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side."
	vsc.Window().ShowWorkspaceFolderPick(opts)(func(pickedfolder *WorkspaceFolder) {
		if (nil == pickedfolder) {
			vsc.Window().ShowWarningMessage1(logLn("Cancelled pick input, changed your mind?"), nil)
		} else {
			vsc.Window().ShowInformationMessage1(logLn(strFmt("Selected `{0}` located at `{1}`, respect!", pickedfolder.Name, pickedfolder.Uri)), nil)
		}
	})
}

func demo_Env_OpenExternal() {
	var opts *InputBoxOptions
	opts = new(InputBoxOptions)
	opts.IgnoreFocusOut = true
	opts.Value = "http://github.com/metaleap/vscode-appz"
	logLn(strFmt("uri@opts/{0}:\t{1}", "Prompt", "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol."))
	opts.Prompt = "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol."
	vsc.Window().ShowInputBox(opts, nil)(func(uri *string) {
		if (nil == uri) {
			vsc.Window().ShowWarningMessage1(logLn("Don't be bashful.."), nil)
		} else {
			logLn(strFmt("uri <- {0}", *uri))
			vsc.Env().OpenExternal(*uri)(func(ok bool) {
				var did string
				did = "Did"
				if !ok {
					did = did  +  " not"
				}
				vsc.Window().ShowInformationMessage1(logLn(strFmt("{0} succeed in opening `{1}`, chapeau!", did, *uri)), nil)
			})
		}
	})
}

func demo_Window_ShowQuickPick() {
	var items []QuickPickItem
	items = make([]QuickPickItem, 4)
	items[0].Label = "One"
	items[0].Description = "The first"
	items[0].Detail = "Das erste"
	items[1].Label = "Two"
	items[1].Description = "The second"
	items[1].Detail = "Das zweite"
	items[2].Label = "Three"
	items[2].Description = "The third"
	items[2].Detail = "Das dritte"
	items[3].Label = "Four"
	items[3].Description = "The fourth"
	items[3].Detail = "Das vierte"
	var opts QuickPickOptions
	opts.IgnoreFocusOut = true
	opts.MatchOnDescription = true
	opts.MatchOnDetail = true
	opts.PlaceHolder = "You have 42 seconds before auto-cancellation!"
	opts.OnDidSelectItem = func(item QuickPickItem) any {
		vsc.Window().SetStatusBarMessage1(logLn(strFmt("Just selected: {0}", item.Label)), 4242)
		return nil
	}
	vsc.Window().ShowQuickPick3(items, opts, cancelIn(42))(func(pickeditems []QuickPickItem) {
		if (nil == pickeditems) {
			vsc.Window().ShowWarningMessage1(logLn("Cancelled pick input, not one to tick the boxes?"), nil)
		} else {
			vsc.Window().ShowInformationMessage1(logLn(strFmt("You picked {0} item(s), good stuff!", len(pickeditems))), nil)
		}
	})
}

func demo_Window_CreateQuickPick() {
	vsc.Window().CreateQuickPick()(func(ctl *QuickPick) {
		ctl.Cfg.IgnoreFocusOut = true
		ctl.Cfg.Title = "I'm a full-fledged QuickPick"
		ctl.Cfg.Step = 23
		ctl.Cfg.TotalSteps = 42
		ctl.Cfg.Items = make([]QuickPickItem, 88)
		for _, i := range nums1To(88) {
			ctl.Cfg.Items[(i - 1)].Label = strFmt("$(eye) Label {0}", i)
			ctl.Cfg.Items[(i - 1)].Description = strFmt("$(gift) Description {0}", i)
			ctl.Cfg.Items[(i - 1)].Detail = strFmt("$(globe~spin) Detail {0}", i)
			ctl.Cfg.Items[(i - 1)].AlwaysShow = i == 42
		}
		ctl.Cfg.ApplyChanges()
		ctl.OnDidAccept(func() {
			logLn(strFmt("Picked: {0}", ctl.Cfg.SelectedItems))
			ctl.Hide()
		})
		ctl.OnDidHide(func() {
			ctl.Dispose()
		})
		ctl.Show()
	})
}

func demo_Window_CreateInputBox() {
	vsc.Window().CreateInputBox()(func(ctl *InputBox) {
		ctl.Cfg.IgnoreFocusOut = true
		ctl.Cfg.Placeholder = "The initial Placeholder"
		ctl.Cfg.Prompt = "The initial Prompt"
		ctl.Cfg.Title = "The initial Title"
		ctl.Cfg.ApplyChanges()
		ctl.OnDidChangeValue(func(input string) {
			ctl.Cfg.Prompt = strFmt("Lower: {0}", strLo(ctl.Cfg.Value))
			ctl.Cfg.Title = strFmt("Upper: {0}", strUp(ctl.Cfg.Value))
			ctl.Cfg.ApplyChanges()
		})
		var finalinputvalue *string
		ctl.OnDidAccept(func() {
			finalinputvalue = &ctl.Cfg.Value
			ctl.Hide()
		})
		ctl.OnDidHide(func() {
			ctl.Dispose()
			if (nil != finalinputvalue) {
				vsc.Window().ShowInformationMessage1(logLn(strFmt("You entered: `{0}`, ponderous!", *finalinputvalue)), nil)
			} else {
				vsc.Window().ShowWarningMessage1(logLn("Backing off or backing up?"), nil)
			}
		})
		ctl.Show()
	})
}

func demo_Window_CreateTerminal() {
	var optsname *InputBoxOptions
	optsname = new(InputBoxOptions)
	optsname.IgnoreFocusOut = true
	logLn(strFmt("termname@optsname/{0}:\t{1}", "Prompt", "Name of your new terminal?"))
	optsname.Prompt = "Name of your new terminal?"
	optsname.Value = appName
	vsc.Window().ShowInputBox(optsname, nil)(func(termname *string) {
		if (nil == termname) {
			vsc.Window().ShowWarningMessage1(logLn("Don't be bashful.."), nil)
		} else {
			logLn(strFmt("termname <- {0}", *termname))
			var optstext *InputBoxOptions
			optstext = new(InputBoxOptions)
			optstext.IgnoreFocusOut = true
			logLn(strFmt("termtext@optstext/{0}:\t{1}", "Prompt", strFmt("Text to send to new terminal `{0}` initially upon creation?", *termname)))
			optstext.Prompt = strFmt("Text to send to new terminal `{0}` initially upon creation?", *termname)
			optstext.Value = appName
			vsc.Window().ShowInputBox(optstext, nil)(func(termtext *string) {
				if (nil == termtext) {
					vsc.Window().ShowWarningMessage1(logLn("Don't be bashful.."), nil)
				} else {
					logLn(strFmt("termtext <- {0}", *termtext))
					var optsvar *InputBoxOptions
					optsvar = new(InputBoxOptions)
					optsvar.IgnoreFocusOut = true
					logLn(strFmt("termvar@optsvar/{0}:\t{1}", "Prompt", "Value for custom env var named `MY_ENV_VAR`?"))
					optsvar.Prompt = "Value for custom env var named `MY_ENV_VAR`?"
					vsc.Window().ShowInputBox(optsvar, nil)(func(termvar *string) {
						if (nil == termvar) {
							vsc.Window().ShowWarningMessage1(logLn("Don't be bashful.."), nil)
						} else {
							logLn(strFmt("termvar <- {0}", *termvar))
							var ontermcreated func(*Terminal)
							ontermcreated = func(term *Terminal) {
								term.Show(false)(func() {
									term.SendText(*termtext, false)
								})
							}
							if (*termvar) == "" {
								vsc.Window().CreateTerminal1(termname, nil, nil)(ontermcreated)
							} else {
								var cfg TerminalOptions
								cfg.Name = *termname
								cfg.Env = make(map[string]string, 1)
								cfg.Env["MY_ENV_VAR"] = *termvar
								vsc.Window().CreateTerminal2(cfg)(ontermcreated)
							}
						}
					})
				}
			})
		}
	})
}

func subscribeToMiscEvents() {
	vsc.Extensions().OnDidChange(func() {
		vsc.Window().SetStatusBarMessage1(logLn("Some extension(s) were just (un)installed or (de)activated."), 4242)
	})
	vsc.Window().OnDidChangeWindowState(func(evt WindowState) {
		vsc.Window().SetStatusBarMessage1(logLn(strFmt("Am I focused? {0}.", evt.Focused)), 4242)
	})
	vsc.Languages().OnDidChangeDiagnostics(func(evt DiagnosticChangeEvent) {
		vsc.Window().SetStatusBarMessage1(logLn(strFmt("Diag(s) changed for {0} file path(s).", len(evt.Uris))), 4242)
	})
}

func demosMenu() {
	var items []string
	items = []string{"demo_promptToExit", "demo_clipboard", "demo_Commands_GetCommands_and_ExecuteCommand", "demo_Commands_RegisterCommand", "demo_Languages_GetLanguages", "demo_Env_Properties", "demo_Workspace_Properties", "demo_Window_ShowOpenDialog", "demo_Window_ShowSaveDialog", "demo_Window_ShowWorkspaceFolderPick", "demo_Env_OpenExternal", "demo_Window_ShowQuickPick", "demo_Window_CreateQuickPick", "demo_Window_CreateInputBox", "demo_Window_CreateTerminal", "demo_Window_ShowInputBox"}
	var opts QuickPickOptions
	opts.IgnoreFocusOut = true
	opts.PlaceHolder = "This menu can be re-opened any time via our custom status-bar item."
	vsc.Window().ShowQuickPick2(items, &opts, nil)(func(menuitem *string) {
		if (nil != menuitem) {
			if "demo_promptToExit" == (*menuitem) {
				logLn("Picked `demo_promptToExit` from main menu")
				demo_promptToExit()
			}
			if "demo_clipboard" == (*menuitem) {
				logLn("Picked `demo_clipboard` from main menu")
				demo_clipboard()
			}
			if "demo_Commands_GetCommands_and_ExecuteCommand" == (*menuitem) {
				logLn("Picked `demo_Commands_GetCommands_and_ExecuteCommand` from main menu")
				demo_Commands_GetCommands_and_ExecuteCommand()
			}
			if "demo_Commands_RegisterCommand" == (*menuitem) {
				logLn("Picked `demo_Commands_RegisterCommand` from main menu")
				demo_Commands_RegisterCommand()
			}
			if "demo_Languages_GetLanguages" == (*menuitem) {
				logLn("Picked `demo_Languages_GetLanguages` from main menu")
				demo_Languages_GetLanguages()
			}
			if "demo_Env_Properties" == (*menuitem) {
				logLn("Picked `demo_Env_Properties` from main menu")
				demo_Env_Properties()
			}
			if "demo_Workspace_Properties" == (*menuitem) {
				logLn("Picked `demo_Workspace_Properties` from main menu")
				demo_Workspace_Properties()
			}
			if "demo_Window_ShowOpenDialog" == (*menuitem) {
				logLn("Picked `demo_Window_ShowOpenDialog` from main menu")
				demo_Window_ShowOpenDialog()
			}
			if "demo_Window_ShowSaveDialog" == (*menuitem) {
				logLn("Picked `demo_Window_ShowSaveDialog` from main menu")
				demo_Window_ShowSaveDialog()
			}
			if "demo_Window_ShowWorkspaceFolderPick" == (*menuitem) {
				logLn("Picked `demo_Window_ShowWorkspaceFolderPick` from main menu")
				demo_Window_ShowWorkspaceFolderPick()
			}
			if "demo_Env_OpenExternal" == (*menuitem) {
				logLn("Picked `demo_Env_OpenExternal` from main menu")
				demo_Env_OpenExternal()
			}
			if "demo_Window_ShowQuickPick" == (*menuitem) {
				logLn("Picked `demo_Window_ShowQuickPick` from main menu")
				demo_Window_ShowQuickPick()
			}
			if "demo_Window_CreateQuickPick" == (*menuitem) {
				logLn("Picked `demo_Window_CreateQuickPick` from main menu")
				demo_Window_CreateQuickPick()
			}
			if "demo_Window_CreateInputBox" == (*menuitem) {
				logLn("Picked `demo_Window_CreateInputBox` from main menu")
				demo_Window_CreateInputBox()
			}
			if "demo_Window_CreateTerminal" == (*menuitem) {
				logLn("Picked `demo_Window_CreateTerminal` from main menu")
				demo_Window_CreateTerminal()
			}
			if "demo_Window_ShowInputBox" == (*menuitem) {
				logLn("Picked `demo_Window_ShowInputBox` from main menu")
				demo_Window_ShowInputBox()
			}
		}
	})
}

func onUpAndRunning() {
	{
		subscribeToMiscEvents()
	}
	var logchan *OutputChannel
	var toggleonclick bool
	{
		vsc.Window().CreateOutputChannel(appName)(func(it *OutputChannel) {
			logchan = it
			setOutChan(logchan)
			logLn(strFmt("Hi, I'm `{0}`, this is my own custom `OutputChannel` where I leisurely log all your interactions with me. When I'm ended, it too will disappear.", appName))
			logLn("")
			logLn("NOTE that for logging error messages, you won't need to manually create a custom `OutputChannel` at all: just have your prog print to its `stderr` as (presumably) usual, and `vscode-appz` will then create a dedicated `OutputChannel` for (both that initial and all subsequent) `stderr` prints from your prog while it's up and running.")
			logLn("")
			if toggleonclick {
				logLn("Note also that every click on my status-bar item will toggle my visibility.")
				logLn("")
			}
			logchan.Show(true)
		})
	}
	{
		var statusitem *StatusBarItem
		var clickcount int
		clickcount = 0
		var mycmd func([]any) any
		mycmd = func(_unused []any) any {
			clickcount = 1 + clickcount
			statusitem.Cfg.ReFetch()(func() {
				statusitem.Cfg.Text = logLn(strFmt("You clicked me {0} time(s).", clickcount))
				if "editorLightBulb.foreground" == statusitem.Cfg.Color {
					statusitem.Cfg.Color = "terminal.ansiGreen"
					if toggleonclick && (nil != logchan) {
						logchan.Hide()
					}
				} else {
					statusitem.Cfg.Color = "editorLightBulb.foreground"
					if toggleonclick && (nil != logchan) {
						logchan.Show(true)
					}
				}
				statusitem.Cfg.ApplyChanges()(demosMenu)
			})
			return nil
		}
		vsc.Commands().RegisterCommand(cmdName, mycmd)
		vsc.Window().CreateStatusBarItem(0, nil)(func(it *StatusBarItem) {
			statusitem = it
			statusitem.Cfg.Tooltip = strFmt("Hi from {0}!", appName)
			statusitem.Cfg.Text = "You clicked me 0 time(s)."
			statusitem.Cfg.Color = "#42BEEF"
			statusitem.Cfg.Command = cmdName
			statusitem.Cfg.ApplyChanges()
			statusitem.Show()
		})
	}
}

