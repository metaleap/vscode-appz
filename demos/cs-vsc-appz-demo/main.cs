namespace VscAppzDemo {
    using System;
    using System .Timers;
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
                var buttons = new[] {"Show Quick Pick...", "Show Input Box..."};
                win.ShowInformationMessage(
                    greethow + ", " + greetname + "! What to try out?",
                    buttons,
                    button => {
                        statusitem.Dispose();
                        if (string.IsNullOrEmpty(button))
                            quit();
                        else if (button == buttons[0])
                            demoInputPick();
                        else if (button == buttons[1])
                            demoInputText();
                        else
                            win.ShowErrorMessage("Unknown: " + button, nil, quit);
                    }
                );
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
                win.SetStatusBarMessage("Reacting to the 'bye now' will terminate the prog.", 4242);
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
                win.SetStatusBarMessage("Reacting to the 'bye now' will terminate the prog.", 4242);
                if (input == null)
                    win.ShowWarningMessage("Cancelled text input, bye now!", nil, quit);
                else
                    win.ShowInformationMessage("You entered: `"+input+"`, bye now!", nil, quit);
            });
        }

    }

}
