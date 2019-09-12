package vscode

// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-golang.ts via github.com/metaleap/vscode-appz/src/gen/main.ts

type Protocol interface {
	Window() Window
}

func (me *impl) Window() Window { return me }

type MessageOptions struct {
	Modal bool `json:"modal,omitempty"`
}

type MessageItem struct {
	Title string `json:"title"`
	IsCloseAffordance bool `json:"isCloseAffordance,omitempty"`
	MyTag Any `json:"myTag,omitempty"`
}

type InputBoxOptions struct {
	Value string `json:"value,omitempty"`
	ValueSelection []int `json:"valueSelection,omitempty"`
	Prompt string `json:"prompt,omitempty"`
	PlaceHolder string `json:"placeHolder,omitempty"`
	Password bool `json:"password,omitempty"`
	IgnoreFocusOut bool `json:"ignoreFocusOut,omitempty"`
	ValidateInput func(string) string `json:"-"`
	ValidateInput_AppzFuncId string `json:"validateInput_AppzFuncId,omitempty"`
}

type Window interface {
	ShowErrorMessage1(message string, items []string, andThen func(string), )
	ShowErrorMessage2(message string, options MessageOptions, items []string, andThen func(string), )
	ShowErrorMessage3(message string, items []MessageItem, andThen func(MessageItem), )
	ShowErrorMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem), )
	ShowInformationMessage1(message string, items []string, andThen func(string), )
	ShowInformationMessage2(message string, options MessageOptions, items []string, andThen func(string), )
	ShowInformationMessage3(message string, items []MessageItem, andThen func(MessageItem), )
	ShowInformationMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem), )
	ShowWarningMessage1(message string, items []string, andThen func(string), )
	ShowWarningMessage2(message string, options MessageOptions, items []string, andThen func(string), )
	ShowWarningMessage3(message string, items []MessageItem, andThen func(MessageItem), )
	ShowWarningMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem), )
	ShowInputBox(options *InputBoxOptions, andThen func(string), )
}

