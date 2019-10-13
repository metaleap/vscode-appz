const vscAppz = require("../../libs/js/vsc-appz")

const vsc = vscAppz.Vsc()
const win = vsc.Window

main()

function main() {
    win.ShowInformationMessage1("Hola Welt", ["bye", "ciao"], _ => {
        win.ShowWarningMessage1(_, [], _ => { process.exit(0) })
    })
}

function strFmt(s, ...args) {
    for (let i = 0; i < args.length; i++)
        s = s.replace('{' + i + '}', '' + args[i])
    return s
}
