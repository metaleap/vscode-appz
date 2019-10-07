# vscAppz
--
    import "github.com/metaleap/vscode-appz/libs/go"


## Usage

```go
var OnError func(this Vscode, err any, jsonMsg any)
```
Reports problems during the ongoing forever-looping stdin/stdout communication
with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be
`nil`. Any of its args must be checked for `nil`-ness by the `OnError` handler.

`err` ── if an `error`, it occurred on the Go side (I/O or JSON), else some
JSON-decoded Go value from whatever was transmitted as the problem data (if
anything) by VS Code.

`jsonMsg` ─ if a `string`, the incoming JSON message; if a
`map[string]interface{}`, the outgoing one.

```go
var OnErrorDefaultOutputFormat = "err:\t%v\njson:\t%v\n\n"
```

#### type Cancel

```go
type Cancel struct {
}
```

Cancel allows belated cancellation of ongoing / already-initiated interactions.

#### func  CancelIn

```go
func CancelIn(fromNow time.Duration) *Cancel
```
CancelIn returns a new `Cancel` with its `Now` already scheduled to be called in
`fromNow` duration.

#### func (*Cancel) Now

```go
func (me *Cancel) Now()
```
Now signals cancellation to the counterparty.

#### type Disposable

```go
type Disposable struct {
}
```


#### func (Disposable) Dispose

```go
func (me Disposable) Dispose()
```

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
	My dict `json:"my,omitempty"`
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

#### type OpenDialogOptions

