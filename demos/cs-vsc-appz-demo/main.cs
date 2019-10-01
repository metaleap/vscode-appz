namespace VscAppzDemo {
    using System;
    using VscAppz;

    public static class App {

        public static void Main(string[] args) {
            var (greethow, greetname, nil) = ("Hallo", "Welt", new string[0]);
            if (args != null && args.Length > 0) {
                // why all the Trims? dotnet doesnt seem to fill in explicitly-specified-as-empty-via-quotes args, unlike other runtimes... sheesh
                if (!string.IsNullOrEmpty(args[0].Trim()))
                    greetname = args[0].Trim();
                if (args.Length > 1 && !string.IsNullOrEmpty(args[1].Trim()))
                    greethow = args[1].Trim();
            }

            var win = Vsc.InOut().Window;
            Action<string> exit = (_unused) => Environment.Exit(0);

            var buttons = new[] {"Show Quick Pick...", "Show Input Box..."};
            win.ShowInformationMessage(greethow + ", " + greetname + "! What to try out?",
                buttons, button => {
                    if (string.IsNullOrEmpty(button))
                        exit("");

                    else if (button == buttons[0])
                        win.ShowWarningMessage("Not yet implemented", nil, exit);

                    else if (button == buttons[1]) {
                        var foos = new[] {"foo", "f00", "fo0", "f0o"};
                        win.ShowInputBox(new InputBoxOptions() {
                            IgnoreFocusOut  = true,
                            Value           = "Enter almost anything...",
                            ValueSelection  = (6, 12),
                            Prompt          = "Enter anything containing nothing looking like `foo` (it would be rejected by my real-time ValidateInput func)",
                            ValidateInput   = input => Array.Exists(foos, _ => input.ToLower().Contains(_))
                                                    ? "Contains something looking like `foo`."
                                                    : ""
                        }, null, input => {
                            if (input == null)
                                win.ShowWarningMessage("Cancelled input, bye now!", nil, exit);
                            else
                                win.ShowInformationMessage("You entered: `"+input+"`, bye now!", nil, exit);
                        });
                    }

                    else
                        win.ShowErrorMessage("Unknown: " + button, nil, exit);
                }
            );
        }

    }

}
