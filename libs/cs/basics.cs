namespace Vscode {
    using System;
    using System.IO;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using Newtonsoft.Json;

    internal partial class msgToVsc {
        internal string ns;
        internal string name;
        internal Dictionary<string, object> payload;
        internal string andThen;
    }

    internal partial class msgFromVsc {
        internal string andThen = "";
        internal object payload = null;
        internal bool failed = false;
    }

    public static class Via {
        public static IProtocol InOut(TextReader stdIn = null, TextWriter stdOut = null) {
            return new impl(stdIn, stdOut);
        }
    }

    internal partial class impl {
        internal readonly TextReader stdIn;
        internal readonly TextWriter stdOut;

        internal bool looping = false;
        internal uint counter = 0;
        internal readonly ConcurrentDictionary<string, Action<object>> cbWaiting = new ConcurrentDictionary<string, Action<object>>();
        internal readonly ConcurrentDictionary<string, Func<object[], (object, bool)>> cbOther = new ConcurrentDictionary<string, Func<object[], (object, bool)>>();

        internal impl(TextReader stdIn, TextWriter stdOut) =>
            (this.stdIn, this.stdOut) = (stdIn ?? Console.In, stdOut ?? Console.Out);

        internal string nextFuncId() =>
            (++counter).ToString();

        internal void loopReadln() {
            while (true) {
                var jsonmsg = stdIn.ReadLine().Trim();
                if (!string.IsNullOrEmpty(jsonmsg)) {
                    var msg = msgFromVsc.parse(jsonmsg);
                    Action<object> cb = null;
                    Func<object[], (object, bool)> fn = null;
                    lock (this) {
                        _ = cbWaiting.TryRemove(msg.andThen, out cb);
                        _ = cbOther.TryRemove(msg.andThen, out fn);
                    }
                    if (cb != null && !msg.failed)
                        cb(msg.payload);
                    else if (fn != null) {
                        var args = msg.payload as object[];
                        if (args == null)
                            args = new object[] { msg.payload };
                        var (ret, ok) = fn(args);
                        send(new msgToVsc() {
                            andThen = msg.andThen,
                            payload = new Dictionary<string, object> () {
                                ["ret"] = ret,
                                ["ok"] = ok,
                            },
                        }, null);
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
            stdOut.WriteLine(msg.ToString());
            if (startloop)
                loopReadln();
        }
    }

    internal partial class msgFromVsc {
        internal static msgFromVsc parse(string jsonSrc) {

            var me = new msgFromVsc();
            JsonTextReader reader = new JsonTextReader(new StringReader(jsonSrc));
            if ((!reader.Read()) || (reader.Value != null) || reader.TokenType != JsonToken.StartObject)
                throw err();
            while(reader.Read()) {
                object name = reader.Value;
                if (reader.TokenType == JsonToken.EndObject)
                    break;
                if (reader.TokenType != JsonToken.PropertyName || name == null || !reader.Read())
                    throw err();
                else
                    switch ((string)name) {
                        case "failed":
                            me.failed = (bool)(reader.Value);
                            break;
                        case "andThen":
                            me.andThen = (string)reader.Value;
                            break;
                        case "payload":
                            throw err();
                            break;
                        default:
                            throw err();
                    }
            }
            return me;
            Exception err() => new FormatException(jsonSrc);
        }
    }

    internal partial class msgToVsc {
        public override string ToString() {
            var w = new StringWriter();
            var jw = new JsonTextWriter(w);
            jw.WriteStartObject();
            if (!string.IsNullOrEmpty(ns)) {
                jw.WritePropertyName("ns");
                jw.WriteValue(ns);
            }
            if (!string.IsNullOrEmpty(name)) {
                jw.WritePropertyName("name");
                jw.WriteValue(name);
            }
            if (payload != null) {
                jw.WriteStartObject();
                foreach (var kvp in payload) {
                    jw.WritePropertyName(kvp.Key);
                    jw.WriteValue(kvp.Value);
                }
                jw.WriteEndObject();
            }
            if (!string.IsNullOrEmpty(andThen)) {
                jw.WritePropertyName("andThen");
                jw.WriteValue(andThen);
            }
            jw.WriteEndObject();
            return w.ToString();
        }
    }

}
