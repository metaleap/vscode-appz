namespace VscAppzDemo
{
    using Vscode;

    public static class App
    {
        public static void Main(string[] args)
        {
            var (greethow, greetname, nil) = ("Hallo", "Welt", new string[0]);
            if (args != null && args.Length > 0) {
                if (!string.IsNullOrEmpty(args[0]))
                    greetname = args[0];
                if (args.Length > 1 && !string.IsNullOrEmpty(args[1]))
                    greethow = args[1];
            }

            var vscwin = Vsc.InOut().Window;
            vscwin.ShowInformationMessage(greethow + ", " + greetname + "! Pick or input?",
                new[] { "showQuickPick", "showInputBox" },
                (pick) =>
                {
                    switch (pick)
                    {
                        case "showQuickPick":
                            vscwin.ShowWarningMessage("Not yet implemented", nil);
                            break;
                        case "showInputBox":
                            vscwin.ShowInputBox(new InputBoxOptions(
                                ignoreFocusOut: true,
                                prompt: "Enter anything that doesn't look like `foo`: my validateInput handler will reject it.",
                                validateInput: input => (input.ToLowerInvariant() != "foo" && input.ToLowerInvariant() != "f00" && input.ToLowerInvariant() != "fo0" && input.ToLowerInvariant() != "f0o")
                                                        ? ""
                                                        : "Invalid input"
                            ), input => vscwin.ShowInformationMessage("Accepted input: " + input, nil));
                            break;
                        default:
                            vscwin.ShowErrorMessage("Unknown: " + pick, nil);
                            break;
                    }
                }
            );
        }
    }
}
