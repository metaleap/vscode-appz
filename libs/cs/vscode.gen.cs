namespace Vscode {
	// DO NOT EDIT: generated by github.com/metaleap/vscode-appz/src/gen/gen-csharp.ts via github.com/metaleap/vscode-appz/src/gen/main.ts

	public class MessageOptions {
		public object Modal;

		public MessageOptions() { }

		public MessageOptions(object modal) =>
			Modal = modal;
	}

	public class MessageItem {
		public object Title;
		public object IsCloseAffordance;
		public object AppzTag;

		public MessageItem() { }

		public MessageItem(object title, object isCloseAffordance, object appzTag) =>
			(Title, IsCloseAffordance, AppzTag) = (title, isCloseAffordance, appzTag);
	}

	public class InputBoxOptions {
		public object Value;
		public object ValueSelection;
		public object Prompt;
		public object PlaceHolder;
		public object Password;
		public object IgnoreFocusOut;
		public object ValidateInput;

		public InputBoxOptions() { }

		public InputBoxOptions(object value, object valueSelection, object prompt, object placeHolder, object password, object ignoreFocusOut, object validateInput) =>
			(Value, ValueSelection, Prompt, PlaceHolder, Password, IgnoreFocusOut, ValidateInput) = (value, valueSelection, prompt, placeHolder, password, ignoreFocusOut, validateInput);
	}

	public interface IWindow {
		void ShowErrorMessage1(object message, object items, object andThen);
		void ShowErrorMessage2(object message, object options, object items, object andThen);
		void ShowErrorMessage3(object message, object items, object andThen);
		void ShowErrorMessage4(object message, object options, object items, object andThen);
		void ShowInformationMessage1(object message, object items, object andThen);
		void ShowInformationMessage2(object message, object options, object items, object andThen);
		void ShowInformationMessage3(object message, object items, object andThen);
		void ShowInformationMessage4(object message, object options, object items, object andThen);
		void ShowWarningMessage1(object message, object items, object andThen);
		void ShowWarningMessage2(object message, object options, object items, object andThen);
		void ShowWarningMessage3(object message, object items, object andThen);
		void ShowWarningMessage4(object message, object options, object items, object andThen);
		void ShowInputBox(object options, object andThen);
	}

}
