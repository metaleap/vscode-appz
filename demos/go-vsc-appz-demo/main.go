package main

import (
	"os"
	"strconv"
	"strings"
	"time"

	. "github.com/metaleap/vscode-appz/libs/go"
)

var vsc Vscode
var win Window

func quit(*string) { os.Exit(0) }

func main() {
	greethow, greetname := "Hallo", "Welt"
	if len(os.Args) > 1 {
		if os.Args[1] != "" {
			greetname = os.Args[1]
		}
		if len(os.Args) > 2 && os.Args[2] != "" {
			greethow = os.Args[2]
		}
	}

	vsc = Vsc(nil, nil)
	win = vsc.Window()
	win.SetStatusBarMessage2("Choosing a demo WILL HIDE this", func(statusitem *Disposable) {
		win.OnDidChangeWindowState(func(evt WindowState) {
			win.SetStatusBarMessage1("Am I focused? "+strconv.FormatBool(evt.Focused)+".", 2345, nil)
		}, nil)
		vsc.Extensions().OnDidChange(func() {
			win.SetStatusBarMessage1("Some extension(s) were just (un)installed or (de)activated.", 4242, nil)
		}, nil)

		buttons := []string{"Demo Pick Input", "Demo Text Input", "All Demos"}
		win.ShowInformationMessage1(
			greethow+", "+greetname+"! What to try out? (If you cancel, I quit.)",
			buttons,
			func(btn *string) {
				statusitem.Dispose()
				if btn == nil {
					quit(btn) // msgbox dismissed via close / esc key
				} else {
					switch button := *btn; button {
					case buttons[0]:
						demo_Window_ShowQuickPick()
					case buttons[1]:
						demo_Window_ShowInputBox()
					case buttons[2]:
						demoMenuAll()
					default:
						win.ShowErrorMessage1("Unknown: `"+button+"`, bye now!", nil, quit)
					}
				}
			},
		)
	})
}

func demoMenuAll() {
	menu := []string{
		"window.showQuickPick",
		"window.showInputBox",
		"window.showSaveDialog",
		"window.showOpenDialog",
		"window.showWorkspaceFolderPick",
		"env.openExternal",
		"env.Properties",
		"commands.getCommands",
		"languages.getLanguages",
	}
	win.ShowQuickPick2(menu, &QuickPickOptions{
		CanPickMany: false, IgnoreFocusOut: true, PlaceHolder: "Dismissing this menu will quit the prog.",
	}, nil,
		func(menuitem *string) {
			if menuitem == nil {
				quit(menuitem)
			} else {
				switch menuitem := *menuitem; menuitem {
				case menu[0]:
					demo_Window_ShowQuickPick()
				case menu[1]:
					demo_Window_ShowInputBox()
				case menu[2]:
					demo_Window_ShowSaveDialog()
				case menu[3]:
					demo_Window_ShowOpenDialog()
				case menu[4]:
					demo_Window_ShowWorkspaceFolderPick()
				case menu[5]:
					demo_Env_OpenExternal()
				case menu[6]:
					demo_Env_Properties()
				case menu[7]:
					demo_Commands_GetCommands()
				case menu[8]:
					demo_Languages_GetLanguages()
				default:
					win.ShowErrorMessage1("Unknown: `"+menuitem+"`, bye now!", nil, quit)
				}
			}
		},
	)
}

func demo_Window_ShowQuickPick() {
	win.ShowQuickPick3([]QuickPickItem{
		{Label: "One", Description: "The first", Detail: "Das erste"},
		{Label: "Two", Description: "The second", Detail: "Das zweite"},
		{Label: "Three", Description: "The third", Detail: "Das dritte"},
		{Label: "Four", Description: "The fourth", Detail: "Das vierte"},
	}, QuickPickOptions{
		IgnoreFocusOut: true, MatchOnDescription: true, MatchOnDetail: true,
		PlaceHolder: "You have 42 seconds before auto-cancellation!",
		OnDidSelectItem: func(item QuickPickItem) interface{} {
			println("hand-(un)picked: " + item.Label)
			return nil
		},
	}, CancelIn(42*time.Second), func(items []QuickPickItem) {
		statusNoticeQuit()
		if items == nil {
			win.ShowWarningMessage1("Cancelled pick input, bye now!", nil, quit)
		} else {
			win.ShowInformationMessage1("You picked "+strconv.Itoa(len(items))+" item(s), bye now!", nil, quit)
		}
	})
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
	}, nil, func(input *string) {
		statusNoticeQuit()
		if input == nil {
			win.ShowWarningMessage1("Cancelled text input, bye now!", nil, quit)
		} else {
			win.ShowInformationMessage1("You entered: `"+(*input)+"`, bye now!", nil, quit)
		}
	})
}

