import * as core from './core';
declare type Cancel = core.Cancel;
declare type Disposable = core.Disposable;
interface fromJson {
    populateFrom: (_: any) => boolean;
}
interface withDisp {
    disp: Disposable;
}
/**
 * Represents the alignment of status bar items.

 */
export declare enum StatusBarAlignment {
    /**
     * Aligned to the left side.

     */
    Left = 1,
    /**
     * Aligned to the right side.

     */
    Right = 2
}
/**
 * Type Definition for Visual Studio Code 1.38 Extension API
 * See https://code.visualstudio.com/api for more information

 */
export interface Vscode {
    /**
     * Namespace for dealing with the current window of the editor. That is visible
     * and active editors, as well as, UI elements to show messages, selections, and
     * asking for user input.

     */
    Window: Window;
    /**
     * Namespace describing the environment the editor runs in.

     */
    Env: Env;
    /**
     * Namespace for dealing with the current workspace. A workspace is the representation
     * of the folder that has been opened. There is no workspace when just a file but not a
     * folder has been opened.
     *
     * The workspace offers support for [listening](#workspace.createFileSystemWatcher) to fs
     * events and for [finding](#workspace.findFiles) files. Both perform well and run _outside_
     * the editor-process so that they should be always used instead of nodejs-equivalents.

     */
    Workspace: Workspace;
    /**
     * Namespace for participating in language-specific editor [features](https://code.visualstudio.com/docs/editor/editingevolved),
     * like IntelliSense, code actions, diagnostics etc.
     *
     * Many programming languages exist and there is huge variety in syntaxes, semantics, and paradigms. Despite that, features
     * like automatic word-completion, code navigation, or code checking have become popular across different tools for different
     * programming languages.
     *
     * The editor provides an API that makes it simple to provide such common features by having all UI and actions already in place and
     * by allowing you to participate by providing data only. For instance, to contribute a hover all you have to do is provide a function
     * that can be called with a [TextDocument](#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
     * mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
     *
     * ```javascript
     * languages.registerHoverProvider('javascript', {
     *  	provideHover(document, position, token) {
     *  		return new Hover('I am a hover!');
     *  	}
     * });
     * ```
     *
     * Registration is done using a [document selector](#DocumentSelector) which is either a language id, like `javascript` or
     * a more complex [filter](#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
     * a selector will result in a [score](#languages.match) that is used to determine if and how a provider shall be used. When
     * scores are equal the provider that came last wins. For features that allow full arity, like [hover](#languages.registerHoverProvider),
     * the score is only checked to be `>0`, for other features, like [IntelliSense](#languages.registerCompletionItemProvider) the
     * score is used for determining the order in which providers are asked to participate.

     */
    Languages: Languages;
    /**
     * Namespace for dealing with installed extensions. Extensions are represented
     * by an [extension](#Extension)-interface which enables reflection on them.
     *
     * Extension writers can provide APIs to other extensions by returning their API public
     * surface from the `activate`-call.
     *
     * ```javascript
     * export function activate(context: vscode.ExtensionContext) {
     *  	let api = {
     *  		sum(a, b) {
     *  			return a + b;
     *  		},
     *  		mul(a, b) {
     *  			return a * b;
     *  		}
     *  	};
     *  	// 'export' public api-surface
     *  	return api;
     * }
     * ```
     * When depending on the API of another extension add an `extensionDependency`-entry
     * to `package.json`, and use the [getExtension](#extensions.getExtension)-function
     * and the [exports](#Extension.exports)-property, like below:
     *
     * ```javascript
     * let mathExt = extensions.getExtension('genius.math');
     * let importedApi = mathExt.exports;
     *
     * console.log(importedApi.mul(42, 1));
     * ```

     */
    Extensions: Extensions;
    /**
     * Namespace for dealing with commands. In short, a command is a function with a
     * unique identifier. The function is sometimes also called _command handler_.
     *
     * Commands can be added to the editor using the [registerCommand](#commands.registerCommand)
     * and [registerTextEditorCommand](#commands.registerTextEditorCommand) functions. Commands
     * can be executed [manually](#commands.executeCommand) or from a UI gesture. Those are:
     *
     * * palette - Use the `commands`-section in `package.json` to make a command show in
     * the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
     * * keybinding - Use the `keybindings`-section in `package.json` to enable
     * [keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
     * for your extension.
     *
     * Commands from other extensions and from the editor itself are accessible to an extension. However,
     * when invoking an editor command not all argument types are supported.
     *
     * This is a sample that registers a command handler and adds an entry for that command to the palette. First
     * register a command handler with the identifier `extension.sayHello`.
     * ```javascript
     * commands.registerCommand('extension.sayHello', () => {
     *  	window.showInformationMessage('Hello World!');
     * });
     * ```
     * Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
     * ```json
     * {
     *  	"contributes": {
     *  		"commands": [{
     *  			"command": "extension.sayHello",
     *  			"title": "Hello World"
     *  		}]
     *  	}
     * }
     * ```

     */
    Commands: Commands;
}
/**
 * Namespace for dealing with the current window of the editor. That is visible
 * and active editors, as well as, UI elements to show messages, selections, and
 * asking for user input.

 */
