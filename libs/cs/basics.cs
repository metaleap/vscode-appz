namespace VscAppz {
    using System;
    using System.IO;
    using System.Collections.Generic;

    using Any = System.Object;

    /// <summary>Everything related to the running of your app.</summary>
    public static class Vsc {
        /// <summary>Used by the default `OnError` handler to print error details to stderr (aka. `Console.Error`).</summary>
        public static string OnErrorDefaultOutputFormat = "err:\t{0}\njson:\t{1}\n\n";

        /// <summary>Called on every `catch` during the forever-looping stdin/stdout communication with the `vscode-appz` VSC extension.</summary>
        public static Action<IVscode,Any,Any> OnError = (_, err, jsonMsg) => {
            Console.Error.Write(string.Format(OnErrorDefaultOutputFormat, err, jsonMsg));
        };

        /// <summary>Returns an `IVscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `Console.In` and `stdOut` defaulting to `Console.Out`). Communication only begins its forever loop upon the first method invocation (which consequently never `return`s) on any of the `interface`s offered by the returned `IVscode`'s members.</summary>
        public static IVscode InOut(TextReader stdIn = null, TextWriter stdOut = null) =>
            new impl(stdIn, stdOut);
    }

    internal partial class IpcMsg {
        internal string QName = "";
        internal Dictionary<string, Any> Data;
        internal string ContId;

        internal IpcMsg() { }
        internal IpcMsg(string qName, int numData, string contId = "") =>
            (QName, Data, ContId) = (qName, new Dictionary<string, Any>(numData), contId);
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
                    var msg = IpcMsg.Parse(jsonmsg);

                    Action<Any> cb = null;
                    Func<Any[], (Any, bool)> fn = null;
                    lock (this)
                        if (cbWaiting.TryGetValue(msg.ContId, out cb))
                            _ = cbWaiting.Remove(msg.ContId);
                        else
                            _ = cbOther.TryGetValue(msg.ContId, out fn);

                    if (cb != null) {
                        if (msg.Data.TryGetValue("nay", out var nay))
                            Vsc.OnError(this, nay, jsonmsg);
                        else if (msg.Data.TryGetValue("yay", out var yay))
                            cb(yay);
                        else
                            throw new Exception("field `data` must have either `yay` or `nay` member");

                    } else if (fn != null) {
                        Any fnargs;
                        Any ret = null;
                        var ok = msg.Data.TryGetValue("", out fnargs);
                        if (ok = (ok && (fnargs is Any[])))
                            (ret, ok) = fn((Any[])fnargs);
                        send(new IpcMsg("", 1, msg.ContId) { Data = {
                            [ok ? "yay" : "nay"] = ok ? ret : string.Format("unexpected args: {0}", fnargs)
                        } }, null);
                    } else
                        throw new Exception("specified `cbId` not known locally");
                }
            } catch (Exception err) {
                Vsc.OnError(this, err, jsonmsg);
            }
        }

        internal void send(IpcMsg msg, Action<Any> on) {
            bool startloop;
            Exception err = null;
            lock (this) {
                if (startloop = !looping)
                    looping = true;
                if (on != null)
                    cbWaiting[msg.ContId = nextFuncId()] = on;
                try { stdOut.WriteLine(msg.ToString()); }
                catch (Exception _) { err = _;}
            }
            if (err != null ) {
                msg.Data[""] = msg.QName;
                Vsc.OnError(this, err, msg.Data);
            }
            if (startloop)
                loopReadln();
        }

    }
}
