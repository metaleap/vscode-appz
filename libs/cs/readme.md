<a name='assembly'></a>
# vscode-appz

## Contents

- [Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel')
  - [In(fromNow)](#M-VscAppz-Cancel-In-System-TimeSpan- 'VscAppz.Cancel.In(System.TimeSpan)')
  - [Now()](#M-VscAppz-Cancel-Now 'VscAppz.Cancel.Now')
- [DecorationRangeBehavior](#T-VscAppz-DecorationRangeBehavior 'VscAppz.DecorationRangeBehavior')
  - [ClosedClosed](#F-VscAppz-DecorationRangeBehavior-ClosedClosed 'VscAppz.DecorationRangeBehavior.ClosedClosed')
  - [ClosedOpen](#F-VscAppz-DecorationRangeBehavior-ClosedOpen 'VscAppz.DecorationRangeBehavior.ClosedOpen')
  - [OpenClosed](#F-VscAppz-DecorationRangeBehavior-OpenClosed 'VscAppz.DecorationRangeBehavior.OpenClosed')
  - [OpenOpen](#F-VscAppz-DecorationRangeBehavior-OpenOpen 'VscAppz.DecorationRangeBehavior.OpenOpen')
- [DecorationRenderOptions](#T-VscAppz-DecorationRenderOptions 'VscAppz.DecorationRenderOptions')
  - [Dark](#F-VscAppz-DecorationRenderOptions-Dark 'VscAppz.DecorationRenderOptions.Dark')
  - [IsWholeLine](#F-VscAppz-DecorationRenderOptions-IsWholeLine 'VscAppz.DecorationRenderOptions.IsWholeLine')
  - [Light](#F-VscAppz-DecorationRenderOptions-Light 'VscAppz.DecorationRenderOptions.Light')
  - [OverviewRulerLane](#F-VscAppz-DecorationRenderOptions-OverviewRulerLane 'VscAppz.DecorationRenderOptions.OverviewRulerLane')
  - [RangeBehavior](#F-VscAppz-DecorationRenderOptions-RangeBehavior 'VscAppz.DecorationRenderOptions.RangeBehavior')
- [DiagnosticChangeEvent](#T-VscAppz-DiagnosticChangeEvent 'VscAppz.DiagnosticChangeEvent')
  - [Uris](#F-VscAppz-DiagnosticChangeEvent-Uris 'VscAppz.DiagnosticChangeEvent.Uris')
- [Disposable](#T-VscAppz-Disposable 'VscAppz.Disposable')
  - [Dispose()](#M-VscAppz-Disposable-Dispose 'VscAppz.Disposable.Dispose')
- [EnvProperties](#T-VscAppz-EnvProperties 'VscAppz.EnvProperties')
  - [AppName](#F-VscAppz-EnvProperties-AppName 'VscAppz.EnvProperties.AppName')
  - [AppRoot](#F-VscAppz-EnvProperties-AppRoot 'VscAppz.EnvProperties.AppRoot')
  - [Language](#F-VscAppz-EnvProperties-Language 'VscAppz.EnvProperties.Language')
  - [MachineId](#F-VscAppz-EnvProperties-MachineId 'VscAppz.EnvProperties.MachineId')
  - [RemoteName](#F-VscAppz-EnvProperties-RemoteName 'VscAppz.EnvProperties.RemoteName')
  - [SessionId](#F-VscAppz-EnvProperties-SessionId 'VscAppz.EnvProperties.SessionId')
  - [Shell](#F-VscAppz-EnvProperties-Shell 'VscAppz.EnvProperties.Shell')
  - [UriScheme](#F-VscAppz-EnvProperties-UriScheme 'VscAppz.EnvProperties.UriScheme')
- [IClipboard](#T-VscAppz-IClipboard 'VscAppz.IClipboard')
  - [ReadText()](#M-VscAppz-IClipboard-ReadText 'VscAppz.IClipboard.ReadText')
  - [WriteText()](#M-VscAppz-IClipboard-WriteText-System-String- 'VscAppz.IClipboard.WriteText(System.String)')
- [ICommands](#T-VscAppz-ICommands 'VscAppz.ICommands')
  - [ExecuteCommand(command,rest)](#M-VscAppz-ICommands-ExecuteCommand-System-String,System-Object[]- 'VscAppz.ICommands.ExecuteCommand(System.String,System.Object[])')
  - [GetCommands(filterInternal)](#M-VscAppz-ICommands-GetCommands-System-Boolean- 'VscAppz.ICommands.GetCommands(System.Boolean)')
  - [RegisterCommand(command,callback)](#M-VscAppz-ICommands-RegisterCommand-System-String,System-Func{System-Object[],System-Object}- 'VscAppz.ICommands.RegisterCommand(System.String,System.Func{System.Object[],System.Object})')
- [IEnv](#T-VscAppz-IEnv 'VscAppz.IEnv')
  - [AppName()](#M-VscAppz-IEnv-AppName 'VscAppz.IEnv.AppName')
  - [AppRoot()](#M-VscAppz-IEnv-AppRoot 'VscAppz.IEnv.AppRoot')
  - [Clipboard()](#M-VscAppz-IEnv-Clipboard 'VscAppz.IEnv.Clipboard')
  - [Language()](#M-VscAppz-IEnv-Language 'VscAppz.IEnv.Language')
  - [MachineId()](#M-VscAppz-IEnv-MachineId 'VscAppz.IEnv.MachineId')
  - [OpenExternal(target)](#M-VscAppz-IEnv-OpenExternal-System-String- 'VscAppz.IEnv.OpenExternal(System.String)')
  - [Properties()](#M-VscAppz-IEnv-Properties 'VscAppz.IEnv.Properties')
  - [RemoteName()](#M-VscAppz-IEnv-RemoteName 'VscAppz.IEnv.RemoteName')
  - [SessionId()](#M-VscAppz-IEnv-SessionId 'VscAppz.IEnv.SessionId')
  - [Shell()](#M-VscAppz-IEnv-Shell 'VscAppz.IEnv.Shell')
  - [UriScheme()](#M-VscAppz-IEnv-UriScheme 'VscAppz.IEnv.UriScheme')
- [IExtensions](#T-VscAppz-IExtensions 'VscAppz.IExtensions')
  - [OnDidChange()](#M-VscAppz-IExtensions-OnDidChange-System-Action- 'VscAppz.IExtensions.OnDidChange(System.Action)')
- [ILanguages](#T-VscAppz-ILanguages 'VscAppz.ILanguages')
  - [GetLanguages()](#M-VscAppz-ILanguages-GetLanguages 'VscAppz.ILanguages.GetLanguages')
  - [OnDidChangeDiagnostics()](#M-VscAppz-ILanguages-OnDidChangeDiagnostics-System-Action{VscAppz-DiagnosticChangeEvent}- 'VscAppz.ILanguages.OnDidChangeDiagnostics(System.Action{VscAppz.DiagnosticChangeEvent})')
- [IVscode](#T-VscAppz-IVscode 'VscAppz.IVscode')
  - [Commands](#P-VscAppz-IVscode-Commands 'VscAppz.IVscode.Commands')
  - [Env](#P-VscAppz-IVscode-Env 'VscAppz.IVscode.Env')
  - [Extensions](#P-VscAppz-IVscode-Extensions 'VscAppz.IVscode.Extensions')
  - [Languages](#P-VscAppz-IVscode-Languages 'VscAppz.IVscode.Languages')
  - [Window](#P-VscAppz-IVscode-Window 'VscAppz.IVscode.Window')
  - [Workspace](#P-VscAppz-IVscode-Workspace 'VscAppz.IVscode.Workspace')
- [IWindow](#T-VscAppz-IWindow 'VscAppz.IWindow')
  - [CreateOutputChannel(name)](#M-VscAppz-IWindow-CreateOutputChannel-System-String- 'VscAppz.IWindow.CreateOutputChannel(System.String)')
  - [CreateStatusBarItem(alignment,priority)](#M-VscAppz-IWindow-CreateStatusBarItem-System-Nullable{VscAppz-StatusBarAlignment},System-Nullable{System-Int32}- 'VscAppz.IWindow.CreateStatusBarItem(System.Nullable{VscAppz.StatusBarAlignment},System.Nullable{System.Int32})')
  - [CreateTextEditorDecorationType(options)](#M-VscAppz-IWindow-CreateTextEditorDecorationType-VscAppz-DecorationRenderOptions- 'VscAppz.IWindow.CreateTextEditorDecorationType(VscAppz.DecorationRenderOptions)')
  - [OnDidChangeWindowState()](#M-VscAppz-IWindow-OnDidChangeWindowState-System-Action{VscAppz-WindowState}- 'VscAppz.IWindow.OnDidChangeWindowState(System.Action{VscAppz.WindowState})')
  - [SetStatusBarMessage1(text,hideAfterTimeout)](#M-VscAppz-IWindow-SetStatusBarMessage1-System-String,System-Int32- 'VscAppz.IWindow.SetStatusBarMessage1(System.String,System.Int32)')
  - [SetStatusBarMessage2(text)](#M-VscAppz-IWindow-SetStatusBarMessage2-System-String- 'VscAppz.IWindow.SetStatusBarMessage2(System.String)')
  - [ShowErrorMessage1(message,items)](#M-VscAppz-IWindow-ShowErrorMessage1-System-String,System-String[]- 'VscAppz.IWindow.ShowErrorMessage1(System.String,System.String[])')
  - [ShowErrorMessage2(message,options,items)](#M-VscAppz-IWindow-ShowErrorMessage2-System-String,VscAppz-MessageOptions,System-String[]- 'VscAppz.IWindow.ShowErrorMessage2(System.String,VscAppz.MessageOptions,System.String[])')
  - [ShowErrorMessage3(message,items)](#M-VscAppz-IWindow-ShowErrorMessage3-System-String,VscAppz-MessageItem[]- 'VscAppz.IWindow.ShowErrorMessage3(System.String,VscAppz.MessageItem[])')
  - [ShowErrorMessage4(message,options,items)](#M-VscAppz-IWindow-ShowErrorMessage4-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[]- 'VscAppz.IWindow.ShowErrorMessage4(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[])')
  - [ShowInformationMessage1(message,items)](#M-VscAppz-IWindow-ShowInformationMessage1-System-String,System-String[]- 'VscAppz.IWindow.ShowInformationMessage1(System.String,System.String[])')
  - [ShowInformationMessage2(message,options,items)](#M-VscAppz-IWindow-ShowInformationMessage2-System-String,VscAppz-MessageOptions,System-String[]- 'VscAppz.IWindow.ShowInformationMessage2(System.String,VscAppz.MessageOptions,System.String[])')
  - [ShowInformationMessage3(message,items)](#M-VscAppz-IWindow-ShowInformationMessage3-System-String,VscAppz-MessageItem[]- 'VscAppz.IWindow.ShowInformationMessage3(System.String,VscAppz.MessageItem[])')
  - [ShowInformationMessage4(message,options,items)](#M-VscAppz-IWindow-ShowInformationMessage4-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[]- 'VscAppz.IWindow.ShowInformationMessage4(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[])')
  - [ShowInputBox(options,token)](#M-VscAppz-IWindow-ShowInputBox-VscAppz-InputBoxOptions,VscAppz-Cancel- 'VscAppz.IWindow.ShowInputBox(VscAppz.InputBoxOptions,VscAppz.Cancel)')
  - [ShowOpenDialog(options)](#M-VscAppz-IWindow-ShowOpenDialog-VscAppz-OpenDialogOptions- 'VscAppz.IWindow.ShowOpenDialog(VscAppz.OpenDialogOptions)')
  - [ShowQuickPick1(items,options,token)](#M-VscAppz-IWindow-ShowQuickPick1-System-String[],VscAppz-QuickPickOptions,VscAppz-Cancel- 'VscAppz.IWindow.ShowQuickPick1(System.String[],VscAppz.QuickPickOptions,VscAppz.Cancel)')
  - [ShowQuickPick2(items,options,token)](#M-VscAppz-IWindow-ShowQuickPick2-System-String[],VscAppz-QuickPickOptions,VscAppz-Cancel- 'VscAppz.IWindow.ShowQuickPick2(System.String[],VscAppz.QuickPickOptions,VscAppz.Cancel)')
  - [ShowQuickPick3(items,options,token)](#M-VscAppz-IWindow-ShowQuickPick3-VscAppz-QuickPickItem[],VscAppz-QuickPickOptions,VscAppz-Cancel- 'VscAppz.IWindow.ShowQuickPick3(VscAppz.QuickPickItem[],VscAppz.QuickPickOptions,VscAppz.Cancel)')
  - [ShowQuickPick4(items,options,token)](#M-VscAppz-IWindow-ShowQuickPick4-VscAppz-QuickPickItem[],VscAppz-QuickPickOptions,VscAppz-Cancel- 'VscAppz.IWindow.ShowQuickPick4(VscAppz.QuickPickItem[],VscAppz.QuickPickOptions,VscAppz.Cancel)')
  - [ShowSaveDialog(options)](#M-VscAppz-IWindow-ShowSaveDialog-VscAppz-SaveDialogOptions- 'VscAppz.IWindow.ShowSaveDialog(VscAppz.SaveDialogOptions)')
  - [ShowWarningMessage1(message,items)](#M-VscAppz-IWindow-ShowWarningMessage1-System-String,System-String[]- 'VscAppz.IWindow.ShowWarningMessage1(System.String,System.String[])')
  - [ShowWarningMessage2(message,options,items)](#M-VscAppz-IWindow-ShowWarningMessage2-System-String,VscAppz-MessageOptions,System-String[]- 'VscAppz.IWindow.ShowWarningMessage2(System.String,VscAppz.MessageOptions,System.String[])')
  - [ShowWarningMessage3(message,items)](#M-VscAppz-IWindow-ShowWarningMessage3-System-String,VscAppz-MessageItem[]- 'VscAppz.IWindow.ShowWarningMessage3(System.String,VscAppz.MessageItem[])')
  - [ShowWarningMessage4(message,options,items)](#M-VscAppz-IWindow-ShowWarningMessage4-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[]- 'VscAppz.IWindow.ShowWarningMessage4(System.String,VscAppz.MessageOptions,VscAppz.MessageItem[])')
  - [ShowWorkspaceFolderPick(options)](#M-VscAppz-IWindow-ShowWorkspaceFolderPick-VscAppz-WorkspaceFolderPickOptions- 'VscAppz.IWindow.ShowWorkspaceFolderPick(VscAppz.WorkspaceFolderPickOptions)')
  - [State()](#M-VscAppz-IWindow-State 'VscAppz.IWindow.State')
- [IWorkspace](#T-VscAppz-IWorkspace 'VscAppz.IWorkspace')
  - [AsRelativePath(pathOrUri,includeWorkspaceFolder)](#M-VscAppz-IWorkspace-AsRelativePath-System-String,System-Boolean- 'VscAppz.IWorkspace.AsRelativePath(System.String,System.Boolean)')
  - [FindFiles(include,exclude,maxResults,token)](#M-VscAppz-IWorkspace-FindFiles-System-String,System-String,System-Nullable{System-Int32},VscAppz-Cancel- 'VscAppz.IWorkspace.FindFiles(System.String,System.String,System.Nullable{System.Int32},VscAppz.Cancel)')
  - [GetWorkspaceFolder(uri)](#M-VscAppz-IWorkspace-GetWorkspaceFolder-System-String- 'VscAppz.IWorkspace.GetWorkspaceFolder(System.String)')
  - [Name()](#M-VscAppz-IWorkspace-Name 'VscAppz.IWorkspace.Name')
  - [OnDidChangeWorkspaceFolders()](#M-VscAppz-IWorkspace-OnDidChangeWorkspaceFolders-System-Action{VscAppz-WorkspaceFoldersChangeEvent}- 'VscAppz.IWorkspace.OnDidChangeWorkspaceFolders(System.Action{VscAppz.WorkspaceFoldersChangeEvent})')
  - [Properties()](#M-VscAppz-IWorkspace-Properties 'VscAppz.IWorkspace.Properties')
  - [SaveAll(includeUntitled)](#M-VscAppz-IWorkspace-SaveAll-System-Boolean- 'VscAppz.IWorkspace.SaveAll(System.Boolean)')
  - [WorkspaceFile()](#M-VscAppz-IWorkspace-WorkspaceFile 'VscAppz.IWorkspace.WorkspaceFile')
  - [WorkspaceFolders()](#M-VscAppz-IWorkspace-WorkspaceFolders 'VscAppz.IWorkspace.WorkspaceFolders')
- [InputBoxOptions](#T-VscAppz-InputBoxOptions 'VscAppz.InputBoxOptions')
  - [IgnoreFocusOut](#F-VscAppz-InputBoxOptions-IgnoreFocusOut 'VscAppz.InputBoxOptions.IgnoreFocusOut')
  - [Password](#F-VscAppz-InputBoxOptions-Password 'VscAppz.InputBoxOptions.Password')
  - [PlaceHolder](#F-VscAppz-InputBoxOptions-PlaceHolder 'VscAppz.InputBoxOptions.PlaceHolder')
  - [Prompt](#F-VscAppz-InputBoxOptions-Prompt 'VscAppz.InputBoxOptions.Prompt')
  - [ValidateInput](#F-VscAppz-InputBoxOptions-ValidateInput 'VscAppz.InputBoxOptions.ValidateInput')
  - [ValidateInput_AppzFuncId](#F-VscAppz-InputBoxOptions-ValidateInput_AppzFuncId 'VscAppz.InputBoxOptions.ValidateInput_AppzFuncId')
  - [Value](#F-VscAppz-InputBoxOptions-Value 'VscAppz.InputBoxOptions.Value')
  - [ValueSelection](#F-VscAppz-InputBoxOptions-ValueSelection 'VscAppz.InputBoxOptions.ValueSelection')
- [MessageItem](#T-VscAppz-MessageItem 'VscAppz.MessageItem')
  - [IsCloseAffordance](#F-VscAppz-MessageItem-IsCloseAffordance 'VscAppz.MessageItem.IsCloseAffordance')
  - [My](#F-VscAppz-MessageItem-My 'VscAppz.MessageItem.My')
  - [Title](#F-VscAppz-MessageItem-Title 'VscAppz.MessageItem.Title')
- [MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions')
  - [Modal](#F-VscAppz-MessageOptions-Modal 'VscAppz.MessageOptions.Modal')
- [OpenDialogOptions](#T-VscAppz-OpenDialogOptions 'VscAppz.OpenDialogOptions')
  - [CanSelectFiles](#F-VscAppz-OpenDialogOptions-CanSelectFiles 'VscAppz.OpenDialogOptions.CanSelectFiles')
  - [CanSelectFolders](#F-VscAppz-OpenDialogOptions-CanSelectFolders 'VscAppz.OpenDialogOptions.CanSelectFolders')
  - [CanSelectMany](#F-VscAppz-OpenDialogOptions-CanSelectMany 'VscAppz.OpenDialogOptions.CanSelectMany')
  - [DefaultUri](#F-VscAppz-OpenDialogOptions-DefaultUri 'VscAppz.OpenDialogOptions.DefaultUri')
  - [Filters](#F-VscAppz-OpenDialogOptions-Filters 'VscAppz.OpenDialogOptions.Filters')
  - [OpenLabel](#F-VscAppz-OpenDialogOptions-OpenLabel 'VscAppz.OpenDialogOptions.OpenLabel')
- [OutputChannel](#T-VscAppz-OutputChannel 'VscAppz.OutputChannel')
  - [Append(value)](#M-VscAppz-OutputChannel-Append-System-String- 'VscAppz.OutputChannel.Append(System.String)')
  - [AppendLine(value)](#M-VscAppz-OutputChannel-AppendLine-System-String- 'VscAppz.OutputChannel.AppendLine(System.String)')
  - [Clear()](#M-VscAppz-OutputChannel-Clear 'VscAppz.OutputChannel.Clear')
  - [Dispose()](#M-VscAppz-OutputChannel-Dispose 'VscAppz.OutputChannel.Dispose')
  - [Get()](#M-VscAppz-OutputChannel-Get 'VscAppz.OutputChannel.Get')
  - [Hide()](#M-VscAppz-OutputChannel-Hide 'VscAppz.OutputChannel.Hide')
  - [Show(preserveFocus)](#M-VscAppz-OutputChannel-Show-System-Boolean- 'VscAppz.OutputChannel.Show(System.Boolean)')
- [OutputChannelProperties](#T-VscAppz-OutputChannelProperties 'VscAppz.OutputChannelProperties')
  - [Name](#F-VscAppz-OutputChannelProperties-Name 'VscAppz.OutputChannelProperties.Name')
- [OverviewRulerLane](#T-VscAppz-OverviewRulerLane 'VscAppz.OverviewRulerLane')
  - [Center](#F-VscAppz-OverviewRulerLane-Center 'VscAppz.OverviewRulerLane.Center')
  - [Full](#F-VscAppz-OverviewRulerLane-Full 'VscAppz.OverviewRulerLane.Full')
  - [Left](#F-VscAppz-OverviewRulerLane-Left 'VscAppz.OverviewRulerLane.Left')
  - [Right](#F-VscAppz-OverviewRulerLane-Right 'VscAppz.OverviewRulerLane.Right')
- [QuickPickItem](#T-VscAppz-QuickPickItem 'VscAppz.QuickPickItem')
  - [AlwaysShow](#F-VscAppz-QuickPickItem-AlwaysShow 'VscAppz.QuickPickItem.AlwaysShow')
  - [Description](#F-VscAppz-QuickPickItem-Description 'VscAppz.QuickPickItem.Description')
  - [Detail](#F-VscAppz-QuickPickItem-Detail 'VscAppz.QuickPickItem.Detail')
  - [Label](#F-VscAppz-QuickPickItem-Label 'VscAppz.QuickPickItem.Label')
  - [My](#F-VscAppz-QuickPickItem-My 'VscAppz.QuickPickItem.My')
  - [Picked](#F-VscAppz-QuickPickItem-Picked 'VscAppz.QuickPickItem.Picked')
- [QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions')
  - [CanPickMany](#F-VscAppz-QuickPickOptions-CanPickMany 'VscAppz.QuickPickOptions.CanPickMany')
  - [IgnoreFocusOut](#F-VscAppz-QuickPickOptions-IgnoreFocusOut 'VscAppz.QuickPickOptions.IgnoreFocusOut')
  - [MatchOnDescription](#F-VscAppz-QuickPickOptions-MatchOnDescription 'VscAppz.QuickPickOptions.MatchOnDescription')
  - [MatchOnDetail](#F-VscAppz-QuickPickOptions-MatchOnDetail 'VscAppz.QuickPickOptions.MatchOnDetail')
  - [OnDidSelectItem](#F-VscAppz-QuickPickOptions-OnDidSelectItem 'VscAppz.QuickPickOptions.OnDidSelectItem')
  - [OnDidSelectItem_AppzFuncId](#F-VscAppz-QuickPickOptions-OnDidSelectItem_AppzFuncId 'VscAppz.QuickPickOptions.OnDidSelectItem_AppzFuncId')
  - [PlaceHolder](#F-VscAppz-QuickPickOptions-PlaceHolder 'VscAppz.QuickPickOptions.PlaceHolder')
- [SaveDialogOptions](#T-VscAppz-SaveDialogOptions 'VscAppz.SaveDialogOptions')
  - [DefaultUri](#F-VscAppz-SaveDialogOptions-DefaultUri 'VscAppz.SaveDialogOptions.DefaultUri')
  - [Filters](#F-VscAppz-SaveDialogOptions-Filters 'VscAppz.SaveDialogOptions.Filters')
  - [SaveLabel](#F-VscAppz-SaveDialogOptions-SaveLabel 'VscAppz.SaveDialogOptions.SaveLabel')
- [StatusBarAlignment](#T-VscAppz-StatusBarAlignment 'VscAppz.StatusBarAlignment')
  - [Left](#F-VscAppz-StatusBarAlignment-Left 'VscAppz.StatusBarAlignment.Left')
  - [Right](#F-VscAppz-StatusBarAlignment-Right 'VscAppz.StatusBarAlignment.Right')
- [StatusBarItem](#T-VscAppz-StatusBarItem 'VscAppz.StatusBarItem')
  - [Dispose()](#M-VscAppz-StatusBarItem-Dispose 'VscAppz.StatusBarItem.Dispose')
  - [Get()](#M-VscAppz-StatusBarItem-Get 'VscAppz.StatusBarItem.Get')
  - [Hide()](#M-VscAppz-StatusBarItem-Hide 'VscAppz.StatusBarItem.Hide')
  - [Set()](#M-VscAppz-StatusBarItem-Set-VscAppz-StatusBarItemProperties- 'VscAppz.StatusBarItem.Set(VscAppz.StatusBarItemProperties)')
  - [Show()](#M-VscAppz-StatusBarItem-Show 'VscAppz.StatusBarItem.Show')
- [StatusBarItemProperties](#T-VscAppz-StatusBarItemProperties 'VscAppz.StatusBarItemProperties')
  - [Alignment](#F-VscAppz-StatusBarItemProperties-Alignment 'VscAppz.StatusBarItemProperties.Alignment')
  - [Color](#F-VscAppz-StatusBarItemProperties-Color 'VscAppz.StatusBarItemProperties.Color')
  - [Command](#F-VscAppz-StatusBarItemProperties-Command 'VscAppz.StatusBarItemProperties.Command')
  - [Priority](#F-VscAppz-StatusBarItemProperties-Priority 'VscAppz.StatusBarItemProperties.Priority')
  - [Text](#F-VscAppz-StatusBarItemProperties-Text 'VscAppz.StatusBarItemProperties.Text')
  - [Tooltip](#F-VscAppz-StatusBarItemProperties-Tooltip 'VscAppz.StatusBarItemProperties.Tooltip')
- [TextEditorDecorationType](#T-VscAppz-TextEditorDecorationType 'VscAppz.TextEditorDecorationType')
  - [Dispose()](#M-VscAppz-TextEditorDecorationType-Dispose 'VscAppz.TextEditorDecorationType.Dispose')
  - [Get()](#M-VscAppz-TextEditorDecorationType-Get 'VscAppz.TextEditorDecorationType.Get')
- [TextEditorDecorationTypeProperties](#T-VscAppz-TextEditorDecorationTypeProperties 'VscAppz.TextEditorDecorationTypeProperties')
  - [Key](#F-VscAppz-TextEditorDecorationTypeProperties-Key 'VscAppz.TextEditorDecorationTypeProperties.Key')
- [ThemableDecorationAttachmentRenderOptions](#T-VscAppz-ThemableDecorationAttachmentRenderOptions 'VscAppz.ThemableDecorationAttachmentRenderOptions')
  - [BackgroundColor](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-BackgroundColor 'VscAppz.ThemableDecorationAttachmentRenderOptions.BackgroundColor')
  - [Border](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-Border 'VscAppz.ThemableDecorationAttachmentRenderOptions.Border')
  - [BorderColor](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-BorderColor 'VscAppz.ThemableDecorationAttachmentRenderOptions.BorderColor')
  - [Color](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-Color 'VscAppz.ThemableDecorationAttachmentRenderOptions.Color')
  - [ContentIconPath](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-ContentIconPath 'VscAppz.ThemableDecorationAttachmentRenderOptions.ContentIconPath')
  - [ContentText](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-ContentText 'VscAppz.ThemableDecorationAttachmentRenderOptions.ContentText')
  - [FontStyle](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-FontStyle 'VscAppz.ThemableDecorationAttachmentRenderOptions.FontStyle')
  - [FontWeight](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-FontWeight 'VscAppz.ThemableDecorationAttachmentRenderOptions.FontWeight')
  - [Height](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-Height 'VscAppz.ThemableDecorationAttachmentRenderOptions.Height')
  - [Margin](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-Margin 'VscAppz.ThemableDecorationAttachmentRenderOptions.Margin')
  - [TextDecoration](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-TextDecoration 'VscAppz.ThemableDecorationAttachmentRenderOptions.TextDecoration')
  - [Width](#F-VscAppz-ThemableDecorationAttachmentRenderOptions-Width 'VscAppz.ThemableDecorationAttachmentRenderOptions.Width')
- [ThemableDecorationRenderOptions](#T-VscAppz-ThemableDecorationRenderOptions 'VscAppz.ThemableDecorationRenderOptions')
  - [After](#F-VscAppz-ThemableDecorationRenderOptions-After 'VscAppz.ThemableDecorationRenderOptions.After')
  - [BackgroundColor](#F-VscAppz-ThemableDecorationRenderOptions-BackgroundColor 'VscAppz.ThemableDecorationRenderOptions.BackgroundColor')
  - [Before](#F-VscAppz-ThemableDecorationRenderOptions-Before 'VscAppz.ThemableDecorationRenderOptions.Before')
  - [Border](#F-VscAppz-ThemableDecorationRenderOptions-Border 'VscAppz.ThemableDecorationRenderOptions.Border')
  - [BorderColor](#F-VscAppz-ThemableDecorationRenderOptions-BorderColor 'VscAppz.ThemableDecorationRenderOptions.BorderColor')
  - [BorderRadius](#F-VscAppz-ThemableDecorationRenderOptions-BorderRadius 'VscAppz.ThemableDecorationRenderOptions.BorderRadius')
  - [BorderSpacing](#F-VscAppz-ThemableDecorationRenderOptions-BorderSpacing 'VscAppz.ThemableDecorationRenderOptions.BorderSpacing')
  - [BorderStyle](#F-VscAppz-ThemableDecorationRenderOptions-BorderStyle 'VscAppz.ThemableDecorationRenderOptions.BorderStyle')
  - [BorderWidth](#F-VscAppz-ThemableDecorationRenderOptions-BorderWidth 'VscAppz.ThemableDecorationRenderOptions.BorderWidth')
  - [Color](#F-VscAppz-ThemableDecorationRenderOptions-Color 'VscAppz.ThemableDecorationRenderOptions.Color')
  - [Cursor](#F-VscAppz-ThemableDecorationRenderOptions-Cursor 'VscAppz.ThemableDecorationRenderOptions.Cursor')
  - [FontStyle](#F-VscAppz-ThemableDecorationRenderOptions-FontStyle 'VscAppz.ThemableDecorationRenderOptions.FontStyle')
  - [FontWeight](#F-VscAppz-ThemableDecorationRenderOptions-FontWeight 'VscAppz.ThemableDecorationRenderOptions.FontWeight')
  - [GutterIconPath](#F-VscAppz-ThemableDecorationRenderOptions-GutterIconPath 'VscAppz.ThemableDecorationRenderOptions.GutterIconPath')
  - [GutterIconSize](#F-VscAppz-ThemableDecorationRenderOptions-GutterIconSize 'VscAppz.ThemableDecorationRenderOptions.GutterIconSize')
  - [LetterSpacing](#F-VscAppz-ThemableDecorationRenderOptions-LetterSpacing 'VscAppz.ThemableDecorationRenderOptions.LetterSpacing')
  - [Opacity](#F-VscAppz-ThemableDecorationRenderOptions-Opacity 'VscAppz.ThemableDecorationRenderOptions.Opacity')
  - [Outline](#F-VscAppz-ThemableDecorationRenderOptions-Outline 'VscAppz.ThemableDecorationRenderOptions.Outline')
  - [OutlineColor](#F-VscAppz-ThemableDecorationRenderOptions-OutlineColor 'VscAppz.ThemableDecorationRenderOptions.OutlineColor')
  - [OutlineStyle](#F-VscAppz-ThemableDecorationRenderOptions-OutlineStyle 'VscAppz.ThemableDecorationRenderOptions.OutlineStyle')
  - [OutlineWidth](#F-VscAppz-ThemableDecorationRenderOptions-OutlineWidth 'VscAppz.ThemableDecorationRenderOptions.OutlineWidth')
  - [OverviewRulerColor](#F-VscAppz-ThemableDecorationRenderOptions-OverviewRulerColor 'VscAppz.ThemableDecorationRenderOptions.OverviewRulerColor')
  - [TextDecoration](#F-VscAppz-ThemableDecorationRenderOptions-TextDecoration 'VscAppz.ThemableDecorationRenderOptions.TextDecoration')
- [Vsc](#T-VscAppz-Vsc 'VscAppz.Vsc')
  - [OnError](#F-VscAppz-Vsc-OnError 'VscAppz.Vsc.OnError')
  - [OnErrorDefaultOutputFormat](#F-VscAppz-Vsc-OnErrorDefaultOutputFormat 'VscAppz.Vsc.OnErrorDefaultOutputFormat')
  - [Main(main,stdIn,stdOut)](#M-VscAppz-Vsc-Main-System-Action{VscAppz-IVscode},System-IO-TextReader,System-IO-TextWriter- 'VscAppz.Vsc.Main(System.Action{VscAppz.IVscode},System.IO.TextReader,System.IO.TextWriter)')
- [WindowState](#T-VscAppz-WindowState 'VscAppz.WindowState')
  - [Focused](#F-VscAppz-WindowState-Focused 'VscAppz.WindowState.Focused')
- [WorkspaceFolder](#T-VscAppz-WorkspaceFolder 'VscAppz.WorkspaceFolder')
  - [Index](#F-VscAppz-WorkspaceFolder-Index 'VscAppz.WorkspaceFolder.Index')
  - [Name](#F-VscAppz-WorkspaceFolder-Name 'VscAppz.WorkspaceFolder.Name')
  - [Uri](#F-VscAppz-WorkspaceFolder-Uri 'VscAppz.WorkspaceFolder.Uri')
- [WorkspaceFolderPickOptions](#T-VscAppz-WorkspaceFolderPickOptions 'VscAppz.WorkspaceFolderPickOptions')
  - [IgnoreFocusOut](#F-VscAppz-WorkspaceFolderPickOptions-IgnoreFocusOut 'VscAppz.WorkspaceFolderPickOptions.IgnoreFocusOut')
  - [PlaceHolder](#F-VscAppz-WorkspaceFolderPickOptions-PlaceHolder 'VscAppz.WorkspaceFolderPickOptions.PlaceHolder')
- [WorkspaceFoldersChangeEvent](#T-VscAppz-WorkspaceFoldersChangeEvent 'VscAppz.WorkspaceFoldersChangeEvent')
  - [Added](#F-VscAppz-WorkspaceFoldersChangeEvent-Added 'VscAppz.WorkspaceFoldersChangeEvent.Added')
  - [Removed](#F-VscAppz-WorkspaceFoldersChangeEvent-Removed 'VscAppz.WorkspaceFoldersChangeEvent.Removed')
- [WorkspaceProperties](#T-VscAppz-WorkspaceProperties 'VscAppz.WorkspaceProperties')
  - [Name](#F-VscAppz-WorkspaceProperties-Name 'VscAppz.WorkspaceProperties.Name')
  - [WorkspaceFile](#F-VscAppz-WorkspaceProperties-WorkspaceFile 'VscAppz.WorkspaceProperties.WorkspaceFile')
  - [WorkspaceFolders](#F-VscAppz-WorkspaceProperties-WorkspaceFolders 'VscAppz.WorkspaceProperties.WorkspaceFolders')

<a name='T-VscAppz-Cancel'></a>
## Cancel `type`

##### Namespace

VscAppz

##### Summary

Allows belated cancellation of ongoing / already-initiated interactions.

<a name='M-VscAppz-Cancel-In-System-TimeSpan-'></a>
### In(fromNow) `method`

##### Summary

Cancel.In returns a new `Cancel` with its `Now` already scheduled to be called in `fromNow` duration.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fromNow | [System.TimeSpan](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.TimeSpan 'System.TimeSpan') |  |

<a name='M-VscAppz-Cancel-Now'></a>
### Now() `method`

##### Summary

Cancel.Now signals cancellation to the counterparty.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-DecorationRangeBehavior'></a>
## DecorationRangeBehavior `type`

##### Namespace

VscAppz

##### Summary

Describes the behavior of decorations when typing/editing at their edges.

<a name='F-VscAppz-DecorationRangeBehavior-ClosedClosed'></a>
### ClosedClosed `constants`

##### Summary

The decoration's range will not widen when edits occur at the start of end.

<a name='F-VscAppz-DecorationRangeBehavior-ClosedOpen'></a>
### ClosedOpen `constants`

##### Summary

The decoration's range will widen when edits occur at the end, but not at the start.

<a name='F-VscAppz-DecorationRangeBehavior-OpenClosed'></a>
### OpenClosed `constants`

##### Summary

The decoration's range will widen when edits occur at the start, but not at the end.

<a name='F-VscAppz-DecorationRangeBehavior-OpenOpen'></a>
### OpenOpen `constants`

##### Summary

The decoration's range will widen when edits occur at the start or end.

<a name='T-VscAppz-DecorationRenderOptions'></a>
## DecorationRenderOptions `type`

##### Namespace

VscAppz

##### Summary

Represents rendering styles for a [text editor decoration](https://code.visualstudio.com/api/references/vscode-api#TextEditorDecorationType).

<a name='F-VscAppz-DecorationRenderOptions-Dark'></a>
### Dark `constants`

##### Summary

Overwrite options for dark themes.

<a name='F-VscAppz-DecorationRenderOptions-IsWholeLine'></a>
### IsWholeLine `constants`

##### Summary

Should the decoration be rendered also on the whitespace after the line text.
Defaults to `false`.

<a name='F-VscAppz-DecorationRenderOptions-Light'></a>
### Light `constants`

##### Summary

Overwrite options for light themes.

<a name='F-VscAppz-DecorationRenderOptions-OverviewRulerLane'></a>
### OverviewRulerLane `constants`

##### Summary

The position in the overview ruler where the decoration should be rendered.

<a name='F-VscAppz-DecorationRenderOptions-RangeBehavior'></a>
### RangeBehavior `constants`

##### Summary

Customize the growing behavior of the decoration when edits occur at the edges of the decoration's range.
Defaults to `DecorationRangeBehavior.OpenOpen`.

<a name='T-VscAppz-DiagnosticChangeEvent'></a>
## DiagnosticChangeEvent `type`

##### Namespace

VscAppz

##### Summary

The event that is fired when diagnostics change.

<a name='F-VscAppz-DiagnosticChangeEvent-Uris'></a>
### Uris `constants`

##### Summary

An array of resources for which diagnostics have changed.

<a name='T-VscAppz-Disposable'></a>
## Disposable `type`

##### Namespace

VscAppz

##### Summary

Disposable represents an non-transient object identity lifetimed at the counterparty.

<a name='M-VscAppz-Disposable-Dispose'></a>
### Dispose() `method`

##### Summary

Dispose signals to the counterparty to destroy the object.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-EnvProperties'></a>
## EnvProperties `type`

##### Namespace

VscAppz

##### Summary

Namespace describing the environment the editor runs in.

<a name='F-VscAppz-EnvProperties-AppName'></a>
### AppName `constants`

##### Summary

The application name of the editor, like 'VS Code'.

<a name='F-VscAppz-EnvProperties-AppRoot'></a>
### AppRoot `constants`

##### Summary

The application root folder from which the editor is running.

<a name='F-VscAppz-EnvProperties-Language'></a>
### Language `constants`

##### Summary

Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.

<a name='F-VscAppz-EnvProperties-MachineId'></a>
### MachineId `constants`

##### Summary

A unique identifier for the computer.

<a name='F-VscAppz-EnvProperties-RemoteName'></a>
### RemoteName `constants`

##### Summary

The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
Subsystem for Linux or `ssh-remote` for remotes using a secure shell.

*Note* that the value is `undefined` when there is no remote extension host but that the
value is defined in all extension hosts (local and remote) in case a remote extension host
exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
a specific extension runs remote or not.

<a name='F-VscAppz-EnvProperties-SessionId'></a>
### SessionId `constants`

##### Summary

A unique identifier for the current session.
Changes each time the editor is started.

<a name='F-VscAppz-EnvProperties-Shell'></a>
### Shell `constants`

##### Summary

The detected default shell for the extension host, this is overridden by the
`terminal.integrated.shell` setting for the extension host's platform.

<a name='F-VscAppz-EnvProperties-UriScheme'></a>
### UriScheme `constants`

##### Summary

The custom uri scheme the editor registers to in the operating system.

<a name='T-VscAppz-IClipboard'></a>
## IClipboard `type`

##### Namespace

VscAppz

##### Summary

The clipboard provides read and write access to the system's clipboard.

<a name='M-VscAppz-IClipboard-ReadText'></a>
### ReadText() `method`

##### Summary

Read the current clipboard contents as text.

`return` ── A thenable that resolves to a string.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IClipboard-WriteText-System-String-'></a>
### WriteText() `method`

##### Summary

Writes text into the clipboard.

`return` ── A thenable that resolves when writing happened.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-ICommands'></a>
## ICommands `type`

##### Namespace

VscAppz

##### Summary

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

<a name='M-VscAppz-ICommands-ExecuteCommand-System-String,System-Object[]-'></a>
### ExecuteCommand(command,rest) `method`

##### Summary

Executes the command denoted by the given command identifier.

* *Note 1:* When executing an editor command not all types are allowed to
be passed as arguments. Allowed are the primitive types `string`, `boolean`,
`number`, `undefined`, and `null`, as well as [`Position`](https://code.visualstudio.com/api/references/vscode-api#Position), [`Range`](#Range), [`Uri`](#Uri) and [`Location`](#Location).
* *Note 2:* There are no restrictions when executing commands that have been contributed
by extensions.

`command` ── Identifier of the command to execute.

`rest` ── Parameters passed to the command function.

`return` ── A thenable that resolves to the returned value of the given command. `undefined` when
the command handler function doesn't return anything.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| command | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | Identifier of the command to execute. |
| rest | [System.Object[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Object[] 'System.Object[]') | Parameters passed to the command function. |

<a name='M-VscAppz-ICommands-GetCommands-System-Boolean-'></a>
### GetCommands(filterInternal) `method`

##### Summary

Retrieve the list of all available commands. Commands starting an underscore are
treated as internal commands.

`filterInternal` ── Set `true` to not see internal commands (starting with an underscore)

`return` ── Thenable that resolves to a list of command ids.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| filterInternal | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | Set `true` to not see internal commands (starting with an underscore) |

<a name='M-VscAppz-ICommands-RegisterCommand-System-String,System-Func{System-Object[],System-Object}-'></a>
### RegisterCommand(command,callback) `method`

##### Summary

Registers a command that can be invoked via a keyboard shortcut,
a menu item, an action, or directly.

Registering a command with an existing command identifier twice
will cause an error.

`command` ── A unique identifier for the command.

`callback` ── A command handler function.

`return` ── Disposable which unregisters this command on disposal.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| command | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | A unique identifier for the command. |
| callback | [System.Func{System.Object[],System.Object}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Func 'System.Func{System.Object[],System.Object}') | A command handler function. |

<a name='T-VscAppz-IEnv'></a>
## IEnv `type`

##### Namespace

VscAppz

##### Summary

Namespace describing the environment the editor runs in.

<a name='M-VscAppz-IEnv-AppName'></a>
### AppName() `method`

##### Summary

The application name of the editor, like 'VS Code'.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-AppRoot'></a>
### AppRoot() `method`

##### Summary

The application root folder from which the editor is running.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-Clipboard'></a>
### Clipboard() `method`

##### Summary

The clipboard provides read and write access to the system's clipboard.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-Language'></a>
### Language() `method`

##### Summary

Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-MachineId'></a>
### MachineId() `method`

##### Summary

A unique identifier for the computer.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-OpenExternal-System-String-'></a>
### OpenExternal(target) `method`

##### Summary

Opens an *external* item, e.g. a http(s) or mailto-link, using the
default application.

*Note* that [`showTextDocument`](https://code.visualstudio.com/api/references/vscode-api#window.showTextDocument) is the right
way to open a text document inside the editor, not this function.

`target` ── The uri that should be opened.

`return` ── A promise indicating if open was successful.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| target | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The uri that should be opened. |

<a name='M-VscAppz-IEnv-Properties'></a>
### Properties() `method`

##### Summary

Provides single-call access to numerous individual `IEnv` properties at once.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-RemoteName'></a>
### RemoteName() `method`

##### Summary

The name of a remote. Defined by extensions, popular samples are `wsl` for the Windows
Subsystem for Linux or `ssh-remote` for remotes using a secure shell.

*Note* that the value is `undefined` when there is no remote extension host but that the
value is defined in all extension hosts (local and remote) in case a remote extension host
exists. Use [`Extension#extensionKind`](https://code.visualstudio.com/api/references/vscode-api#Extension.extensionKind) to know if
a specific extension runs remote or not.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-SessionId'></a>
### SessionId() `method`

##### Summary

A unique identifier for the current session.
Changes each time the editor is started.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-Shell'></a>
### Shell() `method`

##### Summary

The detected default shell for the extension host, this is overridden by the
`terminal.integrated.shell` setting for the extension host's platform.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IEnv-UriScheme'></a>
### UriScheme() `method`

##### Summary

The custom uri scheme the editor registers to in the operating system.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-IExtensions'></a>
## IExtensions `type`

##### Namespace

VscAppz

##### Summary

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

<a name='M-VscAppz-IExtensions-OnDidChange-System-Action-'></a>
### OnDidChange() `method`

##### Summary

An event which fires when `extensions.all` changes. This can happen when extensions are
installed, uninstalled, enabled or disabled.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-ILanguages'></a>
## ILanguages `type`

##### Namespace

VscAppz

##### Summary

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

<a name='M-VscAppz-ILanguages-GetLanguages'></a>
### GetLanguages() `method`

##### Summary

Return the identifiers of all known languages.

`return` ── Promise resolving to an array of identifier strings.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-ILanguages-OnDidChangeDiagnostics-System-Action{VscAppz-DiagnosticChangeEvent}-'></a>
### OnDidChangeDiagnostics() `method`

##### Summary

An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the global set of diagnostics changes. This is
newly added and removed diagnostics.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-IVscode'></a>
## IVscode `type`

##### Namespace

VscAppz

##### Summary

Type Definition for Visual Studio Code 1.38 Extension API
See https://code.visualstudio.com/api for more information

<a name='P-VscAppz-IVscode-Commands'></a>
### Commands `property`

##### Summary

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

<a name='P-VscAppz-IVscode-Env'></a>
### Env `property`

##### Summary

Namespace describing the environment the editor runs in.

<a name='P-VscAppz-IVscode-Extensions'></a>
### Extensions `property`

##### Summary

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

<a name='P-VscAppz-IVscode-Languages'></a>
### Languages `property`

##### Summary

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

<a name='P-VscAppz-IVscode-Window'></a>
### Window `property`

##### Summary

Namespace for dealing with the current window of the editor. That is visible
and active editors, as well as, UI elements to show messages, selections, and
asking for user input.

<a name='P-VscAppz-IVscode-Workspace'></a>
### Workspace `property`

##### Summary

Namespace for dealing with the current workspace. A workspace is the representation
of the folder that has been opened. There is no workspace when just a file but not a
folder has been opened.

The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
the editor-process so that they should be always used instead of nodejs-equivalents.

<a name='T-VscAppz-IWindow'></a>
## IWindow `type`

##### Namespace

VscAppz

##### Summary

Namespace for dealing with the current window of the editor. That is visible
and active editors, as well as, UI elements to show messages, selections, and
asking for user input.

<a name='M-VscAppz-IWindow-CreateOutputChannel-System-String-'></a>
### CreateOutputChannel(name) `method`

##### Summary

Creates a new [output channel](https://code.visualstudio.com/api/references/vscode-api#OutputChannel) with the given name.

`name` ── Human-readable string which will be used to represent the channel in the UI.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | Human-readable string which will be used to represent the channel in the UI. |

<a name='M-VscAppz-IWindow-CreateStatusBarItem-System-Nullable{VscAppz-StatusBarAlignment},System-Nullable{System-Int32}-'></a>
### CreateStatusBarItem(alignment,priority) `method`

##### Summary

Creates a status bar [item](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem).

`alignment` ── The alignment of the item.

`priority` ── The priority of the item. Higher values mean the item should be shown more to the left.

`return` ── A new status bar item.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| alignment | [System.Nullable{VscAppz.StatusBarAlignment}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Nullable 'System.Nullable{VscAppz.StatusBarAlignment}') | The alignment of the item. |
| priority | [System.Nullable{System.Int32}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Nullable 'System.Nullable{System.Int32}') | The priority of the item. Higher values mean the item should be shown more to the left. |

<a name='M-VscAppz-IWindow-CreateTextEditorDecorationType-VscAppz-DecorationRenderOptions-'></a>
### CreateTextEditorDecorationType(options) `method`

##### Summary

Create a TextEditorDecorationType that can be used to add decorations to text editors.

`options` ── Rendering options for the decoration type.

`return` ── A new decoration type instance.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.DecorationRenderOptions](#T-VscAppz-DecorationRenderOptions 'VscAppz.DecorationRenderOptions') | Rendering options for the decoration type. |

<a name='M-VscAppz-IWindow-OnDidChangeWindowState-System-Action{VscAppz-WindowState}-'></a>
### OnDidChangeWindowState() `method`

##### Summary

An [event](https://code.visualstudio.com/api/references/vscode-api#Event) which fires when the focus state of the current window
changes. The value of the event represents whether the window is focused.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IWindow-SetStatusBarMessage1-System-String,System-Int32-'></a>
### SetStatusBarMessage1(text,hideAfterTimeout) `method`

##### Summary

Set a message to the status bar. This is a short hand for the more powerful
status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).

`text` ── The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).

`hideAfterTimeout` ── Timeout in milliseconds after which the message will be disposed.

`return` ── A disposable which hides the status bar message.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| text | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text). |
| hideAfterTimeout | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Timeout in milliseconds after which the message will be disposed. |

<a name='M-VscAppz-IWindow-SetStatusBarMessage2-System-String-'></a>
### SetStatusBarMessage2(text) `method`

##### Summary

Set a message to the status bar. This is a short hand for the more powerful
status bar [items](https://code.visualstudio.com/api/references/vscode-api#window.createStatusBarItem).

*Note* that status bar messages stack and that they must be disposed when no
longer used.

`text` ── The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text).

`return` ── A disposable which hides the status bar message.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| text | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show, supports icon substitution as in status bar [items](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.text). |

<a name='M-VscAppz-IWindow-ShowErrorMessage1-System-String,System-String[]-'></a>
### ShowErrorMessage1(message,items) `method`

##### Summary

Show an error message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowErrorMessage2-System-String,VscAppz-MessageOptions,System-String[]-'></a>
### ShowErrorMessage2(message,options,items) `method`

##### Summary

Show an error message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowErrorMessage3-System-String,VscAppz-MessageItem[]-'></a>
### ShowErrorMessage3(message,items) `method`

##### Summary

Show an error message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowErrorMessage4-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[]-'></a>
### ShowErrorMessage4(message,options,items) `method`

##### Summary

Show an error message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowInformationMessage1-System-String,System-String[]-'></a>
### ShowInformationMessage1(message,items) `method`

##### Summary

Show an information message to users. Optionally provide an array of items which will be presented as
clickable buttons.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowInformationMessage2-System-String,VscAppz-MessageOptions,System-String[]-'></a>
### ShowInformationMessage2(message,options,items) `method`

##### Summary

Show an information message to users. Optionally provide an array of items which will be presented as
clickable buttons.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowInformationMessage3-System-String,VscAppz-MessageItem[]-'></a>
### ShowInformationMessage3(message,items) `method`

##### Summary

Show an information message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowInformationMessage4-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[]-'></a>
### ShowInformationMessage4(message,options,items) `method`

##### Summary

Show an information message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowInputBox-VscAppz-InputBoxOptions,VscAppz-Cancel-'></a>
### ShowInputBox(options,token) `method`

##### Summary

Opens an input box to ask the user for input.

The returned value will be `undefined` if the input box was canceled (e.g. pressing ESC). Otherwise the
returned value will be the string typed by the user or an empty string if the user did not type
anything but dismissed the input box with OK.

`options` ── Configures the behavior of the input box.

`token` ── A token that can be used to signal cancellation.

`return` ── A promise that resolves to a string the user provided or to `undefined` in case of dismissal.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.InputBoxOptions](#T-VscAppz-InputBoxOptions 'VscAppz.InputBoxOptions') | Configures the behavior of the input box. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |

<a name='M-VscAppz-IWindow-ShowOpenDialog-VscAppz-OpenDialogOptions-'></a>
### ShowOpenDialog(options) `method`

##### Summary

Shows a file open dialog to the user which allows to select a file
for opening-purposes.

`options` ── Options that control the dialog.

`return` ── A promise that resolves to the selected resources or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.OpenDialogOptions](#T-VscAppz-OpenDialogOptions 'VscAppz.OpenDialogOptions') | Options that control the dialog. |

<a name='M-VscAppz-IWindow-ShowQuickPick1-System-String[],VscAppz-QuickPickOptions,VscAppz-Cancel-'></a>
### ShowQuickPick1(items,options,token) `method`

##### Summary

Shows a selection list allowing multiple selections.

`items` ── An array of strings, or a promise that resolves to an array of strings.

`options` ── Configures the behavior of the selection list.

`token` ── A token that can be used to signal cancellation.

`return` ── A promise that resolves to the selected items or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | An array of strings, or a promise that resolves to an array of strings. |
| options | [VscAppz.QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions') | Configures the behavior of the selection list. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |

<a name='M-VscAppz-IWindow-ShowQuickPick2-System-String[],VscAppz-QuickPickOptions,VscAppz-Cancel-'></a>
### ShowQuickPick2(items,options,token) `method`

##### Summary

Shows a selection list.

`items` ── An array of strings, or a promise that resolves to an array of strings.

`options` ── Configures the behavior of the selection list.

`token` ── A token that can be used to signal cancellation.

`return` ── A promise that resolves to the selection or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | An array of strings, or a promise that resolves to an array of strings. |
| options | [VscAppz.QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions') | Configures the behavior of the selection list. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |

<a name='M-VscAppz-IWindow-ShowQuickPick3-VscAppz-QuickPickItem[],VscAppz-QuickPickOptions,VscAppz-Cancel-'></a>
### ShowQuickPick3(items,options,token) `method`

##### Summary

Shows a selection list allowing multiple selections.

`items` ── An array of items, or a promise that resolves to an array of items.

`options` ── Configures the behavior of the selection list.

`token` ── A token that can be used to signal cancellation.

`return` ── A promise that resolves to the selected items or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| items | [VscAppz.QuickPickItem[]](#T-VscAppz-QuickPickItem[] 'VscAppz.QuickPickItem[]') | An array of items, or a promise that resolves to an array of items. |
| options | [VscAppz.QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions') | Configures the behavior of the selection list. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |

<a name='M-VscAppz-IWindow-ShowQuickPick4-VscAppz-QuickPickItem[],VscAppz-QuickPickOptions,VscAppz-Cancel-'></a>
### ShowQuickPick4(items,options,token) `method`

##### Summary

Shows a selection list.

`items` ── An array of items, or a promise that resolves to an array of items.

`options` ── Configures the behavior of the selection list.

`token` ── A token that can be used to signal cancellation.

`return` ── A promise that resolves to the selected item or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| items | [VscAppz.QuickPickItem[]](#T-VscAppz-QuickPickItem[] 'VscAppz.QuickPickItem[]') | An array of items, or a promise that resolves to an array of items. |
| options | [VscAppz.QuickPickOptions](#T-VscAppz-QuickPickOptions 'VscAppz.QuickPickOptions') | Configures the behavior of the selection list. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation. |

<a name='M-VscAppz-IWindow-ShowSaveDialog-VscAppz-SaveDialogOptions-'></a>
### ShowSaveDialog(options) `method`

##### Summary

Shows a file save dialog to the user which allows to select a file
for saving-purposes.

`options` ── Options that control the dialog.

`return` ── A promise that resolves to the selected resource or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.SaveDialogOptions](#T-VscAppz-SaveDialogOptions 'VscAppz.SaveDialogOptions') | Options that control the dialog. |

<a name='M-VscAppz-IWindow-ShowWarningMessage1-System-String,System-String[]-'></a>
### ShowWarningMessage1(message,items) `method`

##### Summary

Show a warning message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowWarningMessage2-System-String,VscAppz-MessageOptions,System-String[]-'></a>
### ShowWarningMessage2(message,options,items) `method`

##### Summary

Show a warning message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [System.String[]](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String[] 'System.String[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowWarningMessage3-System-String,VscAppz-MessageItem[]-'></a>
### ShowWarningMessage3(message,items) `method`

##### Summary

Show a warning message.

`message` ── The message to show.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowWarningMessage4-System-String,VscAppz-MessageOptions,VscAppz-MessageItem[]-'></a>
### ShowWarningMessage4(message,options,items) `method`

##### Summary

Show a warning message.

`message` ── The message to show.

`options` ── Configures the behaviour of the message.

`items` ── A set of items that will be rendered as actions in the message.

`return` ── A thenable that resolves to the selected item or `undefined` when being dismissed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | The message to show. |
| options | [VscAppz.MessageOptions](#T-VscAppz-MessageOptions 'VscAppz.MessageOptions') | Configures the behaviour of the message. |
| items | [VscAppz.MessageItem[]](#T-VscAppz-MessageItem[] 'VscAppz.MessageItem[]') | A set of items that will be rendered as actions in the message. |

<a name='M-VscAppz-IWindow-ShowWorkspaceFolderPick-VscAppz-WorkspaceFolderPickOptions-'></a>
### ShowWorkspaceFolderPick(options) `method`

##### Summary

Shows a selection list of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) to pick from.
Returns `undefined` if no folder is open.

`options` ── Configures the behavior of the workspace folder list.

`return` ── A promise that resolves to the workspace folder or `undefined`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| options | [VscAppz.WorkspaceFolderPickOptions](#T-VscAppz-WorkspaceFolderPickOptions 'VscAppz.WorkspaceFolderPickOptions') | Configures the behavior of the workspace folder list. |

<a name='M-VscAppz-IWindow-State'></a>
### State() `method`

##### Summary

Represents the current window's state.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-IWorkspace'></a>
## IWorkspace `type`

##### Namespace

VscAppz

##### Summary

Namespace for dealing with the current workspace. A workspace is the representation
of the folder that has been opened. There is no workspace when just a file but not a
folder has been opened.

The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
the editor-process so that they should be always used instead of nodejs-equivalents.

<a name='M-VscAppz-IWorkspace-AsRelativePath-System-String,System-Boolean-'></a>
### AsRelativePath(pathOrUri,includeWorkspaceFolder) `method`

##### Summary

Returns a path that is relative to the workspace folder or folders.

When there are no [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) or when the path
is not contained in them, the input is returned.

`pathOrUri` ── A path or uri. When a uri is given its [fsPath](https://code.visualstudio.com/api/references/vscode-api#Uri.fsPath) is used.

`includeWorkspaceFolder` ── When `true` and when the given path is contained inside a
workspace folder the name of the workspace is prepended. Defaults to `true` when there are
multiple workspace folders and `false` otherwise.

`return` ── A path relative to the root or the input.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| pathOrUri | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | A path or uri. When a uri is given its [fsPath](https://code.visualstudio.com/api/references/vscode-api#Uri.fsPath) is used. |
| includeWorkspaceFolder | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | When `true` and when the given path is contained inside a workspace folder the name of the workspace is prepended. Defaults to `true` when there are multiple workspace folders and `false` otherwise. |

<a name='M-VscAppz-IWorkspace-FindFiles-System-String,System-String,System-Nullable{System-Int32},VscAppz-Cancel-'></a>
### FindFiles(include,exclude,maxResults,token) `method`

##### Summary

Find files across all [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) in the workspace.
`findFiles('**​/*.js', '**​/node_modules/**', 10)`

`include` ── A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines the files to search for. The glob pattern
will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern)
to restrict the search results to a [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder).

`exclude` ── A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines files and folders to exclude. The glob pattern
will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will
apply, when `null` no excludes will apply.

`maxResults` ── An upper-bound for the result.

`token` ── A token that can be used to signal cancellation to the underlying search engine.

`return` ── A thenable that resolves to an array of resource identifiers. Will return no results if no
[workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders) are opened.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| include | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines the files to search for. The glob pattern will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](https://code.visualstudio.com/api/references/vscode-api#RelativePattern) to restrict the search results to a [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder). |
| exclude | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | A [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) that defines files and folders to exclude. The glob pattern will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will apply, when `null` no excludes will apply. |
| maxResults | [System.Nullable{System.Int32}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Nullable 'System.Nullable{System.Int32}') | An upper-bound for the result. |
| token | [VscAppz.Cancel](#T-VscAppz-Cancel 'VscAppz.Cancel') | A token that can be used to signal cancellation to the underlying search engine. |

<a name='M-VscAppz-IWorkspace-GetWorkspaceFolder-System-String-'></a>
### GetWorkspaceFolder(uri) `method`

##### Summary

Returns the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) that contains a given uri.
* returns `undefined` when the given uri doesn't match any workspace folder
* returns the *input* when the given uri is a workspace folder itself

`uri` ── An uri.

`return` ── A workspace folder or `undefined`

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| uri | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | An uri. |

<a name='M-VscAppz-IWorkspace-Name'></a>
### Name() `method`

##### Summary

The name of the workspace. `undefined` when no folder
has been opened.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IWorkspace-OnDidChangeWorkspaceFolders-System-Action{VscAppz-WorkspaceFoldersChangeEvent}-'></a>
### OnDidChangeWorkspaceFolders() `method`

##### Summary

An event that is emitted when a workspace folder is added or removed.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IWorkspace-Properties'></a>
### Properties() `method`

##### Summary

Provides single-call access to numerous individual `IWorkspace` properties at once.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IWorkspace-SaveAll-System-Boolean-'></a>
### SaveAll(includeUntitled) `method`

##### Summary

Save all dirty files.

`includeUntitled` ── Also save files that have been created during this session.

`return` ── A thenable that resolves when the files have been saved.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| includeUntitled | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | Also save files that have been created during this session. |

<a name='M-VscAppz-IWorkspace-WorkspaceFile'></a>
### WorkspaceFile() `method`

##### Summary

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

##### Parameters

This method has no parameters.

<a name='M-VscAppz-IWorkspace-WorkspaceFolders'></a>
### WorkspaceFolders() `method`

##### Summary

List of workspace folders or `undefined` when no folder is open.
*Note* that the first entry corresponds to the value of `rootPath`.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-InputBoxOptions'></a>
## InputBoxOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behavior of the input box UI.

<a name='F-VscAppz-InputBoxOptions-IgnoreFocusOut'></a>
### IgnoreFocusOut `constants`

##### Summary

Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.

<a name='F-VscAppz-InputBoxOptions-Password'></a>
### Password `constants`

##### Summary

Set to `true` to show a password prompt that will not show the typed value.

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

`value` ── The current value of the input box.

`return` ── A human readable string which is presented as diagnostic message.
Return `undefined`, `null`, or the empty string when 'value' is valid.

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

Selection of the prefilled [`value`](https://code.visualstudio.com/api/references/vscode-api#InputBoxOptions.value). Defined as tuple of two number where the
first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
word will be selected, when empty (start equals end) only the cursor will be set,
otherwise the defined range will be selected.

<a name='T-VscAppz-MessageItem'></a>
## MessageItem `type`

##### Namespace

VscAppz

##### Summary

Represents an action that is shown with an information, warning, or
error message.

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

<a name='F-VscAppz-MessageOptions-Modal'></a>
### Modal `constants`

##### Summary

Indicates that this message should be modal.

<a name='T-VscAppz-OpenDialogOptions'></a>
## OpenDialogOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behaviour of a file open dialog.

* Note 1: A dialog can select files, folders, or both. This is not true for Windows
which enforces to open either files or folder, but *not both*.
* Note 2: Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
and the editor then silently adjusts the options to select files.

<a name='F-VscAppz-OpenDialogOptions-CanSelectFiles'></a>
### CanSelectFiles `constants`

##### Summary

Allow to select files, defaults to `true`.

<a name='F-VscAppz-OpenDialogOptions-CanSelectFolders'></a>
### CanSelectFolders `constants`

##### Summary

Allow to select folders, defaults to `false`.

<a name='F-VscAppz-OpenDialogOptions-CanSelectMany'></a>
### CanSelectMany `constants`

##### Summary

Allow to select many files or folders.

<a name='F-VscAppz-OpenDialogOptions-DefaultUri'></a>
### DefaultUri `constants`

##### Summary

The resource the dialog shows when opened.

<a name='F-VscAppz-OpenDialogOptions-Filters'></a>
### Filters `constants`

##### Summary

A set of file filters that are used by the dialog. Each entry is a human readable label,
like "TypeScript", and an array of extensions, e.g.

```ts

{
 	'Images': ['png', 'jpg']
 	'TypeScript': ['ts', 'tsx']
}

```

<a name='F-VscAppz-OpenDialogOptions-OpenLabel'></a>
### OpenLabel `constants`

##### Summary

A human-readable string for the open button.

<a name='T-VscAppz-OutputChannel'></a>
## OutputChannel `type`

##### Namespace

VscAppz

##### Summary

An output channel is a container for readonly textual information.

To get an instance of an `OutputChannel` use
[createOutputChannel](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel).

<a name='M-VscAppz-OutputChannel-Append-System-String-'></a>
### Append(value) `method`

##### Summary

Append the given value to the channel.

`value` ── A string, falsy values will not be printed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | A string, falsy values will not be printed. |

<a name='M-VscAppz-OutputChannel-AppendLine-System-String-'></a>
### AppendLine(value) `method`

##### Summary

Append the given value and a line feed character
to the channel.

`value` ── A string, falsy values will be printed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | A string, falsy values will be printed. |

<a name='M-VscAppz-OutputChannel-Clear'></a>
### Clear() `method`

##### Summary

Removes all output from the channel.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-OutputChannel-Dispose'></a>
### Dispose() `method`

##### Summary

Dispose and free associated resources.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-OutputChannel-Get'></a>
### Get() `method`

##### Summary

Obtains this `OutputChannel`'s current property value for: `name`.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-OutputChannel-Hide'></a>
### Hide() `method`

##### Summary

Hide this channel from the UI.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-OutputChannel-Show-System-Boolean-'></a>
### Show(preserveFocus) `method`

##### Summary

Reveal this channel in the UI.

`preserveFocus` ── When `true` the channel will not take focus.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| preserveFocus | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | When `true` the channel will not take focus. |

<a name='T-VscAppz-OutputChannelProperties'></a>
## OutputChannelProperties `type`

##### Namespace

VscAppz

##### Summary

An output channel is a container for readonly textual information.

To get an instance of an `OutputChannel` use
[createOutputChannel](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel).

<a name='F-VscAppz-OutputChannelProperties-Name'></a>
### Name `constants`

##### Summary

The human-readable name of this output channel.

<a name='T-VscAppz-OverviewRulerLane'></a>
## OverviewRulerLane `type`

##### Namespace

VscAppz

##### Summary

Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
The overview ruler supports three lanes.

<a name='F-VscAppz-OverviewRulerLane-Center'></a>
### Center `constants`

##### Summary

Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
The overview ruler supports three lanes.

<a name='F-VscAppz-OverviewRulerLane-Full'></a>
### Full `constants`

##### Summary

Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
The overview ruler supports three lanes.

<a name='F-VscAppz-OverviewRulerLane-Left'></a>
### Left `constants`

##### Summary

Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
The overview ruler supports three lanes.

<a name='F-VscAppz-OverviewRulerLane-Right'></a>
### Right `constants`

##### Summary

Represents different positions for rendering a decoration in an [overview ruler](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions.overviewRulerLane).
The overview ruler supports three lanes.

<a name='T-VscAppz-QuickPickItem'></a>
## QuickPickItem `type`

##### Namespace

VscAppz

##### Summary

Represents an item that can be selected from
a list of items.

<a name='F-VscAppz-QuickPickItem-AlwaysShow'></a>
### AlwaysShow `constants`

##### Summary

Always show this item.

<a name='F-VscAppz-QuickPickItem-Description'></a>
### Description `constants`

##### Summary

A human readable string which is rendered less prominent.

<a name='F-VscAppz-QuickPickItem-Detail'></a>
### Detail `constants`

##### Summary

A human readable string which is rendered less prominent.

<a name='F-VscAppz-QuickPickItem-Label'></a>
### Label `constants`

##### Summary

A human readable string which is rendered prominent.

<a name='F-VscAppz-QuickPickItem-My'></a>
### My `constants`

##### Summary

Free-form custom data, preserved across a roundtrip.

<a name='F-VscAppz-QuickPickItem-Picked'></a>
### Picked `constants`

##### Summary

Optional flag indicating if this item is picked initially.
(Only honored when the picker allows multiple selections.)

<a name='T-VscAppz-QuickPickOptions'></a>
## QuickPickOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behavior of the quick pick UI.

<a name='F-VscAppz-QuickPickOptions-CanPickMany'></a>
### CanPickMany `constants`

##### Summary

An optional flag to make the picker accept multiple selections, if true the result is an array of picks.

<a name='F-VscAppz-QuickPickOptions-IgnoreFocusOut'></a>
### IgnoreFocusOut `constants`

##### Summary

Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.

<a name='F-VscAppz-QuickPickOptions-MatchOnDescription'></a>
### MatchOnDescription `constants`

##### Summary

An optional flag to include the description when filtering the picks.

<a name='F-VscAppz-QuickPickOptions-MatchOnDetail'></a>
### MatchOnDetail `constants`

##### Summary

An optional flag to include the detail when filtering the picks.

<a name='F-VscAppz-QuickPickOptions-OnDidSelectItem'></a>
### OnDidSelectItem `constants`

##### Summary

An optional function that is invoked whenever an item is selected.

<a name='F-VscAppz-QuickPickOptions-OnDidSelectItem_AppzFuncId'></a>
### OnDidSelectItem_AppzFuncId `constants`

##### Summary

For internal runtime use only.

<a name='F-VscAppz-QuickPickOptions-PlaceHolder'></a>
### PlaceHolder `constants`

##### Summary

An optional string to show as place holder in the input box to guide the user what to pick on.

<a name='T-VscAppz-SaveDialogOptions'></a>
## SaveDialogOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behaviour of a file save dialog.

<a name='F-VscAppz-SaveDialogOptions-DefaultUri'></a>
### DefaultUri `constants`

##### Summary

The resource the dialog shows when opened.

<a name='F-VscAppz-SaveDialogOptions-Filters'></a>
### Filters `constants`

##### Summary

A set of file filters that are used by the dialog. Each entry is a human readable label,
like "TypeScript", and an array of extensions, e.g.

```ts

{
 	'Images': ['png', 'jpg']
 	'TypeScript': ['ts', 'tsx']
}

```

<a name='F-VscAppz-SaveDialogOptions-SaveLabel'></a>
### SaveLabel `constants`

##### Summary

A human-readable string for the save button.

<a name='T-VscAppz-StatusBarAlignment'></a>
## StatusBarAlignment `type`

##### Namespace

VscAppz

##### Summary

Represents the alignment of status bar items.

<a name='F-VscAppz-StatusBarAlignment-Left'></a>
### Left `constants`

##### Summary

Aligned to the left side.

<a name='F-VscAppz-StatusBarAlignment-Right'></a>
### Right `constants`

##### Summary

Aligned to the right side.

<a name='T-VscAppz-StatusBarItem'></a>
## StatusBarItem `type`

##### Namespace

VscAppz

##### Summary

A status bar item is a status bar contribution that can
show text and icons and run a command on click.

<a name='M-VscAppz-StatusBarItem-Dispose'></a>
### Dispose() `method`

##### Summary

Dispose and free associated resources. Call
[hide](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem.hide).

##### Parameters

This method has no parameters.

<a name='M-VscAppz-StatusBarItem-Get'></a>
### Get() `method`

##### Summary

Obtains this `StatusBarItem`'s current property values for: `alignment`, `priority`, `text`, `tooltip`, `color`, `command`.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-StatusBarItem-Hide'></a>
### Hide() `method`

##### Summary

Hide the entry in the status bar.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-StatusBarItem-Set-VscAppz-StatusBarItemProperties-'></a>
### Set() `method`

##### Summary

Updates this `StatusBarItem`'s current property values for: `text`, `tooltip`, `color`, `command`.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-StatusBarItem-Show'></a>
### Show() `method`

##### Summary

Shows the entry in the status bar.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-StatusBarItemProperties'></a>
## StatusBarItemProperties `type`

##### Namespace

VscAppz

##### Summary

A status bar item is a status bar contribution that can
show text and icons and run a command on click.

<a name='F-VscAppz-StatusBarItemProperties-Alignment'></a>
### Alignment `constants`

##### Summary

The alignment of this item.

<a name='F-VscAppz-StatusBarItemProperties-Color'></a>
### Color `constants`

##### Summary

The foreground color for this entry.

<a name='F-VscAppz-StatusBarItemProperties-Command'></a>
### Command `constants`

##### Summary

The identifier of a command to run on click. The command must be
[known](https://code.visualstudio.com/api/references/vscode-api#commands.getCommands).

<a name='F-VscAppz-StatusBarItemProperties-Priority'></a>
### Priority `constants`

##### Summary

The priority of this item. Higher value means the item should
be shown more to the left.

<a name='F-VscAppz-StatusBarItemProperties-Text'></a>
### Text `constants`

##### Summary

The text to show for the entry. You can embed icons in the text by leveraging the syntax:

`My text $(icon-name) contains icons like $(icon-name) this one.`

Where the icon-name is taken from the [octicon](https://octicons.github.com) icon set, e.g.
`light-bulb`, `thumbsup`, `zap` etc.

<a name='F-VscAppz-StatusBarItemProperties-Tooltip'></a>
### Tooltip `constants`

##### Summary

The tooltip text when you hover over this entry.

<a name='T-VscAppz-TextEditorDecorationType'></a>
## TextEditorDecorationType `type`

##### Namespace

VscAppz

##### Summary

Represents a handle to a set of decorations
sharing the same [styling options](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions) in a [text editor](#TextEditor).

To get an instance of a `TextEditorDecorationType` use
[createTextEditorDecorationType](https://code.visualstudio.com/api/references/vscode-api#window.createTextEditorDecorationType).

<a name='M-VscAppz-TextEditorDecorationType-Dispose'></a>
### Dispose() `method`

##### Summary

Remove this decoration type and all decorations on all text editors using it.

##### Parameters

This method has no parameters.

<a name='M-VscAppz-TextEditorDecorationType-Get'></a>
### Get() `method`

##### Summary

Obtains this `TextEditorDecorationType`'s current property value for: `key`.

##### Parameters

This method has no parameters.

<a name='T-VscAppz-TextEditorDecorationTypeProperties'></a>
## TextEditorDecorationTypeProperties `type`

##### Namespace

VscAppz

##### Summary

Represents a handle to a set of decorations
sharing the same [styling options](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions) in a [text editor](#TextEditor).

To get an instance of a `TextEditorDecorationType` use
[createTextEditorDecorationType](https://code.visualstudio.com/api/references/vscode-api#window.createTextEditorDecorationType).

<a name='F-VscAppz-TextEditorDecorationTypeProperties-Key'></a>
### Key `constants`

##### Summary

Internal representation of the handle.

<a name='T-VscAppz-ThemableDecorationAttachmentRenderOptions'></a>
## ThemableDecorationAttachmentRenderOptions `type`

##### Namespace

VscAppz

##### Summary

Type Definition for Visual Studio Code 1.38 Extension API
See https://code.visualstudio.com/api for more information

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-BackgroundColor'></a>
### BackgroundColor `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-Border'></a>
### Border `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-BorderColor'></a>
### BorderColor `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-Color'></a>
### Color `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-ContentIconPath'></a>
### ContentIconPath `constants`

##### Summary

An **absolute path** or an URI to an image to be rendered in the attachment. Either an icon
or a text can be shown, but not both.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-ContentText'></a>
### ContentText `constants`

##### Summary

Defines a text content that is shown in the attachment. Either an icon or a text can be shown, but not both.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-FontStyle'></a>
### FontStyle `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-FontWeight'></a>
### FontWeight `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-Height'></a>
### Height `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-Margin'></a>
### Margin `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-TextDecoration'></a>
### TextDecoration `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='F-VscAppz-ThemableDecorationAttachmentRenderOptions-Width'></a>
### Width `constants`

##### Summary

CSS styling property that will be applied to the decoration attachment.

<a name='T-VscAppz-ThemableDecorationRenderOptions'></a>
## ThemableDecorationRenderOptions `type`

##### Namespace

VscAppz

##### Summary

Represents theme specific rendering styles for a [text editor decoration](https://code.visualstudio.com/api/references/vscode-api#TextEditorDecorationType).

<a name='F-VscAppz-ThemableDecorationRenderOptions-After'></a>
### After `constants`

##### Summary

Defines the rendering options of the attachment that is inserted after the decorated text.

<a name='F-VscAppz-ThemableDecorationRenderOptions-BackgroundColor'></a>
### BackgroundColor `constants`

##### Summary

Background color of the decoration. Use rgba() and define transparent background colors to play well with other decorations.
Alternatively a color from the color registry can be [referenced](https://code.visualstudio.com/api/references/vscode-api#ThemeColor).

<a name='F-VscAppz-ThemableDecorationRenderOptions-Before'></a>
### Before `constants`

##### Summary

Defines the rendering options of the attachment that is inserted before the decorated text.

<a name='F-VscAppz-ThemableDecorationRenderOptions-Border'></a>
### Border `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationRenderOptions-BorderColor'></a>
### BorderColor `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.
Better use 'border' for setting one or more of the individual border properties.

<a name='F-VscAppz-ThemableDecorationRenderOptions-BorderRadius'></a>
### BorderRadius `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.
Better use 'border' for setting one or more of the individual border properties.

<a name='F-VscAppz-ThemableDecorationRenderOptions-BorderSpacing'></a>
### BorderSpacing `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.
Better use 'border' for setting one or more of the individual border properties.

<a name='F-VscAppz-ThemableDecorationRenderOptions-BorderStyle'></a>
### BorderStyle `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.
Better use 'border' for setting one or more of the individual border properties.

<a name='F-VscAppz-ThemableDecorationRenderOptions-BorderWidth'></a>
### BorderWidth `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.
Better use 'border' for setting one or more of the individual border properties.

<a name='F-VscAppz-ThemableDecorationRenderOptions-Color'></a>
### Color `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationRenderOptions-Cursor'></a>
### Cursor `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationRenderOptions-FontStyle'></a>
### FontStyle `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationRenderOptions-FontWeight'></a>
### FontWeight `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationRenderOptions-GutterIconPath'></a>
### GutterIconPath `constants`

##### Summary

An **absolute path** or an URI to an image to be rendered in the gutter.

<a name='F-VscAppz-ThemableDecorationRenderOptions-GutterIconSize'></a>
### GutterIconSize `constants`

##### Summary

Specifies the size of the gutter icon.
Available values are 'auto', 'contain', 'cover' and any percentage value.
For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx

<a name='F-VscAppz-ThemableDecorationRenderOptions-LetterSpacing'></a>
### LetterSpacing `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationRenderOptions-Opacity'></a>
### Opacity `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationRenderOptions-Outline'></a>
### Outline `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

<a name='F-VscAppz-ThemableDecorationRenderOptions-OutlineColor'></a>
### OutlineColor `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.
Better use 'outline' for setting one or more of the individual outline properties.

<a name='F-VscAppz-ThemableDecorationRenderOptions-OutlineStyle'></a>
### OutlineStyle `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.
Better use 'outline' for setting one or more of the individual outline properties.

<a name='F-VscAppz-ThemableDecorationRenderOptions-OutlineWidth'></a>
### OutlineWidth `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.
Better use 'outline' for setting one or more of the individual outline properties.

<a name='F-VscAppz-ThemableDecorationRenderOptions-OverviewRulerColor'></a>
### OverviewRulerColor `constants`

##### Summary

The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations.

<a name='F-VscAppz-ThemableDecorationRenderOptions-TextDecoration'></a>
### TextDecoration `constants`

##### Summary

CSS styling property that will be applied to text enclosed by a decoration.

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
 with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `null`.
 Any of its args must be checked for `null`-ness by the `OnError` handler.

 `IVscode self`── the caller that encountered the problem being reported.

 `object err` ── if an `Exception`, it occurred on the C# side (I/O or JSON), else some JSON-decoded C# value from whatever was transmitted as the problem data (if anything) by VS Code.

 `object jsonMsg` ─ if a `string`, the incoming JSON message; if a `Dictionary<string, object>`, the outgoing one.

<a name='F-VscAppz-Vsc-OnErrorDefaultOutputFormat'></a>
### OnErrorDefaultOutputFormat `constants`

##### Summary

Used by the default `OnError` handler to print error details to stderr (aka. `Console.Error`).

<a name='M-VscAppz-Vsc-Main-System-Action{VscAppz-IVscode},System-IO-TextReader,System-IO-TextWriter-'></a>
### Main(main,stdIn,stdOut) `method`

##### Summary

Creates an `IVscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `Console.In` and `stdOut` defaulting to `Console.Out`), then loops forever to never `return`.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| main | [System.Action{VscAppz.IVscode}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{VscAppz.IVscode}') | Called whenever the counterparty demands, which usually means once at startup. |
| stdIn | [System.IO.TextReader](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.TextReader 'System.IO.TextReader') | If `null`, defaults to `Console.In`. |
| stdOut | [System.IO.TextWriter](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.TextWriter 'System.IO.TextWriter') | If `null`, defaults to `Console.Out` |

<a name='T-VscAppz-WindowState'></a>
## WindowState `type`

##### Namespace

VscAppz

##### Summary

Represents the state of a window.

<a name='F-VscAppz-WindowState-Focused'></a>
### Focused `constants`

##### Summary

Whether the current window is focused.

<a name='T-VscAppz-WorkspaceFolder'></a>
## WorkspaceFolder `type`

##### Namespace

VscAppz

##### Summary

A workspace folder is one of potentially many roots opened by the editor. All workspace folders
are equal which means there is no notion of an active or master workspace folder.

<a name='F-VscAppz-WorkspaceFolder-Index'></a>
### Index `constants`

##### Summary

The ordinal number of this workspace folder.

<a name='F-VscAppz-WorkspaceFolder-Name'></a>
### Name `constants`

##### Summary

The name of this workspace folder. Defaults to
the basename of its [uri-path](https://code.visualstudio.com/api/references/vscode-api#Uri.path)

<a name='F-VscAppz-WorkspaceFolder-Uri'></a>
### Uri `constants`

##### Summary

The associated uri for this workspace folder.

*Note:* The [Uri](https://code.visualstudio.com/api/references/vscode-api#Uri)-type was intentionally chosen such that future releases of the editor can support
workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.

<a name='T-VscAppz-WorkspaceFolderPickOptions'></a>
## WorkspaceFolderPickOptions `type`

##### Namespace

VscAppz

##### Summary

Options to configure the behaviour of the [workspace folder](https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder) pick UI.

<a name='F-VscAppz-WorkspaceFolderPickOptions-IgnoreFocusOut'></a>
### IgnoreFocusOut `constants`

##### Summary

Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.

<a name='F-VscAppz-WorkspaceFolderPickOptions-PlaceHolder'></a>
### PlaceHolder `constants`

##### Summary

An optional string to show as place holder in the input box to guide the user what to pick on.

<a name='T-VscAppz-WorkspaceFoldersChangeEvent'></a>
## WorkspaceFoldersChangeEvent `type`

##### Namespace

VscAppz

##### Summary

An event describing a change to the set of [workspace folders](https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFolders).

<a name='F-VscAppz-WorkspaceFoldersChangeEvent-Added'></a>
### Added `constants`

##### Summary

Added workspace folders.

<a name='F-VscAppz-WorkspaceFoldersChangeEvent-Removed'></a>
### Removed `constants`

##### Summary

Removed workspace folders.

<a name='T-VscAppz-WorkspaceProperties'></a>
## WorkspaceProperties `type`

##### Namespace

VscAppz

##### Summary

Namespace for dealing with the current workspace. A workspace is the representation
of the folder that has been opened. There is no workspace when just a file but not a
folder has been opened.

The workspace offers support for [listening](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher) to fs
events and for [finding](https://code.visualstudio.com/api/references/vscode-api#workspace.findFiles) files. Both perform well and run _outside_
the editor-process so that they should be always used instead of nodejs-equivalents.

<a name='F-VscAppz-WorkspaceProperties-Name'></a>
### Name `constants`

##### Summary

The name of the workspace. `undefined` when no folder
has been opened.

<a name='F-VscAppz-WorkspaceProperties-WorkspaceFile'></a>
### WorkspaceFile `constants`

##### Summary

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

<a name='F-VscAppz-WorkspaceProperties-WorkspaceFolders'></a>
### WorkspaceFolders `constants`

##### Summary

List of workspace folders or `undefined` when no folder is open.
*Note* that the first entry corresponds to the value of `rootPath`.
