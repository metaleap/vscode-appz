// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-csharp.ts via github.com/metaleap/vscode-appz/src/gen/main.ts
namespace VscAppz {
	using System;
	using System.Collections.Generic;
	using Newtonsoft.Json;

	using Any = System.Object;

	/// <summary>
	/// Type Definition for Visual Studio Code 1.37 Extension API
	/// See https://code.visualstudio.com/api for more information
	/// </summary>
	public interface IVscode {

		/// <summary>
		/// Namespace for dealing with the current window of the editor. That is visible
		/// and active editors, as well as, UI elements to show messages, selections, and
		/// asking for user input.
		/// </summary>
		IWindow Window { get; }
	}

	internal partial class impl : IVscode {
		IWindow IVscode.Window { get { return this; } }
	}

	/// <summary>
	/// Options to configure the behavior of the message.
	/// </summary>
	public partial class MessageOptions {

		/// <summary>
		/// Indicates that this message should be modal.
		/// </summary>
		[JsonProperty("modal")]
		public bool Modal;

		/// <summary>
		/// Options to configure the behavior of the message.
		/// </summary>
		public MessageOptions() {}

		/// <summary>
		/// Options to configure the behavior of the message.
		/// </summary>
		/// <param name="modal">
		/// Indicates that this message should be modal.
		/// </param>
		public MessageOptions(bool modal = default) =>
			Modal = modal;
	}

	/// <summary>
	/// Represents an action that is shown with an information, warning, or
	/// error message.
	/// </summary>
	public partial class MessageItem {

		/// <summary>
		/// A short title like 'Retry', 'Open Log' etc.
		/// </summary>
		[JsonProperty("title"), JsonRequired]
		public string Title;

		/// <summary>
		/// A hint for modal dialogs that the item should be triggered
		/// when the user cancels the dialog (e.g. by pressing the ESC
		/// key).
		/// 
		/// Note: this option is ignored for non-modal messages.
		/// </summary>
		[JsonProperty("isCloseAffordance")]
		public bool IsCloseAffordance;

		/// <summary>Free-form custom data, preserved across a roundtrip.</summary>
		[JsonProperty("my")]
		public Dictionary<string, Any> My;

		/// <summary>
		/// Represents an action that is shown with an information, warning, or
		/// error message.
		/// </summary>
		public MessageItem() {}

		/// <summary>
		/// Represents an action that is shown with an information, warning, or
		/// error message.
		/// </summary>
		/// <param name="title">
		/// A short title like 'Retry', 'Open Log' etc.
		/// </param>
		/// <param name="isCloseAffordance">
		/// A hint for modal dialogs that the item should be triggered
		/// when the user cancels the dialog (e.g. by pressing the ESC
		/// key).
		/// 
		/// Note: this option is ignored for non-modal messages.
		/// </param>
		/// <param name="my">Free-form custom data, preserved across a roundtrip.</param>
		public MessageItem(string title = default, bool isCloseAffordance = default, Dictionary<string, Any> my = default) =>
			(Title, IsCloseAffordance, My) = (title, isCloseAffordance, my);
	}

	/// <summary>
	/// Options to configure the behavior of the input box UI.
	/// </summary>
	public partial class InputBoxOptions {

		/// <summary>
		/// The value to prefill in the input box.
		/// </summary>
		[JsonProperty("value")]
		public string Value;

		/// <summary>
		/// Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
		/// first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
		/// word will be selected, when empty (start equals end) only the cursor will be set,
		/// otherwise the defined range will be selected.
		/// </summary>
		[JsonProperty("valueSelection")]
		public (int, int) ValueSelection;

		/// <summary>
		/// The text to display underneath the input box.
		/// </summary>
		[JsonProperty("prompt")]
		public string Prompt;

		/// <summary>
		/// An optional string to show as place holder in the input box to guide the user what to type.
		/// </summary>
		[JsonProperty("placeHolder")]
		public string PlaceHolder;

		/// <summary>
		/// Set to `true` to show a password prompt that will not show the typed value.
		/// </summary>
		[JsonProperty("password")]
		public bool Password;

		/// <summary>
		/// Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.
		/// </summary>
		[JsonProperty("ignoreFocusOut")]
		public bool IgnoreFocusOut;

		/// <summary>
		/// An optional function that will be called to validate input and to give a hint
		/// to the user.
		/// 
		/// `value` ── The current value of the input box.
		/// 
		/// `return` ── A human readable string which is presented as diagnostic message.
		/// Return `undefined`, `null`, or the empty string when 'value' is valid.
		/// </summary>
		[JsonIgnore]
		public Func<string, string> ValidateInput;

		/// <summary>For internal runtime use only.</summary>
		[JsonProperty("validateInput_AppzFuncId")]
		public string ValidateInput_AppzFuncId = "";

		/// <summary>
		/// Options to configure the behavior of the input box UI.
		/// </summary>
		public InputBoxOptions() {}

