# vscAppz
--
    import "github.com/metaleap/vscode-appz/libs/go"


## Usage

```go
var OnError func(this Vscode, err Any, jsonMsg Any)
```
Reports problems during the ongoing forever-looping stdin/stdout communication
with the `vscode-appz` VSC extension. Defaults to a stderr println.

`err` ── if an `error`, it occurred on the Go side (I/O or JSON), else some
JSON-decoded Go value from whatever was transmitted as the problem data (if
anything) by VS Code.

`jsonMsg` ─ if a `string`, the incoming JSON message; if a
`map[string]interface{}`, the outgoing one.

```go
var OnErrorDefaultOutputFormat = "err:\t%v\njson:\t%v\n\n"
```

#### type Any

```go
type Any = interface {
}
```

Any is a type alias of `interface{}` for legibility reasons.

#### type InputBoxOptions

```go
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
	ValidateInput func(string) string `json:"-"`

	// For internal runtime use only.
	ValidateInput_AppzFuncId string `json:"validateInput_AppzFuncId,omitempty"`
}
```

Options to configure the behavior of the input box UI.

#### type MessageItem

```go
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
	My map[string]Any `json:"my,omitempty"`
}
```

Represents an action that is shown with an information, warning, or error
message.

#### type MessageOptions

```go
type MessageOptions struct {

	// Indicates that this message should be modal.
	Modal bool `json:"modal,omitempty"`
}
```

Options to configure the behavior of the message.

#### type Vscode

```go
type Vscode interface {

	// Namespace for dealing with the current window of the editor. That is visible
	// and active editors, as well as, UI elements to show messages, selections, and
	// asking for user input.
	Window() Window
}
```

Type Definition for Visual Studio Code 1.37 Extension API See
https://code.visualstudio.com/api for more information

#### func  Vsc

```go
func Vsc(stdIn io.Reader, stdOut io.Writer) Vscode
```
Vsc returns a `Vscode` implementation that communicates via the specified input
and output streams (with `stdIn` defaulting to `os.Stdin` and `stdOut`
defaulting to `os.Stdout`). Communication only begins its forever loop upon the
first method invocation (which consequently never `return`s) on any of the
`interface`s offered by the returned `Vscode`'s members.

#### type Window

```go
type Window interface {

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage1(message string, items []string, andThen func(string))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage2(message string, options MessageOptions, items []string, andThen func(string))

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
	ShowInformationMessage1(message string, items []string, andThen func(string))

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
	ShowInformationMessage2(message string, options MessageOptions, items []string, andThen func(string))

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
	ShowWarningMessage1(message string, items []string, andThen func(string))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage2(message string, options MessageOptions, items []string, andThen func(string))

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
	// `andThen` ── A promise that resolves to a string the user provided or to `undefined` in case of dismissal.
	ShowInputBox(options *InputBoxOptions, andThen func(string))
}
```

Namespace for dealing with the current window of the editor. That is visible and
active editors, as well as, UI elements to show messages, selections, and asking
for user input.
