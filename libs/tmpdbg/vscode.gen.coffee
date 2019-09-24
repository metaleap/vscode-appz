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
        andThen: ?(?string->void)




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




Vscode·Window: ( -> Window)
    return this




Window·ShowErrorMessage1: (message:string -> items:[string] -> andThen:?(?string->void) -> void)
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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
    var msg of ipcMsg
    msg = ipcMsg·new
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




Window·ShowInputBox: (options:?InputBoxOptions -> andThen:?(?string->void) -> void)
    var msg of ipcMsg
    msg = ipcMsg·new
    msg.QName = "window.showInputBox"
    msg.Data = dict·new(1)
    var fnids of [string]
    fnids = [string]·new(1)
    lock this
        if (=?options)
            options.ValidateInput_AppzFuncId = ""
            var fn of ?(string->string)
            fn = options.ValidateInput
            if (=?fn)
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


# override `emitOutro` for this trailing part..
