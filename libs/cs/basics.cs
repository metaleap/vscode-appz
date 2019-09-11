namespace Vscode
{
    using System;
    using System.IO;
    using System.Collections.Generic;

    internal partial class msgToVsc
    {
        internal string Ns = "";
        internal string Name = "";
        internal Dictionary<string, object> Payload;
        internal string AndThen = "";

        internal msgToVsc() {}
        internal msgToVsc(string ns, string name, int capPayload, string andThen = "") =>
            (Ns, Name, Payload, AndThen) = (ns, name, new Dictionary<string, object>(capPayload), andThen);
    }

    internal partial class msgFromVsc
    {
        internal string AndThen = default;
        internal object Payload = default;
        internal bool Failed = default;
    }

    public static class Via
    {
        public static IProtocol InOut(TextReader stdIn = null, TextWriter stdOut = null)
        {
            return new impl(stdIn, stdOut);
        }
    }

    internal partial class impl
    {
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

        internal void loopReadln()
        {
            while (true)
            {
                var jsonmsg = stdIn.ReadLine().Trim();
                if (!string.IsNullOrEmpty(jsonmsg))
                {
                    var msg = msgFromVsc.parse(jsonmsg);
                    Action<object> cb = null;
                    Func<object[], (object, bool)> fn = null;
                    lock (this)
                        if (cbWaiting.TryGetValue(msg.AndThen, out cb))
                            cbWaiting.Remove(msg.AndThen);
                        else if (cbOther.TryGetValue(msg.AndThen, out fn))
                            cbOther.Remove(msg.AndThen);
                    if (cb != null && !msg.Failed)
                        cb(msg.Payload);
                    else if (fn != null)
                    {
                        var args = msg.Payload as object[];
                        if (args == null)
                            args = new object[] { msg.Payload };
                        var (ret, ok) = fn(args);
                        send(new msgToVsc()
                        {
                            AndThen = msg.AndThen,
                            Payload = new Dictionary<string, object>(2)
                            { ["ret"] = ret, ["ok"] = ok },
                        }, null);
                    }
                }
            }
        }

        internal void send(msgToVsc msg, Action<object> on)
        {
            bool startloop;
            lock (this)
            {
                startloop = !looping;
                if (startloop)
                    looping = true;
                if (on != null)
                    cbWaiting[msg.AndThen = nextFuncId()] = on;
            }
            stdOut.WriteLine(msg.ToString());
            if (startloop)
                loopReadln();
        }

    }
}
