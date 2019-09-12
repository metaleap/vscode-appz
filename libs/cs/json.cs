namespace Vscode {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Newtonsoft.Json;

    internal static class Json {
        internal static object Load(string jsonSrc) {
            using (StringReader jsonsrc = new StringReader(jsonSrc))
                return load(new JsonTextReader(jsonsrc), jsonSrc, false);
        }

        internal static object load(JsonTextReader r, string origJsonSrcForErr, bool skipFirstRead) {
            if ((!skipFirstRead) && !r.Read())
                throw err();
            if (r.TokenType == JsonToken.Null) return null;
            if (r.TokenType == JsonToken.String) return r.Value.ToString();
            if (r.TokenType == JsonToken.Boolean) return bool.Parse(r.Value.ToString());
            if (r.TokenType == JsonToken.Integer) return int.Parse(r.Value.ToString());
            if (r.TokenType == JsonToken.Float) return double.Parse(r.Value.ToString());
            if (r.TokenType == JsonToken.StartObject) {
                Dictionary<string, object> coll = new Dictionary<string, object>(8);
                while (r.Read() && r.TokenType != JsonToken.EndObject) {
                    var key = r.Value;
                    if (r.TokenType != JsonToken.PropertyName || !r.Read())
                        throw err();
                    coll.Add(key.ToString(), load(r, origJsonSrcForErr, true));
                }
                return coll;
            }
            if (r.TokenType == JsonToken.StartArray) {
                List<object> coll = new List<object>(8);
                while (r.Read() && r.TokenType != JsonToken.EndArray)
                    coll.Add(load(r, origJsonSrcForErr, true));
                return coll;
            }
            throw err();
            Exception err() => new JsonException(origJsonSrcForErr);
        }
    }

    internal partial class msgFromVsc {
        internal static msgFromVsc parse(string jsonSrc) {
            Dictionary<string, object> dict = Json.Load(jsonSrc) as Dictionary<string, object>;
            var me = new msgFromVsc();
            if (dict.TryGetValue("failed", out var f)) me.Failed = (bool)f;
            if (dict.TryGetValue("andThen", out var a)) me.AndThen = (string)a;
            if (dict.TryGetValue("payload", out var p)) me.Payload = p;
            return me;
        }
    }

    internal partial class msgToVsc {
        public override string ToString() {
            using (var w = new StringWriter()) {
                var jw = new JsonTextWriter(w);
                jw.WriteStartObject();
                if (!(string.IsNullOrEmpty(Ns) || string.IsNullOrEmpty(Name))) {
                    jw.WritePropertyName("ns");
                    jw.WriteValue(Ns);
                    jw.WritePropertyName("name");
                    jw.WriteValue(Name);
                }
                if (Payload != null) {
                    jw.WritePropertyName("payload");
                    jw.WriteStartObject();
                    var js = new JsonSerializer();
                    foreach (var kvp in Payload) {
                        jw.WritePropertyName(kvp.Key);
                        js.Serialize(jw, kvp.Value);
                    }
                    jw.WriteEndObject();
                }
                if (!string.IsNullOrEmpty(AndThen)) {
                    jw.WritePropertyName("andThen");
                    jw.WriteValue(AndThen);
                }
                jw.WriteEndObject();
                return w.ToString();
            }
        }
    }

}
