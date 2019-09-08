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

type msgToVsc struct {
	Ns      string         `json:"ns"`   // eg. 'window'
	Name    string         `json:"name"` // eg. 'ShowInformationMessage3'
	Payload map[string]Any `json:"payload"`
	AndThen string         `json:"andThen"`
}

type msgFromVsc struct {
	AndThen string `json:"andThen"`
	Payload Any    `json:"payload"`
	Failed  bool   `json:"failed"`
}

type impl struct {
	readln       *bufio.Scanner
	counterparty *json.Encoder
	state        struct {
		sync.Mutex
		looping   bool
		counter   uint64
		callbacks struct {
			waiting map[string]func(Any)
			other   map[string]func(...Any) (Any, bool)
		}
	}
}

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
	me.state.callbacks.waiting = make(map[string]func(Any), 8)
	me.state.callbacks.other = make(map[string]func(...Any) (Any, bool), 8)
	return me
}

func (me *impl) nextFuncId() string {
	me.state.counter++
	return strconv.FormatUint(me.state.counter, 36)
}

func (me *impl) loopReadln() {
	for me.readln.Scan() {
		if jsonmsg := strings.TrimSpace(me.readln.Text()); jsonmsg != "" {
			var msg msgFromVsc
			err := json.Unmarshal([]byte(jsonmsg), &msg)
			if err == nil {
				me.state.Lock()
				cb, fn := me.state.callbacks.waiting[msg.AndThen], me.state.callbacks.other[msg.AndThen]
				delete(me.state.callbacks.waiting, msg.AndThen)
				delete(me.state.callbacks.other, msg.AndThen)
				me.state.Unlock()
				if cb != nil && !msg.Failed {
					cb(msg.Payload)
				} else if fn != nil {
					args, ok := msg.Payload.([]Any)
					if !ok {
						args = []Any{msg.Payload}
					}
					ret, ok := fn(args...)
					me.send(&msgToVsc{
						AndThen: msg.AndThen,
						Payload: map[string]Any{
							"ret": ret,
							"ok":  ok,
						},
					}, nil)
				}
			}
			if err != nil && OnError != nil {
				OnError(me, err, jsonmsg)
			}
		}
	}
}

func (me *impl) send(msg *msgToVsc, on func(Any)) {
	me.state.Lock()
	var startloop bool
	if startloop = !me.state.looping; startloop {
		me.state.looping = true
	}
	if on != nil {
		msg.AndThen = me.nextFuncId()
		me.state.callbacks.waiting[msg.AndThen] = on
	}
	me.state.Unlock()

	err := me.counterparty.Encode(msg)
	if err != nil && OnError != nil {
		OnError(me, err, "")
	}
	if startloop {
		me.loopReadln()
	}
}
