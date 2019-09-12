package main

import (
	"os"
	"strings"

	vsc "github.com/metaleap/vscode-appz/libs/go"
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

	vscwin := vsc.Via(nil, nil).Window()

	vscwin.ShowInformationMessage1(greethow+", "+greetname+"! Pick or input?", []string{
		"Show Quick Pick...",
		"Show Input Box...",
	}, func(button string) {
		switch button {
		case "Show Quick Pick...":
			vscwin.ShowWarningMessage1("Not yet implemented: `"+button+"`", nil, nil)
		case "Show Input Box...":
			vscwin.ShowInputBox(&vsc.InputBoxOptions{
				IgnoreFocusOut: true,
				ValidateInput: func(input string) (complaint string) {
					input = strings.ToLower(input)
					if strings.Contains(input, "foo") || strings.Contains(input, "f0o") || strings.Contains(input, "fo0") || strings.Contains(input, "f00") {
						return "Contains something looking like `foo`."
					}
					return ""
				},
				Prompt: "Enter anything containing nothing looking like `foo` (it would be rejected by my real-time ValidateInput func)",
			}, func(input string) {
				if input == "" {
					vscwin.ShowInformationMessage1("You abandoned the input box.", nil, nil)
				} else {
					vscwin.ShowInformationMessage1("You entered: `"+input+"`", nil, nil)
				}
			})
		default:
			vscwin.ShowErrorMessage1("Unknown: `"+button+"`", nil, nil)
		}
	})
}
