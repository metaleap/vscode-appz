const vscAppz = require("../../libs/js/vsc-appz")
const miscdemos = require('./miscdemos.gen')
Object.defineProperty(exports, "__esModule", { value: true })

const vsc = vscAppz.Vsc()
const win = vsc.Window
exports.vsc = vsc

function main() {
    win.ShowInformationMessage1("Hola Welt", ["bye", "ciao"], _ => {
        miscdemos.onReady()
        miscdemos.subscribeToMiscEvents()
        miscdemos.demosMenu()
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
