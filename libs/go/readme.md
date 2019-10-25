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

#### type DecorationRangeBehavior

```go
type DecorationRangeBehavior int
```

Describes the behavior of decorations when typing/editing at their edges.

```go
const (
	// The decoration's range will widen when edits occur at the start or end.
	DecorationRangeBehaviorOpenOpen DecorationRangeBehavior = 0

	// The decoration's range will not widen when edits occur at the start of end.
	DecorationRangeBehaviorClosedClosed DecorationRangeBehavior = 1

	// The decoration's range will widen when edits occur at the start, but not at the end.
	DecorationRangeBehaviorOpenClosed DecorationRangeBehavior = 2

	// The decoration's range will widen when edits occur at the end, but not at the start.
	DecorationRangeBehaviorClosedOpen DecorationRangeBehavior = 3
)
```

#### type DecorationRenderOptions

```go
type DecorationRenderOptions struct {
	// Should the decoration be rendered also on the whitespace after the line text.
	// Defaults to `false`.
	IsWholeLine bool `json:"isWholeLine,omitempty"`

	// Customize the growing behavior of the decoration when edits occur at the edges of the decoration's range.
	// Defaults to `DecorationRangeBehavior.OpenOpen`.
	RangeBehavior DecorationRangeBehavior `json:"rangeBehavior,omitempty"`

	// The position in the overview ruler where the decoration should be rendered.
	OverviewRulerLane OverviewRulerLane `json:"overviewRulerLane,omitempty"`

	// Overwrite options for light themes.
	Light ThemableDecorationRenderOptions `json:"light,omitempty"`

	// Overwrite options for dark themes.
	Dark ThemableDecorationRenderOptions `json:"dark,omitempty"`

	// Background color of the decoration. Use rgba() and define transparent background colors to play well with other decorations.
	// Alternatively a color from the color registry can be [referenced](https://code.visualstudio.com/api/references/vscode-api#ThemeColor).
	BackgroundColor string `json:"backgroundColor,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Outline string `json:"outline,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'outline' for setting one or more of the individual outline properties.
	OutlineColor string `json:"outlineColor,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'outline' for setting one or more of the individual outline properties.
	OutlineStyle string `json:"outlineStyle,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'outline' for setting one or more of the individual outline properties.
	OutlineWidth string `json:"outlineWidth,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Border string `json:"border,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderColor string `json:"borderColor,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderRadius string `json:"borderRadius,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderSpacing string `json:"borderSpacing,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderStyle string `json:"borderStyle,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderWidth string `json:"borderWidth,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	FontStyle string `json:"fontStyle,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	FontWeight string `json:"fontWeight,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	TextDecoration string `json:"textDecoration,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Cursor string `json:"cursor,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Color string `json:"color,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Opacity string `json:"opacity,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	LetterSpacing string `json:"letterSpacing,omitempty"`

	// An **absolute path** or an URI to an image to be rendered in the gutter.
	GutterIconPath string `json:"gutterIconPath,omitempty"`

	// Specifies the size of the gutter icon.
	// Available values are 'auto', 'contain', 'cover' and any percentage value.
	// For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx
	GutterIconSize string `json:"gutterIconSize,omitempty"`

	// The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations.
	OverviewRulerColor string `json:"overviewRulerColor,omitempty"`

	// Defines the rendering options of the attachment that is inserted before the decorated text.
	Before ThemableDecorationAttachmentRenderOptions `json:"before,omitempty"`

	// Defines the rendering options of the attachment that is inserted after the decorated text.
	After ThemableDecorationAttachmentRenderOptions `json:"after,omitempty"`
}
```

