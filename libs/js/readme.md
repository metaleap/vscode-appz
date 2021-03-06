## Index

### External modules

* ["core"](#modules_core_md)
* ["vsc-appz"](#modules_vsc_appz_md)
* ["vscode.gen"](#modules_vscode_gen_md)


<a name="classes_core_cancelmd"></a>


# Class: Cancel

## Hierarchy

* **Cancel**

## Index

### Properties

* [fnId](#fnid)
* [impl](#impl)

### Methods

* [Now](#now)
* [In](#static-in)

## Properties

###  fnId

• **fnId**: *string* = ""

___

###  impl

• **impl**: *[impl](#classes_core_implmd)*

## Methods

###  Now

▸ **Now**(): *void*

**Returns:** *void*

___

### `Static` In

▸ **In**(`msFromNow`: number): *[Cancel](#classes_core_cancelmd)*

**Parameters:**

Name | Type |
------ | ------ |
`msFromNow` | number |

**Returns:** *[Cancel](#classes_core_cancelmd)*


<a name="classes_core_disposablemd"></a>


# Class: Disposable

## Hierarchy

* **Disposable**

## Index

### Properties

* [id](#id)
* [impl](#impl)
* [subFnIds](#subfnids)

### Methods

* [Dispose](#dispose)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [addSub](#addsub)
* [bind](#bind)

## Properties

###  id

• **id**: *string*

___

###  impl

• **impl**: *[impl](#classes_core_implmd)*

___

###  subFnIds

• **subFnIds**: *string[]*

## Methods

###  Dispose

▸ **Dispose**(): *function*

Dispose requests the VSC side to forget about this object and release or destroy all resources associated with or occupied by it. All subsequent usage attempts will be rejected.

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __loadFromJsonish__

▸ **__loadFromJsonish__**(`payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`payload` | any |

**Returns:** *boolean*

___

###  addSub

▸ **addSub**(`fnId`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`fnId` | string |

**Returns:** *void*

___

###  bind

▸ **bind**(`impl`: [impl](#classes_core_implmd), ...`subFnIds`: string[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_core_implmd) |
`...subFnIds` | string[] |

**Returns:** *this*


<a name="classes_core_implmd"></a>


# Class: impl

## Hierarchy

* [impl](#classes_vscode_gen_implmd)

  ↳ **impl**

## Implements

* [Vscode](#interfaces_vscode_gen_vscodemd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [Clipboard](#clipboard)
* [Commands](#commands)
* [Env](#env)
* [Extensions](#extensions)
* [Languages](#languages)
* [Window](#window)
* [Workspace](#workspace)
* [cbListeners](#cblisteners)
* [cbOther](#cbother)
* [cbWaiting](#cbwaiting)
* [counter](#counter)
* [jsonOut](#jsonout)
* [main](#main)
* [readln](#readln)

### Methods

* [nextFuncId](#nextfuncid)
* [nextSub](#nextsub)
* [send](#send)
* [setupReadLn](#setupreadln)
* [toJSON](#tojson)

## Constructors

###  constructor

\+ **new impl**(`main`: function, `stdIn?`: ReadStream, `stdOut?`: WriteStream): *[impl](#classes_core_implmd)*

*Overrides [impl](#classes_vscode_gen_implmd).[constructor](#constructor)*

**Parameters:**

▪ **main**: *function*

▸ (`_`: [Vscode](#interfaces_vscode_gen_vscodemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Vscode](#interfaces_vscode_gen_vscodemd) |

▪`Optional`  **stdIn**: *ReadStream*

▪`Optional`  **stdOut**: *WriteStream*

**Returns:** *[impl](#classes_core_implmd)*

## Properties

###  Clipboard

• **Clipboard**: *[Clipboard](#interfaces_vscode_gen_clipboardmd)*

*Inherited from [impl](#classes_vscode_gen_implmd).[Clipboard](#clipboard)*

___

###  Commands

• **Commands**: *[Commands](#interfaces_vscode_gen_commandsmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Commands](#commands)*

*Inherited from [impl](#classes_vscode_gen_implmd).[Commands](#commands)*

___

###  Env

• **Env**: *[Env](#interfaces_vscode_gen_envmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Env](#env)*

*Inherited from [impl](#classes_vscode_gen_implmd).[Env](#env)*

___

###  Extensions

• **Extensions**: *[Extensions](#interfaces_vscode_gen_extensionsmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Extensions](#extensions)*

*Inherited from [impl](#classes_vscode_gen_implmd).[Extensions](#extensions)*

___

###  Languages

• **Languages**: *[Languages](#interfaces_vscode_gen_languagesmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Languages](#languages)*

*Inherited from [impl](#classes_vscode_gen_implmd).[Languages](#languages)*

___

###  Window

• **Window**: *[Window](#interfaces_vscode_gen_windowmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Window](#window)*

*Inherited from [impl](#classes_vscode_gen_implmd).[Window](#window)*

___

###  Workspace

• **Workspace**: *[Workspace](#interfaces_vscode_gen_workspacemd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Workspace](#workspace)*

*Inherited from [impl](#classes_vscode_gen_implmd).[Workspace](#workspace)*

___

###  cbListeners

• **cbListeners**: *object*

#### Type declaration:

* \[ **_**: *string*\]: function

▸ (`_`: any[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any[] |

___

###  cbOther

• **cbOther**: *object*

#### Type declaration:

* \[ **_**: *string*\]: function

▸ (`_`: any[]): *[any, boolean]*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any[] |

___

###  cbWaiting

• **cbWaiting**: *object*

#### Type declaration:

* \[ **_**: *string*\]: function

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  counter

• **counter**: *number* = 0

___

###  jsonOut

• **jsonOut**: *WriteStream*

___

###  main

• **main**: *function*

#### Type declaration:

▸ (`_`: [Vscode](#interfaces_vscode_gen_vscodemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Vscode](#interfaces_vscode_gen_vscodemd) |

___

###  readln

• **readln**: *ReadStream*

## Methods

###  nextFuncId

▸ **nextFuncId**(): *string*

**Returns:** *string*

___

###  nextSub

▸ **nextSub**(`eitherListener`: function, `orOther`: function): *string*

**Parameters:**

▪ **eitherListener**: *function*

▸ (`_`: any[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any[] |

▪ **orOther**: *function*

▸ (`_`: any[]): *[any, boolean]*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any[] |

**Returns:** *string*

___

###  send

▸ **send**(`msg`: [ipcMsg](#classes_core_ipcmsgmd), `on?`: function): *void*

**Parameters:**

▪ **msg**: *[ipcMsg](#classes_core_ipcmsgmd)*

▪`Optional`  **on**: *function*

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

**Returns:** *void*

___

###  setupReadLn

▸ **setupReadLn**(): *void*

**Returns:** *void*

___

###  toJSON

▸ **toJSON**(): *any*

*Inherited from [impl](#classes_vscode_gen_implmd).[toJSON](#tojson)*

**Returns:** *any*


<a name="classes_core_ipcmsgmd"></a>


# Class: ipcMsg

## Hierarchy

* **ipcMsg**

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [CbId](#cbid)
* [Data](#data)
* [QName](#qname)

### Methods

* [toJSON](#tojson)

## Constructors

###  constructor

\+ **new ipcMsg**(`qName?`: string, `data?`: [dict](#dict), `cbId?`: string): *[ipcMsg](#classes_core_ipcmsgmd)*

**Parameters:**

Name | Type |
------ | ------ |
`qName?` | string |
`data?` | [dict](#dict) |
`cbId?` | string |

**Returns:** *[ipcMsg](#classes_core_ipcmsgmd)*

## Properties

###  CbId

• **CbId**: *string*

___

###  Data

• **Data**: *[dict](#dict)*

___

###  QName

• **QName**: *string*

## Methods

###  toJSON

▸ **toJSON**(): *object*

**Returns:** *object*

* **cbId**: *string* =  this.CbId

* **data**(): *object*

* **qName**: *string* =  this.QName


<a name="classes_vscode_gen_implmd"></a>


# Class: impl

## Hierarchy

* **impl**

  ↳ [impl](#classes_core_implmd)

## Implements

* [Vscode](#interfaces_vscode_gen_vscodemd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [Clipboard](#clipboard)
* [Commands](#commands)
* [Env](#env)
* [Extensions](#extensions)
* [Languages](#languages)
* [Window](#window)
* [Workspace](#workspace)

### Methods

* [toJSON](#tojson)

## Constructors

###  constructor

\+ **new impl**(): *[impl](#classes_vscode_gen_implmd)*

**Returns:** *[impl](#classes_vscode_gen_implmd)*

## Properties

###  Clipboard

• **Clipboard**: *[Clipboard](#interfaces_vscode_gen_clipboardmd)*

___

###  Commands

• **Commands**: *[Commands](#interfaces_vscode_gen_commandsmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Commands](#commands)*

___

###  Env

• **Env**: *[Env](#interfaces_vscode_gen_envmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Env](#env)*

___

###  Extensions

• **Extensions**: *[Extensions](#interfaces_vscode_gen_extensionsmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Extensions](#extensions)*

___

###  Languages

• **Languages**: *[Languages](#interfaces_vscode_gen_languagesmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Languages](#languages)*

___

###  Window

• **Window**: *[Window](#interfaces_vscode_gen_windowmd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Window](#window)*

___

###  Workspace

• **Workspace**: *[Workspace](#interfaces_vscode_gen_workspacemd)*

*Implementation of [Vscode](#interfaces_vscode_gen_vscodemd).[Workspace](#workspace)*

## Methods

###  toJSON

▸ **toJSON**(): *any*

**Returns:** *any*


<a name="classes_vscode_gen_implbasemd"></a>


# Class: implBase

## Hierarchy

* **implBase**

  ↳ [implWindow](#classes_vscode_gen_implwindowmd)

  ↳ [implEnv](#classes_vscode_gen_implenvmd)

  ↳ [implClipboard](#classes_vscode_gen_implclipboardmd)

  ↳ [implWorkspace](#classes_vscode_gen_implworkspacemd)

  ↳ [implLanguages](#classes_vscode_gen_impllanguagesmd)

  ↳ [implExtensions](#classes_vscode_gen_implextensionsmd)

  ↳ [implCommands](#classes_vscode_gen_implcommandsmd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [impl](#impl)

### Methods

* [Impl](#impl)

## Constructors

###  constructor

\+ **new implBase**(`impl`: [impl](#classes_vscode_gen_implmd)): *[implBase](#classes_vscode_gen_implbasemd)*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_vscode_gen_implmd) |

**Returns:** *[implBase](#classes_vscode_gen_implbasemd)*

## Properties

###  impl

• **impl**: *[impl](#classes_vscode_gen_implmd)*

## Methods

###  Impl

▸ **Impl**(): *[impl](#classes_core_implmd)*

**Returns:** *[impl](#classes_core_implmd)*


<a name="classes_vscode_gen_implclipboardmd"></a>


# Class: implClipboard

## Hierarchy

* [implBase](#classes_vscode_gen_implbasemd)

  ↳ **implClipboard**

## Implements

* [Clipboard](#interfaces_vscode_gen_clipboardmd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [impl](#impl)

### Methods

* [Impl](#impl)
* [ReadText](#readtext)
* [WriteText](#writetext)

## Constructors

###  constructor

\+ **new implClipboard**(`impl`: [impl](#classes_vscode_gen_implmd)): *[implClipboard](#classes_vscode_gen_implclipboardmd)*

*Overrides [implBase](#classes_vscode_gen_implbasemd).[constructor](#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_vscode_gen_implmd) |

**Returns:** *[implClipboard](#classes_vscode_gen_implclipboardmd)*

## Properties

###  impl

• **impl**: *[impl](#classes_vscode_gen_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[impl](#impl)*

## Methods

###  Impl

▸ **Impl**(): *[impl](#classes_core_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[Impl](#impl)*

**Returns:** *[impl](#classes_core_implmd)*

___

###  ReadText

▸ **ReadText**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  WriteText

▸ **WriteText**(`value`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*


<a name="classes_vscode_gen_implcommandsmd"></a>


# Class: implCommands

## Hierarchy

* [implBase](#classes_vscode_gen_implbasemd)

  ↳ **implCommands**

## Implements

* [Commands](#interfaces_vscode_gen_commandsmd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [impl](#impl)

### Methods

* [ExecuteCommand](#executecommand)
* [GetCommands](#getcommands)
* [Impl](#impl)
* [RegisterCommand](#registercommand)

## Constructors

###  constructor

\+ **new implCommands**(`impl`: [impl](#classes_vscode_gen_implmd)): *[implCommands](#classes_vscode_gen_implcommandsmd)*

*Overrides [implBase](#classes_vscode_gen_implbasemd).[constructor](#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_vscode_gen_implmd) |

**Returns:** *[implCommands](#classes_vscode_gen_implcommandsmd)*

## Properties

###  impl

• **impl**: *[impl](#classes_vscode_gen_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[impl](#impl)*

## Methods

###  ExecuteCommand

▸ **ExecuteCommand**(`command`: string, `rest`: any[]): *function*

**Parameters:**

Name | Type |
------ | ------ |
`command` | string |
`rest` | any[] |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  GetCommands

▸ **GetCommands**(`filterInternal`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`filterInternal` | boolean |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string[] |

___

###  Impl

▸ **Impl**(): *[impl](#classes_core_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[Impl](#impl)*

**Returns:** *[impl](#classes_core_implmd)*

___

###  RegisterCommand

▸ **RegisterCommand**(`command`: string, `callback`: function): *function*

**Parameters:**

▪ **command**: *string*

▪ **callback**: *function*

▸ (`_`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any[] |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |


<a name="classes_vscode_gen_implenvmd"></a>


# Class: implEnv

## Hierarchy

* [implBase](#classes_vscode_gen_implbasemd)

  ↳ **implEnv**

## Implements

* [Env](#interfaces_vscode_gen_envmd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [impl](#impl)

### Methods

* [AllProperties](#allproperties)
* [AppName](#appname)
* [AppRoot](#approot)
* [Clipboard](#clipboard)
* [Impl](#impl)
* [Language](#language)
* [MachineId](#machineid)
* [OpenExternal](#openexternal)
* [RemoteName](#remotename)
* [SessionId](#sessionid)
* [Shell](#shell)
* [UriScheme](#urischeme)

## Constructors

###  constructor

\+ **new implEnv**(`impl`: [impl](#classes_vscode_gen_implmd)): *[implEnv](#classes_vscode_gen_implenvmd)*

*Overrides [implBase](#classes_vscode_gen_implbasemd).[constructor](#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_vscode_gen_implmd) |

**Returns:** *[implEnv](#classes_vscode_gen_implenvmd)*

## Properties

###  impl

• **impl**: *[impl](#classes_vscode_gen_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[impl](#impl)*

## Methods

###  AllProperties

▸ **AllProperties**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [EnvState](#interfaces_vscode_gen_envstatemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [EnvState](#interfaces_vscode_gen_envstatemd) |

___

###  AppName

▸ **AppName**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  AppRoot

▸ **AppRoot**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  Clipboard

▸ **Clipboard**(): *[Clipboard](#interfaces_vscode_gen_clipboardmd)*

**Returns:** *[Clipboard](#interfaces_vscode_gen_clipboardmd)*

___

###  Impl

▸ **Impl**(): *[impl](#classes_core_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[Impl](#impl)*

**Returns:** *[impl](#classes_core_implmd)*

___

###  Language

▸ **Language**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  MachineId

▸ **MachineId**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  OpenExternal

▸ **OpenExternal**(`target`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`target` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | boolean |

___

###  RemoteName

▸ **RemoteName**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  SessionId

▸ **SessionId**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  Shell

▸ **Shell**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  UriScheme

▸ **UriScheme**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |


<a name="classes_vscode_gen_implextensionsmd"></a>


# Class: implExtensions

## Hierarchy

* [implBase](#classes_vscode_gen_implbasemd)

  ↳ **implExtensions**

## Implements

* [Extensions](#interfaces_vscode_gen_extensionsmd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [impl](#impl)

### Methods

* [Impl](#impl)
* [OnDidChange](#ondidchange)

## Constructors

###  constructor

\+ **new implExtensions**(`impl`: [impl](#classes_vscode_gen_implmd)): *[implExtensions](#classes_vscode_gen_implextensionsmd)*

*Overrides [implBase](#classes_vscode_gen_implbasemd).[constructor](#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_vscode_gen_implmd) |

**Returns:** *[implExtensions](#classes_vscode_gen_implextensionsmd)*

## Properties

###  impl

• **impl**: *[impl](#classes_vscode_gen_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[impl](#impl)*

## Methods

###  Impl

▸ **Impl**(): *[impl](#classes_core_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[Impl](#impl)*

**Returns:** *[impl](#classes_core_implmd)*

___

###  OnDidChange

▸ **OnDidChange**(`listener`: function): *function*

**Parameters:**

▪ **listener**: *function*

▸ (): *void*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |


<a name="classes_vscode_gen_impllanguagesmd"></a>


# Class: implLanguages

## Hierarchy

* [implBase](#classes_vscode_gen_implbasemd)

  ↳ **implLanguages**

## Implements

* [Languages](#interfaces_vscode_gen_languagesmd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [impl](#impl)

### Methods

* [GetLanguages](#getlanguages)
* [Impl](#impl)
* [OnDidChangeDiagnostics](#ondidchangediagnostics)

## Constructors

###  constructor

\+ **new implLanguages**(`impl`: [impl](#classes_vscode_gen_implmd)): *[implLanguages](#classes_vscode_gen_impllanguagesmd)*

*Overrides [implBase](#classes_vscode_gen_implbasemd).[constructor](#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_vscode_gen_implmd) |

**Returns:** *[implLanguages](#classes_vscode_gen_impllanguagesmd)*

## Properties

###  impl

• **impl**: *[impl](#classes_vscode_gen_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[impl](#impl)*

## Methods

###  GetLanguages

▸ **GetLanguages**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string[] |

___

###  Impl

▸ **Impl**(): *[impl](#classes_core_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[Impl](#impl)*

**Returns:** *[impl](#classes_core_implmd)*

___

###  OnDidChangeDiagnostics

▸ **OnDidChangeDiagnostics**(`listener`: function): *function*

**Parameters:**

▪ **listener**: *function*

▸ (`_`: [DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |


<a name="classes_vscode_gen_implwindowmd"></a>


# Class: implWindow

## Hierarchy

* [implBase](#classes_vscode_gen_implbasemd)

  ↳ **implWindow**

## Implements

* [Window](#interfaces_vscode_gen_windowmd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [impl](#impl)

### Methods

* [CreateInputBox](#createinputbox)
* [CreateOutputChannel](#createoutputchannel)
* [CreateQuickPick](#createquickpick)
* [CreateStatusBarItem](#createstatusbaritem)
* [CreateTerminal](#createterminal)
* [Impl](#impl)
* [OnDidChangeWindowState](#ondidchangewindowstate)
* [SetStatusBarMessage](#setstatusbarmessage)
* [ShowErrorMessage](#showerrormessage)
* [ShowInformationMessage](#showinformationmessage)
* [ShowInputBox](#showinputbox)
* [ShowOpenDialog](#showopendialog)
* [ShowQuickPick](#showquickpick)
* [ShowSaveDialog](#showsavedialog)
* [ShowWarningMessage](#showwarningmessage)
* [ShowWorkspaceFolderPick](#showworkspacefolderpick)
* [State](#state)

## Constructors

###  constructor

\+ **new implWindow**(`impl`: [impl](#classes_vscode_gen_implmd)): *[implWindow](#classes_vscode_gen_implwindowmd)*

*Overrides [implBase](#classes_vscode_gen_implbasemd).[constructor](#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_vscode_gen_implmd) |

**Returns:** *[implWindow](#classes_vscode_gen_implwindowmd)*

## Properties

###  impl

• **impl**: *[impl](#classes_vscode_gen_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[impl](#impl)*

## Methods

###  CreateInputBox

▸ **CreateInputBox**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [InputBox](#interfaces_vscode_gen_inputboxmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [InputBox](#interfaces_vscode_gen_inputboxmd) |

___

###  CreateOutputChannel

▸ **CreateOutputChannel**(`name`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |

___

###  CreateQuickPick

▸ **CreateQuickPick**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [QuickPick](#interfaces_vscode_gen_quickpickmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPick](#interfaces_vscode_gen_quickpickmd) |

___

###  CreateStatusBarItem

▸ **CreateStatusBarItem**(`alignment?`: [StatusBarAlignment](#enums_vscode_gen_statusbaralignmentmd), `priority?`: number): *function*

**Parameters:**

Name | Type |
------ | ------ |
`alignment?` | [StatusBarAlignment](#enums_vscode_gen_statusbaralignmentmd) |
`priority?` | number |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd) |

___

###  CreateTerminal

▸ **CreateTerminal**(`options`: [TerminalOptions](#interfaces_vscode_gen_terminaloptionsmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [TerminalOptions](#interfaces_vscode_gen_terminaloptionsmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Terminal](#interfaces_vscode_gen_terminalmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Terminal](#interfaces_vscode_gen_terminalmd) |

___

###  Impl

▸ **Impl**(): *[impl](#classes_core_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[Impl](#impl)*

**Returns:** *[impl](#classes_core_implmd)*

___

###  OnDidChangeWindowState

▸ **OnDidChangeWindowState**(`listener`: function): *function*

**Parameters:**

▪ **listener**: *function*

▸ (`_`: [WindowState](#interfaces_vscode_gen_windowstatemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WindowState](#interfaces_vscode_gen_windowstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  SetStatusBarMessage

▸ **SetStatusBarMessage**(`text`: string, `hideAfterTimeout`: number): *function*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`hideAfterTimeout` | number |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  ShowErrorMessage

▸ **ShowErrorMessage**(`message`: string, `items`: string[]): *function*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`items` | string[] |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowInformationMessage

▸ **ShowInformationMessage**(`message`: string, `items`: string[]): *function*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`items` | string[] |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowInputBox

▸ **ShowInputBox**(`options?`: [InputBoxOptions](#interfaces_vscode_gen_inputboxoptionsmd), `token?`: [Cancel](#classes_core_cancelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [InputBoxOptions](#interfaces_vscode_gen_inputboxoptionsmd) |
`token?` | [Cancel](#classes_core_cancelmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowOpenDialog

▸ **ShowOpenDialog**(`options`: [OpenDialogOptions](#interfaces_vscode_gen_opendialogoptionsmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [OpenDialogOptions](#interfaces_vscode_gen_opendialogoptionsmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string[] |

___

###  ShowQuickPick

▸ **ShowQuickPick**(`items`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[], `options`: [QuickPickOptions](#interfaces_vscode_gen_quickpickoptionsmd), `token?`: [Cancel](#classes_core_cancelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`items` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[] |
`options` | [QuickPickOptions](#interfaces_vscode_gen_quickpickoptionsmd) |
`token?` | [Cancel](#classes_core_cancelmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[] |

___

###  ShowSaveDialog

▸ **ShowSaveDialog**(`options`: [SaveDialogOptions](#interfaces_vscode_gen_savedialogoptionsmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [SaveDialogOptions](#interfaces_vscode_gen_savedialogoptionsmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowWarningMessage

▸ **ShowWarningMessage**(`message`: string, `items`: string[]): *function*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`items` | string[] |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowWorkspaceFolderPick

▸ **ShowWorkspaceFolderPick**(`options?`: [WorkspaceFolderPickOptions](#interfaces_vscode_gen_workspacefolderpickoptionsmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [WorkspaceFolderPickOptions](#interfaces_vscode_gen_workspacefolderpickoptionsmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd) |

___

###  State

▸ **State**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WindowState](#interfaces_vscode_gen_windowstatemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WindowState](#interfaces_vscode_gen_windowstatemd) |


<a name="classes_vscode_gen_implworkspacemd"></a>


# Class: implWorkspace

## Hierarchy

* [implBase](#classes_vscode_gen_implbasemd)

  ↳ **implWorkspace**

## Implements

* [Workspace](#interfaces_vscode_gen_workspacemd)

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [impl](#impl)

### Methods

* [AllProperties](#allproperties)
* [AsRelativePath](#asrelativepath)
* [CreateFileSystemWatcher](#createfilesystemwatcher)
* [FindFiles](#findfiles)
* [GetWorkspaceFolder](#getworkspacefolder)
* [Impl](#impl)
* [Name](#name)
* [OnDidChangeWorkspaceFolders](#ondidchangeworkspacefolders)
* [SaveAll](#saveall)
* [WorkspaceFile](#workspacefile)
* [WorkspaceFolders](#workspacefolders)

## Constructors

###  constructor

\+ **new implWorkspace**(`impl`: [impl](#classes_vscode_gen_implmd)): *[implWorkspace](#classes_vscode_gen_implworkspacemd)*

*Overrides [implBase](#classes_vscode_gen_implbasemd).[constructor](#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`impl` | [impl](#classes_vscode_gen_implmd) |

**Returns:** *[implWorkspace](#classes_vscode_gen_implworkspacemd)*

## Properties

###  impl

• **impl**: *[impl](#classes_vscode_gen_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[impl](#impl)*

## Methods

###  AllProperties

▸ **AllProperties**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WorkspaceState](#interfaces_vscode_gen_workspacestatemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceState](#interfaces_vscode_gen_workspacestatemd) |

___

###  AsRelativePath

▸ **AsRelativePath**(`pathOrUri`: string, `includeWorkspaceFolder`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`pathOrUri` | string |
`includeWorkspaceFolder` | boolean |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  CreateFileSystemWatcher

▸ **CreateFileSystemWatcher**(`globPattern`: string, `ignoreCreateEvents`: boolean, `ignoreChangeEvents`: boolean, `ignoreDeleteEvents`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`globPattern` | string |
`ignoreCreateEvents` | boolean |
`ignoreChangeEvents` | boolean |
`ignoreDeleteEvents` | boolean |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd) |

___

###  FindFiles

▸ **FindFiles**(`include`: string, `exclude?`: string, `maxResults?`: number, `token?`: [Cancel](#classes_core_cancelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`include` | string |
`exclude?` | string |
`maxResults?` | number |
`token?` | [Cancel](#classes_core_cancelmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string[] |

___

###  GetWorkspaceFolder

▸ **GetWorkspaceFolder**(`uri`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`uri` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd) |

___

###  Impl

▸ **Impl**(): *[impl](#classes_core_implmd)*

*Inherited from [implBase](#classes_vscode_gen_implbasemd).[Impl](#impl)*

**Returns:** *[impl](#classes_core_implmd)*

___

###  Name

▸ **Name**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  OnDidChangeWorkspaceFolders

▸ **OnDidChangeWorkspaceFolders**(`listener`: function): *function*

**Parameters:**

▪ **listener**: *function*

▸ (`_`: [WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  SaveAll

▸ **SaveAll**(`includeUntitled`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`includeUntitled` | boolean |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | boolean |

___

###  WorkspaceFile

▸ **WorkspaceFile**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  WorkspaceFolders

▸ **WorkspaceFolders**(): *function*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)[] |


<a name="enums_vscode_gen_statusbaralignmentmd"></a>


# Enumeration: StatusBarAlignment

Represents the alignment of status bar items.

## Index

### Enumeration members

* [Left](#left)
* [Right](#right)

## Enumeration members

###  Left

• **Left**: = 1

Aligned to the left side.

___

###  Right

• **Right**: = 2

Aligned to the right side.


<a name="interfaces_vscode_gen_clipboardmd"></a>


# Interface: Clipboard

The clipboard provides read and write access to the system's clipboard.

## Hierarchy

* **Clipboard**

## Implemented by

* [implClipboard](#classes_vscode_gen_implclipboardmd)

## Index

### Properties

* [ReadText](#readtext)
* [WriteText](#writetext)

## Properties

###  ReadText

• **ReadText**: *function*

Read the current clipboard contents as text.

**`returns`** A thenable that resolves to a string.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  WriteText

• **WriteText**: *function*

Writes text into the clipboard.

**`returns`** A thenable that resolves when writing happened.

**`param`** 

#### Type declaration:

▸ (`value`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*


<a name="interfaces_vscode_gen_commandsmd"></a>


# Interface: Commands

Namespace for dealing with commands. In short, a command is a function with a
unique identifier. The function is sometimes also called _command handler_.

Commands can be added to the editor using the [registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
and [registerTextEditorCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerTextEditorCommand) functions. Commands
can be executed [manually](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand) or from a UI gesture. Those are:

* palette - Use the `commands`-section in `package.json` to make a command show in
the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
* keybinding - Use the `keybindings`-section in `package.json` to enable
[keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
for your extension.

Commands from other extensions and from the editor itself are accessible to an extension. However,
when invoking an editor command not all argument types are supported.

This is a sample that registers a command handler and adds an entry for that command to the palette. First
register a command handler with the identifier `extension.sayHello`.

```javascript

commands.registerCommand('extension.sayHello', () => {
 	window.showInformationMessage('Hello World!');
});

```

Second, bind the command identifier to a title under which it will show in the palette (`package.json`).

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

## Hierarchy

* **Commands**

## Implemented by

* [implCommands](#classes_vscode_gen_implcommandsmd)

## Index

### Properties

* [ExecuteCommand](#executecommand)
* [GetCommands](#getcommands)
* [RegisterCommand](#registercommand)

## Properties

###  ExecuteCommand

• **ExecuteCommand**: *function*

Executes the command denoted by the given command identifier.

* *Note 1:* When executing an editor command not all types are allowed to
be passed as arguments. Allowed are the primitive types `string`, `boolean`,
`number`, `undefined`, and `null`, as well as [`Position`](https://code.visualstudio.com/api/references/vscode-api#Position), [`Range`](#Range), [`Uri`](#Uri) and [`Location`](#Location).
* *Note 2:* There are no restrictions when executing commands that have been contributed
by extensions.

**`param`** Identifier of the command to execute.

**`param`** Parameters passed to the command function.

**`returns`** A thenable that resolves to the returned value of the given command. `undefined` when the command handler function doesn't return anything.

#### Type declaration:

▸ (`command`: string, `rest`: any[]): *function*

**Parameters:**

Name | Type |
------ | ------ |
`command` | string |
`rest` | any[] |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  GetCommands

• **GetCommands**: *function*

Retrieve the list of all available commands. Commands starting an underscore are
treated as internal commands.

**`param`** Set `true` to not see internal commands (starting with an underscore)

**`returns`** Thenable that resolves to a list of command ids.

#### Type declaration:

▸ (`filterInternal`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`filterInternal` | boolean |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string[] |

___

###  RegisterCommand

• **RegisterCommand**: *function*

Registers a command that can be invoked via a keyboard shortcut,
a menu item, an action, or directly.

Registering a command with an existing command identifier twice
will cause an error.

**`param`** A unique identifier for the command.

**`param`** A command handler function.

**`returns`** Disposable which unregisters this command on disposal.

#### Type declaration:

▸ (`command`: string, `callback`: function): *function*

**Parameters:**

▪ **command**: *string*

▪ **callback**: *function*

▸ (`_`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any[] |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |


<a name="interfaces_vscode_gen_diagnosticchangeeventmd"></a>


# Interface: DiagnosticChangeEvent

The event that is fired when diagnostics change.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **DiagnosticChangeEvent**

## Index

### Properties

* [__loadFromJsonish__](#__loadfromjsonish__)
* [uris](#uris)

## Properties

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  uris

• **uris**: *string[]*

An array of resources for which diagnostics have changed.


<a name="interfaces_vscode_gen_envmd"></a>


# Interface: Env

Namespace describing the environment the editor runs in.

## Hierarchy

* **Env**

## Implemented by

* [implEnv](#classes_vscode_gen_implenvmd)

## Index

### Properties

* [AllProperties](#allproperties)
* [AppName](#appname)
* [AppRoot](#approot)
* [Clipboard](#clipboard)
* [Language](#language)
* [MachineId](#machineid)
* [OpenExternal](#openexternal)
* [RemoteName](#remotename)
* [SessionId](#sessionid)
* [Shell](#shell)
* [UriScheme](#urischeme)

## Properties

###  AllProperties

• **AllProperties**: *function*

Provides single-call access to numerous individual `Env` properties at once.

**`returns`** a thenable that resolves when this `AllProperties` call has successfully completed at the VSC side and its `EnvState` result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [EnvState](#interfaces_vscode_gen_envstatemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [EnvState](#interfaces_vscode_gen_envstatemd) |

___

###  AppName

• **AppName**: *function*

The application name of the editor, like 'VS Code'.

**`returns`** a thenable that resolves when this `AppName` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  AppRoot

• **AppRoot**: *function*

The application root folder from which the editor is running.

**`returns`** a thenable that resolves when this `AppRoot` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  Clipboard

• **Clipboard**: *function*

The clipboard provides read and write access to the system's clipboard.

#### Type declaration:

▸ (): *[Clipboard](#interfaces_vscode_gen_clipboardmd)*

___

###  Language

• **Language**: *function*

Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.

**`returns`** a thenable that resolves when this `Language` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  MachineId

• **MachineId**: *function*

A unique identifier for the computer.

**`returns`** a thenable that resolves when this `MachineId` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  OpenExternal

• **OpenExternal**: *function*

Opens an *external* item, e.g. a http(s) or mailto-link, using the
default application.

*Note* that [`showTextDocument`](https://code.visualstudio.com/api/references/vscode-api#window.showTextDocument) is the right
way to open a text document inside the editor, not this function.

**`param`** The uri that should be opened.

**`returns`** A promise indicating if open was successful.

#### Type declaration:

▸ (`target`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`target` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | boolean |

___

###  RemoteName

• **RemoteName**: *function*

The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
Subsystem for Linux or `ssh-remote` for remotes using a secure shell.

*Note* that the value is `undefined` when there is no remote extension host but that the
value is defined in all extension hosts (local and remote) in case a remote extension host
exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
a specific extension runs remote or not.

**`returns`** a thenable that resolves when this `RemoteName` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  SessionId

• **SessionId**: *function*

A unique identifier for the current session.
Changes each time the editor is started.

**`returns`** a thenable that resolves when this `SessionId` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  Shell

• **Shell**: *function*

The detected default shell for the extension host, this is overridden by the
`terminal.integrated.shell` setting for the extension host's platform.

**`returns`** a thenable that resolves when this `Shell` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  UriScheme

• **UriScheme**: *function*

The custom uri scheme the editor registers to in the operating system.

**`returns`** a thenable that resolves when this `UriScheme` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |


<a name="interfaces_vscode_gen_envstatemd"></a>


# Interface: EnvState

EnvState gathers various properties of `Env`, obtainable via its `AllProperties` method.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **EnvState**

## Index

### Properties

* [__loadFromJsonish__](#__loadfromjsonish__)
* [appName](#optional-appname)
* [appRoot](#optional-approot)
* [language](#optional-language)
* [machineId](#optional-machineid)
* [remoteName](#optional-remotename)
* [sessionId](#optional-sessionid)
* [shell](#optional-shell)
* [uriScheme](#optional-urischeme)

## Properties

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

### `Optional` appName

• **appName**? : *string*

The application name of the editor, like 'VS Code'.

___

### `Optional` appRoot

• **appRoot**? : *string*

The application root folder from which the editor is running.

___

### `Optional` language

• **language**? : *string*

Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.

___

### `Optional` machineId

• **machineId**? : *string*

A unique identifier for the computer.

___

### `Optional` remoteName

• **remoteName**? : *string*

The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
Subsystem for Linux or `ssh-remote` for remotes using a secure shell.

*Note* that the value is `undefined` when there is no remote extension host but that the
value is defined in all extension hosts (local and remote) in case a remote extension host
exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
a specific extension runs remote or not.

___

### `Optional` sessionId

• **sessionId**? : *string*

A unique identifier for the current session.
Changes each time the editor is started.

___

### `Optional` shell

• **shell**? : *string*

The detected default shell for the extension host, this is overridden by the
`terminal.integrated.shell` setting for the extension host's platform.

___

### `Optional` uriScheme

• **uriScheme**? : *string*

The custom uri scheme the editor registers to in the operating system.


<a name="interfaces_vscode_gen_extensionsmd"></a>


# Interface: Extensions

Namespace for dealing with installed extensions. Extensions are represented
by an [extension](https://code.visualstudio.com/api/references/vscode-api#Extension)-interface which enables reflection on them.

Extension writers can provide APIs to other extensions by returning their API public
surface from the `activate`-call.

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

When depending on the API of another extension add an `extensionDependency`-entry
to `package.json`, and use the [getExtension](https://code.visualstudio.com/api/references/vscode-api#extensions.getExtension)-function
and the [exports](https://code.visualstudio.com/api/references/vscode-api#Extension.exports)-property, like below:

```javascript

let mathExt = extensions.getExtension('genius.math');
let importedApi = mathExt.exports;

console.log(importedApi.mul(42, 1));

```

## Hierarchy

* **Extensions**

## Implemented by

* [implExtensions](#classes_vscode_gen_implextensionsmd)

## Index

### Properties

* [OnDidChange](#ondidchange)

## Properties

###  OnDidChange

• **OnDidChange**: *function*

An event which fires when `extensions.all` changes. This can happen when extensions are
installed, uninstalled, enabled or disabled.

**`param`** will be invoked whenever the `OnDidChange` event fires (mandatory, not optional).

**`returns`** A `Disposable` that will unsubscribe `listener` from the `OnDidChange` event on `Dispose`.

#### Type declaration:

▸ (`listener`: function): *function*

**Parameters:**

▪ **listener**: *function*

▸ (): *void*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |


<a name="interfaces_vscode_gen_filesystemwatchermd"></a>


# Interface: FileSystemWatcher

A file system watcher notifies about changes to files and folders
on disk.

To get an instance of a `FileSystemWatcher` use
[createFileSystemWatcher](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher).

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

* [withDisp](#interfaces_vscode_gen_withdispmd)

* [withState](#interfaces_vscode_gen_withstatemd)‹[FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)›

  ↳ **FileSystemWatcher**

## Index

### Properties

* [Cfg](#cfg)
* [Dispose](#dispose)
* [OnDidChange](#ondidchange)
* [OnDidCreate](#ondidcreate)
* [OnDidDelete](#ondiddelete)
* [__appzObjBagPullFromPeer__](#__appzobjbagpullfrompeer__)
* [__appzObjBagPushToPeer__](#__appzobjbagpushtopeer__)
* [__disp__](#__disp__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [toJSON](#tojson)

## Properties

###  Cfg

• **Cfg**: *[FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[Cfg](#cfg)*

___

###  Dispose

• **Dispose**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OnDidChange

• **OnDidChange**: *function*

An event which fires on file/folder change.

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  OnDidCreate

• **OnDidCreate**: *function*

An event which fires on file/folder creation.

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  OnDidDelete

• **OnDidDelete**: *function*

An event which fires on file/folder deletion.

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  __appzObjBagPullFromPeer__

• **__appzObjBagPullFromPeer__**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPushToPeer__

• **__appzObjBagPushToPeer__**: *function*

#### Type declaration:

▸ (`_`: [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __disp__

• **__disp__**: *[Disposable](#classes_core_disposablemd)*

*Inherited from [withDisp](#interfaces_vscode_gen_withdispmd).[__disp__](#__disp__)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  toJSON

• **toJSON**: *function*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[toJSON](#tojson)*

#### Type declaration:

▸ (): *any*


<a name="interfaces_vscode_gen_filesystemwatcherstatemd"></a>


# Interface: FileSystemWatcherState

FileSystemWatcherState (to be accessed only via `FileSystemWatcher.Cfg`) is a snapshot of `FileSystemWatcher` state. It is auto-updated whenever `FileSystemWatcher` creations and method calls resolve or its event subscribers (if any) are invoked. Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `ApplyChanges` method.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **FileSystemWatcherState**

## Index

### Properties

* [ApplyChanges](#applychanges)
* [ReFetch](#refetch)
* [__holder__](#__holder__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [ignoreChangeEvents](#optional-ignorechangeevents)
* [ignoreCreateEvents](#optional-ignorecreateevents)
* [ignoreDeleteEvents](#optional-ignoredeleteevents)

## Properties

###  ApplyChanges

• **ApplyChanges**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  ReFetch

• **ReFetch**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __holder__

• **__holder__**: *[FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

### `Optional` ignoreChangeEvents

• **ignoreChangeEvents**? : *boolean*

true if this file system watcher has been created such that
it ignores change file system events.

___

### `Optional` ignoreCreateEvents

• **ignoreCreateEvents**? : *boolean*

true if this file system watcher has been created such that
it ignores creation file system events.

___

### `Optional` ignoreDeleteEvents

• **ignoreDeleteEvents**? : *boolean*

true if this file system watcher has been created such that
it ignores delete file system events.


<a name="interfaces_vscode_gen_fromjsonmd"></a>


# Interface: fromJson

## Hierarchy

* **fromJson**

  ↳ [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)

  ↳ [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)

  ↳ [WindowState](#interfaces_vscode_gen_windowstatemd)

  ↳ [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)

  ↳ [OutputChannel](#interfaces_vscode_gen_outputchannelmd)

  ↳ [InputBox](#interfaces_vscode_gen_inputboxmd)

  ↳ [QuickPick](#interfaces_vscode_gen_quickpickmd)

  ↳ [Terminal](#interfaces_vscode_gen_terminalmd)

  ↳ [WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd)

  ↳ [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)

  ↳ [DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd)

  ↳ [EnvState](#interfaces_vscode_gen_envstatemd)

  ↳ [WorkspaceState](#interfaces_vscode_gen_workspacestatemd)

  ↳ [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)

  ↳ [OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd)

  ↳ [InputBoxState](#interfaces_vscode_gen_inputboxstatemd)

  ↳ [QuickPickState](#interfaces_vscode_gen_quickpickstatemd)

  ↳ [TerminalState](#interfaces_vscode_gen_terminalstatemd)

  ↳ [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)

## Index

### Properties

* [__loadFromJsonish__](#__loadfromjsonish__)

## Properties

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |


<a name="interfaces_vscode_gen_inputboxmd"></a>


# Interface: InputBox

A concrete [QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput) to let the user input a text value.

Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

* [withDisp](#interfaces_vscode_gen_withdispmd)

* [withState](#interfaces_vscode_gen_withstatemd)‹[InputBoxState](#interfaces_vscode_gen_inputboxstatemd)›

  ↳ **InputBox**

## Index

### Properties

* [Cfg](#cfg)
* [Dispose](#dispose)
* [Hide](#hide)
* [OnDidAccept](#ondidaccept)
* [OnDidChangeValue](#ondidchangevalue)
* [OnDidHide](#ondidhide)
* [Show](#show)
* [__appzObjBagPullFromPeer__](#__appzobjbagpullfrompeer__)
* [__appzObjBagPushToPeer__](#__appzobjbagpushtopeer__)
* [__disp__](#__disp__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [toJSON](#tojson)

## Properties

###  Cfg

• **Cfg**: *[InputBoxState](#interfaces_vscode_gen_inputboxstatemd)*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[Cfg](#cfg)*

___

###  Dispose

• **Dispose**: *function*

Dispose of this input UI and any associated resources. If it is still
visible, it is first hidden. After this call the input UI is no longer
functional and no additional methods or properties on it should be
accessed. Instead a new input UI should be created.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Hide

• **Hide**: *function*

Hides this input UI. This will also fire an [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OnDidAccept

• **OnDidAccept**: *function*

An event signaling when the user indicated acceptance of the input value.

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  OnDidChangeValue

• **OnDidChangeValue**: *function*

An event signaling when the value has changed.

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  OnDidHide

• **OnDidHide**: *function*

An event signaling when this input UI is hidden.

There are several reasons why this UI might have to be hidden and
the extension will be notified through [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide).
(Examples include: an explicit call to [QuickInput.hide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.hide),
the user pressing Esc, some other input UI opening, etc.)

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  Show

• **Show**: *function*

Makes the input UI visible in its current configuration. Any other input
UI will first fire an [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide) event.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPullFromPeer__

• **__appzObjBagPullFromPeer__**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPushToPeer__

• **__appzObjBagPushToPeer__**: *function*

#### Type declaration:

▸ (`_`: [InputBoxState](#interfaces_vscode_gen_inputboxstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [InputBoxState](#interfaces_vscode_gen_inputboxstatemd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __disp__

• **__disp__**: *[Disposable](#classes_core_disposablemd)*

*Inherited from [withDisp](#interfaces_vscode_gen_withdispmd).[__disp__](#__disp__)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  toJSON

• **toJSON**: *function*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[toJSON](#tojson)*

#### Type declaration:

▸ (): *any*


<a name="interfaces_vscode_gen_inputboxoptionsmd"></a>


# Interface: InputBoxOptions

Options to configure the behavior of the input box UI.

## Hierarchy

* **InputBoxOptions**

## Index

### Properties

* [ignoreFocusOut](#optional-ignorefocusout)
* [password](#optional-password)
* [placeHolder](#optional-placeholder)
* [prompt](#optional-prompt)
* [validateInput](#optional-validateinput)
* [validateInput_AppzFuncId](#validateinput_appzfuncid)
* [value](#optional-value)
* [valueSelection](#optional-valueselection)

## Properties

### `Optional` ignoreFocusOut

• **ignoreFocusOut**? : *boolean*

Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.

___

### `Optional` password

• **password**? : *boolean*

Set to `true` to show a password prompt that will not show the typed value.

___

### `Optional` placeHolder

• **placeHolder**? : *string*

An optional string to show as place holder in the input box to guide the user what to type.

___

### `Optional` prompt

• **prompt**? : *string*

The text to display underneath the input box.

___

### `Optional` validateInput

• **validateInput**? : *function*

An optional function that will be called to validate input and to give a hint
to the user.

`value` ── The current value of the input box.

`return` ── A human readable string which is presented as diagnostic message.
Return `undefined`, `null`, or the empty string when 'value' is valid.

#### Type declaration:

▸ (`_`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  validateInput_AppzFuncId

• **validateInput_AppzFuncId**: *string*

___

### `Optional` value

• **value**? : *string*

The value to prefill in the input box.

___

### `Optional` valueSelection

• **valueSelection**? : *[number, number]*

Selection of the prefilled [`value`](https://code.visualstudio.com/api/references/vscode-api#InputBoxOptions.value). Defined as tuple of two number where the
first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
word will be selected, when empty (start equals end) only the cursor will be set,
otherwise the defined range will be selected.


<a name="interfaces_vscode_gen_inputboxstatemd"></a>


# Interface: InputBoxState

InputBoxState (to be accessed only via `InputBox.Cfg`) is a snapshot of `InputBox` state. It is auto-updated whenever `InputBox` creations and method calls resolve or its event subscribers (if any) are invoked. Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `ApplyChanges` method.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **InputBoxState**

## Index

### Properties

* [ApplyChanges](#applychanges)
* [ReFetch](#refetch)
* [__holder__](#__holder__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [busy](#optional-busy)
* [enabled](#optional-enabled)
* [ignoreFocusOut](#optional-ignorefocusout)
* [password](#optional-password)
* [placeholder](#optional-placeholder)
* [prompt](#optional-prompt)
* [step](#optional-step)
* [title](#optional-title)
* [totalSteps](#optional-totalsteps)
* [validationMessage](#optional-validationmessage)
* [value](#optional-value)

## Properties

###  ApplyChanges

• **ApplyChanges**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  ReFetch

• **ReFetch**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __holder__

• **__holder__**: *[InputBox](#interfaces_vscode_gen_inputboxmd)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

### `Optional` busy

• **busy**? : *boolean*

If the UI should show a progress indicator. Defaults to false.

Change this to true, e.g., while loading more data or validating
user input.

___

### `Optional` enabled

• **enabled**? : *boolean*

If the UI should allow for user input. Defaults to true.

Change this to false, e.g., while validating user input or
loading data for the next step in user input.

___

### `Optional` ignoreFocusOut

• **ignoreFocusOut**? : *boolean*

If the UI should stay open even when loosing UI focus. Defaults to false.

___

### `Optional` password

• **password**? : *boolean*

If the input value should be hidden. Defaults to false.

___

### `Optional` placeholder

• **placeholder**? : *string*

Optional placeholder in the filter text.

___

### `Optional` prompt

• **prompt**? : *string*

An optional prompt text providing some ask or explanation to the user.

___

### `Optional` step

• **step**? : *number*

An optional current step count.

___

### `Optional` title

• **title**? : *string*

An optional title.

___

### `Optional` totalSteps

• **totalSteps**? : *number*

An optional total step count.

___

### `Optional` validationMessage

• **validationMessage**? : *string*

An optional validation message indicating a problem with the current input value.

___

### `Optional` value

• **value**? : *string*

Current input value.


<a name="interfaces_vscode_gen_languagesmd"></a>


# Interface: Languages

Namespace for participating in language-specific editor [features](https://code.visualstudio.com/docs/editor/editingevolved),
like IntelliSense, code actions, diagnostics etc.

Many programming languages exist and there is huge variety in syntaxes, semantics, and paradigms. Despite that, features
like automatic word-completion, code navigation, or code checking have become popular across different tools for different
programming languages.

The editor provides an API that makes it simple to provide such common features by having all UI and actions already in place and
by allowing you to participate by providing data only. For instance, to contribute a hover all you have to do is provide a function
that can be called with a [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.

```javascript

languages.registerHoverProvider('javascript', {
 	provideHover(document, position, token) {
 		return new Hover('I am a hover!');
 	}
});

```

Registration is done using a [document selector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a language id, like `javascript` or
a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
a selector will result in a [score](https://code.visualstudio.com/api/references/vscode-api#languages.match) that is used to determine if and how a provider shall be used. When
scores are equal the provider that came last wins. For features that allow full arity, like [hover](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider),
the score is only checked to be `>0`, for other features, like [IntelliSense](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider) the
score is used for determining the order in which providers are asked to participate.

## Hierarchy

* **Languages**

## Implemented by

* [implLanguages](#classes_vscode_gen_impllanguagesmd)

## Index

### Properties

* [GetLanguages](#getlanguages)
* [OnDidChangeDiagnostics](#ondidchangediagnostics)

## Properties

###  GetLanguages

• **GetLanguages**: *function*

Return the identifiers of all known languages.

**`returns`** Promise resolving to an array of identifier strings.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string[] |

___

###  OnDidChangeDiagnostics

• **OnDidChangeDiagnostics**: *function*

An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the global set of diagnostics changes. This is
newly added and removed diagnostics.

**`param`** will be invoked whenever the `OnDidChangeDiagnostics` event fires (mandatory, not optional).

**`returns`** A `Disposable` that will unsubscribe `listener` from the `OnDidChangeDiagnostics` event on `Dispose`.

#### Type declaration:

▸ (`listener`: function): *function*

**Parameters:**

▪ **listener**: *function*

▸ (`_`: [DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |


<a name="interfaces_vscode_gen_opendialogoptionsmd"></a>


# Interface: OpenDialogOptions

Options to configure the behaviour of a file open dialog.

* Note 1: A dialog can select files, folders, or both. This is not true for Windows
which enforces to open either files or folder, but *not both*.
* Note 2: Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
and the editor then silently adjusts the options to select files.

## Hierarchy

* **OpenDialogOptions**

## Index

### Properties

* [canSelectFiles](#optional-canselectfiles)
* [canSelectFolders](#optional-canselectfolders)
* [canSelectMany](#optional-canselectmany)
* [defaultUri](#optional-defaulturi)
* [filters](#optional-filters)
* [openLabel](#optional-openlabel)

## Properties

### `Optional` canSelectFiles

• **canSelectFiles**? : *boolean*

Allow to select files, defaults to `true`.

___

### `Optional` canSelectFolders

• **canSelectFolders**? : *boolean*

Allow to select folders, defaults to `false`.

___

### `Optional` canSelectMany

• **canSelectMany**? : *boolean*

Allow to select many files or folders.

___

### `Optional` defaultUri

• **defaultUri**? : *string*

The resource the dialog shows when opened.

___

### `Optional` filters

• **filters**? : *object*

A set of file filters that are used by the dialog. Each entry is a human readable label,
like "TypeScript", and an array of extensions, e.g.

```ts

{
 	'Images': ['png', 'jpg']
 	'TypeScript': ['ts', 'tsx']
}

```

#### Type declaration:

* \[ **_**: *string*\]: string[]

___

### `Optional` openLabel

• **openLabel**? : *string*

A human-readable string for the open button.


<a name="interfaces_vscode_gen_outputchannelmd"></a>


# Interface: OutputChannel

An output channel is a container for readonly textual information.

To get an instance of an `OutputChannel` use
[createOutputChannel](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel).

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

* [withDisp](#interfaces_vscode_gen_withdispmd)

* [withState](#interfaces_vscode_gen_withstatemd)‹[OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd)›

  ↳ **OutputChannel**

## Index

### Properties

* [Append](#append)
* [AppendLine](#appendline)
* [Cfg](#cfg)
* [Clear](#clear)
* [Dispose](#dispose)
* [Hide](#hide)
* [Show](#show)
* [__appzObjBagPullFromPeer__](#__appzobjbagpullfrompeer__)
* [__disp__](#__disp__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [toJSON](#tojson)

## Properties

###  Append

• **Append**: *function*

Append the given value to the channel.

`value` ── A string, falsy values will not be printed.

#### Type declaration:

▸ (`_`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  AppendLine

• **AppendLine**: *function*

Append the given value and a line feed character
to the channel.

`value` ── A string, falsy values will be printed.

#### Type declaration:

▸ (`_`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Cfg

• **Cfg**: *[OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd)*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[Cfg](#cfg)*

___

###  Clear

• **Clear**: *function*

Removes all output from the channel.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Dispose

• **Dispose**: *function*

Dispose and free associated resources.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Hide

• **Hide**: *function*

Hide this channel from the UI.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Show

• **Show**: *function*

Reveal this channel in the UI.

`preserveFocus` ── When `true` the channel will not take focus.

#### Type declaration:

▸ (`_`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | boolean |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPullFromPeer__

• **__appzObjBagPullFromPeer__**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __disp__

• **__disp__**: *[Disposable](#classes_core_disposablemd)*

*Inherited from [withDisp](#interfaces_vscode_gen_withdispmd).[__disp__](#__disp__)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  toJSON

• **toJSON**: *function*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[toJSON](#tojson)*

#### Type declaration:

▸ (): *any*


<a name="interfaces_vscode_gen_outputchannelstatemd"></a>


# Interface: OutputChannelState

OutputChannelState (to be accessed only via `OutputChannel.Cfg`) is a snapshot of `OutputChannel` state. It is auto-updated whenever `OutputChannel` creations and method calls resolve or its event subscribers (if any) are invoked. All read-only properties are exposed as function-valued fields.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **OutputChannelState**

## Index

### Properties

* [Name](#name)
* [ReFetch](#refetch)
* [__holder__](#__holder__)
* [__loadFromJsonish__](#__loadfromjsonish__)

## Properties

###  Name

• **Name**: *function*

The human-readable name of this output channel.

#### Type declaration:

▸ (): *string*

___

###  ReFetch

• **ReFetch**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __holder__

• **__holder__**: *[OutputChannel](#interfaces_vscode_gen_outputchannelmd)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |


<a name="interfaces_vscode_gen_quickinputbuttonmd"></a>


# Interface: QuickInputButton

Button for an action in a [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick) or [InputBox](#InputBox).

## Hierarchy

* **QuickInputButton**

## Index

### Properties

* [iconPath](#iconpath)
* [tooltip](#optional-tooltip)

## Properties

###  iconPath

• **iconPath**: *string*

Icon for the button.

___

### `Optional` tooltip

• **tooltip**? : *string*

An optional tooltip.


<a name="interfaces_vscode_gen_quickpickmd"></a>


# Interface: QuickPick

A concrete [QuickInput](https://code.visualstudio.com/api/references/vscode-api#QuickInput) to let the user pick an item from a
list of items of type T. The items can be filtered through a filter text field and
there is an option [canSelectMany](https://code.visualstudio.com/api/references/vscode-api#QuickPick.canSelectMany) to allow for
selecting multiple items.

Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

* [withDisp](#interfaces_vscode_gen_withdispmd)

* [withState](#interfaces_vscode_gen_withstatemd)‹[QuickPickState](#interfaces_vscode_gen_quickpickstatemd)›

  ↳ **QuickPick**

## Index

### Properties

* [Cfg](#cfg)
* [Dispose](#dispose)
* [Hide](#hide)
* [OnDidAccept](#ondidaccept)
* [OnDidChangeActive](#ondidchangeactive)
* [OnDidChangeSelection](#ondidchangeselection)
* [OnDidChangeValue](#ondidchangevalue)
* [OnDidHide](#ondidhide)
* [Show](#show)
* [__appzObjBagPullFromPeer__](#__appzobjbagpullfrompeer__)
* [__appzObjBagPushToPeer__](#__appzobjbagpushtopeer__)
* [__disp__](#__disp__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [toJSON](#tojson)

## Properties

###  Cfg

• **Cfg**: *[QuickPickState](#interfaces_vscode_gen_quickpickstatemd)*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[Cfg](#cfg)*

___

###  Dispose

• **Dispose**: *function*

Dispose of this input UI and any associated resources. If it is still
visible, it is first hidden. After this call the input UI is no longer
functional and no additional methods or properties on it should be
accessed. Instead a new input UI should be created.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Hide

• **Hide**: *function*

Hides this input UI. This will also fire an [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide)
event.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OnDidAccept

• **OnDidAccept**: *function*

An event signaling when the user indicated acceptance of the selected item(s).

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  OnDidChangeActive

• **OnDidChangeActive**: *function*

An event signaling when the active items have changed.

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[] |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  OnDidChangeSelection

• **OnDidChangeSelection**: *function*

An event signaling when the selected items have changed.

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[] |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  OnDidChangeValue

• **OnDidChangeValue**: *function*

An event signaling when the value of the filter text has changed.

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  OnDidHide

• **OnDidHide**: *function*

An event signaling when this input UI is hidden.

There are several reasons why this UI might have to be hidden and
the extension will be notified through [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide).
(Examples include: an explicit call to [QuickInput.hide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.hide),
the user pressing Esc, some other input UI opening, etc.)

#### Type declaration:

▸ (`_`: function): *function*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  Show

• **Show**: *function*

Makes the input UI visible in its current configuration. Any other input
UI will first fire an [QuickInput.onDidHide](https://code.visualstudio.com/api/references/vscode-api#QuickInput.onDidHide) event.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPullFromPeer__

• **__appzObjBagPullFromPeer__**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPushToPeer__

• **__appzObjBagPushToPeer__**: *function*

#### Type declaration:

▸ (`_`: [QuickPickState](#interfaces_vscode_gen_quickpickstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPickState](#interfaces_vscode_gen_quickpickstatemd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __disp__

• **__disp__**: *[Disposable](#classes_core_disposablemd)*

*Inherited from [withDisp](#interfaces_vscode_gen_withdispmd).[__disp__](#__disp__)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  toJSON

• **toJSON**: *function*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[toJSON](#tojson)*

#### Type declaration:

▸ (): *any*


<a name="interfaces_vscode_gen_quickpickitemmd"></a>


# Interface: QuickPickItem

Represents an item that can be selected from
a list of items.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **QuickPickItem**

## Index

### Properties

* [__loadFromJsonish__](#__loadfromjsonish__)
* [alwaysShow](#optional-alwaysshow)
* [description](#optional-description)
* [detail](#optional-detail)
* [label](#label)
* [my](#optional-my)
* [picked](#optional-picked)

## Properties

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

### `Optional` alwaysShow

• **alwaysShow**? : *boolean*

Always show this item.

___

### `Optional` description

• **description**? : *string*

A human readable string which is rendered less prominent.

___

### `Optional` detail

• **detail**? : *string*

A human readable string which is rendered less prominent.

___

###  label

• **label**: *string*

A human readable string which is rendered prominent.

___

### `Optional` my

• **my**? : *object*

Free-form custom data, preserved across a roundtrip.

#### Type declaration:

* \[ **_**: *string*\]: any

___

### `Optional` picked

• **picked**? : *boolean*

Optional flag indicating if this item is picked initially.
(Only honored when the picker allows multiple selections.)


<a name="interfaces_vscode_gen_quickpickoptionsmd"></a>


# Interface: QuickPickOptions

Options to configure the behavior of the quick pick UI.

## Hierarchy

* **QuickPickOptions**

## Index

### Properties

* [canPickMany](#optional-canpickmany)
* [ignoreFocusOut](#optional-ignorefocusout)
* [matchOnDescription](#optional-matchondescription)
* [matchOnDetail](#optional-matchondetail)
* [onDidSelectItem](#optional-ondidselectitem)
* [onDidSelectItem_AppzFuncId](#ondidselectitem_appzfuncid)
* [placeHolder](#optional-placeholder)

## Properties

### `Optional` canPickMany

• **canPickMany**? : *boolean*

An optional flag to make the picker accept multiple selections, if true the result is an array of picks.

___

### `Optional` ignoreFocusOut

• **ignoreFocusOut**? : *boolean*

Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.

___

### `Optional` matchOnDescription

• **matchOnDescription**? : *boolean*

An optional flag to include the description when filtering the picks.

___

### `Optional` matchOnDetail

• **matchOnDetail**? : *boolean*

An optional flag to include the detail when filtering the picks.

___

### `Optional` onDidSelectItem

• **onDidSelectItem**? : *function*

An optional function that is invoked whenever an item is selected.

#### Type declaration:

▸ (`_`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd) |

___

###  onDidSelectItem_AppzFuncId

• **onDidSelectItem_AppzFuncId**: *string*

___

### `Optional` placeHolder

• **placeHolder**? : *string*

An optional string to show as place holder in the input box to guide the user what to pick on.


<a name="interfaces_vscode_gen_quickpickstatemd"></a>


# Interface: QuickPickState

QuickPickState (to be accessed only via `QuickPick.Cfg`) is a snapshot of `QuickPick` state. It is auto-updated whenever `QuickPick` creations and method calls resolve or its event subscribers (if any) are invoked. Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `ApplyChanges` method.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **QuickPickState**

## Index

### Properties

* [ApplyChanges](#applychanges)
* [ReFetch](#refetch)
* [__holder__](#__holder__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [activeItems](#optional-activeitems)
* [busy](#optional-busy)
* [canSelectMany](#optional-canselectmany)
* [enabled](#optional-enabled)
* [ignoreFocusOut](#optional-ignorefocusout)
* [items](#optional-items)
* [matchOnDescription](#optional-matchondescription)
* [matchOnDetail](#optional-matchondetail)
* [placeholder](#optional-placeholder)
* [selectedItems](#optional-selecteditems)
* [step](#optional-step)
* [title](#optional-title)
* [totalSteps](#optional-totalsteps)
* [value](#optional-value)

## Properties

###  ApplyChanges

• **ApplyChanges**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  ReFetch

• **ReFetch**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __holder__

• **__holder__**: *[QuickPick](#interfaces_vscode_gen_quickpickmd)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

### `Optional` activeItems

• **activeItems**? : *[QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]*

Active items. This can be read and updated by the extension.

___

### `Optional` busy

• **busy**? : *boolean*

If the UI should show a progress indicator. Defaults to false.

Change this to true, e.g., while loading more data or validating
user input.

___

### `Optional` canSelectMany

• **canSelectMany**? : *boolean*

If multiple items can be selected at the same time. Defaults to false.

___

### `Optional` enabled

• **enabled**? : *boolean*

If the UI should allow for user input. Defaults to true.

Change this to false, e.g., while validating user input or
loading data for the next step in user input.

___

### `Optional` ignoreFocusOut

• **ignoreFocusOut**? : *boolean*

If the UI should stay open even when loosing UI focus. Defaults to false.

___

### `Optional` items

• **items**? : *[QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]*

Items to pick from.

___

### `Optional` matchOnDescription

• **matchOnDescription**? : *boolean*

If the filter text should also be matched against the description of the items. Defaults to false.

___

### `Optional` matchOnDetail

• **matchOnDetail**? : *boolean*

If the filter text should also be matched against the detail of the items. Defaults to false.

___

### `Optional` placeholder

• **placeholder**? : *string*

Optional placeholder in the filter text.

___

### `Optional` selectedItems

• **selectedItems**? : *[QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]*

Selected items. This can be read and updated by the extension.

___

### `Optional` step

• **step**? : *number*

An optional current step count.

___

### `Optional` title

• **title**? : *string*

An optional title.

___

### `Optional` totalSteps

• **totalSteps**? : *number*

An optional total step count.

___

### `Optional` value

• **value**? : *string*

Current value of the filter text.


<a name="interfaces_vscode_gen_savedialogoptionsmd"></a>


# Interface: SaveDialogOptions

Options to configure the behaviour of a file save dialog.

## Hierarchy

* **SaveDialogOptions**

## Index

### Properties

* [defaultUri](#optional-defaulturi)
* [filters](#optional-filters)
* [saveLabel](#optional-savelabel)

## Properties

### `Optional` defaultUri

• **defaultUri**? : *string*

The resource the dialog shows when opened.

___

### `Optional` filters

• **filters**? : *object*

A set of file filters that are used by the dialog. Each entry is a human readable label,
like "TypeScript", and an array of extensions, e.g.

```ts

{
 	'Images': ['png', 'jpg']
 	'TypeScript': ['ts', 'tsx']
}

```

#### Type declaration:

* \[ **_**: *string*\]: string[]

___

### `Optional` saveLabel

• **saveLabel**? : *string*

A human-readable string for the save button.


<a name="interfaces_vscode_gen_statusbaritemmd"></a>


# Interface: StatusBarItem

A status bar item is a status bar contribution that can
show text and icons and run a command on click.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

* [withDisp](#interfaces_vscode_gen_withdispmd)

* [withState](#interfaces_vscode_gen_withstatemd)‹[StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)›

  ↳ **StatusBarItem**

## Index

### Properties

* [Cfg](#cfg)
* [Dispose](#dispose)
* [Hide](#hide)
* [Show](#show)
* [__appzObjBagPullFromPeer__](#__appzobjbagpullfrompeer__)
* [__appzObjBagPushToPeer__](#__appzobjbagpushtopeer__)
* [__disp__](#__disp__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [toJSON](#tojson)

## Properties

###  Cfg

• **Cfg**: *[StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[Cfg](#cfg)*

___

###  Dispose

• **Dispose**: *function*

Dispose and free associated resources. Call
[hide](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.hide).

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Hide

• **Hide**: *function*

Hide the entry in the status bar.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Show

• **Show**: *function*

Shows the entry in the status bar.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPullFromPeer__

• **__appzObjBagPullFromPeer__**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPushToPeer__

• **__appzObjBagPushToPeer__**: *function*

#### Type declaration:

▸ (`_`: [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __disp__

• **__disp__**: *[Disposable](#classes_core_disposablemd)*

*Inherited from [withDisp](#interfaces_vscode_gen_withdispmd).[__disp__](#__disp__)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  toJSON

• **toJSON**: *function*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[toJSON](#tojson)*

#### Type declaration:

▸ (): *any*


<a name="interfaces_vscode_gen_statusbaritemstatemd"></a>


# Interface: StatusBarItemState

StatusBarItemState (to be accessed only via `StatusBarItem.Cfg`) is a snapshot of `StatusBarItem` state. It is auto-updated whenever `StatusBarItem` creations and method calls resolve or its event subscribers (if any) are invoked. All read-only properties are exposed as function-valued fields. Changes to any non-read-only properties (ie. non-function-valued fields) must be explicitly propagated to the VSC side via the `ApplyChanges` method.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **StatusBarItemState**

## Index

### Properties

* [Alignment](#alignment)
* [ApplyChanges](#applychanges)
* [Priority](#priority)
* [ReFetch](#refetch)
* [__holder__](#__holder__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [color](#optional-color)
* [command](#optional-command)
* [text](#optional-text)
* [tooltip](#optional-tooltip)

## Properties

###  Alignment

• **Alignment**: *function*

The alignment of this item.

#### Type declaration:

▸ (): *[StatusBarAlignment](#enums_vscode_gen_statusbaralignmentmd)*

___

###  ApplyChanges

• **ApplyChanges**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Priority

• **Priority**: *function*

The priority of this item. Higher value means the item should
be shown more to the left.

#### Type declaration:

▸ (): *number*

___

###  ReFetch

• **ReFetch**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __holder__

• **__holder__**: *[StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

### `Optional` color

• **color**? : *string*

The foreground color for this entry.

___

### `Optional` command

• **command**? : *string*

The identifier of a command to run on click. The command must be
[known](https://code.visualstudio.com/api/references/vscode-api#commands.getCommands).

___

### `Optional` text

• **text**? : *string*

The text to show for the entry. You can embed icons in the text by leveraging the syntax:

`My text $(icon-name) contains icons like $(icon-name) this one.`

Where the icon-name is taken from the [octicon](https://octicons.github.com) icon set, e.g.
`light-bulb`, `thumbsup`, `zap` etc.

___

### `Optional` tooltip

• **tooltip**? : *string*

The tooltip text when you hover over this entry.


<a name="interfaces_vscode_gen_terminalmd"></a>


# Interface: Terminal

An individual terminal instance within the integrated terminal.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

* [withDisp](#interfaces_vscode_gen_withdispmd)

* [withState](#interfaces_vscode_gen_withstatemd)‹[TerminalState](#interfaces_vscode_gen_terminalstatemd)›

  ↳ **Terminal**

## Index

### Properties

* [Cfg](#cfg)
* [Dispose](#dispose)
* [Hide](#hide)
* [SendText](#sendtext)
* [Show](#show)
* [__appzObjBagPullFromPeer__](#__appzobjbagpullfrompeer__)
* [__disp__](#__disp__)
* [__loadFromJsonish__](#__loadfromjsonish__)
* [toJSON](#tojson)

## Properties

###  Cfg

• **Cfg**: *[TerminalState](#interfaces_vscode_gen_terminalstatemd)*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[Cfg](#cfg)*

___

###  Dispose

• **Dispose**: *function*

Dispose and free associated resources.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Hide

• **Hide**: *function*

Hide the terminal panel if this terminal is currently showing.

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  SendText

• **SendText**: *function*

Send text to the terminal. The text is written to the stdin of the underlying pty process
(shell) of the terminal.

`text` ── The text to send.

`addNewLine` ── Whether to add a new line to the text being sent, this is normally
required to run a command in the terminal. The character(s) added are \n or \r\n
depending on the platform. This defaults to `true`.

#### Type declaration:

▸ (`_`: string, `__`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |
`__` | boolean |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Show

• **Show**: *function*

Show the terminal panel and reveal this terminal in the UI.

`preserveFocus` ── When `true` the terminal will not take focus.

#### Type declaration:

▸ (`_`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`_` | boolean |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __appzObjBagPullFromPeer__

• **__appzObjBagPullFromPeer__**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __disp__

• **__disp__**: *[Disposable](#classes_core_disposablemd)*

*Inherited from [withDisp](#interfaces_vscode_gen_withdispmd).[__disp__](#__disp__)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  toJSON

• **toJSON**: *function*

*Inherited from [withState](#interfaces_vscode_gen_withstatemd).[toJSON](#tojson)*

#### Type declaration:

▸ (): *any*


<a name="interfaces_vscode_gen_terminaloptionsmd"></a>


# Interface: TerminalOptions

Value-object describing what options a terminal should use.

## Hierarchy

* **TerminalOptions**

## Index

### Properties

* [cwd](#optional-cwd)
* [env](#optional-env)
* [hideFromUser](#optional-hidefromuser)
* [name](#optional-name)
* [shellArgs](#optional-shellargs)
* [shellPath](#optional-shellpath)
* [strictEnv](#optional-strictenv)

## Properties

### `Optional` cwd

• **cwd**? : *string*

A path or Uri for the current working directory to be used for the terminal.

___

### `Optional` env

• **env**? : *object*

Object with environment variables that will be added to the VS Code process.

#### Type declaration:

* \[ **_**: *string*\]: string

___

### `Optional` hideFromUser

• **hideFromUser**? : *boolean*

When enabled the terminal will run the process as normal but not be surfaced to the user
until `Terminal.show` is called. The typical usage for this is when you need to run
something that may need interactivity but only want to tell the user about it when
interaction is needed. Note that the terminals will still be exposed to all extensions
as normal.

___

### `Optional` name

• **name**? : *string*

A human-readable string which will be used to represent the terminal in the UI.

___

### `Optional` shellArgs

• **shellArgs**? : *string[]*

Args for the custom shell executable. A string can be used on Windows only which allows
specifying shell args in [command-line format](https://msdn.microsoft.com/en-au/08dfcab2-eb6e-49a4-80eb-87d4076c98c6).

___

### `Optional` shellPath

• **shellPath**? : *string*

A path to a custom shell executable to be used in the terminal.

___

### `Optional` strictEnv

• **strictEnv**? : *boolean*

Whether the terminal process environment should be exactly as provided in
`TerminalOptions.env`. When this is false (default), the environment will be based on the
window's environment and also apply configured platform settings like
`terminal.integrated.windows.env` on top. When this is true, the complete environment
must be provided as nothing will be inherited from the process or any configuration.


<a name="interfaces_vscode_gen_terminalstatemd"></a>


# Interface: TerminalState

TerminalState (to be accessed only via `Terminal.Cfg`) is a snapshot of `Terminal` state. It is auto-updated whenever `Terminal` creations and method calls resolve or its event subscribers (if any) are invoked. All read-only properties are exposed as function-valued fields.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **TerminalState**

## Index

### Properties

* [Name](#name)
* [ReFetch](#refetch)
* [__holder__](#__holder__)
* [__loadFromJsonish__](#__loadfromjsonish__)

## Properties

###  Name

• **Name**: *function*

The name of the terminal.

#### Type declaration:

▸ (): *string*

___

###  ReFetch

• **ReFetch**: *function*

#### Type declaration:

▸ (): *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  __holder__

• **__holder__**: *[Terminal](#interfaces_vscode_gen_terminalmd)*

___

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |


<a name="interfaces_vscode_gen_vscodemd"></a>


# Interface: Vscode

Type Definition for Visual Studio Code 1.39 Extension API
See https://code.visualstudio.com/api for more information

## Hierarchy

* **Vscode**

## Implemented by

* [impl](#classes_vscode_gen_implmd)
* [impl](#classes_core_implmd)

## Index

### Properties

* [Commands](#commands)
* [Env](#env)
* [Extensions](#extensions)
* [Languages](#languages)
* [Window](#window)
* [Workspace](#workspace)

## Properties

###  Commands

• **Commands**: *[Commands](#interfaces_vscode_gen_commandsmd)*

Namespace for dealing with commands. In short, a command is a function with a
unique identifier. The function is sometimes also called _command handler_.

Commands can be added to the editor using the [registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
and [registerTextEditorCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerTextEditorCommand) functions. Commands
can be executed [manually](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand) or from a UI gesture. Those are:

* palette - Use the `commands`-section in `package.json` to make a command show in
the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
* keybinding - Use the `keybindings`-section in `package.json` to enable
[keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
for your extension.

Commands from other extensions and from the editor itself are accessible to an extension. However,
when invoking an editor command not all argument types are supported.

This is a sample that registers a command handler and adds an entry for that command to the palette. First
register a command handler with the identifier `extension.sayHello`.

```javascript

commands.registerCommand('extension.sayHello', () => {
 	window.showInformationMessage('Hello World!');
});

```

Second, bind the command identifier to a title under which it will show in the palette (`package.json`).

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

___

###  Env

• **Env**: *[Env](#interfaces_vscode_gen_envmd)*

Namespace describing the environment the editor runs in.

___

###  Extensions

• **Extensions**: *[Extensions](#interfaces_vscode_gen_extensionsmd)*

Namespace for dealing with installed extensions. Extensions are represented
by an [extension](https://code.visualstudio.com/api/references/vscode-api#Extension)-interface which enables reflection on them.

Extension writers can provide APIs to other extensions by returning their API public
surface from the `activate`-call.

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

When depending on the API of another extension add an `extensionDependency`-entry
to `package.json`, and use the [getExtension](https://code.visualstudio.com/api/references/vscode-api#extensions.getExtension)-function
and the [exports](https://code.visualstudio.com/api/references/vscode-api#Extension.exports)-property, like below:

```javascript

let mathExt = extensions.getExtension('genius.math');
let importedApi = mathExt.exports;

console.log(importedApi.mul(42, 1));

```

___

###  Languages

• **Languages**: *[Languages](#interfaces_vscode_gen_languagesmd)*

Namespace for participating in language-specific editor [features](https://code.visualstudio.com/docs/editor/editingevolved),
like IntelliSense, code actions, diagnostics etc.

Many programming languages exist and there is huge variety in syntaxes, semantics, and paradigms. Despite that, features
like automatic word-completion, code navigation, or code checking have become popular across different tools for different
programming languages.

The editor provides an API that makes it simple to provide such common features by having all UI and actions already in place and
by allowing you to participate by providing data only. For instance, to contribute a hover all you have to do is provide a function
that can be called with a [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument) and a [Position](#Position) returning hover info. The rest, like tracking the
mouse, positioning the hover, keeping the hover stable etc. is taken care of by the editor.

```javascript

languages.registerHoverProvider('javascript', {
 	provideHover(document, position, token) {
 		return new Hover('I am a hover!');
 	}
});

```

Registration is done using a [document selector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a language id, like `javascript` or
a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`. Matching a document against such
a selector will result in a [score](https://code.visualstudio.com/api/references/vscode-api#languages.match) that is used to determine if and how a provider shall be used. When
scores are equal the provider that came last wins. For features that allow full arity, like [hover](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider),
the score is only checked to be `>0`, for other features, like [IntelliSense](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider) the
score is used for determining the order in which providers are asked to participate.

___

###  Window

• **Window**: *[Window](#interfaces_vscode_gen_windowmd)*

Namespace for dealing with the current window of the editor. That is visible
and active editors, as well as, UI elements to show messages, selections, and
asking for user input.

___

###  Workspace

• **Workspace**: *[Workspace](#interfaces_vscode_gen_workspacemd)*

Namespace for dealing with the current workspace. A workspace is the representation
of the folder that has been opened. There is no workspace when just a file but not a
folder has been opened.

The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
the editor-process so that they should be always used instead of nodejs-equivalents.


<a name="interfaces_vscode_gen_windowmd"></a>


# Interface: Window

Namespace for dealing with the current window of the editor. That is visible
and active editors, as well as, UI elements to show messages, selections, and
asking for user input.

## Hierarchy

* **Window**

## Implemented by

* [implWindow](#classes_vscode_gen_implwindowmd)

## Index

### Properties

* [CreateInputBox](#createinputbox)
* [CreateOutputChannel](#createoutputchannel)
* [CreateQuickPick](#createquickpick)
* [CreateStatusBarItem](#createstatusbaritem)
* [CreateTerminal](#createterminal)
* [OnDidChangeWindowState](#ondidchangewindowstate)
* [SetStatusBarMessage](#setstatusbarmessage)
* [ShowErrorMessage](#showerrormessage)
* [ShowInformationMessage](#showinformationmessage)
* [ShowInputBox](#showinputbox)
* [ShowOpenDialog](#showopendialog)
* [ShowQuickPick](#showquickpick)
* [ShowSaveDialog](#showsavedialog)
* [ShowWarningMessage](#showwarningmessage)
* [ShowWorkspaceFolderPick](#showworkspacefolderpick)
* [State](#state)

## Properties

###  CreateInputBox

• **CreateInputBox**: *function*

Creates a [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox) to let the user enter some text input.

Note that in many cases the more convenient [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
is easier to use. [window.createInputBox](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox) should be used
when [window.showInputBox](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox) does not offer the required flexibility.

**`returns`** A new [InputBox](https://code.visualstudio.com/api/references/vscode-api#InputBox).

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [InputBox](#interfaces_vscode_gen_inputboxmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [InputBox](#interfaces_vscode_gen_inputboxmd) |

___

###  CreateOutputChannel

• **CreateOutputChannel**: *function*

Creates a new [output channel](https://code.visualstudio.com/api/references/vscode-api#OutputChannel) with the given name.

**`param`** Human-readable string which will be used to represent the channel in the UI.

**`returns`** a thenable that resolves to the newly created `OutputChannel`.

#### Type declaration:

▸ (`name`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |

___

###  CreateQuickPick

• **CreateQuickPick**: *function*

Creates a [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick) to let the user pick an item from a list
of items of type T.

Note that in many cases the more convenient [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
is easier to use. [window.createQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick) should be used
when [window.showQuickPick](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick) does not offer the required flexibility.

**`returns`** A new [QuickPick](https://code.visualstudio.com/api/references/vscode-api#QuickPick).

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [QuickPick](#interfaces_vscode_gen_quickpickmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPick](#interfaces_vscode_gen_quickpickmd) |

___

###  CreateStatusBarItem

• **CreateStatusBarItem**: *function*

Creates a status bar [item](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem).

**`param`** The alignment of the item.

**`param`** The priority of the item. Higher values mean the item should be shown more to the left.

**`returns`** A new status bar item.

#### Type declaration:

▸ (`alignment?`: [StatusBarAlignment](#enums_vscode_gen_statusbaralignmentmd), `priority?`: number): *function*

**Parameters:**

Name | Type |
------ | ------ |
`alignment?` | [StatusBarAlignment](#enums_vscode_gen_statusbaralignmentmd) |
`priority?` | number |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd) |

___

###  CreateTerminal

• **CreateTerminal**: *function*

Creates a [Terminal](https://code.visualstudio.com/api/references/vscode-api#Terminal) with a backing shell process.

**`param`** A TerminalOptions object describing the characteristics of the new terminal.

**`returns`** A new Terminal.

#### Type declaration:

▸ (`options`: [TerminalOptions](#interfaces_vscode_gen_terminaloptionsmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [TerminalOptions](#interfaces_vscode_gen_terminaloptionsmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Terminal](#interfaces_vscode_gen_terminalmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Terminal](#interfaces_vscode_gen_terminalmd) |

___

###  OnDidChangeWindowState

• **OnDidChangeWindowState**: *function*

An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the focus state of the current window
changes. The value of the event represents whether the window is focused.

**`param`** will be invoked whenever the `OnDidChangeWindowState` event fires (mandatory, not optional).

**`returns`** A `Disposable` that will unsubscribe `listener` from the `OnDidChangeWindowState` event on `Dispose`.

#### Type declaration:

▸ (`listener`: function): *function*

**Parameters:**

▪ **listener**: *function*

▸ (`_`: [WindowState](#interfaces_vscode_gen_windowstatemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WindowState](#interfaces_vscode_gen_windowstatemd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  SetStatusBarMessage

• **SetStatusBarMessage**: *function*

Set a message to the status bar. This is a short hand for the more powerful
status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).

**`param`** The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).

**`param`** Timeout in milliseconds after which the message will be disposed.

**`returns`** A disposable which hides the status bar message.

#### Type declaration:

▸ (`text`: string, `hideAfterTimeout`: number): *function*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`hideAfterTimeout` | number |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  ShowErrorMessage

• **ShowErrorMessage**: *function*

Show an error message.

**`param`** The message to show.

**`param`** A set of items that will be rendered as actions in the message.

**`returns`** A thenable that resolves to the selected item or `undefined` when being dismissed.

#### Type declaration:

▸ (`message`: string, `items`: string[]): *function*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`items` | string[] |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowInformationMessage

• **ShowInformationMessage**: *function*

Show an information message to users. Optionally provide an array of items which will be presented as
clickable buttons.

**`param`** The message to show.

**`param`** A set of items that will be rendered as actions in the message.

**`returns`** A thenable that resolves to the selected item or `undefined` when being dismissed.

#### Type declaration:

▸ (`message`: string, `items`: string[]): *function*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`items` | string[] |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowInputBox

• **ShowInputBox**: *function*

Opens an input box to ask the user for input.

The returned value will be `undefined` if the input box was canceled (e.g. pressing ESC). Otherwise the
returned value will be the string typed by the user or an empty string if the user did not type
anything but dismissed the input box with OK.

**`param`** Configures the behavior of the input box.

**`param`** A token that can be used to signal cancellation.

**`returns`** A promise that resolves to a string the user provided or to `undefined` in case of dismissal.

#### Type declaration:

▸ (`options?`: [InputBoxOptions](#interfaces_vscode_gen_inputboxoptionsmd), `token?`: [Cancel](#classes_core_cancelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [InputBoxOptions](#interfaces_vscode_gen_inputboxoptionsmd) |
`token?` | [Cancel](#classes_core_cancelmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowOpenDialog

• **ShowOpenDialog**: *function*

Shows a file open dialog to the user which allows to select a file
for opening-purposes.

**`param`** Options that control the dialog.

**`returns`** A promise that resolves to the selected resources or `undefined`.

#### Type declaration:

▸ (`options`: [OpenDialogOptions](#interfaces_vscode_gen_opendialogoptionsmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [OpenDialogOptions](#interfaces_vscode_gen_opendialogoptionsmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string[] |

___

###  ShowQuickPick

• **ShowQuickPick**: *function*

Shows a selection list.

**`param`** An array of items.

**`param`** Configures the behavior of the selection list.

**`param`** A token that can be used to signal cancellation.

**`returns`** A promise that resolves to the selected items or `undefined`.

#### Type declaration:

▸ (`items`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[], `options`: [QuickPickOptions](#interfaces_vscode_gen_quickpickoptionsmd), `token?`: [Cancel](#classes_core_cancelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`items` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[] |
`options` | [QuickPickOptions](#interfaces_vscode_gen_quickpickoptionsmd) |
`token?` | [Cancel](#classes_core_cancelmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[] |

___

###  ShowSaveDialog

• **ShowSaveDialog**: *function*

Shows a file save dialog to the user which allows to select a file
for saving-purposes.

**`param`** Options that control the dialog.

**`returns`** A promise that resolves to the selected resource or `undefined`.

#### Type declaration:

▸ (`options`: [SaveDialogOptions](#interfaces_vscode_gen_savedialogoptionsmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [SaveDialogOptions](#interfaces_vscode_gen_savedialogoptionsmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowWarningMessage

• **ShowWarningMessage**: *function*

Show a warning message.

**`param`** The message to show.

**`param`** A set of items that will be rendered as actions in the message.

**`returns`** A thenable that resolves to the selected item or `undefined` when being dismissed.

#### Type declaration:

▸ (`message`: string, `items`: string[]): *function*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`items` | string[] |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  ShowWorkspaceFolderPick

• **ShowWorkspaceFolderPick**: *function*

Shows a selection list of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) to pick from.
Returns `undefined` if no folder is open.

**`param`** Configures the behavior of the workspace folder list.

**`returns`** A promise that resolves to the workspace folder or `undefined`.

#### Type declaration:

▸ (`options?`: [WorkspaceFolderPickOptions](#interfaces_vscode_gen_workspacefolderpickoptionsmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [WorkspaceFolderPickOptions](#interfaces_vscode_gen_workspacefolderpickoptionsmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd) |

___

###  State

• **State**: *function*

Represents the current window's state.

**`returns`** a thenable that resolves when this `State` call has successfully completed at the VSC side and its `WindowState` result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WindowState](#interfaces_vscode_gen_windowstatemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WindowState](#interfaces_vscode_gen_windowstatemd) |


<a name="interfaces_vscode_gen_windowstatemd"></a>


# Interface: WindowState

Represents the state of a window.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **WindowState**

## Index

### Properties

* [__loadFromJsonish__](#__loadfromjsonish__)
* [focused](#focused)

## Properties

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  focused

• **focused**: *boolean*

Whether the current window is focused.


<a name="interfaces_vscode_gen_withdispmd"></a>


# Interface: withDisp

## Hierarchy

* **withDisp**

  ↳ [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)

  ↳ [OutputChannel](#interfaces_vscode_gen_outputchannelmd)

  ↳ [InputBox](#interfaces_vscode_gen_inputboxmd)

  ↳ [QuickPick](#interfaces_vscode_gen_quickpickmd)

  ↳ [Terminal](#interfaces_vscode_gen_terminalmd)

  ↳ [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)

## Index

### Properties

* [__disp__](#__disp__)

## Properties

###  __disp__

• **__disp__**: *[Disposable](#classes_core_disposablemd)*


<a name="interfaces_vscode_gen_withstatemd"></a>


# Interface: withState <**T**>

## Type parameters

▪ **T**: *[fromJson](#interfaces_vscode_gen_fromjsonmd)*

## Hierarchy

* **withState**

  ↳ [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)

  ↳ [OutputChannel](#interfaces_vscode_gen_outputchannelmd)

  ↳ [InputBox](#interfaces_vscode_gen_inputboxmd)

  ↳ [QuickPick](#interfaces_vscode_gen_quickpickmd)

  ↳ [Terminal](#interfaces_vscode_gen_terminalmd)

  ↳ [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)

## Index

### Properties

* [Cfg](#cfg)
* [toJSON](#tojson)

## Properties

###  Cfg

• **Cfg**: *T*

___

###  toJSON

• **toJSON**: *function*

#### Type declaration:

▸ (): *any*


<a name="interfaces_vscode_gen_workspacemd"></a>


# Interface: Workspace

Namespace for dealing with the current workspace. A workspace is the representation
of the folder that has been opened. There is no workspace when just a file but not a
folder has been opened.

The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
the editor-process so that they should be always used instead of nodejs-equivalents.

## Hierarchy

* **Workspace**

## Implemented by

* [implWorkspace](#classes_vscode_gen_implworkspacemd)

## Index

### Properties

* [AllProperties](#allproperties)
* [AsRelativePath](#asrelativepath)
* [CreateFileSystemWatcher](#createfilesystemwatcher)
* [FindFiles](#findfiles)
* [GetWorkspaceFolder](#getworkspacefolder)
* [Name](#name)
* [OnDidChangeWorkspaceFolders](#ondidchangeworkspacefolders)
* [SaveAll](#saveall)
* [WorkspaceFile](#workspacefile)
* [WorkspaceFolders](#workspacefolders)

## Properties

###  AllProperties

• **AllProperties**: *function*

Provides single-call access to numerous individual `Workspace` properties at once.

**`returns`** a thenable that resolves when this `AllProperties` call has successfully completed at the VSC side and its `WorkspaceState` result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WorkspaceState](#interfaces_vscode_gen_workspacestatemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceState](#interfaces_vscode_gen_workspacestatemd) |

___

###  AsRelativePath

• **AsRelativePath**: *function*

Returns a path that is relative to the workspace folder or folders.

When there are no [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) or when the path
is not contained in them, the input is returned.

**`param`** A path or uri. When a uri is given its [fsPath](https://code.visualstudio.com/api/references/vscode-api#Uri.fsPath) is used.

**`param`** When `true` and when the given path is contained inside a workspace folder the name of the workspace is prepended. Defaults to `true` when there are multiple workspace folders and `false` otherwise.

**`returns`** A path relative to the root or the input.

#### Type declaration:

▸ (`pathOrUri`: string, `includeWorkspaceFolder`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`pathOrUri` | string |
`includeWorkspaceFolder` | boolean |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  CreateFileSystemWatcher

• **CreateFileSystemWatcher**: *function*

Creates a file system watcher.

A glob pattern that filters the file events on their absolute path must be provided. Optionally,
flags to ignore certain kinds of events can be provided. To stop listening to events the watcher must be disposed.

*Note* that only files within the current [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) can be watched.

**`param`** A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that is applied to the absolute paths of created, changed, and deleted files. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern) to limit events to a certain [workspace folder](#WorkspaceFolder).

**`param`** Ignore when files have been created.

**`param`** Ignore when files have been changed.

**`param`** Ignore when files have been deleted.

**`returns`** A new file system watcher instance.

#### Type declaration:

▸ (`globPattern`: string, `ignoreCreateEvents`: boolean, `ignoreChangeEvents`: boolean, `ignoreDeleteEvents`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`globPattern` | string |
`ignoreCreateEvents` | boolean |
`ignoreChangeEvents` | boolean |
`ignoreDeleteEvents` | boolean |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd) |

___

###  FindFiles

• **FindFiles**: *function*

Find files across all [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) in the workspace.
`findFiles('**​/*.js', '**​/node_modules/**', 10)`

**`param`** A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines the files to search for. The glob pattern will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern) to restrict the search results to a [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder).

**`param`** A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines files and folders to exclude. The glob pattern will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will apply, when `null` no excludes will apply.

**`param`** An upper-bound for the result.

**`param`** A token that can be used to signal cancellation to the underlying search engine.

**`returns`** A thenable that resolves to an array of resource identifiers. Will return no results if no [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) are opened.

#### Type declaration:

▸ (`include`: string, `exclude?`: string, `maxResults?`: number, `token?`: [Cancel](#classes_core_cancelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`include` | string |
`exclude?` | string |
`maxResults?` | number |
`token?` | [Cancel](#classes_core_cancelmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string[] |

___

###  GetWorkspaceFolder

• **GetWorkspaceFolder**: *function*

Returns the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) that contains a given uri.
* returns `undefined` when the given uri doesn't match any workspace folder
* returns the *input* when the given uri is a workspace folder itself

**`param`** An uri.

**`returns`** A workspace folder or `undefined`

#### Type declaration:

▸ (`uri`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`uri` | string |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd) |

___

###  Name

• **Name**: *function*

The name of the workspace. `undefined` when no folder
has been opened.

**`returns`** a thenable that resolves when this `Name` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  OnDidChangeWorkspaceFolders

• **OnDidChangeWorkspaceFolders**: *function*

An event that is emitted when a workspace folder is added or removed.

**`param`** will be invoked whenever the `OnDidChangeWorkspaceFolders` event fires (mandatory, not optional).

**`returns`** A `Disposable` that will unsubscribe `listener` from the `OnDidChangeWorkspaceFolders` event on `Dispose`.

#### Type declaration:

▸ (`listener`: function): *function*

**Parameters:**

▪ **listener**: *function*

▸ (`_`: [WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd) |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  SaveAll

• **SaveAll**: *function*

Save all dirty files.

**`param`** Also save files that have been created during this session.

**`returns`** A thenable that resolves when the files have been saved.

#### Type declaration:

▸ (`includeUntitled`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`includeUntitled` | boolean |

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | boolean |

___

###  WorkspaceFile

• **WorkspaceFile**: *function*

The location of the workspace file, for example:

`file:///Users/name/Development/myProject.code-workspace`

or

`untitled:1555503116870`

for a workspace that is untitled and not yet saved.

Depending on the workspace that is opened, the value will be:
  * `undefined` when no workspace or  a single folder is opened
  * the path of the workspace file as `Uri` otherwise. if the workspace
is untitled, the returned URI will use the `untitled:` scheme

The location can e.g. be used with the `vscode.openFolder` command to
open the workspace again after it has been closed.

**Example:**

```typescript

vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);

```

**Note:** it is not advised to use `workspace.workspaceFile` to write
configuration data into the file. You can use `workspace.getConfiguration().update()`
for that purpose which will work both when a single folder is opened as
well as an untitled or saved workspace.

**`returns`** a thenable that resolves when this `WorkspaceFile` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

___

###  WorkspaceFolders

• **WorkspaceFolders**: *function*

List of workspace folders or `undefined` when no folder is open.
*Note* that the first entry corresponds to the value of `rootPath`.

**`returns`** a thenable that resolves when this `WorkspaceFolders` call has successfully completed at the VSC side and its result received back at our end.

#### Type declaration:

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)[] |


<a name="interfaces_vscode_gen_workspacefoldermd"></a>


# Interface: WorkspaceFolder

A workspace folder is one of potentially many roots opened by the editor. All workspace folders
are equal which means there is no notion of an active or master workspace folder.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **WorkspaceFolder**

## Index

### Properties

* [__loadFromJsonish__](#__loadfromjsonish__)
* [index](#index)
* [name](#name)
* [uri](#uri)

## Properties

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  index

• **index**: *number*

The ordinal number of this workspace folder.

___

###  name

• **name**: *string*

The name of this workspace folder. Defaults to
the basename of its [uri-path](https://code.visualstudio.com/api/references/vscode-api#Uri.path)

___

###  uri

• **uri**: *string*

The associated uri for this workspace folder.

*Note:* The [Uri](https://code.visualstudio.com/api/references/vscode-api#Uri)-type was intentionally chosen such that future releases of the editor can support
workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.


<a name="interfaces_vscode_gen_workspacefolderpickoptionsmd"></a>


# Interface: WorkspaceFolderPickOptions

Options to configure the behaviour of the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) pick UI.

## Hierarchy

* **WorkspaceFolderPickOptions**

## Index

### Properties

* [ignoreFocusOut](#optional-ignorefocusout)
* [placeHolder](#optional-placeholder)

## Properties

### `Optional` ignoreFocusOut

• **ignoreFocusOut**? : *boolean*

Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.

___

### `Optional` placeHolder

• **placeHolder**? : *string*

An optional string to show as place holder in the input box to guide the user what to pick on.


<a name="interfaces_vscode_gen_workspacefolderschangeeventmd"></a>


# Interface: WorkspaceFoldersChangeEvent

An event describing a change to the set of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders).

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **WorkspaceFoldersChangeEvent**

## Index

### Properties

* [__loadFromJsonish__](#__loadfromjsonish__)
* [added](#added)
* [removed](#removed)

## Properties

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

###  added

• **added**: *[WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)[]*

Added workspace folders.

___

###  removed

• **removed**: *[WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)[]*

Removed workspace folders.


<a name="interfaces_vscode_gen_workspacestatemd"></a>


# Interface: WorkspaceState

WorkspaceState gathers various properties of `Workspace`, obtainable via its `AllProperties` method.

## Hierarchy

* [fromJson](#interfaces_vscode_gen_fromjsonmd)

  ↳ **WorkspaceState**

## Index

### Properties

* [__loadFromJsonish__](#__loadfromjsonish__)
* [name](#optional-name)
* [workspaceFile](#optional-workspacefile)
* [workspaceFolders](#optional-workspacefolders)

## Properties

###  __loadFromJsonish__

• **__loadFromJsonish__**: *function*

*Inherited from [fromJson](#interfaces_vscode_gen_fromjsonmd).[__loadFromJsonish__](#__loadfromjsonish__)*

#### Type declaration:

▸ (`_`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

___

### `Optional` name

• **name**? : *string*

The name of the workspace. `undefined` when no folder
has been opened.

___

### `Optional` workspaceFile

• **workspaceFile**? : *string*

The location of the workspace file, for example:

`file:///Users/name/Development/myProject.code-workspace`

or

`untitled:1555503116870`

for a workspace that is untitled and not yet saved.

Depending on the workspace that is opened, the value will be:
  * `undefined` when no workspace or  a single folder is opened
  * the path of the workspace file as `Uri` otherwise. if the workspace
is untitled, the returned URI will use the `untitled:` scheme

The location can e.g. be used with the `vscode.openFolder` command to
open the workspace again after it has been closed.

**Example:**

```typescript

vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);

```

**Note:** it is not advised to use `workspace.workspaceFile` to write
configuration data into the file. You can use `workspace.getConfiguration().update()`
for that purpose which will work both when a single folder is opened as
well as an untitled or saved workspace.

___

### `Optional` workspaceFolders

• **workspaceFolders**? : *[WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)[]*

List of workspace folders or `undefined` when no folder is open.
*Note* that the first entry corresponds to the value of `rootPath`.


<a name="modules_core_md"></a>


# External module: "core"

## Index

### Classes

* [Cancel](#classes_core_cancelmd)
* [Disposable](#classes_core_disposablemd)
* [impl](#classes_core_implmd)
* [ipcMsg](#classes_core_ipcmsgmd)

### Type aliases

* [dict](#dict)

## Type aliases

###  dict

Ƭ **dict**: *object*

#### Type declaration:

* \[ **_**: *string*\]: any


<a name="modules_vsc_appz_md"></a>


# External module: "vsc-appz"

## Index

### Functions

* [CancelIn](#cancelin)
* [Main](#main)
* [OnError](#let-onerror)

## Functions

###  CancelIn

▸ **CancelIn**(`msFromNow`: number): *[Cancel](#classes_core_cancelmd)*

Returns a new `Cancel` with its `Now` already scheduled to be called in `msFromNow` milliseconds.

**Parameters:**

Name | Type |
------ | ------ |
`msFromNow` | number |

**Returns:** *[Cancel](#classes_core_cancelmd)*

___

###  Main

▸ **Main**(`main`: function, `stdIn?`: ReadStream, `stdOut?`: WriteStream): *void*

Creates a `Vscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `process.stdin`, and `stdOut` defaulting to `process.stdout`), then loops forever to never `return`.

**Parameters:**

▪ **main**: *function*

called whenever the counterparty demands, which usually means once at startup.

▸ (`_`: [Vscode](#interfaces_vscode_gen_vscodemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Vscode](#interfaces_vscode_gen_vscodemd) |

▪`Optional`  **stdIn**: *ReadStream*

▪`Optional`  **stdOut**: *WriteStream*

**Returns:** *void*

___

### `Let` OnError

▸ **OnError**(`_this`: [Vscode](#interfaces_vscode_gen_vscodemd), `err`: any, `jsonMsg?`: any): *void*

Reports problems during the ongoing forever-looping stdin/stdout communication
with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `null` or `undefined`.
Any of its args must be checked for `null`/`undefined`-ness by your `OnError` handler.

**Parameters:**

Name | Type |
------ | ------ |
`_this` | [Vscode](#interfaces_vscode_gen_vscodemd) |
`err` | any |
`jsonMsg?` | any |

**Returns:** *void*


<a name="modules_vscode_gen_md"></a>


# External module: "vscode.gen"

## Index

### Enumerations

* [StatusBarAlignment](#enums_vscode_gen_statusbaralignmentmd)

### Classes

* [impl](#classes_vscode_gen_implmd)
* [implBase](#classes_vscode_gen_implbasemd)
* [implClipboard](#classes_vscode_gen_implclipboardmd)
* [implCommands](#classes_vscode_gen_implcommandsmd)
* [implEnv](#classes_vscode_gen_implenvmd)
* [implExtensions](#classes_vscode_gen_implextensionsmd)
* [implLanguages](#classes_vscode_gen_impllanguagesmd)
* [implWindow](#classes_vscode_gen_implwindowmd)
* [implWorkspace](#classes_vscode_gen_implworkspacemd)

### Interfaces

* [Clipboard](#interfaces_vscode_gen_clipboardmd)
* [Commands](#interfaces_vscode_gen_commandsmd)
* [DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd)
* [Env](#interfaces_vscode_gen_envmd)
* [EnvState](#interfaces_vscode_gen_envstatemd)
* [Extensions](#interfaces_vscode_gen_extensionsmd)
* [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)
* [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)
* [InputBox](#interfaces_vscode_gen_inputboxmd)
* [InputBoxOptions](#interfaces_vscode_gen_inputboxoptionsmd)
* [InputBoxState](#interfaces_vscode_gen_inputboxstatemd)
* [Languages](#interfaces_vscode_gen_languagesmd)
* [OpenDialogOptions](#interfaces_vscode_gen_opendialogoptionsmd)
* [OutputChannel](#interfaces_vscode_gen_outputchannelmd)
* [OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd)
* [QuickInputButton](#interfaces_vscode_gen_quickinputbuttonmd)
* [QuickPick](#interfaces_vscode_gen_quickpickmd)
* [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)
* [QuickPickOptions](#interfaces_vscode_gen_quickpickoptionsmd)
* [QuickPickState](#interfaces_vscode_gen_quickpickstatemd)
* [SaveDialogOptions](#interfaces_vscode_gen_savedialogoptionsmd)
* [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)
* [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)
* [Terminal](#interfaces_vscode_gen_terminalmd)
* [TerminalOptions](#interfaces_vscode_gen_terminaloptionsmd)
* [TerminalState](#interfaces_vscode_gen_terminalstatemd)
* [Vscode](#interfaces_vscode_gen_vscodemd)
* [Window](#interfaces_vscode_gen_windowmd)
* [WindowState](#interfaces_vscode_gen_windowstatemd)
* [Workspace](#interfaces_vscode_gen_workspacemd)
* [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)
* [WorkspaceFolderPickOptions](#interfaces_vscode_gen_workspacefolderpickoptionsmd)
* [WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd)
* [WorkspaceState](#interfaces_vscode_gen_workspacestatemd)
* [fromJson](#interfaces_vscode_gen_fromjsonmd)
* [withDisp](#interfaces_vscode_gen_withdispmd)
* [withState](#interfaces_vscode_gen_withstatemd)

### Type aliases

* [Cancel](#cancel)
* [Disposable](#disposable)
* [ipcMsg](#ipcmsg)

### Functions

* [DiagnosticChangeEvent___loadFromJsonish__](#diagnosticchangeevent___loadfromjsonish__)
* [EnvState___loadFromJsonish__](#envstate___loadfromjsonish__)
* [FileSystemWatcherState_ApplyChanges](#filesystemwatcherstate_applychanges)
* [FileSystemWatcherState_ReFetch](#filesystemwatcherstate_refetch)
* [FileSystemWatcherState___loadFromJsonish__](#filesystemwatcherstate___loadfromjsonish__)
* [FileSystemWatcher_Dispose](#filesystemwatcher_dispose)
* [FileSystemWatcher_OnDidChange](#filesystemwatcher_ondidchange)
* [FileSystemWatcher_OnDidCreate](#filesystemwatcher_ondidcreate)
* [FileSystemWatcher_OnDidDelete](#filesystemwatcher_ondiddelete)
* [FileSystemWatcher___appzObjBagPullFromPeer__](#filesystemwatcher___appzobjbagpullfrompeer__)
* [FileSystemWatcher___appzObjBagPushToPeer__](#filesystemwatcher___appzobjbagpushtopeer__)
* [FileSystemWatcher___loadFromJsonish__](#filesystemwatcher___loadfromjsonish__)
* [InputBoxState_ApplyChanges](#inputboxstate_applychanges)
* [InputBoxState_ReFetch](#inputboxstate_refetch)
* [InputBoxState___loadFromJsonish__](#inputboxstate___loadfromjsonish__)
* [InputBox_Dispose](#inputbox_dispose)
* [InputBox_Hide](#inputbox_hide)
* [InputBox_OnDidAccept](#inputbox_ondidaccept)
* [InputBox_OnDidChangeValue](#inputbox_ondidchangevalue)
* [InputBox_OnDidHide](#inputbox_ondidhide)
* [InputBox_Show](#inputbox_show)
* [InputBox___appzObjBagPullFromPeer__](#inputbox___appzobjbagpullfrompeer__)
* [InputBox___appzObjBagPushToPeer__](#inputbox___appzobjbagpushtopeer__)
* [InputBox___loadFromJsonish__](#inputbox___loadfromjsonish__)
* [OutputChannelState_ReFetch](#outputchannelstate_refetch)
* [OutputChannelState___loadFromJsonish__](#outputchannelstate___loadfromjsonish__)
* [OutputChannel_Append](#outputchannel_append)
* [OutputChannel_AppendLine](#outputchannel_appendline)
* [OutputChannel_Clear](#outputchannel_clear)
* [OutputChannel_Dispose](#outputchannel_dispose)
* [OutputChannel_Hide](#outputchannel_hide)
* [OutputChannel_Show](#outputchannel_show)
* [OutputChannel___appzObjBagPullFromPeer__](#outputchannel___appzobjbagpullfrompeer__)
* [OutputChannel___loadFromJsonish__](#outputchannel___loadfromjsonish__)
* [QuickPickItem___loadFromJsonish__](#quickpickitem___loadfromjsonish__)
* [QuickPickState_ApplyChanges](#quickpickstate_applychanges)
* [QuickPickState_ReFetch](#quickpickstate_refetch)
* [QuickPickState___loadFromJsonish__](#quickpickstate___loadfromjsonish__)
* [QuickPick_Dispose](#quickpick_dispose)
* [QuickPick_Hide](#quickpick_hide)
* [QuickPick_OnDidAccept](#quickpick_ondidaccept)
* [QuickPick_OnDidChangeActive](#quickpick_ondidchangeactive)
* [QuickPick_OnDidChangeSelection](#quickpick_ondidchangeselection)
* [QuickPick_OnDidChangeValue](#quickpick_ondidchangevalue)
* [QuickPick_OnDidHide](#quickpick_ondidhide)
* [QuickPick_Show](#quickpick_show)
* [QuickPick___appzObjBagPullFromPeer__](#quickpick___appzobjbagpullfrompeer__)
* [QuickPick___appzObjBagPushToPeer__](#quickpick___appzobjbagpushtopeer__)
* [QuickPick___loadFromJsonish__](#quickpick___loadfromjsonish__)
* [StatusBarItemState_ApplyChanges](#statusbaritemstate_applychanges)
* [StatusBarItemState_ReFetch](#statusbaritemstate_refetch)
* [StatusBarItemState___loadFromJsonish__](#statusbaritemstate___loadfromjsonish__)
* [StatusBarItem_Dispose](#statusbaritem_dispose)
* [StatusBarItem_Hide](#statusbaritem_hide)
* [StatusBarItem_Show](#statusbaritem_show)
* [StatusBarItem___appzObjBagPullFromPeer__](#statusbaritem___appzobjbagpullfrompeer__)
* [StatusBarItem___appzObjBagPushToPeer__](#statusbaritem___appzobjbagpushtopeer__)
* [StatusBarItem___loadFromJsonish__](#statusbaritem___loadfromjsonish__)
* [TerminalState_ReFetch](#terminalstate_refetch)
* [TerminalState___loadFromJsonish__](#terminalstate___loadfromjsonish__)
* [Terminal_Dispose](#terminal_dispose)
* [Terminal_Hide](#terminal_hide)
* [Terminal_SendText](#terminal_sendtext)
* [Terminal_Show](#terminal_show)
* [Terminal___appzObjBagPullFromPeer__](#terminal___appzobjbagpullfrompeer__)
* [Terminal___loadFromJsonish__](#terminal___loadfromjsonish__)
* [WindowState___loadFromJsonish__](#windowstate___loadfromjsonish__)
* [WorkspaceFolder___loadFromJsonish__](#workspacefolder___loadfromjsonish__)
* [WorkspaceFoldersChangeEvent___loadFromJsonish__](#workspacefolderschangeevent___loadfromjsonish__)
* [WorkspaceState___loadFromJsonish__](#workspacestate___loadfromjsonish__)
* [newDiagnosticChangeEvent](#newdiagnosticchangeevent)
* [newDisposable](#newdisposable)
* [newEnvState](#newenvstate)
* [newFileSystemWatcher](#newfilesystemwatcher)
* [newFileSystemWatcherState](#newfilesystemwatcherstate)
* [newInputBox](#newinputbox)
* [newInputBoxState](#newinputboxstate)
* [newOutputChannel](#newoutputchannel)
* [newOutputChannelState](#newoutputchannelstate)
* [newQuickPick](#newquickpick)
* [newQuickPickItem](#newquickpickitem)
* [newQuickPickState](#newquickpickstate)
* [newStatusBarItem](#newstatusbaritem)
* [newStatusBarItemState](#newstatusbaritemstate)
* [newTerminal](#newterminal)
* [newTerminalState](#newterminalstate)
* [newWindowState](#newwindowstate)
* [newWorkspaceFolder](#newworkspacefolder)
* [newWorkspaceFoldersChangeEvent](#newworkspacefolderschangeevent)
* [newWorkspaceState](#newworkspacestate)
* [newipcMsg](#newipcmsg)

## Type aliases

###  Cancel

Ƭ **Cancel**: *[Cancel](#classes_core_cancelmd)*

___

###  Disposable

Ƭ **Disposable**: *[Disposable](#classes_core_disposablemd)*

___

###  ipcMsg

Ƭ **ipcMsg**: *[ipcMsg](#classes_core_ipcmsgmd)*

## Functions

###  DiagnosticChangeEvent___loadFromJsonish__

▸ **DiagnosticChangeEvent___loadFromJsonish__**(`this`: [DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd) |
`payload` | any |

**Returns:** *boolean*

___

###  EnvState___loadFromJsonish__

▸ **EnvState___loadFromJsonish__**(`this`: [EnvState](#interfaces_vscode_gen_envstatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [EnvState](#interfaces_vscode_gen_envstatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  FileSystemWatcherState_ApplyChanges

▸ **FileSystemWatcherState_ApplyChanges**(`this`: [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  FileSystemWatcherState_ReFetch

▸ **FileSystemWatcherState_ReFetch**(`this`: [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  FileSystemWatcherState___loadFromJsonish__

▸ **FileSystemWatcherState___loadFromJsonish__**(`this`: [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  FileSystemWatcher_Dispose

▸ **FileSystemWatcher_Dispose**(`this`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  FileSystemWatcher_OnDidChange

▸ **FileSystemWatcher_OnDidChange**(`this`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)*

▪ **handler**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  FileSystemWatcher_OnDidCreate

▸ **FileSystemWatcher_OnDidCreate**(`this`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)*

▪ **handler**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  FileSystemWatcher_OnDidDelete

▸ **FileSystemWatcher_OnDidDelete**(`this`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)*

▪ **handler**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  FileSystemWatcher___appzObjBagPullFromPeer__

▸ **FileSystemWatcher___appzObjBagPullFromPeer__**(`this`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  FileSystemWatcher___appzObjBagPushToPeer__

▸ **FileSystemWatcher___appzObjBagPushToPeer__**(`this`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd), `allUpdates?`: [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd) |
`allUpdates?` | [FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  FileSystemWatcher___loadFromJsonish__

▸ **FileSystemWatcher___loadFromJsonish__**(`this`: [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd) |
`payload` | any |

**Returns:** *boolean*

___

###  InputBoxState_ApplyChanges

▸ **InputBoxState_ApplyChanges**(`this`: [InputBoxState](#interfaces_vscode_gen_inputboxstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBoxState](#interfaces_vscode_gen_inputboxstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  InputBoxState_ReFetch

▸ **InputBoxState_ReFetch**(`this`: [InputBoxState](#interfaces_vscode_gen_inputboxstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBoxState](#interfaces_vscode_gen_inputboxstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  InputBoxState___loadFromJsonish__

▸ **InputBoxState___loadFromJsonish__**(`this`: [InputBoxState](#interfaces_vscode_gen_inputboxstatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBoxState](#interfaces_vscode_gen_inputboxstatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  InputBox_Dispose

▸ **InputBox_Dispose**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBox](#interfaces_vscode_gen_inputboxmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  InputBox_Hide

▸ **InputBox_Hide**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBox](#interfaces_vscode_gen_inputboxmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  InputBox_OnDidAccept

▸ **InputBox_OnDidAccept**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[InputBox](#interfaces_vscode_gen_inputboxmd)*

▪ **handler**: *function*

▸ (): *void*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  InputBox_OnDidChangeValue

▸ **InputBox_OnDidChangeValue**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[InputBox](#interfaces_vscode_gen_inputboxmd)*

▪ **handler**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  InputBox_OnDidHide

▸ **InputBox_OnDidHide**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[InputBox](#interfaces_vscode_gen_inputboxmd)*

▪ **handler**: *function*

▸ (): *void*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  InputBox_Show

▸ **InputBox_Show**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBox](#interfaces_vscode_gen_inputboxmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  InputBox___appzObjBagPullFromPeer__

▸ **InputBox___appzObjBagPullFromPeer__**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBox](#interfaces_vscode_gen_inputboxmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  InputBox___appzObjBagPushToPeer__

▸ **InputBox___appzObjBagPushToPeer__**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd), `allUpdates?`: [InputBoxState](#interfaces_vscode_gen_inputboxstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBox](#interfaces_vscode_gen_inputboxmd) |
`allUpdates?` | [InputBoxState](#interfaces_vscode_gen_inputboxstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  InputBox___loadFromJsonish__

▸ **InputBox___loadFromJsonish__**(`this`: [InputBox](#interfaces_vscode_gen_inputboxmd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [InputBox](#interfaces_vscode_gen_inputboxmd) |
`payload` | any |

**Returns:** *boolean*

___

###  OutputChannelState_ReFetch

▸ **OutputChannelState_ReFetch**(`this`: [OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OutputChannelState___loadFromJsonish__

▸ **OutputChannelState___loadFromJsonish__**(`this`: [OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  OutputChannel_Append

▸ **OutputChannel_Append**(`this`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd), `value`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |
`value` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OutputChannel_AppendLine

▸ **OutputChannel_AppendLine**(`this`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd), `value`: string): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |
`value` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OutputChannel_Clear

▸ **OutputChannel_Clear**(`this`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OutputChannel_Dispose

▸ **OutputChannel_Dispose**(`this`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OutputChannel_Hide

▸ **OutputChannel_Hide**(`this`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OutputChannel_Show

▸ **OutputChannel_Show**(`this`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd), `preserveFocus?`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |
`preserveFocus?` | boolean |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OutputChannel___appzObjBagPullFromPeer__

▸ **OutputChannel___appzObjBagPullFromPeer__**(`this`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  OutputChannel___loadFromJsonish__

▸ **OutputChannel___loadFromJsonish__**(`this`: [OutputChannel](#interfaces_vscode_gen_outputchannelmd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [OutputChannel](#interfaces_vscode_gen_outputchannelmd) |
`payload` | any |

**Returns:** *boolean*

___

###  QuickPickItem___loadFromJsonish__

▸ **QuickPickItem___loadFromJsonish__**(`this`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd) |
`payload` | any |

**Returns:** *boolean*

___

###  QuickPickState_ApplyChanges

▸ **QuickPickState_ApplyChanges**(`this`: [QuickPickState](#interfaces_vscode_gen_quickpickstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPickState](#interfaces_vscode_gen_quickpickstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  QuickPickState_ReFetch

▸ **QuickPickState_ReFetch**(`this`: [QuickPickState](#interfaces_vscode_gen_quickpickstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPickState](#interfaces_vscode_gen_quickpickstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  QuickPickState___loadFromJsonish__

▸ **QuickPickState___loadFromJsonish__**(`this`: [QuickPickState](#interfaces_vscode_gen_quickpickstatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPickState](#interfaces_vscode_gen_quickpickstatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  QuickPick_Dispose

▸ **QuickPick_Dispose**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPick](#interfaces_vscode_gen_quickpickmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  QuickPick_Hide

▸ **QuickPick_Hide**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPick](#interfaces_vscode_gen_quickpickmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  QuickPick_OnDidAccept

▸ **QuickPick_OnDidAccept**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[QuickPick](#interfaces_vscode_gen_quickpickmd)*

▪ **handler**: *function*

▸ (): *void*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  QuickPick_OnDidChangeActive

▸ **QuickPick_OnDidChangeActive**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[QuickPick](#interfaces_vscode_gen_quickpickmd)*

▪ **handler**: *function*

▸ (`_`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[] |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  QuickPick_OnDidChangeSelection

▸ **QuickPick_OnDidChangeSelection**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[QuickPick](#interfaces_vscode_gen_quickpickmd)*

▪ **handler**: *function*

▸ (`_`: [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)[] |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  QuickPick_OnDidChangeValue

▸ **QuickPick_OnDidChangeValue**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[QuickPick](#interfaces_vscode_gen_quickpickmd)*

▪ **handler**: *function*

▸ (`_`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  QuickPick_OnDidHide

▸ **QuickPick_OnDidHide**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd), `handler`: function): *function*

**Parameters:**

▪ **this**: *[QuickPick](#interfaces_vscode_gen_quickpickmd)*

▪ **handler**: *function*

▸ (): *void*

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (`_`: [Disposable](#classes_core_disposablemd)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_` | [Disposable](#classes_core_disposablemd) |

___

###  QuickPick_Show

▸ **QuickPick_Show**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPick](#interfaces_vscode_gen_quickpickmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  QuickPick___appzObjBagPullFromPeer__

▸ **QuickPick___appzObjBagPullFromPeer__**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPick](#interfaces_vscode_gen_quickpickmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  QuickPick___appzObjBagPushToPeer__

▸ **QuickPick___appzObjBagPushToPeer__**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd), `allUpdates?`: [QuickPickState](#interfaces_vscode_gen_quickpickstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPick](#interfaces_vscode_gen_quickpickmd) |
`allUpdates?` | [QuickPickState](#interfaces_vscode_gen_quickpickstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  QuickPick___loadFromJsonish__

▸ **QuickPick___loadFromJsonish__**(`this`: [QuickPick](#interfaces_vscode_gen_quickpickmd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [QuickPick](#interfaces_vscode_gen_quickpickmd) |
`payload` | any |

**Returns:** *boolean*

___

###  StatusBarItemState_ApplyChanges

▸ **StatusBarItemState_ApplyChanges**(`this`: [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  StatusBarItemState_ReFetch

▸ **StatusBarItemState_ReFetch**(`this`: [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  StatusBarItemState___loadFromJsonish__

▸ **StatusBarItemState___loadFromJsonish__**(`this`: [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  StatusBarItem_Dispose

▸ **StatusBarItem_Dispose**(`this`: [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  StatusBarItem_Hide

▸ **StatusBarItem_Hide**(`this`: [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  StatusBarItem_Show

▸ **StatusBarItem_Show**(`this`: [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  StatusBarItem___appzObjBagPullFromPeer__

▸ **StatusBarItem___appzObjBagPullFromPeer__**(`this`: [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  StatusBarItem___appzObjBagPushToPeer__

▸ **StatusBarItem___appzObjBagPushToPeer__**(`this`: [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd), `allUpdates?`: [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd) |
`allUpdates?` | [StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  StatusBarItem___loadFromJsonish__

▸ **StatusBarItem___loadFromJsonish__**(`this`: [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [StatusBarItem](#interfaces_vscode_gen_statusbaritemmd) |
`payload` | any |

**Returns:** *boolean*

___

###  TerminalState_ReFetch

▸ **TerminalState_ReFetch**(`this`: [TerminalState](#interfaces_vscode_gen_terminalstatemd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [TerminalState](#interfaces_vscode_gen_terminalstatemd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  TerminalState___loadFromJsonish__

▸ **TerminalState___loadFromJsonish__**(`this`: [TerminalState](#interfaces_vscode_gen_terminalstatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [TerminalState](#interfaces_vscode_gen_terminalstatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  Terminal_Dispose

▸ **Terminal_Dispose**(`this`: [Terminal](#interfaces_vscode_gen_terminalmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [Terminal](#interfaces_vscode_gen_terminalmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Terminal_Hide

▸ **Terminal_Hide**(`this`: [Terminal](#interfaces_vscode_gen_terminalmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [Terminal](#interfaces_vscode_gen_terminalmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Terminal_SendText

▸ **Terminal_SendText**(`this`: [Terminal](#interfaces_vscode_gen_terminalmd), `text`: string, `addNewLine?`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [Terminal](#interfaces_vscode_gen_terminalmd) |
`text` | string |
`addNewLine?` | boolean |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Terminal_Show

▸ **Terminal_Show**(`this`: [Terminal](#interfaces_vscode_gen_terminalmd), `preserveFocus?`: boolean): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [Terminal](#interfaces_vscode_gen_terminalmd) |
`preserveFocus?` | boolean |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Terminal___appzObjBagPullFromPeer__

▸ **Terminal___appzObjBagPullFromPeer__**(`this`: [Terminal](#interfaces_vscode_gen_terminalmd)): *function*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [Terminal](#interfaces_vscode_gen_terminalmd) |

**Returns:** *function*

▸ (`_`: function): *void*

**Parameters:**

▪ **_**: *function*

▸ (): *void*

___

###  Terminal___loadFromJsonish__

▸ **Terminal___loadFromJsonish__**(`this`: [Terminal](#interfaces_vscode_gen_terminalmd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [Terminal](#interfaces_vscode_gen_terminalmd) |
`payload` | any |

**Returns:** *boolean*

___

###  WindowState___loadFromJsonish__

▸ **WindowState___loadFromJsonish__**(`this`: [WindowState](#interfaces_vscode_gen_windowstatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [WindowState](#interfaces_vscode_gen_windowstatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  WorkspaceFolder___loadFromJsonish__

▸ **WorkspaceFolder___loadFromJsonish__**(`this`: [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd) |
`payload` | any |

**Returns:** *boolean*

___

###  WorkspaceFoldersChangeEvent___loadFromJsonish__

▸ **WorkspaceFoldersChangeEvent___loadFromJsonish__**(`this`: [WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd) |
`payload` | any |

**Returns:** *boolean*

___

###  WorkspaceState___loadFromJsonish__

▸ **WorkspaceState___loadFromJsonish__**(`this`: [WorkspaceState](#interfaces_vscode_gen_workspacestatemd), `payload`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [WorkspaceState](#interfaces_vscode_gen_workspacestatemd) |
`payload` | any |

**Returns:** *boolean*

___

###  newDiagnosticChangeEvent

▸ **newDiagnosticChangeEvent**(): *[DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd)*

**Returns:** *[DiagnosticChangeEvent](#interfaces_vscode_gen_diagnosticchangeeventmd)*

___

###  newDisposable

▸ **newDisposable**(): *[Disposable](#classes_core_disposablemd)*

**Returns:** *[Disposable](#classes_core_disposablemd)*

___

###  newEnvState

▸ **newEnvState**(): *[EnvState](#interfaces_vscode_gen_envstatemd)*

**Returns:** *[EnvState](#interfaces_vscode_gen_envstatemd)*

___

###  newFileSystemWatcher

▸ **newFileSystemWatcher**(): *[FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)*

**Returns:** *[FileSystemWatcher](#interfaces_vscode_gen_filesystemwatchermd)*

___

###  newFileSystemWatcherState

▸ **newFileSystemWatcherState**(): *[FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)*

**Returns:** *[FileSystemWatcherState](#interfaces_vscode_gen_filesystemwatcherstatemd)*

___

###  newInputBox

▸ **newInputBox**(): *[InputBox](#interfaces_vscode_gen_inputboxmd)*

**Returns:** *[InputBox](#interfaces_vscode_gen_inputboxmd)*

___

###  newInputBoxState

▸ **newInputBoxState**(): *[InputBoxState](#interfaces_vscode_gen_inputboxstatemd)*

**Returns:** *[InputBoxState](#interfaces_vscode_gen_inputboxstatemd)*

___

###  newOutputChannel

▸ **newOutputChannel**(): *[OutputChannel](#interfaces_vscode_gen_outputchannelmd)*

**Returns:** *[OutputChannel](#interfaces_vscode_gen_outputchannelmd)*

___

###  newOutputChannelState

▸ **newOutputChannelState**(): *[OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd)*

**Returns:** *[OutputChannelState](#interfaces_vscode_gen_outputchannelstatemd)*

___

###  newQuickPick

▸ **newQuickPick**(): *[QuickPick](#interfaces_vscode_gen_quickpickmd)*

**Returns:** *[QuickPick](#interfaces_vscode_gen_quickpickmd)*

___

###  newQuickPickItem

▸ **newQuickPickItem**(): *[QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)*

**Returns:** *[QuickPickItem](#interfaces_vscode_gen_quickpickitemmd)*

___

###  newQuickPickState

▸ **newQuickPickState**(): *[QuickPickState](#interfaces_vscode_gen_quickpickstatemd)*

**Returns:** *[QuickPickState](#interfaces_vscode_gen_quickpickstatemd)*

___

###  newStatusBarItem

▸ **newStatusBarItem**(): *[StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)*

**Returns:** *[StatusBarItem](#interfaces_vscode_gen_statusbaritemmd)*

___

###  newStatusBarItemState

▸ **newStatusBarItemState**(): *[StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)*

**Returns:** *[StatusBarItemState](#interfaces_vscode_gen_statusbaritemstatemd)*

___

###  newTerminal

▸ **newTerminal**(): *[Terminal](#interfaces_vscode_gen_terminalmd)*

**Returns:** *[Terminal](#interfaces_vscode_gen_terminalmd)*

___

###  newTerminalState

▸ **newTerminalState**(): *[TerminalState](#interfaces_vscode_gen_terminalstatemd)*

**Returns:** *[TerminalState](#interfaces_vscode_gen_terminalstatemd)*

___

###  newWindowState

▸ **newWindowState**(): *[WindowState](#interfaces_vscode_gen_windowstatemd)*

**Returns:** *[WindowState](#interfaces_vscode_gen_windowstatemd)*

___

###  newWorkspaceFolder

▸ **newWorkspaceFolder**(): *[WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)*

**Returns:** *[WorkspaceFolder](#interfaces_vscode_gen_workspacefoldermd)*

___

###  newWorkspaceFoldersChangeEvent

▸ **newWorkspaceFoldersChangeEvent**(): *[WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd)*

**Returns:** *[WorkspaceFoldersChangeEvent](#interfaces_vscode_gen_workspacefolderschangeeventmd)*

___

###  newWorkspaceState

▸ **newWorkspaceState**(): *[WorkspaceState](#interfaces_vscode_gen_workspacestatemd)*

**Returns:** *[WorkspaceState](#interfaces_vscode_gen_workspacestatemd)*

___

###  newipcMsg

▸ **newipcMsg**(): *[ipcMsg](#classes_core_ipcmsgmd)*

**Returns:** *[ipcMsg](#classes_core_ipcmsgmd)*
