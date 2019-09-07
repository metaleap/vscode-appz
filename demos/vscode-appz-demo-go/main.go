package main

import (
	"github.com/metaleap/vscode-appz/libs/go"
)

func main() {
	vswin := vscode.Via(nil, nil).Window()
	vswin.ShowInformationMessage1("Hello World", []string{"btn1", "btn2"},
		func(pick string, failure interface{}) {
			vswin.ShowInformationMessage1("You picked: "+pick, nil, nil)
		},
	)
}
