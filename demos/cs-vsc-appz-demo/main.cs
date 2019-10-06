namespace VscAppzDemo {
    using System;
    using System.Collections.Generic;
    using VscAppz;

    public static class App {

        private static readonly string[] nil = new string[0];
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

            win = Vsc.InOut().Window;
            win.SetStatusBarMessage("Choosing a demo WILL HIDE this", statusitem => {
                var buttons = new[] {"Demo Pick Input", "Demo Text Input", "All Demos"};
                win.ShowInformationMessage(
                    greethow + ", " + greetname + "! What to try out? (If you cancel, I quit.)",
                    buttons,
                    button => {
                        statusitem.Dispose();
                        if (button == null)
                            quit();
                        else if (button == buttons[0])
                            demoInputPick();
                        else if (button == buttons[1])
                            demoInputText();
                        else if (button == buttons[2])
                            demoMenuAll();
                        else
                            win.ShowErrorMessage($"Unknown: `{button}`, bye now!", nil, quit);
                    }
                );
            });
        }

        private static void demoMenuAll(){
            var menu = new[] {
                "Demo Pick Input",
                "Demo Text Input",
                "Demo File-Save Dialog",
                "Demo File-Open Dialog",
            };
            win.ShowQuickPick(menu, new QuickPickOptions() {
                CanPickMany = false, IgnoreFocusOut = true
            }, null, (string menuitem) => {
                if (menuitem == null)
                    quit();
                else if (menuitem == menu[0])
                    demoInputPick();
                else if (menuitem == menu[1])
                    demoInputText();
                else if (menuitem == menu[2])
                    demoDialogFileSave();
                else if (menuitem == menu[3])
                    demoDialogFileOpen();
                else
                    win.ShowErrorMessage($"Unknown: `{menuitem}`, bye now!", nil, quit);
            });
        }

        private static void demoInputPick() {
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

        private static void demoInputText() {
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

        private static void demoDialogFileSave() {
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

        private static void demoDialogFileOpen() {
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

        private static void statusNoticeQuit() {
            win.SetStatusBarMessage("Reacting to the 'bye now' will terminate the prog.", 4242);
        }

    }

}
