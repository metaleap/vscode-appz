package vscode

import (
	"bufio"
	"encoding/json"
	"io"
	"os"
	"strconv"
	"strings"
	"sync"
)

type Any = interface{}

var OnError func(impl Protocol, err error, jsonMsgIncoming string)

func init() {
	var stderr sync.Mutex
	OnError = func(_ Protocol, err error, jsonmsg string) {
		if jsonmsg != "" {
			jsonmsg = ", jsonMsgIncoming:" + jsonmsg
		}
		stderr.Lock()
		println(err.Error() + jsonmsg)
		stderr.Unlock()
	}
}

type msgOutgoing struct {
	Ns       string         `json:"ns"`   // eg. 'window'
	Name     string         `json:"name"` // eg. 'ShowInformationMessage3'
	Payload  map[string]Any `json:"payload"`
	Callback string         `json:"andThen"`
}

type msgIncoming struct {
	Callback string `json:"andThen"`
	Payload  Any    `json:"payload"`
	IsFail   bool   `json:"isFail"`
}

type impl struct {
	readln       *bufio.Scanner
	counterparty *json.Encoder
	callbacks    struct {
		sync.Mutex
		looping bool
		counter uint64
		waiting map[uint64]func(Any, bool)
	}
}

func Via(stdin io.Reader, stdout io.Writer) Protocol {
	if stdin == nil {
		stdin = os.Stdin
	}
	if stdout == nil {
		stdout = os.Stdout
	}
	me := &impl{readln: bufio.NewScanner(stdin), counterparty: json.NewEncoder(stdout)}
	me.readln.Buffer(make([]byte, 1024*1024), 8*1024*1024)
	me.counterparty.SetEscapeHTML(false)
	me.counterparty.SetIndent("", "")
	me.callbacks.waiting = make(map[uint64]func(Any, bool), 8)
	return me
}

func (me *impl) loop() {
	for me.readln.Scan() {
		if jsonmsg := strings.TrimSpace(me.readln.Text()); jsonmsg != "" {
			var msg msgIncoming
			err := json.Unmarshal([]byte(jsonmsg), &msg)
			if err == nil {
				var callbackid uint64
				if callbackid, err = strconv.ParseUint(msg.Callback, 0, 64); err == nil {
					me.callbacks.Lock()
					cb := me.callbacks.waiting[callbackid]
					delete(me.callbacks.waiting, callbackid)
					me.callbacks.Unlock()
					if cb != nil {
						cb(msg.Payload, msg.IsFail)
					}
				}
			}
			if err != nil {
				OnError(me, err, jsonmsg)
			}
		}
	}
}

func (me *impl) send(msg *msgOutgoing, on func(Any, bool)) {
	me.callbacks.Lock()
	var startloop bool
	if startloop = !me.callbacks.looping; startloop {
		me.callbacks.looping = true
	}
	if on != nil {
		me.callbacks.counter++
		msg.Callback = strconv.FormatUint(me.callbacks.counter, 36)
		me.callbacks.waiting[me.callbacks.counter] = on
	}
	me.callbacks.Unlock()

	err := me.counterparty.Encode(msg)
	if err != nil {
		OnError(me, err, "")
	}
	if startloop {
		me.loop()
	}
}
