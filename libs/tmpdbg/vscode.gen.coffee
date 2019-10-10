#
# NOTE, this is not a CoffeeScript file: the .coffee extension is solely
# for the convenience of syntax-highlighting in editors & source viewers.
#
# A debug-print of our in-memory-only intermediate-representation prepared
# for code-gens that choose to inherit from `gen-ast.Gen` to stay lean &
# mean & low on LoCs for maintainability & ease of porting & consistency.
#
# Again, all the below is just a debug-print: it's never to be parsed (and
# the in-mem IR never to be interpreted, other than for actual code-gen).
# Just a dump of all the structures available to a code-gen for emitting.
#




# vscode:
# Type Definition for Visual Studio Code 1.38 Extension API
# See https://code.visualstudio.com/api for more information
Vscode: interface

    # window:
    # Namespace for dealing with the current window of the editor. That is visible
    # and active editors, as well as, UI elements to show messages, selections, and
    # asking for user input.
    Window: Window

    # env:
    # Namespace describing the environment the editor runs in.
    Env: Env

    # workspace:
    # Namespace for dealing with the current workspace. A workspace is the representation
    # of the folder that has been opened. There is no workspace when just a file but not a
    # folder has been opened.
    # 
    # The workspace offers support for [listening](#workspace.createFileSystemWatcher) to fs
    # events and for [finding](#workspace.findFiles) files. Both perform well and run _outside_
    # the editor-process so that they should be always used instead of nodejs-equivalents.
    Workspace: Workspace

    # languages:
    # Namespace for participating in language-specific editor [features](https://code.visualstudio.com/docs/editor/editingevolved),
    # like IntelliSense, code actions, diagnostics etc.
    # 
    # Many programming languages exist and there is huge variety in syntaxes, semantics, and paradigms. Despite that, features
    # like automatic word-completion, code navigation, or code checking have become popular across different tools for different
    # programming languages.
    # 
    # The editor provides an API that makes it simple to provide such common features by having all UI and actions already in place and
    # by allowing you to participate by providing data only. For instance, to contribute a hover all you have to do is provide a function
    # that can be called with a [TextDocument](#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
    # mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
    # 
    # ```javascript
    # languages.registerHoverProvider('javascript', {
    #  	provideHover(document, position, token) {
    #  		return new Hover('I am a hover!');
    #  	}
    # });
    # ```
    # 
    # Registration is done using a [document selector](#DocumentSelector) which is either a language id, like `javascript` or
    # a more complex [filter](#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
    # a selector will result in a [score](#languages.match) that is used to determine if and how a provider shall be used. When
    # scores are equal the provider that came last wins. For features that allow full arity, like [hover](#languages.registerHoverProvider),
    # the score is only checked to be `>0`, for other features, like [IntelliSense](#languages.registerCompletionItemProvider) the
    # score is used for determining the order in which providers are asked to participate.
    Languages: Languages

    # extensions:
    # Namespace for dealing with installed extensions. Extensions are represented
    # by an [extension](#Extension)-interface which enables reflection on them.
    # 
    # Extension writers can provide APIs to other extensions by returning their API public
    # surface from the `activate`-call.
    # 
    # ```javascript
    # export function activate(context: vscode.ExtensionContext) {
    #  	let api = {
    #  		sum(a, b) {
    #  			return a + b;
    #  		},
    #  		mul(a, b) {
    #  			return a * b;
    #  		}
    #  	};
    #  	// 'export' public api-surface
    #  	return api;
    # }
    # ```
    # When depending on the API of another extension add an `extensionDependency`-entry
    # to `package.json`, and use the [getExtension](#extensions.getExtension)-function
    # and the [exports](#Extension.exports)-property, like below:
    # 
    # ```javascript
    # let mathExt = extensions.getExtension('genius.math');
    # let importedApi = mathExt.exports;
    # 
    # console.log(importedApi.mul(42, 1));
    # ```
    Extensions: Extensions

    # commands:
    # Namespace for dealing with commands. In short, a command is a function with a
    # unique identifier. The function is sometimes also called _command handler_.
    # 
    # Commands can be added to the editor using the [registerCommand](#commands.registerCommand)
    # and [registerTextEditorCommand](#commands.registerTextEditorCommand) functions. Commands
    # can be executed [manually](#commands.executeCommand) or from a UI gesture. Those are:
    # 
    # * palette - Use the `commands`-section in `package.json` to make a command show in
    # the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
    # * keybinding - Use the `keybindings`-section in `package.json` to enable
    # [keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
    # for your extension.
    # 
    # Commands from other extensions and from the editor itself are accessible to an extension. However,
    # when invoking an editor command not all argument types are supported.
    # 
    # This is a sample that registers a command handler and adds an entry for that command to the palette. First
    # register a command handler with the identifier `extension.sayHello`.
    # ```javascript
    # commands.registerCommand('extension.sayHello', () => {
    #  	window.showInformationMessage('Hello World!');
    # });
    # ```
    # Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
    # ```json
    # {
    #  	"contributes": {
    #  		"commands": [{
    #  			"command": "extension.sayHello",
    #  			"title": "Hello World"
    #  		}]
    #  	}
    # }
    # ```
    Commands: Commands




