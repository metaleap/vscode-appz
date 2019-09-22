package vscAppz
// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-golang.ts via github.com/metaleap/vscode-appz/src/gen/main.ts

// Additional metadata about the type of a diagnostic.
type DiagnosticTag int
const (
	// Unused or unnecessary code.
	// 
	// Diagnostics with this tag are rendered faded out. The amount of fading
	// is controlled by the `"editorUnnecessaryCode.opacity"` theme color. For
	// example, `"editorUnnecessaryCode.opacity": "#000000c0"` will render the
	// code with 75% opacity. For high contrast themes, use the
	// `"editorUnnecessaryCode.border"` theme color to underline unnecessary code
	// instead of fading it out.
	DiagnosticTagUnnecessary DiagnosticTag = 1

	// Deprecated or obsolete code.
	// 
	// Diagnostics with this tag are rendered with a strike through.
	DiagnosticTagDeprecated DiagnosticTag = 2
)

// Represents the severity of diagnostics.
type DiagnosticSeverity int
const (
	// Something not allowed by the rules of a language or other means.
	DiagnosticSeverityError DiagnosticSeverity = 0

	// Something suspicious but allowed.
	DiagnosticSeverityWarning DiagnosticSeverity = 1

	// Something to inform about but not a problem.
	DiagnosticSeverityInformation DiagnosticSeverity = 2

	// Something to hint to a better way of doing it, like proposing
	// a refactoring.
	DiagnosticSeverityHint DiagnosticSeverity = 3
)

