package main

import (
	"os"

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
	vscwin.ShowInformationMessage1(greethow+", "+greetname+"!", []string{"btn1", "btn2"},
		func(pick string) {
			if pick == "btn1" || pick == "btn2" {
				vscwin.ShowInformationMessage1("You picked: "+pick, nil, nil)
			} else {
				vscwin.ShowErrorMessage1("Unknown: "+pick, nil, nil)
			}
		},
	)
}
