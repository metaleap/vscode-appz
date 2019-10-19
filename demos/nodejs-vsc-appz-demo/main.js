const vscAppz = require("../../libs/js/vsc-appz")
const miscdemos = require('./miscdemos.gen')
Object.defineProperty(exports, "__esModule", { value: true })


let win
exports.appName = "nodejs-vsc-appz-demo"

function main() {
    vscAppz.Main(vscode => {
        exports.vsc = vscode
        win = vscode.Window
        miscdemos.onReady()
        miscdemos.onUpAndRunning()

        win.SetStatusBarMessage2("Choosing a demo now WILL remove me")(statusmsg => {

            const buttons = ["Demo Text Input", "All Demos"]
            win.ShowInformationMessage1("What to try out? (If you cancel, I quit.)", buttons)(
                btn => {
                    statusmsg.Dispose()
                    if (btn === undefined || btn === null)
                        exports.quit()
                    else
                        switch (btn) {
                            case buttons[0]:
                                exports.demo_Window_ShowInputBox()
                                break
                            case buttons[1]:
                                miscdemos.demosMenu()
                                break
                            default:
                                win.ShowErrorMessage1("Unknown: `" + btn + "`!")(miscdemos.demosMenu)
                                break
                        }
                }
            )
        })
    })
}

exports.demo_Window_ShowInputBox = () => {
    const foos = ["foo", "f00", "fo0", "f0o"]
    win.ShowInputBox({
        ignoreFocusOut: true, value: "Enter almost anything...", valueSelection: [6, 12],
        prompt: "Enter anything containing nothing looking like `foo` (it would be rejected by my real-time ValidateInput func)",
        validateInput: input => {
            input = input.toLowerCase()
            return (!foos.some(_ => input.includes(_))) ? "" : "Contains something looking like `foo`."
        }
    })(input => {
        if (input === undefined || input === null)
            win.ShowWarningMessage1("Cancelled text input!")(miscdemos.demosMenu)
        else
            win.ShowInformationMessage1("You entered: `" + input + "`, merci!")(miscdemos.demosMenu)
    })
}

exports.quit = () => { process.exit() }

exports.cancelIn = (seconds) => {
    return vscAppz.CancelIn(1000 * seconds)
}

exports.strFmt = (s, ...args) => {
    for (let i = 0; i < args.length; i++)
        s = s.replace('{' + i + '}', '' + args[i])
    return s
}

main()