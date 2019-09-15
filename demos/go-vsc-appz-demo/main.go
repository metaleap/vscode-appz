package main

import (
	"os"
	"strings"

	. "github.com/metaleap/vscode-appz/libs/go"
)

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

	win := Vsc(nil, nil).Window()
	exit := func(_unused *string) { os.Exit(0) }

	buttons := []string{"Show Quick Pick...", "Show Input Box..."}
	win.ShowInformationMessage1(greethow+", "+greetname+"! What to try out?",
		buttons, func(button *string) {
			if button == nil { // msgbox dismissed via close / esc key
				exit(button)
				return
			}
			switch button := *button; button {
			case buttons[0]:
				win.ShowWarningMessage1("Not yet implemented: `"+button+"`", nil, exit)

			case buttons[1]:
				win.ShowInputBox(&InputBoxOptions{
					IgnoreFocusOut: true,
					Prompt:         "Enter anything containing nothing looking like `foo` (it would be rejected by my real-time ValidateInput func)",
					ValidateInput: func(input string) (complaint *string) {
						if input = strings.ToLower(input); strings.Contains(input, "foo") || strings.Contains(input, "f0o") || strings.Contains(input, "fo0") || strings.Contains(input, "f00") {
							var msg = "Contains something looking like `foo`."
							complaint = &msg
						}
						return
					},
				}, func(input *string) {
					if input == nil {
						win.ShowInformationMessage1("You cancelled, bye now!", nil, exit)
					} else {
						win.ShowInformationMessage1("You entered: `"+(*input)+"`, bye now!", nil, exit)
					}
				})

			default:
				if cancelled := (button == ""); cancelled {
					exit(nil)
				} else {
					win.ShowErrorMessage1("Unknown: `"+button+"`", nil, exit)
				}
			}
		})
}
