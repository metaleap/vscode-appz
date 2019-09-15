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
	Modal: ?yesno




# Represents an action that is shown with an information, warning, or
# error message.
MessageItem: struct

	# title:
	# A short title like 'Retry', 'Open Log' etc.
	#
	# JSON FLAGS: {"Name":"title","Required":true,"Excluded":false}
	Title: txt

	# isCloseAffordance:
	# A hint for modal dialogs that the item should be triggered
	# when the user cancels the dialog (e.g. by pressing the ESC
	# key).
	# 
	# Note: this option is ignored for non-modal messages.
	#
	# JSON FLAGS: {"Name":"isCloseAffordance","Required":false,"Excluded":false}
	IsCloseAffordance: ?yesno

	# my:
	# Free-form custom data, preserved across a roundtrip.
	#
	# JSON FLAGS: {"Name":"my","Required":false,"Excluded":false}
	My: ?[txt:Any]




# Options to configure the behavior of the input box UI.
InputBoxOptions: struct

	# value:
	# The value to prefill in the input box.
	#
	# JSON FLAGS: {"Name":"value","Required":false,"Excluded":false}
	Value: ?txt

	# valueSelection:
	# Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
	# first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
	# word will be selected, when empty (start equals end) only the cursor will be set,
	# otherwise the defined range will be selected.
	#
	# JSON FLAGS: {"Name":"valueSelection","Required":false,"Excluded":false}
	ValueSelection: ?[intnum,intnum]

	# prompt:
	# The text to display underneath the input box.
	#
	# JSON FLAGS: {"Name":"prompt","Required":false,"Excluded":false}
	Prompt: ?txt

	# placeHolder:
	# An optional string to show as place holder in the input box to guide the user what to type.
	#
	# JSON FLAGS: {"Name":"placeHolder","Required":false,"Excluded":false}
	PlaceHolder: ?txt

	# password:
	# Set to `true` to show a password prompt that will not show the typed value.
	#
	# JSON FLAGS: {"Name":"password","Required":false,"Excluded":false}
	Password: ?yesno

	# ignoreFocusOut:
	# Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.
	#
	# JSON FLAGS: {"Name":"ignoreFocusOut","Required":false,"Excluded":false}
	IgnoreFocusOut: ?yesno

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
	ValidateInput: ?(txt -> txt)

	# For internal runtime use only.
	#
	# JSON FLAGS: {"Name":"validateInput_AppzFuncId","Required":false,"Excluded":false}
	ValidateInput_AppzFuncId: txt




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
	ShowErrorMessage1: 
		message: txt
		items: [txt]
		andThen: ?(txt -> !)

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
	ShowErrorMessage2: 
		message: txt
		options: MessageOptions
		items: [txt]
		andThen: ?(txt -> !)

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
	ShowErrorMessage3: 
		message: txt
		items: [MessageItem]
		andThen: ?(MessageItem -> !)

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
	ShowErrorMessage4: 
		message: txt
		options: MessageOptions
		items: [MessageItem]
		andThen: ?(MessageItem -> !)

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
	ShowInformationMessage1: 
		message: txt
		items: [txt]
		andThen: ?(txt -> !)

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
	ShowInformationMessage2: 
		message: txt
		options: MessageOptions
		items: [txt]
		andThen: ?(txt -> !)

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
	ShowInformationMessage3: 
		message: txt
		items: [MessageItem]
		andThen: ?(MessageItem -> !)

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
	ShowInformationMessage4: 
		message: txt
		options: MessageOptions
		items: [MessageItem]
		andThen: ?(MessageItem -> !)

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
	ShowWarningMessage1: 
		message: txt
		items: [txt]
		andThen: ?(txt -> !)

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
	ShowWarningMessage2: 
		message: txt
		options: MessageOptions
		items: [txt]
		andThen: ?(txt -> !)

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
	ShowWarningMessage3: 
		message: txt
		items: [MessageItem]
		andThen: ?(MessageItem -> !)

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
	ShowWarningMessage4: 
		message: txt
		options: MessageOptions
		items: [MessageItem]
		andThen: ?(MessageItem -> !)

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
	ShowInputBox: 
		options: ?InputBoxOptions
		andThen: ?(txt -> !)




Vscode.Window (): Window
	ret self




Window.ShowErrorMessage1 (message: txt, items: [txt], andThen: ?(txt -> !)): !
	ret




Window.ShowErrorMessage2 (message: txt, options: MessageOptions, items: [txt], andThen: ?(txt -> !)): !
	ret




Window.ShowErrorMessage3 (message: txt, items: [MessageItem], andThen: ?(MessageItem -> !)): !
	ret




Window.ShowErrorMessage4 (message: txt, options: MessageOptions, items: [MessageItem], andThen: ?(MessageItem -> !)): !
	ret




Window.ShowInformationMessage1 (message: txt, items: [txt], andThen: ?(txt -> !)): !
	ret




Window.ShowInformationMessage2 (message: txt, options: MessageOptions, items: [txt], andThen: ?(txt -> !)): !
	ret




Window.ShowInformationMessage3 (message: txt, items: [MessageItem], andThen: ?(MessageItem -> !)): !
	ret




Window.ShowInformationMessage4 (message: txt, options: MessageOptions, items: [MessageItem], andThen: ?(MessageItem -> !)): !
	ret




Window.ShowWarningMessage1 (message: txt, items: [txt], andThen: ?(txt -> !)): !
	ret




Window.ShowWarningMessage2 (message: txt, options: MessageOptions, items: [txt], andThen: ?(txt -> !)): !
	ret




Window.ShowWarningMessage3 (message: txt, items: [MessageItem], andThen: ?(MessageItem -> !)): !
	ret




Window.ShowWarningMessage4 (message: txt, options: MessageOptions, items: [MessageItem], andThen: ?(MessageItem -> !)): !
	ret




Window.ShowInputBox (options: ?InputBoxOptions, andThen: ?(txt -> !)): !
	ret