# window:
# Namespace for dealing with the current window of the editor. That is visible
# and active editors, as well as, UI elements to show messages, selections, and
# asking for user input.
Window: interface

    # showErrorMessage:
    # Show an error message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowErrorMessage1: void
        message: string
        items: [string]
        andThen: ?(?string->void)

    # showErrorMessage:
    # Show an error message.
    #
    # @message:
    # The message to show.
    #
    # @options:
    # Configures the behaviour of the message.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowErrorMessage2: void
        message: string
        options: MessageOptions
        items: [string]
        andThen: ?(?string->void)

    # showErrorMessage:
    # Show an error message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowErrorMessage3: void
        message: string
        items: [MessageItem]
        andThen: ?(?MessageItem->void)

    # showErrorMessage:
    # Show an error message.
    #
    # @message:
    # The message to show.
    #
    # @options:
    # Configures the behaviour of the message.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowErrorMessage4: void
        message: string
        options: MessageOptions
        items: [MessageItem]
        andThen: ?(?MessageItem->void)

    # showInformationMessage:
    # Show an information message to users. Optionally provide an array of items which will be presented as
    # clickable buttons.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowInformationMessage1: void
        message: string
        items: [string]
        andThen: ?(?string->void)

    # showInformationMessage:
    # Show an information message to users. Optionally provide an array of items which will be presented as
    # clickable buttons.
    #
    # @message:
    # The message to show.
    #
    # @options:
    # Configures the behaviour of the message.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowInformationMessage2: void
        message: string
        options: MessageOptions
        items: [string]
        andThen: ?(?string->void)

    # showInformationMessage:
    # Show an information message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowInformationMessage3: void
        message: string
        items: [MessageItem]
        andThen: ?(?MessageItem->void)

    # showInformationMessage:
    # Show an information message.
    #
    # @message:
    # The message to show.
    #
    # @options:
    # Configures the behaviour of the message.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowInformationMessage4: void
        message: string
        options: MessageOptions
        items: [MessageItem]
        andThen: ?(?MessageItem->void)

    # showWarningMessage:
    # Show a warning message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowWarningMessage1: void
        message: string
        items: [string]
        andThen: ?(?string->void)

    # showWarningMessage:
    # Show a warning message.
    #
    # @message:
    # The message to show.
    #
    # @options:
    # Configures the behaviour of the message.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowWarningMessage2: void
        message: string
        options: MessageOptions
        items: [string]
        andThen: ?(?string->void)

    # showWarningMessage:
    # Show a warning message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowWarningMessage3: void
        message: string
        items: [MessageItem]
        andThen: ?(?MessageItem->void)

    # showWarningMessage:
    # Show a warning message.
    #
    # @message:
    # The message to show.
    #
    # @options:
    # Configures the behaviour of the message.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @andThen:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowWarningMessage4: void
        message: string
        options: MessageOptions
        items: [MessageItem]
        andThen: ?(?MessageItem->void)

    # showInputBox:
    # Opens an input box to ask the user for input.
    # 
    # The returned value will be `undefined` if the input box was canceled (e.g. pressing ESC). Otherwise the
    # returned value will be the string typed by the user or an empty string if the user did not type
    # anything but dismissed the input box with OK.
    #
    # @options:
    # Configures the behavior of the input box.
    #
    # @token:
    # A token that can be used to signal cancellation.
    #
    # @andThen:
    # A promise that resolves to a string the user provided or to `undefined` in case of dismissal.
    ShowInputBox: void
        options: ?InputBoxOptions
        token: ?Cancel
        andThen: ?(?string->void)

    # showQuickPick:
    # Shows a selection list allowing multiple selections.
    #
    # @items:
    # An array of strings, or a promise that resolves to an array of strings.
    #
    # @options:
    # Configures the behavior of the selection list.
    #
    # @token:
    # A token that can be used to signal cancellation.
    #
    # @andThen:
    # A promise that resolves to the selected items or `undefined`.
    ShowQuickPick1: void
        items: [string]
        options: QuickPickOptions
        token: ?Cancel
        andThen: ?(?[string]->void)

    # showQuickPick:
    # Shows a selection list.
    #
    # @items:
    # An array of strings, or a promise that resolves to an array of strings.
    #
    # @options:
    # Configures the behavior of the selection list.
    #
    # @token:
    # A token that can be used to signal cancellation.
    #
    # @andThen:
    # A promise that resolves to the selection or `undefined`.
    ShowQuickPick2: void
        items: [string]
        options: ?QuickPickOptions
        token: ?Cancel
        andThen: ?(?string->void)

    # showQuickPick:
    # Shows a selection list allowing multiple selections.
    #
    # @items:
    # An array of items, or a promise that resolves to an array of items.
    #
    # @options:
    # Configures the behavior of the selection list.
    #
    # @token:
    # A token that can be used to signal cancellation.
    #
    # @andThen:
    # A promise that resolves to the selected items or `undefined`.
    ShowQuickPick3: void
        items: [QuickPickItem]
        options: QuickPickOptions
        token: ?Cancel
        andThen: ?(?[QuickPickItem]->void)

    # showQuickPick:
    # Shows a selection list.
    #
    # @items:
    # An array of items, or a promise that resolves to an array of items.
    #
    # @options:
    # Configures the behavior of the selection list.
    #
    # @token:
    # A token that can be used to signal cancellation.
    #
    # @andThen:
    # A promise that resolves to the selected item or `undefined`.
    ShowQuickPick4: void
        items: [QuickPickItem]
        options: ?QuickPickOptions
        token: ?Cancel
        andThen: ?(?QuickPickItem->void)

    # setStatusBarMessage:
    # Set a message to the status bar. This is a short hand for the more powerful
    # status bar [items](#window.createStatusBarItem).
    #
    # @text:
    # The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text).
    #
    # @hideAfterTimeout:
    # Timeout in milliseconds after which the message will be disposed.
    #
    # @andThen:
    # A disposable which hides the status bar message.
    SetStatusBarMessage1: void
        text: string
        hideAfterTimeout: int
        andThen: ?(?Disposable->void)

    # setStatusBarMessage:
    # Set a message to the status bar. This is a short hand for the more powerful
    # status bar [items](#window.createStatusBarItem).
    # 
    # *Note* that status bar messages stack and that they must be disposed when no
    # longer used.
    #
    # @text:
    # The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text).
    #
    # @andThen:
    # A disposable which hides the status bar message.
    SetStatusBarMessage2: void
        text: string
        andThen: ?(?Disposable->void)

    # showSaveDialog:
    # Shows a file save dialog to the user which allows to select a file
    # for saving-purposes.
    #
    # @options:
    # Options that control the dialog.
    #
    # @andThen:
    # A promise that resolves to the selected resource or `undefined`.
    ShowSaveDialog: void
        options: SaveDialogOptions
        andThen: ?(?string->void)

    # showOpenDialog:
    # Shows a file open dialog to the user which allows to select a file
    # for opening-purposes.
    #
    # @options:
    # Options that control the dialog.
    #
    # @andThen:
    # A promise that resolves to the selected resources or `undefined`.
    ShowOpenDialog: void
        options: OpenDialogOptions
        andThen: ?(?[string]->void)

    # showWorkspaceFolderPick:
    # Shows a selection list of [workspace folders](#workspace.workspaceFolders) to pick from.
    # Returns `undefined` if no folder is open.
    #
    # @options:
    # Configures the behavior of the workspace folder list.
    #
    # @andThen:
    # A promise that resolves to the workspace folder or `undefined`.
    ShowWorkspaceFolderPick: void
        options: ?WorkspaceFolderPickOptions
        andThen: ?(?WorkspaceFolder->void)

    # state:
    # Represents the current window's state.
    State: void
        andThen: ?(WindowState->void)

    # onDidChangeWindowState:
    # An [event](#Event) which fires when the focus state of the current window
    # changes. The value of the event represents whether the window is focused.
    OnDidChangeWindowState: void
        listener: (WindowState->void)
        andThen: ?(?Disposable->void)




# env:
# Namespace describing the environment the editor runs in.
Env: interface

    # openExternal:
    # Opens an *external* item, e.g. a http(s) or mailto-link, using the
    # default application.
    # 
    # *Note* that [`showTextDocument`](#window.showTextDocument) is the right
    # way to open a text document inside the editor, not this function.
    #
    # @target:
    # The uri that should be opened.
    #
    # @andThen:
    # A promise indicating if open was successful.
    OpenExternal: void
        target: string
        andThen: ?(bool->void)

    # appName:
    # The application name of the editor, like 'VS Code'.
    AppName: void
        andThen: ?(string->void)

    # appRoot:
    # The application root folder from which the editor is running.
    AppRoot: void
        andThen: ?(string->void)

    # language:
    # Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.
    Language: void
        andThen: ?(string->void)

    # machineId:
    # A unique identifier for the computer.
    MachineId: void
        andThen: ?(string->void)

    # remoteName:
    # The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
    # Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
    # 
    # *Note* that the value is `undefined` when there is no remote extension host but that the
    # value is defined in all extension hosts (local and remote) in case a remote extension host
    # exists. Use [`Extension#extensionKind`](#Extension.extensionKind) to know if
    # a specific extension runs remote or not.
    RemoteName: void
        andThen: ?(?string->void)

    # sessionId:
    # A unique identifier for the current session.
    # Changes each time the editor is started.
    SessionId: void
        andThen: ?(string->void)

    # shell:
    # The detected default shell for the extension host, this is overridden by the
    # `terminal.integrated.shell` setting for the extension host's platform.
    Shell: void
        andThen: ?(string->void)

    # uriScheme:
    # The custom uri scheme the editor registers to in the operating system.
    UriScheme: void
        andThen: ?(string->void)

    # Provides single-call access to numerous individual `Env` properties at once.
    Properties: void
        andThen: (EnvProperties->void)




