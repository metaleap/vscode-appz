package main
// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-golang.ts via github.com/metaleap/vscode-appz/src/gen/main.ts

import (
	. "github.com/metaleap/vscode-appz/libs/go"
)

func demo_Commands_GetCommands_and_ExecuteCommand() {
	vsc.Commands().GetCommands(false, func(items []string) {
		var opts QuickPickOptions
		opts = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickOptions)
		opts.IgnoreFocusOut = true
		opts.PlaceHolder = strFmt("Retrieved {0} command ID(s), pick one to execute or escape now:", len(items))
		vsc.Window().ShowQuickPick2(items, &opts, nil, func(item *string) {
			if (nil == item) {
				vsc.Window().ShowWarningMessage1("Command selection cancelled, bye now!", nil, quit)
			} else {
				vsc.Commands().ExecuteCommand(*item, nil, func(ret any) {
					vsc.Window().ShowInformationMessage1(strFmt("Command result was: {0}", ret), nil, quit)
				})
			}
		})
	})
}

func demo_Languages_GetLanguages() {
	vsc.Languages().GetLanguages(func(items []string) {
		var opts QuickPickOptions
		opts = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickOptions)
		opts.IgnoreFocusOut = true
		opts.PlaceHolder = strFmt("Retrieved {0} language ID(s)", len(items))
		vsc.Window().ShowQuickPick2(items, &opts, nil, quit)
	})
}

func demo_Env_Properties() {
	vsc.Env().Properties(func(props EnvProperties) {
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
			opts = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickOptions)
			opts.IgnoreFocusOut = true
			opts.PlaceHolder = strFmt("Env has {0} properties:", len(items))
			vsc.Window().ShowQuickPick2(items, &opts, nil, quit)
		}
	})
}

func demo_Workspace_Properties() {
	vsc.Workspace().Properties(func(props WorkspaceProperties) {
		var items []string
		items = make([]string, 3)
		{
			items[0] = strFmt("Name\t\t\t{0}", props.Name)
			items[1] = strFmt("WorkspaceFile\t\t{0}", props.WorkspaceFile)
			items[2] = strFmt("WorkspaceFolders\t{0}", props.WorkspaceFolders)
			var opts QuickPickOptions
			opts = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickOptions)
			opts.IgnoreFocusOut = true
			opts.PlaceHolder = strFmt("Workspace has {0} properties:", len(items))
			vsc.Window().ShowQuickPick2(items, &opts, nil, quit)
		}
	})
}

func demo_Window_ShowOpenDialog() {
	var opts OpenDialogOptions
	opts = */*sorryButSuchIsCodeGenSometimes...*/new(OpenDialogOptions)
	opts.OpenLabel = "Note: won't actually read from specified file path(s)"
	opts.Filters = make(map[string][]string, 2)
	opts.Filters["All"] = []string{"*"}
	opts.Filters["Dummy Filter"] = []string{"dummy", "demo"}
	{
		opts.CanSelectFiles = true
		opts.CanSelectFolders = false
		opts.CanSelectMany = true
	}
	vsc.Window().ShowOpenDialog(opts, func(filepaths []string) {
		statusNoticeQuit()
		if (nil == filepaths) {
			vsc.Window().ShowWarningMessage1("Cancelled File-Open dialog, bye now!", nil, quit)
		} else {
			vsc.Window().ShowInformationMessage1(strFmt("Selected {0} file path(s), bye now!", len(filepaths)), nil, quit)
		}
	})
}

func demo_Window_ShowSaveDialog() {
	var opts SaveDialogOptions
	opts = */*sorryButSuchIsCodeGenSometimes...*/new(SaveDialogOptions)
	opts.SaveLabel = "Note: won't actually write to specified file path"
	opts.Filters = make(map[string][]string, 2)
	opts.Filters["All"] = []string{"*"}
	opts.Filters["Dummy Filter"] = []string{"dummy", "demo"}
	vsc.Window().ShowSaveDialog(opts, func(filepath *string) {
		statusNoticeQuit()
		if (nil == filepath) {
			vsc.Window().ShowWarningMessage1("Cancelled File-Save dialog, bye now!", nil, quit)
		} else {
			vsc.Window().ShowInformationMessage1(strFmt("Selected file path `{0}`, bye now!", *filepath), nil, quit)
		}
	})
}

func demo_Window_ShowWorkspaceFolderPick() {
	var opts *WorkspaceFolderPickOptions
	opts = new(WorkspaceFolderPickOptions)
	opts.IgnoreFocusOut = true
	opts.PlaceHolder = "Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side."
	vsc.Window().ShowWorkspaceFolderPick(opts, func(pickedfolder *WorkspaceFolder) {
		statusNoticeQuit()
		if (nil == pickedfolder) {
			vsc.Window().ShowWarningMessage1("Cancelled pick input, bye now!", nil, quit)
		} else {
			vsc.Window().ShowInformationMessage1(strFmt("Selected `{0}` located at `{1}`, bye now!", pickedfolder.Name, pickedfolder.Uri), nil, quit)
		}
	})
}

