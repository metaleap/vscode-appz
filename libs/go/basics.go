package vscAppz

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"sync"
)

// Called on every `error` during the forever-looping stdin/stdout communication with the `vscode-appz` VSC extension.
// Defaults to a stderr println. Must not be set to `nil` (if so desired, set to a no-op func instead).
//
// `vsc` ── the `Vscode` having caught the error
//
// `err` ── if an `error`, it occurred on the Go side, else something reported by the counterparty (decoded JSON value).
//
// `jsonMsg` ─ if a `string`, the incoming JSON message; if a `map[string]interface{}` the outgoing one.
var OnError func(vsc Vscode, err Any, jsonMsg Any)

// Any is a type alias of `interface{}` for legibility reasons.
type Any = interface{} // must remain an `=` type alias or json stuff will fail at runtime not compile-time. just to reduce brackets-noise throughout

type msgToVsc struct {
	Ns      string         `json:"ns,omitempty"`   // eg. 'window'
	Name    string         `json:"name,omitempty"` // eg. 'ShowInformationMessage3'
	Payload map[string]Any `json:"payload,omitempty"`
	AndThen string         `json:"andThen,omitempty"`
}

type msgFromVsc struct {
	AndThen string `json:"andThen"`
	Payload Any    `json:"payload"`
	Failed  bool   `json:"failed"`
}

type impl struct {
	readln  *bufio.Scanner
	jsonOut *json.Encoder
	state   struct {
		sync.Mutex
		looping   bool
		counter   uint64
		callbacks struct {
			waiting map[string]func(Any)
			other   map[string]func(...Any) (Any, bool)
		}
	}
}

func init() {
	var stderr sync.Mutex
	OnError = func(_ Vscode, err Any, jsonmsg Any) {
		stderr.Lock()
		defer stderr.Unlock()
		_, _ = os.Stderr.WriteString(fmt.Sprintf("%v ── %v\n", err, jsonmsg))
	}
}

// Vsc returns a `Vscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `os.Stdin` and `stdOut` defaulting to `os.Stdout`). Communication only begins its forever loop upon the first method invocation (which consequently never `return`s) on any of the `interface`s offered by the returned `Vscode`'s members.
func Vsc(stdIn io.Reader, stdOut io.Writer) Vscode {
	if stdIn == nil {
		stdIn = os.Stdin
	}
	if stdOut == nil {
		stdOut = os.Stdout
	}
	me := &impl{readln: bufio.NewScanner(stdIn), jsonOut: json.NewEncoder(stdOut)}
	me.readln.Buffer(make([]byte, 1024*1024), 8*1024*1024)
	me.jsonOut.SetEscapeHTML(false)
	me.jsonOut.SetIndent("", "")
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
			if err := json.Unmarshal([]byte(jsonmsg), &msg); err != nil {
				OnError(me, err, jsonmsg)
			} else {
				me.state.Lock()
				cb, fn := me.state.callbacks.waiting[msg.AndThen], me.state.callbacks.other[msg.AndThen]
				delete(me.state.callbacks.waiting, msg.AndThen)
				me.state.Unlock()
				if cb != nil {
					if !msg.Failed {
						cb(msg.Payload)
					} else {
						OnError(me, msg.Payload, jsonmsg)
					}
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
	err := me.jsonOut.Encode(msg)
	me.state.Unlock()
	if err != nil {
		OnError(me, err, msg.Payload)
	}
	if startloop {
		me.loopReadln()
	}
}
