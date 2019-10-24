namespace VscAppzDemo {
    using System;
    using VscAppz;

    public static partial class App {

        private const string appName = "csharp-vsc-appz-demo";
        private static readonly string cmdName = appName + Environment.TickCount;

        private static IVscode vsc;
        private static IWindow win;
        private static OutputChannel logChan;

        public static void Main(string[] args) {
            Vsc.Main(vscode => {
                (vsc, win) = (vscode, vscode.Window);
                onUpAndRunning();

                win.SetStatusBarMessage2("React to the Welcome msg-box to remove me..")(statusmsg => {

                    var buttons = new[] {"Demo Pick Input", "Demo Text Input", "All Demos"};
                    win.ShowInformationMessage1("What to try out? (If you cancel here, I quit.)", buttons)(
                        btn => {
                            statusmsg.Dispose();
                            if (btn == null)
                                quit();
                            else if (btn == buttons[0])
                                demo_Window_ShowQuickPick();
                            else if (btn == buttons[1])
                                demo_Window_ShowInputBox();
                            else if (btn == buttons[2])
                                demosMenu();
                            else
                                win.ShowErrorMessage1($"Unknown: `{btn}`!")(demosmenu);
                        }
                    );
                });
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
            })(input => {
                if (input == null)
                    win.ShowWarningMessage1("Drat! Was itching to hear that.")(demosmenu);
                else
                    win.ShowInformationMessage1("You entered: `"+input+"`, merci!")(demosmenu);
            });
        }

        private static void demosmenu(string _unused = default) => demosMenu();
        private static void quit(string _unused = default) => Environment.Exit(0);

        private static Cancel cancelIn(double seconds) =>
            Cancel.In(TimeSpan.FromSeconds(seconds));

        private static string logLn(string msgLn) {
            logChan?.AppendLine(string.IsNullOrEmpty(msgLn) ? "" : (DateTime.Now.ToString("HH:mm:ss") + "\t" + msgLn));
            return msgLn;
        }
        private static void setOutChan(OutputChannel outChan) => logChan = outChan;

        private static string strFmt(string s , params object[] args)=>
            string.Format(s,args);
        private static string strLo(string s) => s==null ? "" : s.ToLower();
        private static string strUp(string s) => s==null ? "" : s.ToUpper();
        private static int[] nums1To(int n){
            var ret = new int[n];
            for (int i = 0; i < ret.Length; i++) ret[i] = i+1;
            return ret;
        }

    }

}
