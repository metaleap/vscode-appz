package vscode

import (
	"bufio"
	"io"
	"os"
)

type impl struct {
	readln       *bufio.Scanner
	counterparty io.Writer
}

type msgOutgoing struct {
	Ns       string                 `json:"ns"`   // eg. 'window'
	Name     string                 `json:"name"` // eg. 'ShowInformationMessage3'
	Payload  map[string]interface{} `json:"payload"`
	Callback int                    `json:"callback"`
}

type msgIncoming struct {
	Callback int           `json:"andThen"`
	Payload  []interface{} `json:"payload"`
	IsFail   bool          `json:"isFail"`
}

func Main(stdin io.Reader, stdout io.Writer) Impl {
	if stdin == nil {
		stdin = os.Stdin
	}
	if stdout == nil {
		stdout = os.Stdout
	}
	return &impl{readln: bufio.NewScanner(stdin), counterparty: stdout}
}

func (me *impl) MainLoop() {
	for me.readln.Scan() {

	}
}

func (me *impl) send(msg *msgOutgoing, on func(interface{}, bool)) {
}
