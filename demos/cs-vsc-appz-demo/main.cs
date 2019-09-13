namespace VscAppzDemo {
    using System;
    using VscAppz;

    public static class App {

        public static void Main(string[] args) {
            var (greethow, greetname, nil) = ("Hallo", "Welt", new string[0]);
            if (args != null && args.Length > 0) {
                if (!string.IsNullOrEmpty(args[0]))
                    greetname = args[0];
                if (args.Length > 1 && !string.IsNullOrEmpty(args[1]))
                    greethow = args[1];
            }

            var win = Vsc.InOut().Window;
            Action<string> exit = (_unused) => Environment.Exit(0);

            var buttons = new[] {"Show Quick Pick...", "Show Input Box..."};
            win.ShowInformationMessage(greethow + ", " + greetname + "! What to try out?",
                buttons, button => {
                    if (button == "")
                        exit("");

                    else if (button == buttons[0])
                        win.ShowWarningMessage("Not yet implemented", nil, exit);

                    else if (button == buttons[1])
                        win.ShowInputBox(new InputBoxOptions(
                            ignoreFocusOut: true,
                            prompt:         "Enter anything containing nothing looking like `foo` (it would be rejected by my real-time ValidateInput func)",
                            validateInput:  input =>
                                                ((input = input.ToLowerInvariant()) != "foo" && input != "f00" && input != "fo0" && input != "f0o")
                                                ? "" : "Invalid input"
                        ), input => {
                            if (string.IsNullOrEmpty(input))
                                win.ShowWarningMessage("Cancelled input, bye now!", nil, exit);
                            else
                                win.ShowInformationMessage("You entered: `"+input+"`, bye now!", nil, exit);
                        });

                    else
                        win.ShowErrorMessage("Unknown: " + button, nil, exit);
                }
            );
        }

    }

}
