namespace VscAppz {
    using System;
    using System.IO;
    using System.Collections.Generic;

    using Any = System.Object;

    /// <summary>Everything related to the running of your app.</summary>
    public static class Vsc {
        public static string OnErrorDefaultOutputFormat = "err:\t{0}\njson:\t{1}\n\n";

        /// <summary>Called on every `catch` during the forever-looping stdin/stdout communication with the `vscode-appz` VSC extension.</summary>
        public static Action<IVscode,Any,Any> OnError = (_, err, jsonMsg) => {
            Console.Error.WriteLine(string.Format(OnErrorDefaultOutputFormat, err, jsonMsg));
        };

        /// <summary>Returns an `IVscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `Console.In` and `stdOut` defaulting to `Console.Out`). Communication only begins its forever loop upon the first method invocation (which consequently never `return`s) on any of the `interface`s offered by the returned `IVscode`'s members.</summary>
        public static IVscode InOut(TextReader stdIn = null, TextWriter stdOut = null) =>
            new impl(stdIn, stdOut);
    }

    internal partial class msgToVsc {
        internal string Ns = "";
        internal string Name;
        internal Dictionary<string, Any> Payload;
        internal string AndThen;

        internal msgToVsc() { }
        internal msgToVsc(string ns, string name, int capPayload, string andThen = "") =>
            (Ns, Name, Payload, AndThen) = (ns, name, new Dictionary<string, Any>(capPayload), andThen);
    }

    internal partial class msgFromVsc {
        internal string AndThen;
        internal Any Payload;
        internal bool Failed;
    }

    internal partial class impl {
        internal readonly TextReader stdIn;
        internal readonly TextWriter stdOut;

        internal bool looping = false;
        internal uint counter = 0;
        internal readonly Dictionary<string, Action<Any>> cbWaiting = new Dictionary<string, Action<Any>>();
        internal readonly Dictionary<string, Func<Any[], (Any, bool)>> cbOther = new Dictionary<string, Func<Any[], (Any, bool)>>();

        internal impl(TextReader stdIn, TextWriter stdOut) =>
            (this.stdIn, this.stdOut) = (stdIn ?? Console.In, stdOut ?? Console.Out);

        internal string nextFuncId() =>
            (++counter).ToString();

        internal void loopReadln() {
            string jsonmsg = "";
            while (true) try {
                jsonmsg = ""; // so that the `catch` at the end won't use prior one
                if (!string.IsNullOrEmpty(jsonmsg = stdIn.ReadLine().Trim())) {
                    var msg = msgFromVsc.parse(jsonmsg);
                    Action<Any> cb = null;
                    Func<Any[], (Any, bool)> fn = null;
                    lock (this)
                        if (cbWaiting.TryGetValue(msg.AndThen, out cb))
                            _ = cbWaiting.Remove(msg.AndThen);
                        else
                            _ = cbOther.TryGetValue(msg.AndThen, out fn);
                    if (cb != null) {
                        if (!msg.Failed)
                            cb(msg.Payload);
                        else if (Vsc.OnError != null)
                            Vsc.OnError(this, msg.Payload, jsonmsg);
                    } else if (fn != null) {
                        var args = msg.Payload as Any[];
                        if (args == null)
                            args = new Any[] { msg.Payload };
                        var (ret, ok) = fn(args);
                        send(new msgToVsc() {
                            AndThen = msg.AndThen,
                            Payload = new Dictionary<string, Any>(2)
                                            { ["ret"] = ret, ["ok"] = ok },
                        }, null);
                    }
                }
            } catch (Exception err) {
                if (Vsc.OnError != null) Vsc.OnError(this, err, jsonmsg);
            }
        }

        internal void send(msgToVsc msg, Action<Any> on) {
            bool startloop;
            Exception err = null;
            lock (this) {
                if (startloop = !looping)
                    looping = true;
                if (on != null)
                    cbWaiting[msg.AndThen = nextFuncId()] = on;
                try { stdOut.WriteLine(msg.ToString()); }
                catch (Exception _) { err = _;}
            }
            if (err != null && Vsc.OnError != null)
                Vsc.OnError(this, err, msg.Payload);
            if (startloop)
                loopReadln();
        }

    }
}
