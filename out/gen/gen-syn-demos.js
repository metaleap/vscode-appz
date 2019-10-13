"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_syn_1 = require("./gen-syn");
class GenDemos {
    constructor(gen, b) {
        const _ = b;
        this.gen = gen;
        this.all = {
            "demo_Commands_GetCommands": () => [
                _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Commands"))), _.n("GetCommands")), _.eLit(false), _.eFunc([{ Name: "cmds", Type: { ValsOf: gen_syn_1.TypeRefPrim.String } }], null, _.iVar("opts", { Name: "QuickPickOptions" }), _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })), _.iSet(_.oDot(_.n("opts"), _.n("IgnoreFocusOut")), _.eLit(true)), _.iSet(_.oDot(_.n("opts"), _.n("PlaceHolder")), _.eLit("Retrieved {0} command IDs:", _.eLen(_.n("cmds"), true))), _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("ShowQuickPick" + (gen.options.funcOverloads ? "" : "2"))), _.n("cmds"), _.oAddr(_.n("opts")), _.eZilch(), _.n("quit"))))
            ],
            "demo_Languages_GetLanguages": () => [
                _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Languages"))), _.n("GetLanguages")), _.eFunc([{ Name: "langs", Type: { ValsOf: gen_syn_1.TypeRefPrim.String } }], null, _.iVar("opts", { Name: "QuickPickOptions" }), _.iSet(_.n("opts"), _.eNew({ Name: "QuickPickOptions" })), _.iSet(_.oDot(_.n("opts"), _.n("IgnoreFocusOut")), _.eLit(true)), _.iSet(_.oDot(_.n("opts"), _.n("PlaceHolder")), _.eLit("Retrieved {0} language IDs:", _.eLen(_.n("langs"), true))), _.eCall(_.oDot(_.eProp(_.oDot(_.n("vsc"), _.n("Window"))), _.n("ShowQuickPick" + (gen.options.funcOverloads ? "" : "2"))), _.n("langs"), _.oAddr(_.n("opts")), _.eZilch(), _.n("quit"))))
            ],
        };
    }
    genDemos() {
        this.gen.emitIntro();
        for (const name in this.all)
            this.gen.emitFuncImpl({
                Name: name, Type: null, Func: {
                    Args: [], Type: null, Body: { Instrs: this.all[name]() }
                }
            });
        this.gen.emitOutro();
    }
}
exports.GenDemos = GenDemos;
