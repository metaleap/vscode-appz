namespace VscAppz {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Reflection;
    using Newtonsoft.Json;

    using any = System.Object;
    using dict = System.Collections.Generic.Dictionary<string,object>;

    internal static class json {
        internal static readonly JsonSerializer serializer = new JsonSerializer();

        internal static any load(string jsonSrc) {
            using (StringReader jsonsrc = new StringReader(jsonSrc))
                return load(new JsonTextReader(jsonsrc), jsonSrc, false);
        }

        internal static any load(JsonTextReader r, string origJsonSrcForErr, bool skipFirstRead) {
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
                List<any> list = new List<any>(8);
                while (r.Read() && r.TokenType != JsonToken.EndArray)
                    list.Add(load(r, origJsonSrcForErr, true));
                return list.ToArray();
            case JsonToken.StartObject:
                dict obj = new dict(8);
                while (r.Read() && r.TokenType != JsonToken.EndObject) {
                    var key = r.Value;
                    if (r.TokenType != JsonToken.PropertyName || !r.Read())
                        throw err();
                    obj.Add(key.ToString(), load(r, origJsonSrcForErr, true));
                }
                return obj;
            }
            throw err();
            Exception err() => new JsonException(origJsonSrcForErr);
        }

        internal class valueTuples : JsonConverter
        {
            public override bool CanRead { get => false;}
            public override bool CanWrite { get => true;}
            public override bool CanConvert(Type objectType) => true;
            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer) =>
                throw new NotImplementedException();
            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                if (value == null)
                    writer.WriteNull();
                else {
                    writer.WriteStartArray();
                    Type vt = value.GetType();
                    for (var (i, fld) = (1, vt.GetField("Item1")); fld != null; fld = vt.GetField("Item" + (++i)))
                        serializer.Serialize(writer, fld.GetValue(value), fld.FieldType);
                    writer.WriteEndArray();
                }
            }
        }
    }

    internal partial class ipcMsg {
        internal static ipcMsg fromJson(string jsonSrc) {
            dict obj = json.load(jsonSrc) as dict;
            var ret = new ipcMsg();
            if (obj.TryGetValue("qName", out var n))
                ret.QName = (n == null) ? null : (string)n;
            if (obj.TryGetValue("cbId", out var a))
                ret.CbId = (a == null) ? null : (string)a;
            if (obj.TryGetValue("data", out var d) )
                ret.Data = (d == null) ? null : (dict)d;
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
                    // lock (json.serializer) --- not needed as long as only caller is impl.send()
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
