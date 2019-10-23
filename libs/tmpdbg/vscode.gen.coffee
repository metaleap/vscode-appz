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




# Represents the alignment of status bar items.
StatusBarAlignment: enum

    # Aligned to the left side.
    Left: 1

    # Aligned to the right side.
    Right: 2




# Describes the behavior of decorations when typing/editing at their edges.
DecorationRangeBehavior: enum

    # The decoration's range will widen when edits occur at the start or end.
    OpenOpen: 0

    # The decoration's range will not widen when edits occur at the start of end.
    ClosedClosed: 1

    # The decoration's range will widen when edits occur at the start, but not at the end.
    OpenClosed: 2

    # The decoration's range will widen when edits occur at the end, but not at the start.
    ClosedOpen: 3




# Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
# The overview ruler supports three lanes.
OverviewRulerLane: enum

    # Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
    # The overview ruler supports three lanes.
    Left: 1

    # Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
    # The overview ruler supports three lanes.
    Center: 2

    # Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
    # The overview ruler supports three lanes.
    Right: 4

    # Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
    # The overview ruler supports three lanes.
    Full: 7




# vscode:
# Type Definition for Visual Studio Code 1.39 Extension API
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
    # The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
    # events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
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
    # that can be called with a [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
    # mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
    # 
    # 
    # ```javascript
    # 
    # languages.registerHoverProvider('javascript', {
    #  	provideHover(document, position, token) {
    #  		return new Hover('I am a hover!');
    #  	}
    # });
    # 
    # ```
    # 
    # 
    # Registration is done using a [document selector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a language id, like `javascript` or
    # a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
    # a selector will result in a [score](https://code.visualstudio.com/api/references/vscode-api#languages.match) that is used to determine if and how a provider shall be used. When
    # scores are equal the provider that came last wins. For features that allow full arity, like [hover](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider),
    # the score is only checked to be `>0`, for other features, like [IntelliSense](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider) the
    # score is used for determining the order in which providers are asked to participate.
    Languages: Languages

    # extensions:
    # Namespace for dealing with installed extensions. Extensions are represented
    # by an [extension](https://code.visualstudio.com/api/references/vscode-api#Extension)-interface which enables reflection on them.
    # 
    # Extension writers can provide APIs to other extensions by returning their API public
    # surface from the `activate`-call.
    # 
    # 
    # ```javascript
    # 
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
    # 
    # ```
    # 
    # When depending on the API of another extension add an `extensionDependency`-entry
    # to `package.json`, and use the [getExtension](https://code.visualstudio.com/api/references/vscode-api#extensions.getExtension)-function
    # and the [exports](https://code.visualstudio.com/api/references/vscode-api#Extension.exports)-property, like below:
    # 
    # 
    # ```javascript
    # 
    # let mathExt = extensions.getExtension('genius.math');
    # let importedApi = mathExt.exports;
    # 
    # console.log(importedApi.mul(42, 1));
    # 
    # ```
    # 
    Extensions: Extensions

    # commands:
    # Namespace for dealing with commands. In short, a command is a function with a
    # unique identifier. The function is sometimes also called _command handler_.
    # 
    # Commands can be added to the editor using the [registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
    # and [registerTextEditorCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerTextEditorCommand) functions. Commands
    # can be executed [manually](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand) or from a UI gesture. Those are:
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
    # 
    # ```javascript
    # 
    # commands.registerCommand('extension.sayHello', () => {
    #  	window.showInformationMessage('Hello World!');
    # });
    # 
    # ```
    # 
    # Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
    # 
    # ```json
    # 
    # {
    #  	"contributes": {
    #  		"commands": [{
    #  			"command": "extension.sayHello",
    #  			"title": "Hello World"
    #  		}]
    #  	}
    # }
    # 
    # ```
    # 
    Commands: Commands




# window:
# Namespace for dealing with the current window of the editor. That is visible
# and active editors, as well as, UI elements to show messages, selections, and
# asking for user input.
Window: interface

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
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowInformationMessage1: ((?string->void)->void)
        message: string
        items: [string]

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
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowInformationMessage2: ((?string->void)->void)
        message: string
        options: MessageOptions
        items: [string]

    # showInformationMessage:
    # Show an information message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowInformationMessage3: ((?MessageItem->void)->void)
        message: string
        items: [MessageItem]

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
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowInformationMessage4: ((?MessageItem->void)->void)
        message: string
        options: MessageOptions
        items: [MessageItem]

    # showWarningMessage:
    # Show a warning message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowWarningMessage1: ((?string->void)->void)
        message: string
        items: [string]

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
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowWarningMessage2: ((?string->void)->void)
        message: string
        options: MessageOptions
        items: [string]

    # showWarningMessage:
    # Show a warning message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowWarningMessage3: ((?MessageItem->void)->void)
        message: string
        items: [MessageItem]

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
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowWarningMessage4: ((?MessageItem->void)->void)
        message: string
        options: MessageOptions
        items: [MessageItem]

    # showErrorMessage:
    # Show an error message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowErrorMessage1: ((?string->void)->void)
        message: string
        items: [string]

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
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowErrorMessage2: ((?string->void)->void)
        message: string
        options: MessageOptions
        items: [string]

    # showErrorMessage:
    # Show an error message.
    #
    # @message:
    # The message to show.
    #
    # @items:
    # A set of items that will be rendered as actions in the message.
    #
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowErrorMessage3: ((?MessageItem->void)->void)
        message: string
        items: [MessageItem]

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
    # @return:
    # A thenable that resolves to the selected item or `undefined` when being dismissed.
    ShowErrorMessage4: ((?MessageItem->void)->void)
        message: string
        options: MessageOptions
        items: [MessageItem]

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
    # @return:
    # A promise that resolves to a string the user provided or to `undefined` in case of dismissal.
    ShowInputBox: ((?string->void)->void)
        options: ?InputBoxOptions
        token: ?Cancel

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
    # @return:
    # A promise that resolves to the selected items or `undefined`.
    ShowQuickPick1: ((?[string]->void)->void)
        items: [string]
        options: QuickPickOptions
        token: ?Cancel

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
    # @return:
    # A promise that resolves to the selection or `undefined`.
    ShowQuickPick2: ((?string->void)->void)
        items: [string]
        options: ?QuickPickOptions
        token: ?Cancel

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
    # @return:
    # A promise that resolves to the selected items or `undefined`.
    ShowQuickPick3: ((?[QuickPickItem]->void)->void)
        items: [QuickPickItem]
        options: QuickPickOptions
        token: ?Cancel

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
    # @return:
    # A promise that resolves to the selected item or `undefined`.
    ShowQuickPick4: ((?QuickPickItem->void)->void)
        items: [QuickPickItem]
        options: ?QuickPickOptions
        token: ?Cancel

    # setStatusBarMessage:
    # Set a message to the status bar. This is a short hand for the more powerful
    # status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).
    #
    # @text:
    # The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).
    #
    # @hideAfterTimeout:
    # Timeout in milliseconds after which the message will be disposed.
    #
    # @return:
    # A disposable which hides the status bar message.
    SetStatusBarMessage1: ((?Disposable->void)->void)
        text: string
        hideAfterTimeout: int

    # setStatusBarMessage:
    # Set a message to the status bar. This is a short hand for the more powerful
    # status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).
    # 
    # *Note* that status bar messages stack and that they must be disposed when no
    # longer used.
    #
    # @text:
    # The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).
    #
    # @return:
    # A disposable which hides the status bar message.
    SetStatusBarMessage2: ((?Disposable->void)->void)
        text: string

    # showSaveDialog:
    # Shows a file save dialog to the user which allows to select a file
    # for saving-purposes.
    #
    # @options:
    # Options that control the dialog.
    #
    # @return:
    # A promise that resolves to the selected resource or `undefined`.
    ShowSaveDialog: ((?string->void)->void)
        options: SaveDialogOptions

    # showOpenDialog:
    # Shows a file open dialog to the user which allows to select a file
    # for opening-purposes.
    #
    # @options:
    # Options that control the dialog.
    #
    # @return:
    # A promise that resolves to the selected resources or `undefined`.
    ShowOpenDialog: ((?[string]->void)->void)
        options: OpenDialogOptions

    # showWorkspaceFolderPick:
    # Shows a selection list of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) to pick from.
    # Returns `undefined` if no folder is open.
    #
    # @options:
    # Configures the behavior of the workspace folder list.
    #
    # @return:
    # A promise that resolves to the workspace folder or `undefined`.
    ShowWorkspaceFolderPick: ((?WorkspaceFolder->void)->void)
        options: ?WorkspaceFolderPickOptions

    # state:
    # Represents the current window's state.
    State: ((WindowState->void)->void)

    # onDidChangeWindowState:
    # An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the focus state of the current window
    # changes. The value of the event represents whether the window is focused.
    OnDidChangeWindowState: ((?Disposable->void)->void)
        listener: (WindowState->void)

    # createStatusBarItem:
    # Creates a status bar [item](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem).
    #
    # @alignment:
    # The alignment of the item.
    #
    # @priority:
    # The priority of the item. Higher values mean the item should be shown more to the left.
    #
    # @return:
    # A new status bar item.
    CreateStatusBarItem: ((StatusBarItem->StatusBarItemState->void)->void)
        alignment: ?StatusBarAlignment
        priority: ?int

    # createOutputChannel:
    # Creates a new [output channel](https://code.visualstudio.com/api/references/vscode-api#OutputChannel) with the given name.
    #
    # @name:
    # Human-readable string which will be used to represent the channel in the UI.
    CreateOutputChannel: ((OutputChannel->OutputChannelState->void)->void)
        name: string

    # createTextEditorDecorationType:
    # Create a TextEditorDecorationType that can be used to add decorations to text editors.
    #
    # @options:
    # Rendering options for the decoration type.
    #
    # @return:
    # A new decoration type instance.
    CreateTextEditorDecorationType: ((TextEditorDecorationType->TextEditorDecorationTypeState->void)->void)
        options: DecorationRenderOptions

    # createInputBox:
    # Creates a [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox) to let the user enter some text input.
    # 
    # Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
    # is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
    # when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.
    #
    # @return:
    # A new [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox).
    CreateInputBox: ((InputBox->InputBoxState->void)->void)

    # createQuickPick:
    # Creates a [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick) to let the user pick an item from a list
    # of items of type T.
    # 
    # Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
    # is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
    # when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.
    #
    # @return:
    # A new [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick).
    CreateQuickPick: ((QuickPick->QuickPickState->void)->void)




# env:
# Namespace describing the environment the editor runs in.
Env: interface

    # openExternal:
    # Opens an *external* item, e.g. a http(s) or mailto-link, using the
    # default application.
    # 
    # *Note* that [`showTextDocument`](https://code.visualstudio.com/api/references/vscode-api#window.showTextDocument) is the right
    # way to open a text document inside the editor, not this function.
    #
    # @target:
    # The uri that should be opened.
    #
    # @return:
    # A promise indicating if open was successful.
    OpenExternal: ((bool->void)->void)
        target: string

    # appName:
    # The application name of the editor, like 'VS Code'.
    AppName: ((string->void)->void)

    # appRoot:
    # The application root folder from which the editor is running.
    AppRoot: ((string->void)->void)

    # language:
    # Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.
    Language: ((string->void)->void)

    # machineId:
    # A unique identifier for the computer.
    MachineId: ((string->void)->void)

    # remoteName:
    # The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
    # Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
    # 
    # *Note* that the value is `undefined` when there is no remote extension host but that the
    # value is defined in all extension hosts (local and remote) in case a remote extension host
    # exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
    # a specific extension runs remote or not.
    RemoteName: ((?string->void)->void)

    # sessionId:
    # A unique identifier for the current session.
    # Changes each time the editor is started.
    SessionId: ((string->void)->void)

    # shell:
    # The detected default shell for the extension host, this is overridden by the
    # `terminal.integrated.shell` setting for the extension host's platform.
    Shell: ((string->void)->void)

    # uriScheme:
    # The custom uri scheme the editor registers to in the operating system.
    UriScheme: ((string->void)->void)

    # Provides single-call access to numerous individual `Env` properties at once.
    Properties: ((EnvProperties->void)->void)

    # The clipboard provides read and write access to the system's clipboard.
    Clipboard: Clipboard




# clipboard:
# The clipboard provides read and write access to the system's clipboard.
Clipboard: interface

    # readText:
    # Read the current clipboard contents as text.
    #
    # @return:
    # A thenable that resolves to a string.
    ReadText: ((?string->void)->void)

    # writeText:
    # Writes text into the clipboard.
    #
    # @return:
    # A thenable that resolves when writing happened.
    WriteText: ((void->void)->void)
        value: string




