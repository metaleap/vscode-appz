namespace VscAppzDemo
{
    using System;

    public static class App
    {
        public static void Main(string[] args)
        {
            var (greethow, greetname) = ("Hallo", "Welt");
            if (args != null && args.Length > 0)
                if (!string.IsNullOrEmpty(args[0]))
                    greetname = args[0];
            if (args.Length > 1 && !string.IsNullOrEmpty(args[1]))
                greethow = args[1];

            var (vscwin, nil) = (Vscode.Via.InOut().Window, new string[0]);
            vscwin.ShowInformationMessage(greethow + ", " + greetname + "!",
                new[] { "btn1", "btn2" },
                (pick) =>
                {
                    if (pick == "btn1" || pick == "btn2")
                        vscwin.ShowInformationMessage("You picked: " + pick, nil);
                    else
                        vscwin.ShowErrorMessage("Unknown pick: " + pick, nil);
                }
            );
        }
    }
}