		/// <summary>
		/// Options to configure the behavior of the input box UI.
		/// </summary>
		/// <param name="value">
		/// The value to prefill in the input box.
		/// </param>
		/// <param name="valueSelection">
		/// Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
		/// first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
		/// word will be selected, when empty (start equals end) only the cursor will be set,
		/// otherwise the defined range will be selected.
		/// </param>
		/// <param name="prompt">
		/// The text to display underneath the input box.
		/// </param>
		/// <param name="placeHolder">
		/// An optional string to show as place holder in the input box to guide the user what to type.
		/// </param>
		/// <param name="password">
		/// Set to `true` to show a password prompt that will not show the typed value.
		/// </param>
		/// <param name="ignoreFocusOut">
		/// Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.
		/// </param>
		/// <param name="validateInput">
		/// An optional function that will be called to validate input and to give a hint
		/// to the user.
		/// 
		/// `value` ── The current value of the input box.
		/// 
		/// `return` ── A human readable string which is presented as diagnostic message.
		/// Return `undefined`, `null`, or the empty string when 'value' is valid.
		/// </param>
		public InputBoxOptions(string value = default, (int, int) valueSelection = default, string prompt = default, string placeHolder = default, bool password = default, bool ignoreFocusOut = default, Func<string, string> validateInput = default) =>
			(Value, ValueSelection, Prompt, PlaceHolder, Password, IgnoreFocusOut, ValidateInput) = (value, valueSelection, prompt, placeHolder, password, ignoreFocusOut, validateInput);
	}

	/// <summary>
	/// Namespace for dealing with the current window of the editor. That is visible
	/// and active editors, as well as, UI elements to show messages, selections, and
	/// asking for user input.
	/// </summary>
	public interface IWindow {

		/// <summary>
		/// Show an error message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowErrorMessage(string message = default, string[] items = default, Action<string> andThen = default);

		/// <summary>
		/// Show an error message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `options` ── Configures the behaviour of the message.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowErrorMessage(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);

		/// <summary>
		/// Show an error message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowErrorMessage(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);

		/// <summary>
		/// Show an error message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `options` ── Configures the behaviour of the message.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowErrorMessage(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);

		/// <summary>
		/// Show an information message to users. Optionally provide an array of items which will be presented as
		/// clickable buttons.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowInformationMessage(string message = default, string[] items = default, Action<string> andThen = default);

		/// <summary>
		/// Show an information message to users. Optionally provide an array of items which will be presented as
		/// clickable buttons.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `options` ── Configures the behaviour of the message.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowInformationMessage(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);

		/// <summary>
		/// Show an information message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowInformationMessage(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);

		/// <summary>
		/// Show an information message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `options` ── Configures the behaviour of the message.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowInformationMessage(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);

		/// <summary>
		/// Show a warning message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowWarningMessage(string message = default, string[] items = default, Action<string> andThen = default);

		/// <summary>
		/// Show a warning message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `options` ── Configures the behaviour of the message.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowWarningMessage(string message = default, MessageOptions options = default, string[] items = default, Action<string> andThen = default);

		/// <summary>
		/// Show a warning message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowWarningMessage(string message = default, MessageItem[] items = default, Action<MessageItem> andThen = default);

		/// <summary>
		/// Show a warning message.
		/// 
		/// `message` ── The message to show.
		/// 
		/// `options` ── Configures the behaviour of the message.
		/// 
		/// `items` ── A set of items that will be rendered as actions in the message.
		/// 
		/// `andThen` ── A thenable that resolves to the selected item or `undefined` when being dismissed.
		/// </summary>
		void ShowWarningMessage(string message = default, MessageOptions options = default, MessageItem[] items = default, Action<MessageItem> andThen = default);

		/// <summary>
		/// Opens an input box to ask the user for input.
		/// 
		/// The returned value will be `undefined` if the input box was canceled (e.g. pressing ESC). Otherwise the
		/// returned value will be the string typed by the user or an empty string if the user did not type
		/// anything but dismissed the input box with OK.
		/// 
		/// `options` ── Configures the behavior of the input box.
		/// 
		/// `andThen` ── A promise that resolves to a string the user provided or to `undefined` in case of dismissal.
		/// </summary>
		void ShowInputBox(InputBoxOptions options = default, Action<string> andThen = default);
	}

	internal partial class impl : IWindow {
		void IWindow.ShowErrorMessage(string message, string[] items, Action<string> andThen) {
			var msg = new msgToVsc("window", "showErrorMessage1", 2);
			msg.Payload["message"] = message;
			msg.Payload["items"] = items;
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
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
			var fnids = new List<string>(1);
			lock (this) {
				if (options != null) {
					options.ValidateInput_AppzFuncId = "";
					var fn = options.ValidateInput;
					if (fn != null) {
						options.ValidateInput_AppzFuncId = this.nextFuncId();
						fnids.Add(options.ValidateInput_AppzFuncId);
						this.cbOther[options.ValidateInput_AppzFuncId] = (Any[] args) => {
							if (args != null && args.Length == 1) {
								string a0 = default;
								bool ok;
								if (ok = (args[0] is string))
									a0 = (string)args[0];
								if (!ok)
									return (null, false);
								return (fn(a0), true);
							}
							return (null, false);
						};
					}
				}
			}
			msg.Payload["options"] = options;
			Action<Any> on = null;
			if (andThen != null)
				on = (Any payload) => {
					string result = default;
					bool ok;
					if (ok = (payload is string))
						result = (string)payload;
					if (!ok)
						return;
					andThen(result);
				};

			this.send(msg, (Any payload) => {
				if (fnids.Count != 0)
					lock (this)
						foreach (var fnid in fnids)
							_ = this.cbOther.Remove(fnid);
				if (on != null)
					on(payload);
			});
		}
	}

	public partial class MessageItem {
		internal (MessageItem, bool) populateFrom(Any payload) {
			var m = payload as Dictionary<string, Any>;
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
				if (m.TryGetValue("my", out var val)) {
					bool ok;
					if (ok = (val is Dictionary<string, Any>))
						My = (Dictionary<string, Any>)val;
					if (!ok)
						return (null, false);
				}
			}
			return (this, true);
		}
	}

}
