# NOTE, this is not a CoffeeScript file:
# the .coffee extension is solely for the convenience of syntax-highlighting.
#
# A debug-print of our in-memory-only imperative-intermediate-representation
# available to code-gens that want to stay lean & mean & low on LoCs for
# maintainability & ease of porting.
#
# The format is again just a debug-print: it's never to be parsed or anything,
# and exists merely to dump all knowledge held by generated in-memory
# representations available to code-gens.
#
# Generated representations follow below.



# vscode:
# Type Definition for Visual Studio Code 1.37 Extension API
# See https://code.visualstudio.com/api for more information
Vscode: iface

	# window:
	# Namespace for dealing with the current window of the editor. That is visible
	# and active editors, as well as, UI elements to show messages, selections, and
	# asking for user input.
	Window: Window




# Options to configure the behavior of the message.
MessageOptions: struct

	# modal:
	# Indicates that this message should be modal.
	#
	# JSON FLAGS: {"Name":"modal","Required":false,"Excluded":false}
	Modal: ?bool




# Represents an action that is shown with an information, warning, or
# error message.
MessageItem: struct

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
	My: ?[string:Any]




# Options to configure the behavior of the input box UI.
InputBoxOptions: struct

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




# window:
# Namespace for dealing with the current window of the editor. That is visible
# and active editors, as well as, UI elements to show messages, selections, and
# asking for user input.
Window: iface

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
		andThen: ?(string->void)

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
		andThen: ?(string->void)

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
		andThen: ?(MessageItem->void)

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
		andThen: ?(MessageItem->void)

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
		andThen: ?(string->void)

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
		andThen: ?(string->void)

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
		andThen: ?(MessageItem->void)

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
		andThen: ?(MessageItem->void)

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
		andThen: ?(string->void)

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
		andThen: ?(string->void)

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
		andThen: ?(MessageItem->void)

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
		andThen: ?(MessageItem->void)

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
		andThen: ?(string->void)




VscodeWindow: ( -> Window)
	ret $




WindowShowErrorMessage1: (message:string -> items:[string] -> andThen:?(string->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showErrorMessage1"
	msg.Data = dict·new(2)
	msg.Data@"message" = message
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowErrorMessage2: (message:string -> options:MessageOptions -> items:[string] -> andThen:?(string->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showErrorMessage2"
	msg.Data = dict·new(3)
	msg.Data@"message" = message
	msg.Data@"options" = options
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowErrorMessage3: (message:string -> items:[MessageItem] -> andThen:?(MessageItem->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showErrorMessage3"
	msg.Data = dict·new(2)
	msg.Data@"message" = message
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowErrorMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> andThen:?(MessageItem->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showErrorMessage4"
	msg.Data = dict·new(3)
	msg.Data@"message" = message
	msg.Data@"options" = options
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowInformationMessage1: (message:string -> items:[string] -> andThen:?(string->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showInformationMessage1"
	msg.Data = dict·new(2)
	msg.Data@"message" = message
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowInformationMessage2: (message:string -> options:MessageOptions -> items:[string] -> andThen:?(string->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showInformationMessage2"
	msg.Data = dict·new(3)
	msg.Data@"message" = message
	msg.Data@"options" = options
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowInformationMessage3: (message:string -> items:[MessageItem] -> andThen:?(MessageItem->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showInformationMessage3"
	msg.Data = dict·new(2)
	msg.Data@"message" = message
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowInformationMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> andThen:?(MessageItem->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showInformationMessage4"
	msg.Data = dict·new(3)
	msg.Data@"message" = message
	msg.Data@"options" = options
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowWarningMessage1: (message:string -> items:[string] -> andThen:?(string->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showWarningMessage1"
	msg.Data = dict·new(2)
	msg.Data@"message" = message
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowWarningMessage2: (message:string -> options:MessageOptions -> items:[string] -> andThen:?(string->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showWarningMessage2"
	msg.Data = dict·new(3)
	msg.Data@"message" = message
	msg.Data@"options" = options
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowWarningMessage3: (message:string -> items:[MessageItem] -> andThen:?(MessageItem->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showWarningMessage3"
	msg.Data = dict·new(2)
	msg.Data@"message" = message
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowWarningMessage4: (message:string -> options:MessageOptions -> items:[MessageItem] -> andThen:?(MessageItem->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showWarningMessage4"
	msg.Data = dict·new(3)
	msg.Data@"message" = message
	msg.Data@"options" = options
	msg.Data@"items" = items
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, on)




WindowShowInputBox: (options:?InputBoxOptions -> andThen:?(string->void) -> void)
	msg: ipcMsg
	msg = ipcMsg·new
	msg.QName = "window.showInputBox"
	msg.Data = dict·new(1)
	fnids: [string]
	fnids = [string]·new(1)
	$·lock
		if (options != null)
			options.ValidateInput_AppzFuncId = ""
	msg.Data@"options" = options
	on: (Any->bool)
	if (andThen != null)
		on = (payload:Any -> bool)
			ret true
		
	$.send(msg, (payload:Any -> bool)
		if (fnids·len != 0)
			$·lock
				for fnid in fnids
					$.cbOther·del(fnid)
		ret ((on == null) || on(payload))
	)