export interface Window {
    /**
     * Show an information message to users. Optionally provide an array of items which will be presented as
     * clickable buttons.

     * @param message The message to show.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowInformationMessage1: (message: string, items: string[]) => (_: (_: string) => void) => void;
    /**
     * Show an information message to users. Optionally provide an array of items which will be presented as
     * clickable buttons.

     * @param message The message to show.
     * @param options Configures the behaviour of the message.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowInformationMessage2: (message: string, options: MessageOptions, items: string[]) => (_: (_: string) => void) => void;
    /**
     * Show an information message.

     * @param message The message to show.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowInformationMessage3: (message: string, items: MessageItem[]) => (_: (_: MessageItem) => void) => void;
    /**
     * Show an information message.

     * @param message The message to show.
     * @param options Configures the behaviour of the message.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowInformationMessage4: (message: string, options: MessageOptions, items: MessageItem[]) => (_: (_: MessageItem) => void) => void;
    /**
     * Show a warning message.

     * @param message The message to show.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowWarningMessage1: (message: string, items: string[]) => (_: (_: string) => void) => void;
    /**
     * Show a warning message.

     * @param message The message to show.
     * @param options Configures the behaviour of the message.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowWarningMessage2: (message: string, options: MessageOptions, items: string[]) => (_: (_: string) => void) => void;
    /**
     * Show a warning message.

     * @param message The message to show.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowWarningMessage3: (message: string, items: MessageItem[]) => (_: (_: MessageItem) => void) => void;
    /**
     * Show a warning message.

     * @param message The message to show.
     * @param options Configures the behaviour of the message.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowWarningMessage4: (message: string, options: MessageOptions, items: MessageItem[]) => (_: (_: MessageItem) => void) => void;
    /**
     * Show an error message.

     * @param message The message to show.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowErrorMessage1: (message: string, items: string[]) => (_: (_: string) => void) => void;
    /**
     * Show an error message.

     * @param message The message to show.
     * @param options Configures the behaviour of the message.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowErrorMessage2: (message: string, options: MessageOptions, items: string[]) => (_: (_: string) => void) => void;
    /**
     * Show an error message.

     * @param message The message to show.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowErrorMessage3: (message: string, items: MessageItem[]) => (_: (_: MessageItem) => void) => void;
    /**
     * Show an error message.

     * @param message The message to show.
     * @param options Configures the behaviour of the message.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowErrorMessage4: (message: string, options: MessageOptions, items: MessageItem[]) => (_: (_: MessageItem) => void) => void;
    /**
     * Opens an input box to ask the user for input.
     *
     * The returned value will be `undefined` if the input box was canceled (e.g. pressing ESC). Otherwise the
     * returned value will be the string typed by the user or an empty string if the user did not type
     * anything but dismissed the input box with OK.

     * @param options Configures the behavior of the input box.
     * @param token A token that can be used to signal cancellation.
     * @return A promise that resolves to a string the user provided or to `undefined` in case of dismissal.
     */
    ShowInputBox: (options?: InputBoxOptions, token?: Cancel) => (_: (_: string) => void) => void;
    /**
     * Shows a selection list allowing multiple selections.

     * @param items An array of strings, or a promise that resolves to an array of strings.
     * @param options Configures the behavior of the selection list.
     * @param token A token that can be used to signal cancellation.
     * @return A promise that resolves to the selected items or `undefined`.
     */
    ShowQuickPick1: (items: string[], options: QuickPickOptions, token?: Cancel) => (_: (_: string[]) => void) => void;
    /**
     * Shows a selection list.

     * @param items An array of strings, or a promise that resolves to an array of strings.
     * @param options Configures the behavior of the selection list.
     * @param token A token that can be used to signal cancellation.
     * @return A promise that resolves to the selection or `undefined`.
     */
    ShowQuickPick2: (items: string[], options?: QuickPickOptions, token?: Cancel) => (_: (_: string) => void) => void;
    /**
     * Shows a selection list allowing multiple selections.

     * @param items An array of items, or a promise that resolves to an array of items.
     * @param options Configures the behavior of the selection list.
     * @param token A token that can be used to signal cancellation.
     * @return A promise that resolves to the selected items or `undefined`.
     */
    ShowQuickPick3: (items: QuickPickItem[], options: QuickPickOptions, token?: Cancel) => (_: (_: QuickPickItem[]) => void) => void;
    /**
     * Shows a selection list.

     * @param items An array of items, or a promise that resolves to an array of items.
     * @param options Configures the behavior of the selection list.
     * @param token A token that can be used to signal cancellation.
     * @return A promise that resolves to the selected item or `undefined`.
     */
    ShowQuickPick4: (items: QuickPickItem[], options?: QuickPickOptions, token?: Cancel) => (_: (_: QuickPickItem) => void) => void;
    /**
     * Set a message to the status bar. This is a short hand for the more powerful
     * status bar [items](#window.createStatusBarItem).

     * @param text The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text).
     * @param hideAfterTimeout Timeout in milliseconds after which the message will be disposed.
     * @return A disposable which hides the status bar message.
     */
    SetStatusBarMessage1: (text: string, hideAfterTimeout: number) => (_: (_: Disposable) => void) => void;
    /**
     * Set a message to the status bar. This is a short hand for the more powerful
     * status bar [items](#window.createStatusBarItem).
     *
     * *Note* that status bar messages stack and that they must be disposed when no
     * longer used.

     * @param text The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text).
     * @return A disposable which hides the status bar message.
     */
    SetStatusBarMessage2: (text: string) => (_: (_: Disposable) => void) => void;
    /**
     * Shows a file save dialog to the user which allows to select a file
     * for saving-purposes.

     * @param options Options that control the dialog.
     * @return A promise that resolves to the selected resource or `undefined`.
     */
    ShowSaveDialog: (options: SaveDialogOptions) => (_: (_: string) => void) => void;
    /**
     * Shows a file open dialog to the user which allows to select a file
     * for opening-purposes.

     * @param options Options that control the dialog.
     * @return A promise that resolves to the selected resources or `undefined`.
     */
    ShowOpenDialog: (options: OpenDialogOptions) => (_: (_: string[]) => void) => void;
    /**
     * Shows a selection list of [workspace folders](#workspace.workspaceFolders) to pick from.
     * Returns `undefined` if no folder is open.

     * @param options Configures the behavior of the workspace folder list.
     * @return A promise that resolves to the workspace folder or `undefined`.
     */
    ShowWorkspaceFolderPick: (options?: WorkspaceFolderPickOptions) => (_: (_: WorkspaceFolder) => void) => void;
    /**
     * Represents the current window's state.

     */
    State: (_: (_: WindowState) => void) => void;
    /**
     * An [event](#Event) which fires when the focus state of the current window
     * changes. The value of the event represents whether the window is focused.

     */
    OnDidChangeWindowState: (listener: (_: WindowState) => void) => (_: (_: Disposable) => void) => void;
    /**
     * Creates a status bar [item](#StatusBarItem).

     * @param alignment The alignment of the item.
     * @param priority The priority of the item. Higher values mean the item should be shown more to the left.
     * @return A new status bar item.
     */
    CreateStatusBarItem: (alignment?: StatusBarAlignment, priority?: number) => (_: (_: StatusBarItem) => void) => void;
    /**
     * Creates a new [output channel](#OutputChannel) with the given name.

     * @param name Human-readable string which will be used to represent the channel in the UI.
     */
    CreateOutputChannel: (name: string) => (_: (_: OutputChannel) => void) => void;
}
/**
 * Namespace describing the environment the editor runs in.

 */
