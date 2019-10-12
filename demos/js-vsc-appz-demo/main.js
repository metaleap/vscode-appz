const vscode = require("../../libs/js/basics")

const vsc = vscode.Vsc()
const win = vsc.window

main()

function main() {
    win.showErrorMessage("Hola Welt", ["bye", "ciao"], _ => {
        win.showErrorMessage(_, [], _ => { process.exit(0) })
    })
}
