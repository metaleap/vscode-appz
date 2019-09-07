package main

import (
	vsc "github.com/metaleap/vscode-appz/libs/go"
)

func main() {
	vscwin := vsc.Via(nil, nil).Window()
	vscwin.ShowInformationMessage1("Hi World", []string{"btn1", "btn2"},
		func(pick string, failure vsc.Any) {
			if pick == "btn1" || pick == "btn2" {
				vscwin.ShowInformationMessage1("You picked: "+pick, nil, nil)
			} else {
				vscwin.ShowErrorMessage1("Unknown: "+pick, nil, nil)
			}
		},
	)
}