export interface Env {
    /**
     * Opens an *external* item, e.g. a http(s) or mailto-link, using the
     * default application.
     *
     * *Note* that [`showTextDocument`](#window.showTextDocument) is the right
     * way to open a text document inside the editor, not this function.

     * @param target The uri that should be opened.
     * @return A promise indicating if open was successful.
     */
    OpenExternal: (target: string) => (_: (_: boolean) => void) => void;
    /**
     * The application name of the editor, like 'VS Code'.

     */
    AppName: (_: (_: string) => void) => void;
    /**
     * The application root folder from which the editor is running.

     */
    AppRoot: (_: (_: string) => void) => void;
    /**
     * Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.

     */
    Language: (_: (_: string) => void) => void;
    /**
     * A unique identifier for the computer.

     */
    MachineId: (_: (_: string) => void) => void;
    /**
     * The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
     * Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
     *
     * *Note* that the value is `undefined` when there is no remote extension host but that the
     * value is defined in all extension hosts (local and remote) in case a remote extension host
     * exists. Use [`Extension#extensionKind`](#Extension.extensionKind) to know if
     * a specific extension runs remote or not.

     */
    RemoteName: (_: (_: string) => void) => void;
    /**
     * A unique identifier for the current session.
     * Changes each time the editor is started.

     */
    SessionId: (_: (_: string) => void) => void;
    /**
     * The detected default shell for the extension host, this is overridden by the
     * `terminal.integrated.shell` setting for the extension host's platform.

     */
    Shell: (_: (_: string) => void) => void;
    /**
     * The custom uri scheme the editor registers to in the operating system.

     */
    UriScheme: (_: (_: string) => void) => void;
    /**
     * Provides single-call access to numerous individual `Env` properties at once.

     */
    Properties: (_: (_: EnvProperties) => void) => void;
}
/**
 * Namespace for dealing with the current workspace. A workspace is the representation
 * of the folder that has been opened. There is no workspace when just a file but not a
 * folder has been opened.
 *
 * The workspace offers support for [listening](#workspace.createFileSystemWatcher) to fs
 * events and for [finding](#workspace.findFiles) files. Both perform well and run _outside_
 * the editor-process so that they should be always used instead of nodejs-equivalents.

 */