# workspace:
# Namespace for dealing with the current workspace. A workspace is the representation
# of the folder that has been opened. There is no workspace when just a file but not a
# folder has been opened.
# 
# The workspace offers support for [listening](#workspace.createFileSystemWatcher) to fs
# events and for [finding](#workspace.findFiles) files. Both perform well and run _outside_
# the editor-process so that they should be always used instead of nodejs-equivalents.
Workspace: interface

    # name:
    # The name of the workspace. `undefined` when no folder
    # has been opened.
    Name: void
        andThen: ?(?string->void)

    # saveAll:
    # Save all dirty files.
    #
    # @includeUntitled:
    # Also save files that have been created during this session.
    #
    # @andThen:
    # A thenable that resolves when the files have been saved.
    SaveAll: void
        includeUntitled: bool
        andThen: ?(bool->void)

    # onDidChangeWorkspaceFolders:
    # An event that is emitted when a workspace folder is added or removed.
    OnDidChangeWorkspaceFolders: void
        listener: (WorkspaceFoldersChangeEvent->void)
        andThen: ?(?Disposable->void)




# languages:
# Namespace for participating in language-specific editor [features](https://code.visualstudio.com/docs/editor/editingevolved),
# like IntelliSense, code actions, diagnostics etc.
# 
# Many programming languages exist and there is huge variety in syntaxes, semantics, and paradigms. Despite that, features
# like automatic word-completion, code navigation, or code checking have become popular across different tools for different
# programming languages.
# 
# The editor provides an API that makes it simple to provide such common features by having all UI and actions already in place and
# by allowing you to participate by providing data only. For instance, to contribute a hover all you have to do is provide a function
# that can be called with a [TextDocument](#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
# mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
# 
# ```javascript
# languages.registerHoverProvider('javascript', {
#  	provideHover(document, position, token) {
#  		return new Hover('I am a hover!');
#  	}
# });
# ```
# 
# Registration is done using a [document selector](#DocumentSelector) which is either a language id, like `javascript` or
# a more complex [filter](#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
# a selector will result in a [score](#languages.match) that is used to determine if and how a provider shall be used. When
# scores are equal the provider that came last wins. For features that allow full arity, like [hover](#languages.registerHoverProvider),
# the score is only checked to be `>0`, for other features, like [IntelliSense](#languages.registerCompletionItemProvider) the
# score is used for determining the order in which providers are asked to participate.
Languages: interface

    # getLanguages:
    # Return the identifiers of all known languages.
    #
    # @andThen:
    # Promise resolving to an array of identifier strings.
    GetLanguages: void
        andThen: ?(?[string]->void)

    # onDidChangeDiagnostics:
    # An [event](#Event) which fires when the global set of diagnostics changes. This is
    # newly added and removed diagnostics.
    OnDidChangeDiagnostics: void
        listener: (DiagnosticChangeEvent->void)
        andThen: ?(?Disposable->void)




# extensions:
# Namespace for dealing with installed extensions. Extensions are represented
# by an [extension](#Extension)-interface which enables reflection on them.
# 
# Extension writers can provide APIs to other extensions by returning their API public
# surface from the `activate`-call.
# 
# ```javascript
# export function activate(context: vscode.ExtensionContext) {
#  	let api = {
#  		sum(a, b) {
#  			return a + b;
#  		},
#  		mul(a, b) {
#  			return a * b;
#  		}
#  	};
#  	// 'export' public api-surface
#  	return api;
# }
# ```
# When depending on the API of another extension add an `extensionDependency`-entry
# to `package.json`, and use the [getExtension](#extensions.getExtension)-function
# and the [exports](#Extension.exports)-property, like below:
# 
# ```javascript
# let mathExt = extensions.getExtension('genius.math');
# let importedApi = mathExt.exports;
# 
# console.log(importedApi.mul(42, 1));
# ```
Extensions: interface

    # onDidChange:
    # An event which fires when `extensions.all` changes. This can happen when extensions are
    # installed, uninstalled, enabled or disabled.
    OnDidChange: void
        listener: (->void)
        andThen: ?(?Disposable->void)




# commands:
# Namespace for dealing with commands. In short, a command is a function with a
# unique identifier. The function is sometimes also called _command handler_.
# 
# Commands can be added to the editor using the [registerCommand](#commands.registerCommand)
# and [registerTextEditorCommand](#commands.registerTextEditorCommand) functions. Commands
# can be executed [manually](#commands.executeCommand) or from a UI gesture. Those are:
# 
# * palette - Use the `commands`-section in `package.json` to make a command show in
# the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
# * keybinding - Use the `keybindings`-section in `package.json` to enable
# [keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
# for your extension.
# 
# Commands from other extensions and from the editor itself are accessible to an extension. However,
# when invoking an editor command not all argument types are supported.
# 
# This is a sample that registers a command handler and adds an entry for that command to the palette. First
# register a command handler with the identifier `extension.sayHello`.
# ```javascript
# commands.registerCommand('extension.sayHello', () => {
#  	window.showInformationMessage('Hello World!');
# });
# ```
# Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
# ```json
# {
#  	"contributes": {
#  		"commands": [{
#  			"command": "extension.sayHello",
#  			"title": "Hello World"
#  		}]
#  	}
# }
# ```
Commands: interface

    # getCommands:
    # Retrieve the list of all available commands. Commands starting an underscore are
    # treated as internal commands.
    #
    # @filterInternal:
    # Set `true` to not see internal commands (starting with an underscore)
    #
    # @andThen:
    # Thenable that resolves to a list of command ids.
    GetCommands: void
        filterInternal: bool
        andThen: ?(?[string]->void)




# Options to configure the behavior of the message.
MessageOptions: class

    # modal:
    # Indicates that this message should be modal.
    #
    # JSON FLAGS: {"Name":"modal","Required":false,"Excluded":false}
    Modal: ?bool




# Represents an action that is shown with an information, warning, or
# error message.
MessageItem: class

    # title:
    # A short title like 'Retry', 'Open Log' etc.
    #
    # JSON FLAGS: {"Name":"title","Required":true,"Excluded":false}
    Title: string

    # isCloseAffordance:
    # A hint for modal dialogs that the item should be triggered
    # when the user cancels the dialog (e.g. by pressing the ESC
    # key).
    # 
    # Note: this option is ignored for non-modal messages.
    #
    # JSON FLAGS: {"Name":"isCloseAffordance","Required":false,"Excluded":false}
    IsCloseAffordance: ?bool

    # my:
    # Free-form custom data, preserved across a roundtrip.
    #
    # JSON FLAGS: {"Name":"my","Required":false,"Excluded":false}
    My: ?dict




# Options to configure the behavior of the input box UI.
InputBoxOptions: class

    # value:
    # The value to prefill in the input box.
    #
    # JSON FLAGS: {"Name":"value","Required":false,"Excluded":false}
    Value: ?string

    # valueSelection:
    # Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
    # first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
    # word will be selected, when empty (start equals end) only the cursor will be set,
    # otherwise the defined range will be selected.
    #
    # JSON FLAGS: {"Name":"valueSelection","Required":false,"Excluded":false}
    ValueSelection: ?[int,int]

    # prompt:
    # The text to display underneath the input box.
    #
    # JSON FLAGS: {"Name":"prompt","Required":false,"Excluded":false}
    Prompt: ?string

    # placeHolder:
    # An optional string to show as place holder in the input box to guide the user what to type.
    #
    # JSON FLAGS: {"Name":"placeHolder","Required":false,"Excluded":false}
    PlaceHolder: ?string

    # password:
    # Set to `true` to show a password prompt that will not show the typed value.
    #
    # JSON FLAGS: {"Name":"password","Required":false,"Excluded":false}
    Password: ?bool

    # ignoreFocusOut:
    # Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.
    #
    # JSON FLAGS: {"Name":"ignoreFocusOut","Required":false,"Excluded":false}
    IgnoreFocusOut: ?bool

    # validateInput:
    # An optional function that will be called to validate input and to give a hint
    # to the user.
    # 
    # `value` ── The current value of the input box.
    # 
    # `return` ── A human readable string which is presented as diagnostic message.
    # Return `undefined`, `null`, or the empty string when 'value' is valid.
    #
    # JSON FLAGS: {"Name":"validateInput","Required":false,"Excluded":true}
    ValidateInput: ?(string->string)

    # For internal runtime use only.
    #
    # JSON FLAGS: {"Name":"validateInput_AppzFuncId","Required":false,"Excluded":false}
    ValidateInput_AppzFuncId: string




