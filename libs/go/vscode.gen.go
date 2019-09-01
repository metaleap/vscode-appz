package vscode

type MessageOptions struct {
	Modal bool `json:"modal,omitempty"`
}

type MessageItem struct {
	Title string `json:"title"`
	IsCloseAffordance bool `json:"isCloseAffordance,omitempty"`
	Tag interface{} `json:"Tag,omitempty"`
}

type InputBoxOptions struct {
	Value string `json:"value,omitempty"`
	ValueSelection []int `json:"valueSelection,omitempty"`
	Prompt string `json:"prompt,omitempty"`
	PlaceHolder string `json:"placeHolder,omitempty"`
	Password bool `json:"password,omitempty"`
	IgnoreFocusOut bool `json:"ignoreFocusOut,omitempty"`
	ValidateInput func(string) string `json:"-"`
}

type Window interface {
	ShowErrorMessage1(message string, items []string, andThen func(string), )
	ShowErrorMessage2(message string, options MessageOptions, items []string, andThen func(string), )
	ShowErrorMessage3(message string, items []MessageItem, andThen func(MessageItem), )
	ShowErrorMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem), )
	ShowInformationMessage1(message string, items []string, andThen func(string), )
	ShowInformationMessage2(message string, options MessageOptions, items []string, andThen func(string), )
	ShowInformationMessage3(message string, items []MessageItem, andThen func(MessageItem), )
	ShowInformationMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem), )
	ShowWarningMessage1(message string, items []string, andThen func(string), )
	ShowWarningMessage2(message string, options MessageOptions, items []string, andThen func(string), )
	ShowWarningMessage3(message string, items []MessageItem, andThen func(MessageItem), )
	ShowWarningMessage4(message string, options MessageOptions, items []MessageItem, andThen func(MessageItem), )
	ShowInputBox(options InputBoxOptions, andThen func(string), )
}

