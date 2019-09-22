package vscAppz

// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-golang.ts via github.com/metaleap/vscode-appz/src/gen/main.ts

// Type Definition for Visual Studio Code 1.38 Extension API
// See https://code.visualstudio.com/api for more information
type Vscode interface {

	// Namespace for dealing with the current window of the editor. That is visible
	// and active editors, as well as, UI elements to show messages, selections, and
	// asking for user input.
	Window() Window
}

func (me *impl) Window() Window { return me }

// Additional metadata about the type of a diagnostic.
type DiagnosticTag int

const (
	DiagnosticTagUnnecessary DiagnosticTag = 1
	DiagnosticTagDeprecated  DiagnosticTag = 2
)

// Represents the severity of diagnostics.
type DiagnosticSeverity int

const (
	DiagnosticSeverityError       DiagnosticSeverity = 0
	DiagnosticSeverityWarning     DiagnosticSeverity = 1
	DiagnosticSeverityInformation DiagnosticSeverity = 2
	DiagnosticSeverityHint        DiagnosticSeverity = 3
)

// Options to configure the behavior of the message.
type MessageOptions struct {

	// Indicates that this message should be modal.
	Modal bool `json:"modal,omitempty"`
}

// Represents an action that is shown with an information, warning, or
// error message.
type MessageItem struct {

	// A short title like 'Retry', 'Open Log' etc.
	Title string `json:"title"`

	// A hint for modal dialogs that the item should be triggered
	// when the user cancels the dialog (e.g. by pressing the ESC
	// key).
	//
	// Note: this option is ignored for non-modal messages.
	IsCloseAffordance bool `json:"isCloseAffordance,omitempty"`

	// Free-form custom data, preserved across a roundtrip.
	My map[string]any `json:"my,omitempty"`
}

// Options to configure the behavior of the input box UI.
type InputBoxOptions struct {

	// The value to prefill in the input box.
	Value string `json:"value,omitempty"`

	// Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
	// first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
	// word will be selected, when empty (start equals end) only the cursor will be set,
	// otherwise the defined range will be selected.
	ValueSelection []int `json:"valueSelection,omitempty"`

	// The text to display underneath the input box.
	Prompt string `json:"prompt,omitempty"`

	// An optional string to show as place holder in the input box to guide the user what to type.
	PlaceHolder string `json:"placeHolder,omitempty"`

	// Set to `true` to show a password prompt that will not show the typed value.
	Password bool `json:"password,omitempty"`

	// Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.
	IgnoreFocusOut bool `json:"ignoreFocusOut,omitempty"`

	// An optional function that will be called to validate input and to give a hint
	// to the user.
	//
	// `value` ── The current value of the input box.
	//
	// `return` ── A human readable string which is presented as diagnostic message.
	// Return `undefined`, `null`, or the empty string when 'value' is valid.
	ValidateInput func(string) *string `json:"-"`

	// For internal runtime use only.
	ValidateInput_AppzFuncId string `json:"validateInput_AppzFuncId,omitempty"`
}

// Namespace for dealing with the current window of the editor. That is visible
// and active editors, as well as, UI elements to show messages, selections, and
// asking for user input.
type Window interface {

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage1(message string, items []string, andThen func(*string))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage2(message string, options MessageOptions, items []string, andThen func(*string))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage3(message string, items []MessageItem, andThen func(*MessageItem))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem))

	// Show an information message to users. Optionally provide an array of items which will be presented as
	// clickable buttons.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowInformationMessage1(message string, items []string, andThen func(*string))

	// Show an information message to users. Optionally provide an array of items which will be presented as
	// clickable buttons.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowInformationMessage2(message string, options MessageOptions, items []string, andThen func(*string))

	// Show an information message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowInformationMessage3(message string, items []MessageItem, andThen func(*MessageItem))

	// Show an information message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowInformationMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage1(message string, items []string, andThen func(*string))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage2(message string, options MessageOptions, items []string, andThen func(*string))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage3(message string, items []MessageItem, andThen func(*MessageItem))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem))

	// Opens an input box to ask the user for input.
	//
	// The returned value will be `undefined` if the input box was canceled (e.g. pressing ESC). Otherwise the
	// returned value will be the string typed by the user or an empty string if the user did not type
	// anything but dismissed the input box with OK.
	//
	// `options` ── Configures the behavior of the input box.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `andThen` ── A promise that resolves to a string the user provided or to `undefined` in case of dismissal.
	ShowInputBox(options *InputBoxOptions, andThen func(*string))
}

