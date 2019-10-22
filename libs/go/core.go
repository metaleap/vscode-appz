package vscAppz

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"runtime/debug"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Reports problems during the ongoing forever-looping stdin/stdout communication
// with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `nil`.
// Any of its args must be checked for `nil`-ness by your custom `OnError` handler.
//
// `err` ── if an `error`, it occurred on the Go side (I/O or JSON), else some JSON-decoded Go value from whatever was transmitted as the problem data (if anything) by VS Code.
//
// `jsonMsg` ─ if a `string`, the incoming JSON message; if a `map[string]interface{}`, the outgoing one.
var OnError func(this Vscode, err any, jsonMsg any)

var OnErrorDefaultOutputFormat = "err:\t%v\njson:\t%v\n\n"

type dict = map[string]any

// any is a type alias of `interface{}` for legibility reasons (just to reduce brackets-noise throughout).
type any = interface{}

type ipcMsg struct {
	QName string         `json:"qName,omitempty"` // eg. 'window.ShowInformationMessage3'
	Data  map[string]any `json:"data"`
	CbId  string         `json:"cbId,omitempty"`
}

type impl struct {
	readln  *bufio.Scanner
	jsonOut *json.Encoder
	main    func(Vscode)

	sync.Mutex
	counter     uint64
	cbWaiting   map[string]func(any) bool
	cbListeners map[string]func([]any) bool
	cbOther     map[string]func([]any) (any, bool)
}

func init() {
	var stderr sync.Mutex
	OnError = func(_ Vscode, err any, jsonmsg any) {
		stderr.Lock()
		defer stderr.Unlock()
		_, _ = os.Stderr.WriteString(fmt.Sprintf(OnErrorDefaultOutputFormat, err, jsonmsg))
	}
}

// Main creates a `Vscode` implementation that communicates via the specified input and output streams (with `stdIn` if `nil` defaulting to `os.Stdin`, and `stdOut` if `nil` defaulting to `os.Stdout`), then loops forever to never `return`.
//
// `main` ── called whenever the counterparty demands, which usually means once at startup.
func Main(main func(Vscode), stdIn io.Reader, stdOut io.Writer) {
	if stdIn == nil {
		stdIn = os.Stdin
	}
	if stdOut == nil {
		stdOut = os.Stdout
	}
	me := &impl{main: main, readln: bufio.NewScanner(stdIn), jsonOut: json.NewEncoder(stdOut)}
	me.readln.Buffer(make([]byte, 1024*1024), 8*1024*1024)
	me.jsonOut.SetEscapeHTML(false)
	me.jsonOut.SetIndent("", "")
	me.cbWaiting = make(map[string]func(any) bool, 8)
	me.cbListeners = make(map[string]func([]any) bool, 8)
	me.cbOther = make(map[string]func([]any) (any, bool), 8)
	me.loopReadln()
}

func (me *impl) Impl() *impl { return me }

func (me *impl) nextFuncId() string {
	me.counter++
	return strconv.FormatUint(me.counter, 36)
}

func (me *impl) nextSub(eitherListener func([]any) bool, orOther func([]any) (any, bool)) (fnId string) {
	me.Lock()
	fnId = me.nextFuncId()
	if eitherListener != nil {
		me.cbListeners[fnId] = eitherListener
	} else if orOther != nil {
		me.cbOther[fnId] = orOther
	}
	me.Unlock()
	return
}