```go
type OpenDialogOptions struct {
	// A human-readable string for the open button.
	OpenLabel string `json:"openLabel,omitempty"`

	// Allow to select files, defaults to `true`.
	CanSelectFiles bool `json:"canSelectFiles,omitempty"`

	// Allow to select folders, defaults to `false`.
	CanSelectFolders bool `json:"canSelectFolders,omitempty"`

	// Allow to select many files or folders.
	CanSelectMany bool `json:"canSelectMany,omitempty"`

	// A set of file filters that are used by the dialog. Each entry is a human readable label,
	// like "TypeScript", and an array of extensions, e.g.
	// ```ts
	// {
	//  	'Images': ['png', 'jpg']
	//  	'TypeScript': ['ts', 'tsx']
	// }
	// ```
	Filters map[string][]string `json:"filters,omitempty"`
}
```

Options to configure the behaviour of a file open dialog.

* Note 1: A dialog can select files, folders, or both. This is not true for
Windows which enforces to open either files or folder, but *not both*. * Note 2:
Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
and the editor then silently adjusts the options to select files.

#### type QuickPickItem

```go
type QuickPickItem struct {
	// A human readable string which is rendered prominent.
	Label string `json:"label"`

	// A human readable string which is rendered less prominent.
	Description string `json:"description,omitempty"`

	// A human readable string which is rendered less prominent.
	Detail string `json:"detail,omitempty"`

	// Optional flag indicating if this item is picked initially.
	// (Only honored when the picker allows multiple selections.)
	Picked bool `json:"picked,omitempty"`

	// Always show this item.
	AlwaysShow bool `json:"alwaysShow,omitempty"`

	// Free-form custom data, preserved across a roundtrip.
	My dict `json:"my,omitempty"`
}
```

Represents an item that can be selected from a list of items.

#### type QuickPickOptions

```go
type QuickPickOptions struct {
	// An optional flag to include the description when filtering the picks.
	MatchOnDescription bool `json:"matchOnDescription,omitempty"`

	// An optional flag to include the detail when filtering the picks.
	MatchOnDetail bool `json:"matchOnDetail,omitempty"`

	// An optional string to show as place holder in the input box to guide the user what to pick on.
	PlaceHolder string `json:"placeHolder,omitempty"`

	// Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.
	IgnoreFocusOut bool `json:"ignoreFocusOut,omitempty"`

	// An optional flag to make the picker accept multiple selections, if true the result is an array of picks.
	CanPickMany bool `json:"canPickMany,omitempty"`

	// An optional function that is invoked whenever an item is selected.
	OnDidSelectItem func(QuickPickItem) any `json:"-"`
}
```

Options to configure the behavior of the quick pick UI.

#### type SaveDialogOptions

```go
type SaveDialogOptions struct {
	// A human-readable string for the save button.
	SaveLabel string `json:"saveLabel,omitempty"`

	// A set of file filters that are used by the dialog. Each entry is a human readable label,
	// like "TypeScript", and an array of extensions, e.g.
	// ```ts
	// {
	//  	'Images': ['png', 'jpg']
	//  	'TypeScript': ['ts', 'tsx']
	// }
	// ```
	Filters map[string][]string `json:"filters,omitempty"`
}
```

Options to configure the behaviour of a file save dialog.

#### type Vscode

```go
type Vscode interface {
	// Namespace for dealing with the current window of the editor. That is visible
	// and active editors, as well as, UI elements to show messages, selections, and
	// asking for user input.
	Window() Window
}
```

Type Definition for Visual Studio Code 1.38 Extension API See
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
	ShowInputBox(options *InputBoxOptions, token *Cancel, andThen func(*string))

	// Shows a selection list allowing multiple selections.
	//
	// `items` ── An array of strings, or a promise that resolves to an array of strings.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `andThen` ── A promise that resolves to the selected items or `undefined`.
	ShowQuickPick1(items []string, options QuickPickOptions, token *Cancel, andThen func([]string))

	// Shows a selection list.
	//
	// `items` ── An array of strings, or a promise that resolves to an array of strings.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `andThen` ── A promise that resolves to the selection or `undefined`.
	ShowQuickPick2(items []string, options *QuickPickOptions, token *Cancel, andThen func(*string))

	// Shows a selection list allowing multiple selections.
	//
	// `items` ── An array of items, or a promise that resolves to an array of items.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `andThen` ── A promise that resolves to the selected items or `undefined`.
	ShowQuickPick3(items []QuickPickItem, options QuickPickOptions, token *Cancel, andThen func([]QuickPickItem))

	// Shows a selection list.
	//
	// `items` ── An array of items, or a promise that resolves to an array of items.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `andThen` ── A promise that resolves to the selected item or `undefined`.
	ShowQuickPick4(items []QuickPickItem, options *QuickPickOptions, token *Cancel, andThen func(*QuickPickItem))

	// Set a message to the status bar. This is a short hand for the more powerful
	// status bar [items](#window.createStatusBarItem).
	//
	// `text` ── The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text).
	//
	// `hideAfterTimeout` ── Timeout in milliseconds after which the message will be disposed.
	//
	// `andThen` ── A disposable which hides the status bar message.
	SetStatusBarMessage1(text string, hideAfterTimeout int, andThen func(*Disposable))

	// Set a message to the status bar. This is a short hand for the more powerful
	// status bar [items](#window.createStatusBarItem).
	//
	// *Note* that status bar messages stack and that they must be disposed when no
	// longer used.
	//
	// `text` ── The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text).
	//
	// `andThen` ── A disposable which hides the status bar message.
	SetStatusBarMessage2(text string, andThen func(*Disposable))

	// Shows a file save dialog to the user which allows to select a file
	// for saving-purposes.
	//
	// `options` ── Options that control the dialog.
	//
	// `andThen` ── A promise that resolves to the selected resource or `undefined`.
	ShowSaveDialog(options SaveDialogOptions, andThen func(*string))

	// Shows a file open dialog to the user which allows to select a file
	// for opening-purposes.
	//
	// `options` ── Options that control the dialog.
	//
	// `andThen` ── A promise that resolves to the selected resources or `undefined`.
	ShowOpenDialog(options OpenDialogOptions, andThen func([]string))

	// Shows a selection list of [workspace folders](#workspace.workspaceFolders) to pick from.
	// Returns `undefined` if no folder is open.
	//
	// `options` ── Configures the behavior of the workspace folder list.
	//
	// `andThen` ── A promise that resolves to the workspace folder or `undefined`.
	ShowWorkspaceFolderPick(options *WorkspaceFolderPickOptions, andThen func(*WorkspaceFolder))
}
```

Namespace for dealing with the current window of the editor. That is visible and
active editors, as well as, UI elements to show messages, selections, and asking
for user input.

#### type WindowState

```go
type WindowState struct {
	// Whether the current window is focused.
	Focused bool `json:"focused"`
}
```

Represents the state of a window.

#### type WorkspaceFolder

```go
type WorkspaceFolder struct {
	// The associated uri for this workspace folder.
	//
	// *Note:* The [Uri](#Uri)-type was intentionally chosen such that future releases of the editor can support
	// workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.
	Uri string `json:"uri"`

	// The name of this workspace folder. Defaults to
	// the basename of its [uri-path](#Uri.path)
	Name string `json:"name"`

	// The ordinal number of this workspace folder.
	Index int `json:"index"`
}
```

A workspace folder is one of potentially many roots opened by the editor. All
workspace folders are equal which means there is no notion of an active or
master workspace folder.

#### type WorkspaceFolderPickOptions

```go
type WorkspaceFolderPickOptions struct {
	// An optional string to show as place holder in the input box to guide the user what to pick on.
	PlaceHolder string `json:"placeHolder,omitempty"`

	// Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.
	IgnoreFocusOut bool `json:"ignoreFocusOut,omitempty"`
}
```

Options to configure the behaviour of the [workspace folder](#WorkspaceFolder)
pick UI.