# workspace:
# Namespace for dealing with the current workspace. A workspace is the representation
# of the folder that has been opened. There is no workspace when just a file but not a
# folder has been opened.
# 
# The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
# events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
# the editor-process so that they should be always used instead of nodejs-equivalents.
Workspace: interface

    # name:
    # The name of the workspace. `undefined` when no folder
    # has been opened.
    Name: ((?string->void)->void)

    # workspaceFile:
    # The location of the workspace file, for example:
    # 
    # `file:///Users/name/Development/myProject.code-workspace`
    # 
    # or
    # 
    # `untitled:1555503116870`
    # 
    # for a workspace that is untitled and not yet saved.
    # 
    # Depending on the workspace that is opened, the value will be:
    #   * `undefined` when no workspace or  a single folder is opened
    #   * the path of the workspace file as `Uri` otherwise. if the workspace
    # is untitled, the returned URI will use the `untitled:` scheme
    # 
    # The location can e.g. be used with the `vscode.openFolder` command to
    # open the workspace again after it has been closed.
    # 
    # **Example:**
    # 
    # ```typescript
    # 
    # vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
    # 
    # ```
    # 
    # 
    # **Note:** it is not advised to use `workspace.workspaceFile` to write
    # configuration data into the file. You can use `workspace.getConfiguration().update()`
    # for that purpose which will work both when a single folder is opened as
    # well as an untitled or saved workspace.
    WorkspaceFile: ((?string->void)->void)

    # saveAll:
    # Save all dirty files.
    #
    # @includeUntitled:
    # Also save files that have been created during this session.
    #
    # @return:
    # A thenable that resolves when the files have been saved.
    SaveAll: ((bool->void)->void)
        includeUntitled: bool

    # onDidChangeWorkspaceFolders:
    # An event that is emitted when a workspace folder is added or removed.
    OnDidChangeWorkspaceFolders: ((?Disposable->void)->void)
        listener: (WorkspaceFoldersChangeEvent->void)

    # getWorkspaceFolder:
    # Returns the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) that contains a given uri.
    # * returns `undefined` when the given uri doesn't match any workspace folder
    # * returns the *input* when the given uri is a workspace folder itself
    #
    # @uri:
    # An uri.
    #
    # @return:
    # A workspace folder or `undefined`
    GetWorkspaceFolder: ((?WorkspaceFolder->void)->void)
        uri: string

    # workspaceFolders:
    # List of workspace folders or `undefined` when no folder is open.
    # *Note* that the first entry corresponds to the value of `rootPath`.
    WorkspaceFolders: ((?[WorkspaceFolder]->void)->void)

    # findFiles:
    # Find files across all [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) in the workspace.
    # `findFiles('**​/*.js', '**​/node_modules/**', 10)`
    #
    # @include:
    # A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines the files to search for. The glob pattern
    # will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern)
    # to restrict the search results to a [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder).
    #
    # @exclude:
    # A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines files and folders to exclude. The glob pattern
    # will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will
    # apply, when `null` no excludes will apply.
    #
    # @maxResults:
    # An upper-bound for the result.
    #
    # @token:
    # A token that can be used to signal cancellation to the underlying search engine.
    #
    # @return:
    # A thenable that resolves to an array of resource identifiers. Will return no results if no
    # [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) are opened.
    FindFiles: ((?[string]->void)->void)
        include: string
        exclude: ?string
        maxResults: ?int
        token: ?Cancel

    # asRelativePath:
    # Returns a path that is relative to the workspace folder or folders.
    # 
    # When there are no [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) or when the path
    # is not contained in them, the input is returned.
    #
    # @pathOrUri:
    # A path or uri. When a uri is given its [fsPath](https://code.visualstudio.com/api/references/vscode-api#Uri.fsPath) is used.
    #
    # @includeWorkspaceFolder:
    # When `true` and when the given path is contained inside a
    # workspace folder the name of the workspace is prepended. Defaults to `true` when there are
    # multiple workspace folders and `false` otherwise.
    #
    # @return:
    # A path relative to the root or the input.
    AsRelativePath: ((?string->void)->void)
        pathOrUri: string
        includeWorkspaceFolder: bool

    # Provides single-call access to numerous individual `Workspace` properties at once.
    Properties: ((WorkspaceProperties->void)->void)




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
# that can be called with a [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
# mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
# 
# 
# ```javascript
# 
# languages.registerHoverProvider('javascript', {
#  	provideHover(document, position, token) {
#  		return new Hover('I am a hover!');
#  	}
# });
# 
# ```
# 
# 
# Registration is done using a [document selector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a language id, like `javascript` or
# a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
# a selector will result in a [score](https://code.visualstudio.com/api/references/vscode-api#languages.match) that is used to determine if and how a provider shall be used. When
# scores are equal the provider that came last wins. For features that allow full arity, like [hover](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider),
# the score is only checked to be `>0`, for other features, like [IntelliSense](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider) the
# score is used for determining the order in which providers are asked to participate.
Languages: interface

    # getLanguages:
    # Return the identifiers of all known languages.
    #
    # @return:
    # Promise resolving to an array of identifier strings.
    GetLanguages: ((?[string]->void)->void)

    # onDidChangeDiagnostics:
    # An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the global set of diagnostics changes. This is
    # newly added and removed diagnostics.
    OnDidChangeDiagnostics: ((?Disposable->void)->void)
        listener: (DiagnosticChangeEvent->void)




# extensions:
# Namespace for dealing with installed extensions. Extensions are represented
# by an [extension](https://code.visualstudio.com/api/references/vscode-api#Extension)-interface which enables reflection on them.
# 
# Extension writers can provide APIs to other extensions by returning their API public
# surface from the `activate`-call.
# 
# 
# ```javascript
# 
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
# 
# ```
# 
# When depending on the API of another extension add an `extensionDependency`-entry
# to `package.json`, and use the [getExtension](https://code.visualstudio.com/api/references/vscode-api#extensions.getExtension)-function
# and the [exports](https://code.visualstudio.com/api/references/vscode-api#Extension.exports)-property, like below:
# 
# 
# ```javascript
# 
# let mathExt = extensions.getExtension('genius.math');
# let importedApi = mathExt.exports;
# 
# console.log(importedApi.mul(42, 1));
# 
# ```
# 
Extensions: interface

    # onDidChange:
    # An event which fires when `extensions.all` changes. This can happen when extensions are
    # installed, uninstalled, enabled or disabled.
    OnDidChange: ((?Disposable->void)->void)
        listener: (->void)




# commands:
# Namespace for dealing with commands. In short, a command is a function with a
# unique identifier. The function is sometimes also called _command handler_.
# 
# Commands can be added to the editor using the [registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
# and [registerTextEditorCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerTextEditorCommand) functions. Commands
# can be executed [manually](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand) or from a UI gesture. Those are:
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
# 
# ```javascript
# 
# commands.registerCommand('extension.sayHello', () => {
#  	window.showInformationMessage('Hello World!');
# });
# 
# ```
# 
# Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
# 
# ```json
# 
# {
#  	"contributes": {
#  		"commands": [{
#  			"command": "extension.sayHello",
#  			"title": "Hello World"
#  		}]
#  	}
# }
# 
# ```
# 
Commands: interface

    # registerCommand:
    # Registers a command that can be invoked via a keyboard shortcut,
    # a menu item, an action, or directly.
    # 
    # Registering a command with an existing command identifier twice
    # will cause an error.
    #
    # @command:
    # A unique identifier for the command.
    #
    # @callback:
    # A command handler function.
    #
    # @return:
    # Disposable which unregisters this command on disposal.
    RegisterCommand: ((?Disposable->void)->void)
        command: string
        callback: ([any]->any)

    # executeCommand:
    # Executes the command denoted by the given command identifier.
    # 
    # * *Note 1:* When executing an editor command not all types are allowed to
    # be passed as arguments. Allowed are the primitive types `string`, `boolean`,
    # `number`, `undefined`, and `null`, as well as [`Position`](https://code.visualstudio.com/api/references/vscode-api#Position), [`Range`](#Range), [`Uri`](#Uri) and [`Location`](#Location).
    # * *Note 2:* There are no restrictions when executing commands that have been contributed
    # by extensions.
    #
    # @command:
    # Identifier of the command to execute.
    #
    # @rest:
    # Parameters passed to the command function.
    #
    # @return:
    # A thenable that resolves to the returned value of the given command. `undefined` when
    # the command handler function doesn't return anything.
    ExecuteCommand: ((?any->void)->void)
        command: string
        rest: [any]

    # getCommands:
    # Retrieve the list of all available commands. Commands starting an underscore are
    # treated as internal commands.
    #
    # @filterInternal:
    # Set `true` to not see internal commands (starting with an underscore)
    #
    # @return:
    # Thenable that resolves to a list of command ids.
    GetCommands: ((?[string]->void)->void)
        filterInternal: bool




# Represents theme specific rendering styles for a [text editor decoration](https://code.visualstudio.com/api/references/vscode-api#TextEditorDecorationType).
ThemableDecorationRenderOptions: class

    # backgroundColor:
    # Background color of the decoration. Use rgba() and define transparent background colors to play well with other decorations.
    # Alternatively a color from the color registry can be [referenced](https://code.visualstudio.com/api/references/vscode-api#ThemeColor).
    #
    # JSON FLAGS: {"Name":"backgroundColor","Required":false,"Excluded":false}
    BackgroundColor: ?string

    # outline:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"outline","Required":false,"Excluded":false}
    Outline: ?string

    # outlineColor:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'outline' for setting one or more of the individual outline properties.
    #
    # JSON FLAGS: {"Name":"outlineColor","Required":false,"Excluded":false}
    OutlineColor: ?string

    # outlineStyle:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'outline' for setting one or more of the individual outline properties.
    #
    # JSON FLAGS: {"Name":"outlineStyle","Required":false,"Excluded":false}
    OutlineStyle: ?string

    # outlineWidth:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'outline' for setting one or more of the individual outline properties.
    #
    # JSON FLAGS: {"Name":"outlineWidth","Required":false,"Excluded":false}
    OutlineWidth: ?string

    # border:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"border","Required":false,"Excluded":false}
    Border: ?string

    # borderColor:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderColor","Required":false,"Excluded":false}
    BorderColor: ?string

    # borderRadius:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderRadius","Required":false,"Excluded":false}
    BorderRadius: ?string

    # borderSpacing:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderSpacing","Required":false,"Excluded":false}
    BorderSpacing: ?string

    # borderStyle:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderStyle","Required":false,"Excluded":false}
    BorderStyle: ?string

    # borderWidth:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderWidth","Required":false,"Excluded":false}
    BorderWidth: ?string

    # fontStyle:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"fontStyle","Required":false,"Excluded":false}
    FontStyle: ?string

    # fontWeight:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"fontWeight","Required":false,"Excluded":false}
    FontWeight: ?string

    # textDecoration:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"textDecoration","Required":false,"Excluded":false}
    TextDecoration: ?string

    # cursor:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"cursor","Required":false,"Excluded":false}
    Cursor: ?string

    # color:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"color","Required":false,"Excluded":false}
    Color: ?string

    # opacity:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"opacity","Required":false,"Excluded":false}
    Opacity: ?string

    # letterSpacing:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"letterSpacing","Required":false,"Excluded":false}
    LetterSpacing: ?string

    # gutterIconPath:
    # An **absolute path** or an URI to an image to be rendered in the gutter.
    #
    # JSON FLAGS: {"Name":"gutterIconPath","Required":false,"Excluded":false}
    GutterIconPath: ?string

    # gutterIconSize:
    # Specifies the size of the gutter icon.
    # Available values are 'auto', 'contain', 'cover' and any percentage value.
    # For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx
    #
    # JSON FLAGS: {"Name":"gutterIconSize","Required":false,"Excluded":false}
    GutterIconSize: ?string

    # overviewRulerColor:
    # The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations.
    #
    # JSON FLAGS: {"Name":"overviewRulerColor","Required":false,"Excluded":false}
    OverviewRulerColor: ?string

    # before:
    # Defines the rendering options of the attachment that is inserted before the decorated text.
    #
    # JSON FLAGS: {"Name":"before","Required":false,"Excluded":false}
    Before: ?ThemableDecorationAttachmentRenderOptions

    # after:
    # Defines the rendering options of the attachment that is inserted after the decorated text.
    #
    # JSON FLAGS: {"Name":"after","Required":false,"Excluded":false}
    After: ?ThemableDecorationAttachmentRenderOptions




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
    # Selection of the prefilled [`value`](https://code.visualstudio.com/api/references/vscode-api#InputBoxOptions.value). Defined as tuple of two number where the
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

    # defaultUri:
    # The resource the dialog shows when opened.
    #
    # JSON FLAGS: {"Name":"defaultUri","Required":false,"Excluded":false}
    DefaultUri: ?string

    # saveLabel:
    # A human-readable string for the save button.
    #
    # JSON FLAGS: {"Name":"saveLabel","Required":false,"Excluded":false}
    SaveLabel: ?string

    # filters:
    # A set of file filters that are used by the dialog. Each entry is a human readable label,
    # like "TypeScript", and an array of extensions, e.g.
    # 
    # ```ts
    # 
    # {
    #  	'Images': ['png', 'jpg']
    #  	'TypeScript': ['ts', 'tsx']
    # }
    # 
    # ```
    # 
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

    # defaultUri:
    # The resource the dialog shows when opened.
    #
    # JSON FLAGS: {"Name":"defaultUri","Required":false,"Excluded":false}
    DefaultUri: ?string

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
    # 
    # ```ts
    # 
    # {
    #  	'Images': ['png', 'jpg']
    #  	'TypeScript': ['ts', 'tsx']
    # }
    # 
    # ```
    # 
    #
    # JSON FLAGS: {"Name":"filters","Required":false,"Excluded":false}
    Filters: ?[[string]]