export interface Workspace {
    /**
     * The name of the workspace. `undefined` when no folder
     * has been opened.

     */
    Name: (_: (_: string) => void) => void;
    /**
     * The location of the workspace file, for example:
     *
     * `file:///Users/name/Development/myProject.code-workspace`
     *
     * or
     *
     * `untitled:1555503116870`
     *
     * for a workspace that is untitled and not yet saved.
     *
     * Depending on the workspace that is opened, the value will be:
     *   * `undefined` when no workspace or  a single folder is opened
     *   * the path of the workspace file as `Uri` otherwise. if the workspace
     * is untitled, the returned URI will use the `untitled:` scheme
     *
     * The location can e.g. be used with the `vscode.openFolder` command to
     * open the workspace again after it has been closed.
     *
     * **Example:**
     * ```typescript
     * vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
     * ```
     *
     * **Note:** it is not advised to use `workspace.workspaceFile` to write
     * configuration data into the file. You can use `workspace.getConfiguration().update()`
     * for that purpose which will work both when a single folder is opened as
     * well as an untitled or saved workspace.

     */
    WorkspaceFile: (_: (_: string) => void) => void;
    /**
     * Save all dirty files.

     * @param includeUntitled Also save files that have been created during this session.
     * @return A thenable that resolves when the files have been saved.
     */
    SaveAll: (includeUntitled: boolean) => (_: (_: boolean) => void) => void;
    /**
     * An event that is emitted when a workspace folder is added or removed.

     */
    OnDidChangeWorkspaceFolders: (listener: (_: WorkspaceFoldersChangeEvent) => void) => (_: (_: Disposable) => void) => void;
    /**
     * Returns the [workspace folder](#WorkspaceFolder) that contains a given uri.
     * * returns `undefined` when the given uri doesn't match any workspace folder
     * * returns the *input* when the given uri is a workspace folder itself

     * @param uri An uri.
     * @return A workspace folder or `undefined`
     */
    GetWorkspaceFolder: (uri: string) => (_: (_: WorkspaceFolder) => void) => void;
    /**
     * List of workspace folders or `undefined` when no folder is open.
     * *Note* that the first entry corresponds to the value of `rootPath`.

     */
    WorkspaceFolders: (_: (_: WorkspaceFolder[]) => void) => void;
    /**
     * Find files across all [workspace folders](#workspace.workspaceFolders) in the workspace.
     * `findFiles('**​/*.js', '**​/node_modules/**', 10)`

     * @param include A [glob pattern](#GlobPattern) that defines the files to search for. The glob pattern will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](#RelativePattern) to restrict the search results to a [workspace folder](#WorkspaceFolder).
     * @param exclude A [glob pattern](#GlobPattern) that defines files and folders to exclude. The glob pattern will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will apply, when `null` no excludes will apply.
     * @param maxResults An upper-bound for the result.
     * @param token A token that can be used to signal cancellation to the underlying search engine.
     * @return A thenable that resolves to an array of resource identifiers. Will return no results if no [workspace folders](#workspace.workspaceFolders) are opened.
     */
    FindFiles: (include: string, exclude?: string, maxResults?: number, token?: Cancel) => (_: (_: string[]) => void) => void;
    /**
     * Returns a path that is relative to the workspace folder or folders.
     *
     * When there are no [workspace folders](#workspace.workspaceFolders) or when the path
     * is not contained in them, the input is returned.

     * @param pathOrUri A path or uri. When a uri is given its [fsPath](#Uri.fsPath) is used.
     * @param includeWorkspaceFolder When `true` and when the given path is contained inside a workspace folder the name of the workspace is prepended. Defaults to `true` when there are multiple workspace folders and `false` otherwise.
     * @return A path relative to the root or the input.
     */
    AsRelativePath: (pathOrUri: string, includeWorkspaceFolder: boolean) => (_: (_: string) => void) => void;
    /**
     * Provides single-call access to numerous individual `Workspace` properties at once.

     */
    Properties: (_: (_: WorkspaceProperties) => void) => void;
}
/**
 * Namespace for participating in language-specific editor [features](https://code.visualstudio.com/docs/editor/editingevolved),
 * like IntelliSense, code actions, diagnostics etc.
 *
 * Many programming languages exist and there is huge variety in syntaxes, semantics, and paradigms. Despite that, features
 * like automatic word-completion, code navigation, or code checking have become popular across different tools for different
 * programming languages.
 *
 * The editor provides an API that makes it simple to provide such common features by having all UI and actions already in place and
 * by allowing you to participate by providing data only. For instance, to contribute a hover all you have to do is provide a function
 * that can be called with a [TextDocument](#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
 * mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
 *
 * ```javascript
 * languages.registerHoverProvider('javascript', {
 *  	provideHover(document, position, token) {
 *  		return new Hover('I am a hover!');
 *  	}
 * });
 * ```
 *
 * Registration is done using a [document selector](#DocumentSelector) which is either a language id, like `javascript` or
 * a more complex [filter](#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
 * a selector will result in a [score](#languages.match) that is used to determine if and how a provider shall be used. When
 * scores are equal the provider that came last wins. For features that allow full arity, like [hover](#languages.registerHoverProvider),
 * the score is only checked to be `>0`, for other features, like [IntelliSense](#languages.registerCompletionItemProvider) the
 * score is used for determining the order in which providers are asked to participate.

 */
