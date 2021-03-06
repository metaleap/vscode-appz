namespace VscAppz {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Timers;
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
        /// Any of its args must be checked for `null`-ness by your `OnError` handler.
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

        /// <summary>Creates an `IVscode` implementation that communicates via the specified input and output streams (with `stdIn` defaulting to `Console.In` and `stdOut` defaulting to `Console.Out`), then loops forever to never `return`.</summary>
        /// <param name="main">Called whenever the counterparty demands, which usually means once at startup.</param>
        /// <param name="stdIn">If `null`, defaults to `Console.In`.</param>
        /// <param name="stdOut">If `null`, defaults to `Console.Out`</param>
        public static void Main(Action<IVscode> main, TextReader stdIn = null, TextWriter stdOut = null) =>
            new impl(stdIn, stdOut, main).loopReadln();
    }

    internal partial class impl {
        internal readonly TextReader stdIn;
        internal readonly TextWriter stdOut;

        internal Action<IVscode> main;
        internal uint counter = 0;
        internal readonly Dictionary<string, Func<any, bool>> cbWaiting = new Dictionary<string, Func<any, bool>>(8);
        internal readonly Dictionary<string,Func<any[],bool>>cbListeners = new Dictionary<string, Func<any[], bool>>(8);
        internal readonly Dictionary<string, Func<any[], (any, bool)>> cbOther = new Dictionary<string, Func<any[], (any, bool)>>(8);

        internal impl(TextReader stdIn, TextWriter stdOut, Action<IVscode> main) =>
            (this.stdIn, this.stdOut, this.main) = (stdIn ?? Console.In, stdOut ?? Console.Out, main);

        internal impl Impl() => this;

        internal string nextFuncId() =>
            (++counter).ToString();

        internal string nextSub(Func<any[], bool> eitherListener, Func<any[], (any, bool)> orOther) {
            lock (this) {
                var fnid = nextFuncId();
                if (eitherListener != null)
                    cbListeners[fnid] = eitherListener;
                else if (orOther != null)
                    cbOther[fnid] = orOther;
                return fnid;
            }
        }

        internal void loopReadln() {
            string jsonmsg = "";
            while (true) try {
                jsonmsg = ""; // so that the `catch` at the end won't use prior one
                if (!string.IsNullOrEmpty(jsonmsg = stdIn.ReadLine().Trim())) {
                    var msg = ipcMsg.fromJson(jsonmsg);

                    Func<any, bool> cbprom = null;
                    Func <any[], bool> cbevt = null;
                    Func<any[], (any, bool)> cbmisc = null;
                    if (!string.IsNullOrEmpty(msg.CbId))
                        lock (this)
                            if (cbWaiting.TryGetValue(msg.CbId, out cbprom))
                                _ = cbWaiting.Remove(msg.CbId);
                            else if (!cbOther.TryGetValue(msg.CbId, out cbmisc))
                                _ = cbListeners.TryGetValue(msg.CbId, out cbevt);

                    if (cbprom != null) {
                        if (msg.Data.TryGetValue("nay", out var nay))
                            OnError(this, nay, jsonmsg);
                        else if (!msg.Data.TryGetValue("yay", out var yay))
                            throw new Exception("field `data` must have either `yay` or `nay` member");
                        else if (!cbprom(yay))
                            throw new Exception("unexpected args: " + yay);

                    } else if (cbevt != null) {
                        any fnargs;
                        var ok = msg.Data.TryGetValue("[]", out fnargs);
                        if (ok && (fnargs is any[] args))
                            ok = cbevt(args);
                        if (!ok)
                            OnError(this, new Exception("unexpected args: " + fnargs), jsonmsg);

                    } else if (cbmisc != null) {
                        any fnargs;
                        any ret = null;
                        var ok = msg.Data.TryGetValue("[]", out fnargs);
                        if (ok && (fnargs is any[] args))
                            (ret, ok) = cbmisc(args);
                        send(new ipcMsg("", 1, msg.CbId) { Data = {
                            [ok ? "yay" : "nay"] = ok ? ret : ("unexpected args: " + fnargs)
                        } }, null);

                    } else if (msg.QName == "main")
                        main(this);

                    else
                        throw new Exception("specified `cbId` not known locally");
                }
            } catch (Exception err) {
                OnError(this, err, jsonmsg);
            }
        }

        internal void send(ipcMsg msg, Func<any, bool> on) {
            Exception err = null;
            lock (this) {
                if (on != null)
                    cbWaiting[msg.CbId = nextFuncId()] = on;
                try { stdOut.WriteLine(msg.toJson()); }
                catch (Exception _) { err = _;}
            }
            if (err != null ) {
                msg.Data["#"] = msg.QName;
                OnError(this, err, msg.Data);
            }
        }

        internal Action<IVscode, any, any> OnError {get=>Vsc.OnError;}
    }

    /// <summary>Allows belated cancellation of ongoing / already-initiated interactions.</summary>
    public class Cancel {
        internal impl impl;
        internal string fnId = "";
        /// <summary>Cancel.Now signals cancellation to the counterparty.</summary>
        public void Now(){
            if (impl == null || string.IsNullOrEmpty(fnId))
                Vsc.OnError(impl, new Exception("vscode-appz/libs/cs#Cancel.Now called before the Cancel was announced to the counterparty."), null);
            else
                impl.send(new ipcMsg(){CbId=fnId},null);
        }
        /// <summary>Cancel.In returns a new `Cancel` with its `Now` already scheduled to be called in `fromNow` duration.</summary>
        /// <param name="fromNow"></param>
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
    public class Disposable : IDisposable {
        internal impl impl;
        internal string id;
        internal readonly List<string> subFnIds = new List<string>(4);
        internal Disposable() {}
        internal void addSub(string fnId) =>
            subFnIds.Add(fnId);
        internal Disposable bind(impl impl, params string[] subFnIds) {
            this.impl = impl;
            this.subFnIds.AddRange(subFnIds);
            return this;
        }
        internal bool __loadFromJsonish__(any payload) =>
            (payload is string s) && !string.IsNullOrEmpty(id = s);
        void IDisposable.Dispose(){}
        /// <summary>Dispose requests the VSC side to forget about this object and release or destroy all resources associated with or occupied by it. All subsequent usage attempts will be rejected.</summary>
        public Action<Action> Dispose() {
            Action ondone = null;
            impl.send(new ipcMsg("dispose", 1) { Data = { [""] = id } }, _ => {
                if (ondone != null)
                    ondone();
                return true;
            });
            if (subFnIds.Count > 0) {
                lock (this)
                    foreach (var subfnid in subFnIds) {
                        impl.cbListeners.Remove(subfnid);
                        impl.cbOther.Remove(subfnid);
                    }
                subFnIds.Clear();
            }
            return on => ondone = on;
        }
    }

}