func demo_Window_ShowSaveDialog() {
	win.ShowSaveDialog(SaveDialogOptions{
		SaveLabel: "Note: won't actually write to specified file path",
		Filters:   map[string][]string{"All": {"*"}, "Dummy Filter": {"demo", "dummy"}},
	}, func(filepath *string) {
		statusNoticeQuit()
		if filepath == nil {
			win.ShowWarningMessage1("Cancelled file-save dialog, bye now!", nil, quit)
		} else {
			win.ShowInformationMessage1("File path: `"+*filepath+"`, bye now!", nil, quit)
		}
	})
}

func demo_Window_ShowOpenDialog() {
	win.ShowOpenDialog(OpenDialogOptions{
		CanSelectFiles: true, CanSelectFolders: false, CanSelectMany: true,
		OpenLabel: "Note: won't actually read from specified file path(s)",
		Filters:   map[string][]string{"All": {"*"}, "Dummy Filter": {"demo", "dummy"}},
	}, func(filepaths []string) {
		statusNoticeQuit()
		if filepaths == nil {
			win.ShowWarningMessage1("Cancelled file-save dialog, bye now!", nil, quit)
		} else {
			win.ShowInformationMessage1("Selected "+strconv.Itoa(len(filepaths))+" file path(s), bye now!", nil, quit)
		}
	})
}

func demo_Window_ShowWorkspaceFolderPick() {
	win.ShowWorkspaceFolderPick(&WorkspaceFolderPickOptions{
		IgnoreFocusOut: true, PlaceHolder: "Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side.",
	}, func(pickedfolder *WorkspaceFolder) {
		if pickedfolder == nil {
			win.ShowWarningMessage1("Cancelled pick input, bye now!", nil, quit)
		} else {
			win.ShowInformationMessage1("Selected `"+pickedfolder.Name+"` located at `"+pickedfolder.Uri+"`, bye now!", nil, quit)
		}
	})
}

func demo_Env_OpenExternal() {
	win.ShowInputBox(&InputBoxOptions{
		Value: "http://github.com/metaleap/vscode-appz", Prompt: "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol.", IgnoreFocusOut: true,
	}, nil, func(uri *string) {
		if uri == nil || *uri == "" {
			win.ShowWarningMessage1("Cancelled, bye now!", nil, quit)
		} else {
			vsc.Env().OpenExternal(*uri, func(ok bool) {
				did := "Did"
				if !ok {
					did += " not"
				}
				win.ShowInformationMessage1(did+" succeed in opening `"+*uri+"`, bye now!", nil, quit)
			})
		}
	})
}

func demo_Env_Properties() {
	vsc.Env().Properties(func(props EnvProperties) {
		win.ShowQuickPick2([]string{
			"AppName:\t" + props.AppName,
			"AppRoot:\t" + props.AppRoot,
			"Language:\t" + props.Language,
			"MachineId:\t" + props.MachineId,
			"RemoteName:\t" + props.RemoteName,
			"SessionId:\t" + props.SessionId,
			"Shell:\t\t" + props.Shell,
			"UriScheme:\t" + props.UriScheme,
		}, &QuickPickOptions{IgnoreFocusOut: true}, nil, quit)
	})
}

func demo_Commands_GetCommands() {
	vsc.Commands().GetCommands(false, func(cmds []string) {
		win.ShowQuickPick2(cmds, &QuickPickOptions{PlaceHolder: strconv.Itoa(len(cmds)) + " is quite a number!"}, nil, quit)
	})
}

func demo_Languages_GetLanguages() {
	vsc.Languages().GetLanguages(func(langs []string) {
		win.ShowQuickPick2(langs, &QuickPickOptions{PlaceHolder: strconv.Itoa(len(langs)) + " is quite a number!"}, nil, quit)
	})
}

func statusNoticeQuit() {
	win.SetStatusBarMessage1("Reacting to the 'bye now' will terminate the prog.", 4242, nil)
}