func demo_Env_OpenExternal() {
	var opts *InputBoxOptions
	opts = new(InputBoxOptions)
	opts.IgnoreFocusOut = true
	opts.Value = "http://github.com/metaleap/vscode-appz"
	opts.Prompt = "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol."
	vsc.Window().ShowInputBox(opts, nil, func(uri *string) {
		statusNoticeQuit()
		if (nil == uri) {
			vsc.Window().ShowWarningMessage1("Cancelled, bye now!", nil, quit)
		} else {
			vsc.Env().OpenExternal(*uri, func(ok bool) {
				var did string
				did = "Did"
				if !ok {
					did = did  +  " not"
				}
				vsc.Window().ShowInformationMessage1(strFmt("{0} succeed in opening `{1}`, bye now!", did, *uri), nil, quit)
			})
		}
	})
}

func demo_Window_ShowQuickPick() {
	var items []QuickPickItem
	items = make([]QuickPickItem, 4)
	items[0] = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickItem)
	items[0].Label = "One"
	items[0].Description = "The first"
	items[0].Detail = "Das erste"
	items[1] = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickItem)
	items[1].Label = "Two"
	items[1].Description = "The second"
	items[1].Detail = "Das zweite"
	items[2] = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickItem)
	items[2].Label = "Three"
	items[2].Description = "The third"
	items[2].Detail = "Das dritte"
	items[3] = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickItem)
	items[3].Label = "Four"
	items[3].Description = "The fourth"
	items[3].Detail = "Das vierte"
	var opts QuickPickOptions
	opts = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickOptions)
	opts.IgnoreFocusOut = true
	opts.MatchOnDescription = true
	opts.MatchOnDetail = true
	opts.PlaceHolder = "You have 42 seconds before auto-cancellation!"
	opts.OnDidSelectItem = func(item QuickPickItem) any {
		vsc.Window().SetStatusBarMessage1(strFmt("Just selected: {0}", item.Label), 4242, nil)
		return nil
	}
	vsc.Window().ShowQuickPick3(items, opts, cancelIn(42), func(pickeditems []QuickPickItem) {
		statusNoticeQuit()
		if (nil == pickeditems) {
			vsc.Window().ShowWarningMessage1("Cancelled pick input, bye now!", nil, quit)
		} else {
			vsc.Window().ShowInformationMessage1(strFmt("You picked {0} item(s), bye now!", len(pickeditems)), nil, quit)
		}
	})
}

func subscribeToMiscEvents() {
	vsc.Extensions().OnDidChange(func() {
		vsc.Window().SetStatusBarMessage1("Some extension(s) were just (un)installed or (de)activated.", 4242, nil)
	}, nil)
	vsc.Window().OnDidChangeWindowState(func(evt WindowState) {
		vsc.Window().SetStatusBarMessage1(strFmt("Am I focused? {0}.", evt.Focused), 4242, nil)
	}, nil)
	vsc.Languages().OnDidChangeDiagnostics(func(evt DiagnosticChangeEvent) {
		vsc.Window().SetStatusBarMessage1(strFmt("Diag(s) changed for {0} file path(s).", len(evt.Uris)), 4242, nil)
	}, nil)
}

func statusNoticeQuit() {
	vsc.Window().SetStatusBarMessage1("Reacting to the 'bye now' WILL end the prog.", 4242, nil)
}

func demosMenu() {
	var items []string
	items = []string{"demo_Window_ShowInputBox", "demo_Commands_GetCommands_and_ExecuteCommand", "demo_Languages_GetLanguages", "demo_Env_Properties", "demo_Workspace_Properties", "demo_Window_ShowOpenDialog", "demo_Window_ShowSaveDialog", "demo_Window_ShowWorkspaceFolderPick", "demo_Env_OpenExternal", "demo_Window_ShowQuickPick"}
	var opts QuickPickOptions
	opts = */*sorryButSuchIsCodeGenSometimes...*/new(QuickPickOptions)
	opts.IgnoreFocusOut = true
	opts.PlaceHolder = "Dismissing this menu WILL end the prog."
	vsc.Window().ShowQuickPick2(items, &opts, nil, func(menuitem *string) {
		if (nil == menuitem) {
			quit(nil)
		} else {
			if "demo_Window_ShowInputBox" == (*menuitem) {
				demo_Window_ShowInputBox()
			}
			if "demo_Commands_GetCommands_and_ExecuteCommand" == (*menuitem) {
				demo_Commands_GetCommands_and_ExecuteCommand()
			}
			if "demo_Languages_GetLanguages" == (*menuitem) {
				demo_Languages_GetLanguages()
			}
			if "demo_Env_Properties" == (*menuitem) {
				demo_Env_Properties()
			}
			if "demo_Workspace_Properties" == (*menuitem) {
				demo_Workspace_Properties()
			}
			if "demo_Window_ShowOpenDialog" == (*menuitem) {
				demo_Window_ShowOpenDialog()
			}
			if "demo_Window_ShowSaveDialog" == (*menuitem) {
				demo_Window_ShowSaveDialog()
			}
			if "demo_Window_ShowWorkspaceFolderPick" == (*menuitem) {
				demo_Window_ShowWorkspaceFolderPick()
			}
			if "demo_Env_OpenExternal" == (*menuitem) {
				demo_Env_OpenExternal()
			}
			if "demo_Window_ShowQuickPick" == (*menuitem) {
				demo_Window_ShowQuickPick()
			}
		}
	})
}

