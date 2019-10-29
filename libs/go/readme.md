# vscAppz
--
    import "github.com/metaleap/vscode-appz/libs/go"


## Usage

```go
var OnError func(this Vscode, err any, jsonMsg any)
```
Reports problems during the ongoing forever-looping stdin/stdout communication
with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be
`nil`. Any of its args must be checked for `nil`-ness by your custom `OnError`
handler.

`err` ── if an `error`, it occurred on the Go side (I/O or JSON), else some
JSON-decoded Go value from whatever was transmitted as the problem data (if
anything) by VS Code.

`jsonMsg` ─ if a `string`, the incoming JSON message; if a
`map[string]interface{}`, the outgoing one.

```go
var OnErrorDefaultOutputFormat = "err:\t%v\njson:\t%v\n\n"
```

#### func  Main

```go
func Main(main func(Vscode), stdIn io.Reader, stdOut io.Writer)
```
Main creates a `Vscode` implementation that communicates via the specified input
and output streams (with `stdIn` if `nil` defaulting to `os.Stdin`, and `stdOut`
if `nil` defaulting to `os.Stdout`), then loops forever to never `return`.

`main` ── called whenever the counterparty demands, which usually means once at
startup.

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

#### type Clipboard

```go
type Clipboard interface {
	// Read the current clipboard contents as text.
	//
	// `return` ── A thenable that resolves to a string.
	ReadText() func(func(*string))

	// Writes text into the clipboard.
	//
	// `value` ──
	//
	// `return` ── A thenable that resolves when writing happened.
	WriteText(value string) func(func())
}
```

The clipboard provides read and write access to the system's clipboard.

#### type Commands

```go
type Commands interface {
	// Registers a command that can be invoked via a keyboard shortcut,
	// a menu item, an action, or directly.
	//
	// Registering a command with an existing command identifier twice
	// will cause an error.
	//
	// `command` ── A unique identifier for the command.
	//
	// `callback` ── A command handler function.
	//
	// `return` ── Disposable which unregisters this command on disposal.
	RegisterCommand(command string, callback func([]any) any) func(func(*Disposable))

	// Executes the command denoted by the given command identifier.
	//
	// * *Note 1:* When executing an editor command not all types are allowed to
	// be passed as arguments. Allowed are the primitive types `string`, `boolean`,
	// `number`, `undefined`, and `null`, as well as [`Position`](https://code.visualstudio.com/api/references/vscode-api#Position), [`Range`](#Range), [`Uri`](#Uri) and [`Location`](#Location).
	// * *Note 2:* There are no restrictions when executing commands that have been contributed
	// by extensions.
	//
	// `command` ── Identifier of the command to execute.
	//
	// `rest` ── Parameters passed to the command function.
	//
	// `return` ── A thenable that resolves to the returned value of the given command. `undefined` when
	// the command handler function doesn't return anything.
	ExecuteCommand(command string, rest []any) func(func(any))

	// Retrieve the list of all available commands. Commands starting an underscore are
	// treated as internal commands.
	//
	// `filterInternal` ── Set `true` to not see internal commands (starting with an underscore)
	//
	// `return` ── Thenable that resolves to a list of command ids.
	GetCommands(filterInternal bool) func(func([]string))
}
```

Namespace for dealing with commands. In short, a command is a function with a
unique identifier. The function is sometimes also called _command handler_.

