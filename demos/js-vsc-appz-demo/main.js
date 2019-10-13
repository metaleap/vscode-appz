const vscAppz = require("../../libs/js/vsc-appz")

const vsc = vscAppz.Vsc()
const win = vsc.Window

main()

function main() {
    win.ShowInformationMessage1("Hola Welt", ["bye", "ciao"], _ => {
        win.ShowWarningMessage1(_, [], _ => { process.exit(0) })
    })
}
