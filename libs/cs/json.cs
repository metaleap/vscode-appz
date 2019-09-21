namespace VscAppz {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Newtonsoft.Json;

    using Any = System.Object;

    internal static class json {
        internal static readonly JsonSerializer serializer = new JsonSerializer();

        internal static Any load(string jsonSrc) {
            using (StringReader jsonsrc = new StringReader(jsonSrc))
                return load(new JsonTextReader(jsonsrc), jsonSrc, false);
        }

        internal static Any load(JsonTextReader r, string origJsonSrcForErr, bool skipFirstRead) {
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
                    list.Add(load(r, origJsonSrcForErr, true));
                return list.ToArray();
            case JsonToken.StartObject:
                Dictionary<string, Any> dict = new Dictionary<string, Any>(8);
                while (r.Read() && r.TokenType != JsonToken.EndObject) {
                    var key = r.Value;
                    if (r.TokenType != JsonToken.PropertyName || !r.Read())
                        throw err();
                    dict.Add(key.ToString(), load(r, origJsonSrcForErr, true));
                }
                return dict;
            }
            throw err();
            Exception err() => new JsonException(origJsonSrcForErr);
        }
    }

    internal partial class ipcMsg {
        internal static ipcMsg fromJson(string jsonSrc) {
            Dictionary<string, Any> dict = json.load(jsonSrc) as Dictionary<string, Any>;
            var ret = new ipcMsg();
            if (dict.TryGetValue("qName", out var n))
                ret.QName = (n == null) ? null : (string)n;
            if (dict.TryGetValue("cbId", out var a))
                ret.CbId = (a == null) ? null : (string)a;
            if (dict.TryGetValue("data", out var d) )
                ret.Data = (d == null) ? null : (Dictionary<string, Any>)d;
            if (ret.Data == null || ret.Data.Count == 0)
                throw new JsonException("field `data` is missing");
            return ret;
        }

        internal string toJson() {
            using (var w = new StringWriter()) {
                var jw = new JsonTextWriter(w);
                jw.WriteStartObject();
                if (!string.IsNullOrEmpty(QName)) {
                    jw.WritePropertyName("qName");
                    jw.WriteValue(QName);
                }
                jw.WritePropertyName("data");
                jw.WriteStartObject();
                if (Data != null && Data.Count > 0)
                    lock (json.serializer)
                        foreach (var kvp in Data) {
                            jw.WritePropertyName(kvp.Key);
                            json.serializer.Serialize(jw, kvp.Value);
                        }
                jw.WriteEndObject();
                if (!string.IsNullOrEmpty(CbId)) {
                    jw.WritePropertyName("cbId");
                    jw.WriteValue(CbId);
                }
                jw.WriteEndObject();
                jw.Flush();
                return w.ToString();
            }
        }
    }

}
