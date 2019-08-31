package vscode

type MessageOptions struct {
	Modal bool `json:"modal,omitempty"`
}

type MessageItem struct {
	Title string `json:"title"`
	IsCloseAffordance bool `json:"isCloseAffordance,omitempty"`
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
	ShowErrorMessage1(message string, items []string, ) func(func(string))
	ShowErrorMessage2(message string, options MessageOptions, items []string, ) func(func(string))
	ShowErrorMessage3(message string, items []MessageItem, ) func(func(MessageItem))
	ShowErrorMessage4(message string, options MessageOptions, items []MessageItem, ) func(func(MessageItem))
	ShowInformationMessage1(message string, items []string, ) func(func(string))
	ShowInformationMessage2(message string, options MessageOptions, items []string, ) func(func(string))
	ShowInformationMessage3(message string, items []MessageItem, ) func(func(MessageItem))
	ShowInformationMessage4(message string, options MessageOptions, items []MessageItem, ) func(func(MessageItem))
	ShowWarningMessage1(message string, items []string, ) func(func(string))
	ShowWarningMessage2(message string, options MessageOptions, items []string, ) func(func(string))
	ShowWarningMessage3(message string, items []MessageItem, ) func(func(MessageItem))
	ShowWarningMessage4(message string, options MessageOptions, items []MessageItem, ) func(func(MessageItem))
	ShowInputBox(options InputBoxOptions, ) func(func(string))
}

