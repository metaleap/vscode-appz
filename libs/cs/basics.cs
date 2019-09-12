namespace Vscode {
    using System;
    using System.IO;
    using System.Collections.Generic;
    using Newtonsoft.Json;

    public static class Vsc {
        public static Action<Exception> OnError = Console.Error.WriteLine;

        public static IProtocol InOut(TextReader stdIn = null, TextWriter stdOut = null) =>
            new impl(stdIn, stdOut);
    }

    internal partial class msgToVsc {
        internal string Ns;
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
                    if (Vsc.OnError != null)
                        Vsc.OnError(err);
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
                stdOut.WriteLine(msg.ToString());
            }
            if (startloop)
                loopReadln();
        }

    }
}
