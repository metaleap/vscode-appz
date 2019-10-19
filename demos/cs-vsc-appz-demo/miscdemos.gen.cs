// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-csharp.ts via github.com/metaleap/vscode-appz/src/gen/main.ts
namespace VscAppzDemo {
	using System;
	using System.Collections.Generic;
	using VscAppz;
	using any = System.Object;
	using dict = System.Collections.Generic.Dictionary<string, object>;

	public static partial class App {
		private static void demo_Commands_GetCommands_and_ExecuteCommand() {
			vsc.Commands.GetCommands(false)((string[] items) => {
				QuickPickOptions opts = default;
				opts = new QuickPickOptions();
				opts.IgnoreFocusOut = true;
				opts.PlaceHolder = strFmt("Retrieved {0} command ID(s), pick one to execute or escape now:", items.Length);
				vsc.Window.ShowQuickPick2(items, opts, null)((string item) => {
					if ((null == item)) {
						vsc.Window.ShowWarningMessage1("Command selection cancelled, bye now!", null)(quit);
					} else {
						InputBoxOptions opts2 = default;
						opts2 = new InputBoxOptions();
						opts2.IgnoreFocusOut = true;
						opts2.PlaceHolder = strFmt("Any param for `{0}` command? Else leave blank.", item);
						vsc.Window.ShowInputBox(opts2, null)((string cmdarg) => {
							if ((null == cmdarg)) {
								vsc.Window.ShowWarningMessage1("You cancelled, bye now!", null)(quit);
							} else {
								any[] cmdargs = default;
								if ("" != cmdarg) {
									cmdargs = new any[1];
									cmdargs[0] = cmdarg;
								}
								vsc.Commands.ExecuteCommand(item, cmdargs)((any ret) => {
									vsc.Window.ShowInformationMessage1(strFmt("Command result was: {0}", ret), null)(quit);
								});
							}
						});
					}
				});
			});
		}
		private static void demo_Commands_RegisterCommand() {
			InputBoxOptions opts = default;
			opts = new InputBoxOptions();
			opts.IgnoreFocusOut = true;
			opts.Value = "foo.bar.baz";
			opts.Prompt = "Enter your command name. The command will accept a single text input and return a result built from it.";
			vsc.Window.ShowInputBox(opts, null)((string cmdname) => {
				if ((null == cmdname)) {
					vsc.Window.ShowWarningMessage1("You cancelled, bye now!", null)(quit);
				} else {
					vsc.Commands.RegisterCommand(cmdname, (any[] cmdargs) => {
						vsc.Window.SetStatusBarMessage1(strFmt("Command `{0}` invoked with: `{1}`", cmdname, cmdargs[0]), 4242);
						return strFmt("Input to command `{0}` was: `{1}`", cmdname, cmdargs[0]);
					})((Disposable useToUnregister) => {
						InputBoxOptions opts2 = default;
						opts2 = new InputBoxOptions();
						opts2.IgnoreFocusOut = true;
						opts2.Prompt = strFmt("Command `{0}` registered, try it now?", cmdname);
						opts2.Value = strFmt("Enter input to command `{0}` here", cmdname);
						vsc.Window.ShowInputBox(opts2, null)((string cmdarg) => {
							if ((null == cmdarg)) {
								vsc.Window.ShowWarningMessage1("You cancelled, bye now!", null)(quit);
							} else {
								any[] cmdargs2 = default;
								cmdargs2 = new any[1];
								cmdargs2[0] = cmdarg;
								vsc.Commands.ExecuteCommand(cmdname, cmdargs2)((any ret) => {
									vsc.Window.ShowInformationMessage1(strFmt("Command result: {0}", ret), null)(quit);
								});
							}
						});
					});
				}
			});
		}
		private static void demo_Languages_GetLanguages() {
			vsc.Languages.GetLanguages()((string[] items) => {
				QuickPickOptions opts = default;
				opts = new QuickPickOptions();
				opts.IgnoreFocusOut = true;
				opts.PlaceHolder = strFmt("Retrieved {0} language ID(s)", items.Length);
				vsc.Window.ShowQuickPick2(items, opts, null)(quit);
			});
		}
		private static void demo_Env_Properties() {
			vsc.Env.Properties()((EnvProperties props) => {
				string[] items = default;
				items = new string[8];
				{
					items[0] = strFmt("AppName\t\t\t{0}", props.AppName);
					items[1] = strFmt("AppRoot\t\t\t{0}", props.AppRoot);
					items[2] = strFmt("Language\t\t{0}", props.Language);
					items[3] = strFmt("MachineId\t\t{0}", props.MachineId);
					items[4] = strFmt("RemoteName\t\t{0}", props.RemoteName);
					items[5] = strFmt("SessionId\t\t{0}", props.SessionId);
					items[6] = strFmt("Shell\t\t\t{0}", props.Shell);
					items[7] = strFmt("UriScheme\t\t{0}", props.UriScheme);
					QuickPickOptions opts = default;
					opts = new QuickPickOptions();
					opts.IgnoreFocusOut = true;
					opts.PlaceHolder = strFmt("Env has {0} properties:", items.Length);
					vsc.Window.ShowQuickPick2(items, opts, null)(quit);
				}
			});
		}
		private static void demo_Workspace_Properties() {
			vsc.Workspace.Properties()((WorkspaceProperties props) => {
				string[] items = default;
				items = new string[3];
				{
					items[0] = strFmt("Name\t\t\t{0}", props.Name);
					items[1] = strFmt("WorkspaceFile\t\t{0}", props.WorkspaceFile);
					items[2] = strFmt("WorkspaceFolders\t{0}", props.WorkspaceFolders);
					QuickPickOptions opts = default;
					opts = new QuickPickOptions();
					opts.IgnoreFocusOut = true;
					opts.PlaceHolder = strFmt("Workspace has {0} properties:", items.Length);
					vsc.Window.ShowQuickPick2(items, opts, null)(quit);
				}
			});
		}
		private static void demo_Window_ShowOpenDialog() {
			OpenDialogOptions opts = default;
			opts = new OpenDialogOptions();
			opts.OpenLabel = "Note: won't actually read from specified file path(s)";
			opts.Filters = new Dictionary<string, string[]>(2);
			opts.Filters["All"] = new[] { "*" };
			opts.Filters["Dummy Filter"] = new[] { "dummy", "demo" };
			{
				opts.CanSelectFiles = true;
				opts.CanSelectFolders = false;
				opts.CanSelectMany = true;
			}
			vsc.Window.ShowOpenDialog(opts)((string[] filepaths) => {
				statusNoticeQuit();
				if ((null == filepaths)) {
					vsc.Window.ShowWarningMessage1("Cancelled File-Open dialog, bye now!", null)(quit);
				} else {
					vsc.Window.ShowInformationMessage1(strFmt("Selected {0} file path(s), bye now!", filepaths.Length), null)(quit);
				}
			});
		}
		private static void demo_Window_ShowSaveDialog() {
			SaveDialogOptions opts = default;
			opts = new SaveDialogOptions();
			opts.SaveLabel = "Note: won't actually write to specified file path";
			opts.Filters = new Dictionary<string, string[]>(2);
			opts.Filters["All"] = new[] { "*" };
			opts.Filters["Dummy Filter"] = new[] { "dummy", "demo" };
			vsc.Window.ShowSaveDialog(opts)((string filepath) => {
				statusNoticeQuit();
				if ((null == filepath)) {
					vsc.Window.ShowWarningMessage1("Cancelled File-Save dialog, bye now!", null)(quit);
				} else {
					vsc.Window.ShowInformationMessage1(strFmt("Selected file path `{0}`, bye now!", filepath), null)(quit);
				}
			});
		}
		private static void demo_Window_ShowWorkspaceFolderPick() {
			WorkspaceFolderPickOptions opts = default;
			opts = new WorkspaceFolderPickOptions();
			opts.IgnoreFocusOut = true;
			opts.PlaceHolder = "Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side.";
			vsc.Window.ShowWorkspaceFolderPick(opts)((WorkspaceFolder pickedfolder) => {
				statusNoticeQuit();
				if ((null == pickedfolder)) {
					vsc.Window.ShowWarningMessage1("Cancelled pick input, bye now!", null)(quit);
				} else {
					vsc.Window.ShowInformationMessage1(strFmt("Selected `{0}` located at `{1}`, bye now!", pickedfolder.Name, pickedfolder.Uri), null)(quit);
				}
			});
		}
		private static void demo_Env_OpenExternal() {
			InputBoxOptions opts = default;
			opts = new InputBoxOptions();
			opts.IgnoreFocusOut = true;
			opts.Value = "http://foo.bar/baz";
			opts.Prompt = "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol.";
			vsc.Window.ShowInputBox(opts, null)((string uri) => {
				if ((null == uri)) {
					vsc.Window.ShowWarningMessage1("You cancelled, bye now!", null)(quit);
				} else {
					vsc.Env.OpenExternal(uri)((bool ok) => {
						string did = default;
						did = "Did";
						if (!ok) {
							did = did  +  " not";
						}
						vsc.Window.ShowInformationMessage1(strFmt("{0} succeed in opening `{1}`, bye now!", did, uri), null)(quit);
					});
				}
			});
		}
		private static void demo_Window_ShowQuickPick() {
			QuickPickItem[] items = default;
			items = new QuickPickItem[4];
			items[0] = new QuickPickItem();
			items[0].Label = "One";
			items[0].Description = "The first";
			items[0].Detail = "Das erste";
			items[1] = new QuickPickItem();
			items[1].Label = "Two";
			items[1].Description = "The second";
			items[1].Detail = "Das zweite";
			items[2] = new QuickPickItem();
			items[2].Label = "Three";
			items[2].Description = "The third";
			items[2].Detail = "Das dritte";
			items[3] = new QuickPickItem();
			items[3].Label = "Four";
			items[3].Description = "The fourth";
			items[3].Detail = "Das vierte";
			QuickPickOptions opts = default;
			opts = new QuickPickOptions();
			opts.IgnoreFocusOut = true;
			opts.MatchOnDescription = true;
			opts.MatchOnDetail = true;
			opts.PlaceHolder = "You have 42 seconds before auto-cancellation!";
			opts.OnDidSelectItem = (QuickPickItem item) => {
				vsc.Window.SetStatusBarMessage1(strFmt("Just selected: {0}", item.Label), 4242);
				return null;
			};
			vsc.Window.ShowQuickPick3(items, opts, cancelIn(42))((QuickPickItem[] pickeditems) => {
				statusNoticeQuit();
				if ((null == pickeditems)) {
					vsc.Window.ShowWarningMessage1("Cancelled pick input, bye now!", null)(quit);
				} else {
					vsc.Window.ShowInformationMessage1(strFmt("You picked {0} item(s), bye now!", pickeditems.Length), null)(quit);
				}
			});
		}
		private static void subscribeToMiscEvents() {
			vsc.Extensions.OnDidChange(() => {
				vsc.Window.SetStatusBarMessage1("Some extension(s) were just (un)installed or (de)activated.", 4242);
			});
			vsc.Window.OnDidChangeWindowState((WindowState evt) => {
				vsc.Window.SetStatusBarMessage1(strFmt("Am I focused? {0}.", evt.Focused), 4242);
			});
			vsc.Languages.OnDidChangeDiagnostics((DiagnosticChangeEvent evt) => {
				vsc.Window.SetStatusBarMessage1(strFmt("Diag(s) changed for {0} file path(s).", evt.Uris.Length), 4242);
			});
		}
		private static void statusNoticeQuit() {
			vsc.Window.SetStatusBarMessage1("Reacting to the 'bye now' WILL end the prog.", 4242);
		}
		private static void demosMenu() {
			string[] items = default;
			items = new[] { "demo_Window_ShowInputBox", "demo_Commands_GetCommands_and_ExecuteCommand", "demo_Commands_RegisterCommand", "demo_Languages_GetLanguages", "demo_Env_Properties", "demo_Workspace_Properties", "demo_Window_ShowOpenDialog", "demo_Window_ShowSaveDialog", "demo_Window_ShowWorkspaceFolderPick", "demo_Env_OpenExternal", "demo_Window_ShowQuickPick" };
			QuickPickOptions opts = default;
			opts = new QuickPickOptions();
			opts.IgnoreFocusOut = true;
			opts.PlaceHolder = "Dismissing this menu WILL end the prog.";
			vsc.Window.ShowQuickPick2(items, opts, null)((string menuitem) => {
				if ((null == menuitem)) {
					quit(null);
				} else {
					if ("demo_Window_ShowInputBox" == menuitem) {
						demo_Window_ShowInputBox();
					}
					if ("demo_Commands_GetCommands_and_ExecuteCommand" == menuitem) {
						demo_Commands_GetCommands_and_ExecuteCommand();
					}
					if ("demo_Commands_RegisterCommand" == menuitem) {
						demo_Commands_RegisterCommand();
					}
					if ("demo_Languages_GetLanguages" == menuitem) {
						demo_Languages_GetLanguages();
					}
					if ("demo_Env_Properties" == menuitem) {
						demo_Env_Properties();
					}
					if ("demo_Workspace_Properties" == menuitem) {
						demo_Workspace_Properties();
					}
					if ("demo_Window_ShowOpenDialog" == menuitem) {
						demo_Window_ShowOpenDialog();
					}
					if ("demo_Window_ShowSaveDialog" == menuitem) {
						demo_Window_ShowSaveDialog();
					}
					if ("demo_Window_ShowWorkspaceFolderPick" == menuitem) {
						demo_Window_ShowWorkspaceFolderPick();
					}
					if ("demo_Env_OpenExternal" == menuitem) {
						demo_Env_OpenExternal();
					}
					if ("demo_Window_ShowQuickPick" == menuitem) {
						demo_Window_ShowQuickPick();
					}
				}
			});
		}
}}
