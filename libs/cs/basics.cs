namespace VscAppz {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Timers;
    using Newtonsoft.Json;
    using any = System.Object;
    using dict = System.Collections.Generic.Dictionary<string, object>;

    internal partial class ipcMsg {
        internal string QName;
        internal dict Data;
        internal string CbId;

        internal ipcMsg() { }
        internal ipcMsg(string qName, int numData, string contId = "") =>
            (this.QName, Data, this.CbId) = (qName, new dict(numData), contId);
    }

    /// <summary>Everything related to the running of your app.</summary>
    public static class Vsc {
        /// <summary>Used by the default `OnError` handler to print error details to stderr (aka. `Console.Error`).</summary>
        public static string OnErrorDefaultOutputFormat = "err:\t{0}\njson:\t{1}\n\n";

        /// <summary>
        /// Reports problems during the ongoing forever-looping stdin/stdout communication
        /// with the `vscode-appz` VSC extension. Defaults to a stderr println. Must not be `null`.
        /// Any of its args must be checked for `null`-ness by the `OnError` handler.
        ///
        /// `IVscode self`── the caller that encountered the problem being reported.
        ///
        /// `object err` ── if an `Exception`, it occurred on the C# side (I/O or JSON), else some JSON-decoded C# value from whatever was transmitted as the problem data (if anything) by VS Code.
        ///
        /// `object jsonMsg` ─ if a `string`, the incoming JSON message; if a `Dictionary&lt;string, object&gt;`, the outgoing one.
        /// </summary>
        public static Action<IVscode, any, any> OnError = (_, err, jsonMsg) => {
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
        internal readonly Dictionary<string, Func<any, bool>> cbWaiting = new Dictionary<string, Func<any, bool>>();
        internal readonly Dictionary<string, Func<any[], (any, bool)>> cbOther = new Dictionary<string, Func<any[], (any, bool)>>();

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

                    Func<any, bool> cb = null;
                    Func<any[], (any, bool)> fn = null;
                    lock (this)
                        if (cbWaiting.TryGetValue(msg.CbId, out cb))
                            _ = cbWaiting.Remove(msg.CbId);
                        else
                            _ = cbOther.TryGetValue(msg.CbId, out fn);

                    if (cb != null) {
                        if (msg.Data.TryGetValue("nay", out var nay))
                            Vsc.OnError(this, nay, jsonmsg);
                        else if (!msg.Data.TryGetValue("yay", out var yay))
                            throw new Exception("field `data` must have either `yay` or `nay` member");
                        else if (!cb(yay))
                            throw new Exception("unexpected args: " + yay);

                    } else if (fn != null) {
                        any fnargs;
                        any ret = null;
                        var ok = msg.Data.TryGetValue("", out fnargs);
                        if (ok = (ok && (fnargs is any[])))
                            (ret, ok) = fn((any[])fnargs);
                        send(new ipcMsg("", 1, msg.CbId) { Data = {
                            [ok ? "yay" : "nay"] = ok ? ret : ("unexpected args: " + fnargs)
                        } }, null);

                    } else
                        throw new Exception("specified `cbId` not known locally");
                }
            } catch (Exception err) {
                Vsc.OnError(this, err, jsonmsg);
            }
        }

        internal void send(ipcMsg msg, Func<any, bool> on) {
            bool startloop;
            Exception err = null;
            lock (this) {
                if (startloop = !looping)
                    looping = true;
                if (on != null)
                    cbWaiting[msg.CbId = nextFuncId()] = on;
                try { stdOut.WriteLine(msg.toJson()); }
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

    /// <summary>Allows belated cancellation of ongoing / already-initiated interactions.</summary>
    public class Cancel {
        internal impl impl;
        internal string fnId = "";
        /// <summary>Cancel.Now signals cancellation to the counterparty.</summary>
        public void Now(){
            if (impl == null || string.IsNullOrEmpty(fnId))
                Vsc.OnError(impl, new Exception("vscode-appz/libs/cs#Cancel.Now called before the Cancel was sent to the counterparty."), null);
            else
                impl.send(new ipcMsg(){CbId=fnId},null);
        }
        /// <summary>Cancel.In returns a new `Cancel` with its `Now` already scheduled to be called in `fromNow` duration.</summary>
        public static Cancel In(TimeSpan fromNow) {
            Cancel me = new Cancel();
            Timer timer = new Timer(fromNow.TotalMilliseconds);
            timer.AutoReset = false;
            timer.Elapsed += (evtsender, evtargs) => {
                timer.Stop();
                timer.Close();
                timer.Dispose();
                me.Now();
            };
            timer.Start();
            return me;
        }
    }

    /// <summary>Disposable represents an non-transient object identity lifetimed at the counterparty.</summary>
    public class Disposable {
        internal impl impl;
        internal string id;
        internal Disposable() {}
        internal Disposable bindTo(impl impl) { this.impl = impl; return this; }
        internal bool populateFrom(any payload) =>
            (payload is any[] arr) && (arr != null) && (arr.Length == 2)
                && (arr[0] is string s) && !string.IsNullOrEmpty(id = s);
        /// <summary>Dispose signals to the counterparty to destroy the object.</summary>
        public void Dispose() =>
            impl.send(new ipcMsg("Dispose", 1) { Data = { [""] = id } }, null);
    }

}