export interface Languages {
    /**
     * Return the identifiers of all known languages.

     * @return Promise resolving to an array of identifier strings.
     */
    GetLanguages: (_: (_: string[]) => void) => void;
    /**
     * An [event](#Event) which fires when the global set of diagnostics changes. This is
     * newly added and removed diagnostics.

     */
    OnDidChangeDiagnostics: (listener: (_: DiagnosticChangeEvent) => void) => (_: (_: Disposable) => void) => void;
}
/**
 * Namespace for dealing with installed extensions. Extensions are represented
 * by an [extension](#Extension)-interface which enables reflection on them.
 *
 * Extension writers can provide APIs to other extensions by returning their API public
 * surface from the `activate`-call.
 *
 * ```javascript
 * export function activate(context: vscode.ExtensionContext) {
 *  	let api = {
 *  		sum(a, b) {
 *  			return a + b;
 *  		},
 *  		mul(a, b) {
 *  			return a * b;
 *  		}
 *  	};
 *  	// 'export' public api-surface
 *  	return api;
 * }
 * ```
 * When depending on the API of another extension add an `extensionDependency`-entry
 * to `package.json`, and use the [getExtension](#extensions.getExtension)-function
 * and the [exports](#Extension.exports)-property, like below:
 *
 * ```javascript
 * let mathExt = extensions.getExtension('genius.math');
 * let importedApi = mathExt.exports;
 *
 * console.log(importedApi.mul(42, 1));
 * ```

 */
export interface Extensions {
    /**
     * An event which fires when `extensions.all` changes. This can happen when extensions are
     * installed, uninstalled, enabled or disabled.

     */
    OnDidChange: (listener: () => void) => (_: (_: Disposable) => void) => void;
}
/**
 * Namespace for dealing with commands. In short, a command is a function with a
 * unique identifier. The function is sometimes also called _command handler_.
 *
 * Commands can be added to the editor using the [registerCommand](#commands.registerCommand)
 * and [registerTextEditorCommand](#commands.registerTextEditorCommand) functions. Commands
 * can be executed [manually](#commands.executeCommand) or from a UI gesture. Those are:
 *
 * * palette - Use the `commands`-section in `package.json` to make a command show in
 * the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
 * * keybinding - Use the `keybindings`-section in `package.json` to enable
 * [keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
 * for your extension.
 *
 * Commands from other extensions and from the editor itself are accessible to an extension. However,
 * when invoking an editor command not all argument types are supported.
 *
 * This is a sample that registers a command handler and adds an entry for that command to the palette. First
 * register a command handler with the identifier `extension.sayHello`.
 * ```javascript
 * commands.registerCommand('extension.sayHello', () => {
 *  	window.showInformationMessage('Hello World!');
 * });
 * ```
 * Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
 * ```json
 * {
 *  	"contributes": {
 *  		"commands": [{
 *  			"command": "extension.sayHello",
 *  			"title": "Hello World"
 *  		}]
 *  	}
 * }
 * ```

 */