# Options to configure the behaviour of the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) pick UI.
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
    # *Note:* The [Uri](https://code.visualstudio.com/api/references/vscode-api#Uri)-type was intentionally chosen such that future releases of the editor can support
    # workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.
    #
    # JSON FLAGS: {"Name":"uri","Required":true,"Excluded":false}
    Uri: string

    # name:
    # The name of this workspace folder. Defaults to
    # the basename of its [uri-path](https://code.visualstudio.com/api/references/vscode-api#Uri.path)
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




# A status bar item is a status bar contribution that can
# show text and icons and run a command on click.
StatusBarItem: class

    #
    # JSON FLAGS: undefined
    disp: ?Disposable




# An output channel is a container for readonly textual information.
# 
# To get an instance of an `OutputChannel` use
# [createOutputChannel](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel).
OutputChannel: class

    #
    # JSON FLAGS: undefined
    disp: ?Disposable




# Type Definition for Visual Studio Code 1.39 Extension API
# See https://code.visualstudio.com/api for more information
ThemableDecorationAttachmentRenderOptions: class

    # contentText:
    # Defines a text content that is shown in the attachment. Either an icon or a text can be shown, but not both.
    #
    # JSON FLAGS: {"Name":"contentText","Required":false,"Excluded":false}
    ContentText: ?string

    # contentIconPath:
    # An **absolute path** or an URI to an image to be rendered in the attachment. Either an icon
    # or a text can be shown, but not both.
    #
    # JSON FLAGS: {"Name":"contentIconPath","Required":false,"Excluded":false}
    ContentIconPath: ?string

    # border:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"border","Required":false,"Excluded":false}
    Border: ?string

    # borderColor:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"borderColor","Required":false,"Excluded":false}
    BorderColor: ?string

    # fontStyle:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"fontStyle","Required":false,"Excluded":false}
    FontStyle: ?string

    # fontWeight:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"fontWeight","Required":false,"Excluded":false}
    FontWeight: ?string

    # textDecoration:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"textDecoration","Required":false,"Excluded":false}
    TextDecoration: ?string

    # color:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"color","Required":false,"Excluded":false}
    Color: ?string

    # backgroundColor:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"backgroundColor","Required":false,"Excluded":false}
    BackgroundColor: ?string

    # margin:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"margin","Required":false,"Excluded":false}
    Margin: ?string

    # width:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"width","Required":false,"Excluded":false}
    Width: ?string

    # height:
    # CSS styling property that will be applied to the decoration attachment.
    #
    # JSON FLAGS: {"Name":"height","Required":false,"Excluded":false}
    Height: ?string




# Represents rendering styles for a [text editor decoration](https://code.visualstudio.com/api/references/vscode-api#TextEditorDecorationType).
DecorationRenderOptions: class

    # isWholeLine:
    # Should the decoration be rendered also on the whitespace after the line text.
    # Defaults to `false`.
    #
    # JSON FLAGS: {"Name":"isWholeLine","Required":false,"Excluded":false}
    IsWholeLine: ?bool

    # rangeBehavior:
    # Customize the growing behavior of the decoration when edits occur at the edges of the decoration's range.
    # Defaults to `DecorationRangeBehavior.OpenOpen`.
    #
    # JSON FLAGS: {"Name":"rangeBehavior","Required":false,"Excluded":false}
    RangeBehavior: ?DecorationRangeBehavior

    # overviewRulerLane:
    # The position in the overview ruler where the decoration should be rendered.
    #
    # JSON FLAGS: {"Name":"overviewRulerLane","Required":false,"Excluded":false}
    OverviewRulerLane: ?OverviewRulerLane

    # light:
    # Overwrite options for light themes.
    #
    # JSON FLAGS: {"Name":"light","Required":false,"Excluded":false}
    Light: ?ThemableDecorationRenderOptions

    # dark:
    # Overwrite options for dark themes.
    #
    # JSON FLAGS: {"Name":"dark","Required":false,"Excluded":false}
    Dark: ?ThemableDecorationRenderOptions

    # backgroundColor:
    # Background color of the decoration. Use rgba() and define transparent background colors to play well with other decorations.
    # Alternatively a color from the color registry can be [referenced](https://code.visualstudio.com/api/references/vscode-api#ThemeColor).
    #
    # JSON FLAGS: {"Name":"backgroundColor","Required":false,"Excluded":false}
    BackgroundColor: ?string

    # outline:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"outline","Required":false,"Excluded":false}
    Outline: ?string

    # outlineColor:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'outline' for setting one or more of the individual outline properties.
    #
    # JSON FLAGS: {"Name":"outlineColor","Required":false,"Excluded":false}
    OutlineColor: ?string

    # outlineStyle:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'outline' for setting one or more of the individual outline properties.
    #
    # JSON FLAGS: {"Name":"outlineStyle","Required":false,"Excluded":false}
    OutlineStyle: ?string

    # outlineWidth:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'outline' for setting one or more of the individual outline properties.
    #
    # JSON FLAGS: {"Name":"outlineWidth","Required":false,"Excluded":false}
    OutlineWidth: ?string

    # border:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"border","Required":false,"Excluded":false}
    Border: ?string

    # borderColor:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderColor","Required":false,"Excluded":false}
    BorderColor: ?string

    # borderRadius:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderRadius","Required":false,"Excluded":false}
    BorderRadius: ?string

    # borderSpacing:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderSpacing","Required":false,"Excluded":false}
    BorderSpacing: ?string

    # borderStyle:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderStyle","Required":false,"Excluded":false}
    BorderStyle: ?string

    # borderWidth:
    # CSS styling property that will be applied to text enclosed by a decoration.
    # Better use 'border' for setting one or more of the individual border properties.
    #
    # JSON FLAGS: {"Name":"borderWidth","Required":false,"Excluded":false}
    BorderWidth: ?string

    # fontStyle:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"fontStyle","Required":false,"Excluded":false}
    FontStyle: ?string

    # fontWeight:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"fontWeight","Required":false,"Excluded":false}
    FontWeight: ?string

    # textDecoration:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"textDecoration","Required":false,"Excluded":false}
    TextDecoration: ?string

    # cursor:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"cursor","Required":false,"Excluded":false}
    Cursor: ?string

    # color:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"color","Required":false,"Excluded":false}
    Color: ?string

    # opacity:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"opacity","Required":false,"Excluded":false}
    Opacity: ?string

    # letterSpacing:
    # CSS styling property that will be applied to text enclosed by a decoration.
    #
    # JSON FLAGS: {"Name":"letterSpacing","Required":false,"Excluded":false}
    LetterSpacing: ?string

    # gutterIconPath:
    # An **absolute path** or an URI to an image to be rendered in the gutter.
    #
    # JSON FLAGS: {"Name":"gutterIconPath","Required":false,"Excluded":false}
    GutterIconPath: ?string

    # gutterIconSize:
    # Specifies the size of the gutter icon.
    # Available values are 'auto', 'contain', 'cover' and any percentage value.
    # For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx
    #
    # JSON FLAGS: {"Name":"gutterIconSize","Required":false,"Excluded":false}
    GutterIconSize: ?string

    # overviewRulerColor:
    # The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations.
    #
    # JSON FLAGS: {"Name":"overviewRulerColor","Required":false,"Excluded":false}
    OverviewRulerColor: ?string

    # before:
    # Defines the rendering options of the attachment that is inserted before the decorated text.
    #
    # JSON FLAGS: {"Name":"before","Required":false,"Excluded":false}
    Before: ?ThemableDecorationAttachmentRenderOptions

    # after:
    # Defines the rendering options of the attachment that is inserted after the decorated text.
    #
    # JSON FLAGS: {"Name":"after","Required":false,"Excluded":false}
    After: ?ThemableDecorationAttachmentRenderOptions




# Represents a handle to a set of decorations
# sharing the same [styling options](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions) in a [text editor](#TextEditor).
# 
# To get an instance of a `TextEditorDecorationType` use
# [createTextEditorDecorationType](https://code.visualstudio.com/api/references/vscode-api#window.createTextEditorDecorationType).
TextEditorDecorationType: class

    #
    # JSON FLAGS: undefined
    disp: ?Disposable




# A concrete [QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput) to let the user input a text value.
# 
# Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
# is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
# when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.
InputBox: class

    #
    # JSON FLAGS: undefined
    disp: ?Disposable




# Button for an action in a [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick) or [InputBox](#InputBox).
QuickInputButton: class

    # iconPath:
    # Icon for the button.
    #
    # JSON FLAGS: {"Name":"iconPath","Required":true,"Excluded":false}
    IconPath: string

    # tooltip:
    # An optional tooltip.
    #
    # JSON FLAGS: {"Name":"tooltip","Required":false,"Excluded":false}
    Tooltip: ?string

    # my:
    # Free-form custom data, preserved across a roundtrip.
    #
    # JSON FLAGS: {"Name":"my","Required":false,"Excluded":false}
    My: ?dict




# A concrete [QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput) to let the user pick an item from a
# list of items of type T. The items can be filtered through a filter text field and
# there is an option [canSelectMany](https://code.visualstudio.com/api/references/vscode-api#QuickPick.canSelectMany) to allow for
# selecting multiple items.
# 
# Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
# is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
# when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.
QuickPick: class

    #
    # JSON FLAGS: undefined
    disp: ?Disposable




# An event describing a change to the set of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders).
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
    # exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
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




# workspaceProperties:
# Namespace for dealing with the current workspace. A workspace is the representation
# of the folder that has been opened. There is no workspace when just a file but not a
# folder has been opened.
# 
# The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
# events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
# the editor-process so that they should be always used instead of nodejs-equivalents.
WorkspaceProperties: class

    # name:
    # The name of the workspace. `undefined` when no folder
    # has been opened.
    #
    # JSON FLAGS: {"Name":"name","Required":false,"Excluded":false}
    Name: ?string

    # workspaceFile:
    # The location of the workspace file, for example:
    # 
    # `file:///Users/name/Development/myProject.code-workspace`
    # 
    # or
    # 
    # `untitled:1555503116870`
    # 
    # for a workspace that is untitled and not yet saved.
    # 
    # Depending on the workspace that is opened, the value will be:
    #   * `undefined` when no workspace or  a single folder is opened
    #   * the path of the workspace file as `Uri` otherwise. if the workspace
    # is untitled, the returned URI will use the `untitled:` scheme
    # 
    # The location can e.g. be used with the `vscode.openFolder` command to
    # open the workspace again after it has been closed.
    # 
    # **Example:**
    # 
    # ```typescript
    # 
    # vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
    # 
    # ```
    # 
    # 
    # **Note:** it is not advised to use `workspace.workspaceFile` to write
    # configuration data into the file. You can use `workspace.getConfiguration().update()`
    # for that purpose which will work both when a single folder is opened as
    # well as an untitled or saved workspace.
    #
    # JSON FLAGS: {"Name":"workspaceFile","Required":false,"Excluded":false}
    WorkspaceFile: ?string

    # workspaceFolders:
    # List of workspace folders or `undefined` when no folder is open.
    # *Note* that the first entry corresponds to the value of `rootPath`.
    #
    # JSON FLAGS: {"Name":"workspaceFolders","Required":false,"Excluded":false}
    WorkspaceFolders: ?[WorkspaceFolder]




# A status bar item is a status bar contribution that can
# show text and icons and run a command on click.
StatusBarItemState: class

    # alignment:
    # The alignment of this item.
    #
    # JSON FLAGS: {"Name":"alignment","Required":false,"Excluded":true}
    Alignment: (->StatusBarAlignment)

    # priority:
    # The priority of this item. Higher value means the item should
    # be shown more to the left.
    #
    # JSON FLAGS: {"Name":"priority","Required":false,"Excluded":true}
    Priority: (->int)

    # text:
    # The text to show for the entry. You can embed icons in the text by leveraging the syntax:
    # 
    # `My text $(icon-name) contains icons like $(icon-name) this one.`
    # 
    # Where the icon-name is taken from the [octicon](https://octicons.github.com) icon set, e.g.
    # `light-bulb`, `thumbsup`, `zap` etc.
    #
    # JSON FLAGS: {"Name":"text","Required":false,"Excluded":false}
    Text: string

    # tooltip:
    # The tooltip text when you hover over this entry.
    #
    # JSON FLAGS: {"Name":"tooltip","Required":false,"Excluded":false}
    Tooltip: string

    # color:
    # The foreground color for this entry.
    #
    # JSON FLAGS: {"Name":"color","Required":false,"Excluded":false}
    Color: string

    # command:
    # The identifier of a command to run on click. The command must be
    # [known](https://code.visualstudio.com/api/references/vscode-api#commands.getCommands).
    #
    # JSON FLAGS: {"Name":"command","Required":false,"Excluded":false}
    Command: string




# An output channel is a container for readonly textual information.
# 
# To get an instance of an `OutputChannel` use
# [createOutputChannel](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel).
OutputChannelState: class

    # name:
    # The human-readable name of this output channel.
    #
    # JSON FLAGS: {"Name":"name","Required":false,"Excluded":true}
    Name: (->string)




