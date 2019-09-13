namespace VscAppz {
    using System;
    using System.IO;
    using System.Collections.Generic;

    /// <summary>Everything related to the running of your app.</summary>
    public static class Vsc {
        /// <summary>Called on every `catch` during the forever-looping stdin/stdout communication with the `vscode-appz` VSC extension.</summary>
        public static Action<Exception> OnError = Console.Error.WriteLine;

        /// <summary>Returns an `IVscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `Console.In` and `stdOut` defaulting to `Console.Out`). Communication only begins its forever loop upon the first method invocation (which consequently never `return`s) on any of the `interface`s offered by the returned `IVscode`'s properties.</summary>
        public static IVscode InOut(TextReader stdIn = null, TextWriter stdOut = null) =>
            new impl(stdIn, stdOut);
    }

    internal partial class msgToVsc {
        internal string Ns = "";
        internal string Name;
        internal Dictionary<string, object> Payload;
        internal string AndThen;

        internal msgToVsc() { }
        internal msgToVsc(string ns, string name, int capPayload, string andThen = "") =>
            (Ns, Name, Payload, AndThen) = (ns, name, new Dictionary<string, object>(capPayload), andThen);
    }

    internal partial class msgFromVsc {
        internal string AndThen;
        internal object Payload;
        internal bool Failed;
    }

    internal partial class impl {
        internal readonly TextReader stdIn;
        internal readonly TextWriter stdOut;

        internal bool looping = false;
        internal uint counter = 0;
        internal readonly Dictionary<string, Action<object>> cbWaiting = new Dictionary<string, Action<object>>();
        internal readonly Dictionary<string, Func<object[], (object, bool)>> cbOther = new Dictionary<string, Func<object[], (object, bool)>>();

        internal impl(TextReader stdIn, TextWriter stdOut) =>
            (this.stdIn, this.stdOut) = (stdIn ?? Console.In, stdOut ?? Console.Out);

        internal string nextFuncId() =>
            (++counter).ToString();

        internal void loopReadln() {
            while (true) {
                var jsonmsg = stdIn.ReadLine().Trim();
                if (!string.IsNullOrEmpty(jsonmsg)) try {
                    var msg = msgFromVsc.parse(jsonmsg);
                    Action<object> cb = null;
                    Func<object[], (object, bool)> fn = null;
                    lock (this)
                        if (cbWaiting.TryGetValue(msg.AndThen, out cb))
                            cbWaiting.Remove(msg.AndThen);
                        else
                            _ = cbOther.TryGetValue(msg.AndThen, out fn);
                    if (cb != null && !msg.Failed)
                        cb(msg.Payload);
                    else if (fn != null) {
                        var args = msg.Payload as object[];
                        if (args == null)
                            args = new object[] { msg.Payload };
                        var (ret, ok) = fn(args);
                        send(new msgToVsc() {
                            AndThen = msg.AndThen,
                            Payload = new Dictionary<string, object>(2)
                                            { ["ret"] = ret, ["ok"] = ok },
                        }, null);
                    }
                } catch (Exception err) {
                    if (Vsc.OnError != null) Vsc.OnError(err);
                }
            }
        }

        internal void send(msgToVsc msg, Action<object> on) {
            bool startloop;
            lock (this) {
                if (startloop = !looping)
                    looping = true;
                if (on != null)
                    cbWaiting[msg.AndThen = nextFuncId()] = on;
                try { stdOut.WriteLine(msg.ToString()); } catch (Exception err) {
                    if (Vsc.OnError != null) Vsc.OnError(err);
                }
            }
            if (startloop)
                loopReadln();
        }

    }
}