export interface Commands {
    /**
     * Registers a command that can be invoked via a keyboard shortcut,
     * a menu item, an action, or directly.
     *
     * Registering a command with an existing command identifier twice
     * will cause an error.

     * @param command A unique identifier for the command.
     * @param callback A command handler function.
     * @return Disposable which unregisters this command on disposal.
     */
    RegisterCommand: (command: string, callback: (_: any[]) => any) => (_: (_: Disposable) => void) => void;
    /**
     * Executes the command denoted by the given command identifier.
     *
     * * *Note 1:* When executing an editor command not all types are allowed to
     * be passed as arguments. Allowed are the primitive types `string`, `boolean`,
     * `number`, `undefined`, and `null`, as well as [`Position`](#Position), [`Range`](#Range), [`Uri`](#Uri) and [`Location`](#Location).
     * * *Note 2:* There are no restrictions when executing commands that have been contributed
     * by extensions.

     * @param command Identifier of the command to execute.
     * @param rest Parameters passed to the command function.
     * @return A thenable that resolves to the returned value of the given command. `undefined` when the command handler function doesn't return anything.
     */
    ExecuteCommand: (command: string, rest: any[]) => (_: (_: any) => void) => void;
    /**
     * Retrieve the list of all available commands. Commands starting an underscore are
     * treated as internal commands.

     * @param filterInternal Set `true` to not see internal commands (starting with an underscore)
     * @return Thenable that resolves to a list of command ids.
     */
    GetCommands: (filterInternal: boolean) => (_: (_: string[]) => void) => void;
}
/**
 * Options to configure the behavior of the message.

 */
export interface MessageOptions {
    /**
     * Indicates that this message should be modal.

     */
    modal?: boolean;
}
/**
 * Represents an action that is shown with an information, warning, or
 * error message.

 */
export interface MessageItem extends fromJson {
    /**
     * A short title like 'Retry', 'Open Log' etc.

     */
    title: string;
    /**
     * A hint for modal dialogs that the item should be triggered
     * when the user cancels the dialog (e.g. by pressing the ESC
     * key).
     *
     * Note: this option is ignored for non-modal messages.

     */
    isCloseAffordance?: boolean;
    /**
     * Free-form custom data, preserved across a roundtrip.

     */
    my?: {
        [_: string]: any;
    };
}
export declare function newMessageItem(): MessageItem;
/**
 * Options to configure the behavior of the input box UI.

 */
export interface InputBoxOptions {
    /**
     * The value to prefill in the input box.

     */
    value?: string;
    /**
     * Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
     * first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
     * word will be selected, when empty (start equals end) only the cursor will be set,
     * otherwise the defined range will be selected.

     */
    valueSelection?: [number, number];
    /**
     * The text to display underneath the input box.

     */
    prompt?: string;
    /**
     * An optional string to show as place holder in the input box to guide the user what to type.

     */
    placeHolder?: string;
    /**
     * Set to `true` to show a password prompt that will not show the typed value.

     */
    password?: boolean;
    /**
     * Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.

     */
    ignoreFocusOut?: boolean;
    /**
     * An optional function that will be called to validate input and to give a hint
     * to the user.
     *
     * `value` ── The current value of the input box.
     *
     * `return` ── A human readable string which is presented as diagnostic message.
     * Return `undefined`, `null`, or the empty string when 'value' is valid.

     */
    validateInput?: (_: string) => string;
    /**
     * For internal runtime use only.

     */
    validateInput_AppzFuncId: string;
}
/**
 * Options to configure the behavior of the quick pick UI.

 */
export interface QuickPickOptions {
    /**
     * An optional flag to include the description when filtering the picks.

     */
    matchOnDescription?: boolean;
    /**
     * An optional flag to include the detail when filtering the picks.

     */
    matchOnDetail?: boolean;
    /**
     * An optional string to show as place holder in the input box to guide the user what to pick on.

     */
    placeHolder?: string;
    /**
     * Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.

     */
    ignoreFocusOut?: boolean;
    /**
     * An optional flag to make the picker accept multiple selections, if true the result is an array of picks.

     */
    canPickMany?: boolean;
    /**
     * An optional function that is invoked whenever an item is selected.

     */
    onDidSelectItem?: (_: QuickPickItem) => any;
    /**
     * For internal runtime use only.

     */
    onDidSelectItem_AppzFuncId: string;
}
/**
 * Represents an item that can be selected from
 * a list of items.

 */
