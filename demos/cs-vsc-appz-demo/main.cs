namespace VscAppzDemo {
    using System;
    using VscAppz;

    public static partial class App {

        private static readonly string[] nil = new string[0];

        private static IVscode vsc;
        private static IWindow win;

        public static void Main(string[] args) {
            vsc = Vsc.InOut();
            win = vsc.Window;
            win.SetStatusBarMessage("Choosing a demo WILL HIDE this", statusitem => {
                subscribeToMiscEvents();

                var buttons = new[] {"Demo Pick Input", "Demo Text Input", "All Demos"};
                win.ShowInformationMessage(
                    "What to try out? (If you cancel, I quit.)",
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
                            demosMenu();
                        else
                            win.ShowErrorMessage($"Unknown: `{button}`, bye now!", nil, quit);
                    }
                );
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

        private static void quit(string _unused = default) =>
            Environment.Exit(0);

        private static Cancel cancelIn(double seconds) =>
            Cancel.In(TimeSpan.FromSeconds(seconds));

        private static string strFmt(string s , params object[] args)=>
            string.Format(s,args);

    }

}
