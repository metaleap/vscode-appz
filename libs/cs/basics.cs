namespace Vscode {
    using System;
    using System.IO;
    using System.Collections.Concurrent;
    using System.Collections.Generic;

    internal class msgToVsc {
        internal string ns;
        internal string name;
        internal Dictionary<string, object> payload;
        internal string andThen;
    }

    internal class msgFromVsc {
        internal string andThen;
        internal object payload;
        internal bool failed;
    }

    public static class New {
        public static IProtocol Vsc(this TextReader stdin, TextWriter stdout) {
            return null;
        }
        public static IProtocol Vsc(this TextWriter stdout, TextReader stdin) {
            return null;
        }
    }

    internal partial class impl {
        internal readonly TextReader stdIn;
        internal readonly TextWriter stdOut;

        internal bool looping = false;
        internal uint counter = 0;
        internal readonly ConcurrentDictionary<string, Action<object>> cbWaiting = new ConcurrentDictionary<string, Action<object>>();
        internal readonly ConcurrentDictionary<string, Func<object, (object, bool)>> cbOther = new ConcurrentDictionary<string, Func<object, (object, bool)>>();

        internal impl(TextReader stdin, TextWriter stdout) =>
            (stdIn,stdOut) = (stdin,stdout);

        internal string nextFuncId() {
            lock (this) {
                counter++;
                return counter.ToString();
            }
        }

        internal void loopReadln() {
            while (true) {
                var jsonmsg = stdIn.ReadLine().Trim();
                if (!string.IsNullOrEmpty(jsonmsg)) {
                    msgFromVsc msg = null; // TODO: deserialize
                    Action<object> cb = null;
                    Func<object, (object, bool)> fn = null;
                    lock (this) {
                        cbWaiting.TryRemove(msg.andThen, out cb);
                        cbOther.TryRemove(msg.andThen, out fn);
                    }
                    if (cb != null && !msg.failed)
                        cb(msg.payload);
                    else if (fn != null) {

                    }
                }
            }
        }

        internal void send (msgToVsc msg, Action<object> on) {
            bool startloop;
            lock (this) {
                startloop = !looping;
                if (startloop)
                    looping = true;
                if (on != null) {
                    msg.andThen = nextFuncId();
                    cbWaiting[msg.andThen] = on;
                }
            }
            stdOut.WriteLine("{}");
            if (startloop)
                loopReadln();
        }
    }

}
