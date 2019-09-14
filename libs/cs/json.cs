namespace VscAppz {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Newtonsoft.Json;

    using Any = System.Object;

    internal static class Json {
        internal static Any Load(string jsonSrc) {
            using (StringReader jsonsrc = new StringReader(jsonSrc))
                return load(new JsonTextReader(jsonsrc), jsonSrc, false);
        }

        internal static Any load(JsonTextReader r, string origJsonSrcForErr, bool skipFirstRead) {
            if ((!skipFirstRead) && !r.Read())
                throw err();
            if (r.TokenType == JsonToken.Null) return null;
            if (r.TokenType == JsonToken.String) return r.Value.ToString();
            if (r.TokenType == JsonToken.Boolean) return bool.Parse(r.Value.ToString());
            if (r.TokenType == JsonToken.Integer) return int.Parse(r.Value.ToString());
            if (r.TokenType == JsonToken.Float) return double.Parse(r.Value.ToString());
            if (r.TokenType == JsonToken.StartObject) {
                Dictionary<string, Any> coll = new Dictionary<string, Any>(8);
                while (r.Read() && r.TokenType != JsonToken.EndObject) {
                    var key = r.Value;
                    if (r.TokenType != JsonToken.PropertyName || !r.Read())
                        throw err();
                    coll.Add(key.ToString(), load(r, origJsonSrcForErr, true));
                }
                return coll;
            }
            if (r.TokenType == JsonToken.StartArray) {
                List<Any> coll = new List<Any>(8);
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
            Dictionary<string, Any> dict = Json.Load(jsonSrc) as Dictionary<string, Any>;
            var me = new msgFromVsc();
            if (dict.TryGetValue("failed", out var f)) me.Failed = (bool)f;
            if (dict.TryGetValue("cbId", out var a)) me.ContId = (string)a;
            if (dict.TryGetValue("payload", out var p)) me.Payload = p;
            return me;
        }
    }

    internal partial class msgToVsc {
        public override string ToString() {
            using (var w = new StringWriter()) {
                var jw = new JsonTextWriter(w);
                jw.WriteStartObject();
                if (!string.IsNullOrEmpty(QName)) {
                    jw.WritePropertyName("qName");
                    jw.WriteValue(QName);
                }
                if (Data != null) {
                    jw.WritePropertyName("data");
                    jw.WriteStartObject();
                    var js = new JsonSerializer();
                    foreach (var kvp in Data) {
                        jw.WritePropertyName(kvp.Key);
                        js.Serialize(jw, kvp.Value);
                    }
                    jw.WriteEndObject();
                }
                if (!string.IsNullOrEmpty(ContId)) {
                    jw.WritePropertyName("cbId");
                    jw.WriteValue(ContId);
                }
                jw.WriteEndObject();
                return w.ToString();
            }
        }
    }

}