export interface QuickPickItem extends fromJson {
    /**
     * A human readable string which is rendered prominent.

     */
    label: string;
    /**
     * A human readable string which is rendered less prominent.

     */
    description?: string;
    /**
     * A human readable string which is rendered less prominent.

     */
    detail?: string;
    /**
     * Optional flag indicating if this item is picked initially.
     * (Only honored when the picker allows multiple selections.)

     */
    picked?: boolean;
    /**
     * Always show this item.

     */
    alwaysShow?: boolean;
    /**
     * Free-form custom data, preserved across a roundtrip.

     */
    my?: {
        [_: string]: any;
    };
}
export declare function newQuickPickItem(): QuickPickItem;
/**
 * Options to configure the behaviour of a file save dialog.

 */
export interface SaveDialogOptions {
    /**
     * The resource the dialog shows when opened.

     */
    defaultUri?: string;
    /**
     * A human-readable string for the save button.

     */
    saveLabel?: string;
    /**
     * A set of file filters that are used by the dialog. Each entry is a human readable label,
     * like "TypeScript", and an array of extensions, e.g.
     * ```ts
     * {
     *  	'Images': ['png', 'jpg']
     *  	'TypeScript': ['ts', 'tsx']
     * }
     * ```

     */
    filters?: {
        [_: string]: string[];
    };
}
/**
 * Options to configure the behaviour of a file open dialog.
 *
 * * Note 1: A dialog can select files, folders, or both. This is not true for Windows
 * which enforces to open either files or folder, but *not both*.
 * * Note 2: Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
 * and the editor then silently adjusts the options to select files.

 */
export interface OpenDialogOptions {
    /**
     * The resource the dialog shows when opened.

     */
    defaultUri?: string;
    /**
     * A human-readable string for the open button.

     */
    openLabel?: string;
    /**
     * Allow to select files, defaults to `true`.

     */
    canSelectFiles?: boolean;
    /**
     * Allow to select folders, defaults to `false`.

     */
    canSelectFolders?: boolean;
    /**
     * Allow to select many files or folders.

     */
    canSelectMany?: boolean;
    /**
     * A set of file filters that are used by the dialog. Each entry is a human readable label,
     * like "TypeScript", and an array of extensions, e.g.
     * ```ts
     * {
     *  	'Images': ['png', 'jpg']
     *  	'TypeScript': ['ts', 'tsx']
     * }
     * ```

     */
    filters?: {
        [_: string]: string[];
    };
}
/**
 * Options to configure the behaviour of the [workspace folder](#WorkspaceFolder) pick UI.

 */
export interface WorkspaceFolderPickOptions {
    /**
     * An optional string to show as place holder in the input box to guide the user what to pick on.

     */
    placeHolder?: string;
    /**
     * Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.

     */
    ignoreFocusOut?: boolean;
}
/**
 * A workspace folder is one of potentially many roots opened by the editor. All workspace folders
 * are equal which means there is no notion of an active or master workspace folder.

 */
export interface WorkspaceFolder extends fromJson {
    /**
     * The associated uri for this workspace folder.
     *
     * *Note:* The [Uri](#Uri)-type was intentionally chosen such that future releases of the editor can support
     * workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.

     */
    uri: string;
    /**
     * The name of this workspace folder. Defaults to
     * the basename of its [uri-path](#Uri.path)

     */
    name: string;
    /**
     * The ordinal number of this workspace folder.

     */
    index: number;
}
/**
 * Represents the state of a window.

 */
export interface WindowState extends fromJson {
    /**
     * Whether the current window is focused.

     */
    focused: boolean;
}
/**
 * A status bar item is a status bar contribution that can
 * show text and icons and run a command on click.

 */
export interface StatusBarItem extends fromJson, withDisp {
    /**
     * Shows the entry in the status bar.

     */
    Show: () => (_: () => void) => void;
    /**
     * Hide the entry in the status bar.

     */
    Hide: () => (_: () => void) => void;
    /**
     * Dispose and free associated resources. Call
     * [hide](#StatusBarItem.hide).

     */
    Dispose: () => (_: () => void) => void;
}
/**
 * An output channel is a container for readonly textual information.
 *
 * To get an instance of an `OutputChannel` use
 * [createOutputChannel](#window.createOutputChannel).

 */