Represents rendering styles for a [text editor
decoration](https://code.visualstudio.com/api/references/vscode-api#TextEditorDecorationType).

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
Dispose signals to the counterparty to destroy the object.

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
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	AppName() func(func(string))

	// The application root folder from which the editor is running.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	AppRoot() func(func(string))

	// Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	Language() func(func(string))

	// A unique identifier for the computer.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	MachineId() func(func(string))

	// The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
	// Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
	//
	// *Note* that the value is `undefined` when there is no remote extension host but that the
	// value is defined in all extension hosts (local and remote) in case a remote extension host
	// exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
	// a specific extension runs remote or not.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	RemoteName() func(func(*string))

	// A unique identifier for the current session.
	// Changes each time the editor is started.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	SessionId() func(func(string))

	// The detected default shell for the extension host, this is overridden by the
	// `terminal.integrated.shell` setting for the extension host's platform.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	Shell() func(func(string))

	// The custom uri scheme the editor registers to in the operating system.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	UriScheme() func(func(string))

	// Provides single-call access to numerous individual `Env` properties at once.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its `EnvBag` result obtained.
	AllProperties() func(func(EnvBag))

	// The clipboard provides read and write access to the system's clipboard.
	Clipboard() Clipboard
}
```

Namespace describing the environment the editor runs in.

#### type EnvBag

```go
type EnvBag struct {
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

EnvBag gathers various properties of `Env`, obtainable via its `AllProperties`
method.

#### type Extensions

```go
type Extensions interface {
	// An event which fires when `extensions.all` changes. This can happen when extensions are
	// installed, uninstalled, enabled or disabled.
	//
	// `listener` ── will be invoked whenever this event fires; mandatory, not optional.
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

#### type InputBox

```go
type InputBox struct {
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

`return` ── A thenable that resolves when this call has completed at the
counterparty.

#### func (*InputBox) Get

```go
func (me *InputBox) Get() func(func(InputBoxBag))
```
Obtains this `InputBox`'s current property values for: `value`, `placeholder`,
`password`, `prompt`, `validationMessage`, `title`, `step`, `totalSteps`,
`enabled`, `busy`, `ignoreFocusOut`.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `InputBoxBag` result obtained.

#### func (*InputBox) Hide

```go
func (me *InputBox) Hide() func(func(*InputBoxBag))
```
Hides this input UI. This will also fire an
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `InputBoxBag` result obtained.

#### func (*InputBox) OnDidAccept

```go
func (me *InputBox) OnDidAccept(handler func(InputBoxBag)) func(func(*Disposable))
```
An event signaling when the user indicated acceptance of the input value.

`handler` ── will be invoked whenever this event fires; mandatory, not optional.

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidAccept` event on `Dispose`.

#### func (*InputBox) OnDidChangeValue

```go
func (me *InputBox) OnDidChangeValue(handler func(string, InputBoxBag)) func(func(*Disposable))
```
An event signaling when the value has changed.

`handler` ── will be invoked whenever this event fires; mandatory, not optional.

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChangeValue` event on `Dispose`.

#### func (*InputBox) OnDidHide

```go
func (me *InputBox) OnDidHide(handler func(InputBoxBag)) func(func(*Disposable))
```
An event signaling when this input UI is hidden.

There are several reasons why this UI might have to be hidden and the extension
will be notified through
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide).
(Examples include: an explicit call to
[QuickInput.hide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.hide),
the user pressing Esc, some other input UI opening, etc.)

`handler` ── will be invoked whenever this event fires; mandatory, not optional.

`return` ── A `Disposable` that will unsubscribe `handler` from the `OnDidHide`
event on `Dispose`.

#### func (*InputBox) Set

```go
func (me *InputBox) Set(allUpdates InputBoxBag) func(func())
```
Updates this `InputBox`'s current property values for: `value`, `placeholder`,
`password`, `prompt`, `validationMessage`, `title`, `step`, `totalSteps`,
`enabled`, `busy`, `ignoreFocusOut`.

`allUpdates` ── be aware that *all* its fields are sent for update, no
omissions. Best here to reuse a mostly-recently-obtained-from-the-counterparty
`InputBoxBag` with your select modifications applied, rather than construct a
new one from scratch.

`return` ── A thenable that resolves when this call has completed at the
counterparty.

#### func (*InputBox) Show

```go
func (me *InputBox) Show() func(func(*InputBoxBag))
```
Makes the input UI visible in its current configuration. Any other input UI will
first fire an
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `InputBoxBag` result obtained.

#### type InputBoxBag

```go
type InputBoxBag struct {
	// Current input value.
	Value string `json:"value,omitempty"`

	// Optional placeholder in the filter text.
	Placeholder string `json:"placeholder,omitempty"`

	// If the input value should be hidden. Defaults to false.
	Password bool `json:"password,omitempty"`

	// An optional prompt text providing some ask or explanation to the user.
	Prompt string `json:"prompt,omitempty"`

	// An optional validation message indicating a problem with the current input value.
	ValidationMessage string `json:"validationMessage,omitempty"`

	// An optional title.
	Title string `json:"title,omitempty"`

	// An optional current step count.
	Step int `json:"step,omitempty"`

	// An optional total step count.
	TotalSteps int `json:"totalSteps,omitempty"`

	// If the UI should allow for user input. Defaults to true.
	//
	// Change this to false, e.g., while validating user input or
	// loading data for the next step in user input.
	Enabled bool `json:"enabled,omitempty"`

	// If the UI should show a progress indicator. Defaults to false.
	//
	// Change this to true, e.g., while loading more data or validating
	// user input.
	Busy bool `json:"busy,omitempty"`

	// If the UI should stay open even when loosing UI focus. Defaults to false.
	IgnoreFocusOut bool `json:"ignoreFocusOut,omitempty"`
}
```

InputBoxBag is a snapshot of `InputBox` state at the counterparty. It is
obtained whenever `InputBox` creations and method calls (incl. the dedicated
`Get`) resolve or its event subscribers are invoked, and therefore (to help
always retain a factual view of the real full-picture) should not be constructed
manually. Changes to any non-function-valued fields must be propagated to the
counterparty via the `Set` method.

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
	// `listener` ── will be invoked whenever this event fires; mandatory, not optional.
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
}
```

An output channel is a container for readonly textual information.

To get an instance of an `OutputChannel` use
[createOutputChannel](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel).

#### func (*OutputChannel) Append

```go
func (me *OutputChannel) Append(value string) func(func(*OutputChannelBag))
```
Append the given value to the channel.

`value` ── A string, falsy values will not be printed.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `OutputChannelBag` result obtained.

#### func (*OutputChannel) AppendLine

```go
func (me *OutputChannel) AppendLine(value string) func(func(*OutputChannelBag))
```
Append the given value and a line feed character to the channel.

`value` ── A string, falsy values will be printed.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `OutputChannelBag` result obtained.

#### func (*OutputChannel) Clear

```go
func (me *OutputChannel) Clear() func(func(*OutputChannelBag))
```
Removes all output from the channel.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `OutputChannelBag` result obtained.

#### func (*OutputChannel) Dispose

```go
func (me *OutputChannel) Dispose() func(func())
```
Dispose and free associated resources.

`return` ── A thenable that resolves when this call has completed at the
counterparty.

#### func (*OutputChannel) Get

```go
func (me *OutputChannel) Get() func(func(OutputChannelBag))
```
Obtains this `OutputChannel`'s current property value for: `name`.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `OutputChannelBag` result obtained.

#### func (*OutputChannel) Hide

```go
func (me *OutputChannel) Hide() func(func(*OutputChannelBag))
```
Hide this channel from the UI.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `OutputChannelBag` result obtained.

#### func (*OutputChannel) Show

```go
func (me *OutputChannel) Show(preserveFocus bool) func(func(*OutputChannelBag))
```
Reveal this channel in the UI.

`preserveFocus` ── When `true` the channel will not take focus.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `OutputChannelBag` result obtained.

#### type OutputChannelBag

```go
type OutputChannelBag struct {
	// The human-readable name of this output channel.
	Name func() string `json:"-"`
}
```

OutputChannelBag is a snapshot of `OutputChannel` state at the counterparty. It
is obtained whenever `OutputChannel` creations and method calls (incl. the
dedicated `Get`) resolve or its event subscribers are invoked, and therefore (to
help always retain a factual view of the real full-picture) should not be
constructed manually. All read-only properties are exposed as function-valued
fields.

#### type OverviewRulerLane

```go
type OverviewRulerLane int
```

Represents different positions for rendering a decoration in an [overview
ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
The overview ruler supports three lanes.

```go
const (
	// Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
	// The overview ruler supports three lanes.
	OverviewRulerLaneLeft OverviewRulerLane = 1

	// Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
	// The overview ruler supports three lanes.
	OverviewRulerLaneCenter OverviewRulerLane = 2

	// Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
	// The overview ruler supports three lanes.
	OverviewRulerLaneRight OverviewRulerLane = 4

	// Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
	// The overview ruler supports three lanes.
	OverviewRulerLaneFull OverviewRulerLane = 7
)
```

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

`return` ── A thenable that resolves when this call has completed at the
counterparty.

#### func (*QuickPick) Get

```go
func (me *QuickPick) Get() func(func(QuickPickBag))
```
Obtains this `QuickPick`'s current property values for: `value`, `placeholder`,
`items`, `canSelectMany`, `matchOnDescription`, `matchOnDetail`, `activeItems`,
`selectedItems`, `title`, `step`, `totalSteps`, `enabled`, `busy`,
`ignoreFocusOut`.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `QuickPickBag` result obtained.

#### func (*QuickPick) Hide

```go
func (me *QuickPick) Hide() func(func(*QuickPickBag))
```
Hides this input UI. This will also fire an
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `QuickPickBag` result obtained.

#### func (*QuickPick) OnDidAccept

```go
func (me *QuickPick) OnDidAccept(handler func(QuickPickBag)) func(func(*Disposable))
```
An event signaling when the user indicated acceptance of the selected item(s).

`handler` ── will be invoked whenever this event fires; mandatory, not optional.

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidAccept` event on `Dispose`.

