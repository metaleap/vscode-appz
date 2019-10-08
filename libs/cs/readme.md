<a name='assembly'></a>
# vscode-appz

## Contents

- [Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel')
  - [In(fromNow)](#M-VscAppz-Cancel-In-System-TimeSpan- 'VscAppz.Cancel.In(System.TimeSpan)')
  - [Now()](#M-VscAppz-Cancel-Now 'VscAppz.Cancel.Now')
- [Disposable](#T-VscAppz-Disposable 'VscAppz.Disposable')
  - [Dispose()](#M-VscAppz-Disposable-Dispose 'VscAppz.Disposable.Dispose')
- [IVscode](#T-VscAppz-IVscode 'VscAppz.IVscode')
  - [Window](#P-VscAppz-IVscode-Window 'VscAppz.IVscode.Window')
- [IWindow](#T-VscAppz-IWindow 'VscAppz.IWindow')
  - [OnDidChangeWindowState()](#M-VscAppz-IWindow-OnDidChangeWindowState-System-Action{VscAppz-WindowState},System-Action{VscAppz-Disposable}- 'VscAppz.IWindow.OnDidChangeWindowState(System.Action{VscAppz.WindowState},System.Action{VscAppz.Disposable})')
  - [SetStatusBarMessage(text,hideAfterTimeout,andThen)](#M-VscAppz-IWindow-SetStatusBarMessage-System-String,System-Int32,System-Action{VscAppz-Disposable}- 'VscAppz.IWindow.SetStatusBarMessage(System.String,System.Int32,System.Action{VscAppz.Disposable})')
  - [SetStatusBarMessage(text,andThen)](#M-VscAppz-IWindow-SetStatusBarMessage-System-String,System-Action{VscAppz-Disposable}- 'VscAppz.IWindow.SetStatusBarMessage(System.String,System.Action{VscAppz.Disposable})')
  - [ShowErrorMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowErrorMessage-System-String,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowErrorMessage(System.String,System.String[],System.Action{System.String})')
  - [ShowErrorMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowErrorMessage(System.String,VscAppz.MessageOptions,System.String[],System.Action{System.String})')
  - [ShowErrorMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowErrorMessage(System.String,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowErrorMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowErrorMessage(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowInformationMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowInformationMessage-System-String,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowInformationMessage(System.String,System.String[],System.Action{System.String})')
  - [ShowInformationMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowInformationMessage(System.String,VscAppz.MessageOptions,System.String[],System.Action{System.String})')
  - [ShowInformationMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowInformationMessage(System.String,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowInformationMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowInformationMessage(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowInputBox(options,token,andThen)](#M-VscAppz-IWindow-ShowInputBox-VscAppz-InputBoxOptions,VscAppz-Cancel,System-Action{System-String}- 'VscAppz.IWindow.ShowInputBox(VscAppz.InputBoxOptions,VscAppz.Cancel,System.Action{System.String})')
  - [ShowOpenDialog(options,andThen)](#M-VscAppz-IWindow-ShowOpenDialog-VscAppz-OpenDialogOptions,System-Action{System-String[]}- 'VscAppz.IWindow.ShowOpenDialog(VscAppz.OpenDialogOptions,System.Action{System.String[]})')
  - [ShowQuickPick(items,options,token,andThen)](#M-VscAppz-IWindow-ShowQuickPick-System-String[],VscAppz-QuickPickOptions,VscAppz-Cancel,System-Action{System-String[]}- 'VscAppz.IWindow.ShowQuickPick(System.String[],VscAppz.QuickPickOptions,VscAppz.Cancel,System.Action{System.String[]})')
  - [ShowQuickPick(items,options,token,andThen)](#M-VscAppz-IWindow-ShowQuickPick-System-String[],VscAppz-QuickPickOptions,VscAppz-Cancel,System-Action{System-String}- 'VscAppz.IWindow.ShowQuickPick(System.String[],VscAppz.QuickPickOptions,VscAppz.Cancel,System.Action{System.String})')
  - [ShowQuickPick(items,options,token,andThen)](#M-VscAppz-IWindow-ShowQuickPick-VscAppz-QuickPickItem[],VscAppz-QuickPickOptions,VscAppz-Cancel,System-Action{VscAppz-QuickPickItem[]}- 'VscAppz.IWindow.ShowQuickPick(VscAppz.QuickPickItem[],VscAppz.QuickPickOptions,VscAppz.Cancel,System.Action{VscAppz.QuickPickItem[]})')
  - [ShowQuickPick(items,options,token,andThen)](#M-VscAppz-IWindow-ShowQuickPick-VscAppz-QuickPickItem[],VscAppz-QuickPickOptions,VscAppz-Cancel,System-Action{VscAppz-QuickPickItem}- 'VscAppz.IWindow.ShowQuickPick(VscAppz.QuickPickItem[],VscAppz.QuickPickOptions,VscAppz.Cancel,System.Action{VscAppz.QuickPickItem})')
  - [ShowSaveDialog(options,andThen)](#M-VscAppz-IWindow-ShowSaveDialog-VscAppz-SaveDialogOptions,System-Action{System-String}- 'VscAppz.IWindow.ShowSaveDialog(VscAppz.SaveDialogOptions,System.Action{System.String})')
  - [ShowWarningMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowWarningMessage-System-String,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowWarningMessage(System.String,System.String[],System.Action{System.String})')
  - [ShowWarningMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowWarningMessage(System.String,VscAppz.MessageOptions,System.String[],System.Action{System.String})')
  - [ShowWarningMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowWarningMessage(System.String,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowWarningMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowWarningMessage(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowWorkspaceFolderPick(options,andThen)](#M-VscAppz-IWindow-ShowWorkspaceFolderPick-VscAppz-WorkspaceFolderPickOptions,System-Action{VscAppz-WorkspaceFolder}- 'VscAppz.IWindow.ShowWorkspaceFolderPick(VscAppz.WorkspaceFolderPickOptions,System.Action{VscAppz.WorkspaceFolder})')
  - [State()](#M-VscAppz-IWindow-State-System-Action{VscAppz-WindowState}- 'VscAppz.IWindow.State(System.Action{VscAppz.WindowState})')
- [InputBoxOptions](#T-VscAppz-InputBoxOptions 'VscAppz.InputBoxOptions')
  - [IgnoreFocusOut](#F-VscAppz-InputBoxOptions-IgnoreFocusOut 'VscAppz.InputBoxOptions.IgnoreFocusOut')
  - [Password](#F-VscAppz-InputBoxOptions-Password 'VscAppz.InputBoxOptions.Password')
  - [PlaceHolder](#F-VscAppz-InputBoxOptions-PlaceHolder 'VscAppz.InputBoxOptions.PlaceHolder')
  - [Prompt](#F-VscAppz-InputBoxOptions-Prompt 'VscAppz.InputBoxOptions.Prompt')
  - [ValidateInput](#F-VscAppz-InputBoxOptions-ValidateInput 'VscAppz.InputBoxOptions.ValidateInput')
  - [ValidateInput_AppzFuncId](#F-VscAppz-InputBoxOptions-ValidateInput_AppzFuncId 'VscAppz.InputBoxOptions.ValidateInput_AppzFuncId')
  - [Value](#F-VscAppz-InputBoxOptions-Value 'VscAppz.InputBoxOptions.Value')
  - [ValueSelection](#F-VscAppz-InputBoxOptions-ValueSelection 'VscAppz.InputBoxOptions.ValueSelection')
- [MessageItem](#T-VscAppz-MessageItem 'VscAppz.MessageItem')
  - [IsCloseAffordance](#F-VscAppz-MessageItem-IsCloseAffordance 'VscAppz.MessageItem.IsCloseAffordance')
  - [My](#F-VscAppz-MessageItem-My 'VscAppz.MessageItem.My')
  - [Title](#F-VscAppz-MessageItem-Title 'VscAppz.MessageItem.Title')
- [MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions')
  - [Modal](#F-VscAppz-MessageOptions-Modal 'VscAppz.MessageOptions.Modal')
- [OpenDialogOptions](#T-VscAppz-OpenDialogOptions 'VscAppz.OpenDialogOptions')
  - [CanSelectFiles](#F-VscAppz-OpenDialogOptions-CanSelectFiles 'VscAppz.OpenDialogOptions.CanSelectFiles')
  - [CanSelectFolders](#F-VscAppz-OpenDialogOptions-CanSelectFolders 'VscAppz.OpenDialogOptions.CanSelectFolders')
  - [CanSelectMany](#F-VscAppz-OpenDialogOptions-CanSelectMany 'VscAppz.OpenDialogOptions.CanSelectMany')
  - [Filters](#F-VscAppz-OpenDialogOptions-Filters 'VscAppz.OpenDialogOptions.Filters')
  - [OpenLabel](#F-VscAppz-OpenDialogOptions-OpenLabel 'VscAppz.OpenDialogOptions.OpenLabel')
- [QuickPickItem](#T-VscAppz-QuickPickItem 'VscAppz.QuickPickItem')
  - [AlwaysShow](#F-VscAppz-QuickPickItem-AlwaysShow 'VscAppz.QuickPickItem.AlwaysShow')
  - [Description](#F-VscAppz-QuickPickItem-Description 'VscAppz.QuickPickItem.Description')
  - [Detail](#F-VscAppz-QuickPickItem-Detail 'VscAppz.QuickPickItem.Detail')
  - [Label](#F-VscAppz-QuickPickItem-Label 'VscAppz.QuickPickItem.Label')
  - [My](#F-VscAppz-QuickPickItem-My 'VscAppz.QuickPickItem.My')
  - [Picked](#F-VscAppz-QuickPickItem-Picked 'VscAppz.QuickPickItem.Picked')
- [QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions')
  - [CanPickMany](#F-VscAppz-QuickPickOptions-CanPickMany 'VscAppz.QuickPickOptions.CanPickMany')
  - [IgnoreFocusOut](#F-VscAppz-QuickPickOptions-IgnoreFocusOut 'VscAppz.QuickPickOptions.IgnoreFocusOut')
  - [MatchOnDescription](#F-VscAppz-QuickPickOptions-MatchOnDescription 'VscAppz.QuickPickOptions.MatchOnDescription')
  - [MatchOnDetail](#F-VscAppz-QuickPickOptions-MatchOnDetail 'VscAppz.QuickPickOptions.MatchOnDetail')
  - [OnDidSelectItem](#F-VscAppz-QuickPickOptions-OnDidSelectItem 'VscAppz.QuickPickOptions.OnDidSelectItem')
  - [OnDidSelectItem_AppzFuncId](#F-VscAppz-QuickPickOptions-OnDidSelectItem_AppzFuncId 'VscAppz.QuickPickOptions.OnDidSelectItem_AppzFuncId')
  - [PlaceHolder](#F-VscAppz-QuickPickOptions-PlaceHolder 'VscAppz.QuickPickOptions.PlaceHolder')
- [SaveDialogOptions](#T-VscAppz-SaveDialogOptions 'VscAppz.SaveDialogOptions')
  - [Filters](#F-VscAppz-SaveDialogOptions-Filters 'VscAppz.SaveDialogOptions.Filters')
  - [SaveLabel](#F-VscAppz-SaveDialogOptions-SaveLabel 'VscAppz.SaveDialogOptions.SaveLabel')
- [Vsc](#T-VscAppz-Vsc 'VscAppz.Vsc')
  - [OnError](#F-VscAppz-Vsc-OnError 'VscAppz.Vsc.OnError')
  - [OnErrorDefaultOutputFormat](#F-VscAppz-Vsc-OnErrorDefaultOutputFormat 'VscAppz.Vsc.OnErrorDefaultOutputFormat')
  - [InOut(stdIn,stdOut)](#M-VscAppz-Vsc-InOut-System-IO-TextReader,System-IO-TextWriter- 'VscAppz.Vsc.InOut(System.IO.TextReader,System.IO.TextWriter)')
- [WindowState](#T-VscAppz-WindowState 'VscAppz.WindowState')
  - [Focused](#F-VscAppz-WindowState-Focused 'VscAppz.WindowState.Focused')
- [WorkspaceFolder](#T-VscAppz-WorkspaceFolder 'VscAppz.WorkspaceFolder')
  - [Index](#F-VscAppz-WorkspaceFolder-Index 'VscAppz.WorkspaceFolder.Index')
  - [Name](#F-VscAppz-WorkspaceFolder-Name 'VscAppz.WorkspaceFolder.Name')
  - [Uri](#F-VscAppz-WorkspaceFolder-Uri 'VscAppz.WorkspaceFolder.Uri')
- [WorkspaceFolderPickOptions](#T-VscAppz-WorkspaceFolderPickOptions 'VscAppz.WorkspaceFolderPickOptions')
  - [IgnoreFocusOut](#F-VscAppz-WorkspaceFolderPickOptions-IgnoreFocusOut 'VscAppz.WorkspaceFolderPickOptions.IgnoreFocusOut')
  - [PlaceHolder](#F-VscAppz-WorkspaceFolderPickOptions-PlaceHolder 'VscAppz.WorkspaceFolderPickOptions.PlaceHolder')

<a name='T-VscAppz-Cancel'></a>
## Cancel `type`

##### Namespace

VscAppz

##### Summary

Allows belated cancellation of ongoing / already-initiated interactions.

<a name='M-VscAppz-Cancel-In-System-TimeSpan-'></a>
### In(fromNow) `method`

##### Summary

Cancel.In returns a new `Cancel` with its `Now` already scheduled to be called in `fromNow` duration.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fromNow | [System.TimeSpan](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.TimeSpan 'System.TimeSpan') |  |

<a name='M-VscAppz-Cancel-Now'></a>
### Now() `method`

##### Summary

Cancel.Now signals cancellation to the counterparty.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-Disposable'></a>
## Disposable `type`

##### Namespace

VscAppz

##### Summary

Disposable represents an non-transient object identity lifetimed at the counterparty.

<a name='M-VscAppz-Disposable-Dispose'></a>
### Dispose() `method`

##### Summary

Dispose signals to the counterparty to destroy the object.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-IVscode'></a>
## IVscode `type`

##### Namespace

VscAppz

##### Summary

Type Definition for Visual Studio Code 1.38 Extension API
See https://code.visualstudio.com/api for more information

<a name='P-VscAppz-IVscode-Window'></a>
### Window `property`

##### Summary

Namespace for dealing with the current window of the editor. That is visible
and active editors, as well as, UI elements to show messages, selections, and
asking for user input.

<a name='T-VscAppz-IWindow'></a>
## IWindow `type`

##### Namespace

VscAppz

##### Summary

Namespace for dealing with the current window of the editor. That is visible
and active editors, as well as, UI elements to show messages, selections, and
asking for user input.

<a name='M-VscAppz-IWindow-OnDidChangeWindowState-System-Action{VscAppz-WindowState},System-Action{VscAppz-Disposable}-'></a>
### OnDidChangeWindowState() `method`

##### Summary

An [event](#Event) which fires when the focus state of the current window
changes. The value of the event represents whether the window is focused.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IWindow-SetStatusBarMessage-System-String,System-Int32,System-Action{VscAppz-Disposable}-'></a>
### SetStatusBarMessage(text,hideAfterTimeout,andThen) `method`

##### Summary

Set a message to the status bar. This is a short hand for the more powerful
status bar [items](#window.createStatusBarItem).

`text` ── The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text).

`hideAfterTimeout` ── Timeout in milliseconds after which the message will be disposed.

`andThen` ── A disposable which hides the status bar message.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| text | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text). |
| hideAfterTimeout | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Timeout in milliseconds after which the message will be disposed. |
| andThen | [System.Action{VscAppz.Disposable}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.Disposable}') | A disposable which hides the status bar message. |

<a name='M-VscAppz-IWindow-SetStatusBarMessage-System-String,System-Action{VscAppz-Disposable}-'></a>
### SetStatusBarMessage(text,andThen) `method`

##### Summary

Set a message to the status bar. This is a short hand for the more powerful
status bar [items](#window.createStatusBarItem).

*Note* that status bar messages stack and that they must be disposed when no
longer used.

`text` ── The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text).

`andThen` ── A disposable which hides the status bar message.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| text | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show, supports icon substitution as in status bar [items](#StatusBarItem.text). |
| andThen | [System.Action{VscAppz.Disposable}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.Disposable}') | A disposable which hides the status bar message. |

<a name='M-VscAppz-IWindow-ShowErrorMessage-System-String,System-String[],System-Action{System-String}-'></a>
### ShowErrorMessage(message,items,andThen) `method`

##### Summary

Show an error message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}-'></a>
### ShowErrorMessage(message,options,items,andThen) `method`

##### Summary

Show an error message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowErrorMessage(message,items,andThen) `method`

##### Summary

Show an error message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowErrorMessage(message,options,items,andThen) `method`

##### Summary

Show an error message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInformationMessage-System-String,System-String[],System-Action{System-String}-'></a>
### ShowInformationMessage(message,items,andThen) `method`

##### Summary

Show an information message to users. Optionally provide an array of items which will be presented as
clickable buttons.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}-'></a>
### ShowInformationMessage(message,options,items,andThen) `method`

##### Summary

Show an information message to users. Optionally provide an array of items which will be presented as
clickable buttons.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowInformationMessage(message,items,andThen) `method`

##### Summary

Show an information message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowInformationMessage(message,options,items,andThen) `method`

##### Summary

Show an information message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInputBox-VscAppz-InputBoxOptions,VscAppz-Cancel,System-Action{System-String}-'></a>
### ShowInputBox(options,token,andThen) `method`

##### Summary

Opens an input box to ask the user for input.

The returned value will be `undefined` if the input box was canceled (e.g. pressing ESC). Otherwise the
returned value will be the string typed by the user or an empty string if the user did not type
anything but dismissed the input box with OK.

`options` ── Configures the behavior of the input box.

`token` ── A token that can be used to signal cancellation.

`andThen` ── A promise that resolves to a string the user provided or to `undefined` in case of dismissal.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.InputBoxOptions](#T-VscAppz-InputBoxOptions 'VscAppz.InputBoxOptions') | Configures the behavior of the input box. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A promise that resolves to a string the user provided or to `undefined` in case of dismissal. |

<a name='M-VscAppz-IWindow-ShowOpenDialog-VscAppz-OpenDialogOptions,System-Action{System-String[]}-'></a>
### ShowOpenDialog(options,andThen) `method`

##### Summary

Shows a file open dialog to the user which allows to select a file
for opening-purposes.

`options` ── Options that control the dialog.

`andThen` ── A promise that resolves to the selected resources or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.OpenDialogOptions](#T-VscAppz-OpenDialogOptions 'VscAppz.OpenDialogOptions') | Options that control the dialog. |
| andThen | [System.Action{System.String[]}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String[]}') | A promise that resolves to the selected resources or `undefined`. |

<a name='M-VscAppz-IWindow-ShowQuickPick-System-String[],VscAppz-QuickPickOptions,VscAppz-Cancel,System-Action{System-String[]}-'></a>
### ShowQuickPick(items,options,token,andThen) `method`

##### Summary

Shows a selection list allowing multiple selections.

`items` ── An array of strings, or a promise that resolves to an array of strings.

`options` ── Configures the behavior of the selection list.

`token` ── A token that can be used to signal cancellation.

`andThen` ── A promise that resolves to the selected items or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | An array of strings, or a promise that resolves to an array of strings. |
| options | [VscAppz.QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions') | Configures the behavior of the selection list. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |
| andThen | [System.Action{System.String[]}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String[]}') | A promise that resolves to the selected items or `undefined`. |

<a name='M-VscAppz-IWindow-ShowQuickPick-System-String[],VscAppz-QuickPickOptions,VscAppz-Cancel,System-Action{System-String}-'></a>
### ShowQuickPick(items,options,token,andThen) `method`

##### Summary

Shows a selection list.

`items` ── An array of strings, or a promise that resolves to an array of strings.

`options` ── Configures the behavior of the selection list.

`token` ── A token that can be used to signal cancellation.

`andThen` ── A promise that resolves to the selection or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | An array of strings, or a promise that resolves to an array of strings. |
| options | [VscAppz.QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions') | Configures the behavior of the selection list. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A promise that resolves to the selection or `undefined`. |

<a name='M-VscAppz-IWindow-ShowQuickPick-VscAppz-QuickPickItem[],VscAppz-QuickPickOptions,VscAppz-Cancel,System-Action{VscAppz-QuickPickItem[]}-'></a>
### ShowQuickPick(items,options,token,andThen) `method`

##### Summary

Shows a selection list allowing multiple selections.

`items` ── An array of items, or a promise that resolves to an array of items.

`options` ── Configures the behavior of the selection list.

`token` ── A token that can be used to signal cancellation.

`andThen` ── A promise that resolves to the selected items or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| items | [VscAppz.QuickPickItem[]](#T-VscAppz-QuickPickItem[] 'VscAppz.QuickPickItem[]') | An array of items, or a promise that resolves to an array of items. |
| options | [VscAppz.QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions') | Configures the behavior of the selection list. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |
| andThen | [System.Action{VscAppz.QuickPickItem[]}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.QuickPickItem[]}') | A promise that resolves to the selected items or `undefined`. |

<a name='M-VscAppz-IWindow-ShowQuickPick-VscAppz-QuickPickItem[],VscAppz-QuickPickOptions,VscAppz-Cancel,System-Action{VscAppz-QuickPickItem}-'></a>
### ShowQuickPick(items,options,token,andThen) `method`

##### Summary

Shows a selection list.

`items` ── An array of items, or a promise that resolves to an array of items.

`options` ── Configures the behavior of the selection list.

`token` ── A token that can be used to signal cancellation.

`andThen` ── A promise that resolves to the selected item or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| items | [VscAppz.QuickPickItem[]](#T-VscAppz-QuickPickItem[] 'VscAppz.QuickPickItem[]') | An array of items, or a promise that resolves to an array of items. |
| options | [VscAppz.QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions') | Configures the behavior of the selection list. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |
| andThen | [System.Action{VscAppz.QuickPickItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.QuickPickItem}') | A promise that resolves to the selected item or `undefined`. |

<a name='M-VscAppz-IWindow-ShowSaveDialog-VscAppz-SaveDialogOptions,System-Action{System-String}-'></a>
### ShowSaveDialog(options,andThen) `method`

##### Summary

Shows a file save dialog to the user which allows to select a file
for saving-purposes.

`options` ── Options that control the dialog.

`andThen` ── A promise that resolves to the selected resource or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.SaveDialogOptions](#T-VscAppz-SaveDialogOptions 'VscAppz.SaveDialogOptions') | Options that control the dialog. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A promise that resolves to the selected resource or `undefined`. |

<a name='M-VscAppz-IWindow-ShowWarningMessage-System-String,System-String[],System-Action{System-String}-'></a>
### ShowWarningMessage(message,items,andThen) `method`

##### Summary

Show a warning message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}-'></a>
### ShowWarningMessage(message,options,items,andThen) `method`

##### Summary

Show a warning message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowWarningMessage(message,items,andThen) `method`

##### Summary

Show a warning message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowWarningMessage(message,options,items,andThen) `method`

##### Summary

Show a warning message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or `undefined` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowWorkspaceFolderPick-VscAppz-WorkspaceFolderPickOptions,System-Action{VscAppz-WorkspaceFolder}-'></a>
### ShowWorkspaceFolderPick(options,andThen) `method`

##### Summary

Shows a selection list of [workspace folders](#workspace.workspaceFolders) to pick from.
Returns `undefined` if no folder is open.

`options` ── Configures the behavior of the workspace folder list.

`andThen` ── A promise that resolves to the workspace folder or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.WorkspaceFolderPickOptions](#T-VscAppz-WorkspaceFolderPickOptions 'VscAppz.WorkspaceFolderPickOptions') | Configures the behavior of the workspace folder list. |
| andThen | [System.Action{VscAppz.WorkspaceFolder}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.WorkspaceFolder}') | A promise that resolves to the workspace folder or `undefined`. |

<a name='M-VscAppz-IWindow-State-System-Action{VscAppz-WindowState}-'></a>
### State() `method`

##### Summary

Represents the current window's state.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-InputBoxOptions'></a>
## InputBoxOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behavior of the input box UI.

<a name='F-VscAppz-InputBoxOptions-IgnoreFocusOut'></a>
### IgnoreFocusOut `constants`

##### Summary

Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.

<a name='F-VscAppz-InputBoxOptions-Password'></a>
### Password `constants`

##### Summary

Set to `true` to show a password prompt that will not show the typed value.

<a name='F-VscAppz-InputBoxOptions-PlaceHolder'></a>
### PlaceHolder `constants`

##### Summary

An optional string to show as place holder in the input box to guide the user what to type.

<a name='F-VscAppz-InputBoxOptions-Prompt'></a>
### Prompt `constants`

##### Summary

The text to display underneath the input box.

<a name='F-VscAppz-InputBoxOptions-ValidateInput'></a>
### ValidateInput `constants`

##### Summary

An optional function that will be called to validate input and to give a hint
to the user.

`value` ── The current value of the input box.

`return` ── A human readable string which is presented as diagnostic message.
Return `undefined`, `null`, or the empty string when 'value' is valid.

<a name='F-VscAppz-InputBoxOptions-ValidateInput_AppzFuncId'></a>
### ValidateInput_AppzFuncId `constants`

##### Summary

For internal runtime use only.

<a name='F-VscAppz-InputBoxOptions-Value'></a>
### Value `constants`

##### Summary

The value to prefill in the input box.

<a name='F-VscAppz-InputBoxOptions-ValueSelection'></a>
### ValueSelection `constants`

##### Summary

Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
word will be selected, when empty (start equals end) only the cursor will be set,
otherwise the defined range will be selected.

<a name='T-VscAppz-MessageItem'></a>
## MessageItem `type`

##### Namespace

VscAppz

##### Summary

Represents an action that is shown with an information, warning, or
error message.

<a name='F-VscAppz-MessageItem-IsCloseAffordance'></a>
### IsCloseAffordance `constants`

##### Summary

A hint for modal dialogs that the item should be triggered
when the user cancels the dialog (e.g. by pressing the ESC
key).

Note: this option is ignored for non-modal messages.

<a name='F-VscAppz-MessageItem-My'></a>
### My `constants`

##### Summary

Free-form custom data, preserved across a roundtrip.

<a name='F-VscAppz-MessageItem-Title'></a>
### Title `constants`

##### Summary

A short title like 'Retry', 'Open Log' etc.

<a name='T-VscAppz-MessageOptions'></a>
## MessageOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behavior of the message.

<a name='F-VscAppz-MessageOptions-Modal'></a>
### Modal `constants`

##### Summary

Indicates that this message should be modal.

<a name='T-VscAppz-OpenDialogOptions'></a>
## OpenDialogOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behaviour of a file open dialog.

* Note 1: A dialog can select files, folders, or both. This is not true for Windows
which enforces to open either files or folder, but *not both*.
* Note 2: Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
and the editor then silently adjusts the options to select files.

<a name='F-VscAppz-OpenDialogOptions-CanSelectFiles'></a>
### CanSelectFiles `constants`

##### Summary

Allow to select files, defaults to `true`.

<a name='F-VscAppz-OpenDialogOptions-CanSelectFolders'></a>
### CanSelectFolders `constants`

##### Summary

Allow to select folders, defaults to `false`.

<a name='F-VscAppz-OpenDialogOptions-CanSelectMany'></a>
### CanSelectMany `constants`

##### Summary

Allow to select many files or folders.

<a name='F-VscAppz-OpenDialogOptions-Filters'></a>
### Filters `constants`

##### Summary

A set of file filters that are used by the dialog. Each entry is a human readable label,
like "TypeScript", and an array of extensions, e.g.
```ts
{
 	'Images': ['png', 'jpg']
 	'TypeScript': ['ts', 'tsx']
}
```

<a name='F-VscAppz-OpenDialogOptions-OpenLabel'></a>
### OpenLabel `constants`

##### Summary

A human-readable string for the open button.

<a name='T-VscAppz-QuickPickItem'></a>
## QuickPickItem `type`

##### Namespace

VscAppz

##### Summary

Represents an item that can be selected from
a list of items.

<a name='F-VscAppz-QuickPickItem-AlwaysShow'></a>
### AlwaysShow `constants`

##### Summary

Always show this item.

<a name='F-VscAppz-QuickPickItem-Description'></a>
### Description `constants`

##### Summary

A human readable string which is rendered less prominent.

<a name='F-VscAppz-QuickPickItem-Detail'></a>
### Detail `constants`

##### Summary

A human readable string which is rendered less prominent.

<a name='F-VscAppz-QuickPickItem-Label'></a>
### Label `constants`

##### Summary

A human readable string which is rendered prominent.

<a name='F-VscAppz-QuickPickItem-My'></a>
### My `constants`

##### Summary

Free-form custom data, preserved across a roundtrip.

<a name='F-VscAppz-QuickPickItem-Picked'></a>
### Picked `constants`

##### Summary

Optional flag indicating if this item is picked initially.
(Only honored when the picker allows multiple selections.)

<a name='T-VscAppz-QuickPickOptions'></a>
## QuickPickOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behavior of the quick pick UI.

<a name='F-VscAppz-QuickPickOptions-CanPickMany'></a>
### CanPickMany `constants`

##### Summary

An optional flag to make the picker accept multiple selections, if true the result is an array of picks.

<a name='F-VscAppz-QuickPickOptions-IgnoreFocusOut'></a>
### IgnoreFocusOut `constants`

##### Summary

Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.

<a name='F-VscAppz-QuickPickOptions-MatchOnDescription'></a>
### MatchOnDescription `constants`

##### Summary

An optional flag to include the description when filtering the picks.

<a name='F-VscAppz-QuickPickOptions-MatchOnDetail'></a>
### MatchOnDetail `constants`

##### Summary

An optional flag to include the detail when filtering the picks.

<a name='F-VscAppz-QuickPickOptions-OnDidSelectItem'></a>
### OnDidSelectItem `constants`

##### Summary

An optional function that is invoked whenever an item is selected.

<a name='F-VscAppz-QuickPickOptions-OnDidSelectItem_AppzFuncId'></a>
### OnDidSelectItem_AppzFuncId `constants`

##### Summary

For internal runtime use only.

<a name='F-VscAppz-QuickPickOptions-PlaceHolder'></a>
### PlaceHolder `constants`

##### Summary

An optional string to show as place holder in the input box to guide the user what to pick on.

<a name='T-VscAppz-SaveDialogOptions'></a>
## SaveDialogOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behaviour of a file save dialog.

<a name='F-VscAppz-SaveDialogOptions-Filters'></a>
### Filters `constants`

##### Summary

A set of file filters that are used by the dialog. Each entry is a human readable label,
like "TypeScript", and an array of extensions, e.g.
```ts
{
 	'Images': ['png', 'jpg']
 	'TypeScript': ['ts', 'tsx']
}
```

<a name='F-VscAppz-SaveDialogOptions-SaveLabel'></a>
### SaveLabel `constants`

##### Summary

A human-readable string for the save button.

<a name='T-VscAppz-Vsc'></a>
## Vsc `type`

##### Namespace

VscAppz

##### Summary

Everything related to the running of your app.

<a name='F-VscAppz-Vsc-OnError'></a>
### OnError `constants`

##### Summary

Reports problems during the ongoing forever-looping stdin/stdout communication
 with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `null`.
 Any of its args must be checked for `null`-ness by the `OnError` handler.

 `IVscode self`── the caller that encountered the problem being reported.

 `object err` ── if an `Exception`, it occurred on the C# side (I/O or JSON), else some JSON-decoded C# value from whatever was transmitted as the problem data (if anything) by VS Code.

 `object jsonMsg` ─ if a `string`, the incoming JSON message; if a `Dictionary<string, object>`, the outgoing one.

<a name='F-VscAppz-Vsc-OnErrorDefaultOutputFormat'></a>
### OnErrorDefaultOutputFormat `constants`

##### Summary

Used by the default `OnError` handler to print error details to stderr (aka. `Console.Error`).

<a name='M-VscAppz-Vsc-InOut-System-IO-TextReader,System-IO-TextWriter-'></a>
### InOut(stdIn,stdOut) `method`

##### Summary

Returns an `IVscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `Console.In` and `stdOut` defaulting to `Console.Out`). Communication only begins its forever loop upon the first method invocation (which consequently never `return`s) on any of the `interface`s offered by the returned `IVscode`'s members.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| stdIn | [System.IO.TextReader](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.TextReader 'System.IO.TextReader') | If `null`, defaults to `Console.In`. |
| stdOut | [System.IO.TextWriter](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.TextWriter 'System.IO.TextWriter') | If `null`, defaults to `Console.Out` |

<a name='T-VscAppz-WindowState'></a>
## WindowState `type`

##### Namespace

VscAppz

##### Summary

Represents the state of a window.

<a name='F-VscAppz-WindowState-Focused'></a>
### Focused `constants`

##### Summary

Whether the current window is focused.

<a name='T-VscAppz-WorkspaceFolder'></a>
## WorkspaceFolder `type`

##### Namespace

VscAppz

##### Summary

A workspace folder is one of potentially many roots opened by the editor. All workspace folders
are equal which means there is no notion of an active or master workspace folder.

<a name='F-VscAppz-WorkspaceFolder-Index'></a>
### Index `constants`

##### Summary

The ordinal number of this workspace folder.

<a name='F-VscAppz-WorkspaceFolder-Name'></a>
### Name `constants`

##### Summary

The name of this workspace folder. Defaults to
the basename of its [uri-path](#Uri.path)

<a name='F-VscAppz-WorkspaceFolder-Uri'></a>
### Uri `constants`

##### Summary

The associated uri for this workspace folder.

*Note:* The [Uri](#Uri)-type was intentionally chosen such that future releases of the editor can support
workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.

<a name='T-VscAppz-WorkspaceFolderPickOptions'></a>
## WorkspaceFolderPickOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behaviour of the [workspace folder](#WorkspaceFolder) pick UI.

<a name='F-VscAppz-WorkspaceFolderPickOptions-IgnoreFocusOut'></a>
### IgnoreFocusOut `constants`

##### Summary

Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.

<a name='F-VscAppz-WorkspaceFolderPickOptions-PlaceHolder'></a>
### PlaceHolder `constants`

##### Summary

An optional string to show as place holder in the input box to guide the user what to pick on.
