package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	. "github.com/metaleap/vscode-appz/libs/go"
)

type any = interface{}

var vsc Vscode
var win Window

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

	Main(func(vscode Vscode) {
		vsc = vscode
		win = vsc.Window()

		win.SetStatusBarMessage2("Choosing a demo WILL HIDE this")(func(statusmsg *Disposable) {
			subscribeToMiscEvents()
			win.CreateStatusBarItem(0, nil)(
				func(it *StatusBarItem) {
					println("SBI:Created")
					it.Show()(func() {
						println("SBI:Shown")
						it.Get()(func(props StatusBarItemProperties) {
							props.Text = "Foo"
							props.Tooltip = "Bar Baz"
							props.Color = "button.background"
							it.Set(props)(func() {
								it.Get()(func(props StatusBarItemProperties) {
									println(props.Color + "\t" + props.Command + "\t" + props.Text + "\t" + props.Tooltip)
								})
							})
						})
					})
				})

			buttons := []string{"Demo Pick Input", "Demo Text Input", "All Demos"}
			win.ShowInformationMessage1(
				greethow+", "+greetname+"! What to try out? (If you cancel, I quit.)", buttons)(
				func(btn *string) {
					statusmsg.Dispose()
					if btn == nil {
						quit(btn) // msgbox dismissed via close / esc key
					} else {
						switch button := *btn; button {
						case buttons[0]:
							demo_Window_ShowQuickPick()
						case buttons[1]:
							demo_Window_ShowInputBox()
						case buttons[2]:
							demosMenu()
						default:
							win.ShowErrorMessage1("Unknown: `"+button+"`, bye now!", nil)(quit)
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
			statusNoticeQuit()
			if input == nil {
				win.ShowWarningMessage1("Cancelled text input, bye now!", nil)(quit)
			} else {
				win.ShowInformationMessage1("You entered: `"+(*input)+"`, bye now!", nil)(quit)
			}
		})
}

func quit(*string) { os.Exit(0) }

func cancelIn(seconds int64) *Cancel {
	return CancelIn(time.Duration(seconds * int64(time.Second)))
}

func strFmt(s string, args ...any) string {
	for i := range args {
		s = strings.Replace(s, "{"+strconv.Itoa(i)+"}", fmt.Sprintf("%v", args[i]), -1)
	}
	return s
}
