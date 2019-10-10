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

#### type Commands

```go
type Commands interface {
	// Retrieve the list of all available commands. Commands starting an underscore are
	// treated as internal commands.
	//
	// `filterInternal` ── Set `true` to not see internal commands (starting with an underscore)
	//
	// `andThen` ── Thenable that resolves to a list of command ids.
	GetCommands(filterInternal bool, andThen func([]string))
}
```

Namespace for dealing with commands. In short, a command is a function with a
unique identifier. The function is sometimes also called _command handler_.

Commands can be added to the editor using the
[registerCommand](#commands.registerCommand) and
[registerTextEditorCommand](#commands.registerTextEditorCommand) functions.
Commands can be executed [manually](#commands.executeCommand) or from a UI
gesture. Those are:

* palette - Use the `commands`-section in `package.json` to make a command show
in the [command
palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
* keybinding - Use the `keybindings`-section in `package.json` to enable
[keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
for your extension.

Commands from other extensions and from the editor itself are accessible to an
extension. However, when invoking an editor command not all argument types are
supported.

This is a sample that registers a command handler and adds an entry for that
command to the palette. First register a command handler with the identifier
`extension.sayHello`. ```javascript
commands.registerCommand('extension.sayHello', () => {

    window.showInformationMessage('Hello World!');

}); ``` Second, bind the command identifier to a title under which it will show
in the palette (`package.json`). ```json {

    "contributes": {
    	"commands": [{
    		"command": "extension.sayHello",
    		"title": "Hello World"
    	}]
    }

} ```

#### type DiagnosticChangeEvent

```go
type DiagnosticChangeEvent struct {
	// An array of resources for which diagnostics have changed.
	Uris []string `json:"uris"`
}
```

The event that is fired when diagnostics change.

#### type Disposable

```go
type Disposable struct {
}
```

Disposable represents an non-transient object identity lifetimed at the
counterparty.

#### func (Disposable) Dispose

```go
func (me Disposable) Dispose()
```
Dispose signals to the counterparty to destroy the object.

#### type Env

```go
type Env interface {
	// Opens an *external* item, e.g. a http(s) or mailto-link, using the
	// default application.
	//
	// *Note* that [`showTextDocument`](#window.showTextDocument) is the right
	// way to open a text document inside the editor, not this function.
	//
	// `target` ── The uri that should be opened.
	//
	// `andThen` ── A promise indicating if open was successful.
	OpenExternal(target string, andThen func(bool))

	// The application name of the editor, like 'VS Code'.
	AppName(andThen func(string))

	// The application root folder from which the editor is running.
	AppRoot(andThen func(string))

	// Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.
	Language(andThen func(string))

	// A unique identifier for the computer.
	MachineId(andThen func(string))

	// The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
	// Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
	//
	// *Note* that the value is `undefined` when there is no remote extension host but that the
	// value is defined in all extension hosts (local and remote) in case a remote extension host
	// exists. Use [`Extension#extensionKind`](#Extension.extensionKind) to know if
	// a specific extension runs remote or not.
	RemoteName(andThen func(*string))

	// A unique identifier for the current session.
	// Changes each time the editor is started.
	SessionId(andThen func(string))

	// The detected default shell for the extension host, this is overridden by the
	// `terminal.integrated.shell` setting for the extension host's platform.
	Shell(andThen func(string))

	// The custom uri scheme the editor registers to in the operating system.
	UriScheme(andThen func(string))

	// Provides single-call access to numerous individual `Env` properties at once.
	Properties(andThen func(EnvProperties))
}
```

Namespace describing the environment the editor runs in.

#### type EnvProperties

```go
type EnvProperties struct {
	// The application name of the editor, like 'VS Code'.
	AppName string `json:"appName,omitempty"`

	// The application root folder from which the editor is running.
	AppRoot string `json:"appRoot,omitempty"`

	// Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.
	Language string `json:"language,omitempty"`

	// A unique identifier for the computer.
	MachineId string `json:"machineId,omitempty"`

	// The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
	// Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
	//
	// *Note* that the value is `undefined` when there is no remote extension host but that the
	// value is defined in all extension hosts (local and remote) in case a remote extension host
	// exists. Use [`Extension#extensionKind`](#Extension.extensionKind) to know if
	// a specific extension runs remote or not.
	RemoteName string `json:"remoteName,omitempty"`

	// A unique identifier for the current session.
	// Changes each time the editor is started.
	SessionId string `json:"sessionId,omitempty"`

	// The detected default shell for the extension host, this is overridden by the
	// `terminal.integrated.shell` setting for the extension host's platform.
	Shell string `json:"shell,omitempty"`

	// The custom uri scheme the editor registers to in the operating system.
	UriScheme string `json:"uriScheme,omitempty"`
}
```

Namespace describing the environment the editor runs in.

#### type Extensions

```go
type Extensions interface {
	// An event which fires when `extensions.all` changes. This can happen when extensions are
	// installed, uninstalled, enabled or disabled.
	OnDidChange(listener func(), andThen func(*Disposable))
}
```

Namespace for dealing with installed extensions. Extensions are represented by
an [extension](#Extension)-interface which enables reflection on them.

Extension writers can provide APIs to other extensions by returning their API
public surface from the `activate`-call.

```javascript export function activate(context: vscode.ExtensionContext) {

    let api = {
    	sum(a, b) {
    		return a + b;
    	},
    	mul(a, b) {
    		return a * b;
    	}
    };
    // 'export' public api-surface
    return api;

} ``` When depending on the API of another extension add an
`extensionDependency`-entry to `package.json`, and use the
[getExtension](#extensions.getExtension)-function and the
[exports](#Extension.exports)-property, like below:

```javascript let mathExt = extensions.getExtension('genius.math'); let
importedApi = mathExt.exports;

console.log(importedApi.mul(42, 1)); ```

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

#### type Languages

```go
type Languages interface {
	// Return the identifiers of all known languages.
	//
	// `andThen` ── Promise resolving to an array of identifier strings.
	GetLanguages(andThen func([]string))

	// An [event](#Event) which fires when the global set of diagnostics changes. This is
	// newly added and removed diagnostics.
	OnDidChangeDiagnostics(listener func(DiagnosticChangeEvent), andThen func(*Disposable))
}
```

Namespace for participating in language-specific editor
[features](https://code.visualstudio.com/docs/editor/editingevolved), like
IntelliSense, code actions, diagnostics etc.

Many programming languages exist and there is huge variety in syntaxes,
semantics, and paradigms. Despite that, features like automatic word-completion,
code navigation, or code checking have become popular across different tools for
different programming languages.

The editor provides an API that makes it simple to provide such common features
by having all UI and actions already in place and by allowing you to participate
by providing data only. For instance, to contribute a hover all you have to do
is provide a function that can be called with a [TextDocument](#TextDocument)
and a [Position](#Position) returning hover info. The rest, like tracking the
mouse, positioning the hover, keeping the hover stable etc. is taken care of by
the editor.

```javascript languages.registerHoverProvider('javascript', {

    provideHover(document, position, token) {
    	return new Hover('I am a hover!');
    }

}); ```

Registration is done using a [document selector](#DocumentSelector) which is
either a language id, like `javascript` or a more complex
[filter](#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`.
Matching a document against such a selector will result in a
[score](#languages.match) that is used to determine if and how a provider shall
be used. When scores are equal the provider that came last wins. For features
that allow full arity, like [hover](#languages.registerHoverProvider), the score
is only checked to be `>0`, for other features, like
[IntelliSense](#languages.registerCompletionItemProvider) the score is used for
determining the order in which providers are asked to participate.

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

	// Namespace describing the environment the editor runs in.
	Env() Env

	// Namespace for dealing with the current workspace. A workspace is the representation
	// of the folder that has been opened. There is no workspace when just a file but not a
	// folder has been opened.
	//
	// The workspace offers support for [listening](#workspace.createFileSystemWatcher) to fs
	// events and for [finding](#workspace.findFiles) files. Both perform well and run _outside_
	// the editor-process so that they should be always used instead of nodejs-equivalents.
	Workspace() Workspace

	// Namespace for participating in language-specific editor [features](https://code.visualstudio.com/docs/editor/editingevolved),
	// like IntelliSense, code actions, diagnostics etc.
	//
	// Many programming languages exist and there is huge variety in syntaxes, semantics, and paradigms. Despite that, features
	// like automatic word-completion, code navigation, or code checking have become popular across different tools for different
	// programming languages.
	//
	// The editor provides an API that makes it simple to provide such common features by having all UI and actions already in place and
	// by allowing you to participate by providing data only. For instance, to contribute a hover all you have to do is provide a function
	// that can be called with a [TextDocument](#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
	// mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
	//
	// ```javascript
	// languages.registerHoverProvider('javascript', {
	//  	provideHover(document, position, token) {
	//  		return new Hover('I am a hover!');
	//  	}
	// });
	// ```
	//
	// Registration is done using a [document selector](#DocumentSelector) which is either a language id, like `javascript` or
	// a more complex [filter](#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
	// a selector will result in a [score](#languages.match) that is used to determine if and how a provider shall be used. When
	// scores are equal the provider that came last wins. For features that allow full arity, like [hover](#languages.registerHoverProvider),
	// the score is only checked to be `>0`, for other features, like [IntelliSense](#languages.registerCompletionItemProvider) the
	// score is used for determining the order in which providers are asked to participate.
	Languages() Languages

	// Namespace for dealing with installed extensions. Extensions are represented
	// by an [extension](#Extension)-interface which enables reflection on them.
	//
	// Extension writers can provide APIs to other extensions by returning their API public
	// surface from the `activate`-call.
	//
	// ```javascript
	// export function activate(context: vscode.ExtensionContext) {
	//  	let api = {
	//  		sum(a, b) {
	//  			return a + b;
	//  		},
	//  		mul(a, b) {
	//  			return a * b;
	//  		}
	//  	};
	//  	// 'export' public api-surface
	//  	return api;
	// }
	// ```
	// When depending on the API of another extension add an `extensionDependency`-entry
	// to `package.json`, and use the [getExtension](#extensions.getExtension)-function
	// and the [exports](#Extension.exports)-property, like below:
	//
	// ```javascript
	// let mathExt = extensions.getExtension('genius.math');
	// let importedApi = mathExt.exports;
	//
	// console.log(importedApi.mul(42, 1));
	// ```
	Extensions() Extensions

	// Namespace for dealing with commands. In short, a command is a function with a
	// unique identifier. The function is sometimes also called _command handler_.
	//
	// Commands can be added to the editor using the [registerCommand](#commands.registerCommand)
	// and [registerTextEditorCommand](#commands.registerTextEditorCommand) functions. Commands
	// can be executed [manually](#commands.executeCommand) or from a UI gesture. Those are:
	//
	// * palette - Use the `commands`-section in `package.json` to make a command show in
	// the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
	// * keybinding - Use the `keybindings`-section in `package.json` to enable
	// [keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
	// for your extension.
	//
	// Commands from other extensions and from the editor itself are accessible to an extension. However,
	// when invoking an editor command not all argument types are supported.
	//
	// This is a sample that registers a command handler and adds an entry for that command to the palette. First
	// register a command handler with the identifier `extension.sayHello`.
	// ```javascript
	// commands.registerCommand('extension.sayHello', () => {
	//  	window.showInformationMessage('Hello World!');
	// });
	// ```
	// Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
	// ```json
	// {
	//  	"contributes": {
	//  		"commands": [{
	//  			"command": "extension.sayHello",
	//  			"title": "Hello World"
	//  		}]
	//  	}
	// }
	// ```
	Commands() Commands
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

	// Represents the current window's state.
	State(andThen func(WindowState))

	// An [event](#Event) which fires when the focus state of the current window
	// changes. The value of the event represents whether the window is focused.
	OnDidChangeWindowState(listener func(WindowState), andThen func(*Disposable))
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

#### type Workspace

```go
type Workspace interface {
	// The name of the workspace. `undefined` when no folder
	// has been opened.
	Name(andThen func(*string))

	// The location of the workspace file, for example:
	//
	// `file:///Users/name/Development/myProject.code-workspace`
	//
	// or
	//
	// `untitled:1555503116870`
	//
	// for a workspace that is untitled and not yet saved.
	//
	// Depending on the workspace that is opened, the value will be:
	//   * `undefined` when no workspace or  a single folder is opened
	//   * the path of the workspace file as `Uri` otherwise. if the workspace
	// is untitled, the returned URI will use the `untitled:` scheme
	//
	// The location can e.g. be used with the `vscode.openFolder` command to
	// open the workspace again after it has been closed.
	//
	// **Example:**
	// ```typescript
	// vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
	// ```
	//
	// **Note:** it is not advised to use `workspace.workspaceFile` to write
	// configuration data into the file. You can use `workspace.getConfiguration().update()`
	// for that purpose which will work both when a single folder is opened as
	// well as an untitled or saved workspace.
	WorkspaceFile(andThen func(*string))

	// Save all dirty files.
	//
	// `includeUntitled` ── Also save files that have been created during this session.
	//
	// `andThen` ── A thenable that resolves when the files have been saved.
	SaveAll(includeUntitled bool, andThen func(bool))

	// An event that is emitted when a workspace folder is added or removed.
	OnDidChangeWorkspaceFolders(listener func(WorkspaceFoldersChangeEvent), andThen func(*Disposable))

	// Provides single-call access to numerous individual `Workspace` properties at once.
	Properties(andThen func(WorkspaceProperties))
}
```

Namespace for dealing with the current workspace. A workspace is the
representation of the folder that has been opened. There is no workspace when
just a file but not a folder has been opened.

The workspace offers support for [listening](#workspace.createFileSystemWatcher)
to fs events and for [finding](#workspace.findFiles) files. Both perform well
and run _outside_ the editor-process so that they should be always used instead
of nodejs-equivalents.

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

#### type WorkspaceFoldersChangeEvent

```go
type WorkspaceFoldersChangeEvent struct {
	// Added workspace folders.
	Added []WorkspaceFolder `json:"added"`

	// Removed workspace folders.
	Removed []WorkspaceFolder `json:"removed"`
}
```

An event describing a change to the set of [workspace
folders](#workspace.workspaceFolders).

#### type WorkspaceProperties

```go
type WorkspaceProperties struct {
	// The name of the workspace. `undefined` when no folder
	// has been opened.
	Name string `json:"name,omitempty"`

	// The location of the workspace file, for example:
	//
	// `file:///Users/name/Development/myProject.code-workspace`
	//
	// or
	//
	// `untitled:1555503116870`
	//
	// for a workspace that is untitled and not yet saved.
	//
	// Depending on the workspace that is opened, the value will be:
	//   * `undefined` when no workspace or  a single folder is opened
	//   * the path of the workspace file as `Uri` otherwise. if the workspace
	// is untitled, the returned URI will use the `untitled:` scheme
	//
	// The location can e.g. be used with the `vscode.openFolder` command to
	// open the workspace again after it has been closed.
	//
	// **Example:**
	// ```typescript
	// vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
	// ```
	//
	// **Note:** it is not advised to use `workspace.workspaceFile` to write
	// configuration data into the file. You can use `workspace.getConfiguration().update()`
	// for that purpose which will work both when a single folder is opened as
	// well as an untitled or saved workspace.
	WorkspaceFile string `json:"workspaceFile,omitempty"`
}
```

Namespace for dealing with the current workspace. A workspace is the
representation of the folder that has been opened. There is no workspace when
just a file but not a folder has been opened.

The workspace offers support for [listening](#workspace.createFileSystemWatcher)
to fs events and for [finding](#workspace.findFiles) files. Both perform well
and run _outside_ the editor-process so that they should be always used instead
of nodejs-equivalents.