# Options to configure the behavior of the quick pick UI.
QuickPickOptions: class

    # matchOnDescription:
    # An optional flag to include the description when filtering the picks.
    #
    # JSON FLAGS: {"Name":"matchOnDescription","Required":false,"Excluded":false}
    MatchOnDescription: ?bool

    # matchOnDetail:
    # An optional flag to include the detail when filtering the picks.
    #
    # JSON FLAGS: {"Name":"matchOnDetail","Required":false,"Excluded":false}
    MatchOnDetail: ?bool

    # placeHolder:
    # An optional string to show as place holder in the input box to guide the user what to pick on.
    #
    # JSON FLAGS: {"Name":"placeHolder","Required":false,"Excluded":false}
    PlaceHolder: ?string

    # ignoreFocusOut:
    # Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.
    #
    # JSON FLAGS: {"Name":"ignoreFocusOut","Required":false,"Excluded":false}
    IgnoreFocusOut: ?bool

    # canPickMany:
    # An optional flag to make the picker accept multiple selections, if true the result is an array of picks.
    #
    # JSON FLAGS: {"Name":"canPickMany","Required":false,"Excluded":false}
    CanPickMany: ?bool

    # onDidSelectItem:
    # An optional function that is invoked whenever an item is selected.
    #
    # JSON FLAGS: {"Name":"onDidSelectItem","Required":false,"Excluded":true}
    OnDidSelectItem: ?(QuickPickItem->any)

    # For internal runtime use only.
    #
    # JSON FLAGS: {"Name":"onDidSelectItem_AppzFuncId","Required":false,"Excluded":false}
    OnDidSelectItem_AppzFuncId: string




# Represents an item that can be selected from
# a list of items.
QuickPickItem: class

    # label:
    # A human readable string which is rendered prominent.
    #
    # JSON FLAGS: {"Name":"label","Required":true,"Excluded":false}
    Label: string

    # description:
    # A human readable string which is rendered less prominent.
    #
    # JSON FLAGS: {"Name":"description","Required":false,"Excluded":false}
    Description: ?string

    # detail:
    # A human readable string which is rendered less prominent.
    #
    # JSON FLAGS: {"Name":"detail","Required":false,"Excluded":false}
    Detail: ?string

    # picked:
    # Optional flag indicating if this item is picked initially.
    # (Only honored when the picker allows multiple selections.)
    #
    # JSON FLAGS: {"Name":"picked","Required":false,"Excluded":false}
    Picked: ?bool

    # alwaysShow:
    # Always show this item.
    #
    # JSON FLAGS: {"Name":"alwaysShow","Required":false,"Excluded":false}
    AlwaysShow: ?bool

    # my:
    # Free-form custom data, preserved across a roundtrip.
    #
    # JSON FLAGS: {"Name":"my","Required":false,"Excluded":false}
    My: ?dict




# Options to configure the behaviour of a file save dialog.
SaveDialogOptions: class

    # saveLabel:
    # A human-readable string for the save button.
    #
    # JSON FLAGS: {"Name":"saveLabel","Required":false,"Excluded":false}
    SaveLabel: ?string

    # filters:
    # A set of file filters that are used by the dialog. Each entry is a human readable label,
    # like "TypeScript", and an array of extensions, e.g.
    # ```ts
    # {
    #  	'Images': ['png', 'jpg']
    #  	'TypeScript': ['ts', 'tsx']
    # }
    # ```
    #
    # JSON FLAGS: {"Name":"filters","Required":false,"Excluded":false}
    Filters: ?[[string]]




# Options to configure the behaviour of a file open dialog.
# 
# * Note 1: A dialog can select files, folders, or both. This is not true for Windows
# which enforces to open either files or folder, but *not both*.
# * Note 2: Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
# and the editor then silently adjusts the options to select files.
OpenDialogOptions: class

    # openLabel:
    # A human-readable string for the open button.
    #
    # JSON FLAGS: {"Name":"openLabel","Required":false,"Excluded":false}
    OpenLabel: ?string

    # canSelectFiles:
    # Allow to select files, defaults to `true`.
    #
    # JSON FLAGS: {"Name":"canSelectFiles","Required":false,"Excluded":false}
    CanSelectFiles: ?bool

    # canSelectFolders:
    # Allow to select folders, defaults to `false`.
    #
    # JSON FLAGS: {"Name":"canSelectFolders","Required":false,"Excluded":false}
    CanSelectFolders: ?bool

    # canSelectMany:
    # Allow to select many files or folders.
    #
    # JSON FLAGS: {"Name":"canSelectMany","Required":false,"Excluded":false}
    CanSelectMany: ?bool

    # filters:
    # A set of file filters that are used by the dialog. Each entry is a human readable label,
    # like "TypeScript", and an array of extensions, e.g.
    # ```ts
    # {
    #  	'Images': ['png', 'jpg']
    #  	'TypeScript': ['ts', 'tsx']
    # }
    # ```
    #
    # JSON FLAGS: {"Name":"filters","Required":false,"Excluded":false}
    Filters: ?[[string]]




# Options to configure the behaviour of the [workspace folder](#WorkspaceFolder) pick UI.
WorkspaceFolderPickOptions: class

    # placeHolder:
    # An optional string to show as place holder in the input box to guide the user what to pick on.
    #
    # JSON FLAGS: {"Name":"placeHolder","Required":false,"Excluded":false}
    PlaceHolder: ?string

    # ignoreFocusOut:
    # Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.
    #
    # JSON FLAGS: {"Name":"ignoreFocusOut","Required":false,"Excluded":false}
    IgnoreFocusOut: ?bool




# A workspace folder is one of potentially many roots opened by the editor. All workspace folders
# are equal which means there is no notion of an active or master workspace folder.
WorkspaceFolder: class

    # uri:
    # The associated uri for this workspace folder.
    # 
    # *Note:* The [Uri](#Uri)-type was intentionally chosen such that future releases of the editor can support
    # workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.
    #
    # JSON FLAGS: {"Name":"uri","Required":true,"Excluded":false}
    Uri: string

    # name:
    # The name of this workspace folder. Defaults to
    # the basename of its [uri-path](#Uri.path)
    #
    # JSON FLAGS: {"Name":"name","Required":true,"Excluded":false}
    Name: string

    # index:
    # The ordinal number of this workspace folder.
    #
    # JSON FLAGS: {"Name":"index","Required":true,"Excluded":false}
    Index: int




# Represents the state of a window.
WindowState: class

    # focused:
    # Whether the current window is focused.
    #
    # JSON FLAGS: {"Name":"focused","Required":true,"Excluded":false}
    Focused: bool




# An event describing a change to the set of [workspace folders](#workspace.workspaceFolders).
WorkspaceFoldersChangeEvent: class

    # added:
    # Added workspace folders.
    #
    # JSON FLAGS: {"Name":"added","Required":true,"Excluded":false}
    Added: [WorkspaceFolder]

    # removed:
    # Removed workspace folders.
    #
    # JSON FLAGS: {"Name":"removed","Required":true,"Excluded":false}
    Removed: [WorkspaceFolder]




