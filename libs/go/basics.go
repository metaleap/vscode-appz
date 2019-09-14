package vscAppz

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"sync"
)

// Reports problems during the ongoing forever-looping stdin/stdout communication
// with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `nil`.
//
// `err` ── if an `error`, it occurred on the Go side (I/O or JSON), else some JSON-decoded Go value from whatever was transmitted as the problem data (if anything) by VS Code.
//
// `jsonMsg` ─ if a `string`, the incoming JSON message; if a `map[string]interface{}`, the outgoing one.
var OnError func(this Vscode, err Any, jsonMsg Any)

var OnErrorDefaultOutputFormat = "err:\t%v\njson:\t%v\n\n"

// Any is a type alias of `interface{}` for legibility reasons.
type Any = interface { // just to reduce brackets-noise throughout
	// must remain an `=` type alias or json stuff will fail at runtime not compile-time.
}

type ipcMsg struct {
	QName  string         `json:"qName,omitempty"` // eg. 'window.ShowInformationMessage3'
	Data   map[string]Any `json:"data"`
	ContId string         `json:"cbId,omitempty"`
}

type impl struct {
	readln  *bufio.Scanner
	jsonOut *json.Encoder
	state   struct {
		sync.Mutex
		looping   bool
		counter   uint64
		callbacks struct {
			waiting map[string]func(Any) bool
			other   map[string]func(...Any) (Any, bool)
		}
	}
}

func init() {
	var stderr sync.Mutex
	OnError = func(_ Vscode, err Any, jsonmsg Any) {
		stderr.Lock()
		defer stderr.Unlock()
		_, _ = os.Stderr.WriteString(fmt.Sprintf(OnErrorDefaultOutputFormat, err, jsonmsg))
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
	me.state.callbacks.waiting = make(map[string]func(Any) bool, 8)
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
			var inmsg ipcMsg
			if err := json.Unmarshal([]byte(jsonmsg), &inmsg); err != nil {
				OnError(me, err, jsonmsg)
			} else if inmsg.Data == nil || len(inmsg.Data) == 0 {
				OnError(me, errors.New("field `data` is missing"), jsonmsg)
			} else {
				me.state.Lock()
				cb, fn := me.state.callbacks.waiting[inmsg.ContId], me.state.callbacks.other[inmsg.ContId]
				delete(me.state.callbacks.waiting, inmsg.ContId)
				me.state.Unlock()

				if cb != nil {
					if nay, isnay := inmsg.Data["nay"]; isnay {
						OnError(me, nay, jsonmsg)
					} else if yay, isyay := inmsg.Data["yay"]; !isyay {
						OnError(me, errors.New("field `data` must have either `yay` or `nay` member"), jsonmsg)
					} else if !cb(yay) {
						OnError(me, fmt.Errorf("unexpected args: %v", yay), jsonmsg)
					}

				} else if fn != nil {
					var args []Any
					var ret Any
					fnargs, ok := inmsg.Data[""]
					if ok {
						if args, ok = fnargs.([]Any); ok {
							ret, ok = fn(args...)
						}
					}
					outmsg := ipcMsg{ContId: inmsg.ContId, Data: make(map[string]Any, 1)}
					if ok {
						outmsg.Data["yay"] = ret
					} else {
						outmsg.Data["nay"] = "unexpected args: " + fmt.Sprintf("%v", args)
					}
					me.send(&outmsg, nil)

				} else {
					OnError(me, errors.New("specified `cbId` not known locally"), jsonmsg)
				}
			}
		}
	}
}

func (me *impl) send(msg *ipcMsg, on func(Any) bool) {
	me.state.Lock()
	var startloop bool
	if startloop = !me.state.looping; startloop {
		me.state.looping = true
	}
	if on != nil {
		msg.ContId = me.nextFuncId()
		me.state.callbacks.waiting[msg.ContId] = on
	}
	err := me.jsonOut.Encode(msg)
	me.state.Unlock()
	if err != nil {
		if msg.QName != "" {
			msg.Data[""] = msg.QName
		}
		OnError(me, err, msg.Data)
	}
	if startloop {
		me.loopReadln()
	}
}