func (me *impl) loopReadln() {
	for me.readln.Scan() {
		if jsonmsg := strings.TrimSpace(me.readln.Text()); jsonmsg != "" {
			var inmsg ipcMsg
			if err := json.Unmarshal([]byte(jsonmsg), &inmsg); err != nil {
				OnError(me, err, jsonmsg)
			} else if inmsg.QName == "main" {
				me.main(me)
			} else if inmsg.Data == nil || len(inmsg.Data) == 0 {
				OnError(me, errors.New("field `data` is missing"), jsonmsg)
			} else {

				me.Lock()
				cbprom, cbevt, cbmisc := me.cbWaiting[inmsg.CbId], me.cbListeners[inmsg.CbId], me.cbOther[inmsg.CbId]
				if cbprom != nil {
					delete(me.cbWaiting, inmsg.CbId)
				}
				me.Unlock()

				if cbprom != nil {
					if nay, isnay := inmsg.Data["nay"]; isnay {
						OnError(me, nay, jsonmsg)
					} else if yay, isyay := inmsg.Data["yay"]; !isyay {
						OnError(me, errors.New("field `data` must have either `yay` or `nay` member"), jsonmsg)
					} else if !cbprom(yay) {
						OnError(me, fmt.Errorf("unexpected args: %v", yay), jsonmsg)
					}
				} else if cbevt != nil {
					var args []any
					fnargs, ok := inmsg.Data["[]"]
					if ok {
						if args, ok = fnargs.([]any); ok {
							ok = cbevt(args)
						}
					}
					if !ok {
						OnError(me, fmt.Errorf("unexpected args: %v", fnargs), jsonmsg)
					}
				} else if cbmisc != nil {
					var args []any
					var ret any
					fnargs, ok := inmsg.Data["[]"]
					if ok {
						if args, ok = fnargs.([]any); ok {
							ret, ok = cbmisc(args)
						}
					}
					outmsg := ipcMsg{CbId: inmsg.CbId, Data: make(map[string]any, 1)}
					if ok {
						outmsg.Data["yay"] = ret
					} else {
						outmsg.Data["nay"] = fmt.Errorf("unexpected args: %v", fnargs)
					}
					me.send(&outmsg, nil)

				} else {
					OnError(me, errors.New("specified `cbId` not known locally"), jsonmsg)
				}
			}
		}
	}
}

func (me *impl) send(msg *ipcMsg, on func(any) bool) {
	me.Lock()
	if on != nil {
		msg.CbId = me.nextFuncId()
		me.cbWaiting[msg.CbId] = on
	}
	err := me.jsonOut.Encode(msg)
	me.Unlock()
	if err != nil {
		if msg.QName != "" {
			msg.Data["#"] = msg.QName
		}
		OnError(me, err, msg.Data)
	}
}

// Cancel allows belated cancellation of ongoing / already-initiated interactions.
type Cancel struct {
	impl *impl
	fnId string
}

// Now signals cancellation to the counterparty.
func (me *Cancel) Now() {
	if me.impl == nil || me.fnId == "" {
		OnError(me.impl, errors.New("vscode-appz/libs/go#Cancel.Now called before the Cancel was announced to the counterparty.\n"+string(debug.Stack())), nil)
	} else {
		me.impl.send(&ipcMsg{CbId: me.fnId}, nil)
	}
}

// CancelIn returns a new `Cancel` with its `Now` already scheduled to be called in `fromNow` duration.
func CancelIn(fromNow time.Duration) *Cancel {
	cancel := &Cancel{}
	_ = time.AfterFunc(fromNow, cancel.Now)
	return cancel
}

// Disposable represents an non-transient object identity lifetimed at the counterparty.
type Disposable struct {
	impl     *impl
	id       string
	subFnIds []string
}

func (me *Disposable) bind(impl *impl, subFnIds ...string) *Disposable {
	me.impl, me.subFnIds = impl, subFnIds
	return me
}

func (me *Disposable) populateFrom(payload any) (ok bool) {
	me.id, ok = payload.(string)
	return ok && me.id != ""
}

// Dispose signals to the counterparty to destroy the object.
func (me Disposable) Dispose() func(func()) {
	var ondone func()
	me.impl.send(&ipcMsg{QName: "dispose", Data: dict{"": me.id}}, func(any) bool {
		if ondone != nil {
			ondone()
		}
		return true
	})
	if len(me.subFnIds) > 0 {
		me.impl.Lock()
		for _, subfnid := range me.subFnIds {
			delete(me.impl.cbListeners, subfnid)
			delete(me.impl.cbOther, subfnid)
		}
		me.impl.Unlock()
		me.subFnIds = nil
	}
	return func(on func()) { ondone = on }
}

type Event string

func (me *Event) populateFrom(payload any) (ok bool) { return }