# The event that is fired when diagnostics change.
DiagnosticChangeEvent: class

    # uris:
    # An array of resources for which diagnostics have changed.
    #
    # JSON FLAGS: {"Name":"uris","Required":true,"Excluded":false}
    Uris: [string]




# envProperties:
# Namespace describing the environment the editor runs in.
EnvProperties: class

    # appName:
    # The application name of the editor, like 'VS Code'.
    #
    # JSON FLAGS: {"Name":"appName","Required":false,"Excluded":false}
    AppName: ?string

    # appRoot:
    # The application root folder from which the editor is running.
    #
    # JSON FLAGS: {"Name":"appRoot","Required":false,"Excluded":false}
    AppRoot: ?string

    # language:
    # Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.
    #
    # JSON FLAGS: {"Name":"language","Required":false,"Excluded":false}
    Language: ?string

    # machineId:
    # A unique identifier for the computer.
    #
    # JSON FLAGS: {"Name":"machineId","Required":false,"Excluded":false}
    MachineId: ?string

    # remoteName:
    # The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
    # Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
    # 
    # *Note* that the value is `undefined` when there is no remote extension host but that the
    # value is defined in all extension hosts (local and remote) in case a remote extension host
    # exists. Use [`Extension#extensionKind`](#Extension.extensionKind) to know if
    # a specific extension runs remote or not.
    #
    # JSON FLAGS: {"Name":"remoteName","Required":false,"Excluded":false}
    RemoteName: ?string

    # sessionId:
    # A unique identifier for the current session.
    # Changes each time the editor is started.
    #
    # JSON FLAGS: {"Name":"sessionId","Required":false,"Excluded":false}
    SessionId: ?string

    # shell:
    # The detected default shell for the extension host, this is overridden by the
    # `terminal.integrated.shell` setting for the extension host's platform.
    #
    # JSON FLAGS: {"Name":"shell","Required":false,"Excluded":false}
    Shell: ?string

    # uriScheme:
    # The custom uri scheme the editor registers to in the operating system.
    #
    # JSON FLAGS: {"Name":"uriScheme","Required":false,"Excluded":false}
    UriScheme: ?string




Vscode·Window: ( -> Window)
    return ((this)·(implWindow))




Vscode·Env: ( -> Env)
    return ((this)·(implEnv))




Vscode·Workspace: ( -> Workspace)
    return ((this)·(implWorkspace))




Vscode·Languages: ( -> Languages)
    return ((this)·(implLanguages))




Vscode·Extensions: ( -> Extensions)
    return ((this)·(implExtensions))




Vscode·Commands: ( -> Commands)
    return ((this)·(implCommands))




