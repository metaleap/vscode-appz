namespace VscAppzDemo {
    using System;
    using System.Collections.Generic;
    using VscAppz;

    public static class App {

        private static readonly string[] nil = new string[0];

        private static IVscode vsc;
        private static IWindow win;

        private static void quit(string _unused = default) =>
            Environment.Exit(0);

        public static void Main(string[] args) {
            var (greethow, greetname) = ("Hallo", "Welt");
            if (args != null && args.Length > 0) {
                // why all the Trims? dotnet doesnt seem to fill in explicitly-specified-as-empty-via-quotes args, unlike other runtimes... sheesh
                if (!string.IsNullOrEmpty(args[0].Trim()))
                    greetname = args[0].Trim();
                if (args.Length > 1 && !string.IsNullOrEmpty(args[1].Trim()))
                    greethow = args[1].Trim();
            }

            vsc = Vsc.InOut();
            win = vsc.Window;
            win.SetStatusBarMessage("Choosing a demo WILL HIDE this", statusitem => {
                win.OnDidChangeWindowState(_ => {
                    win.SetStatusBarMessage($"Am I focused? {_.Focused}.", 1234);
                });

                var buttons = new[] {"Demo Pick Input", "Demo Text Input", "All Demos"};
                win.ShowInformationMessage(
                    greethow + ", " + greetname + "! What to try out? (If you cancel, I quit.)",
                    buttons,
                    button => {
                        statusitem.Dispose();
                        if (button == null)
                            quit();
                        else if (button == buttons[0])
                            demo_Window_ShowQuickPick();
                        else if (button == buttons[1])
                            demo_Window_ShowInputBox();
                        else if (button == buttons[2])
                            demoMenuAll();
                        else
                            win.ShowErrorMessage($"Unknown: `{button}`, bye now!", nil, quit);
                    }
                );
            });
        }

        private static void demoMenuAll() {
            var menu = new[] {
                "window.showQuickPick",
                "window.showInputBox",
                "window.showSaveDialog",
                "window.showOpenDialog",
                "window.showWorkspaceFolderPick",
                "env.openExternal",
                "env.Properties",
            };
            win.ShowQuickPick(menu, new QuickPickOptions() {
                CanPickMany = false, IgnoreFocusOut = true
            }, null, (string menuitem) => {
                if (menuitem == null)
                    quit();
                else if (menuitem == menu[0])
                    demo_Window_ShowQuickPick();
                else if (menuitem == menu[1])
                    demo_Window_ShowInputBox();
                else if (menuitem == menu[2])
                    demo_Window_ShowSaveDialog();
                else if (menuitem == menu[3])
                    demo_Window_ShowOpenDialog();
                else if (menuitem == menu[4])
                    demo_Window_ShowWorkspaceFolderPick();
                else if (menuitem == menu[5])
                    demo_Env_OpenExternal();
                else if (menuitem == menu[6])
                    demo_Env_Properties();
                else
                    win.ShowErrorMessage($"Unknown: `{menuitem}`, bye now!", nil, quit);
            });
        }

        private static void demo_Window_ShowQuickPick() {
            win.ShowQuickPick(new[] {
                new QuickPickItem() { Label = "One", Description = "The first", Detail = "Das erste" },
                new QuickPickItem() { Label = "Two", Description = "The second", Detail = "Das zweite" },
                new QuickPickItem() { Label = "Three", Description = "The third", Detail = "Das dritte" },
                new QuickPickItem() { Label = "Four", Description = "The fourth", Detail = "Das vierte" },
            }, new QuickPickOptions() {
                IgnoreFocusOut = true, MatchOnDescription = true, MatchOnDetail = true,
                PlaceHolder = "You have 42 seconds before auto-cancellation!",
                OnDidSelectItem = _ => {
                    Console.Error.WriteLine("hand-(un)picked: " + _.Label);
                    return null;
                },
            }, Cancel.In(TimeSpan.FromSeconds(42)), (QuickPickItem[] pickeditems) => {
                statusNoticeQuit();
                if (pickeditems == null)
                    win.ShowWarningMessage("Cancelled pick input, bye now!", nil, quit);
                else
                    win.ShowInformationMessage($"You picked {pickeditems.Length} item(s), bye now!", nil, quit);
            });
        }

        private static void demo_Window_ShowInputBox() {
            var foos = new[] {"foo", "f00", "fo0", "f0o"};
            Func<string,string> val = textinput =>
                                        Array.Exists(foos, _ => textinput.ToLower().Contains(_))
                                            ? "Contains something looking like `foo`."
                                            : "";
            win.ShowInputBox(new InputBoxOptions() {
                IgnoreFocusOut  = true,
                Value           = "Enter almost anything...",
                ValueSelection  = (6, 12),
                Prompt          = "Enter anything containing nothing looking like `foo` (it would be rejected by my real-time ValidateInput func)",
                ValidateInput   = val
            }, null, input => {
                statusNoticeQuit();
                if (input == null)
                    win.ShowWarningMessage("Cancelled text input, bye now!", nil, quit);
                else
                    win.ShowInformationMessage("You entered: `"+input+"`, bye now!", nil, quit);
            });
        }

        private static void demo_Window_ShowSaveDialog() {
            win.ShowSaveDialog(new SaveDialogOptions() {
                SaveLabel = "Note: won't actually write to specified file path",
                Filters = new Dictionary<string, string[]>() { ["All"] = new[] {"*"}, ["Dummy Filter"] = new[] {"demo", "dummy"} }
            }, filepath => {
                if (filepath == null)
                    win.ShowWarningMessage("Cancelled file-save dialog, bye now!", nil, quit);
                else
                    win.ShowInformationMessage($"File path: `{filepath}`, bye now!", nil, quit);
            });
        }

        private static void demo_Window_ShowOpenDialog() {
            win.ShowOpenDialog(new OpenDialogOptions() {
                CanSelectFiles = true, CanSelectFolders = false, CanSelectMany = true,
                OpenLabel = "Note: won't actually read from specified file path(s)",
                Filters = new Dictionary<string, string[]>() { ["All"] = new[] {"*"}, ["Dummy Filter"] = new[] {"demo", "dummy"} }
            }, filepaths => {
                if (filepaths == null)
                    win.ShowWarningMessage("Cancelled file-open dialog, bye now!", nil, quit);
                else
                    win.ShowInformationMessage($"Selected {filepaths.Length} file path(s), bye now!", nil, quit);
            });
        }

        private static void demo_Window_ShowWorkspaceFolderPick() {
            win.ShowWorkspaceFolderPick(new WorkspaceFolderPickOptions() {
                IgnoreFocusOut = true, PlaceHolder = "Reminder, all local-FS-related 'URIs' sent on the VS Code side turn into standard (non-URI) file-path strings received by the prog side."
            }, pickedfolder => {
                if (pickedfolder == null)
                    win.ShowWarningMessage("Cancelled pick input, bye now!", nil, quit);
                else
                    win.ShowInformationMessage($"Selected `{pickedfolder.Name}` located at `{pickedfolder.Uri}`, bye now!", nil, quit);
            });
        }

        private static void demo_Env_OpenExternal() {
            win.ShowInputBox(new InputBoxOptions() {
                Value = "http://github.com/metaleap/vscode-appz", Prompt = "Enter any URI (of http: or mailto: or any other protocol scheme) to open in the applicable external app registered with your OS to handle that protocol.", IgnoreFocusOut = true,
            }, null, uri => {
                if (string.IsNullOrEmpty(uri))
                    win.ShowWarningMessage("Cancelled, bye now!", nil, quit);
                else
                    vsc.Env.OpenExternal(uri, ok => {
                        win.ShowInformationMessage((ok ? "Did" : "Did not") + $" succeed in opening `{uri}`, bye now!", nil, quit);
                    });
            });
        }

        private static void demo_Env_Properties() {
            vsc.Env.Properties(props => {
                win.ShowQuickPick(new[] {
                    "AppName:\t" + props.AppName,
                    "AppRoot:\t" + props.AppRoot,
                    "Language:\t" + props.Language,
                    "MachineId:\t" + props.MachineId,
                    "RemoteName:\t" + props.RemoteName,
                    "SessionId:\t" + props.SessionId,
                    "Shell:\t\t" + props.Shell,
                    "UriScheme:\t" + props.UriScheme,
                }, new QuickPickOptions() { IgnoreFocusOut = true }, null, quit);
            });
        }

        private static void statusNoticeQuit() {
            win.SetStatusBarMessage("Reacting to the 'bye now' will terminate the prog.", 4242);
        }

    }

}
