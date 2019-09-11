// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-csharp.ts via github.com/metaleap/vscode-appz/src/gen/main.ts
namespace Vscode {
	using System;

	using System.Collections.Generic;

	public interface IProtocol {
		IWindow Window { get; }
	}

	internal partial class impl : IProtocol {
		IWindow IProtocol.Window { get { return this; } }
	}

	public partial class MessageOptions {
		public bool Modal = default;

		public MessageOptions() { }
		public MessageOptions(bool modal = default) =>
			Modal = modal;
	}

	public partial class MessageItem {
		public string Title = default;
		public bool IsCloseAffordance = default;
		public object MyTag = default;

		public MessageItem() { }
		public MessageItem(string title = default, bool isCloseAffordance = default, object myTag = default) =>
			(Title, IsCloseAffordance, MyTag) = (title, isCloseAffordance, myTag);
	}

	public partial class InputBoxOptions {
		public string Value = default;
		public (int, int) ValueSelection = default;
		public string Prompt = default;
		public string PlaceHolder = default;
		public bool Password = default;
		public bool IgnoreFocusOut = default;
		public Func<string, string> ValidateInput = default;
		internal string ValidateInput_AppzFuncId = "";

		public InputBoxOptions() { }
		public InputBoxOptions(string value = default, (int, int) valueSelection = default, string prompt = default, string placeHolder = default, bool password = default, bool ignoreFocusOut = default, Func<string, string> validateInput = default) =>
			(Value, ValueSelection, Prompt, PlaceHolder, Password, IgnoreFocusOut, ValidateInput) = (value, valueSelection, prompt, placeHolder, password, ignoreFocusOut, validateInput);
	}

	public interface IWindow {
		void ShowErrorMessage(string message = default, string[] items = default, Action<string> andThen = default);
		void ShowErrorMessage(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);
		void ShowErrorMessage(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowErrorMessage(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowInformationMessage(string message = default, string[] items = default, Action<string> andThen = default);
		void ShowInformationMessage(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);
		void ShowInformationMessage(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowInformationMessage(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowWarningMessage(string message = default, string[] items = default, Action<string> andThen = default);
		void ShowWarningMessage(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);
		void ShowWarningMessage(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowWarningMessage(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);
		void ShowInputBox(InputBoxOptions options = default, Action<string> andThen = default);
	}

	internal partial class impl : IWindow {
		void IWindow.ShowErrorMessage(string message, string[] items, Action<string> andThen) {
			var msg = new msgToVsc("window", "showErrorMessage1", 2);
			msg.Payload["message"] = message;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					string result = default;
					bool ok;
					if (ok = (payload is string))
						result = (string)payload;
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowErrorMessage(string message, MessageOptions options, string[] items, Action<string> andThen) {
			var msg = new msgToVsc("window", "showErrorMessage2", 3);
			msg.Payload["message"] = message;
			msg.Payload["options"] = options;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					string result = default;
					bool ok;
					if (ok = (payload is string))
						result = (string)payload;
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowErrorMessage(string message, MessageItem[] items, Action<MessageItem> andThen) {
			var msg = new msgToVsc("window", "showErrorMessage3", 2);
			msg.Payload["message"] = message;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					MessageItem result = default;
					bool ok;
					(result, ok) = new MessageItem().populateFrom(payload);
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowErrorMessage(string message, MessageOptions options, MessageItem[] items, Action<MessageItem> andThen) {
			var msg = new msgToVsc("window", "showErrorMessage4", 3);
			msg.Payload["message"] = message;
			msg.Payload["options"] = options;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					MessageItem result = default;
					bool ok;
					(result, ok) = new MessageItem().populateFrom(payload);
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowInformationMessage(string message, string[] items, Action<string> andThen) {
			var msg = new msgToVsc("window", "showInformationMessage1", 2);
			msg.Payload["message"] = message;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					string result = default;
					bool ok;
					if (ok = (payload is string))
						result = (string)payload;
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowInformationMessage(string message, MessageOptions options, string[] items, Action<string> andThen) {
			var msg = new msgToVsc("window", "showInformationMessage2", 3);
			msg.Payload["message"] = message;
			msg.Payload["options"] = options;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					string result = default;
					bool ok;
					if (ok = (payload is string))
						result = (string)payload;
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowInformationMessage(string message, MessageItem[] items, Action<MessageItem> andThen) {
			var msg = new msgToVsc("window", "showInformationMessage3", 2);
			msg.Payload["message"] = message;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					MessageItem result = default;
					bool ok;
					(result, ok) = new MessageItem().populateFrom(payload);
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowInformationMessage(string message, MessageOptions options, MessageItem[] items, Action<MessageItem> andThen) {
			var msg = new msgToVsc("window", "showInformationMessage4", 3);
			msg.Payload["message"] = message;
			msg.Payload["options"] = options;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					MessageItem result = default;
					bool ok;
					(result, ok) = new MessageItem().populateFrom(payload);
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowWarningMessage(string message, string[] items, Action<string> andThen) {
			var msg = new msgToVsc("window", "showWarningMessage1", 2);
			msg.Payload["message"] = message;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					string result = default;
					bool ok;
					if (ok = (payload is string))
						result = (string)payload;
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowWarningMessage(string message, MessageOptions options, string[] items, Action<string> andThen) {
			var msg = new msgToVsc("window", "showWarningMessage2", 3);
			msg.Payload["message"] = message;
			msg.Payload["options"] = options;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					string result = default;
					bool ok;
					if (ok = (payload is string))
						result = (string)payload;
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowWarningMessage(string message, MessageItem[] items, Action<MessageItem> andThen) {
			var msg = new msgToVsc("window", "showWarningMessage3", 2);
			msg.Payload["message"] = message;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					MessageItem result = default;
					bool ok;
					(result, ok) = new MessageItem().populateFrom(payload);
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowWarningMessage(string message, MessageOptions options, MessageItem[] items, Action<MessageItem> andThen) {
			var msg = new msgToVsc("window", "showWarningMessage4", 3);
			msg.Payload["message"] = message;
			msg.Payload["options"] = options;
			msg.Payload["items"] = items;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					MessageItem result = default;
					bool ok;
					(result, ok) = new MessageItem().populateFrom(payload);
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}

		void IWindow.ShowInputBox(InputBoxOptions options, Action<string> andThen) {
			var msg = new msgToVsc("window", "showInputBox", 1);
			msg.Payload["options"] = options;
			Action<object> on = null;
			if (andThen != null)
				on = (object payload) => {
					string result = default;
					bool ok;
					if (ok = (payload is string))
						result = (string)payload;
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, on);
		}
	}

	public partial class MessageItem {
		internal (MessageItem, bool) populateFrom(object payload) {
			var m = payload as Dictionary<string, object>;
			if (m == null) return (null, false);
			{
				if (m.TryGetValue("title", out var val) && val != null) {
					bool ok;
					if (ok = (val is string))
						Title = (string)val;
					if (!ok)
						return (null, false);
				} else return (null, false);
			}
			{
				if (m.TryGetValue("isCloseAffordance", out var val)) {
					bool ok;
					if (ok = (val is bool))
						IsCloseAffordance = (bool)val;
					if (!ok)
						return (null, false);
				}
			}
			{
				if (m.TryGetValue("myTag", out var val)) {
					MyTag = val;
				}
			}
			return (this, true);
		}
	}

}
