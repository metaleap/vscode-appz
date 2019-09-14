namespace VscAppz {
    using System;
    using System.IO;
    using System.Collections.Generic;

    using Any = System.Object;

    internal partial class ipcMsg {
        internal string qName = "";
        internal Dictionary<string, Any> data;
        internal string cbId;

        internal ipcMsg() { }
        internal ipcMsg(string qName, int numData, string contId = "") =>
            (this.qName, data, this.cbId) = (qName, new Dictionary<string, Any>(numData), contId);
    }

    /// <summary>Everything related to the running of your app.</summary>
    public static class Vsc {
        /// <summary>Used by the default `OnError` handler to print error details to stderr (aka. `Console.Error`).</summary>
        public static string OnErrorDefaultOutputFormat = "err:\t{0}\njson:\t{1}\n\n";

        /// <summary>
        /// Reports problems during the ongoing forever-looping stdin/stdout communication
        /// with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `null`.
        ///
        /// `self`── the caller, an `IVscode` instance that encountered the problem being reported.
        ///
        /// `err` ── if an `Exception`, it occurred on the C# side (I/O or JSON), else some JSON-decoded C# value from whatever was transmitted as the problem data (if anything) by VS Code.
        ///
        /// `jsonMsg` ─ if a `string`, the incoming JSON message; if a `Dictionary&lt;string, object&gt;`, the outgoing one.
        /// </summary>
        public static Action<IVscode,Any,Any> OnError = (self, err, jsonMsg) => {
            Console.Error.Write(string.Format(OnErrorDefaultOutputFormat, err, jsonMsg));
        };

        /// <summary>Returns an `IVscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `Console.In` and `stdOut` defaulting to `Console.Out`). Communication only begins its forever loop upon the first method invocation (which consequently never `return`s) on any of the `interface`s offered by the returned `IVscode`'s members.</summary>
        /// <param name="stdIn">If `null`, defaults to `Console.In`.</param>
        /// <param name="stdOut">If `null`, defaults to `Console.Out`</param>
        public static IVscode InOut(TextReader stdIn = null, TextWriter stdOut = null) =>
            new impl(stdIn, stdOut);
    }

    internal partial class impl {
        internal readonly TextReader stdIn;
        internal readonly TextWriter stdOut;

        internal bool looping = false;
        internal uint counter = 0;
        internal readonly Dictionary<string, Func<Any, bool>> cbWaiting = new Dictionary<string, Func<Any, bool>>();
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
                    var msg = ipcMsg.fromJson(jsonmsg);

                    Func<Any, bool> cb = null;
                    Func<Any[], (Any, bool)> fn = null;
                    lock (this)
                        if (cbWaiting.TryGetValue(msg.cbId, out cb))
                            _ = cbWaiting.Remove(msg.cbId);
                        else
                            _ = cbOther.TryGetValue(msg.cbId, out fn);

                    if (cb != null) {
                        if (msg.data.TryGetValue("nay", out var nay))
                            Vsc.OnError(this, nay, jsonmsg);
                        else if (!msg.data.TryGetValue("yay", out var yay))
                            throw new Exception("field `data` must have either `yay` or `nay` member");
                        else if (!cb(yay))
                            throw new Exception("unexpected args: " + yay);

                    } else if (fn != null) {
                        Any fnargs;
                        Any ret = null;
                        var ok = msg.data.TryGetValue("", out fnargs);
                        if (ok = (ok && (fnargs is Any[])))
                            (ret, ok) = fn((Any[])fnargs);
                        send(new ipcMsg("", 1, msg.cbId) { data = {
                            [ok ? "yay" : "nay"] = ok ? ret : ("unexpected args: " + fnargs)
                        } }, null);

                    } else
                        throw new Exception("specified `cbId` not known locally");
                }
            } catch (Exception err) {
                Vsc.OnError(this, err, jsonmsg);
            }
        }

        internal void send(ipcMsg msg, Func<Any, bool> on) {
            bool startloop;
            Exception err = null;
            lock (this) {
                if (startloop = !looping)
                    looping = true;
                if (on != null)
                    cbWaiting[msg.cbId = nextFuncId()] = on;
                try { stdOut.WriteLine(msg.toJson()); }
                catch (Exception _) { err = _;}
            }
            if (err != null ) {
                msg.data[""] = msg.qName;
                Vsc.OnError(this, err, msg.data);
            }
            if (startloop)
                loopReadln();
        }

    }
}