# Represents a handle to a set of decorations
# sharing the same [styling options](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions) in a [text editor](#TextEditor).
# 
# To get an instance of a `TextEditorDecorationType` use
# [createTextEditorDecorationType](https://code.visualstudio.com/api/references/vscode-api#window.createTextEditorDecorationType).
TextEditorDecorationTypeState: class

    # key:
    # Internal representation of the handle.
    #
    # JSON FLAGS: {"Name":"key","Required":false,"Excluded":true}
    Key: (->string)




# A concrete [QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput) to let the user input a text value.
# 
# Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
# is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
# when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.
InputBoxState: class

    # value:
    # Current input value.
    #
    # JSON FLAGS: {"Name":"value","Required":false,"Excluded":false}
    Value: string

    # placeholder:
    # Optional placeholder in the filter text.
    #
    # JSON FLAGS: {"Name":"placeholder","Required":false,"Excluded":false}
    Placeholder: string

    # password:
    # If the input value should be hidden. Defaults to false.
    #
    # JSON FLAGS: {"Name":"password","Required":false,"Excluded":false}
    Password: bool

    # buttons:
    # Buttons for actions in the UI.
    #
    # JSON FLAGS: {"Name":"buttons","Required":false,"Excluded":false}
    Buttons: ?[QuickInputButton]

    # prompt:
    # An optional prompt text providing some ask or explanation to the user.
    #
    # JSON FLAGS: {"Name":"prompt","Required":false,"Excluded":false}
    Prompt: string

    # validationMessage:
    # An optional validation message indicating a problem with the current input value.
    #
    # JSON FLAGS: {"Name":"validationMessage","Required":false,"Excluded":false}
    ValidationMessage: string

    # title:
    # An optional title.
    #
    # JSON FLAGS: {"Name":"title","Required":false,"Excluded":false}
    Title: string

    # step:
    # An optional current step count.
    #
    # JSON FLAGS: {"Name":"step","Required":false,"Excluded":false}
    Step: ?int

    # totalSteps:
    # An optional total step count.
    #
    # JSON FLAGS: {"Name":"totalSteps","Required":false,"Excluded":false}
    TotalSteps: ?int

    # enabled:
    # If the UI should allow for user input. Defaults to true.
    # 
    # Change this to false, e.g., while validating user input or
    # loading data for the next step in user input.
    #
    # JSON FLAGS: {"Name":"enabled","Required":false,"Excluded":false}
    Enabled: bool

    # busy:
    # If the UI should show a progress indicator. Defaults to false.
    # 
    # Change this to true, e.g., while loading more data or validating
    # user input.
    #
    # JSON FLAGS: {"Name":"busy","Required":false,"Excluded":false}
    Busy: bool

    # ignoreFocusOut:
    # If the UI should stay open even when loosing UI focus. Defaults to false.
    #
    # JSON FLAGS: {"Name":"ignoreFocusOut","Required":false,"Excluded":false}
    IgnoreFocusOut: bool




# A concrete [QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput) to let the user pick an item from a
# list of items of type T. The items can be filtered through a filter text field and
# there is an option [canSelectMany](https://code.visualstudio.com/api/references/vscode-api#QuickPick.canSelectMany) to allow for
# selecting multiple items.
# 
# Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
# is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
# when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.
QuickPickState: class

    # value:
    # Current value of the filter text.
    #
    # JSON FLAGS: {"Name":"value","Required":false,"Excluded":false}
    Value: string

    # placeholder:
    # Optional placeholder in the filter text.
    #
    # JSON FLAGS: {"Name":"placeholder","Required":false,"Excluded":false}
    Placeholder: string

    # buttons:
    # Buttons for actions in the UI.
    #
    # JSON FLAGS: {"Name":"buttons","Required":false,"Excluded":false}
    Buttons: ?[QuickInputButton]

    # items:
    # Items to pick from.
    #
    # JSON FLAGS: {"Name":"items","Required":false,"Excluded":false}
    Items: ?[QuickPickItem]

    # canSelectMany:
    # If multiple items can be selected at the same time. Defaults to false.
    #
    # JSON FLAGS: {"Name":"canSelectMany","Required":false,"Excluded":false}
    CanSelectMany: bool

    # matchOnDescription:
    # If the filter text should also be matched against the description of the items. Defaults to false.
    #
    # JSON FLAGS: {"Name":"matchOnDescription","Required":false,"Excluded":false}
    MatchOnDescription: bool

    # matchOnDetail:
    # If the filter text should also be matched against the detail of the items. Defaults to false.
    #
    # JSON FLAGS: {"Name":"matchOnDetail","Required":false,"Excluded":false}
    MatchOnDetail: bool

    # activeItems:
    # Active items. This can be read and updated by the extension.
    #
    # JSON FLAGS: {"Name":"activeItems","Required":false,"Excluded":false}
    ActiveItems: ?[QuickPickItem]

    # selectedItems:
    # Selected items. This can be read and updated by the extension.
    #
    # JSON FLAGS: {"Name":"selectedItems","Required":false,"Excluded":false}
    SelectedItems: ?[QuickPickItem]

    # title:
    # An optional title.
    #
    # JSON FLAGS: {"Name":"title","Required":false,"Excluded":false}
    Title: string

    # step:
    # An optional current step count.
    #
    # JSON FLAGS: {"Name":"step","Required":false,"Excluded":false}
    Step: ?int

    # totalSteps:
    # An optional total step count.
    #
    # JSON FLAGS: {"Name":"totalSteps","Required":false,"Excluded":false}
    TotalSteps: ?int

    # enabled:
    # If the UI should allow for user input. Defaults to true.
    # 
    # Change this to false, e.g., while validating user input or
    # loading data for the next step in user input.
    #
    # JSON FLAGS: {"Name":"enabled","Required":false,"Excluded":false}
    Enabled: bool

    # busy:
    # If the UI should show a progress indicator. Defaults to false.
    # 
    # Change this to true, e.g., while loading more data or validating
    # user input.
    #
    # JSON FLAGS: {"Name":"busy","Required":false,"Excluded":false}
    Busy: bool

    # ignoreFocusOut:
    # If the UI should stay open even when loosing UI focus. Defaults to false.
    #
    # JSON FLAGS: {"Name":"ignoreFocusOut","Required":false,"Excluded":false}
    IgnoreFocusOut: bool




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