#### func (*QuickPick) OnDidChangeActive

```go
func (me *QuickPick) OnDidChangeActive(handler func([]QuickPickItem, QuickPickBag)) func(func(*Disposable))
```
An event signaling when the active items have changed.

`handler` ── will be invoked whenever this event fires; mandatory, not optional.

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChangeActive` event on `Dispose`.

#### func (*QuickPick) OnDidChangeSelection

```go
func (me *QuickPick) OnDidChangeSelection(handler func([]QuickPickItem, QuickPickBag)) func(func(*Disposable))
```
An event signaling when the selected items have changed.

`handler` ── will be invoked whenever this event fires; mandatory, not optional.

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChangeSelection` event on `Dispose`.

#### func (*QuickPick) OnDidChangeValue

```go
func (me *QuickPick) OnDidChangeValue(handler func(string, QuickPickBag)) func(func(*Disposable))
```
An event signaling when the value of the filter text has changed.

`handler` ── will be invoked whenever this event fires; mandatory, not optional.

`return` ── A `Disposable` that will unsubscribe `handler` from the
`OnDidChangeValue` event on `Dispose`.

#### func (*QuickPick) OnDidHide

```go
func (me *QuickPick) OnDidHide(handler func(QuickPickBag)) func(func(*Disposable))
```
An event signaling when this input UI is hidden.

