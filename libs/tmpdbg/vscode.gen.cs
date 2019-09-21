//DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-csharp.ts via github.com/metaleap/vscode-appz/src/gen/main.ts
namespace VscAppz {
	using System;
	using System.Collections.Generic;
	using Newtonsoft.Json;

	using Any = System.Object;

	public interface IVscode {
		IWindow Window;
	}


	# Options to configure the behavior of the message.
	MessageOptions: class

		# modal:
		# Indicates that this message should be modal.
		#
		# JSON FLAGS: {"Name":"modal","Required":false,"Excluded":false}
		Modal: Nullable<bool>




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
		IsCloseAffordance: Nullable<bool>

		# my:
		# Free-form custom data, preserved across a roundtrip.
		#
		# JSON FLAGS: {"Name":"my","Required":false,"Excluded":false}
		My: [string:Any]




	# Options to configure the behavior of the input box UI.
	InputBoxOptions: class

		# value:
		# The value to prefill in the input box.
		#
		# JSON FLAGS: {"Name":"value","Required":false,"Excluded":false}
		Value: string

		# valueSelection:
		# Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
		# first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
		# word will be selected, when empty (start equals end) only the cursor will be set,
		# otherwise the defined range will be selected.
		#
		# JSON FLAGS: {"Name":"valueSelection","Required":false,"Excluded":false}
		ValueSelection: Nullable<(int, int)>

		# prompt:
		# The text to display underneath the input box.
		#
		# JSON FLAGS: {"Name":"prompt","Required":false,"Excluded":false}
		Prompt: string

		# placeHolder:
		# An optional string to show as place holder in the input box to guide the user what to type.
		#
		# JSON FLAGS: {"Name":"placeHolder","Required":false,"Excluded":false}
		PlaceHolder: string

		# password:
		# Set to `true` to show a password prompt that will not show the typed value.
		#
		# JSON FLAGS: {"Name":"password","Required":false,"Excluded":false}
		Password: Nullable<bool>

		# ignoreFocusOut:
		# Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.
		#
		# JSON FLAGS: {"Name":"ignoreFocusOut","Required":false,"Excluded":false}
		IgnoreFocusOut: Nullable<bool>

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
		ValidateInput: Func<>

		# For internal runtime use only.
		#
		# JSON FLAGS: {"Name":"validateInput_AppzFuncId","Required":false,"Excluded":false}
		ValidateInput_AppzFuncId: string


