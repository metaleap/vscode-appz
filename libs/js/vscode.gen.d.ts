import * as core from './core';
declare type Cancel = core.Cancel;
declare type Disposable = core.Disposable;
interface fromJson {
    __loadFromJsonish__: (_: any) => boolean;
}
interface withDisp {
    __disp__: Disposable;
}
interface withState<T extends fromJson> {
    Cfg: T;
    toJSON: () => any;
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
 * Type Definition for Visual Studio Code 1.39 Extension API
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
     * The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
     * events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
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
     * that can be called with a [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
     * mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
     *
     *
     * ```javascript
     *
     * languages.registerHoverProvider('javascript', {
     *  	provideHover(document, position, token) {
     *  		return new Hover('I am a hover!');
     *  	}
     * });
     *
     * ```
     *
     *
     * Registration is done using a [document selector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a language id, like `javascript` or
     * a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
     * a selector will result in a [score](https://code.visualstudio.com/api/references/vscode-api#languages.match) that is used to determine if and how a provider shall be used. When
     * scores are equal the provider that came last wins. For features that allow full arity, like [hover](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider),
     * the score is only checked to be `>0`, for other features, like [IntelliSense](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider) the
     * score is used for determining the order in which providers are asked to participate.

     */
    Languages: Languages;
    /**
     * Namespace for dealing with installed extensions. Extensions are represented
     * by an [extension](https://code.visualstudio.com/api/references/vscode-api#Extension)-interface which enables reflection on them.
     *
     * Extension writers can provide APIs to other extensions by returning their API public
     * surface from the `activate`-call.
     *
     *
     * ```javascript
     *
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
     *
     * ```
     *
     * When depending on the API of another extension add an `extensionDependency`-entry
     * to `package.json`, and use the [getExtension](https://code.visualstudio.com/api/references/vscode-api#extensions.getExtension)-function
     * and the [exports](https://code.visualstudio.com/api/references/vscode-api#Extension.exports)-property, like below:
     *
     *
     * ```javascript
     *
     * let mathExt = extensions.getExtension('genius.math');
     * let importedApi = mathExt.exports;
     *
     * console.log(importedApi.mul(42, 1));
     *
     * ```
     *

     */
    Extensions: Extensions;
    /**
     * Namespace for dealing with commands. In short, a command is a function with a
     * unique identifier. The function is sometimes also called _command handler_.
     *
     * Commands can be added to the editor using the [registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
     * and [registerTextEditorCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerTextEditorCommand) functions. Commands
     * can be executed [manually](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand) or from a UI gesture. Those are:
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
     *
     * ```javascript
     *
     * commands.registerCommand('extension.sayHello', () => {
     *  	window.showInformationMessage('Hello World!');
     * });
     *
     * ```
     *
     * Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
     *
     * ```json
     *
     * {
     *  	"contributes": {
     *  		"commands": [{
     *  			"command": "extension.sayHello",
     *  			"title": "Hello World"
     *  		}]
     *  	}
     * }
     *
     * ```
     *

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
    ShowInformationMessage: (message: string, items: string[]) => (_: (_: string) => void) => void;
    /**
     * Show a warning message.

     * @param message The message to show.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowWarningMessage: (message: string, items: string[]) => (_: (_: string) => void) => void;
    /**
     * Show an error message.

     * @param message The message to show.
     * @param items A set of items that will be rendered as actions in the message.
     * @return A thenable that resolves to the selected item or `undefined` when being dismissed.
     */
    ShowErrorMessage: (message: string, items: string[]) => (_: (_: string) => void) => void;
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
     * Shows a selection list.

     * @param items An array of items.
     * @param options Configures the behavior of the selection list.
     * @param token A token that can be used to signal cancellation.
     * @return A promise that resolves to the selected items or `undefined`.
     */
    ShowQuickPick: (items: QuickPickItem[], options: QuickPickOptions, token?: Cancel) => (_: (_: QuickPickItem[]) => void) => void;
    /**
     * Set a message to the status bar. This is a short hand for the more powerful
     * status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).

     * @param text The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).
     * @param hideAfterTimeout Timeout in milliseconds after which the message will be disposed.
     * @return A disposable which hides the status bar message.
     */
    SetStatusBarMessage: (text: string, hideAfterTimeout: number) => (_: (_: Disposable) => void) => void;
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
     * Shows a selection list of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) to pick from.
     * Returns `undefined` if no folder is open.

     * @param options Configures the behavior of the workspace folder list.
     * @return A promise that resolves to the workspace folder or `undefined`.
     */
    ShowWorkspaceFolderPick: (options?: WorkspaceFolderPickOptions) => (_: (_: WorkspaceFolder) => void) => void;
    /**
     * Represents the current window's state.

     * @return a thenable that resolves when this `State` call has successfully completed at the VSC side and its `WindowState` result received back at our end.
     */
    State: (_: (_: WindowState) => void) => void;
    /**
     * An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the focus state of the current window
     * changes. The value of the event represents whether the window is focused.

     * @param listener will be invoked whenever the `OnDidChangeWindowState` event fires (mandatory, not optional).
     * @return A `Disposable` that will unsubscribe `listener` from the `OnDidChangeWindowState` event on `Dispose`.
     */
    OnDidChangeWindowState: (listener: (_: WindowState) => void) => (_: (_: Disposable) => void) => void;
    /**
     * Creates a status bar [item](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem).

     * @param alignment The alignment of the item.
     * @param priority The priority of the item. Higher values mean the item should be shown more to the left.
     * @return A new status bar item.
     */
    CreateStatusBarItem: (alignment?: StatusBarAlignment, priority?: number) => (_: (_: StatusBarItem) => void) => void;
    /**
     * Creates a new [output channel](https://code.visualstudio.com/api/references/vscode-api#OutputChannel) with the given name.

     * @param name Human-readable string which will be used to represent the channel in the UI.
     * @return a thenable that resolves to the newly created `OutputChannel`.
     */
    CreateOutputChannel: (name: string) => (_: (_: OutputChannel) => void) => void;
    /**
     * Creates a [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox) to let the user enter some text input.
     *
     * Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
     * is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
     * when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.

     * @return A new [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox).
     */
    CreateInputBox: (_: (_: InputBox) => void) => void;
    /**
     * Creates a [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick) to let the user pick an item from a list
     * of items of type T.
     *
     * Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
     * is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
     * when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.

     * @return A new [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick).
     */
    CreateQuickPick: (_: (_: QuickPick) => void) => void;
    /**
     * Creates a [Terminal](https://code.visualstudio.com/api/references/vscode-api#Terminal) with a backing shell process.

     * @param options A TerminalOptions object describing the characteristics of the new terminal.
     * @return A new Terminal.
     */
    CreateTerminal: (options: TerminalOptions) => (_: (_: Terminal) => void) => void;
}
/**
 * Namespace describing the environment the editor runs in.

 */
export interface Env {
    /**
     * Opens an *external* item, e.g. a http(s) or mailto-link, using the
     * default application.
     *
     * *Note* that [`showTextDocument`](https://code.visualstudio.com/api/references/vscode-api#window.showTextDocument) is the right
     * way to open a text document inside the editor, not this function.

     * @param target The uri that should be opened.
     * @return A promise indicating if open was successful.
     */
    OpenExternal: (target: string) => (_: (_: boolean) => void) => void;
    /**
     * The application name of the editor, like 'VS Code'.

     * @return a thenable that resolves when this `AppName` call has successfully completed at the VSC side and its result received back at our end.
     */
    AppName: (_: (_: string) => void) => void;
    /**
     * The application root folder from which the editor is running.

     * @return a thenable that resolves when this `AppRoot` call has successfully completed at the VSC side and its result received back at our end.
     */
    AppRoot: (_: (_: string) => void) => void;
    /**
     * Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.

     * @return a thenable that resolves when this `Language` call has successfully completed at the VSC side and its result received back at our end.
     */
    Language: (_: (_: string) => void) => void;
    /**
     * A unique identifier for the computer.

     * @return a thenable that resolves when this `MachineId` call has successfully completed at the VSC side and its result received back at our end.
     */
    MachineId: (_: (_: string) => void) => void;
    /**
     * The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
     * Subsystem for Linux or `ssh-remote` for remotes using a secure shell.
     *
     * *Note* that the value is `undefined` when there is no remote extension host but that the
     * value is defined in all extension hosts (local and remote) in case a remote extension host
     * exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
     * a specific extension runs remote or not.

     * @return a thenable that resolves when this `RemoteName` call has successfully completed at the VSC side and its result received back at our end.
     */
    RemoteName: (_: (_: string) => void) => void;
    /**
     * A unique identifier for the current session.
     * Changes each time the editor is started.

     * @return a thenable that resolves when this `SessionId` call has successfully completed at the VSC side and its result received back at our end.
     */
    SessionId: (_: (_: string) => void) => void;
    /**
     * The detected default shell for the extension host, this is overridden by the
     * `terminal.integrated.shell` setting for the extension host's platform.

     * @return a thenable that resolves when this `Shell` call has successfully completed at the VSC side and its result received back at our end.
     */
    Shell: (_: (_: string) => void) => void;
    /**
     * The custom uri scheme the editor registers to in the operating system.

     * @return a thenable that resolves when this `UriScheme` call has successfully completed at the VSC side and its result received back at our end.
     */
    UriScheme: (_: (_: string) => void) => void;
    /**
     * Provides single-call access to numerous individual `Env` properties at once.

     * @return a thenable that resolves when this `AllProperties` call has successfully completed at the VSC side and its `EnvState` result received back at our end.
     */
    AllProperties: (_: (_: EnvState) => void) => void;
    /**
     * The clipboard provides read and write access to the system's clipboard.

     */
    Clipboard: () => Clipboard;
}
/**
 * The clipboard provides read and write access to the system's clipboard.

 */
export interface Clipboard {
    /**
     * Read the current clipboard contents as text.

     * @return A thenable that resolves to a string.
     */
    ReadText: (_: (_: string) => void) => void;
    /**
     * Writes text into the clipboard.

     * @return A thenable that resolves when writing happened.
     * @param value
     */
    WriteText: (value: string) => (_: () => void) => void;
}
/**
 * Namespace for dealing with the current workspace. A workspace is the representation
 * of the folder that has been opened. There is no workspace when just a file but not a
 * folder has been opened.
 *
 * The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
 * events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
 * the editor-process so that they should be always used instead of nodejs-equivalents.

 */
export interface Workspace {
    /**
     * The name of the workspace. `undefined` when no folder
     * has been opened.

     * @return a thenable that resolves when this `Name` call has successfully completed at the VSC side and its result received back at our end.
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
     *
     * ```typescript
     *
     * vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
     *
     * ```
     *
     *
     * **Note:** it is not advised to use `workspace.workspaceFile` to write
     * configuration data into the file. You can use `workspace.getConfiguration().update()`
     * for that purpose which will work both when a single folder is opened as
     * well as an untitled or saved workspace.

     * @return a thenable that resolves when this `WorkspaceFile` call has successfully completed at the VSC side and its result received back at our end.
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

     * @param listener will be invoked whenever the `OnDidChangeWorkspaceFolders` event fires (mandatory, not optional).
     * @return A `Disposable` that will unsubscribe `listener` from the `OnDidChangeWorkspaceFolders` event on `Dispose`.
     */
    OnDidChangeWorkspaceFolders: (listener: (_: WorkspaceFoldersChangeEvent) => void) => (_: (_: Disposable) => void) => void;
    /**
     * Returns the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) that contains a given uri.
     * * returns `undefined` when the given uri doesn't match any workspace folder
     * * returns the *input* when the given uri is a workspace folder itself

     * @param uri An uri.
     * @return A workspace folder or `undefined`
     */
    GetWorkspaceFolder: (uri: string) => (_: (_: WorkspaceFolder) => void) => void;
    /**
     * List of workspace folders or `undefined` when no folder is open.
     * *Note* that the first entry corresponds to the value of `rootPath`.

     * @return a thenable that resolves when this `WorkspaceFolders` call has successfully completed at the VSC side and its result received back at our end.
     */
    WorkspaceFolders: (_: (_: WorkspaceFolder[]) => void) => void;
    /**
     * Find files across all [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) in the workspace.
     * `findFiles('**​/*.js', '**​/node_modules/**', 10)`

     * @param include A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines the files to search for. The glob pattern will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern) to restrict the search results to a [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder).
     * @param exclude A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines files and folders to exclude. The glob pattern will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will apply, when `null` no excludes will apply.
     * @param maxResults An upper-bound for the result.
     * @param token A token that can be used to signal cancellation to the underlying search engine.
     * @return A thenable that resolves to an array of resource identifiers. Will return no results if no [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) are opened.
     */
    FindFiles: (include: string, exclude?: string, maxResults?: number, token?: Cancel) => (_: (_: string[]) => void) => void;
    /**
     * Returns a path that is relative to the workspace folder or folders.
     *
     * When there are no [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) or when the path
     * is not contained in them, the input is returned.

     * @param pathOrUri A path or uri. When a uri is given its [fsPath](https://code.visualstudio.com/api/references/vscode-api#Uri.fsPath) is used.
     * @param includeWorkspaceFolder When `true` and when the given path is contained inside a workspace folder the name of the workspace is prepended. Defaults to `true` when there are multiple workspace folders and `false` otherwise.
     * @return A path relative to the root or the input.
     */
    AsRelativePath: (pathOrUri: string, includeWorkspaceFolder: boolean) => (_: (_: string) => void) => void;
    /**
     * Creates a file system watcher.
     *
     * A glob pattern that filters the file events on their absolute path must be provided. Optionally,
     * flags to ignore certain kinds of events can be provided. To stop listening to events the watcher must be disposed.
     *
     * *Note* that only files within the current [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) can be watched.

     * @param globPattern A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that is applied to the absolute paths of created, changed, and deleted files. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern) to limit events to a certain [workspace folder](#WorkspaceFolder).
     * @param ignoreCreateEvents Ignore when files have been created.
     * @param ignoreChangeEvents Ignore when files have been changed.
     * @param ignoreDeleteEvents Ignore when files have been deleted.
     * @return A new file system watcher instance.
     */
    CreateFileSystemWatcher: (globPattern: string, ignoreCreateEvents: boolean, ignoreChangeEvents: boolean, ignoreDeleteEvents: boolean) => (_: (_: FileSystemWatcher) => void) => void;
    /**
     * Provides single-call access to numerous individual `Workspace` properties at once.

     * @return a thenable that resolves when this `AllProperties` call has successfully completed at the VSC side and its `WorkspaceState` result received back at our end.
     */
    AllProperties: (_: (_: WorkspaceState) => void) => void;
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
 * that can be called with a [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
 * mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.
 *
 *
 * ```javascript
 *
 * languages.registerHoverProvider('javascript', {
 *  	provideHover(document, position, token) {
 *  		return new Hover('I am a hover!');
 *  	}
 * });
 *
 * ```
 *
 *
 * Registration is done using a [document selector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a language id, like `javascript` or
 * a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
 * a selector will result in a [score](https://code.visualstudio.com/api/references/vscode-api#languages.match) that is used to determine if and how a provider shall be used. When
 * scores are equal the provider that came last wins. For features that allow full arity, like [hover](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider),
 * the score is only checked to be `>0`, for other features, like [IntelliSense](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider) the
 * score is used for determining the order in which providers are asked to participate.

 */
export interface Languages {
    /**
     * Return the identifiers of all known languages.

     * @return Promise resolving to an array of identifier strings.
     */
    GetLanguages: (_: (_: string[]) => void) => void;
    /**
     * An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the global set of diagnostics changes. This is
     * newly added and removed diagnostics.

     * @param listener will be invoked whenever the `OnDidChangeDiagnostics` event fires (mandatory, not optional).
     * @return A `Disposable` that will unsubscribe `listener` from the `OnDidChangeDiagnostics` event on `Dispose`.
     */
    OnDidChangeDiagnostics: (listener: (_: DiagnosticChangeEvent) => void) => (_: (_: Disposable) => void) => void;
}
/**
 * Namespace for dealing with installed extensions. Extensions are represented
 * by an [extension](https://code.visualstudio.com/api/references/vscode-api#Extension)-interface which enables reflection on them.
 *
 * Extension writers can provide APIs to other extensions by returning their API public
 * surface from the `activate`-call.
 *
 *
 * ```javascript
 *
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
 *
 * ```
 *
 * When depending on the API of another extension add an `extensionDependency`-entry
 * to `package.json`, and use the [getExtension](https://code.visualstudio.com/api/references/vscode-api#extensions.getExtension)-function
 * and the [exports](https://code.visualstudio.com/api/references/vscode-api#Extension.exports)-property, like below:
 *
 *
 * ```javascript
 *
 * let mathExt = extensions.getExtension('genius.math');
 * let importedApi = mathExt.exports;
 *
 * console.log(importedApi.mul(42, 1));
 *
 * ```
 *

 */
export interface Extensions {
    /**
     * An event which fires when `extensions.all` changes. This can happen when extensions are
     * installed, uninstalled, enabled or disabled.

     * @param listener will be invoked whenever the `OnDidChange` event fires (mandatory, not optional).
     * @return A `Disposable` that will unsubscribe `listener` from the `OnDidChange` event on `Dispose`.
     */
    OnDidChange: (listener: () => void) => (_: (_: Disposable) => void) => void;
}
/**
 * Namespace for dealing with commands. In short, a command is a function with a
 * unique identifier. The function is sometimes also called _command handler_.
 *
 * Commands can be added to the editor using the [registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
 * and [registerTextEditorCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerTextEditorCommand) functions. Commands
 * can be executed [manually](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand) or from a UI gesture. Those are:
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
 *
 * ```javascript
 *
 * commands.registerCommand('extension.sayHello', () => {
 *  	window.showInformationMessage('Hello World!');
 * });
 *
 * ```
 *
 * Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
 *
 * ```json
 *
 * {
 *  	"contributes": {
 *  		"commands": [{
 *  			"command": "extension.sayHello",
 *  			"title": "Hello World"
 *  		}]
 *  	}
 * }
 *
 * ```
 *

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
     * `number`, `undefined`, and `null`, as well as [`Position`](https://code.visualstudio.com/api/references/vscode-api#Position), [`Range`](#Range), [`Uri`](#Uri) and [`Location`](#Location).
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
 * Options to configure the behavior of the input box UI.

 */
export interface InputBoxOptions {
    /**
     * The value to prefill in the input box.

     */
    value?: string;
    /**
     * Selection of the prefilled [`value`](https://code.visualstudio.com/api/references/vscode-api#InputBoxOptions.value). Defined as tuple of two number where the
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
    validateInput_AppzFuncId: string;
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
    onDidSelectItem_AppzFuncId: string;
}
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
     *
     * ```ts
     *
     * {
     *  	'Images': ['png', 'jpg']
     *  	'TypeScript': ['ts', 'tsx']
     * }
     *
     * ```
     *

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
     *
     * ```ts
     *
     * {
     *  	'Images': ['png', 'jpg']
     *  	'TypeScript': ['ts', 'tsx']
     * }
     *
     * ```
     *

     */
    filters?: {
        [_: string]: string[];
    };
}
/**
 * Options to configure the behaviour of the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) pick UI.

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
     * *Note:* The [Uri](https://code.visualstudio.com/api/references/vscode-api#Uri)-type was intentionally chosen such that future releases of the editor can support
     * workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.

     */
    uri: string;
    /**
     * The name of this workspace folder. Defaults to
     * the basename of its [uri-path](https://code.visualstudio.com/api/references/vscode-api#Uri.path)

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
export interface StatusBarItem extends fromJson, withDisp, withState<StatusBarItemState> {
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
     * [hide](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.hide).

     */
    Dispose: () => (_: () => void) => void;
    __appzObjBagPullFromPeer__: () => (_: () => void) => void;
    __appzObjBagPushToPeer__: (_: StatusBarItemState) => (_: () => void) => void;
}
/**
 * An output channel is a container for readonly textual information.
 *
 * To get an instance of an `OutputChannel` use
 * [createOutputChannel](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel).

 */
export interface OutputChannel extends fromJson, withDisp, withState<OutputChannelState> {
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
    __appzObjBagPullFromPeer__: () => (_: () => void) => void;
}
/**
 * A concrete [QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput) to let the user input a text value.
 *
 * Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
 * is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
 * when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.

 */
export interface InputBox extends fromJson, withDisp, withState<InputBoxState> {
    /**
     * An event signaling when the value has changed.

     */
    OnDidChangeValue: (_: (_: string) => void) => (_: (_: Disposable) => void) => void;
    /**
     * An event signaling when the user indicated acceptance of the input value.

     */
    OnDidAccept: (_: () => void) => (_: (_: Disposable) => void) => void;
    /**
     * Makes the input UI visible in its current configuration. Any other input
     * UI will first fire an [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide) event.

     */
    Show: () => (_: () => void) => void;
    /**
     * Hides this input UI. This will also fire an [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
     * event.

     */
    Hide: () => (_: () => void) => void;
    /**
     * An event signaling when this input UI is hidden.
     *
     * There are several reasons why this UI might have to be hidden and
     * the extension will be notified through [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide).
     * (Examples include: an explicit call to [QuickInput.hide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.hide),
     * the user pressing Esc, some other input UI opening, etc.)

     */
    OnDidHide: (_: () => void) => (_: (_: Disposable) => void) => void;
    /**
     * Dispose of this input UI and any associated resources. If it is still
     * visible, it is first hidden. After this call the input UI is no longer
     * functional and no additional methods or properties on it should be
     * accessed. Instead a new input UI should be created.

     */
    Dispose: () => (_: () => void) => void;
    __appzObjBagPullFromPeer__: () => (_: () => void) => void;
    __appzObjBagPushToPeer__: (_: InputBoxState) => (_: () => void) => void;
}
/**
 * Button for an action in a [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick) or [InputBox](#InputBox).

 */
export interface QuickInputButton {
    /**
     * Icon for the button.

     */
    iconPath: string;
    /**
     * An optional tooltip.

     */
    tooltip?: string;
}
/**
 * A concrete [QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput) to let the user pick an item from a
 * list of items of type T. The items can be filtered through a filter text field and
 * there is an option [canSelectMany](https://code.visualstudio.com/api/references/vscode-api#QuickPick.canSelectMany) to allow for
 * selecting multiple items.
 *
 * Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
 * is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
 * when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.

 */
export interface QuickPick extends fromJson, withDisp, withState<QuickPickState> {
    /**
     * An event signaling when the value of the filter text has changed.

     */
    OnDidChangeValue: (_: (_: string) => void) => (_: (_: Disposable) => void) => void;
    /**
     * An event signaling when the user indicated acceptance of the selected item(s).

     */
    OnDidAccept: (_: () => void) => (_: (_: Disposable) => void) => void;
    /**
     * An event signaling when the active items have changed.

     */
    OnDidChangeActive: (_: (_: QuickPickItem[]) => void) => (_: (_: Disposable) => void) => void;
    /**
     * An event signaling when the selected items have changed.

     */
    OnDidChangeSelection: (_: (_: QuickPickItem[]) => void) => (_: (_: Disposable) => void) => void;
    /**
     * Makes the input UI visible in its current configuration. Any other input
     * UI will first fire an [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide) event.

     */
    Show: () => (_: () => void) => void;
    /**
     * Hides this input UI. This will also fire an [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
     * event.

     */
    Hide: () => (_: () => void) => void;
    /**
     * An event signaling when this input UI is hidden.
     *
     * There are several reasons why this UI might have to be hidden and
     * the extension will be notified through [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide).
     * (Examples include: an explicit call to [QuickInput.hide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.hide),
     * the user pressing Esc, some other input UI opening, etc.)

     */
    OnDidHide: (_: () => void) => (_: (_: Disposable) => void) => void;
    /**
     * Dispose of this input UI and any associated resources. If it is still
     * visible, it is first hidden. After this call the input UI is no longer
     * functional and no additional methods or properties on it should be
     * accessed. Instead a new input UI should be created.

     */
    Dispose: () => (_: () => void) => void;
    __appzObjBagPullFromPeer__: () => (_: () => void) => void;
    __appzObjBagPushToPeer__: (_: QuickPickState) => (_: () => void) => void;
}
/**
 * Value-object describing what options a terminal should use.

 */
export interface TerminalOptions {
    /**
     * A human-readable string which will be used to represent the terminal in the UI.

     */
    name?: string;
    /**
     * A path to a custom shell executable to be used in the terminal.

     */
    shellPath?: string;
    /**
     * Args for the custom shell executable. A string can be used on Windows only which allows
     * specifying shell args in [command-line format](https://msdn.microsoft.com/en-au/08dfcab2-eb6e-49a4-80eb-87d4076c98c6).

     */
    shellArgs?: string[];
    /**
     * A path or Uri for the current working directory to be used for the terminal.

     */
    cwd?: string;
    /**
     * Object with environment variables that will be added to the VS Code process.

     */
    env?: {
        [_: string]: string;
    };
    /**
     * Whether the terminal process environment should be exactly as provided in
     * `TerminalOptions.env`. When this is false (default), the environment will be based on the
     * window's environment and also apply configured platform settings like
     * `terminal.integrated.windows.env` on top. When this is true, the complete environment
     * must be provided as nothing will be inherited from the process or any configuration.

     */
    strictEnv?: boolean;
    /**
     * When enabled the terminal will run the process as normal but not be surfaced to the user
     * until `Terminal.show` is called. The typical usage for this is when you need to run
     * something that may need interactivity but only want to tell the user about it when
     * interaction is needed. Note that the terminals will still be exposed to all extensions
     * as normal.

     */
    hideFromUser?: boolean;
}
/**
 * An individual terminal instance within the integrated terminal.

 */
export interface Terminal extends fromJson, withDisp, withState<TerminalState> {
    /**
     * Send text to the terminal. The text is written to the stdin of the underlying pty process
     * (shell) of the terminal.
     *
     * `text` ── The text to send.
     *
     * `addNewLine` ── Whether to add a new line to the text being sent, this is normally
     * required to run a command in the terminal. The character(s) added are \n or \r\n
     * depending on the platform. This defaults to `true`.

     */
    SendText: (_: string, __: boolean) => (_: () => void) => void;
    /**
     * Show the terminal panel and reveal this terminal in the UI.
     *
     * `preserveFocus` ── When `true` the terminal will not take focus.

     */
    Show: (_: boolean) => (_: () => void) => void;
    /**
     * Hide the terminal panel if this terminal is currently showing.

     */
    Hide: () => (_: () => void) => void;
    /**
     * Dispose and free associated resources.

     */
    Dispose: () => (_: () => void) => void;
    __appzObjBagPullFromPeer__: () => (_: () => void) => void;
}
/**
 * An event describing a change to the set of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders).

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
 * A file system watcher notifies about changes to files and folders
 * on disk.
 *
 * To get an instance of a `FileSystemWatcher` use
 * [createFileSystemWatcher](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher).

 */
export interface FileSystemWatcher extends fromJson, withDisp, withState<FileSystemWatcherState> {
    /**
     * An event which fires on file/folder creation.

     */
    OnDidCreate: (_: (_: string) => void) => (_: (_: Disposable) => void) => void;
    /**
     * An event which fires on file/folder change.

     */
    OnDidChange: (_: (_: string) => void) => (_: (_: Disposable) => void) => void;
    /**
     * An event which fires on file/folder deletion.

     */
    OnDidDelete: (_: (_: string) => void) => (_: (_: Disposable) => void) => void;
    Dispose: () => (_: () => void) => void;
    __appzObjBagPullFromPeer__: () => (_: () => void) => void;
    __appzObjBagPushToPeer__: (_: FileSystemWatcherState) => (_: () => void) => void;
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
 * EnvState gathers various properties of `Env`, obtainable via its `AllProperties` method.

 */
export interface EnvState extends fromJson {
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
     * exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
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
 * WorkspaceState gathers various properties of `Workspace`, obtainable via its `AllProperties` method.

 */
export interface WorkspaceState extends fromJson {
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
     *
     * ```typescript
     *
     * vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
     *
     * ```
     *
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
/**
 * StatusBarItemState (to be accessed only via `StatusBarItem.Cfg`) is a snapshot of `StatusBarItem` state. It is auto-updated whenever `StatusBarItem` creations and method calls resolve or its event subscribers (if any) are invoked. All read-only properties are exposed as function-valued fields. Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `ApplyChanges` method.

 */
export interface StatusBarItemState extends fromJson {
    __holder__: StatusBarItem;
    /**
     * The alignment of this item.

     */
    Alignment: () => StatusBarAlignment;
    /**
     * The priority of this item. Higher value means the item should
     * be shown more to the left.

     */
    Priority: () => number;
    /**
     * The text to show for the entry. You can embed icons in the text by leveraging the syntax:
     *
     * `My text $(icon-name) contains icons like $(icon-name) this one.`
     *
     * Where the icon-name is taken from the [octicon](https://octicons.github.com) icon set, e.g.
     * `light-bulb`, `thumbsup`, `zap` etc.

     */
    text?: string;
    /**
     * The tooltip text when you hover over this entry.

     */
    tooltip?: string;
    /**
     * The foreground color for this entry.

     */
    color?: string;
    /**
     * The identifier of a command to run on click. The command must be
     * [known](https://code.visualstudio.com/api/references/vscode-api#commands.getCommands).

     */
    command?: string;
    ApplyChanges: () => (_: () => void) => void;
    ReFetch: () => (_: () => void) => void;
}
export declare function newStatusBarItemState(): StatusBarItemState;
/**
 * OutputChannelState (to be accessed only via `OutputChannel.Cfg`) is a snapshot of `OutputChannel` state. It is auto-updated whenever `OutputChannel` creations and method calls resolve or its event subscribers (if any) are invoked. All read-only properties are exposed as function-valued fields.

 */
export interface OutputChannelState extends fromJson {
    __holder__: OutputChannel;
    /**
     * The human-readable name of this output channel.

     */
    Name: () => string;
    ReFetch: () => (_: () => void) => void;
}
export declare function newOutputChannelState(): OutputChannelState;
/**
 * InputBoxState (to be accessed only via `InputBox.Cfg`) is a snapshot of `InputBox` state. It is auto-updated whenever `InputBox` creations and method calls resolve or its event subscribers (if any) are invoked. Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `ApplyChanges` method.

 */
export interface InputBoxState extends fromJson {
    __holder__: InputBox;
    /**
     * Current input value.

     */
    value?: string;
    /**
     * Optional placeholder in the filter text.

     */
    placeholder?: string;
    /**
     * If the input value should be hidden. Defaults to false.

     */
    password?: boolean;
    /**
     * An optional prompt text providing some ask or explanation to the user.

     */
    prompt?: string;
    /**
     * An optional validation message indicating a problem with the current input value.

     */
    validationMessage?: string;
    /**
     * An optional title.

     */
    title?: string;
    /**
     * An optional current step count.

     */
    step?: number;
    /**
     * An optional total step count.

     */
    totalSteps?: number;
    /**
     * If the UI should allow for user input. Defaults to true.
     *
     * Change this to false, e.g., while validating user input or
     * loading data for the next step in user input.

     */
    enabled?: boolean;
    /**
     * If the UI should show a progress indicator. Defaults to false.
     *
     * Change this to true, e.g., while loading more data or validating
     * user input.

     */
    busy?: boolean;
    /**
     * If the UI should stay open even when loosing UI focus. Defaults to false.

     */
    ignoreFocusOut?: boolean;
    ApplyChanges: () => (_: () => void) => void;
    ReFetch: () => (_: () => void) => void;
}
export declare function newInputBoxState(): InputBoxState;
/**
 * QuickPickState (to be accessed only via `QuickPick.Cfg`) is a snapshot of `QuickPick` state. It is auto-updated whenever `QuickPick` creations and method calls resolve or its event subscribers (if any) are invoked. Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `ApplyChanges` method.

 */
export interface QuickPickState extends fromJson {
    __holder__: QuickPick;
    /**
     * Current value of the filter text.

     */
    value?: string;
    /**
     * Optional placeholder in the filter text.

     */
    placeholder?: string;
    /**
     * Items to pick from.

     */
    items?: QuickPickItem[];
    /**
     * If multiple items can be selected at the same time. Defaults to false.

     */
    canSelectMany?: boolean;
    /**
     * If the filter text should also be matched against the description of the items. Defaults to false.

     */
    matchOnDescription?: boolean;
    /**
     * If the filter text should also be matched against the detail of the items. Defaults to false.

     */
    matchOnDetail?: boolean;
    /**
     * Active items. This can be read and updated by the extension.

     */
    activeItems?: QuickPickItem[];
    /**
     * Selected items. This can be read and updated by the extension.

     */
    selectedItems?: QuickPickItem[];
    /**
     * An optional title.

     */
    title?: string;
    /**
     * An optional current step count.

     */
    step?: number;
    /**
     * An optional total step count.

     */
    totalSteps?: number;
    /**
     * If the UI should allow for user input. Defaults to true.
     *
     * Change this to false, e.g., while validating user input or
     * loading data for the next step in user input.

     */
    enabled?: boolean;
    /**
     * If the UI should show a progress indicator. Defaults to false.
     *
     * Change this to true, e.g., while loading more data or validating
     * user input.

     */
    busy?: boolean;
    /**
     * If the UI should stay open even when loosing UI focus. Defaults to false.

     */
    ignoreFocusOut?: boolean;
    ApplyChanges: () => (_: () => void) => void;
    ReFetch: () => (_: () => void) => void;
}
export declare function newQuickPickState(): QuickPickState;
/**
 * TerminalState (to be accessed only via `Terminal.Cfg`) is a snapshot of `Terminal` state. It is auto-updated whenever `Terminal` creations and method calls resolve or its event subscribers (if any) are invoked. All read-only properties are exposed as function-valued fields.

 */
export interface TerminalState extends fromJson {
    __holder__: Terminal;
    /**
     * The name of the terminal.

     */
    Name: () => string;
    ReFetch: () => (_: () => void) => void;
}
export declare function newTerminalState(): TerminalState;
/**
 * FileSystemWatcherState (to be accessed only via `FileSystemWatcher.Cfg`) is a snapshot of `FileSystemWatcher` state. It is auto-updated whenever `FileSystemWatcher` creations and method calls resolve or its event subscribers (if any) are invoked. Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `ApplyChanges` method.

 */
export interface FileSystemWatcherState extends fromJson {
    __holder__: FileSystemWatcher;
    /**
     * true if this file system watcher has been created such that
     * it ignores creation file system events.

     */
    ignoreCreateEvents?: boolean;
    /**
     * true if this file system watcher has been created such that
     * it ignores change file system events.

     */
    ignoreChangeEvents?: boolean;
    /**
     * true if this file system watcher has been created such that
     * it ignores delete file system events.

     */
    ignoreDeleteEvents?: boolean;
    ApplyChanges: () => (_: () => void) => void;
    ReFetch: () => (_: () => void) => void;
}
export declare function newFileSystemWatcherState(): FileSystemWatcherState;
export declare abstract class impl implements Vscode {
    Window: Window;
    Env: Env;
    Clipboard: Clipboard;
    Workspace: Workspace;
    Languages: Languages;
    Extensions: Extensions;
    Commands: Commands;
    constructor();
    toJSON(): any;
}
export {};
