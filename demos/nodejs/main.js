const vscAppz = require("../../libs/js/vsc-appz")
const miscdemos = require('./miscdemos.gen')
Object.defineProperty(exports, "__esModule", { value: true })


let win, logChan
exports.appName = "nodejs-vsc-appz-demo"
exports.cmdName = exports.appName + new Date().getTime()

function main() {
    let greethow = "Hallo", greetname = "Welt"
    if (process.argv && process.argv.length &&
        process.argv.length > 2 && process.argv[2] && process.argv[2].length
    ) {
        greetname = process.argv[2]
        if (process.argv.length > 3 && process.argv[3] && process.argv[3].length)
            greethow = process.argv[3]
    }

    vscAppz.Main(vscode => {
        exports.vsc = vscode
        win = vscode.Window
        miscdemos.onUpAndRunning()

        win.SetStatusBarMessage2("React to the Welcome msg-box to remove me..")(statusmsg => {

            const buttons = ["Demo Text Input", "All Demos"]
            win.ShowInformationMessage1(greethow + ", " + greetname + "! What to try out? (If you cancel here, I quit.)", buttons)(
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
            win.ShowWarningMessage1("Drat! Was itching to hear that.")(miscdemos.demosMenu)
        else
            win.ShowInformationMessage1("You entered: `" + input + "`, merci!")(miscdemos.demosMenu)
    })
}

exports.quit = () => { process.exit() }

exports.cancelIn = (seconds) => {
    return vscAppz.CancelIn(1000 * seconds)
}

exports.logLn = (msgLn) => {
    if (logChan)
        logChan.AppendLine((!(msgLn && msgLn.length)) ? "" : (new Date().toLocaleTimeString() + "\t" + msgLn))
    return msgLn
}
exports.setOutChan = (outChan) => logChan = outChan

exports.strFmt = (s, ...args) => {
    for (let i = 0; i < args.length; i++)
        s = s.replace('{' + i + '}', '' + args[i])
    return s
}
exports.strLo = s => s.toLowerCase()
exports.strUp = s => s.toUpperCase()
exports.nums1To = n => {
    const ret = new Array(n)
    for (let i = 0; i < n; i++)
        ret[i] = i + 1
    return ret
}

main()