	public interface IWindow {
		void ShowErrorMessage1(string message = default, string[] items = default, Action<string> andThen = default);
		void ShowErrorMessage2(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);
		void ShowErrorMessage3(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowErrorMessage4(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowInformationMessage1(string message = default, string[] items = default, Action<string> andThen = default);
		void ShowInformationMessage2(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);
		void ShowInformationMessage3(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowInformationMessage4(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowWarningMessage1(string message = default, string[] items = default, Action<string> andThen = default);
		void ShowWarningMessage2(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);
		void ShowWarningMessage3(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowWarningMessage4(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowInputBox(InputBoxOptions options = default, Action<string> andThen = default);
	}


	IVscode·Window: ( -> IWindow)
		return this




	IWindow·ShowErrorMessage1: (message:string -> items:string[] -> andThen:Action<string> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showErrorMessage1"
		msg.Data = dict·new(2)
		msg.Data@"message" = message
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of string
				if (=?payload)
					[result,ok] = ((payload)·(string))
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowErrorMessage2: (message:string -> options:MessageOptions -> items:string[] -> andThen:Action<string> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showErrorMessage2"
		msg.Data = dict·new(3)
		msg.Data@"message" = message
		msg.Data@"options" = options
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of string
				if (=?payload)
					[result,ok] = ((payload)·(string))
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowErrorMessage3: (message:string -> items:MessageItem[] -> andThen:Action<MessageItem> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showErrorMessage3"
		msg.Data = dict·new(2)
		msg.Data@"message" = message
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of MessageItem
				if (=?payload)
					result = MessageItem·new
					ok = result.populateFrom(payload)
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowErrorMessage4: (message:string -> options:MessageOptions -> items:MessageItem[] -> andThen:Action<MessageItem> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showErrorMessage4"
		msg.Data = dict·new(3)
		msg.Data@"message" = message
		msg.Data@"options" = options
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of MessageItem
				if (=?payload)
					result = MessageItem·new
					ok = result.populateFrom(payload)
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowInformationMessage1: (message:string -> items:string[] -> andThen:Action<string> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showInformationMessage1"
		msg.Data = dict·new(2)
		msg.Data@"message" = message
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of string
				if (=?payload)
					[result,ok] = ((payload)·(string))
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowInformationMessage2: (message:string -> options:MessageOptions -> items:string[] -> andThen:Action<string> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showInformationMessage2"
		msg.Data = dict·new(3)
		msg.Data@"message" = message
		msg.Data@"options" = options
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of string
				if (=?payload)
					[result,ok] = ((payload)·(string))
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowInformationMessage3: (message:string -> items:MessageItem[] -> andThen:Action<MessageItem> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showInformationMessage3"
		msg.Data = dict·new(2)
		msg.Data@"message" = message
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of MessageItem
				if (=?payload)
					result = MessageItem·new
					ok = result.populateFrom(payload)
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowInformationMessage4: (message:string -> options:MessageOptions -> items:MessageItem[] -> andThen:Action<MessageItem> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showInformationMessage4"
		msg.Data = dict·new(3)
		msg.Data@"message" = message
		msg.Data@"options" = options
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of MessageItem
				if (=?payload)
					result = MessageItem·new
					ok = result.populateFrom(payload)
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowWarningMessage1: (message:string -> items:string[] -> andThen:Action<string> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showWarningMessage1"
		msg.Data = dict·new(2)
		msg.Data@"message" = message
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of string
				if (=?payload)
					[result,ok] = ((payload)·(string))
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowWarningMessage2: (message:string -> options:MessageOptions -> items:string[] -> andThen:Action<string> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showWarningMessage2"
		msg.Data = dict·new(3)
		msg.Data@"message" = message
		msg.Data@"options" = options
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of string
				if (=?payload)
					[result,ok] = ((payload)·(string))
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowWarningMessage3: (message:string -> items:MessageItem[] -> andThen:Action<MessageItem> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showWarningMessage3"
		msg.Data = dict·new(2)
		msg.Data@"message" = message
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of MessageItem
				if (=?payload)
					result = MessageItem·new
					ok = result.populateFrom(payload)
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowWarningMessage4: (message:string -> options:MessageOptions -> items:MessageItem[] -> andThen:Action<MessageItem> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showWarningMessage4"
		msg.Data = dict·new(3)
		msg.Data@"message" = message
		msg.Data@"options" = options
		msg.Data@"items" = items
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of MessageItem
				if (=?payload)
					result = MessageItem·new
					ok = result.populateFrom(payload)
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, on)




	IWindow·ShowInputBox: (options:InputBoxOptions -> andThen:Action<string> -> void)
		var msg of ipcMsg
		msg = ipcMsg·new
		msg.QName = "window.showInputBox"
		msg.Data = dict·new(1)
		var fnids of List<string>
		fnids = [string]·new(1)
		lock this
			if (=?options)
				options.ValidateInput_AppzFuncId = ""
				var fn of Func<>
				fn = options.ValidateInput
				if (=?fn)
					options.ValidateInput_AppzFuncId = this.nextFuncId()
					fnids·add(options.ValidateInput_AppzFuncId)
					this.cbOther@options.ValidateInput_AppzFuncId = (args:Any[] -> (Any, bool))
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
		var on of Func<>
		if (=?andThen)
			on = (payload:Any -> bool)
				var ok of bool
				var result of string
				if (=?payload)
					[result,ok] = ((payload)·(string))
					if (!ok)
						return false
				andThen(result)
				return true
			
		this.send(msg, (payload:Any -> bool)
			if (fnids·len != 0)
				lock this
					for fnid in fnids
						this.cbOther·del(fnid)
			return ((=!on) || on(payload))
		)




	MessageItem·populateFrom: (payload:Any -> bool)
		var dict of [string:Any]
		var ok of bool
		var val of Any
		[dict,ok] = ((payload)·([string:Any]))
		if (!ok)
			return false
		[val,ok] = dict@"title"
		if ok
			var title of string
			[title,ok] = ((val)·(string))
			if (!ok)
				return false
			this.Title = title
		else
			return false
		[val,ok] = dict@"isCloseAffordance"
		if ok
			var isCloseAffordance of Nullable<bool>
			[isCloseAffordance,ok] = ((val)·(Nullable<bool>))
			if (!ok)
				return false
			this.IsCloseAffordance = isCloseAffordance
		[val,ok] = dict@"my"
		if ok
			var my of [string:Any]
			[my,ok] = ((val)·([string:Any]))
			if (!ok)
				return false
			this.My = my
		return true


}
