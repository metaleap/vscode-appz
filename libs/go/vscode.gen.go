package vscode

type TreeItemCollapsibleState int

const (
	TreeItemCollapsibleStateNone TreeItemCollapsibleState = 0
	TreeItemCollapsibleStateCollapsed TreeItemCollapsibleState = 1
	TreeItemCollapsibleStateExpanded TreeItemCollapsibleState = 2
)

type StatusBarAlignment int

const (
	StatusBarAlignmentLeft StatusBarAlignment = 1
	StatusBarAlignmentRight StatusBarAlignment = 2
)

type MessageOptions struct {
	Modal interface{} `json:"modal,omitempty"`
}

type MessageItem struct {
	Title interface{} `json:"title"`
	IsCloseAffordance interface{} `json:"isCloseAffordance,omitempty"`
}

type Window interface {
	ShowErrorMessage1(message interface{}, items interface{}, )
	ShowErrorMessage2(message interface{}, options interface{}, items interface{}, )
	ShowErrorMessage3(message interface{}, items interface{}, )
	ShowErrorMessage4(message interface{}, options interface{}, items interface{}, )
	ShowInformationMessage1(message interface{}, items interface{}, )
	ShowInformationMessage2(message interface{}, options interface{}, items interface{}, )
	ShowInformationMessage3(message interface{}, items interface{}, )
	ShowInformationMessage4(message interface{}, options interface{}, items interface{}, )
	ShowWarningMessage1(message interface{}, items interface{}, )
	ShowWarningMessage2(message interface{}, options interface{}, items interface{}, )
	ShowWarningMessage3(message interface{}, items interface{}, )
	ShowWarningMessage4(message interface{}, options interface{}, items interface{}, )
}

