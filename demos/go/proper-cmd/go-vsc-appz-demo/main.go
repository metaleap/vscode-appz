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

		win.SetStatusBarMessage("React to the Welcome msg-box to remove me..", 12345)(func(statusmsg *Disposable) {
			buttons := []string{"Demo Text Input", "All Demos"}
			win.ShowInformationMessage(
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
							win.ShowErrorMessage("Unknown: `"+button+"`", nil)(demosmenu)
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
				win.ShowWarningMessage("Drat! Was itching to hear that.", nil)(demosmenu)
			} else {
				win.ShowInformationMessage("You entered: `"+(*input)+"`, merci!", nil)(demosmenu)
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

func quickPickItemsFrom(items []string) (ret []QuickPickItem) {
	ret = make([]QuickPickItem, len(items))
	for i, s := range items {
		ret[i].Label = s
	}
	return
}
