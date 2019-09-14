namespace VscAppz {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Newtonsoft.Json;

    using Any = System.Object;

    internal static class Json {
        internal static Any Load(string jsonSrc) {
            using (StringReader jsonsrc = new StringReader(jsonSrc))
                return Load(new JsonTextReader(jsonsrc), jsonSrc, false);
        }

        internal static Any Load(JsonTextReader r, string origJsonSrcForErr, bool skipFirstRead) {
            if ((!skipFirstRead) && !r.Read())
                throw err();
            switch (r.TokenType) {
            case JsonToken.Null:
                return null;
            case JsonToken.String:
                return r.Value.ToString();
            case JsonToken.Boolean:
                return (r.Value is bool) ? (bool)r.Value : bool.Parse(r.Value.ToString());
            case JsonToken.Integer:
                return (r.Value is int) ? (int)r.Value : int.Parse(r.Value.ToString());
            case JsonToken.Float:
                return (r.Value is double) ? (double)r.Value : double.Parse(r.Value.ToString());
            case JsonToken.StartArray:
                List<Any> list = new List<Any>(8);
                while (r.Read() && r.TokenType != JsonToken.EndArray)
                    list.Add(Load(r, origJsonSrcForErr, true));
                return list.ToArray();
            case JsonToken.StartObject:
                Dictionary<string, Any> dict = new Dictionary<string, Any>(8);
                while (r.Read() && r.TokenType != JsonToken.EndObject) {
                    var key = r.Value;
                    if (r.TokenType != JsonToken.PropertyName || !r.Read())
                        throw err();
                    dict.Add(key.ToString(), Load(r, origJsonSrcForErr, true));
                }
                return dict;
            }
            throw err();
            Exception err() => new JsonException(origJsonSrcForErr);
        }
    }

    internal partial class IpcMsg {
        internal static IpcMsg FromJson(string jsonSrc) {
            Dictionary<string, Any> dict = Json.Load(jsonSrc) as Dictionary<string, Any>;
            var ret = new IpcMsg();
            if (dict.TryGetValue("qName", out var n))
                ret.QName = (n == null) ? null : (string)n;
            if (dict.TryGetValue("cbId", out var a))
                ret.ContId = (a == null) ? null : (string)a;
            if (dict.TryGetValue("data", out var d) )
                ret.Data = (d == null) ? null : (Dictionary<string, Any>)d;
            if (ret.Data == null || ret.Data.Count == 0)
                throw new JsonException("field `data` is missing");
            return ret;
        }

        internal string ToJson() {
            using (var w = new StringWriter()) {
                var jw = new JsonTextWriter(w);
                jw.WriteStartObject();
                if (!string.IsNullOrEmpty(QName)) {
                    jw.WritePropertyName("qName");
                    jw.WriteValue(QName);
                }
                jw.WritePropertyName("data");
                jw.WriteStartObject();
                if (Data != null) {
                    var js = new JsonSerializer();
                    foreach (var kvp in Data) {
                        jw.WritePropertyName(kvp.Key);
                        js.Serialize(jw, kvp.Value);
                    }
                }
                jw.WriteEndObject();
                if (!string.IsNullOrEmpty(ContId)) {
                    jw.WritePropertyName("cbId");
                    jw.WriteValue(ContId);
                }
                jw.WriteEndObject();
                jw.Flush();
                return w.ToString();
            }
        }
    }

}