export interface OutputChannel extends fromJson, withDisp {
    /**
     * Append the given value to the channel.
     *
     * `value` ── A string, falsy values will not be printed.

     */
    Append: (_: string) => (_: () => void) => void;
    /**
     * Append the given value and a line feed character
     * to the channel.
     *
     * `value` ── A string, falsy values will be printed.

     */
    AppendLine: (_: string) => (_: () => void) => void;
    /**
     * Removes all output from the channel.

     */
    Clear: () => (_: () => void) => void;
    /**
     * Reveal this channel in the UI.
     *
     * `preserveFocus` ── When `true` the channel will not take focus.

     */
    Show: (_: boolean) => (_: () => void) => void;
    /**
     * Hide this channel from the UI.

     */
    Hide: () => (_: () => void) => void;
    /**
     * Dispose and free associated resources.

     */
    Dispose: () => (_: () => void) => void;
}
/**
 * An event describing a change to the set of [workspace folders](#workspace.workspaceFolders).

 */
export interface WorkspaceFoldersChangeEvent extends fromJson {
    /**
     * Added workspace folders.

     */
    added: WorkspaceFolder[];
    /**
     * Removed workspace folders.

     */
    removed: WorkspaceFolder[];
}
/**
 * The event that is fired when diagnostics change.

 */
export interface DiagnosticChangeEvent extends fromJson {
    /**
     * An array of resources for which diagnostics have changed.

     */
    uris: string[];
}
/**
 * Namespace describing the environment the editor runs in.

 */
export interface EnvProperties extends fromJson {
    /**
     * The application name of the editor, like 'VS Code'.

     */
    appName?: string;
    /**
     * The application root folder from which the editor is running.

     */
    appRoot?: string;
    /**
     * Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.

     */
    language?: string;
    /**
     * A unique identifier for the computer.

     */
    machineId?: string;
    /**
     * The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
     * Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
     *
     * *Note* that the value is `undefined` when there is no remote extension host but that the
     * value is defined in all extension hosts (local and remote) in case a remote extension host
     * exists. Use [`Extension#extensionKind`](#Extension.extensionKind) to know if
     * a specific extension runs remote or not.

     */
    remoteName?: string;
    /**
     * A unique identifier for the current session.
     * Changes each time the editor is started.

     */
    sessionId?: string;
    /**
     * The detected default shell for the extension host, this is overridden by the
     * `terminal.integrated.shell` setting for the extension host's platform.

     */
    shell?: string;
    /**
     * The custom uri scheme the editor registers to in the operating system.

     */
    uriScheme?: string;
}
/**
 * Namespace for dealing with the current workspace. A workspace is the representation
 * of the folder that has been opened. There is no workspace when just a file but not a
 * folder has been opened.
 *
 * The workspace offers support for [listening](#workspace.createFileSystemWatcher) to fs
 * events and for [finding](#workspace.findFiles) files. Both perform well and run _outside_
 * the editor-process so that they should be always used instead of nodejs-equivalents.

 */
export interface WorkspaceProperties extends fromJson {
    /**
     * The name of the workspace. `undefined` when no folder
     * has been opened.

     */
    name?: string;
    /**
     * The location of the workspace file, for example:
     *
     * `file:///Users/name/Development/myProject.code-workspace`
     *
     * or
     *
     * `untitled:1555503116870`
     *
     * for a workspace that is untitled and not yet saved.
     *
     * Depending on the workspace that is opened, the value will be:
     *   * `undefined` when no workspace or  a single folder is opened
     *   * the path of the workspace file as `Uri` otherwise. if the workspace
     * is untitled, the returned URI will use the `untitled:` scheme
     *
     * The location can e.g. be used with the `vscode.openFolder` command to
     * open the workspace again after it has been closed.
     *
     * **Example:**
     * ```typescript
     * vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
     * ```
     *
     * **Note:** it is not advised to use `workspace.workspaceFile` to write
     * configuration data into the file. You can use `workspace.getConfiguration().update()`
     * for that purpose which will work both when a single folder is opened as
     * well as an untitled or saved workspace.

     */
    workspaceFile?: string;
    /**
     * List of workspace folders or `undefined` when no folder is open.
     * *Note* that the first entry corresponds to the value of `rootPath`.

     */
    workspaceFolders?: WorkspaceFolder[];
}
export declare abstract class impl implements Vscode {
    Window: Window;
    Env: Env;
    Workspace: Workspace;
    Languages: Languages;
    Extensions: Extensions;
    Commands: Commands;
    constructor();
}
export {};