// Type Definition for Visual Studio Code 1.38 Extension API
// See https://code.visualstudio.com/api for more information
type Vscode interface {
	// Namespace for dealing with the current window of the editor. That is visible
	// and active editors, as well as, UI elements to show messages, selections, and
	// asking for user input.
	Window() Window
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
	My dict `json:"my,omitempty"`
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

func (me *impl) Window() Window {
	return me
}

func (me *impl) ShowErrorMessage1(message string, items []string, andThen func(*string)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showErrorMessage1"
	msg.Data = make(dict, 2)
	msg.Data["message"] = message
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *string
			if ((nil != payload)) {
				[result,ok] = (payload is string) ? (((string)(payload)), true) : (default, false)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowErrorMessage2(message string, options MessageOptions, items []string, andThen func(*string)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showErrorMessage2"
	msg.Data = make(dict, 3)
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *string
			if ((nil != payload)) {
				[result,ok] = (payload is string) ? (((string)(payload)), true) : (default, false)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowErrorMessage3(message string, items []MessageItem, andThen func(*MessageItem)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showErrorMessage3"
	msg.Data = make(dict, 2)
	msg.Data["message"] = message
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *MessageItem
			if ((nil != payload)) {
				result = new(*MessageItem)
				ok = result.populateFrom(payload)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowErrorMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showErrorMessage4"
	msg.Data = make(dict, 3)
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *MessageItem
			if ((nil != payload)) {
				result = new(*MessageItem)
				ok = result.populateFrom(payload)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowInformationMessage1(message string, items []string, andThen func(*string)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showInformationMessage1"
	msg.Data = make(dict, 2)
	msg.Data["message"] = message
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *string
			if ((nil != payload)) {
				[result,ok] = (payload is string) ? (((string)(payload)), true) : (default, false)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowInformationMessage2(message string, options MessageOptions, items []string, andThen func(*string)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showInformationMessage2"
	msg.Data = make(dict, 3)
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *string
			if ((nil != payload)) {
				[result,ok] = (payload is string) ? (((string)(payload)), true) : (default, false)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowInformationMessage3(message string, items []MessageItem, andThen func(*MessageItem)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showInformationMessage3"
	msg.Data = make(dict, 2)
	msg.Data["message"] = message
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *MessageItem
			if ((nil != payload)) {
				result = new(*MessageItem)
				ok = result.populateFrom(payload)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowInformationMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showInformationMessage4"
	msg.Data = make(dict, 3)
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *MessageItem
			if ((nil != payload)) {
				result = new(*MessageItem)
				ok = result.populateFrom(payload)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowWarningMessage1(message string, items []string, andThen func(*string)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showWarningMessage1"
	msg.Data = make(dict, 2)
	msg.Data["message"] = message
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *string
			if ((nil != payload)) {
				[result,ok] = (payload is string) ? (((string)(payload)), true) : (default, false)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowWarningMessage2(message string, options MessageOptions, items []string, andThen func(*string)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showWarningMessage2"
	msg.Data = make(dict, 3)
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *string
			if ((nil != payload)) {
				[result,ok] = (payload is string) ? (((string)(payload)), true) : (default, false)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowWarningMessage3(message string, items []MessageItem, andThen func(*MessageItem)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showWarningMessage3"
	msg.Data = make(dict, 2)
	msg.Data["message"] = message
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *MessageItem
			if ((nil != payload)) {
				result = new(*MessageItem)
				ok = result.populateFrom(payload)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowWarningMessage4(message string, options MessageOptions, items []MessageItem, andThen func(*MessageItem)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showWarningMessage4"
	msg.Data = make(dict, 3)
	msg.Data["message"] = message
	msg.Data["options"] = options
	msg.Data["items"] = items
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *MessageItem
			if ((nil != payload)) {
				result = new(*MessageItem)
				ok = result.populateFrom(payload)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, on)
}

func (me *impl) ShowInputBox(options *InputBoxOptions, andThen func(*string)) {
	var msg ipcMsg
	msg = new(ipcMsg)
	msg.QName = "window.showInputBox"
	msg.Data = make(dict, 1)
	var fnids []string
	fnids = make([]string, 0, 1)
	lock (me) {
		if ((nil != options)) {
			options.ValidateInput_AppzFuncId = ""
			var fn func(string) *string
			fn = options.ValidateInput
			if ((nil != fn)) {
				options.ValidateInput_AppzFuncId = me.nextFuncId()
				fnids = append(fnids, options.ValidateInput_AppzFuncId)
				me.cbOther[options.ValidateInput_AppzFuncId] = func(args []any) []any{
					if ((1 != len(args))) {
						return [null,false]
					} else {
						var ok bool
						var __0 string
						if ((nil != args[0])) {
							[__0,ok] = (args[0] is string) ? (((string)(args[0])), true) : (default, false)
							if ((!ok)) {
								return [null,false]
							}
						}
						return [fn(__0),true]
					}					
				}
			}
		}
	}
	msg.Data["options"] = options
	var on func(any) bool
	if ((nil != andThen)) {
		on = func(payload any) bool{
			var ok bool
			var result *string
			if ((nil != payload)) {
				[result,ok] = (payload is string) ? (((string)(payload)), true) : (default, false)
				if ((!ok)) {
					return false
				}
			}
			andThen(result)
			return true
		}
	}
	me.send(msg, func(payload any) bool{
		if ((len(fnids) != 0)) {
			lock (me) {
				foreach (var fnid in fnids) {
					delete(me.cbOther, fnid)
				}
			}
		}
		return ((nil == on) || on(payload))
	})
}

func (me *MessageItem) populateFrom(payload any) bool {
	var it dict
	var ok bool
	var val any
	[it,ok] = (payload is dict) ? (((dict)(payload)), true) : (default, false)
	if ((!ok)) {
		return false
	}
	[val,ok] = it["title"]
	if (ok) {
		var title string
		[title,ok] = (val is string) ? (((string)(val)), true) : (default, false)
		if ((!ok)) {
			return false
		}
		me.Title = title
	} else {
		return false
	}	
	[val,ok] = it["isCloseAffordance"]
	if (ok) {
		var isCloseAffordance bool
		[isCloseAffordance,ok] = (val is bool) ? (((bool)(val)), true) : (default, false)
		if ((!ok)) {
			return false
		}
		me.IsCloseAffordance = isCloseAffordance
	}
	[val,ok] = it["my"]
	if (ok) {
		var my dict
		[my,ok] = (null == val) ? (default, true) : (val is dict) ? (((dict)(val)), true) : (default, false)
		if ((!ok)) {
			return false
		}
		me.My = my
	}
	return true
}

