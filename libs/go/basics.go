package vscode

type impl struct {
}

type msgOutgoing struct {
	Ns       string                 `json:"ns"`   // eg. 'window'
	Name     string                 `json:"name"` // eg. 'ShowInformationMessage3'
	Payload  map[string]interface{} `json:"payload"`
	Callback int                    `json:"callback"`
}

type msgIncoming struct {
	Callback int           `json:"andThen"`
	Payload  []interface{} `json:"payload"`
	IsFail   bool          `json:"isFail"`
}

func New() Window {
	return nil
}

func (me *impl) send(msg *msgOutgoing, on func(interface{}, bool)) {
}
