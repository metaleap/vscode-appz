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

var OnError func(impl Protocol, jsonMsgIncoming string, err error)

type impl struct {
	readln       *bufio.Scanner
	counterparty *json.Encoder
	callbacks    struct {
		sync.Mutex
		looping bool
		counter uint64
		waiting map[uint64]func(interface{}, bool)
	}
}

type msgOutgoing struct {
	Ns       string                 `json:"ns"`   // eg. 'window'
	Name     string                 `json:"name"` // eg. 'ShowInformationMessage3'
	Payload  map[string]interface{} `json:"payload"`
	Callback string                 `json:"callback"`
}

type msgIncoming struct {
	Callback string      `json:"andThen"`
	Payload  interface{} `json:"payload"`
	IsFail   bool        `json:"isFail"`
}

func Via(stdin io.Reader, stdout io.Writer) Protocol {
	if stdin == nil {
		stdin = os.Stdin
	}
	if stdout == nil {
		stdout = os.Stdout
	}
	me := &impl{readln: bufio.NewScanner(stdin), counterparty: json.NewEncoder(stdout)}
	me.counterparty.SetEscapeHTML(false)
	me.counterparty.SetIndent("", "")
	me.callbacks.waiting = make(map[uint64]func(interface{}, bool))
	me.readln.Buffer(make([]byte, 1024*1024), 8*1024*1024)
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
						go cb(msg.Payload, msg.IsFail)
					}
				}
			}
			if err != nil {
				if OnError == nil {
					println(err.Error() + ", jsonMsgIncoming:" + jsonmsg)
				} else {
					OnError(me, jsonmsg, err)
				}
			}
		}
	}
}

func (me *impl) send(msg *msgOutgoing, on func(interface{}, bool)) error {
	me.callbacks.Lock()
	defer me.callbacks.Unlock()

	if !me.callbacks.looping {
		me.callbacks.looping = true
		go me.loop()
	}

	if on != nil {
		me.callbacks.counter++
		msg.Callback = strconv.FormatUint(me.callbacks.counter, 36)
		me.callbacks.waiting[me.callbacks.counter] = on
	}

	return me.counterparty.Encode(msg)
}
