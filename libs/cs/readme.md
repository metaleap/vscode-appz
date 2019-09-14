<a name='assembly'></a>
# vscode-appz

## Contents

- [IVscode](#T-VscAppz-IVscode 'VscAppz.IVscode')
  - [Window](#P-VscAppz-IVscode-Window 'VscAppz.IVscode.Window')
- [IWindow](#T-VscAppz-IWindow 'VscAppz.IWindow')
  - [ShowErrorMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowErrorMessage-System-String,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowErrorMessage(System.String,System.String[],System.Action{System.String})')
  - [ShowErrorMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowErrorMessage(System.String,VscAppz.MessageOptions,System.String[],System.Action{System.String})')
  - [ShowErrorMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowErrorMessage(System.String,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowErrorMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowErrorMessage(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowInformationMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowInformationMessage-System-String,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowInformationMessage(System.String,System.String[],System.Action{System.String})')
  - [ShowInformationMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowInformationMessage(System.String,VscAppz.MessageOptions,System.String[],System.Action{System.String})')
  - [ShowInformationMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowInformationMessage(System.String,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowInformationMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowInformationMessage(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowInputBox(options,andThen)](#M-VscAppz-IWindow-ShowInputBox-VscAppz-InputBoxOptions,System-Action{System-String}- 'VscAppz.IWindow.ShowInputBox(VscAppz.InputBoxOptions,System.Action{System.String})')
  - [ShowWarningMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowWarningMessage-System-String,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowWarningMessage(System.String,System.String[],System.Action{System.String})')
  - [ShowWarningMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}- 'VscAppz.IWindow.ShowWarningMessage(System.String,VscAppz.MessageOptions,System.String[],System.Action{System.String})')
  - [ShowWarningMessage(message,items,andThen)](#M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowWarningMessage(System.String,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
  - [ShowWarningMessage(message,options,items,andThen)](#M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}- 'VscAppz.IWindow.ShowWarningMessage(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[],System.Action{VscAppz.MessageItem})')
- [InputBoxOptions](#T-VscAppz-InputBoxOptions 'VscAppz.InputBoxOptions')
  - [#ctor()](#M-VscAppz-InputBoxOptions-#ctor 'VscAppz.InputBoxOptions.#ctor')
  - [#ctor(value,valueSelection,prompt,placeHolder,password,ignoreFocusOut,validateInput)](#M-VscAppz-InputBoxOptions-#ctor-System-String,System-ValueTuple{System-Int32,System-Int32},System-String,System-String,System-Boolean,System-Boolean,System-Func{System-String,System-String}- 'VscAppz.InputBoxOptions.#ctor(System.String,System.ValueTuple{System.Int32,System.Int32},System.String,System.String,System.Boolean,System.Boolean,System.Func{System.String,System.String})')
  - [IgnoreFocusOut](#F-VscAppz-InputBoxOptions-IgnoreFocusOut 'VscAppz.InputBoxOptions.IgnoreFocusOut')
  - [Password](#F-VscAppz-InputBoxOptions-Password 'VscAppz.InputBoxOptions.Password')
  - [PlaceHolder](#F-VscAppz-InputBoxOptions-PlaceHolder 'VscAppz.InputBoxOptions.PlaceHolder')
  - [Prompt](#F-VscAppz-InputBoxOptions-Prompt 'VscAppz.InputBoxOptions.Prompt')
  - [ValidateInput](#F-VscAppz-InputBoxOptions-ValidateInput 'VscAppz.InputBoxOptions.ValidateInput')
  - [ValidateInput_AppzFuncId](#F-VscAppz-InputBoxOptions-ValidateInput_AppzFuncId 'VscAppz.InputBoxOptions.ValidateInput_AppzFuncId')
  - [Value](#F-VscAppz-InputBoxOptions-Value 'VscAppz.InputBoxOptions.Value')
  - [ValueSelection](#F-VscAppz-InputBoxOptions-ValueSelection 'VscAppz.InputBoxOptions.ValueSelection')
- [MessageItem](#T-VscAppz-MessageItem 'VscAppz.MessageItem')
  - [#ctor()](#M-VscAppz-MessageItem-#ctor 'VscAppz.MessageItem.#ctor')
  - [#ctor(title,isCloseAffordance,my)](#M-VscAppz-MessageItem-#ctor-System-String,System-Boolean,System-Collections-Generic-Dictionary{System-String,System-Object}- 'VscAppz.MessageItem.#ctor(System.String,System.Boolean,System.Collections.Generic.Dictionary{System.String,System.Object})')
  - [IsCloseAffordance](#F-VscAppz-MessageItem-IsCloseAffordance 'VscAppz.MessageItem.IsCloseAffordance')
  - [My](#F-VscAppz-MessageItem-My 'VscAppz.MessageItem.My')
  - [Title](#F-VscAppz-MessageItem-Title 'VscAppz.MessageItem.Title')
- [MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions')
  - [#ctor()](#M-VscAppz-MessageOptions-#ctor 'VscAppz.MessageOptions.#ctor')
  - [#ctor(modal)](#M-VscAppz-MessageOptions-#ctor-System-Boolean- 'VscAppz.MessageOptions.#ctor(System.Boolean)')
  - [Modal](#F-VscAppz-MessageOptions-Modal 'VscAppz.MessageOptions.Modal')
- [Vsc](#T-VscAppz-Vsc 'VscAppz.Vsc')
  - [OnError](#F-VscAppz-Vsc-OnError 'VscAppz.Vsc.OnError')
  - [OnErrorDefaultOutputFormat](#F-VscAppz-Vsc-OnErrorDefaultOutputFormat 'VscAppz.Vsc.OnErrorDefaultOutputFormat')
  - [InOut(stdIn,stdOut)](#M-VscAppz-Vsc-InOut-System-IO-TextReader,System-IO-TextWriter- 'VscAppz.Vsc.InOut(System.IO.TextReader,System.IO.TextWriter)')

<a name='T-VscAppz-IVscode'></a>
## IVscode `type`

##### Namespace

VscAppz

##### Summary

Type Definition for Visual Studio Code 1.37 Extension API
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

<a name='M-VscAppz-IWindow-ShowErrorMessage-System-String,System-String[],System-Action{System-String}-'></a>
### ShowErrorMessage(message,items,andThen) `method`

##### Summary

Show an error message.

\`message\` ── The message to show.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}-'></a>
### ShowErrorMessage(message,options,items,andThen) `method`

##### Summary

Show an error message.

\`message\` ── The message to show.

\`options\` ── Configures the behaviour of the message.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowErrorMessage(message,items,andThen) `method`

##### Summary

Show an error message.

\`message\` ── The message to show.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowErrorMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowErrorMessage(message,options,items,andThen) `method`

##### Summary

Show an error message.

\`message\` ── The message to show.

\`options\` ── Configures the behaviour of the message.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInformationMessage-System-String,System-String[],System-Action{System-String}-'></a>
### ShowInformationMessage(message,items,andThen) `method`

##### Summary

Show an information message to users. Optionally provide an array of items which will be presented as
clickable buttons.

\`message\` ── The message to show.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}-'></a>
### ShowInformationMessage(message,options,items,andThen) `method`

##### Summary

Show an information message to users. Optionally provide an array of items which will be presented as
clickable buttons.

\`message\` ── The message to show.

\`options\` ── Configures the behaviour of the message.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowInformationMessage(message,items,andThen) `method`

##### Summary

Show an information message.

\`message\` ── The message to show.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInformationMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowInformationMessage(message,options,items,andThen) `method`

##### Summary

Show an information message.

\`message\` ── The message to show.

\`options\` ── Configures the behaviour of the message.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowInputBox-VscAppz-InputBoxOptions,System-Action{System-String}-'></a>
### ShowInputBox(options,andThen) `method`

##### Summary

Opens an input box to ask the user for input.

The returned value will be \`undefined\` if the input box was canceled (e.g. pressing ESC). Otherwise the
returned value will be the string typed by the user or an empty string if the user did not type
anything but dismissed the input box with OK.

\`options\` ── Configures the behavior of the input box.

\`andThen\` ── A promise that resolves to a string the user provided or to \`undefined\` in case of dismissal.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.InputBoxOptions](#T-VscAppz-InputBoxOptions 'VscAppz.InputBoxOptions') | Configures the behavior of the input box. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A promise that resolves to a string the user provided or to \`undefined\` in case of dismissal. |

<a name='M-VscAppz-IWindow-ShowWarningMessage-System-String,System-String[],System-Action{System-String}-'></a>
### ShowWarningMessage(message,items,andThen) `method`

##### Summary

Show a warning message.

\`message\` ── The message to show.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageOptions,System-String[],System-Action{System-String}-'></a>
### ShowWarningMessage(message,options,items,andThen) `method`

##### Summary

Show a warning message.

\`message\` ── The message to show.

\`options\` ── Configures the behaviour of the message.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{System.String}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowWarningMessage(message,items,andThen) `method`

##### Summary

Show a warning message.

\`message\` ── The message to show.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='M-VscAppz-IWindow-ShowWarningMessage-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[],System-Action{VscAppz-MessageItem}-'></a>
### ShowWarningMessage(message,options,items,andThen) `method`

##### Summary

Show a warning message.

\`message\` ── The message to show.

\`options\` ── Configures the behaviour of the message.

\`items\` ── A set of items that will be rendered as actions in the message.

\`andThen\` ── A thenable that resolves to the selected item or \`undefined\` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |
| andThen | [System.Action{VscAppz.MessageItem}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.MessageItem}') | A thenable that resolves to the selected item or \`undefined\` when being dismissed. |

<a name='T-VscAppz-InputBoxOptions'></a>
## InputBoxOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behavior of the input box UI.

<a name='M-VscAppz-InputBoxOptions-#ctor'></a>
### #ctor() `constructor`

##### Summary

Options to configure the behavior of the input box UI.

##### Parameters

This constructor has no parameters.

<a name='M-VscAppz-InputBoxOptions-#ctor-System-String,System-ValueTuple{System-Int32,System-Int32},System-String,System-String,System-Boolean,System-Boolean,System-Func{System-String,System-String}-'></a>
### #ctor(value,valueSelection,prompt,placeHolder,password,ignoreFocusOut,validateInput) `constructor`

##### Summary

Options to configure the behavior of the input box UI.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The value to prefill in the input box. |
| valueSelection | [System.ValueTuple{System.Int32,System.Int32}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.ValueTuple 'System.ValueTuple{System.Int32,System.Int32}') | Selection of the prefilled [\`value\`](#InputBoxOptions.value). Defined as tuple of two number where the
first is the inclusive start index and the second the exclusive end index. When \`undefined\` the whole
word will be selected, when empty (start equals end) only the cursor will be set,
otherwise the defined range will be selected. |
| prompt | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The text to display underneath the input box. |
| placeHolder | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | An optional string to show as place holder in the input box to guide the user what to type. |
| password | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | Set to \`true\` to show a password prompt that will not show the typed value. |
| ignoreFocusOut | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | Set to \`true\` to keep the input box open when focus moves to another part of the editor or to another window. |
| validateInput | [System.Func{System.String,System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Func 'System.Func{System.String,System.String}') | An optional function that will be called to validate input and to give a hint
to the user.

\`value\` ── The current value of the input box.

\`return\` ── A human readable string which is presented as diagnostic message.
Return \`undefined\`, \`null\`, or the empty string when 'value' is valid. |

<a name='F-VscAppz-InputBoxOptions-IgnoreFocusOut'></a>
### IgnoreFocusOut `constants`

##### Summary

Set to \`true\` to keep the input box open when focus moves to another part of the editor or to another window.

<a name='F-VscAppz-InputBoxOptions-Password'></a>
### Password `constants`

##### Summary

Set to \`true\` to show a password prompt that will not show the typed value.

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

\`value\` ── The current value of the input box.

\`return\` ── A human readable string which is presented as diagnostic message.
Return \`undefined\`, \`null\`, or the empty string when 'value' is valid.

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

Selection of the prefilled [\`value\`](#InputBoxOptions.value). Defined as tuple of two number where the
first is the inclusive start index and the second the exclusive end index. When \`undefined\` the whole
word will be selected, when empty (start equals end) only the cursor will be set,
otherwise the defined range will be selected.

<a name='T-VscAppz-MessageItem'></a>
## MessageItem `type`

##### Namespace

VscAppz

##### Summary

Represents an action that is shown with an information, warning, or
error message.

<a name='M-VscAppz-MessageItem-#ctor'></a>
### #ctor() `constructor`

##### Summary

Represents an action that is shown with an information, warning, or
error message.

##### Parameters

This constructor has no parameters.

<a name='M-VscAppz-MessageItem-#ctor-System-String,System-Boolean,System-Collections-Generic-Dictionary{System-String,System-Object}-'></a>
### #ctor(title,isCloseAffordance,my) `constructor`

##### Summary

Represents an action that is shown with an information, warning, or
error message.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| title | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | A short title like 'Retry', 'Open Log' etc. |
| isCloseAffordance | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | A hint for modal dialogs that the item should be triggered
when the user cancels the dialog (e.g. by pressing the ESC
key).

Note: this option is ignored for non-modal messages. |
| my | [System.Collections.Generic.Dictionary{System.String,System.Object}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Collections.Generic.Dictionary 'System.Collections.Generic.Dictionary{System.String,System.Object}') | Free-form custom data, preserved across a roundtrip. |

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

<a name='M-VscAppz-MessageOptions-#ctor'></a>
### #ctor() `constructor`

##### Summary

Options to configure the behavior of the message.

##### Parameters

This constructor has no parameters.

<a name='M-VscAppz-MessageOptions-#ctor-System-Boolean-'></a>
### #ctor(modal) `constructor`

##### Summary

Options to configure the behavior of the message.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| modal | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | Indicates that this message should be modal. |

<a name='F-VscAppz-MessageOptions-Modal'></a>
### Modal `constants`

##### Summary

Indicates that this message should be modal.

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
 with the \`vscode-appz\` VSC extension. Defaults to a stderr println. Must not be \`null\`.

 \`self\`── the caller, an \`IVscode\` instance that encountered the problem being reported.

 \`err\` ── if an \`Exception\`, it occurred on the C# side (I/O or JSON), else some JSON-decoded C# value from whatever was transmitted as the problem data (if anything) by VS Code.

 \`jsonMsg\` ─ if a \`string\`, the incoming JSON message; if a \`Dictionary<string, object>\`, the outgoing one.

<a name='F-VscAppz-Vsc-OnErrorDefaultOutputFormat'></a>
### OnErrorDefaultOutputFormat `constants`

##### Summary

Used by the default \`OnError\` handler to print error details to stderr (aka. \`Console.Error\`).

<a name='M-VscAppz-Vsc-InOut-System-IO-TextReader,System-IO-TextWriter-'></a>
### InOut(stdIn,stdOut) `method`

##### Summary

Returns an \`IVscode\` implementation that communicates via the specified input and output streams (with \`stdIn\` defaulting to \`Console.In\` and \`stdOut\` defaulting to \`Console.Out\`). Communication only begins its forever loop upon the first method invocation (which consequently never \`return\`s) on any of the \`interface\`s offered by the returned \`IVscode\`'s members.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| stdIn | [System.IO.TextReader](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.TextReader 'System.IO.TextReader') | If \`null\`, defaults to \`Console.In\`. |
| stdOut | [System.IO.TextWriter](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.TextWriter 'System.IO.TextWriter') | If \`null\`, defaults to \`Console.Out\` |
