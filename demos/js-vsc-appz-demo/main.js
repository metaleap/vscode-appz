const vscAppz = require("../../libs/js/vsc-appz")

const vsc = vscAppz.Vsc()
const win = vsc.window

main()

function main() {
    win.showErrorMessage("Hola Welt", ["bye", "ciao"], _ => {
        win.showErrorMessage(_, [], _ => { process.exit(0) })
    })
}
