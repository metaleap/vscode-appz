package main

import (
	"os"
	"strconv"
	"strings"
	"time"

	. "github.com/metaleap/vscode-appz/libs/go"
)

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

	win = Vsc(nil, nil).Window()
	win.SetStatusBarMessage2("Choosing a demo WILL HIDE this", func(statusitem *Disposable) {
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
						demoInputPick()
					case buttons[1]:
						demoInputText()
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
		"Demo Pick Input",
		"Demo Text Input",
		"Demo File-Save Dialog",
		"Demo File-Open Dialog",
		"Demo Workspace-Folder Pick Input",
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
					demoInputPick()
				case menu[1]:
					demoInputText()
				case menu[2]:
					demoDialogFileSave()
				case menu[3]:
					demoDialogFileOpen()
				case menu[4]:
					demoWorkspaceFolderPick()
				default:
					win.ShowErrorMessage1("Unknown: `"+menuitem+"`, bye now!", nil, quit)
				}
			}
		},
	)
}

func demoInputPick() {
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

func demoInputText() {
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

func demoDialogFileSave() {
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

func demoDialogFileOpen() {
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

func demoWorkspaceFolderPick() {
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

func statusNoticeQuit() {
	win.SetStatusBarMessage1("Reacting to the 'bye now' will terminate the prog.", 4242, nil)
}