Window·ShowInformationMessage1: (message:string -> items:[string] -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInformationMessage1"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowInformationMessage2: (message:string -> options:MessageOptions -> items:[string] -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInformationMessage2"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowInformationMessage3: (message:string -> items:[MessageItem] -> ((?MessageItem->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInformationMessage3"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?MessageItem->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?MessageItem
        if =?payload
            result = ?MessageItem·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?MessageItem->void) -> void)
        onret = a0
    




Window·ShowInformationMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> ((?MessageItem->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInformationMessage4"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?MessageItem->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?MessageItem
        if =?payload
            result = ?MessageItem·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?MessageItem->void) -> void)
        onret = a0
    




Window·ShowWarningMessage1: (message:string -> items:[string] -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWarningMessage1"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowWarningMessage2: (message:string -> options:MessageOptions -> items:[string] -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWarningMessage2"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowWarningMessage3: (message:string -> items:[MessageItem] -> ((?MessageItem->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWarningMessage3"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?MessageItem->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?MessageItem
        if =?payload
            result = ?MessageItem·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?MessageItem->void) -> void)
        onret = a0
    




Window·ShowWarningMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> ((?MessageItem->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWarningMessage4"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?MessageItem->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?MessageItem
        if =?payload
            result = ?MessageItem·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?MessageItem->void) -> void)
        onret = a0
    




Window·ShowErrorMessage1: (message:string -> items:[string] -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showErrorMessage1"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowErrorMessage2: (message:string -> options:MessageOptions -> items:[string] -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showErrorMessage2"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowErrorMessage3: (message:string -> items:[MessageItem] -> ((?MessageItem->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showErrorMessage3"
    msg.Data = dict·new(2)
    msg.Data@"message" = message
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?MessageItem->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?MessageItem
        if =?payload
            result = ?MessageItem·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?MessageItem->void) -> void)
        onret = a0
    




Window·ShowErrorMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> ((?MessageItem->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showErrorMessage4"
    msg.Data = dict·new(3)
    msg.Data@"message" = message
    msg.Data@"options" = options
    msg.Data@"items" = items
    var onresp of (any->bool)
    var onret of (?MessageItem->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?MessageItem
        if =?payload
            result = ?MessageItem·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?MessageItem->void) -> void)
        onret = a0
    




Window·ShowInputBox: (options:?InputBoxOptions -> token:?Cancel -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showInputBox"
    msg.Data = dict·new(2)
    var fnids of [string]
    fnids = [string]·new(1)
    if =?options
        options.ValidateInput_AppzFuncId = ""
        var fn of ?(string->string)
        fn = options.ValidateInput
        if =?fn
            lock this
                options.ValidateInput_AppzFuncId = this.Impl().nextFuncId()
                fnids·add(options.ValidateInput_AppzFuncId)
                this.Impl().cbOther@options.ValidateInput_AppzFuncId = (args:[any] -> [any,bool])
                    if 1 != args·len
                        return [null, false]
                    else
                        var ok of bool
                        var __0 of string
                        if =?args@0
                            [__0, ok] = ((args@0)·(string))
                            if !ok
                                return [null, false]
                        return [fn(__0), true]
                
    if =?options
        msg.Data@"options" = options
    if =?token
        token.impl = this.Impl()
        if "" == token.fnId
            lock this
                token.fnId = this.Impl().nextFuncId()
        msg.Data@"token" = token.fnId
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, (payload:any -> bool)
        if fnids·len != 0
            lock this
                for fnid in fnids
                    this.Impl().cbOther·del(fnid)
        return (=!onresp) || onresp(payload)
    )
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowQuickPick1: (items:[string] -> options:QuickPickOptions -> token:?Cancel -> ((?[string]->void)->void))
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
        if =?fn
            lock this
                options.OnDidSelectItem_AppzFuncId = this.Impl().nextFuncId()
                fnids·add(options.OnDidSelectItem_AppzFuncId)
                this.Impl().cbOther@options.OnDidSelectItem_AppzFuncId = (args:[any] -> [any,bool])
                    if 1 != args·len
                        return [null, false]
                    else
                        var ok of bool
                        var __0 of QuickPickItem
                        if =?args@0
                            __0 = QuickPickItem·new
                            ok = __0.populateFrom(args@0)
                            if !ok
                                return [null, false]
                        else
                            return [null, false]
                        return [fn(__0), true]
                
    msg.Data@"items" = items
    options.CanPickMany = true
    msg.Data@"options" = options
    if =?token
        token.impl = this.Impl()
        if "" == token.fnId
            lock this
                token.fnId = this.Impl().nextFuncId()
        msg.Data@"token" = token.fnId
    var onresp of (any->bool)
    var onret of (?[string]->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?[string]
        if =?payload
            var __coll__result of [any]
            [__coll__result, ok] = ((payload)·([any]))
            if !ok
                return false
            result = [string]·new(__coll__result·len)
            var __idx__result of int
            __idx__result = 0
            for __item__result in __coll__result
                var __val__result of string
                [__val__result, ok] = ((__item__result)·(string))
                if !ok
                    return false
                result@__idx__result = __val__result
                __idx__result = __idx__result + 1
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, (payload:any -> bool)
        if fnids·len != 0
            lock this
                for fnid in fnids
                    this.Impl().cbOther·del(fnid)
        return (=!onresp) || onresp(payload)
    )
    return (a0:(?[string]->void) -> void)
        onret = a0
    




Window·ShowQuickPick2: (items:[string] -> options:?QuickPickOptions -> token:?Cancel -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showQuickPick2"
    msg.Data = dict·new(3)
    var fnids of [string]
    fnids = [string]·new(1)
    if =?options
        options.OnDidSelectItem_AppzFuncId = ""
        var fn of ?(QuickPickItem->any)
        fn = options.OnDidSelectItem
        if =?fn
            lock this
                options.OnDidSelectItem_AppzFuncId = this.Impl().nextFuncId()
                fnids·add(options.OnDidSelectItem_AppzFuncId)
                this.Impl().cbOther@options.OnDidSelectItem_AppzFuncId = (args:[any] -> [any,bool])
                    if 1 != args·len
                        return [null, false]
                    else
                        var ok of bool
                        var __0 of QuickPickItem
                        if =?args@0
                            __0 = QuickPickItem·new
                            ok = __0.populateFrom(args@0)
                            if !ok
                                return [null, false]
                        else
                            return [null, false]
                        return [fn(__0), true]
                
    msg.Data@"items" = items
    if =?options
        msg.Data@"options" = options
    if =?token
        token.impl = this.Impl()
        if "" == token.fnId
            lock this
                token.fnId = this.Impl().nextFuncId()
        msg.Data@"token" = token.fnId
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, (payload:any -> bool)
        if fnids·len != 0
            lock this
                for fnid in fnids
                    this.Impl().cbOther·del(fnid)
        return (=!onresp) || onresp(payload)
    )
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowQuickPick3: (items:[QuickPickItem] -> options:QuickPickOptions -> token:?Cancel -> ((?[QuickPickItem]->void)->void))
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
        if =?fn
            lock this
                options.OnDidSelectItem_AppzFuncId = this.Impl().nextFuncId()
                fnids·add(options.OnDidSelectItem_AppzFuncId)
                this.Impl().cbOther@options.OnDidSelectItem_AppzFuncId = (args:[any] -> [any,bool])
                    if 1 != args·len
                        return [null, false]
                    else
                        var ok of bool
                        var __0 of QuickPickItem
                        if =?args@0
                            __0 = QuickPickItem·new
                            ok = __0.populateFrom(args@0)
                            if !ok
                                return [null, false]
                        else
                            return [null, false]
                        return [fn(__0), true]
                
    msg.Data@"items" = items
    options.CanPickMany = true
    msg.Data@"options" = options
    if =?token
        token.impl = this.Impl()
        if "" == token.fnId
            lock this
                token.fnId = this.Impl().nextFuncId()
        msg.Data@"token" = token.fnId
    var onresp of (any->bool)
    var onret of (?[QuickPickItem]->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?[QuickPickItem]
        if =?payload
            var __coll__result of [any]
            [__coll__result, ok] = ((payload)·([any]))
            if !ok
                return false
            result = [QuickPickItem]·new(__coll__result·len)
            var __idx__result of int
            __idx__result = 0
            for __item__result in __coll__result
                var __val__result of QuickPickItem
                __val__result = QuickPickItem·new
                ok = __val__result.populateFrom(__item__result)
                if !ok
                    return false
                result@__idx__result = __val__result
                __idx__result = __idx__result + 1
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, (payload:any -> bool)
        if fnids·len != 0
            lock this
                for fnid in fnids
                    this.Impl().cbOther·del(fnid)
        return (=!onresp) || onresp(payload)
    )
    return (a0:(?[QuickPickItem]->void) -> void)
        onret = a0
    




Window·ShowQuickPick4: (items:[QuickPickItem] -> options:?QuickPickOptions -> token:?Cancel -> ((?QuickPickItem->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showQuickPick4"
    msg.Data = dict·new(3)
    var fnids of [string]
    fnids = [string]·new(1)
    if =?options
        options.OnDidSelectItem_AppzFuncId = ""
        var fn of ?(QuickPickItem->any)
        fn = options.OnDidSelectItem
        if =?fn
            lock this
                options.OnDidSelectItem_AppzFuncId = this.Impl().nextFuncId()
                fnids·add(options.OnDidSelectItem_AppzFuncId)
                this.Impl().cbOther@options.OnDidSelectItem_AppzFuncId = (args:[any] -> [any,bool])
                    if 1 != args·len
                        return [null, false]
                    else
                        var ok of bool
                        var __0 of QuickPickItem
                        if =?args@0
                            __0 = QuickPickItem·new
                            ok = __0.populateFrom(args@0)
                            if !ok
                                return [null, false]
                        else
                            return [null, false]
                        return [fn(__0), true]
                
    msg.Data@"items" = items
    if =?options
        msg.Data@"options" = options
    if =?token
        token.impl = this.Impl()
        if "" == token.fnId
            lock this
                token.fnId = this.Impl().nextFuncId()
        msg.Data@"token" = token.fnId
    var onresp of (any->bool)
    var onret of (?QuickPickItem->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?QuickPickItem
        if =?payload
            result = ?QuickPickItem·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, (payload:any -> bool)
        if fnids·len != 0
            lock this
                for fnid in fnids
                    this.Impl().cbOther·del(fnid)
        return (=!onresp) || onresp(payload)
    )
    return (a0:(?QuickPickItem->void) -> void)
        onret = a0
    




Window·SetStatusBarMessage1: (text:string -> hideAfterTimeout:int -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.setStatusBarMessage1"
    msg.Data = dict·new(2)
    msg.Data@"text" = text
    msg.Data@"hideAfterTimeout" = hideAfterTimeout
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.Impl()))
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




Window·SetStatusBarMessage2: (text:string -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.setStatusBarMessage2"
    msg.Data = dict·new(1)
    msg.Data@"text" = text
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.Impl()))
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




Window·ShowSaveDialog: (options:SaveDialogOptions -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showSaveDialog"
    msg.Data = dict·new(1)
    msg.Data@"options" = options
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Window·ShowOpenDialog: (options:OpenDialogOptions -> ((?[string]->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showOpenDialog"
    msg.Data = dict·new(1)
    msg.Data@"options" = options
    var onresp of (any->bool)
    var onret of (?[string]->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?[string]
        if =?payload
            var __coll__result of [any]
            [__coll__result, ok] = ((payload)·([any]))
            if !ok
                return false
            result = [string]·new(__coll__result·len)
            var __idx__result of int
            __idx__result = 0
            for __item__result in __coll__result
                var __val__result of string
                [__val__result, ok] = ((__item__result)·(string))
                if !ok
                    return false
                result@__idx__result = __val__result
                __idx__result = __idx__result + 1
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?[string]->void) -> void)
        onret = a0
    




Window·ShowWorkspaceFolderPick: (options:?WorkspaceFolderPickOptions -> ((?WorkspaceFolder->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.showWorkspaceFolderPick"
    msg.Data = dict·new(1)
    if =?options
        msg.Data@"options" = options
    var onresp of (any->bool)
    var onret of (?WorkspaceFolder->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?WorkspaceFolder
        if =?payload
            result = ?WorkspaceFolder·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?WorkspaceFolder->void) -> void)
        onret = a0
    




Window·State: ( -> ((WindowState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.state"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (WindowState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of WindowState
        if =?payload
            result = WindowState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(WindowState->void) -> void)
        onret = a0
    




Window·OnDidChangeWindowState: (listener:(WindowState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.onDidChangeWindowState"
    msg.Data = dict·new(1)
    var _fnid_listener of string
    if =!listener
        OnError(this.Impl(), "Window.OnDidChangeWindowState: the 'listener' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_listener = this.Impl().nextSub((args:[any] -> bool)
        var ok of bool
        if 1 != args·len
            return ok
        var _a_0_ of WindowState
        _a_0_ = WindowState·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        listener(_a_0_)
        return true
    , null)
    msg.Data@"listener" = _fnid_listener
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.Impl(), _fnid_listener))
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




Window·CreateStatusBarItem: (alignment:?StatusBarAlignment -> priority:?int -> ((StatusBarItem->StatusBarItemState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.createStatusBarItem"
    msg.Data = dict·new(2)
    if =?alignment
        msg.Data@"alignment" = alignment
    if =?priority
        msg.Data@"priority" = priority
    var onresp of (any->bool)
    var onret of (StatusBarItem->StatusBarItemState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of StatusBarItem
        if =?payload
            result = StatusBarItem·new
            ok = result.populateFrom(payload)
            if !ok
                return false
            result.disp.impl = this.Impl()
        result.Get()((state:StatusBarItemState -> void)
            if =?onret
                onret(result, state)
        )
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(StatusBarItem->StatusBarItemState->void) -> void)
        onret = a0
    




Window·CreateOutputChannel: (name:string -> ((OutputChannel->OutputChannelState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.createOutputChannel"
    msg.Data = dict·new(1)
    msg.Data@"name" = name
    var onresp of (any->bool)
    var onret of (OutputChannel->OutputChannelState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of OutputChannel
        if =?payload
            result = OutputChannel·new
            ok = result.populateFrom(payload)
            if !ok
                return false
            result.disp.impl = this.Impl()
        result.Get()((state:OutputChannelState -> void)
            if =?onret
                onret(result, state)
        )
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(OutputChannel->OutputChannelState->void) -> void)
        onret = a0
    




Window·CreateTextEditorDecorationType: (options:DecorationRenderOptions -> ((TextEditorDecorationType->TextEditorDecorationTypeState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.createTextEditorDecorationType"
    msg.Data = dict·new(1)
    msg.Data@"options" = options
    var onresp of (any->bool)
    var onret of (TextEditorDecorationType->TextEditorDecorationTypeState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of TextEditorDecorationType
        if =?payload
            result = TextEditorDecorationType·new
            ok = result.populateFrom(payload)
            if !ok
                return false
            result.disp.impl = this.Impl()
        result.Get()((state:TextEditorDecorationTypeState -> void)
            if =?onret
                onret(result, state)
        )
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(TextEditorDecorationType->TextEditorDecorationTypeState->void) -> void)
        onret = a0
    




Window·CreateInputBox: ( -> ((InputBox->InputBoxState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.createInputBox"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (InputBox->InputBoxState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of InputBox
        if =?payload
            result = InputBox·new
            ok = result.populateFrom(payload)
            if !ok
                return false
            result.disp.impl = this.Impl()
        result.Get()((state:InputBoxState -> void)
            if =?onret
                onret(result, state)
        )
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(InputBox->InputBoxState->void) -> void)
        onret = a0
    




Window·CreateQuickPick: ( -> ((QuickPick->QuickPickState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "window.createQuickPick"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (QuickPick->QuickPickState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of QuickPick
        if =?payload
            result = QuickPick·new
            ok = result.populateFrom(payload)
            if !ok
                return false
            result.disp.impl = this.Impl()
        result.Get()((state:QuickPickState -> void)
            if =?onret
                onret(result, state)
        )
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(QuickPick->QuickPickState->void) -> void)
        onret = a0
    




Env·OpenExternal: (target:string -> ((bool->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.openExternal"
    msg.Data = dict·new(1)
    msg.Data@"target" = target
    var onresp of (any->bool)
    var onret of (bool->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of bool
        if =?payload
            [result, ok] = ((payload)·(bool))
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(bool->void) -> void)
        onret = a0
    




Env·AppName: ( -> ((string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.appName"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of string
        if =?payload
            [result, ok] = ((payload)·(string))
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(string->void) -> void)
        onret = a0
    




Env·AppRoot: ( -> ((string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.appRoot"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of string
        if =?payload
            [result, ok] = ((payload)·(string))
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(string->void) -> void)
        onret = a0
    




Env·Language: ( -> ((string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.language"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of string
        if =?payload
            [result, ok] = ((payload)·(string))
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(string->void) -> void)
        onret = a0
    




Env·MachineId: ( -> ((string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.machineId"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of string
        if =?payload
            [result, ok] = ((payload)·(string))
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(string->void) -> void)
        onret = a0
    




Env·RemoteName: ( -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.remoteName"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Env·SessionId: ( -> ((string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.sessionId"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of string
        if =?payload
            [result, ok] = ((payload)·(string))
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(string->void) -> void)
        onret = a0
    




Env·Shell: ( -> ((string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.shell"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of string
        if =?payload
            [result, ok] = ((payload)·(string))
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(string->void) -> void)
        onret = a0
    




Env·UriScheme: ( -> ((string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.uriScheme"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of string
        if =?payload
            [result, ok] = ((payload)·(string))
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(string->void) -> void)
        onret = a0
    




Env·Properties: ( -> ((EnvProperties->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "env.Properties"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (EnvProperties->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of EnvProperties
        if =?payload
            result = EnvProperties·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(EnvProperties->void) -> void)
        onret = a0
    




Env·Clipboard: ( -> Clipboard)
    return ((this.Impl())·(implClipboard))




Clipboard·ReadText: ( -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "clipboard.readText"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Clipboard·WriteText: (value:string -> ((void->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "clipboard.writeText"
    msg.Data = dict·new(1)
    msg.Data@"value" = value
    var onresp of (any->bool)
    var onret of (void->void)
    onresp = (payload:any -> bool)
        if =?payload
            return false
        if =?onret
            onret()
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(void->void) -> void)
        onret = a0
    




Workspace·Name: ( -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.name"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Workspace·WorkspaceFile: ( -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.workspaceFile"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Workspace·SaveAll: (includeUntitled:bool -> ((bool->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.saveAll"
    msg.Data = dict·new(1)
    msg.Data@"includeUntitled" = includeUntitled
    var onresp of (any->bool)
    var onret of (bool->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of bool
        if =?payload
            [result, ok] = ((payload)·(bool))
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(bool->void) -> void)
        onret = a0
    




Workspace·OnDidChangeWorkspaceFolders: (listener:(WorkspaceFoldersChangeEvent->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.onDidChangeWorkspaceFolders"
    msg.Data = dict·new(1)
    var _fnid_listener of string
    if =!listener
        OnError(this.Impl(), "Workspace.OnDidChangeWorkspaceFolders: the 'listener' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_listener = this.Impl().nextSub((args:[any] -> bool)
        var ok of bool
        if 1 != args·len
            return ok
        var _a_0_ of WorkspaceFoldersChangeEvent
        _a_0_ = WorkspaceFoldersChangeEvent·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        listener(_a_0_)
        return true
    , null)
    msg.Data@"listener" = _fnid_listener
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.Impl(), _fnid_listener))
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




Workspace·GetWorkspaceFolder: (uri:string -> ((?WorkspaceFolder->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.getWorkspaceFolder"
    msg.Data = dict·new(1)
    msg.Data@"uri" = uri
    var onresp of (any->bool)
    var onret of (?WorkspaceFolder->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?WorkspaceFolder
        if =?payload
            result = ?WorkspaceFolder·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?WorkspaceFolder->void) -> void)
        onret = a0
    




Workspace·WorkspaceFolders: ( -> ((?[WorkspaceFolder]->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.workspaceFolders"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (?[WorkspaceFolder]->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?[WorkspaceFolder]
        if =?payload
            var __coll__result of [any]
            [__coll__result, ok] = ((payload)·([any]))
            if !ok
                return false
            result = [WorkspaceFolder]·new(__coll__result·len)
            var __idx__result of int
            __idx__result = 0
            for __item__result in __coll__result
                var __val__result of WorkspaceFolder
                __val__result = WorkspaceFolder·new
                ok = __val__result.populateFrom(__item__result)
                if !ok
                    return false
                result@__idx__result = __val__result
                __idx__result = __idx__result + 1
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?[WorkspaceFolder]->void) -> void)
        onret = a0
    




Workspace·FindFiles: (include:string -> exclude:?string -> maxResults:?int -> token:?Cancel -> ((?[string]->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.findFiles"
    msg.Data = dict·new(4)
    msg.Data@"include" = include
    if =?exclude
        msg.Data@"exclude" = exclude
    if =?maxResults
        msg.Data@"maxResults" = maxResults
    if =?token
        token.impl = this.Impl()
        if "" == token.fnId
            lock this
                token.fnId = this.Impl().nextFuncId()
        msg.Data@"token" = token.fnId
    var onresp of (any->bool)
    var onret of (?[string]->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?[string]
        if =?payload
            var __coll__result of [any]
            [__coll__result, ok] = ((payload)·([any]))
            if !ok
                return false
            result = [string]·new(__coll__result·len)
            var __idx__result of int
            __idx__result = 0
            for __item__result in __coll__result
                var __val__result of string
                [__val__result, ok] = ((__item__result)·(string))
                if !ok
                    return false
                result@__idx__result = __val__result
                __idx__result = __idx__result + 1
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?[string]->void) -> void)
        onret = a0
    




Workspace·AsRelativePath: (pathOrUri:string -> includeWorkspaceFolder:bool -> ((?string->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.asRelativePath"
    msg.Data = dict·new(2)
    msg.Data@"pathOrUri" = pathOrUri
    msg.Data@"includeWorkspaceFolder" = includeWorkspaceFolder
    var onresp of (any->bool)
    var onret of (?string->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?string
        if =?payload
            var _result_ of string
            [_result_, ok] = ((payload)·(string))
            if !ok
                return false
            result = &_result_
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?string->void) -> void)
        onret = a0
    




Workspace·Properties: ( -> ((WorkspaceProperties->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "workspace.Properties"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (WorkspaceProperties->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of WorkspaceProperties
        if =?payload
            result = WorkspaceProperties·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(WorkspaceProperties->void) -> void)
        onret = a0
    




Languages·GetLanguages: ( -> ((?[string]->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "languages.getLanguages"
    msg.Data = dict·new(0)
    var onresp of (any->bool)
    var onret of (?[string]->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?[string]
        if =?payload
            var __coll__result of [any]
            [__coll__result, ok] = ((payload)·([any]))
            if !ok
                return false
            result = [string]·new(__coll__result·len)
            var __idx__result of int
            __idx__result = 0
            for __item__result in __coll__result
                var __val__result of string
                [__val__result, ok] = ((__item__result)·(string))
                if !ok
                    return false
                result@__idx__result = __val__result
                __idx__result = __idx__result + 1
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?[string]->void) -> void)
        onret = a0
    




Languages·OnDidChangeDiagnostics: (listener:(DiagnosticChangeEvent->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "languages.onDidChangeDiagnostics"
    msg.Data = dict·new(1)
    var _fnid_listener of string
    if =!listener
        OnError(this.Impl(), "Languages.OnDidChangeDiagnostics: the 'listener' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_listener = this.Impl().nextSub((args:[any] -> bool)
        var ok of bool
        if 1 != args·len
            return ok
        var _a_0_ of DiagnosticChangeEvent
        _a_0_ = DiagnosticChangeEvent·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        listener(_a_0_)
        return true
    , null)
    msg.Data@"listener" = _fnid_listener
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.Impl(), _fnid_listener))
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




Extensions·OnDidChange: (listener:(->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "extensions.onDidChange"
    msg.Data = dict·new(1)
    var _fnid_listener of string
    if =!listener
        OnError(this.Impl(), "Extensions.OnDidChange: the 'listener' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_listener = this.Impl().nextSub((args:[any] -> bool)
        var ok of bool
        if 0 != args·len
            return ok
        listener()
        return true
    , null)
    msg.Data@"listener" = _fnid_listener
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.Impl(), _fnid_listener))
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




Commands·RegisterCommand: (command:string -> callback:([any]->any) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "commands.registerCommand"
    msg.Data = dict·new(2)
    msg.Data@"command" = command
    var _fnid_callback of string
    if =!callback
        OnError(this.Impl(), "Commands.RegisterCommand: the 'callback' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_callback = this.Impl().nextSub(null, (args:[any] -> [any,bool])
        var ok of bool
        if 1 != args·len
            return [null, ok]
        var ret of any
        var _a_0_ of [any]
        [_a_0_, ok] = ((args@0)·([any]))
        if !ok
            return [null, false]
        ret = callback(_a_0_)
        return [ret, true]
    )
    msg.Data@"callback" = _fnid_callback
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.Impl(), _fnid_callback))
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




Commands·ExecuteCommand: (command:string -> rest:[any] -> ((?any->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "commands.executeCommand"
    msg.Data = dict·new(2)
    msg.Data@"command" = command
    msg.Data@"rest" = rest
    var onresp of (any->bool)
    var onret of (?any->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?any
        if =?payload
            [result, ok] = [payload, true]
            if ok
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?any->void) -> void)
        onret = a0
    




Commands·GetCommands: (filterInternal:bool -> ((?[string]->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "commands.getCommands"
    msg.Data = dict·new(1)
    msg.Data@"filterInternal" = filterInternal
    var onresp of (any->bool)
    var onret of (?[string]->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?[string]
        if =?payload
            var __coll__result of [any]
            [__coll__result, ok] = ((payload)·([any]))
            if !ok
                return false
            result = [string]·new(__coll__result·len)
            var __idx__result of int
            __idx__result = 0
            for __item__result in __coll__result
                var __val__result of string
                [__val__result, ok] = ((__item__result)·(string))
                if !ok
                    return false
                result@__idx__result = __val__result
                __idx__result = __idx__result + 1
        if =?onret
            onret(result)
        return true
    
    this.Impl().send(msg, onresp)
    return (a0:(?[string]->void) -> void)
        onret = a0
    




StatusBarItem·Show: ( -> ((?StatusBarItemState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "StatusBarItem.show"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (?StatusBarItemState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?StatusBarItemState
        if =?payload
            result = ?StatusBarItemState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?StatusBarItemState->void) -> void)
        onret = a0
    




StatusBarItem·Hide: ( -> ((?StatusBarItemState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "StatusBarItem.hide"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (?StatusBarItemState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?StatusBarItemState
        if =?payload
            result = ?StatusBarItemState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?StatusBarItemState->void) -> void)
        onret = a0
    




StatusBarItem·Dispose: ( -> ((void->void)->void))
    return this.disp.Dispose()




StatusBarItem·Get: ( -> ((StatusBarItemState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "StatusBarItem.appzObjPropsGet"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (StatusBarItemState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of StatusBarItemState
        if =?payload
            result = StatusBarItemState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(StatusBarItemState->void) -> void)
        onret = a0
    




StatusBarItem·Set: (allUpdates:StatusBarItemState -> ((void->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "StatusBarItem.appzObjPropsSet"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    msg.Data@"allUpdates" = allUpdates
    var onresp of (any->bool)
    var onret of (void->void)
    onresp = (payload:any -> bool)
        if =?payload
            return false
        if =?onret
            onret()
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(void->void) -> void)
        onret = a0
    




OutputChannel·Append: (value:string -> ((?OutputChannelState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "OutputChannel.append"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    msg.Data@"value" = value
    var onresp of (any->bool)
    var onret of (?OutputChannelState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?OutputChannelState
        if =?payload
            result = ?OutputChannelState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?OutputChannelState->void) -> void)
        onret = a0
    




OutputChannel·AppendLine: (value:string -> ((?OutputChannelState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "OutputChannel.appendLine"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    msg.Data@"value" = value
    var onresp of (any->bool)
    var onret of (?OutputChannelState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?OutputChannelState
        if =?payload
            result = ?OutputChannelState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?OutputChannelState->void) -> void)
        onret = a0
    




OutputChannel·Clear: ( -> ((?OutputChannelState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "OutputChannel.clear"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (?OutputChannelState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?OutputChannelState
        if =?payload
            result = ?OutputChannelState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?OutputChannelState->void) -> void)
        onret = a0
    




OutputChannel·Show: (preserveFocus:bool -> ((?OutputChannelState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "OutputChannel.show"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    msg.Data@"preserveFocus" = preserveFocus
    var onresp of (any->bool)
    var onret of (?OutputChannelState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?OutputChannelState
        if =?payload
            result = ?OutputChannelState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?OutputChannelState->void) -> void)
        onret = a0
    




OutputChannel·Hide: ( -> ((?OutputChannelState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "OutputChannel.hide"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (?OutputChannelState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?OutputChannelState
        if =?payload
            result = ?OutputChannelState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?OutputChannelState->void) -> void)
        onret = a0
    




OutputChannel·Dispose: ( -> ((void->void)->void))
    return this.disp.Dispose()




OutputChannel·Get: ( -> ((OutputChannelState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "OutputChannel.appzObjPropsGet"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (OutputChannelState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of OutputChannelState
        if =?payload
            result = OutputChannelState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(OutputChannelState->void) -> void)
        onret = a0
    




TextEditorDecorationType·Dispose: ( -> ((void->void)->void))
    return this.disp.Dispose()




TextEditorDecorationType·Get: ( -> ((TextEditorDecorationTypeState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "TextEditorDecorationType.appzObjPropsGet"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (TextEditorDecorationTypeState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of TextEditorDecorationTypeState
        if =?payload
            result = TextEditorDecorationTypeState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(TextEditorDecorationTypeState->void) -> void)
        onret = a0
    




InputBox·OnDidChangeValue: (handler:(string->InputBoxState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "InputBox.onDidChangeValue"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "InputBox.OnDidChangeValue: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 2 != args·len
            return ok
        var _a_0_ of string
        [_a_0_, ok] = ((args@0)·(string))
        if !ok
            return false
        var _a_1_ of InputBoxState
        _a_1_ = InputBoxState·new
        ok = _a_1_.populateFrom(args@1)
        if !ok
            return false
        handler(_a_0_, _a_1_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




InputBox·OnDidAccept: (handler:(InputBoxState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "InputBox.onDidAccept"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "InputBox.OnDidAccept: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 1 != args·len
            return ok
        var _a_0_ of InputBoxState
        _a_0_ = InputBoxState·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        handler(_a_0_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




InputBox·OnDidTriggerButton: (handler:(QuickInputButton->InputBoxState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "InputBox.onDidTriggerButton"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "InputBox.OnDidTriggerButton: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 2 != args·len
            return ok
        var _a_0_ of QuickInputButton
        _a_0_ = QuickInputButton·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        var _a_1_ of InputBoxState
        _a_1_ = InputBoxState·new
        ok = _a_1_.populateFrom(args@1)
        if !ok
            return false
        handler(_a_0_, _a_1_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




InputBox·Show: ( -> ((?InputBoxState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "InputBox.show"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (?InputBoxState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?InputBoxState
        if =?payload
            result = ?InputBoxState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?InputBoxState->void) -> void)
        onret = a0
    




InputBox·Hide: ( -> ((?InputBoxState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "InputBox.hide"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (?InputBoxState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?InputBoxState
        if =?payload
            result = ?InputBoxState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?InputBoxState->void) -> void)
        onret = a0
    




InputBox·OnDidHide: (handler:(InputBoxState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "InputBox.onDidHide"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "InputBox.OnDidHide: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 1 != args·len
            return ok
        var _a_0_ of InputBoxState
        _a_0_ = InputBoxState·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        handler(_a_0_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




InputBox·Dispose: ( -> ((void->void)->void))
    return this.disp.Dispose()




InputBox·Get: ( -> ((InputBoxState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "InputBox.appzObjPropsGet"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (InputBoxState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of InputBoxState
        if =?payload
            result = InputBoxState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(InputBoxState->void) -> void)
        onret = a0
    




InputBox·Set: (allUpdates:InputBoxState -> ((void->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "InputBox.appzObjPropsSet"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    msg.Data@"allUpdates" = allUpdates
    var onresp of (any->bool)
    var onret of (void->void)
    onresp = (payload:any -> bool)
        if =?payload
            return false
        if =?onret
            onret()
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(void->void) -> void)
        onret = a0
    




QuickPick·OnDidChangeValue: (handler:(string->QuickPickState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.onDidChangeValue"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "QuickPick.OnDidChangeValue: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 2 != args·len
            return ok
        var _a_0_ of string
        [_a_0_, ok] = ((args@0)·(string))
        if !ok
            return false
        var _a_1_ of QuickPickState
        _a_1_ = QuickPickState·new
        ok = _a_1_.populateFrom(args@1)
        if !ok
            return false
        handler(_a_0_, _a_1_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




QuickPick·OnDidAccept: (handler:(QuickPickState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.onDidAccept"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "QuickPick.OnDidAccept: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 1 != args·len
            return ok
        var _a_0_ of QuickPickState
        _a_0_ = QuickPickState·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        handler(_a_0_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




QuickPick·OnDidTriggerButton: (handler:(QuickInputButton->QuickPickState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.onDidTriggerButton"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "QuickPick.OnDidTriggerButton: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 2 != args·len
            return ok
        var _a_0_ of QuickInputButton
        _a_0_ = QuickInputButton·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        var _a_1_ of QuickPickState
        _a_1_ = QuickPickState·new
        ok = _a_1_.populateFrom(args@1)
        if !ok
            return false
        handler(_a_0_, _a_1_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




QuickPick·OnDidChangeActive: (handler:([QuickPickItem]->QuickPickState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.onDidChangeActive"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "QuickPick.OnDidChangeActive: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 2 != args·len
            return ok
        var _a_0_ of [QuickPickItem]
        var __coll___a_0_ of [any]
        [__coll___a_0_, ok] = ((args@0)·([any]))
        if !ok
            return false
        _a_0_ = [QuickPickItem]·new(__coll___a_0_·len)
        var __idx___a_0_ of int
        __idx___a_0_ = 0
        for __item___a_0_ in __coll___a_0_
            var __val___a_0_ of QuickPickItem
            __val___a_0_ = QuickPickItem·new
            ok = __val___a_0_.populateFrom(__item___a_0_)
            if !ok
                return false
            _a_0_@__idx___a_0_ = __val___a_0_
            __idx___a_0_ = __idx___a_0_ + 1
        var _a_1_ of QuickPickState
        _a_1_ = QuickPickState·new
        ok = _a_1_.populateFrom(args@1)
        if !ok
            return false
        handler(_a_0_, _a_1_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




QuickPick·OnDidChangeSelection: (handler:([QuickPickItem]->QuickPickState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.onDidChangeSelection"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "QuickPick.OnDidChangeSelection: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 2 != args·len
            return ok
        var _a_0_ of [QuickPickItem]
        var __coll___a_0_ of [any]
        [__coll___a_0_, ok] = ((args@0)·([any]))
        if !ok
            return false
        _a_0_ = [QuickPickItem]·new(__coll___a_0_·len)
        var __idx___a_0_ of int
        __idx___a_0_ = 0
        for __item___a_0_ in __coll___a_0_
            var __val___a_0_ of QuickPickItem
            __val___a_0_ = QuickPickItem·new
            ok = __val___a_0_.populateFrom(__item___a_0_)
            if !ok
                return false
            _a_0_@__idx___a_0_ = __val___a_0_
            __idx___a_0_ = __idx___a_0_ + 1
        var _a_1_ of QuickPickState
        _a_1_ = QuickPickState·new
        ok = _a_1_.populateFrom(args@1)
        if !ok
            return false
        handler(_a_0_, _a_1_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




QuickPick·Show: ( -> ((?QuickPickState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.show"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (?QuickPickState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?QuickPickState
        if =?payload
            result = ?QuickPickState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?QuickPickState->void) -> void)
        onret = a0
    




QuickPick·Hide: ( -> ((?QuickPickState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.hide"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (?QuickPickState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?QuickPickState
        if =?payload
            result = ?QuickPickState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?QuickPickState->void) -> void)
        onret = a0
    




QuickPick·OnDidHide: (handler:(QuickPickState->void) -> ((?Disposable->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.onDidHide"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    var _fnid_handler of string
    if =!handler
        OnError(this.disp.impl, "QuickPick.OnDidHide: the 'handler' arg (which is not optional but required) was not passed by the caller", null)
        return null
    _fnid_handler = this.disp.impl.nextSub((args:[any] -> bool)
        var ok of bool
        if 1 != args·len
            return ok
        var _a_0_ of QuickPickState
        _a_0_ = QuickPickState·new
        ok = _a_0_.populateFrom(args@0)
        if !ok
            return false
        handler(_a_0_)
        return true
    , null)
    msg.Data@"handler" = _fnid_handler
    var onresp of (any->bool)
    var onret of (?Disposable->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of ?Disposable
        if =?payload
            result = ?Disposable·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        else
            return false
        if =?onret
            onret(result.bind(this.disp.impl, _fnid_handler))
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(?Disposable->void) -> void)
        onret = a0
    




QuickPick·Dispose: ( -> ((void->void)->void))
    return this.disp.Dispose()




QuickPick·Get: ( -> ((QuickPickState->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.appzObjPropsGet"
    msg.Data = dict·new(1)
    msg.Data@"" = this.disp.id
    var onresp of (any->bool)
    var onret of (QuickPickState->void)
    onresp = (payload:any -> bool)
        var ok of bool
        var result of QuickPickState
        if =?payload
            result = QuickPickState·new
            ok = result.populateFrom(payload)
            if !ok
                return false
        if =?onret
            onret(result)
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(QuickPickState->void) -> void)
        onret = a0
    




QuickPick·Set: (allUpdates:QuickPickState -> ((void->void)->void))
    var msg of ?ipcMsg
    msg = ?ipcMsg·new
    msg.QName = "QuickPick.appzObjPropsSet"
    msg.Data = dict·new(2)
    msg.Data@"" = this.disp.id
    msg.Data@"allUpdates" = allUpdates
    var onresp of (any->bool)
    var onret of (void->void)
    onresp = (payload:any -> bool)
        if =?payload
            return false
        if =?onret
            onret()
        return true
    
    this.disp.impl.send(msg, onresp)
    return (a0:(void->void) -> void)
        onret = a0
    




MessageItem·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"title"
    if ok
        var title of string
        if =?val
            [title, ok] = ((val)·(string))
            if !ok
                return false
        this.Title = title
    else
        return false
    [val, ok] = it@?"isCloseAffordance"
    if ok
        var isCloseAffordance of ?bool
        if =?val
            var _isCloseAffordance_ of bool
            [_isCloseAffordance_, ok] = ((val)·(bool))
            if !ok
                return false
            isCloseAffordance = &_isCloseAffordance_
        this.IsCloseAffordance = isCloseAffordance
    [val, ok] = it@?"my"
    if ok
        var my of ?dict
        if =?val
            [my, ok] = ((val)·(?dict))
            if !ok
                return false
        this.My = my
    return true




QuickPickItem·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"label"
    if ok
        var label of string
        if =?val
            [label, ok] = ((val)·(string))
            if !ok
                return false
        this.Label = label
    else
        return false
    [val, ok] = it@?"description"
    if ok
        var description of ?string
        if =?val
            var _description_ of string
            [_description_, ok] = ((val)·(string))
            if !ok
                return false
            description = &_description_
        this.Description = description
    [val, ok] = it@?"detail"
    if ok
        var detail of ?string
        if =?val
            var _detail_ of string
            [_detail_, ok] = ((val)·(string))
            if !ok
                return false
            detail = &_detail_
        this.Detail = detail
    [val, ok] = it@?"picked"
    if ok
        var picked of ?bool
        if =?val
            var _picked_ of bool
            [_picked_, ok] = ((val)·(bool))
            if !ok
                return false
            picked = &_picked_
        this.Picked = picked
    [val, ok] = it@?"alwaysShow"
    if ok
        var alwaysShow of ?bool
        if =?val
            var _alwaysShow_ of bool
            [_alwaysShow_, ok] = ((val)·(bool))
            if !ok
                return false
            alwaysShow = &_alwaysShow_
        this.AlwaysShow = alwaysShow
    [val, ok] = it@?"my"
    if ok
        var my of ?dict
        if =?val
            [my, ok] = ((val)·(?dict))
            if !ok
                return false
        this.My = my
    return true




WorkspaceFolder·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"uri"
    if ok
        var uri of string
        if =?val
            [uri, ok] = ((val)·(string))
            if !ok
                return false
        this.Uri = uri
    else
        return false
    [val, ok] = it@?"name"
    if ok
        var name of string
        if =?val
            [name, ok] = ((val)·(string))
            if !ok
                return false
        this.Name = name
    else
        return false
    [val, ok] = it@?"index"
    if ok
        var index of int
        if =?val
            [index, ok] = ((val)·(int))
            if !ok
                var __index__ of real
                [__index__, ok] = ((val)·(real))
                if !ok
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
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"focused"
    if ok
        var focused of bool
        if =?val
            [focused, ok] = ((val)·(bool))
            if !ok
                return false
        this.Focused = focused
    else
        return false
    return true




StatusBarItem·populateFrom: (payload:any -> bool)
    var ok of bool
    this.disp = ?Disposable·new
    ok = this.disp.populateFrom(payload)
    return ok




OutputChannel·populateFrom: (payload:any -> bool)
    var ok of bool
    this.disp = ?Disposable·new
    ok = this.disp.populateFrom(payload)
    return ok




TextEditorDecorationType·populateFrom: (payload:any -> bool)
    var ok of bool
    this.disp = ?Disposable·new
    ok = this.disp.populateFrom(payload)
    return ok




InputBox·populateFrom: (payload:any -> bool)
    var ok of bool
    this.disp = ?Disposable·new
    ok = this.disp.populateFrom(payload)
    return ok




QuickPick·populateFrom: (payload:any -> bool)
    var ok of bool
    this.disp = ?Disposable·new
    ok = this.disp.populateFrom(payload)
    return ok




EnvProperties·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"appName"
    if ok
        var appName of ?string
        if =?val
            var _appName_ of string
            [_appName_, ok] = ((val)·(string))
            if !ok
                return false
            appName = &_appName_
        this.AppName = appName
    [val, ok] = it@?"appRoot"
    if ok
        var appRoot of ?string
        if =?val
            var _appRoot_ of string
            [_appRoot_, ok] = ((val)·(string))
            if !ok
                return false
            appRoot = &_appRoot_
        this.AppRoot = appRoot
    [val, ok] = it@?"language"
    if ok
        var language of ?string
        if =?val
            var _language_ of string
            [_language_, ok] = ((val)·(string))
            if !ok
                return false
            language = &_language_
        this.Language = language
    [val, ok] = it@?"machineId"
    if ok
        var machineId of ?string
        if =?val
            var _machineId_ of string
            [_machineId_, ok] = ((val)·(string))
            if !ok
                return false
            machineId = &_machineId_
        this.MachineId = machineId
    [val, ok] = it@?"remoteName"
    if ok
        var remoteName of ?string
        if =?val
            var _remoteName_ of string
            [_remoteName_, ok] = ((val)·(string))
            if !ok
                return false
            remoteName = &_remoteName_
        this.RemoteName = remoteName
    [val, ok] = it@?"sessionId"
    if ok
        var sessionId of ?string
        if =?val
            var _sessionId_ of string
            [_sessionId_, ok] = ((val)·(string))
            if !ok
                return false
            sessionId = &_sessionId_
        this.SessionId = sessionId
    [val, ok] = it@?"shell"
    if ok
        var shell of ?string
        if =?val
            var _shell_ of string
            [_shell_, ok] = ((val)·(string))
            if !ok
                return false
            shell = &_shell_
        this.Shell = shell
    [val, ok] = it@?"uriScheme"
    if ok
        var uriScheme of ?string
        if =?val
            var _uriScheme_ of string
            [_uriScheme_, ok] = ((val)·(string))
            if !ok
                return false
            uriScheme = &_uriScheme_
        this.UriScheme = uriScheme
    return true




WorkspaceFoldersChangeEvent·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"added"
    if ok
        var added of [WorkspaceFolder]
        if =?val
            var __coll__added of [any]
            [__coll__added, ok] = ((val)·([any]))
            if !ok
                return false
            added = [WorkspaceFolder]·new(__coll__added·len)
            var __idx__added of int
            __idx__added = 0
            for __item__added in __coll__added
                var __val__added of WorkspaceFolder
                __val__added = WorkspaceFolder·new
                ok = __val__added.populateFrom(__item__added)
                if !ok
                    return false
                added@__idx__added = __val__added
                __idx__added = __idx__added + 1
        this.Added = added
    else
        return false
    [val, ok] = it@?"removed"
    if ok
        var removed of [WorkspaceFolder]
        if =?val
            var __coll__removed of [any]
            [__coll__removed, ok] = ((val)·([any]))
            if !ok
                return false
            removed = [WorkspaceFolder]·new(__coll__removed·len)
            var __idx__removed of int
            __idx__removed = 0
            for __item__removed in __coll__removed
                var __val__removed of WorkspaceFolder
                __val__removed = WorkspaceFolder·new
                ok = __val__removed.populateFrom(__item__removed)
                if !ok
                    return false
                removed@__idx__removed = __val__removed
                __idx__removed = __idx__removed + 1
        this.Removed = removed
    else
        return false
    return true




WorkspaceProperties·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"name"
    if ok
        var name of ?string
        if =?val
            var _name_ of string
            [_name_, ok] = ((val)·(string))
            if !ok
                return false
            name = &_name_
        this.Name = name
    [val, ok] = it@?"workspaceFile"
    if ok
        var workspaceFile of ?string
        if =?val
            var _workspaceFile_ of string
            [_workspaceFile_, ok] = ((val)·(string))
            if !ok
                return false
            workspaceFile = &_workspaceFile_
        this.WorkspaceFile = workspaceFile
    [val, ok] = it@?"workspaceFolders"
    if ok
        var workspaceFolders of ?[WorkspaceFolder]
        if =?val
            var __coll__workspaceFolders of [any]
            [__coll__workspaceFolders, ok] = ((val)·([any]))
            if !ok
                return false
            workspaceFolders = [WorkspaceFolder]·new(__coll__workspaceFolders·len)
            var __idx__workspaceFolders of int
            __idx__workspaceFolders = 0
            for __item__workspaceFolders in __coll__workspaceFolders
                var __val__workspaceFolders of WorkspaceFolder
                __val__workspaceFolders = WorkspaceFolder·new
                ok = __val__workspaceFolders.populateFrom(__item__workspaceFolders)
                if !ok
                    return false
                workspaceFolders@__idx__workspaceFolders = __val__workspaceFolders
                __idx__workspaceFolders = __idx__workspaceFolders + 1
        this.WorkspaceFolders = workspaceFolders
    return true




DiagnosticChangeEvent·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"uris"
    if ok
        var uris of [string]
        if =?val
            var __coll__uris of [any]
            [__coll__uris, ok] = ((val)·([any]))
            if !ok
                return false
            uris = [string]·new(__coll__uris·len)
            var __idx__uris of int
            __idx__uris = 0
            for __item__uris in __coll__uris
                var __val__uris of string
                [__val__uris, ok] = ((__item__uris)·(string))
                if !ok
                    return false
                uris@__idx__uris = __val__uris
                __idx__uris = __idx__uris + 1
        this.Uris = uris
    else
        return false
    return true




StatusBarItemState·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"alignment"
    if ok
        var alignment of StatusBarAlignment
        if =?val
            var i_alignment of int
            [i_alignment, ok] = ((val)·(int))
            if !ok
                var __i_alignment__ of real
                [__i_alignment__, ok] = ((val)·(real))
                if !ok
                    return false
                i_alignment = ((__i_alignment__)·(int))
            alignment = ((i_alignment)·(StatusBarAlignment))
        this.Alignment = ( -> StatusBarAlignment)
            return alignment
        
    [val, ok] = it@?"priority"
    if ok
        var priority of int
        if =?val
            [priority, ok] = ((val)·(int))
            if !ok
                var __priority__ of real
                [__priority__, ok] = ((val)·(real))
                if !ok
                    return false
                priority = ((__priority__)·(int))
        this.Priority = ( -> int)
            return priority
        
    [val, ok] = it@?"text"
    if ok
        var text of string
        if =?val
            [text, ok] = ((val)·(string))
            if !ok
                return false
        this.Text = text
    [val, ok] = it@?"tooltip"
    if ok
        var tooltip of string
        if =?val
            [tooltip, ok] = ((val)·(string))
            if !ok
                return false
        this.Tooltip = tooltip
    [val, ok] = it@?"color"
    if ok
        var color of string
        if =?val
            [color, ok] = ((val)·(string))
            if !ok
                return false
        this.Color = color
    [val, ok] = it@?"command"
    if ok
        var command of string
        if =?val
            [command, ok] = ((val)·(string))
            if !ok
                return false
        this.Command = command
    return true




OutputChannelState·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"name"
    if ok
        var name of string
        if =?val
            [name, ok] = ((val)·(string))
            if !ok
                return false
        this.Name = ( -> string)
            return name
        
    return true




TextEditorDecorationTypeState·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"key"
    if ok
        var key of string
        if =?val
            [key, ok] = ((val)·(string))
            if !ok
                return false
        this.Key = ( -> string)
            return key
        
    return true




InputBoxState·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"value"
    if ok
        var value of string
        if =?val
            [value, ok] = ((val)·(string))
            if !ok
                return false
        this.Value = value
    [val, ok] = it@?"placeholder"
    if ok
        var placeholder of string
        if =?val
            [placeholder, ok] = ((val)·(string))
            if !ok
                return false
        this.Placeholder = placeholder
    [val, ok] = it@?"password"
    if ok
        var password of bool
        if =?val
            [password, ok] = ((val)·(bool))
            if !ok
                return false
        this.Password = password
    [val, ok] = it@?"buttons"
    if ok
        var buttons of ?[QuickInputButton]
        if =?val
            var __coll__buttons of [any]
            [__coll__buttons, ok] = ((val)·([any]))
            if !ok
                return false
            buttons = [QuickInputButton]·new(__coll__buttons·len)
            var __idx__buttons of int
            __idx__buttons = 0
            for __item__buttons in __coll__buttons
                var __val__buttons of QuickInputButton
                __val__buttons = QuickInputButton·new
                ok = __val__buttons.populateFrom(__item__buttons)
                if !ok
                    return false
                buttons@__idx__buttons = __val__buttons
                __idx__buttons = __idx__buttons + 1
        this.Buttons = buttons
    [val, ok] = it@?"prompt"
    if ok
        var prompt of string
        if =?val
            [prompt, ok] = ((val)·(string))
            if !ok
                return false
        this.Prompt = prompt
    [val, ok] = it@?"validationMessage"
    if ok
        var validationMessage of string
        if =?val
            [validationMessage, ok] = ((val)·(string))
            if !ok
                return false
        this.ValidationMessage = validationMessage
    [val, ok] = it@?"title"
    if ok
        var title of string
        if =?val
            [title, ok] = ((val)·(string))
            if !ok
                return false
        this.Title = title
    [val, ok] = it@?"step"
    if ok
        var step of ?int
        if =?val
            var _step_ of int
            [_step_, ok] = ((val)·(int))
            if !ok
                return false
            step = &_step_
        this.Step = step
    [val, ok] = it@?"totalSteps"
    if ok
        var totalSteps of ?int
        if =?val
            var _totalSteps_ of int
            [_totalSteps_, ok] = ((val)·(int))
            if !ok
                return false
            totalSteps = &_totalSteps_
        this.TotalSteps = totalSteps
    [val, ok] = it@?"enabled"
    if ok
        var enabled of bool
        if =?val
            [enabled, ok] = ((val)·(bool))
            if !ok
                return false
        this.Enabled = enabled
    [val, ok] = it@?"busy"
    if ok
        var busy of bool
        if =?val
            [busy, ok] = ((val)·(bool))
            if !ok
                return false
        this.Busy = busy
    [val, ok] = it@?"ignoreFocusOut"
    if ok
        var ignoreFocusOut of bool
        if =?val
            [ignoreFocusOut, ok] = ((val)·(bool))
            if !ok
                return false
        this.IgnoreFocusOut = ignoreFocusOut
    return true




QuickInputButton·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"iconPath"
    if ok
        var iconPath of string
        if =?val
            [iconPath, ok] = ((val)·(string))
            if !ok
                return false
        this.IconPath = iconPath
    else
        return false
    [val, ok] = it@?"tooltip"
    if ok
        var tooltip of ?string
        if =?val
            var _tooltip_ of string
            [_tooltip_, ok] = ((val)·(string))
            if !ok
                return false
            tooltip = &_tooltip_
        this.Tooltip = tooltip
    [val, ok] = it@?"my"
    if ok
        var my of ?dict
        if =?val
            [my, ok] = ((val)·(?dict))
            if !ok
                return false
        this.My = my
    return true




QuickPickState·populateFrom: (payload:any -> bool)
    var it of dict
    var ok of bool
    var val of any
    [it, ok] = ((payload)·(dict))
    if !ok
        return false
    [val, ok] = it@?"value"
    if ok
        var value of string
        if =?val
            [value, ok] = ((val)·(string))
            if !ok
                return false
        this.Value = value
    [val, ok] = it@?"placeholder"
    if ok
        var placeholder of string
        if =?val
            [placeholder, ok] = ((val)·(string))
            if !ok
                return false
        this.Placeholder = placeholder
    [val, ok] = it@?"buttons"
    if ok
        var buttons of ?[QuickInputButton]
        if =?val
            var __coll__buttons of [any]
            [__coll__buttons, ok] = ((val)·([any]))
            if !ok
                return false
            buttons = [QuickInputButton]·new(__coll__buttons·len)
            var __idx__buttons of int
            __idx__buttons = 0
            for __item__buttons in __coll__buttons
                var __val__buttons of QuickInputButton
                __val__buttons = QuickInputButton·new
                ok = __val__buttons.populateFrom(__item__buttons)
                if !ok
                    return false
                buttons@__idx__buttons = __val__buttons
                __idx__buttons = __idx__buttons + 1
        this.Buttons = buttons
    [val, ok] = it@?"items"
    if ok
        var items of ?[QuickPickItem]
        if =?val
            var __coll__items of [any]
            [__coll__items, ok] = ((val)·([any]))
            if !ok
                return false
            items = [QuickPickItem]·new(__coll__items·len)
            var __idx__items of int
            __idx__items = 0
            for __item__items in __coll__items
                var __val__items of QuickPickItem
                __val__items = QuickPickItem·new
                ok = __val__items.populateFrom(__item__items)
                if !ok
                    return false
                items@__idx__items = __val__items
                __idx__items = __idx__items + 1
        this.Items = items
    [val, ok] = it@?"canSelectMany"
    if ok
        var canSelectMany of bool
        if =?val
            [canSelectMany, ok] = ((val)·(bool))
            if !ok
                return false
        this.CanSelectMany = canSelectMany
    [val, ok] = it@?"matchOnDescription"
    if ok
        var matchOnDescription of bool
        if =?val
            [matchOnDescription, ok] = ((val)·(bool))
            if !ok
                return false
        this.MatchOnDescription = matchOnDescription
    [val, ok] = it@?"matchOnDetail"
    if ok
        var matchOnDetail of bool
        if =?val
            [matchOnDetail, ok] = ((val)·(bool))
            if !ok
                return false
        this.MatchOnDetail = matchOnDetail
    [val, ok] = it@?"activeItems"
    if ok
        var activeItems of ?[QuickPickItem]
        if =?val
            var __coll__activeItems of [any]
            [__coll__activeItems, ok] = ((val)·([any]))
            if !ok
                return false
            activeItems = [QuickPickItem]·new(__coll__activeItems·len)
            var __idx__activeItems of int
            __idx__activeItems = 0
            for __item__activeItems in __coll__activeItems
                var __val__activeItems of QuickPickItem
                __val__activeItems = QuickPickItem·new
                ok = __val__activeItems.populateFrom(__item__activeItems)
                if !ok
                    return false
                activeItems@__idx__activeItems = __val__activeItems
                __idx__activeItems = __idx__activeItems + 1
        this.ActiveItems = activeItems
    [val, ok] = it@?"selectedItems"
    if ok
        var selectedItems of ?[QuickPickItem]
        if =?val
            var __coll__selectedItems of [any]
            [__coll__selectedItems, ok] = ((val)·([any]))
            if !ok
                return false
            selectedItems = [QuickPickItem]·new(__coll__selectedItems·len)
            var __idx__selectedItems of int
            __idx__selectedItems = 0
            for __item__selectedItems in __coll__selectedItems
                var __val__selectedItems of QuickPickItem
                __val__selectedItems = QuickPickItem·new
                ok = __val__selectedItems.populateFrom(__item__selectedItems)
                if !ok
                    return false
                selectedItems@__idx__selectedItems = __val__selectedItems
                __idx__selectedItems = __idx__selectedItems + 1
        this.SelectedItems = selectedItems
    [val, ok] = it@?"title"
    if ok
        var title of string
        if =?val
            [title, ok] = ((val)·(string))
            if !ok
                return false
        this.Title = title
    [val, ok] = it@?"step"
    if ok
        var step of ?int
        if =?val
            var _step_ of int
            [_step_, ok] = ((val)·(int))
            if !ok
                return false
            step = &_step_
        this.Step = step
    [val, ok] = it@?"totalSteps"
    if ok
        var totalSteps of ?int
        if =?val
            var _totalSteps_ of int
            [_totalSteps_, ok] = ((val)·(int))
            if !ok
                return false
            totalSteps = &_totalSteps_
        this.TotalSteps = totalSteps
    [val, ok] = it@?"enabled"
    if ok
        var enabled of bool
        if =?val
            [enabled, ok] = ((val)·(bool))
            if !ok
                return false
        this.Enabled = enabled
    [val, ok] = it@?"busy"
    if ok
        var busy of bool
        if =?val
            [busy, ok] = ((val)·(bool))
            if !ok
                return false
        this.Busy = busy
    [val, ok] = it@?"ignoreFocusOut"
    if ok
        var ignoreFocusOut of bool
        if =?val
            [ignoreFocusOut, ok] = ((val)·(bool))
            if !ok
                return false
        this.IgnoreFocusOut = ignoreFocusOut
    return true


# override `emitOutro` for this trailing part..