There are several reasons why this UI might have to be hidden and the extension
will be notified through
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide).
(Examples include: an explicit call to
[QuickInput.hide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.hide),
the user pressing Esc, some other input UI opening, etc.)

`handler` ── will be invoked whenever this event fires; mandatory, not optional.

`return` ── A `Disposable` that will unsubscribe `handler` from the `OnDidHide`
event on `Dispose`.

#### func (*QuickPick) Set

```go
func (me *QuickPick) Set(allUpdates QuickPickBag) func(func())
```
Updates this `QuickPick`'s current property values for: `value`, `placeholder`,
`items`, `canSelectMany`, `matchOnDescription`, `matchOnDetail`, `activeItems`,
`selectedItems`, `title`, `step`, `totalSteps`, `enabled`, `busy`,
`ignoreFocusOut`.

`allUpdates` ── be aware that *all* its fields are sent for update, no
omissions. Best here to reuse a mostly-recently-obtained-from-the-counterparty
`QuickPickBag` with your select modifications applied, rather than construct a
new one from scratch.

`return` ── A thenable that resolves when this call has completed at the
counterparty.

#### func (*QuickPick) Show

```go
func (me *QuickPick) Show() func(func(*QuickPickBag))
```
Makes the input UI visible in its current configuration. Any other input UI will
first fire an
[QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `QuickPickBag` result obtained.

#### type QuickPickBag

```go
type QuickPickBag struct {
	// Current value of the filter text.
	Value string `json:"value,omitempty"`

	// Optional placeholder in the filter text.
	Placeholder string `json:"placeholder,omitempty"`

	// Items to pick from.
	Items []QuickPickItem `json:"items,omitempty"`

	// If multiple items can be selected at the same time. Defaults to false.
	CanSelectMany bool `json:"canSelectMany,omitempty"`

	// If the filter text should also be matched against the description of the items. Defaults to false.
	MatchOnDescription bool `json:"matchOnDescription,omitempty"`

	// If the filter text should also be matched against the detail of the items. Defaults to false.
	MatchOnDetail bool `json:"matchOnDetail,omitempty"`

	// Active items. This can be read and updated by the extension.
	ActiveItems []QuickPickItem `json:"activeItems,omitempty"`

	// Selected items. This can be read and updated by the extension.
	SelectedItems []QuickPickItem `json:"selectedItems,omitempty"`

	// An optional title.
	Title string `json:"title,omitempty"`

	// An optional current step count.
	Step int `json:"step,omitempty"`

	// An optional total step count.
	TotalSteps int `json:"totalSteps,omitempty"`

	// If the UI should allow for user input. Defaults to true.
	//
	// Change this to false, e.g., while validating user input or
	// loading data for the next step in user input.
	Enabled bool `json:"enabled,omitempty"`

	// If the UI should show a progress indicator. Defaults to false.
	//
	// Change this to true, e.g., while loading more data or validating
	// user input.
	Busy bool `json:"busy,omitempty"`

	// If the UI should stay open even when loosing UI focus. Defaults to false.
	IgnoreFocusOut bool `json:"ignoreFocusOut,omitempty"`
}
```

QuickPickBag is a snapshot of `QuickPick` state at the counterparty. It is
obtained whenever `QuickPick` creations and method calls (incl. the dedicated
`Get`) resolve or its event subscribers are invoked, and therefore (to help
always retain a factual view of the real full-picture) should not be constructed
manually. Changes to any non-function-valued fields must be propagated to the
counterparty via the `Set` method.

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

`return` ── A thenable that resolves when this call has completed at the
counterparty.

#### func (*StatusBarItem) Get

```go
func (me *StatusBarItem) Get() func(func(StatusBarItemBag))
```
Obtains this `StatusBarItem`'s current property values for: `alignment`,
`priority`, `text`, `tooltip`, `color`, `command`.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `StatusBarItemBag` result obtained.

#### func (*StatusBarItem) Hide

```go
func (me *StatusBarItem) Hide() func(func(*StatusBarItemBag))
```
Hide the entry in the status bar.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `StatusBarItemBag` result obtained.

#### func (*StatusBarItem) Set

```go
func (me *StatusBarItem) Set(allUpdates StatusBarItemBag) func(func())
```
Updates this `StatusBarItem`'s current property values for: `text`, `tooltip`,
`color`, `command`.

`allUpdates` ── be aware that *all* its fields are sent for update, no
omissions. Best here to reuse a mostly-recently-obtained-from-the-counterparty
`StatusBarItemBag` with your select modifications applied, rather than construct
a new one from scratch.

`return` ── A thenable that resolves when this call has completed at the
counterparty.

#### func (*StatusBarItem) Show

```go
func (me *StatusBarItem) Show() func(func(*StatusBarItemBag))
```
Shows the entry in the status bar.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `StatusBarItemBag` result obtained.

#### type StatusBarItemBag

```go
type StatusBarItemBag struct {
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
	Text string `json:"text,omitempty"`

	// The tooltip text when you hover over this entry.
	Tooltip string `json:"tooltip,omitempty"`

	// The foreground color for this entry.
	Color string `json:"color,omitempty"`

	// The identifier of a command to run on click. The command must be
	// [known](https://code.visualstudio.com/api/references/vscode-api#commands.getCommands).
	Command string `json:"command,omitempty"`
}
```

StatusBarItemBag is a snapshot of `StatusBarItem` state at the counterparty. It
is obtained whenever `StatusBarItem` creations and method calls (incl. the
dedicated `Get`) resolve or its event subscribers are invoked, and therefore (to
help always retain a factual view of the real full-picture) should not be
constructed manually. All read-only properties are exposed as function-valued
fields. Changes to any non-function-valued fields must be propagated to the
counterparty via the `Set` method.

#### type TextEditorDecorationType

```go
type TextEditorDecorationType struct {
}
```

Represents a handle to a set of decorations sharing the same [styling
options](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions)
in a [text editor](#TextEditor).

To get an instance of a `TextEditorDecorationType` use
[createTextEditorDecorationType](https://code.visualstudio.com/api/references/vscode-api#window.createTextEditorDecorationType).

#### func (*TextEditorDecorationType) Dispose

```go
func (me *TextEditorDecorationType) Dispose() func(func())
```
Remove this decoration type and all decorations on all text editors using it.

`return` ── A thenable that resolves when this call has completed at the
counterparty.

#### func (*TextEditorDecorationType) Get

```go
func (me *TextEditorDecorationType) Get() func(func(TextEditorDecorationTypeBag))
```
Obtains this `TextEditorDecorationType`'s current property value for: `key`.

`return` ── A thenable that resolves when this call has completed at the
counterparty and its `TextEditorDecorationTypeBag` result obtained.

#### type TextEditorDecorationTypeBag

```go
type TextEditorDecorationTypeBag struct {
	// Internal representation of the handle.
	Key func() string `json:"-"`
}
```

TextEditorDecorationTypeBag is a snapshot of `TextEditorDecorationType` state at
the counterparty. It is obtained whenever `TextEditorDecorationType` creations
and method calls (incl. the dedicated `Get`) resolve or its event subscribers
are invoked, and therefore (to help always retain a factual view of the real
full-picture) should not be constructed manually. All read-only properties are
exposed as function-valued fields.

#### type ThemableDecorationAttachmentRenderOptions

```go
type ThemableDecorationAttachmentRenderOptions struct {
	// Defines a text content that is shown in the attachment. Either an icon or a text can be shown, but not both.
	ContentText string `json:"contentText,omitempty"`

	// An **absolute path** or an URI to an image to be rendered in the attachment. Either an icon
	// or a text can be shown, but not both.
	ContentIconPath string `json:"contentIconPath,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	Border string `json:"border,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	BorderColor string `json:"borderColor,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	FontStyle string `json:"fontStyle,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	FontWeight string `json:"fontWeight,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	TextDecoration string `json:"textDecoration,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	Color string `json:"color,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	BackgroundColor string `json:"backgroundColor,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	Margin string `json:"margin,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	Width string `json:"width,omitempty"`

	// CSS styling property that will be applied to the decoration attachment.
	Height string `json:"height,omitempty"`
}
```

Type Definition for Visual Studio Code 1.39 Extension API See
https://code.visualstudio.com/api for more information

#### type ThemableDecorationRenderOptions

```go
type ThemableDecorationRenderOptions struct {
	// Background color of the decoration. Use rgba() and define transparent background colors to play well with other decorations.
	// Alternatively a color from the color registry can be [referenced](https://code.visualstudio.com/api/references/vscode-api#ThemeColor).
	BackgroundColor string `json:"backgroundColor,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Outline string `json:"outline,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'outline' for setting one or more of the individual outline properties.
	OutlineColor string `json:"outlineColor,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'outline' for setting one or more of the individual outline properties.
	OutlineStyle string `json:"outlineStyle,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'outline' for setting one or more of the individual outline properties.
	OutlineWidth string `json:"outlineWidth,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Border string `json:"border,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderColor string `json:"borderColor,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderRadius string `json:"borderRadius,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderSpacing string `json:"borderSpacing,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderStyle string `json:"borderStyle,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	// Better use 'border' for setting one or more of the individual border properties.
	BorderWidth string `json:"borderWidth,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	FontStyle string `json:"fontStyle,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	FontWeight string `json:"fontWeight,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	TextDecoration string `json:"textDecoration,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Cursor string `json:"cursor,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Color string `json:"color,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	Opacity string `json:"opacity,omitempty"`

	// CSS styling property that will be applied to text enclosed by a decoration.
	LetterSpacing string `json:"letterSpacing,omitempty"`

	// An **absolute path** or an URI to an image to be rendered in the gutter.
	GutterIconPath string `json:"gutterIconPath,omitempty"`

	// Specifies the size of the gutter icon.
	// Available values are 'auto', 'contain', 'cover' and any percentage value.
	// For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx
	GutterIconSize string `json:"gutterIconSize,omitempty"`

	// The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations.
	OverviewRulerColor string `json:"overviewRulerColor,omitempty"`

	// Defines the rendering options of the attachment that is inserted before the decorated text.
	Before ThemableDecorationAttachmentRenderOptions `json:"before,omitempty"`

	// Defines the rendering options of the attachment that is inserted after the decorated text.
	After ThemableDecorationAttachmentRenderOptions `json:"after,omitempty"`
}
```

Represents theme specific rendering styles for a [text editor
decoration](https://code.visualstudio.com/api/references/vscode-api#TextEditorDecorationType).

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
	ShowInformationMessage1(message string, items []string) func(func(*string))

	// Show an information message to users. Optionally provide an array of items which will be presented as
	// clickable buttons.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowInformationMessage2(message string, options MessageOptions, items []string) func(func(*string))

	// Show an information message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowInformationMessage3(message string, items []MessageItem) func(func(*MessageItem))

	// Show an information message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowInformationMessage4(message string, options MessageOptions, items []MessageItem) func(func(*MessageItem))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage1(message string, items []string) func(func(*string))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage2(message string, options MessageOptions, items []string) func(func(*string))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage3(message string, items []MessageItem) func(func(*MessageItem))

	// Show a warning message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowWarningMessage4(message string, options MessageOptions, items []MessageItem) func(func(*MessageItem))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage1(message string, items []string) func(func(*string))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage2(message string, options MessageOptions, items []string) func(func(*string))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage3(message string, items []MessageItem) func(func(*MessageItem))

	// Show an error message.
	//
	// `message` ── The message to show.
	//
	// `options` ── Configures the behaviour of the message.
	//
	// `items` ── A set of items that will be rendered as actions in the message.
	//
	// `return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
	ShowErrorMessage4(message string, options MessageOptions, items []MessageItem) func(func(*MessageItem))

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
	// `items` ── An array of strings, or a promise that resolves to an array of strings.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `return` ── A promise that resolves to the selected items or `undefined`.
	ShowQuickPick1(items []string, options QuickPickOptions, token *Cancel) func(func([]string))

	// Shows a selection list.
	//
	// `items` ── An array of strings, or a promise that resolves to an array of strings.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `return` ── A promise that resolves to the selection or `undefined`.
	ShowQuickPick2(items []string, options *QuickPickOptions, token *Cancel) func(func(*string))

	// Shows a selection list allowing multiple selections.
	//
	// `items` ── An array of items, or a promise that resolves to an array of items.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `return` ── A promise that resolves to the selected items or `undefined`.
	ShowQuickPick3(items []QuickPickItem, options QuickPickOptions, token *Cancel) func(func([]QuickPickItem))

	// Shows a selection list.
	//
	// `items` ── An array of items, or a promise that resolves to an array of items.
	//
	// `options` ── Configures the behavior of the selection list.
	//
	// `token` ── A token that can be used to signal cancellation.
	//
	// `return` ── A promise that resolves to the selected item or `undefined`.
	ShowQuickPick4(items []QuickPickItem, options *QuickPickOptions, token *Cancel) func(func(*QuickPickItem))

	// Set a message to the status bar. This is a short hand for the more powerful
	// status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).
	//
	// `text` ── The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).
	//
	// `hideAfterTimeout` ── Timeout in milliseconds after which the message will be disposed.
	//
	// `return` ── A disposable which hides the status bar message.
	SetStatusBarMessage1(text string, hideAfterTimeout int) func(func(*Disposable))

	// Set a message to the status bar. This is a short hand for the more powerful
	// status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).
	//
	// *Note* that status bar messages stack and that they must be disposed when no
	// longer used.
	//
	// `text` ── The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).
	//
	// `return` ── A disposable which hides the status bar message.
	SetStatusBarMessage2(text string) func(func(*Disposable))

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
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its `WindowState` result obtained.
	State() func(func(WindowState))

	// An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the focus state of the current window
	// changes. The value of the event represents whether the window is focused.
	//
	// `listener` ── will be invoked whenever this event fires; mandatory, not optional.
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
	CreateStatusBarItem(alignment StatusBarAlignment, priority *int) func(func(StatusBarItem, StatusBarItemBag))

	// Creates a new [output channel](https://code.visualstudio.com/api/references/vscode-api#OutputChannel) with the given name.
	//
	// `name` ── Human-readable string which will be used to represent the channel in the UI.
	//
	// `return` ── A thenable that resolves to the newly created `OutputChannel`.
	CreateOutputChannel(name string) func(func(OutputChannel, OutputChannelBag))

	// Create a TextEditorDecorationType that can be used to add decorations to text editors.
	//
	// `options` ── Rendering options for the decoration type.
	//
	// `return` ── A new decoration type instance.
	CreateTextEditorDecorationType(options DecorationRenderOptions) func(func(TextEditorDecorationType, TextEditorDecorationTypeBag))

	// Creates a [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox) to let the user enter some text input.
	//
	// Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
	// is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
	// when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.
	//
	// `return` ── A new [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox).
	CreateInputBox() func(func(InputBox, InputBoxBag))

	// Creates a [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick) to let the user pick an item from a list
	// of items of type T.
	//
	// Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
	// is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
	// when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.
	//
	// `return` ── A new [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick).
	CreateQuickPick() func(func(QuickPick, QuickPickBag))
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
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
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
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
	WorkspaceFile() func(func(*string))

	// Save all dirty files.
	//
	// `includeUntitled` ── Also save files that have been created during this session.
	//
	// `return` ── A thenable that resolves when the files have been saved.
	SaveAll(includeUntitled bool) func(func(bool))

	// An event that is emitted when a workspace folder is added or removed.
	//
	// `listener` ── will be invoked whenever this event fires; mandatory, not optional.
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
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its result obtained.
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

	// Provides single-call access to numerous individual `Workspace` properties at once.
	//
	// `return` ── A thenable that resolves when this call has completed at the counterparty and its `WorkspaceBag` result obtained.
	AllProperties() func(func(WorkspaceBag))
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

#### type WorkspaceBag

```go
type WorkspaceBag struct {
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

WorkspaceBag gathers various properties of `Workspace`, obtainable via its
`AllProperties` method.

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