Window·ShowErrorMessage1: (message:string -> items:[string] -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showErrorMessage1"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowErrorMessage2: (message:string -> options:MessageOptions -> items:[string] -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showErrorMessage2"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowErrorMessage3: (message:string -> items:[MessageItem] -> andThen:?(?MessageItem->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showErrorMessage3"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?MessageItem
            if (=?payload)
                result = ?MessageItem·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowErrorMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> andThen:?(?MessageItem->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showErrorMessage4"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?MessageItem
            if (=?payload)
                result = ?MessageItem·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowInformationMessage1: (message:string -> items:[string] -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInformationMessage1"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowInformationMessage2: (message:string -> options:MessageOptions -> items:[string] -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInformationMessage2"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowInformationMessage3: (message:string -> items:[MessageItem] -> andThen:?(?MessageItem->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInformationMessage3"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?MessageItem
            if (=?payload)
                result = ?MessageItem·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowInformationMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> andThen:?(?MessageItem->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInformationMessage4"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?MessageItem
            if (=?payload)
                result = ?MessageItem·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowWarningMessage1: (message:string -> items:[string] -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWarningMessage1"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowWarningMessage2: (message:string -> options:MessageOptions -> items:[string] -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWarningMessage2"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowWarningMessage3: (message:string -> items:[MessageItem] -> andThen:?(?MessageItem->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWarningMessage3"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?MessageItem
            if (=?payload)
                result = ?MessageItem·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowWarningMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> andThen:?(?MessageItem->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWarningMessage4"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?MessageItem
            if (=?payload)
                result = ?MessageItem·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowInputBox: (options:?InputBoxOptions -> token:?Cancel -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInputBox"
    msg.Data = dict·new(2)
    var fnids of [string]
    fnids = [string]·new(1)
    if (=?options)
        options.ValidateInput_AppzFuncId = ""
        var fn of ?(string->string)
        fn = options.ValidateInput
        if (=?fn)
            lock this
                options.ValidateInput_AppzFuncId = this.nextFuncId()
                fnids·add(options.ValidateInput_AppzFuncId)
                this.cbOther@options.ValidateInput_AppzFuncId = (args:[any] -> [any,bool])
                    if (1 != args·len)
                        return [null,false]
                    else
                        var ok of bool
                        var __0 of string
                        if (=?args@0)
                            [__0,ok] = ((args@0)·(string))
                            if (!ok)
                                return [null,false]
                        return [fn(__0),true]
                
    msg.Data@"options" = options
    if (=?token)
        token.impl = this.Impl()
        if ("" == token.fnId)
            lock this
                token.fnId = this.nextFuncId()
        msg.Data@"token" = token.fnId
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, (payload:any -> bool)
        if (fnids·len != 0)
            lock this
                for fnid in fnids
                    this.cbOther·del(fnid)
        return ((=!on) || on(payload))
    )




Window·ShowQuickPick1: (items:[string] -> options:QuickPickOptions -> token:?Cancel -> andThen:?(?[string]->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showQuickPick1"
    msg.Data = dict·new(3)
    var fnids of [string]
    fnids = [string]·new(1)
    if true
        options.OnDidSelectItem_AppzFuncId = ""
        var fn of ?(QuickPickItem->any)
        fn = options.OnDidSelectItem
        if (=?fn)
            lock this
                options.OnDidSelectItem_AppzFuncId = this.nextFuncId()
                fnids·add(options.OnDidSelectItem_AppzFuncId)
                this.cbOther@options.OnDidSelectItem_AppzFuncId = (args:[any] -> [any,bool])
                    if (1 != args·len)
                        return [null,false]
                    else
                        var ok of bool
                        var __0 of QuickPickItem
                        if (=?args@0)
                            __0 = QuickPickItem·new
                            ok = __0.populateFrom(args@0)
                            if (!ok)
                                return [null,false]
                        else
                            return [null,false]
                        return [fn(__0),true]
                
    msg.Data@"items" = items
    options.CanPickMany = true
    msg.Data@"options" = options
    if (=?token)
        token.impl = this.Impl()
        if ("" == token.fnId)
            lock this
                token.fnId = this.nextFuncId()
        msg.Data@"token" = token.fnId
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?[string]
            if (=?payload)
                var __coll__result of [any]
                [__coll__result,ok] = ((payload)·([any]))
                if (!ok)
                    return false
                result = [string]·new(__coll__result·len)
                var __idx__result of int
                __idx__result = 0
                for __item__result in __coll__result
                    var __val__result of string
                    [__val__result,ok] = ((__item__result)·(string))
                    if (!ok)
                        return false
                    result@__idx__result = __val__result
                    __idx__result = (__idx__result + 1)
            andThen(result)
            return true
        
    this.send(msg, (payload:any -> bool)
        if (fnids·len != 0)
            lock this
                for fnid in fnids
                    this.cbOther·del(fnid)
        return ((=!on) || on(payload))
    )




Window·ShowQuickPick2: (items:[string] -> options:?QuickPickOptions -> token:?Cancel -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showQuickPick2"
    msg.Data = dict·new(3)
    var fnids of [string]
    fnids = [string]·new(1)
    if (=?options)
        options.OnDidSelectItem_AppzFuncId = ""
        var fn of ?(QuickPickItem->any)
        fn = options.OnDidSelectItem
        if (=?fn)
            lock this
                options.OnDidSelectItem_AppzFuncId = this.nextFuncId()
                fnids·add(options.OnDidSelectItem_AppzFuncId)
                this.cbOther@options.OnDidSelectItem_AppzFuncId = (args:[any] -> [any,bool])
                    if (1 != args·len)
                        return [null,false]
                    else
                        var ok of bool
                        var __0 of QuickPickItem
                        if (=?args@0)
                            __0 = QuickPickItem·new
                            ok = __0.populateFrom(args@0)
                            if (!ok)
                                return [null,false]
                        else
                            return [null,false]
                        return [fn(__0),true]
                
    msg.Data@"items" = items
    msg.Data@"options" = options
    if (=?token)
        token.impl = this.Impl()
        if ("" == token.fnId)
            lock this
                token.fnId = this.nextFuncId()
        msg.Data@"token" = token.fnId
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, (payload:any -> bool)
        if (fnids·len != 0)
            lock this
                for fnid in fnids
                    this.cbOther·del(fnid)
        return ((=!on) || on(payload))
    )




Window·ShowQuickPick3: (items:[QuickPickItem] -> options:QuickPickOptions -> token:?Cancel -> andThen:?(?[QuickPickItem]->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showQuickPick3"
    msg.Data = dict·new(3)
    var fnids of [string]
    fnids = [string]·new(1)
    if true
        options.OnDidSelectItem_AppzFuncId = ""
        var fn of ?(QuickPickItem->any)
        fn = options.OnDidSelectItem
        if (=?fn)
            lock this
                options.OnDidSelectItem_AppzFuncId = this.nextFuncId()
                fnids·add(options.OnDidSelectItem_AppzFuncId)
                this.cbOther@options.OnDidSelectItem_AppzFuncId = (args:[any] -> [any,bool])
                    if (1 != args·len)
                        return [null,false]
                    else
                        var ok of bool
                        var __0 of QuickPickItem
                        if (=?args@0)
                            __0 = QuickPickItem·new
                            ok = __0.populateFrom(args@0)
                            if (!ok)
                                return [null,false]
                        else
                            return [null,false]
                        return [fn(__0),true]
                
    msg.Data@"items" = items
    options.CanPickMany = true
    msg.Data@"options" = options
    if (=?token)
        token.impl = this.Impl()
        if ("" == token.fnId)
            lock this
                token.fnId = this.nextFuncId()
        msg.Data@"token" = token.fnId
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?[QuickPickItem]
            if (=?payload)
                var __coll__result of [any]
                [__coll__result,ok] = ((payload)·([any]))
                if (!ok)
                    return false
                result = [QuickPickItem]·new(__coll__result·len)
                var __idx__result of int
                __idx__result = 0
                for __item__result in __coll__result
                    var __val__result of QuickPickItem
                    __val__result = QuickPickItem·new
                    ok = __val__result.populateFrom(__item__result)
                    if (!ok)
                        return false
                    result@__idx__result = __val__result
                    __idx__result = (__idx__result + 1)
            andThen(result)
            return true
        
    this.send(msg, (payload:any -> bool)
        if (fnids·len != 0)
            lock this
                for fnid in fnids
                    this.cbOther·del(fnid)
        return ((=!on) || on(payload))
    )




Window·ShowQuickPick4: (items:[QuickPickItem] -> options:?QuickPickOptions -> token:?Cancel -> andThen:?(?QuickPickItem->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showQuickPick4"
    msg.Data = dict·new(3)
    var fnids of [string]
    fnids = [string]·new(1)
    if (=?options)
        options.OnDidSelectItem_AppzFuncId = ""
        var fn of ?(QuickPickItem->any)
        fn = options.OnDidSelectItem
        if (=?fn)
            lock this
                options.OnDidSelectItem_AppzFuncId = this.nextFuncId()
                fnids·add(options.OnDidSelectItem_AppzFuncId)
                this.cbOther@options.OnDidSelectItem_AppzFuncId = (args:[any] -> [any,bool])
                    if (1 != args·len)
                        return [null,false]
                    else
                        var ok of bool
                        var __0 of QuickPickItem
                        if (=?args@0)
                            __0 = QuickPickItem·new
                            ok = __0.populateFrom(args@0)
                            if (!ok)
                                return [null,false]
                        else
                            return [null,false]
                        return [fn(__0),true]
                
    msg.Data@"items" = items
    msg.Data@"options" = options
    if (=?token)
        token.impl = this.Impl()
        if ("" == token.fnId)
            lock this
                token.fnId = this.nextFuncId()
        msg.Data@"token" = token.fnId
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?QuickPickItem
            if (=?payload)
                result = ?QuickPickItem·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, (payload:any -> bool)
        if (fnids·len != 0)
            lock this
                for fnid in fnids
                    this.cbOther·del(fnid)
        return ((=!on) || on(payload))
    )




Window·SetStatusBarMessage1: (text:string -> hideAfterTimeout:int -> andThen:?(?Disposable->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.setStatusBarMessage1"
    msg.Data = dict·new(2)
    msg.Data@"text" = text
    msg.Data@"hideAfterTimeout" = hideAfterTimeout
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?Disposable
            if (=?payload)
                result = ?Disposable·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            else
                return false
            andThen(result.bind(this.Impl(), ""))
            return true
        
    this.send(msg, on)




Window·SetStatusBarMessage2: (text:string -> andThen:?(?Disposable->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.setStatusBarMessage2"
    msg.Data = dict·new(1)
    msg.Data@"text" = text
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?Disposable
            if (=?payload)
                result = ?Disposable·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            else
                return false
            andThen(result.bind(this.Impl(), ""))
            return true
        
    this.send(msg, on)




Window·ShowSaveDialog: (options:SaveDialogOptions -> andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showSaveDialog"
    msg.Data = dict·new(1)
    msg.Data@"options" = options
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowOpenDialog: (options:OpenDialogOptions -> andThen:?(?[string]->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showOpenDialog"
    msg.Data = dict·new(1)
    msg.Data@"options" = options
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?[string]
            if (=?payload)
                var __coll__result of [any]
                [__coll__result,ok] = ((payload)·([any]))
                if (!ok)
                    return false
                result = [string]·new(__coll__result·len)
                var __idx__result of int
                __idx__result = 0
                for __item__result in __coll__result
                    var __val__result of string
                    [__val__result,ok] = ((__item__result)·(string))
                    if (!ok)
                        return false
                    result@__idx__result = __val__result
                    __idx__result = (__idx__result + 1)
            andThen(result)
            return true
        
    this.send(msg, on)




Window·ShowWorkspaceFolderPick: (options:?WorkspaceFolderPickOptions -> andThen:?(?WorkspaceFolder->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWorkspaceFolderPick"
    msg.Data = dict·new(1)
    msg.Data@"options" = options
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?WorkspaceFolder
            if (=?payload)
                result = ?WorkspaceFolder·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Window·State: (andThen:?(WindowState->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.state"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of WindowState
            if (=?payload)
                result = WindowState·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Window·OnDidChangeWindowState: (listener:(WindowState->void) -> andThen:?(?Disposable->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.onDidChangeWindowState"
    msg.Data = dict·new(1)
    var _fnid_listener of string
    if (=!listener)
        OnError(this, "Window.OnDidChangeWindowState: the 'listener' arg (which is not optional but required) was not passed by the caller", null)
        return 
    _fnid_listener = this.nextSub((args:[any] -> bool)
        var ok of bool
        if (1 != args·len)
            return ok
        var _a_0_ of WindowState
        _a_0_ = WindowState·new
        ok = _a_0_.populateFrom(args@0)
        if (!ok)
            return false
        listener(_a_0_)
        return true
    )
    msg.Data@"listener" = _fnid_listener
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?Disposable
            if (=?payload)
                result = ?Disposable·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            else
                return false
            andThen(result.bind(this.Impl(), _fnid_listener))
            return true
        
    this.send(msg, on)




Env·OpenExternal: (target:string -> andThen:?(bool->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.openExternal"
    msg.Data = dict·new(1)
    msg.Data@"target" = target
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of bool
            if (=?payload)
                [result,ok] = ((payload)·(bool))
                if (!ok)
                    return false
            else
                return false
            andThen(result)
            return true
        
    this.send(msg, on)




Env·AppName: (andThen:?(string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.appName"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of string
            if (=?payload)
                [result,ok] = ((payload)·(string))
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Env·AppRoot: (andThen:?(string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.appRoot"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of string
            if (=?payload)
                [result,ok] = ((payload)·(string))
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Env·Language: (andThen:?(string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.language"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of string
            if (=?payload)
                [result,ok] = ((payload)·(string))
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Env·MachineId: (andThen:?(string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.machineId"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of string
            if (=?payload)
                [result,ok] = ((payload)·(string))
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Env·RemoteName: (andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.remoteName"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Env·SessionId: (andThen:?(string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.sessionId"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of string
            if (=?payload)
                [result,ok] = ((payload)·(string))
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Env·Shell: (andThen:?(string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.shell"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of string
            if (=?payload)
                [result,ok] = ((payload)·(string))
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Env·UriScheme: (andThen:?(string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.uriScheme"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of string
            if (=?payload)
                [result,ok] = ((payload)·(string))
                if (!ok)
                    return false
            andThen(result)
            return true
        
    this.send(msg, on)




Env·Properties: (andThen:(EnvProperties->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.Properties"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of EnvProperties
            if (=?payload)
                result = EnvProperties·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            else
                return false
            andThen(result)
            return true
        
    this.send(msg, on)




Workspace·Name: (andThen:?(?string->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.name"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?string
            if (=?payload)
                var _result_ of string
                [_result_,ok] = ((payload)·(string))
                if (!ok)
                    return false
                result = (&_result_)
            andThen(result)
            return true
        
    this.send(msg, on)




Workspace·SaveAll: (includeUntitled:bool -> andThen:?(bool->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.saveAll"
    msg.Data = dict·new(1)
    msg.Data@"includeUntitled" = includeUntitled
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of bool
            if (=?payload)
                [result,ok] = ((payload)·(bool))
                if (!ok)
                    return false
            else
                return false
            andThen(result)
            return true
        
    this.send(msg, on)




Workspace·OnDidChangeWorkspaceFolders: (listener:(WorkspaceFoldersChangeEvent->void) -> andThen:?(?Disposable->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.onDidChangeWorkspaceFolders"
    msg.Data = dict·new(1)
    var _fnid_listener of string
    if (=!listener)
        OnError(this, "Workspace.OnDidChangeWorkspaceFolders: the 'listener' arg (which is not optional but required) was not passed by the caller", null)
        return 
    _fnid_listener = this.nextSub((args:[any] -> bool)
        var ok of bool
        if (1 != args·len)
            return ok
        var _a_0_ of WorkspaceFoldersChangeEvent
        _a_0_ = WorkspaceFoldersChangeEvent·new
        ok = _a_0_.populateFrom(args@0)
        if (!ok)
            return false
        listener(_a_0_)
        return true
    )
    msg.Data@"listener" = _fnid_listener
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?Disposable
            if (=?payload)
                result = ?Disposable·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            else
                return false
            andThen(result.bind(this.Impl(), _fnid_listener))
            return true
        
    this.send(msg, on)




Languages·GetLanguages: (andThen:?(?[string]->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "languages.getLanguages"
    msg.Data = dict·new(0)
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?[string]
            if (=?payload)
                var __coll__result of [any]
                [__coll__result,ok] = ((payload)·([any]))
                if (!ok)
                    return false
                result = [string]·new(__coll__result·len)
                var __idx__result of int
                __idx__result = 0
                for __item__result in __coll__result
                    var __val__result of string
                    [__val__result,ok] = ((__item__result)·(string))
                    if (!ok)
                        return false
                    result@__idx__result = __val__result
                    __idx__result = (__idx__result + 1)
            andThen(result)
            return true
        
    this.send(msg, on)




Languages·OnDidChangeDiagnostics: (listener:(DiagnosticChangeEvent->void) -> andThen:?(?Disposable->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "languages.onDidChangeDiagnostics"
    msg.Data = dict·new(1)
    var _fnid_listener of string
    if (=!listener)
        OnError(this, "Languages.OnDidChangeDiagnostics: the 'listener' arg (which is not optional but required) was not passed by the caller", null)
        return 
    _fnid_listener = this.nextSub((args:[any] -> bool)
        var ok of bool
        if (1 != args·len)
            return ok
        var _a_0_ of DiagnosticChangeEvent
        _a_0_ = DiagnosticChangeEvent·new
        ok = _a_0_.populateFrom(args@0)
        if (!ok)
            return false
        listener(_a_0_)
        return true
    )
    msg.Data@"listener" = _fnid_listener
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?Disposable
            if (=?payload)
                result = ?Disposable·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            else
                return false
            andThen(result.bind(this.Impl(), _fnid_listener))
            return true
        
    this.send(msg, on)




Extensions·OnDidChange: (listener:(->void) -> andThen:?(?Disposable->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "extensions.onDidChange"
    msg.Data = dict·new(1)
    var _fnid_listener of string
    if (=!listener)
        OnError(this, "Extensions.OnDidChange: the 'listener' arg (which is not optional but required) was not passed by the caller", null)
        return 
    _fnid_listener = this.nextSub((args:[any] -> bool)
        var ok of bool
        if (0 != args·len)
            return ok
        listener()
        return true
    )
    msg.Data@"listener" = _fnid_listener
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?Disposable
            if (=?payload)
                result = ?Disposable·new
                ok = result.populateFrom(payload)
                if (!ok)
                    return false
            else
                return false
            andThen(result.bind(this.Impl(), _fnid_listener))
            return true
        
    this.send(msg, on)




Commands·GetCommands: (filterInternal:bool -> andThen:?(?[string]->void) -> void)
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "commands.getCommands"
    msg.Data = dict·new(1)
    msg.Data@"filterInternal" = filterInternal
    var on of (any->bool)
    if (=?andThen)
        on = (payload:any -> bool)
            var ok of bool
            var result of ?[string]
            if (=?payload)
                var __coll__result of [any]
                [__coll__result,ok] = ((payload)·([any]))
                if (!ok)
                    return false
                result = [string]·new(__coll__result·len)
                var __idx__result of int
                __idx__result = 0
                for __item__result in __coll__result
                    var __val__result of string
                    [__val__result,ok] = ((__item__result)·(string))
                    if (!ok)
                        return false
                    result@__idx__result = __val__result
                    __idx__result = (__idx__result + 1)
            andThen(result)
            return true
        
    this.send(msg, on)




MessageItem·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it,ok] = ((payload)·(dict))
    if (!ok)
        return false
    [val,ok] = it@?"title"
    if ok
        var title of string
        if (=?val)
            [title,ok] = ((val)·(string))
            if (!ok)
                return false
        this.Title = title
    else
        return false
    [val,ok] = it@?"isCloseAffordance"
    if ok
        var isCloseAffordance of ?bool
        if (=?val)
            var _isCloseAffordance_ of bool
            [_isCloseAffordance_,ok] = ((val)·(bool))
            if (!ok)
                return false
            isCloseAffordance = (&_isCloseAffordance_)
        this.IsCloseAffordance = isCloseAffordance
    [val,ok] = it@?"my"
    if ok
        var my of ?dict
        if (=?val)
            [my,ok] = ((val)·(?dict))
            if (!ok)
                return false
        this.My = my
    return true




QuickPickItem·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it,ok] = ((payload)·(dict))
    if (!ok)
        return false
    [val,ok] = it@?"label"
    if ok
        var label of string
        if (=?val)
            [label,ok] = ((val)·(string))
            if (!ok)
                return false
        this.Label = label
    else
        return false
    [val,ok] = it@?"description"
    if ok
        var description of ?string
        if (=?val)
            var _description_ of string
            [_description_,ok] = ((val)·(string))
            if (!ok)
                return false
            description = (&_description_)
        this.Description = description
    [val,ok] = it@?"detail"
    if ok
        var detail of ?string
        if (=?val)
            var _detail_ of string
            [_detail_,ok] = ((val)·(string))
            if (!ok)
                return false
            detail = (&_detail_)
        this.Detail = detail
    [val,ok] = it@?"picked"
    if ok
        var picked of ?bool
        if (=?val)
            var _picked_ of bool
            [_picked_,ok] = ((val)·(bool))
            if (!ok)
                return false
            picked = (&_picked_)
        this.Picked = picked
    [val,ok] = it@?"alwaysShow"
    if ok
        var alwaysShow of ?bool
        if (=?val)
            var _alwaysShow_ of bool
            [_alwaysShow_,ok] = ((val)·(bool))
            if (!ok)
                return false
            alwaysShow = (&_alwaysShow_)
        this.AlwaysShow = alwaysShow
    [val,ok] = it@?"my"
    if ok
        var my of ?dict
        if (=?val)
            [my,ok] = ((val)·(?dict))
            if (!ok)
                return false
        this.My = my
    return true




WorkspaceFolder·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it,ok] = ((payload)·(dict))
    if (!ok)
        return false
    [val,ok] = it@?"uri"
    if ok
        var uri of string
        if (=?val)
            [uri,ok] = ((val)·(string))
            if (!ok)
                return false
        this.Uri = uri
    else
        return false
    [val,ok] = it@?"name"
    if ok
        var name of string
        if (=?val)
            [name,ok] = ((val)·(string))
            if (!ok)
                return false
        this.Name = name
    else
        return false
    [val,ok] = it@?"index"
    if ok
        var index of int
        if (=?val)
            [index,ok] = ((val)·(int))
            if (!ok)
                var __index__ of real
                [__index__,ok] = ((val)·(real))
                if (!ok)
                    return false
                index = ((__index__)·(int))
        this.Index = index
    else
        return false
    return true




WindowState·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it,ok] = ((payload)·(dict))
    if (!ok)
        return false
    [val,ok] = it@?"focused"
    if ok
        var focused of bool
        if (=?val)
            [focused,ok] = ((val)·(bool))
            if (!ok)
                return false
        this.Focused = focused
    else
        return false
    return true




EnvProperties·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it,ok] = ((payload)·(dict))
    if (!ok)
        return false
    [val,ok] = it@?"appName"
    if ok
        var appName of ?string
        if (=?val)
            var _appName_ of string
            [_appName_,ok] = ((val)·(string))
            if (!ok)
                return false
            appName = (&_appName_)
        this.AppName = appName
    [val,ok] = it@?"appRoot"
    if ok
        var appRoot of ?string
        if (=?val)
            var _appRoot_ of string
            [_appRoot_,ok] = ((val)·(string))
            if (!ok)
                return false
            appRoot = (&_appRoot_)
        this.AppRoot = appRoot
    [val,ok] = it@?"language"
    if ok
        var language of ?string
        if (=?val)
            var _language_ of string
            [_language_,ok] = ((val)·(string))
            if (!ok)
                return false
            language = (&_language_)
        this.Language = language
    [val,ok] = it@?"machineId"
    if ok
        var machineId of ?string
        if (=?val)
            var _machineId_ of string
            [_machineId_,ok] = ((val)·(string))
            if (!ok)
                return false
            machineId = (&_machineId_)
        this.MachineId = machineId
    [val,ok] = it@?"remoteName"
    if ok
        var remoteName of ?string
        if (=?val)
            var _remoteName_ of string
            [_remoteName_,ok] = ((val)·(string))
            if (!ok)
                return false
            remoteName = (&_remoteName_)
        this.RemoteName = remoteName
    [val,ok] = it@?"sessionId"
    if ok
        var sessionId of ?string
        if (=?val)
            var _sessionId_ of string
            [_sessionId_,ok] = ((val)·(string))
            if (!ok)
                return false
            sessionId = (&_sessionId_)
        this.SessionId = sessionId
    [val,ok] = it@?"shell"
    if ok
        var shell of ?string
        if (=?val)
            var _shell_ of string
            [_shell_,ok] = ((val)·(string))
            if (!ok)
                return false
            shell = (&_shell_)
        this.Shell = shell
    [val,ok] = it@?"uriScheme"
    if ok
        var uriScheme of ?string
        if (=?val)
            var _uriScheme_ of string
            [_uriScheme_,ok] = ((val)·(string))
            if (!ok)
                return false
            uriScheme = (&_uriScheme_)
        this.UriScheme = uriScheme
    return true




WorkspaceFoldersChangeEvent·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it,ok] = ((payload)·(dict))
    if (!ok)
        return false
    [val,ok] = it@?"added"
    if ok
        var added of [WorkspaceFolder]
        if (=?val)
            var __coll__added of [any]
            [__coll__added,ok] = ((val)·([any]))
            if (!ok)
                return false
            added = [WorkspaceFolder]·new(__coll__added·len)
            var __idx__added of int
            __idx__added = 0
            for __item__added in __coll__added
                var __val__added of WorkspaceFolder
                __val__added = WorkspaceFolder·new
                ok = __val__added.populateFrom(__item__added)
                if (!ok)
                    return false
                added@__idx__added = __val__added
                __idx__added = (__idx__added + 1)
        this.Added = added
    else
        return false
    [val,ok] = it@?"removed"
    if ok
        var removed of [WorkspaceFolder]
        if (=?val)
            var __coll__removed of [any]
            [__coll__removed,ok] = ((val)·([any]))
            if (!ok)
                return false
            removed = [WorkspaceFolder]·new(__coll__removed·len)
            var __idx__removed of int
            __idx__removed = 0
            for __item__removed in __coll__removed
                var __val__removed of WorkspaceFolder
                __val__removed = WorkspaceFolder·new
                ok = __val__removed.populateFrom(__item__removed)
                if (!ok)
                    return false
                removed@__idx__removed = __val__removed
                __idx__removed = (__idx__removed + 1)
        this.Removed = removed
    else
        return false
    return true




DiagnosticChangeEvent·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it,ok] = ((payload)·(dict))
    if (!ok)
        return false
    [val,ok] = it@?"uris"
    if ok
        var uris of [string]
        if (=?val)
            var __coll__uris of [any]
            [__coll__uris,ok] = ((val)·([any]))
            if (!ok)
                return false
            uris = [string]·new(__coll__uris·len)
            var __idx__uris of int
            __idx__uris = 0
            for __item__uris in __coll__uris
                var __val__uris of string
                [__val__uris,ok] = ((__item__uris)·(string))
                if (!ok)
                    return false
                uris@__idx__uris = __val__uris
                __idx__uris = (__idx__uris + 1)
        this.Uris = uris
    else
        return false
    return true


# override `emitOutro` for this trailing part..
