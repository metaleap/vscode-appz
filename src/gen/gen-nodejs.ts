import * as gen from './gen-basics'
import * as gen_ast from './gen-ast'


export class Gen extends gen_ast.Gen {

    gen(prep: gen.Prep) {
        this.options.oneIndent = "\t"
        this.options.doc.appendArgsToSummaryFor.funcFields = true
        this.options.doc.appendArgsToSummaryFor.methods = true
        this.options.funcOverloads = false
        this.nameRewriters.types.interfaces = _ => this.caseUp(_)
        super.gen(prep)
    }

    emitIntro(): Gen {
        return this
            .s("import { ipcMsg } from './aux'\n\n")
            .s("")
    }

}