Commands can be added to the editor using the
[registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
and
[registerTextEditorCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerTextEditorCommand)
functions. Commands can be executed
[manually](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand)
or from a UI gesture. Those are:

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
`extension.sayHello`.

```javascript

commands.registerCommand('extension.sayHello', () => {

    window.showInformationMessage('Hello World!');

});

```

Second, bind the command identifier to a title under which it will show in the
palette (`package.json`).

```json

{

    "contributes": {
    	"commands": [{
    		"command": "extension.sayHello",
    		"title": "Hello World"
    	}]
    }

}

```

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
func (me Disposable) Dispose() func(func())
```
Dispose requests the VSC side to forget about this object and release or destroy
all resources associated with or occupied by it. All subsequent usage attempts
will be rejected.

#### type Env

```go
type Env interface {
	// Opens an *external* item, e.g. a http(s) or mailto-link, using the
	// default application.
	//
	// *Note* that [`showTextDocument`](https://code.visualstudio.com/api/references/vscode-api#window.showTextDocument) is the right
	// way to open a text document inside the editor, not this function.
	//
	// `target` ── The uri that should be opened.
	//
	// `return` ── A promise indicating if open was successful.
	OpenExternal(target string) func(func(bool))

	// The application name of the editor, like 'VS Code'.
	//
	// `return` ── a thenable that resolves when this `AppName` call has successfully completed at the VSC side and its result received back at our end.
	AppName() func(func(string))

	// The application root folder from which the editor is running.
	//
	// `return` ── a thenable that resolves when this `AppRoot` call has successfully completed at the VSC side and its result received back at our end.
	AppRoot() func(func(string))

	// Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.
	//
	// `return` ── a thenable that resolves when this `Language` call has successfully completed at the VSC side and its result received back at our end.
	Language() func(func(string))

	// A unique identifier for the computer.
	//
	// `return` ── a thenable that resolves when this `MachineId` call has successfully completed at the VSC side and its result received back at our end.
	MachineId() func(func(string))

	// The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
	// Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
	//
	// *Note* that the value is `undefined` when there is no remote extension host but that the
	// value is defined in all extension hosts (local and remote) in case a remote extension host
	// exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
	// a specific extension runs remote or not.
	//
	// `return` ── a thenable that resolves when this `RemoteName` call has successfully completed at the VSC side and its result received back at our end.
	RemoteName() func(func(*string))

	// A unique identifier for the current session.
	// Changes each time the editor is started.
	//
	// `return` ── a thenable that resolves when this `SessionId` call has successfully completed at the VSC side and its result received back at our end.
	SessionId() func(func(string))

	// The detected default shell for the extension host, this is overridden by the
	// `terminal.integrated.shell` setting for the extension host's platform.
	//
	// `return` ── a thenable that resolves when this `Shell` call has successfully completed at the VSC side and its result received back at our end.
	Shell() func(func(string))

	// The custom uri scheme the editor registers to in the operating system.
	//
	// `return` ── a thenable that resolves when this `UriScheme` call has successfully completed at the VSC side and its result received back at our end.
	UriScheme() func(func(string))

	// Provides single-call access to numerous individual `Env` properties at once.
	//
	// `return` ── a thenable that resolves when this `AllProperties` call has successfully completed at the VSC side and its `EnvState` result received back at our end.
	AllProperties() func(func(EnvState))

	// The clipboard provides read and write access to the system's clipboard.
	Clipboard() Clipboard
}
```

Namespace describing the environment the editor runs in.

#### type EnvState

```go
type EnvState struct {
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
	// exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
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

EnvState gathers various properties of `Env`, obtainable via its `AllProperties`
method.

#### type Extensions

```go
type Extensions interface {
	// An event which fires when `extensions.all` changes. This can happen when extensions are
	// installed, uninstalled, enabled or disabled.
	//
	// `listener` ── will be invoked whenever the `OnDidChange` event fires (mandatory, not optional).
	//
	// `return` ── A `Disposable` that will unsubscribe `listener` from the `OnDidChange` event on `Dispose`.
	OnDidChange(listener func()) func(func(*Disposable))
}
```

Namespace for dealing with installed extensions. Extensions are represented by
an
[extension](https://code.visualstudio.com/api/references/vscode-api#Extension)-interface
which enables reflection on them.

Extension writers can provide APIs to other extensions by returning their API
public surface from the `activate`-call.

```javascript

export function activate(context: vscode.ExtensionContext) {

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

}

```

When depending on the API of another extension add an
`extensionDependency`-entry to `package.json`, and use the
[getExtension](https://code.visualstudio.com/api/references/vscode-api#extensions.getExtension)-function
and the
[exports](https://code.visualstudio.com/api/references/vscode-api#Extension.exports)-property,
like below:

```javascript

let mathExt = extensions.getExtension('genius.math'); let importedApi =
mathExt.exports;

console.log(importedApi.mul(42, 1));

```

#### type FileSystemWatcher

```go
type FileSystemWatcher struct {

	// Cfg represents this `FileSystemWatcher`'s current state. All its members get auto-refreshed every time a (subscribed) `FileSystemWatcher` event fires or any `FileSystemWatcher` method call (other than `Dispose`) resolves, but can also be manually refreshed via its `ReFetch` method. Your local modifications to its members will **not** be auto-propagated to VSC, this must be done explicitly via its `ApplyChanges` method.
	Cfg *FileSystemWatcherState
}
```

A file system watcher notifies about changes to files and folders on disk.

To get an instance of a `FileSystemWatcher` use
[createFileSystemWatcher](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher).

#### func (*FileSystemWatcher) Dispose

```go
func (me *FileSystemWatcher) Dispose() func(func())
```
Dispose requests the VSC side to forget about this object and release or destroy
all resources associated with or occupied by it. All subsequent usage attempts
will be rejected.

`return` ── a thenable that resolves when this `Dispose` call has successfully
completed at the VSC side.

#### func (*FileSystemWatcher) OnDidChange

```go
func (me *FileSystemWatcher) OnDidChange(handler func(string)) func(func(*Disposable))
```
An event which fires on file/folder change.

`handler` ── will be invoked whenever the `OnDidChange` event fires (mandatory,
not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChange` event on `Dispose`.

#### func (*FileSystemWatcher) OnDidCreate

```go
func (me *FileSystemWatcher) OnDidCreate(handler func(string)) func(func(*Disposable))
```
An event which fires on file/folder creation.

`handler` ── will be invoked whenever the `OnDidCreate` event fires (mandatory,
not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidCreate` event on `Dispose`.

#### func (*FileSystemWatcher) OnDidDelete

```go
func (me *FileSystemWatcher) OnDidDelete(handler func(string)) func(func(*Disposable))
```
An event which fires on file/folder deletion.

`handler` ── will be invoked whenever the `OnDidDelete` event fires (mandatory,
not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidDelete` event on `Dispose`.

#### type FileSystemWatcherState

```go
type FileSystemWatcherState struct {

	// true if this file system watcher has been created such that
	// it ignores creation file system events.
	IgnoreCreateEvents bool `json:"ignoreCreateEvents"`

	// true if this file system watcher has been created such that
	// it ignores change file system events.
	IgnoreChangeEvents bool `json:"ignoreChangeEvents"`

	// true if this file system watcher has been created such that
	// it ignores delete file system events.
	IgnoreDeleteEvents bool `json:"ignoreDeleteEvents"`
}
```

FileSystemWatcherState (to be accessed only via `FileSystemWatcher.Cfg`) is a
snapshot of `FileSystemWatcher` state. It is auto-updated whenever
`FileSystemWatcher` creations and method calls resolve or its event subscribers
(if any) are invoked. Changes to any non-read-only properties (ie.
non-function-valued fields) must be explicitly propagated to the VSC side via
the `ApplyChanges` method.

#### func (*FileSystemWatcherState) ApplyChanges

```go
func (me *FileSystemWatcherState) ApplyChanges() func(func())
```
ApplyChanges propagates this `FileSystemWatcherState`'s current property values
for `ignoreCreateEvents`, `ignoreChangeEvents`, `ignoreDeleteEvents` to the VSC
side to immediately become active there. Note that **all** those property values
are transmitted, no omissions.

`return` ── a thenable that resolves when this `ApplyChanges` call has
successfully completed at the VSC side.

#### func (*FileSystemWatcherState) ReFetch

```go
func (me *FileSystemWatcherState) ReFetch() func(func())
```
ReFetch requests the current `FileSystemWatcher` state from the VSC side and
upon response refreshes this `FileSystemWatcherState`'s property values for
`ignoreCreateEvents`, `ignoreChangeEvents`, `ignoreDeleteEvents` to reflect it.

`return` ── a thenable that resolves when this `ReFetch` call has successfully
completed at the VSC side.

#### type InputBox

```go
type InputBox struct {

	// Cfg represents this `InputBox`'s current state. All its members get auto-refreshed every time a (subscribed) `InputBox` event fires or any `InputBox` method call (other than `Dispose`) resolves, but can also be manually refreshed via its `ReFetch` method. Your local modifications to its members will **not** be auto-propagated to VSC, this must be done explicitly via its `ApplyChanges` method.
	Cfg *InputBoxState
}
```

A concrete
[QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput)
to let the user input a text value.

Note that in many cases the more convenient
[window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
is easier to use.
[window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox)
should be used when
[window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
does not offer the required flexibility.

#### func (*InputBox) Dispose

```go
func (me *InputBox) Dispose() func(func())
```
Dispose of this input UI and any associated resources. If it is still visible,
it is first hidden. After this call the input UI is no longer functional and no
additional methods or properties on it should be accessed. Instead a new input
UI should be created.

`return` ── a thenable that resolves when this `Dispose` call has successfully
completed at the VSC side.

#### func (*InputBox) Hide

```go
func (me *InputBox) Hide() func(func())
```
Hides this input UI. This will also fire an
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

`return` ── a thenable that resolves when this `Hide` call has successfully
completed at the VSC side.

#### func (*InputBox) OnDidAccept

```go
func (me *InputBox) OnDidAccept(handler func()) func(func(*Disposable))
```
An event signaling when the user indicated acceptance of the input value.

`handler` ── will be invoked whenever the `OnDidAccept` event fires (mandatory,
not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidAccept` event on `Dispose`.

#### func (*InputBox) OnDidChangeValue

```go
func (me *InputBox) OnDidChangeValue(handler func(string)) func(func(*Disposable))
```
An event signaling when the value has changed.

`handler` ── will be invoked whenever the `OnDidChangeValue` event fires
(mandatory, not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChangeValue` event on `Dispose`.

#### func (*InputBox) OnDidHide

```go
func (me *InputBox) OnDidHide(handler func()) func(func(*Disposable))
```
An event signaling when this input UI is hidden.

There are several reasons why this UI might have to be hidden and the extension
will be notified through
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide).
(Examples include: an explicit call to
[QuickInput.hide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.hide),
the user pressing Esc, some other input UI opening, etc.)

`handler` ── will be invoked whenever the `OnDidHide` event fires (mandatory,
not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the `OnDidHide`
event on `Dispose`.

#### func (*InputBox) Show

```go
func (me *InputBox) Show() func(func())
```
Makes the input UI visible in its current configuration. Any other input UI will
first fire an
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

`return` ── a thenable that resolves when this `Show` call has successfully
completed at the VSC side.

#### type InputBoxOptions

```go
type InputBoxOptions struct {
	// The value to prefill in the input box.
	Value string `json:"value,omitempty"`

	// Selection of the prefilled [`value`](https://code.visualstudio.com/api/references/vscode-api#InputBoxOptions.value). Defined as tuple of two number where the
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

#### type InputBoxState

```go
type InputBoxState struct {

	// Current input value.
	Value string `json:"value"`

	// Optional placeholder in the filter text.
	Placeholder string `json:"placeholder"`

	// If the input value should be hidden. Defaults to false.
	Password bool `json:"password"`

	// An optional prompt text providing some ask or explanation to the user.
	Prompt string `json:"prompt"`

	// An optional validation message indicating a problem with the current input value.
	ValidationMessage string `json:"validationMessage"`

	// An optional title.
	Title string `json:"title"`

	// An optional current step count.
	Step int `json:"step"`

	// An optional total step count.
	TotalSteps int `json:"totalSteps"`

	// If the UI should allow for user input. Defaults to true.
	//
	// Change this to false, e.g., while validating user input or
	// loading data for the next step in user input.
	Enabled bool `json:"enabled"`

	// If the UI should show a progress indicator. Defaults to false.
	//
	// Change this to true, e.g., while loading more data or validating
	// user input.
	Busy bool `json:"busy"`

	// If the UI should stay open even when loosing UI focus. Defaults to false.
	IgnoreFocusOut bool `json:"ignoreFocusOut"`
}
```

InputBoxState (to be accessed only via `InputBox.Cfg`) is a snapshot of
`InputBox` state. It is auto-updated whenever `InputBox` creations and method
calls resolve or its event subscribers (if any) are invoked. Changes to any
non-read-only properties (ie. non-function-valued fields) must be explicitly
propagated to the VSC side via the `ApplyChanges` method.

#### func (*InputBoxState) ApplyChanges

```go
func (me *InputBoxState) ApplyChanges() func(func())
```
ApplyChanges propagates this `InputBoxState`'s current property values for
`value`, `placeholder`, `password`, `prompt`, `validationMessage`, `title`,
`step`, `totalSteps`, `enabled`, `busy`, `ignoreFocusOut` to the VSC side to
immediately become active there. Note that **all** those property values are
transmitted, no omissions.

`return` ── a thenable that resolves when this `ApplyChanges` call has
successfully completed at the VSC side.

#### func (*InputBoxState) ReFetch

```go
func (me *InputBoxState) ReFetch() func(func())
```
ReFetch requests the current `InputBox` state from the VSC side and upon
response refreshes this `InputBoxState`'s property values for `value`,
`placeholder`, `password`, `prompt`, `validationMessage`, `title`, `step`,
`totalSteps`, `enabled`, `busy`, `ignoreFocusOut` to reflect it.

`return` ── a thenable that resolves when this `ReFetch` call has successfully
completed at the VSC side.

#### type Languages

```go
type Languages interface {
	// Return the identifiers of all known languages.
	//
	// `return` ── Promise resolving to an array of identifier strings.
	GetLanguages() func(func([]string))

	// An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the global set of diagnostics changes. This is
	// newly added and removed diagnostics.
	//
	// `listener` ── will be invoked whenever the `OnDidChangeDiagnostics` event fires (mandatory, not optional).
	//
	// `return` ── A `Disposable` that will unsubscribe `listener` from the `OnDidChangeDiagnostics` event on `Dispose`.
	OnDidChangeDiagnostics(listener func(DiagnosticChangeEvent)) func(func(*Disposable))
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
is provide a function that can be called with a
[TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument)
and a [Position](#Position) returning hover info. The rest, like tracking the
mouse, positioning the hover, keeping the hover stable etc. is taken care of by
the editor.

```javascript

languages.registerHoverProvider('javascript', {

    provideHover(document, position, token) {
    	return new Hover('I am a hover!');
    }

});

```

Registration is done using a [document
selector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector)
which is either a language id, like `javascript` or a more complex
[filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter)
like `{ language: 'typescript', scheme: 'file' }`. Matching a document against
such a selector will result in a
[score](https://code.visualstudio.com/api/references/vscode-api#languages.match)
that is used to determine if and how a provider shall be used. When scores are
equal the provider that came last wins. For features that allow full arity, like
[hover](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider),
the score is only checked to be `>0`, for other features, like
[IntelliSense](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider)
the score is used for determining the order in which providers are asked to
participate.

#### type OpenDialogOptions

```go
type OpenDialogOptions struct {
	// The resource the dialog shows when opened.
	DefaultUri string `json:"defaultUri,omitempty"`

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
	//
	// ```ts
	//
	// {
	//  	'Images': ['png', 'jpg']
	//  	'TypeScript': ['ts', 'tsx']
	// }
	//
	// ```
	//
	Filters map[string][]string `json:"filters,omitempty"`
}
```

Options to configure the behaviour of a file open dialog.

* Note 1: A dialog can select files, folders, or both. This is not true for
Windows which enforces to open either files or folder, but *not both*. * Note 2:
Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
and the editor then silently adjusts the options to select files.

#### type OutputChannel

```go
type OutputChannel struct {

	// Cfg represents this `OutputChannel`'s current state. All its members get auto-refreshed every time any `OutputChannel` method call (other than `Dispose`) resolves, but can also be manually refreshed via its `ReFetch` method.
	Cfg *OutputChannelState
}
```

An output channel is a container for readonly textual information.

To get an instance of an `OutputChannel` use
[createOutputChannel](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel).

#### func (*OutputChannel) Append

```go
func (me *OutputChannel) Append(value string) func(func())
```
Append the given value to the channel.

`value` ── A string, falsy values will not be printed.

`return` ── a thenable that resolves when this `Append` call has successfully
completed at the VSC side.

#### func (*OutputChannel) AppendLine

```go
func (me *OutputChannel) AppendLine(value string) func(func())
```
Append the given value and a line feed character to the channel.

`value` ── A string, falsy values will be printed.

`return` ── a thenable that resolves when this `AppendLine` call has
successfully completed at the VSC side.

#### func (*OutputChannel) Clear

```go
func (me *OutputChannel) Clear() func(func())
```
Removes all output from the channel.

`return` ── a thenable that resolves when this `Clear` call has successfully
completed at the VSC side.

#### func (*OutputChannel) Dispose

```go
func (me *OutputChannel) Dispose() func(func())
```
Dispose and free associated resources.

`return` ── a thenable that resolves when this `Dispose` call has successfully
completed at the VSC side.

#### func (*OutputChannel) Hide

```go
func (me *OutputChannel) Hide() func(func())
```
Hide this channel from the UI.

`return` ── a thenable that resolves when this `Hide` call has successfully
completed at the VSC side.

#### func (*OutputChannel) Show

```go
func (me *OutputChannel) Show(preserveFocus bool) func(func())
```
Reveal this channel in the UI.

`preserveFocus` ── When `true` the channel will not take focus.

`return` ── a thenable that resolves when this `Show` call has successfully
completed at the VSC side.

#### type OutputChannelState

```go
type OutputChannelState struct {

	// The human-readable name of this output channel.
	Name func() string `json:"-"`
}
```

OutputChannelState (to be accessed only via `OutputChannel.Cfg`) is a snapshot
of `OutputChannel` state. It is auto-updated whenever `OutputChannel` creations
and method calls resolve or its event subscribers (if any) are invoked. All
read-only properties are exposed as function-valued fields.

#### func (*OutputChannelState) ReFetch

```go
func (me *OutputChannelState) ReFetch() func(func())
```
ReFetch requests the current `OutputChannel` state from the VSC side and upon
response refreshes this `OutputChannelState`'s property value for `name` to
reflect it.

`return` ── a thenable that resolves when this `ReFetch` call has successfully
completed at the VSC side.

#### type QuickInputButton

```go
type QuickInputButton struct {
	// Icon for the button.
	IconPath string `json:"iconPath"`

	// An optional tooltip.
	Tooltip string `json:"tooltip,omitempty"`
}
```

Button for an action in a
[QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick)
or [InputBox](#InputBox).

#### type QuickPick

```go
type QuickPick struct {

	// Cfg represents this `QuickPick`'s current state. All its members get auto-refreshed every time a (subscribed) `QuickPick` event fires or any `QuickPick` method call (other than `Dispose`) resolves, but can also be manually refreshed via its `ReFetch` method. Your local modifications to its members will **not** be auto-propagated to VSC, this must be done explicitly via its `ApplyChanges` method.
	Cfg *QuickPickState
}
```

A concrete
[QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput)
to let the user pick an item from a list of items of type T. The items can be
filtered through a filter text field and there is an option
[canSelectMany](https://code.visualstudio.com/api/references/vscode-api#QuickPick.canSelectMany)
to allow for selecting multiple items.

Note that in many cases the more convenient
[window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
is easier to use.
[window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick)
should be used when
[window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
does not offer the required flexibility.

#### func (*QuickPick) Dispose

```go
func (me *QuickPick) Dispose() func(func())
```
Dispose of this input UI and any associated resources. If it is still visible,
it is first hidden. After this call the input UI is no longer functional and no
additional methods or properties on it should be accessed. Instead a new input
UI should be created.

`return` ── a thenable that resolves when this `Dispose` call has successfully
completed at the VSC side.

#### func (*QuickPick) Hide

```go
func (me *QuickPick) Hide() func(func())
```
Hides this input UI. This will also fire an
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

`return` ── a thenable that resolves when this `Hide` call has successfully
completed at the VSC side.

#### func (*QuickPick) OnDidAccept

```go
func (me *QuickPick) OnDidAccept(handler func()) func(func(*Disposable))
```
An event signaling when the user indicated acceptance of the selected item(s).

`handler` ── will be invoked whenever the `OnDidAccept` event fires (mandatory,
not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidAccept` event on `Dispose`.

#### func (*QuickPick) OnDidChangeActive

```go
func (me *QuickPick) OnDidChangeActive(handler func([]QuickPickItem)) func(func(*Disposable))
```
An event signaling when the active items have changed.

`handler` ── will be invoked whenever the `OnDidChangeActive` event fires
(mandatory, not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChangeActive` event on `Dispose`.

#### func (*QuickPick) OnDidChangeSelection

```go
func (me *QuickPick) OnDidChangeSelection(handler func([]QuickPickItem)) func(func(*Disposable))
```
An event signaling when the selected items have changed.

`handler` ── will be invoked whenever the `OnDidChangeSelection` event fires
(mandatory, not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChangeSelection` event on `Dispose`.

#### func (*QuickPick) OnDidChangeValue

```go
func (me *QuickPick) OnDidChangeValue(handler func(string)) func(func(*Disposable))
```
An event signaling when the value of the filter text has changed.

`handler` ── will be invoked whenever the `OnDidChangeValue` event fires
(mandatory, not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChangeValue` event on `Dispose`.

#### func (*QuickPick) OnDidHide

```go
func (me *QuickPick) OnDidHide(handler func()) func(func(*Disposable))
```
An event signaling when this input UI is hidden.

There are several reasons why this UI might have to be hidden and the extension
will be notified through
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide).
(Examples include: an explicit call to
[QuickInput.hide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.hide),
the user pressing Esc, some other input UI opening, etc.)

`handler` ── will be invoked whenever the `OnDidHide` event fires (mandatory,
not optional).

`return` ── A `Disposable` that will unsubscribe `handler` from the `OnDidHide`
event on `Dispose`.

#### func (*QuickPick) Show

```go
func (me *QuickPick) Show() func(func())
```
Makes the input UI visible in its current configuration. Any other input UI will
first fire an
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

`return` ── a thenable that resolves when this `Show` call has successfully
completed at the VSC side.

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

#### type QuickPickState

```go
type QuickPickState struct {

	// Current value of the filter text.
	Value string `json:"value"`

	// Optional placeholder in the filter text.
	Placeholder string `json:"placeholder"`

	// Items to pick from.
	Items []QuickPickItem `json:"items"`

	// If multiple items can be selected at the same time. Defaults to false.
	CanSelectMany bool `json:"canSelectMany"`

	// If the filter text should also be matched against the description of the items. Defaults to false.
	MatchOnDescription bool `json:"matchOnDescription"`

	// If the filter text should also be matched against the detail of the items. Defaults to false.
	MatchOnDetail bool `json:"matchOnDetail"`

	// Active items. This can be read and updated by the extension.
	ActiveItems []QuickPickItem `json:"activeItems"`

	// Selected items. This can be read and updated by the extension.
	SelectedItems []QuickPickItem `json:"selectedItems"`

	// An optional title.
	Title string `json:"title"`

	// An optional current step count.
	Step int `json:"step"`

	// An optional total step count.
	TotalSteps int `json:"totalSteps"`

	// If the UI should allow for user input. Defaults to true.
	//
	// Change this to false, e.g., while validating user input or
	// loading data for the next step in user input.
	Enabled bool `json:"enabled"`

	// If the UI should show a progress indicator. Defaults to false.
	//
	// Change this to true, e.g., while loading more data or validating
	// user input.
	Busy bool `json:"busy"`

	// If the UI should stay open even when loosing UI focus. Defaults to false.
	IgnoreFocusOut bool `json:"ignoreFocusOut"`
}
```

QuickPickState (to be accessed only via `QuickPick.Cfg`) is a snapshot of
`QuickPick` state. It is auto-updated whenever `QuickPick` creations and method
calls resolve or its event subscribers (if any) are invoked. Changes to any
non-read-only properties (ie. non-function-valued fields) must be explicitly
propagated to the VSC side via the `ApplyChanges` method.

#### func (*QuickPickState) ApplyChanges

```go
func (me *QuickPickState) ApplyChanges() func(func())
```
ApplyChanges propagates this `QuickPickState`'s current property values for
`value`, `placeholder`, `items`, `canSelectMany`, `matchOnDescription`,
`matchOnDetail`, `activeItems`, `selectedItems`, `title`, `step`, `totalSteps`,
`enabled`, `busy`, `ignoreFocusOut` to the VSC side to immediately become active
there. Note that **all** those property values are transmitted, no omissions.

`return` ── a thenable that resolves when this `ApplyChanges` call has
successfully completed at the VSC side.

#### func (*QuickPickState) ReFetch

```go
func (me *QuickPickState) ReFetch() func(func())
```
ReFetch requests the current `QuickPick` state from the VSC side and upon
response refreshes this `QuickPickState`'s property values for `value`,
`placeholder`, `items`, `canSelectMany`, `matchOnDescription`, `matchOnDetail`,
`activeItems`, `selectedItems`, `title`, `step`, `totalSteps`, `enabled`,
`busy`, `ignoreFocusOut` to reflect it.

`return` ── a thenable that resolves when this `ReFetch` call has successfully
completed at the VSC side.

#### type SaveDialogOptions

```go
type SaveDialogOptions struct {
	// The resource the dialog shows when opened.
	DefaultUri string `json:"defaultUri,omitempty"`

	// A human-readable string for the save button.
	SaveLabel string `json:"saveLabel,omitempty"`

	// A set of file filters that are used by the dialog. Each entry is a human readable label,
	// like "TypeScript", and an array of extensions, e.g.
	//
	// ```ts
	//
	// {
	//  	'Images': ['png', 'jpg']
	//  	'TypeScript': ['ts', 'tsx']
	// }
	//
	// ```
	//
	Filters map[string][]string `json:"filters,omitempty"`
}
```

Options to configure the behaviour of a file save dialog.

#### type StatusBarAlignment

```go
type StatusBarAlignment int
```

Represents the alignment of status bar items.

```go
const (
	// Aligned to the left side.
	StatusBarAlignmentLeft StatusBarAlignment = 1

	// Aligned to the right side.
	StatusBarAlignmentRight StatusBarAlignment = 2
)
```

#### type StatusBarItem

```go
type StatusBarItem struct {

	// Cfg represents this `StatusBarItem`'s current state. All its members get auto-refreshed every time any `StatusBarItem` method call (other than `Dispose`) resolves, but can also be manually refreshed via its `ReFetch` method. Your local modifications to its members will **not** be auto-propagated to VSC, this must be done explicitly via its `ApplyChanges` method.
	Cfg *StatusBarItemState
}
```

A status bar item is a status bar contribution that can show text and icons and
run a command on click.

#### func (*StatusBarItem) Dispose

```go
func (me *StatusBarItem) Dispose() func(func())
```
Dispose and free associated resources. Call
[hide](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.hide).

`return` ── a thenable that resolves when this `Dispose` call has successfully
completed at the VSC side.

#### func (*StatusBarItem) Hide

```go
func (me *StatusBarItem) Hide() func(func())
```
Hide the entry in the status bar.

`return` ── a thenable that resolves when this `Hide` call has successfully
completed at the VSC side.

#### func (*StatusBarItem) Show

```go
func (me *StatusBarItem) Show() func(func())
```
Shows the entry in the status bar.

`return` ── a thenable that resolves when this `Show` call has successfully
completed at the VSC side.

#### type StatusBarItemState

```go
type StatusBarItemState struct {

	// The alignment of this item.
	Alignment func() StatusBarAlignment `json:"-"`

	// The priority of this item. Higher value means the item should
	// be shown more to the left.
	Priority func() int `json:"-"`

	// The text to show for the entry. You can embed icons in the text by leveraging the syntax:
	//
	// `My text $(icon-name) contains icons like $(icon-name) this one.`
	//
	// Where the icon-name is taken from the [octicon](https://octicons.github.com) icon set, e.g.
	// `light-bulb`, `thumbsup`, `zap` etc.
	Text string `json:"text"`

	// The tooltip text when you hover over this entry.
	Tooltip string `json:"tooltip"`

	// The foreground color for this entry.
	Color string `json:"color"`

	// The identifier of a command to run on click. The command must be
	// [known](https://code.visualstudio.com/api/references/vscode-api#commands.getCommands).
	Command string `json:"command"`
}
```

StatusBarItemState (to be accessed only via `StatusBarItem.Cfg`) is a snapshot
of `StatusBarItem` state. It is auto-updated whenever `StatusBarItem` creations
and method calls resolve or its event subscribers (if any) are invoked. All
read-only properties are exposed as function-valued fields. Changes to any
non-read-only properties (ie. non-function-valued fields) must be explicitly
propagated to the VSC side via the `ApplyChanges` method.

#### func (*StatusBarItemState) ApplyChanges

```go
func (me *StatusBarItemState) ApplyChanges() func(func())
```
ApplyChanges propagates this `StatusBarItemState`'s current property values for
`text`, `tooltip`, `color`, `command` to the VSC side to immediately become
active there. Note that **all** those property values are transmitted, no
omissions.

`return` ── a thenable that resolves when this `ApplyChanges` call has
successfully completed at the VSC side.

#### func (*StatusBarItemState) ReFetch

```go
func (me *StatusBarItemState) ReFetch() func(func())
```
ReFetch requests the current `StatusBarItem` state from the VSC side and upon
response refreshes this `StatusBarItemState`'s property values for `alignment`,
`priority`, `text`, `tooltip`, `color`, `command` to reflect it.

`return` ── a thenable that resolves when this `ReFetch` call has successfully
completed at the VSC side.

#### type Terminal

```go
type Terminal struct {

	// Cfg represents this `Terminal`'s current state. All its members get auto-refreshed every time any `Terminal` method call (other than `Dispose`) resolves, but can also be manually refreshed via its `ReFetch` method.
	Cfg *TerminalState
}
```

An individual terminal instance within the integrated terminal.

#### func (*Terminal) Dispose

```go
func (me *Terminal) Dispose() func(func())
```
Dispose and free associated resources.

`return` ── a thenable that resolves when this `Dispose` call has successfully
completed at the VSC side.

#### func (*Terminal) Hide

```go
func (me *Terminal) Hide() func(func())
```
Hide the terminal panel if this terminal is currently showing.

`return` ── a thenable that resolves when this `Hide` call has successfully
completed at the VSC side.

#### func (*Terminal) SendText

```go
func (me *Terminal) SendText(text string, addNewLine bool) func(func())
```
Send text to the terminal. The text is written to the stdin of the underlying
pty process (shell) of the terminal.

`text` ── The text to send.

`addNewLine` ── Whether to add a new line to the text being sent, this is
normally required to run a command in the terminal. The character(s) added are
\n or \r\n depending on the platform. This defaults to `true`.

`return` ── a thenable that resolves when this `SendText` call has successfully
completed at the VSC side.

#### func (*Terminal) Show

```go
func (me *Terminal) Show(preserveFocus bool) func(func())
```
Show the terminal panel and reveal this terminal in the UI.

`preserveFocus` ── When `true` the terminal will not take focus.

`return` ── a thenable that resolves when this `Show` call has successfully
completed at the VSC side.

#### type TerminalOptions

```go
type TerminalOptions struct {
	// A human-readable string which will be used to represent the terminal in the UI.
	Name string `json:"name,omitempty"`

	// A path to a custom shell executable to be used in the terminal.
	ShellPath string `json:"shellPath,omitempty"`

	// Args for the custom shell executable. A string can be used on Windows only which allows
	// specifying shell args in [command-line format](https://msdn.microsoft.com/en-au/08dfcab2-eb6e-49a4-80eb-87d4076c98c6).
	ShellArgs []string `json:"shellArgs,omitempty"`

	// A path or Uri for the current working directory to be used for the terminal.
	Cwd string `json:"cwd,omitempty"`

	// Object with environment variables that will be added to the VS Code process.
	Env map[string]string `json:"env,omitempty"`

	// Whether the terminal process environment should be exactly as provided in
	// `TerminalOptions.env`. When this is false (default), the environment will be based on the
	// window's environment and also apply configured platform settings like
	// `terminal.integrated.windows.env` on top. When this is true, the complete environment
	// must be provided as nothing will be inherited from the process or any configuration.
	StrictEnv bool `json:"strictEnv,omitempty"`

	// When enabled the terminal will run the process as normal but not be surfaced to the user
	// until `Terminal.show` is called. The typical usage for this is when you need to run
	// something that may need interactivity but only want to tell the user about it when
	// interaction is needed. Note that the terminals will still be exposed to all extensions
	// as normal.
	HideFromUser bool `json:"hideFromUser,omitempty"`
}
```

Value-object describing what options a terminal should use.

#### type TerminalState

```go
type TerminalState struct {

	// The name of the terminal.
	Name func() string `json:"-"`
}
```

TerminalState (to be accessed only via `Terminal.Cfg`) is a snapshot of
`Terminal` state. It is auto-updated whenever `Terminal` creations and method
calls resolve or its event subscribers (if any) are invoked. All read-only
properties are exposed as function-valued fields.

#### func (*TerminalState) ReFetch

```go
func (me *TerminalState) ReFetch() func(func())
```
ReFetch requests the current `Terminal` state from the VSC side and upon
response refreshes this `TerminalState`'s property value for `name` to reflect
it.

`return` ── a thenable that resolves when this `ReFetch` call has successfully
completed at the VSC side.

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
	// The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
	// events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
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
	// that can be called with a [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
	// mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
	//
	//
	// ```javascript
	//
	// languages.registerHoverProvider('javascript', {
	//  	provideHover(document, position, token) {
	//  		return new Hover('I am a hover!');
	//  	}
	// });
	//
	// ```
	//
	//
	// Registration is done using a [document selector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a language id, like `javascript` or
	// a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
	// a selector will result in a [score](https://code.visualstudio.com/api/references/vscode-api#languages.match) that is used to determine if and how a provider shall be used. When
	// scores are equal the provider that came last wins. For features that allow full arity, like [hover](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider),
	// the score is only checked to be `>0`, for other features, like [IntelliSense](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider) the
	// score is used for determining the order in which providers are asked to participate.
	Languages() Languages

	// Namespace for dealing with installed extensions. Extensions are represented
	// by an [extension](https://code.visualstudio.com/api/references/vscode-api#Extension)-interface which enables reflection on them.
	//
	// Extension writers can provide APIs to other extensions by returning their API public
	// surface from the `activate`-call.
	//
	//
	// ```javascript
	//
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
	//
	// ```
	//
	// When depending on the API of another extension add an `extensionDependency`-entry
	// to `package.json`, and use the [getExtension](https://code.visualstudio.com/api/references/vscode-api#extensions.getExtension)-function
	// and the [exports](https://code.visualstudio.com/api/references/vscode-api#Extension.exports)-property, like below:
	//
	//
	// ```javascript
	//
	// let mathExt = extensions.getExtension('genius.math');
	// let importedApi = mathExt.exports;
	//
	// console.log(importedApi.mul(42, 1));
	//
	// ```
	//
	Extensions() Extensions

	// Namespace for dealing with commands. In short, a command is a function with a
	// unique identifier. The function is sometimes also called _command handler_.
	//
	// Commands can be added to the editor using the [registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
	// and [registerTextEditorCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerTextEditorCommand) functions. Commands
	// can be executed [manually](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand) or from a UI gesture. Those are:
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
	//
	// ```javascript
	//
	// commands.registerCommand('extension.sayHello', () => {
	//  	window.showInformationMessage('Hello World!');
	// });
	//
	// ```
	//
	// Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
	//
	// ```json
	//
	// {
	//  	"contributes": {
	//  		"commands": [{
	//  			"command": "extension.sayHello",
	//  			"title": "Hello World"
	//  		}]
	//  	}
	// }
	//
	// ```
	//
	Commands() Commands
}
```

Type Definition for Visual Studio Code 1.39 Extension API See
https://code.visualstudio.com/api for more information

#### type Window

```go
type Window interface {
	// Show an information message to users. Optionally provide an array of items which will be presented as
	// clickable buttons.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowInformationMessage(message string, items []string) func(func(*string))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage(message string, items []string) func(func(*string))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage(message string, items []string) func(func(*string))

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
	// `return` ── A promise that resolves to a string the user provided or to `undefined` in case of dismissal.
	ShowInputBox(options *InputBoxOptions, token *Cancel) func(func(*string))

	// Shows a selection list allowing multiple selections.
	//
	// `items` ── An array of items, or a promise that resolves to an array of items.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `return` ── A promise that resolves to the selected items or `undefined`.
	ShowQuickPick(items []QuickPickItem, options QuickPickOptions, token *Cancel) func(func([]QuickPickItem))

	// Set a message to the status bar. This is a short hand for the more powerful
	// status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).
	//
	// `text` ── The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).
	//
	// `hideAfterTimeout` ── Timeout in milliseconds after which the message will be disposed.
	//
	// `return` ── A disposable which hides the status bar message.
	SetStatusBarMessage(text string, hideAfterTimeout int) func(func(*Disposable))

	// Shows a file save dialog to the user which allows to select a file
	// for saving-purposes.
	//
	// `options` ── Options that control the dialog.
	//
	// `return` ── A promise that resolves to the selected resource or `undefined`.
	ShowSaveDialog(options SaveDialogOptions) func(func(*string))

	// Shows a file open dialog to the user which allows to select a file
	// for opening-purposes.
	//
	// `options` ── Options that control the dialog.
	//
	// `return` ── A promise that resolves to the selected resources or `undefined`.
	ShowOpenDialog(options OpenDialogOptions) func(func([]string))

	// Shows a selection list of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) to pick from.
	// Returns `undefined` if no folder is open.
	//
	// `options` ── Configures the behavior of the workspace folder list.
	//
	// `return` ── A promise that resolves to the workspace folder or `undefined`.
	ShowWorkspaceFolderPick(options *WorkspaceFolderPickOptions) func(func(*WorkspaceFolder))

	// Represents the current window's state.
	//
	// `return` ── a thenable that resolves when this `State` call has successfully completed at the VSC side and its `WindowState` result received back at our end.
	State() func(func(WindowState))

	// An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the focus state of the current window
	// changes. The value of the event represents whether the window is focused.
	//
	// `listener` ── will be invoked whenever the `OnDidChangeWindowState` event fires (mandatory, not optional).
	//
	// `return` ── A `Disposable` that will unsubscribe `listener` from the `OnDidChangeWindowState` event on `Dispose`.
	OnDidChangeWindowState(listener func(WindowState)) func(func(*Disposable))

	// Creates a status bar [item](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem).
	//
	// `alignment` ── The alignment of the item.
	//
	// `priority` ── The priority of the item. Higher values mean the item should be shown more to the left.
	//
	// `return` ── A new status bar item.
	CreateStatusBarItem(alignment StatusBarAlignment, priority *int) func(func(*StatusBarItem))

	// Creates a new [output channel](https://code.visualstudio.com/api/references/vscode-api#OutputChannel) with the given name.
	//
	// `name` ── Human-readable string which will be used to represent the channel in the UI.
	//
	// `return` ── a thenable that resolves to the newly created `OutputChannel`.
	CreateOutputChannel(name string) func(func(*OutputChannel))

	// Creates a [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox) to let the user enter some text input.
	//
	// Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
	// is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
	// when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.
	//
	// `return` ── A new [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox).
	CreateInputBox() func(func(*InputBox))

	// Creates a [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick) to let the user pick an item from a list
	// of items of type T.
	//
	// Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
	// is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
	// when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.
	//
	// `return` ── A new [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick).
	CreateQuickPick() func(func(*QuickPick))

	// Creates a [Terminal](https://code.visualstudio.com/api/references/vscode-api#Terminal) with a backing shell process.
	//
	// `options` ── A TerminalOptions object describing the characteristics of the new terminal.
	//
	// `return` ── A new Terminal.
	CreateTerminal(options TerminalOptions) func(func(*Terminal))
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
	//
	// `return` ── a thenable that resolves when this `Name` call has successfully completed at the VSC side and its result received back at our end.
	Name() func(func(*string))

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
	//
	// ```typescript
	//
	// vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
	//
	// ```
	//
	//
	// **Note:** it is not advised to use `workspace.workspaceFile` to write
	// configuration data into the file. You can use `workspace.getConfiguration().update()`
	// for that purpose which will work both when a single folder is opened as
	// well as an untitled or saved workspace.
	//
	// `return` ── a thenable that resolves when this `WorkspaceFile` call has successfully completed at the VSC side and its result received back at our end.
	WorkspaceFile() func(func(*string))

	// Save all dirty files.
	//
	// `includeUntitled` ── Also save files that have been created during this session.
	//
	// `return` ── A thenable that resolves when the files have been saved.
	SaveAll(includeUntitled bool) func(func(bool))

	// An event that is emitted when a workspace folder is added or removed.
	//
	// `listener` ── will be invoked whenever the `OnDidChangeWorkspaceFolders` event fires (mandatory, not optional).
	//
	// `return` ── A `Disposable` that will unsubscribe `listener` from the `OnDidChangeWorkspaceFolders` event on `Dispose`.
	OnDidChangeWorkspaceFolders(listener func(WorkspaceFoldersChangeEvent)) func(func(*Disposable))

	// Returns the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) that contains a given uri.
	// * returns `undefined` when the given uri doesn't match any workspace folder
	// * returns the *input* when the given uri is a workspace folder itself
	//
	// `uri` ── An uri.
	//
	// `return` ── A workspace folder or `undefined`
	GetWorkspaceFolder(uri string) func(func(*WorkspaceFolder))

	// List of workspace folders or `undefined` when no folder is open.
	// *Note* that the first entry corresponds to the value of `rootPath`.
	//
	// `return` ── a thenable that resolves when this `WorkspaceFolders` call has successfully completed at the VSC side and its result received back at our end.
	WorkspaceFolders() func(func([]WorkspaceFolder))

	// Find files across all [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) in the workspace.
	// `findFiles('**​/*.js', '**​/node_modules/**', 10)`
	//
	// `include` ── A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines the files to search for. The glob pattern
	// will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern)
	// to restrict the search results to a [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder).
	//
	// `exclude` ── A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines files and folders to exclude. The glob pattern
	// will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will
	// apply, when `null` no excludes will apply.
	//
	// `maxResults` ── An upper-bound for the result.
	//
	// `token` ── A token that can be used to signal cancellation to the underlying search engine.
	//
	// `return` ── A thenable that resolves to an array of resource identifiers. Will return no results if no
	// [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) are opened.
	FindFiles(include string, exclude *string, maxResults *int, token *Cancel) func(func([]string))

	// Returns a path that is relative to the workspace folder or folders.
	//
	// When there are no [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) or when the path
	// is not contained in them, the input is returned.
	//
	// `pathOrUri` ── A path or uri. When a uri is given its [fsPath](https://code.visualstudio.com/api/references/vscode-api#Uri.fsPath) is used.
	//
	// `includeWorkspaceFolder` ── When `true` and when the given path is contained inside a
	// workspace folder the name of the workspace is prepended. Defaults to `true` when there are
	// multiple workspace folders and `false` otherwise.
	//
	// `return` ── A path relative to the root or the input.
	AsRelativePath(pathOrUri string, includeWorkspaceFolder bool) func(func(*string))

	// Creates a file system watcher.
	//
	// A glob pattern that filters the file events on their absolute path must be provided. Optionally,
	// flags to ignore certain kinds of events can be provided. To stop listening to events the watcher must be disposed.
	//
	// *Note* that only files within the current [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) can be watched.
	//
	// `globPattern` ── A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that is applied to the absolute paths of created, changed,
	// and deleted files. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern) to limit events to a certain [workspace folder](#WorkspaceFolder).
	//
	// `ignoreCreateEvents` ── Ignore when files have been created.
	//
	// `ignoreChangeEvents` ── Ignore when files have been changed.
	//
	// `ignoreDeleteEvents` ── Ignore when files have been deleted.
	//
	// `return` ── A new file system watcher instance.
	CreateFileSystemWatcher(globPattern string, ignoreCreateEvents bool, ignoreChangeEvents bool, ignoreDeleteEvents bool) func(func(*FileSystemWatcher))

	// Provides single-call access to numerous individual `Workspace` properties at once.
	//
	// `return` ── a thenable that resolves when this `AllProperties` call has successfully completed at the VSC side and its `WorkspaceState` result received back at our end.
	AllProperties() func(func(WorkspaceState))
}
```

Namespace for dealing with the current workspace. A workspace is the
representation of the folder that has been opened. There is no workspace when
just a file but not a folder has been opened.

The workspace offers support for
[listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher)
to fs events and for
[finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles)
files. Both perform well and run _outside_ the editor-process so that they
should be always used instead of nodejs-equivalents.

#### type WorkspaceFolder

```go
type WorkspaceFolder struct {
	// The associated uri for this workspace folder.
	//
	// *Note:* The [Uri](https://code.visualstudio.com/api/references/vscode-api#Uri)-type was intentionally chosen such that future releases of the editor can support
	// workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.
	Uri string `json:"uri"`

	// The name of this workspace folder. Defaults to
	// the basename of its [uri-path](https://code.visualstudio.com/api/references/vscode-api#Uri.path)
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

Options to configure the behaviour of the [workspace
folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder)
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
folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders).

#### type WorkspaceState

```go
type WorkspaceState struct {
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
	//
	// ```typescript
	//
	// vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
	//
	// ```
	//
	//
	// **Note:** it is not advised to use `workspace.workspaceFile` to write
	// configuration data into the file. You can use `workspace.getConfiguration().update()`
	// for that purpose which will work both when a single folder is opened as
	// well as an untitled or saved workspace.
	WorkspaceFile string `json:"workspaceFile,omitempty"`

	// List of workspace folders or `undefined` when no folder is open.
	// *Note* that the first entry corresponds to the value of `rootPath`.
	WorkspaceFolders []WorkspaceFolder `json:"workspaceFolders,omitempty"`
}
```

WorkspaceState gathers various properties of `Workspace`, obtainable via its
`AllProperties` method.