func (me *impl) ShowErrorMessage1(message string, items []string, andThen func(string)) {
	msg := msgToVsc{Ns: "window", Name: "showErrorMessage1", Payload: make(map[string]Any, 2)}
	msg.Payload["message"] = message
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result string
			var ok bool
			result, ok = payload.(string)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowErrorMessage2(message string, options MessageOptions, items []string, andThen func(string)) {
	msg := msgToVsc{Ns: "window", Name: "showErrorMessage2", Payload: make(map[string]Any, 3)}
	msg.Payload["message"] = message
	msg.Payload["options"] = options
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result string
			var ok bool
			result, ok = payload.(string)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowErrorMessage3(message string, items []MessageItem, andThen func(MessageItem)) {
	msg := msgToVsc{Ns: "window", Name: "showErrorMessage3", Payload: make(map[string]Any, 2)}
	msg.Payload["message"] = message
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result MessageItem
			var ok bool
			ok = result.populateFrom(payload)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowErrorMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem)) {
	msg := msgToVsc{Ns: "window", Name: "showErrorMessage4", Payload: make(map[string]Any, 3)}
	msg.Payload["message"] = message
	msg.Payload["options"] = options
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result MessageItem
			var ok bool
			ok = result.populateFrom(payload)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInformationMessage1(message string, items []string, andThen func(string)) {
	msg := msgToVsc{Ns: "window", Name: "showInformationMessage1", Payload: make(map[string]Any, 2)}
	msg.Payload["message"] = message
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result string
			var ok bool
			result, ok = payload.(string)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInformationMessage2(message string, options MessageOptions, items []string, andThen func(string)) {
	msg := msgToVsc{Ns: "window", Name: "showInformationMessage2", Payload: make(map[string]Any, 3)}
	msg.Payload["message"] = message
	msg.Payload["options"] = options
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result string
			var ok bool
			result, ok = payload.(string)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInformationMessage3(message string, items []MessageItem, andThen func(MessageItem)) {
	msg := msgToVsc{Ns: "window", Name: "showInformationMessage3", Payload: make(map[string]Any, 2)}
	msg.Payload["message"] = message
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result MessageItem
			var ok bool
			ok = result.populateFrom(payload)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInformationMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem)) {
	msg := msgToVsc{Ns: "window", Name: "showInformationMessage4", Payload: make(map[string]Any, 3)}
	msg.Payload["message"] = message
	msg.Payload["options"] = options
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result MessageItem
			var ok bool
			ok = result.populateFrom(payload)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowWarningMessage1(message string, items []string, andThen func(string)) {
	msg := msgToVsc{Ns: "window", Name: "showWarningMessage1", Payload: make(map[string]Any, 2)}
	msg.Payload["message"] = message
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result string
			var ok bool
			result, ok = payload.(string)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowWarningMessage2(message string, options MessageOptions, items []string, andThen func(string)) {
	msg := msgToVsc{Ns: "window", Name: "showWarningMessage2", Payload: make(map[string]Any, 3)}
	msg.Payload["message"] = message
	msg.Payload["options"] = options
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result string
			var ok bool
			result, ok = payload.(string)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowWarningMessage3(message string, items []MessageItem, andThen func(MessageItem)) {
	msg := msgToVsc{Ns: "window", Name: "showWarningMessage3", Payload: make(map[string]Any, 2)}
	msg.Payload["message"] = message
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result MessageItem
			var ok bool
			ok = result.populateFrom(payload)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowWarningMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem)) {
	msg := msgToVsc{Ns: "window", Name: "showWarningMessage4", Payload: make(map[string]Any, 3)}
	msg.Payload["message"] = message
	msg.Payload["options"] = options
	msg.Payload["items"] = items

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result MessageItem
			var ok bool
			ok = result.populateFrom(payload)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInputBox(options *InputBoxOptions, andThen func(string)) {
	msg := msgToVsc{Ns: "window", Name: "showInputBox", Payload: make(map[string]Any, 1)}
	fnids := make([]string, 0, 1)
	me.state.Lock()
	if options != nil {
		options.ValidateInput_AppzFuncId = ""
		if fn := options.ValidateInput; fn != nil {
			options.ValidateInput_AppzFuncId = me.nextFuncId()
			fnids = append(fnids, options.ValidateInput_AppzFuncId)
			me.state.callbacks.other[options.ValidateInput_AppzFuncId] = func(args...Any) (ret Any, ok bool) {
				if ok = (len(args) == 1); ok {
					var a0 string
					a0, ok = args[0].(string)
					if !ok {
						return
					}
					ret = fn(a0)
				}
				return
			}
		}
	}
	me.state.Unlock()
	msg.Payload["options"] = options

	var on func(Any)
	if andThen != nil {
		on = func(payload Any) {
			var result string
			var ok bool
			result, ok = payload.(string)
			if !ok {
				return
			}
			andThen(result)
		}
	}

	me.send(&msg, func(payload Any) {
		if len(fnids) != 0 {
			me.state.Lock()
			for _, fnid := range fnids {
				delete(me.state.callbacks.other, fnid)
			}
			me.state.Unlock()
		}
		if on != nil {
			on(payload)
		}
	})
}

func (me *MessageItem) populateFrom(payload Any) bool {
	m, ok := payload.(map[string]Any)
	if ok && m != nil {
		{
			val, exists := m["title"]
			if (exists) {
				if val != nil {
					var ok bool
					me.Title, ok = val.(string)
					if !ok {
						return false
					}
				} else if true {
					return false
				}
			} else if true {
				return false
			}
		}
		{
			val, exists := m["isCloseAffordance"]
			if (exists) {
				if val != nil {
					var ok bool
					me.IsCloseAffordance, ok = val.(bool)
					if !ok {
						return false
					}
				} else if false {
					return false
				}
			} else if false {
				return false
			}
		}
		{
			val, exists := m["myTag"]
			if (exists) {
				if val != nil {
					me.MyTag = val
				} else if false {
					return false
				}
			} else if false {
				return false
			}
		}
		return true
	}
	return false
}

