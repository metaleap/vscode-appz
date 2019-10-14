const vscAppz = require("../../libs/js/vsc-appz")
const miscdemos = require('./miscdemos.gen')
Object.defineProperty(exports, "__esModule", { value: true })

const vsc = vscAppz.Vsc()
const win = vsc.Window
exports.vsc = vsc
exports.demo_Window_ShowInputBox = demo_Window_ShowInputBox

function main() {
    const quit = exports.quit

    miscdemos.onReady()
    miscdemos.subscribeToMiscEvents()
    win.SetStatusBarMessage2("Choosing a demo WILL HIDE this", statusitem => {
        const buttons = ["Demo Text Input", "All Demos"]
        win.ShowInformationMessage1("What to try out? (If you cancel, I quit.)",
            buttons,
            btn => {
                statusitem.Dispose()
                if (btn === undefined || btn === null)
                    quit()
                else
                    switch (btn) {
                        case buttons[0]:
                            demo_Window_ShowInputBox()
                            break;
                        case buttons[1]:
                            miscdemos.demosMenu()
                            break;
                        default:
                            win.ShowErrorMessage1("Unknown: `" + btn + "`, bye now!", null, quit)
                            break;
                    }
            })
    })
}

function demo_Window_ShowInputBox() {
    const quit = exports.quit, foos = ["foo", "f00", "fo0", "f0o"]
    win.ShowInputBox({
        ignoreFocusOut: true, value: "Enter almost anything...", valueSelection: [6, 12],
        prompt: "Enter anything containing nothing looking like `foo` (it would be rejected by my real-time ValidateInput func)",
        validateInput: input => {
            input = input.toLowerCase()
            return (!foos.some(_ => input.includes(_))) ? "" : "Contains something looking like `foo`."
        }
    }, null, input => {
        miscdemos.statusNoticeQuit()
        if (input === undefined || input === null)
            win.ShowWarningMessage1("Cancelled text input, bye now!", null, quit)
        else
            win.ShowInformationMessage1("You entered: `" + input + "`, bye now!", null, quit)
    })
}

exports.quit = () => {
    process.exit()
}

exports.cancelIn = (seconds) => {
    return vscAppz.CancelIn(1000 * seconds)
}

exports.strFmt = (s, ...args) => {
    for (let i = 0; i < args.length; i++)
        s = s.replace('{' + i + '}', '' + args[i])
    return s
}

main()