func (me *impl) ShowErrorMessage1(message string, items []string, andThen func(*string)) {
	msg := ipcMsg{QName: "window.showErrorMessage1", Data: make(map[string]any, 2)}
	msg.Data["message"] = message
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result string
			var resultptr *string
			if payload != nil {
				result, ok = payload.(string)
				if !ok {
					return
				} else {
					resultptr = &result
				}
			}
			andThen(resultptr)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowErrorMessage2(message string, options MessageOptions, items []string, andThen func(*string)) {
	msg := ipcMsg{QName: "window.showErrorMessage2", Data: make(map[string]any, 3)}
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result string
			var resultptr *string
			if payload != nil {
				result, ok = payload.(string)
				if !ok {
					return
				} else {
					resultptr = &result
				}
			}
			andThen(resultptr)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowErrorMessage3(message string, items []MessageItem, andThen func(*MessageItem)) {
	msg := ipcMsg{QName: "window.showErrorMessage3", Data: make(map[string]any, 2)}
	msg.Data["message"] = message
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result *MessageItem
			if payload != nil {
				result = new(MessageItem)
				ok = result.populateFrom(payload)
				if !ok {
					return
				}
			}
			andThen(result)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowErrorMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem)) {
	msg := ipcMsg{QName: "window.showErrorMessage4", Data: make(map[string]any, 3)}
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result *MessageItem
			if payload != nil {
				result = new(MessageItem)
				ok = result.populateFrom(payload)
				if !ok {
					return
				}
			}
			andThen(result)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInformationMessage1(message string, items []string, andThen func(*string)) {
	msg := ipcMsg{QName: "window.showInformationMessage1", Data: make(map[string]any, 2)}
	msg.Data["message"] = message
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result string
			var resultptr *string
			if payload != nil {
				result, ok = payload.(string)
				if !ok {
					return
				} else {
					resultptr = &result
				}
			}
			andThen(resultptr)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInformationMessage2(message string, options MessageOptions, items []string, andThen func(*string)) {
	msg := ipcMsg{QName: "window.showInformationMessage2", Data: make(map[string]any, 3)}
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result string
			var resultptr *string
			if payload != nil {
				result, ok = payload.(string)
				if !ok {
					return
				} else {
					resultptr = &result
				}
			}
			andThen(resultptr)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInformationMessage3(message string, items []MessageItem, andThen func(*MessageItem)) {
	msg := ipcMsg{QName: "window.showInformationMessage3", Data: make(map[string]any, 2)}
	msg.Data["message"] = message
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result *MessageItem
			if payload != nil {
				result = new(MessageItem)
				ok = result.populateFrom(payload)
				if !ok {
					return
				}
			}
			andThen(result)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInformationMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem)) {
	msg := ipcMsg{QName: "window.showInformationMessage4", Data: make(map[string]any, 3)}
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result *MessageItem
			if payload != nil {
				result = new(MessageItem)
				ok = result.populateFrom(payload)
				if !ok {
					return
				}
			}
			andThen(result)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowWarningMessage1(message string, items []string, andThen func(*string)) {
	msg := ipcMsg{QName: "window.showWarningMessage1", Data: make(map[string]any, 2)}
	msg.Data["message"] = message
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result string
			var resultptr *string
			if payload != nil {
				result, ok = payload.(string)
				if !ok {
					return
				} else {
					resultptr = &result
				}
			}
			andThen(resultptr)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowWarningMessage2(message string, options MessageOptions, items []string, andThen func(*string)) {
	msg := ipcMsg{QName: "window.showWarningMessage2", Data: make(map[string]any, 3)}
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result string
			var resultptr *string
			if payload != nil {
				result, ok = payload.(string)
				if !ok {
					return
				} else {
					resultptr = &result
				}
			}
			andThen(resultptr)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowWarningMessage3(message string, items []MessageItem, andThen func(*MessageItem)) {
	msg := ipcMsg{QName: "window.showWarningMessage3", Data: make(map[string]any, 2)}
	msg.Data["message"] = message
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result *MessageItem
			if payload != nil {
				result = new(MessageItem)
				ok = result.populateFrom(payload)
				if !ok {
					return
				}
			}
			andThen(result)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowWarningMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem)) {
	msg := ipcMsg{QName: "window.showWarningMessage4", Data: make(map[string]any, 3)}
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result *MessageItem
			if payload != nil {
				result = new(MessageItem)
				ok = result.populateFrom(payload)
				if !ok {
					return
				}
			}
			andThen(result)
			return true
		}
	}

	me.send(&msg, on)
}

func (me *impl) ShowInputBox(options *InputBoxOptions, andThen func(*string)) {
	msg := ipcMsg{QName: "window.showInputBox", Data: make(map[string]any, 1)}
	fnids := make([]string, 0, 1)
	me.state.Lock()
	if options != nil {
		options.ValidateInput_AppzFuncId = ""
		if fn := options.ValidateInput; fn != nil {
			options.ValidateInput_AppzFuncId = me.nextFuncId()
			fnids = append(fnids, options.ValidateInput_AppzFuncId)
			me.state.callbacks.other[options.ValidateInput_AppzFuncId] = func(args ...any) (ret any, ok bool) {
				if ok = (len(args) == 1); ok {
					var a0 string
					if args[0] != nil {
						a0, ok = args[0].(string)
						if !ok {
							return
						}
					}
					ret = fn(a0)
				}
				return
			}
		}
	}
	me.state.Unlock()
	msg.Data["options"] = options

	var on func(any) bool
	if andThen != nil {
		on = func(payload any) (ok bool) {
			var result string
			var resultptr *string
			if payload != nil {
				result, ok = payload.(string)
				if !ok {
					return
				} else {
					resultptr = &result
				}
			}
			andThen(resultptr)
			return true
		}
	}

	me.send(&msg, func(payload any) bool {
		if len(fnids) != 0 {
			me.state.Lock()
			for _, fnid := range fnids {
				delete(me.state.callbacks.other, fnid)
			}
			me.state.Unlock()
		}
		return on == nil || on(payload)
	})
}

func (me *MessageItem) populateFrom(payload any) (ok bool) {
	var m map[string]any
	if m, ok = payload.(map[string]any); ok && m != nil {
		{
			val, exists := m["title"]
			if exists {
				if val != nil {
					me.Title, ok = val.(string)
					if !ok {
						return
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
			if exists {
				if val != nil {
					me.IsCloseAffordance, ok = val.(bool)
					if !ok {
						return
					}
				} else if false {
					return false
				}
			} else if false {
				return false
			}
		}
		{
			val, exists := m["my"]
			if exists {
				if val != nil {
					me.My, ok = val.(map[string]any)
					if !ok {
						return
					}
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
