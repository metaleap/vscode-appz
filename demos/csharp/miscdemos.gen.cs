// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-csharp.ts via github.com/metaleap/vscode-appz/src/gen/main.ts
namespace VscAppzDemo {
	using System;
	using System.Collections.Generic;
	using VscAppz;
	using any = System.Object;
	using dict = System.Collections.Generic.Dictionary<string, object>;

	public static partial class App {
		private static void demo_promptToExit() {
			vsc.Window.ShowWarningMessage1(strFmt("Are you sure you want `{0}` to exit?", appName), new[] { "Sure I'm sure" })((string btn) => {
				if ((null != btn)) {
					vsc.Window.ShowInformationMessage1(logLn("So fish and long for all the thanks!"), null);
					quit(null);
				} else {
					vsc.Window.ShowInformationMessage1(logLn("So I'm not a goner yet. I'll stick around then."), null);
				}
			});
		}
		private static void demo_clipboard() {
			vsc.Env.Clipboard().ReadText()((string text) => {
				if ((null == text)) {
					vsc.Window.ShowWarningMessage1(logLn("No text in clipboard"), null);
				} else {
					InputBoxOptions opts = default;
					opts = new InputBoxOptions();
					opts.IgnoreFocusOut = true;
					opts.Value = text;
					logLn(strFmt("input/opts/{0}:\t{1}", "Prompt", "Enter new contents to write to your clipboard."));
					opts.Prompt = "Enter new contents to write to your clipboard.";
					vsc.Window.ShowInputBox(opts, null)((string input) => {
						if ((null == input)) {
							vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null);
						} else {
							logLn(strFmt("input <- {0}", input));
							vsc.Env.Clipboard().WriteText(input)(() => {
								vsc.Window.ShowInformationMessage1(logLn("Okay. Now double-check by pasting somewhere."), null);
							});
						}
					});
				}
			});
		}
		private static void demo_Commands_GetCommands_and_ExecuteCommand() {
			vsc.Commands.GetCommands(false)((string[] items) => {
				QuickPickOptions opts = default;
				opts = new QuickPickOptions();
				opts.IgnoreFocusOut = true;
				opts.PlaceHolder = strFmt("Retrieved {0} command ID(s), pick one to execute or escape now:", items.Length);
				vsc.Window.ShowQuickPick2(items, opts, null)((string item) => {
					if ((null == item)) {
						vsc.Window.ShowWarningMessage1(logLn("Command selection cancelled, spooked?"), null);
					} else {
						InputBoxOptions opts2 = default;
						opts2 = new InputBoxOptions();
						opts2.IgnoreFocusOut = true;
						logLn(strFmt("cmdarg/opts2/{0}:\t{1}", "PlaceHolder", strFmt("Any param for `{0}` command? Else leave blank.", item)));
						opts2.PlaceHolder = strFmt("Any param for `{0}` command? Else leave blank.", item);
						vsc.Window.ShowInputBox(opts2, null)((string cmdarg) => {
							if ((null == cmdarg)) {
								vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null);
							} else {
								logLn(strFmt("cmdarg <- {0}", cmdarg));
								any[] cmdargs = default;
								if ("" != cmdarg) {
									cmdargs = new any[1];
									cmdargs[0] = cmdarg;
								}
								vsc.Commands.ExecuteCommand(item, cmdargs)((any ret) => {
									vsc.Window.ShowInformationMessage1(logLn(strFmt("Command result was: `{0}`, kudos!", ret)), null);
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
			logLn(strFmt("cmdname/opts/{0}:\t{1}", "Prompt", "Enter your command name. The command will accept a single text input and return a result built from it."));
			opts.Prompt = "Enter your command name. The command will accept a single text input and return a result built from it.";
			vsc.Window.ShowInputBox(opts, null)((string cmdname) => {
				if ((null == cmdname)) {
					vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null);
				} else {
					logLn(strFmt("cmdname <- {0}", cmdname));
					vsc.Commands.RegisterCommand(cmdname, (any[] cmdargs) => {
						vsc.Window.SetStatusBarMessage1(logLn(strFmt("Command `{0}` invoked with: `{1}`", cmdname, cmdargs[0])), 4242);
						return strFmt("Input to command `{0}` was: `{1}`", cmdname, cmdargs[0]);
					})((Disposable useToUnregister) => {
						InputBoxOptions opts2 = default;
						opts2 = new InputBoxOptions();
						opts2.IgnoreFocusOut = true;
						logLn(strFmt("cmdarg/opts2/{0}:\t{1}", "Prompt", strFmt("Command `{0}` registered, try it now?", cmdname)));
						opts2.Prompt = strFmt("Command `{0}` registered, try it now?", cmdname);
						opts2.Value = strFmt("Enter input to command `{0}` here", cmdname);
						vsc.Window.ShowInputBox(opts2, null)((string cmdarg) => {
							if ((null == cmdarg)) {
								vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null);
							} else {
								logLn(strFmt("cmdarg <- {0}", cmdarg));
								any[] cmdargs2 = default;
								cmdargs2 = new any[1];
								cmdargs2[0] = cmdarg;
								vsc.Commands.ExecuteCommand(cmdname, cmdargs2)((any ret) => {
									vsc.Window.ShowInformationMessage1(logLn(strFmt("Command result: `{0}`, mad props!", ret)), null);
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
				vsc.Window.ShowQuickPick2(items, opts, null)((string menuitem) => {
					if ((null != menuitem)) {
						logLn(menuitem);
					}
				});
			});
		}
		private static void demo_Env_Properties() {
			vsc.Env.AllProperties()((EnvBag props) => {
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
					opts.PlaceHolder = logLn(strFmt("Env has {0} properties", items.Length)) + ":";
					vsc.Window.ShowQuickPick2(items, opts, null)((string menuitem) => {
						if ((null != menuitem)) {
							logLn(menuitem);
						}
					});
				}
			});
		}
		private static void demo_Workspace_Properties() {
			vsc.Workspace.AllProperties()((WorkspaceBag props) => {
				string[] items = default;
				items = new string[3];
				{
					items[0] = strFmt("Name\t\t\t{0}", props.Name);
					items[1] = strFmt("WorkspaceFile\t\t{0}", props.WorkspaceFile);
					items[2] = strFmt("WorkspaceFolders\t{0}", props.WorkspaceFolders);
					QuickPickOptions opts = default;
					opts = new QuickPickOptions();
					opts.IgnoreFocusOut = true;
					opts.PlaceHolder = logLn(strFmt("Workspace has {0} properties", items.Length)) + ":";
					vsc.Window.ShowQuickPick2(items, opts, null)((string menuitem) => {
						if ((null != menuitem)) {
							logLn(menuitem);
						}
					});
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
			logLn("Showing File-Open dialog...");
			vsc.Window.ShowOpenDialog(opts)((string[] filepaths) => {
				if ((null == filepaths)) {
					vsc.Window.ShowWarningMessage1(logLn("Cancelled File-Open dialog, chicken?"), null);
				} else {
					vsc.Window.ShowInformationMessage1(logLn(strFmt("Selected {0} file path(s), excellent!", filepaths.Length)), null);
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
			logLn("Showing File-Save dialog...");
			vsc.Window.ShowSaveDialog(opts)((string filepath) => {
				if ((null == filepath)) {
					vsc.Window.ShowWarningMessage1(logLn("Cancelled File-Save dialog, chicken?"), null);
				} else {
					vsc.Window.ShowInformationMessage1(logLn(strFmt("Selected file path `{0}`, excellent!", filepath)), null);
				}
			});
		}
		private static void demo_Window_ShowWorkspaceFolderPick() {
			WorkspaceFolderPickOptions opts = default;
			opts = new WorkspaceFolderPickOptions();
			opts.IgnoreFocusOut = true;
			opts.PlaceHolder = "Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side.";
			vsc.Window.ShowWorkspaceFolderPick(opts)((WorkspaceFolder pickedfolder) => {
				if ((null == pickedfolder)) {
					vsc.Window.ShowWarningMessage1(logLn("Cancelled pick input, changed your mind?"), null);
				} else {
					vsc.Window.ShowInformationMessage1(logLn(strFmt("Selected `{0}` located at `{1}`, respect!", pickedfolder.Name, pickedfolder.Uri)), null);
				}
			});
		}
		private static void demo_Env_OpenExternal() {
			InputBoxOptions opts = default;
			opts = new InputBoxOptions();
			opts.IgnoreFocusOut = true;
			opts.Value = "http://github.com/metaleap/vscode-appz";
			logLn(strFmt("uri/opts/{0}:\t{1}", "Prompt", "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol."));
			opts.Prompt = "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol.";
			vsc.Window.ShowInputBox(opts, null)((string uri) => {
				if ((null == uri)) {
					vsc.Window.ShowWarningMessage1(logLn("Cancelled text input, out of ideas?"), null);
				} else {
					logLn(strFmt("uri <- {0}", uri));
					vsc.Env.OpenExternal(uri)((bool ok) => {
						string did = default;
						did = "Did";
						if (!ok) {
							did = did  +  " not";
						}
						vsc.Window.ShowInformationMessage1(logLn(strFmt("{0} succeed in opening `{1}`, chapeau!", did, uri)), null);
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
				vsc.Window.SetStatusBarMessage1(logLn(strFmt("Just selected: {0}", item.Label)), 4242);
				return null;
			};
			vsc.Window.ShowQuickPick3(items, opts, cancelIn(42))((QuickPickItem[] pickeditems) => {
				if ((null == pickeditems)) {
					vsc.Window.ShowWarningMessage1(logLn("Cancelled pick input, not one to tick the boxes?"), null);
				} else {
					vsc.Window.ShowInformationMessage1(logLn(strFmt("You picked {0} item(s), good stuff!", pickeditems.Length)), null);
				}
			});
		}
		private static void demo_Window_CreateQuickPick() {
			vsc.Window.CreateQuickPick()((QuickPick ctl, QuickPickBag cfg) => {
				cfg.IgnoreFocusOut = true;
				cfg.Title = "I'm a full-fledged QuickPick";
				cfg.Step = 23;
				cfg.TotalSteps = 42;
				cfg.Items = new QuickPickItem[88];
				foreach (var i in nums1To(88)) {
					cfg.Items[i] = new QuickPickItem();
					cfg.Items[(i - 1)].Label = strFmt("$(eye) Label {0}", i);
					cfg.Items[(i - 1)].Description = strFmt("$(gift) Description {0}", i);
					cfg.Items[(i - 1)].Detail = strFmt("$(globe~spin) Detail {0}", i);
					cfg.Items[(i - 1)].AlwaysShow = i == 42;
				}
				ctl.Set(cfg);
				ctl.OnDidAccept((QuickPickBag bag) => {
					logLn(strFmt("Picked: {0}", bag.SelectedItems));
					ctl.Hide();
				});
				ctl.OnDidHide((QuickPickBag _) => {
					ctl.Dispose();
				});
				ctl.Show();
			});
		}
		private static void demo_Window_CreateInputBox() {
			vsc.Window.CreateInputBox()((InputBox ctl, InputBoxBag cfg) => {
				cfg.IgnoreFocusOut = true;
				cfg.Placeholder = "The initial Placeholder";
				cfg.Prompt = "The initial Prompt";
				cfg.Title = "The initial Title";
				ctl.Set(cfg);
				ctl.OnDidChangeValue((string input, InputBoxBag bag) => {
					bag.Prompt = strFmt("Lower: {0}", strLo(bag.Value));
					bag.Title = strFmt("Upper: {0}", strUp(bag.Value));
					ctl.Set(bag);
				});
				string finalinputvalue = default;
				ctl.OnDidAccept((InputBoxBag bag) => {
					finalinputvalue = bag.Value;
					ctl.Hide();
				});
				ctl.OnDidHide((InputBoxBag bag) => {
					ctl.Dispose();
					if ((null != finalinputvalue)) {
						vsc.Window.ShowInformationMessage1(logLn(strFmt("You entered: `{0}`, ponderous!", finalinputvalue)), null);
					} else {
						vsc.Window.ShowWarningMessage1(logLn("Backing off or backing up?"), null);
					}
				});
				ctl.Show();
			});
		}
		private static void subscribeToMiscEvents() {
			vsc.Extensions.OnDidChange(() => {
				vsc.Window.SetStatusBarMessage1(logLn("Some extension(s) were just (un)installed or (de)activated."), 4242);
			});
			vsc.Window.OnDidChangeWindowState((WindowState evt) => {
				vsc.Window.SetStatusBarMessage1(logLn(strFmt("Am I focused? {0}.", evt.Focused)), 4242);
			});
			vsc.Languages.OnDidChangeDiagnostics((DiagnosticChangeEvent evt) => {
				vsc.Window.SetStatusBarMessage1(logLn(strFmt("Diag(s) changed for {0} file path(s).", evt.Uris.Length)), 4242);
			});
		}
		private static void demosMenu() {
			string[] items = default;
			items = new[] { "demo_promptToExit", "demo_clipboard", "demo_Commands_GetCommands_and_ExecuteCommand", "demo_Commands_RegisterCommand", "demo_Languages_GetLanguages", "demo_Env_Properties", "demo_Workspace_Properties", "demo_Window_ShowOpenDialog", "demo_Window_ShowSaveDialog", "demo_Window_ShowWorkspaceFolderPick", "demo_Env_OpenExternal", "demo_Window_ShowQuickPick", "demo_Window_CreateQuickPick", "demo_Window_CreateInputBox", "demo_Window_ShowInputBox" };
			QuickPickOptions opts = default;
			opts = new QuickPickOptions();
			opts.IgnoreFocusOut = true;
			opts.PlaceHolder = "This menu can be re-opened any time via our custom status-bar item.";
			vsc.Window.ShowQuickPick2(items, opts, null)((string menuitem) => {
				if ((null != menuitem)) {
					if ("demo_promptToExit" == menuitem) {
						logLn("Picked `demo_promptToExit` from main menu");
						demo_promptToExit();
					}
					if ("demo_clipboard" == menuitem) {
						logLn("Picked `demo_clipboard` from main menu");
						demo_clipboard();
					}
					if ("demo_Commands_GetCommands_and_ExecuteCommand" == menuitem) {
						logLn("Picked `demo_Commands_GetCommands_and_ExecuteCommand` from main menu");
						demo_Commands_GetCommands_and_ExecuteCommand();
					}
					if ("demo_Commands_RegisterCommand" == menuitem) {
						logLn("Picked `demo_Commands_RegisterCommand` from main menu");
						demo_Commands_RegisterCommand();
					}
					if ("demo_Languages_GetLanguages" == menuitem) {
						logLn("Picked `demo_Languages_GetLanguages` from main menu");
						demo_Languages_GetLanguages();
					}
					if ("demo_Env_Properties" == menuitem) {
						logLn("Picked `demo_Env_Properties` from main menu");
						demo_Env_Properties();
					}
					if ("demo_Workspace_Properties" == menuitem) {
						logLn("Picked `demo_Workspace_Properties` from main menu");
						demo_Workspace_Properties();
					}
					if ("demo_Window_ShowOpenDialog" == menuitem) {
						logLn("Picked `demo_Window_ShowOpenDialog` from main menu");
						demo_Window_ShowOpenDialog();
					}
					if ("demo_Window_ShowSaveDialog" == menuitem) {
						logLn("Picked `demo_Window_ShowSaveDialog` from main menu");
						demo_Window_ShowSaveDialog();
					}
					if ("demo_Window_ShowWorkspaceFolderPick" == menuitem) {
						logLn("Picked `demo_Window_ShowWorkspaceFolderPick` from main menu");
						demo_Window_ShowWorkspaceFolderPick();
					}
					if ("demo_Env_OpenExternal" == menuitem) {
						logLn("Picked `demo_Env_OpenExternal` from main menu");
						demo_Env_OpenExternal();
					}
					if ("demo_Window_ShowQuickPick" == menuitem) {
						logLn("Picked `demo_Window_ShowQuickPick` from main menu");
						demo_Window_ShowQuickPick();
					}
					if ("demo_Window_CreateQuickPick" == menuitem) {
						logLn("Picked `demo_Window_CreateQuickPick` from main menu");
						demo_Window_CreateQuickPick();
					}
					if ("demo_Window_CreateInputBox" == menuitem) {
						logLn("Picked `demo_Window_CreateInputBox` from main menu");
						demo_Window_CreateInputBox();
					}
					if ("demo_Window_ShowInputBox" == menuitem) {
						logLn("Picked `demo_Window_ShowInputBox` from main menu");
						demo_Window_ShowInputBox();
					}
				}
			});
		}
		private static void onUpAndRunning() {
			{
				subscribeToMiscEvents();
			}
			OutputChannel logchan = default;
			bool toggleonclick = default;
			{
				vsc.Window.CreateOutputChannel(appName)((OutputChannel it, OutputChannelBag _unused) => {
					logchan = it;
					setOutChan(logchan);
					logLn(strFmt("Hi, I'm `{0}`, this is my own custom `OutputChannel` where I leisurely log all your interactions with me. When I'm ended, it too will disappear.", appName));
					logLn("");
					logLn("NOTE that for logging error messages, you won't need to manually create a custom `OutputChannel` at all: just have your prog print to its `stderr` as (presumably) usual, and `vscode-appz` will then create a dedicated `OutputChannel` for (both that initial and all subsequent) `stderr` prints from your prog while it's up and running.");
					logLn("");
					if (toggleonclick) {
						logLn("Note also that every click on my status-bar item will toggle my visibility.");
						logLn("");
					}
					logchan.Show(true);
				});
			}
			{
				StatusBarItem statusitem = default;
				int clickcount = default;
				clickcount = 0;
				Func<any[], any> mycmd = default;
				mycmd = (any[] _unused) => {
					clickcount = 1 + clickcount;
					statusitem.Get()((StatusBarItemBag props) => {
						props.Text = logLn(strFmt("You clicked me {0} time(s).", clickcount));
						if ("editorLightBulb.foreground" == props.Color) {
							props.Color = "terminal.ansiGreen";
							if (toggleonclick && (null != logchan)) {
								logchan.Hide();
							}
						} else {
							props.Color = "editorLightBulb.foreground";
							if (toggleonclick && (null != logchan)) {
								logchan.Show(true);
							}
						}
						statusitem.Set(props)(demosMenu);
					});
					return null;
				};
				vsc.Commands.RegisterCommand(cmdName, mycmd);
				vsc.Window.CreateStatusBarItem(0, null)((StatusBarItem it, StatusBarItemBag cfg) => {
					statusitem = it;
					cfg.Tooltip = strFmt("Hi from {0}!", appName);
					cfg.Text = "You clicked me 0 time(s).";
					cfg.Color = "#42BEEF";
					cfg.Command = cmdName;
					statusitem.Set(cfg);
					statusitem.Show();
				});
			}
		}
}}
