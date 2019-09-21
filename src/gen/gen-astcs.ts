import * as gen from './gen-basics'
import * as gen_ast from './gen-ast'

export class Gen extends gen_ast.Gen {

    gen(prep: gen.Prep) {
        this.options.indent = '\t'
        this.options.doc.appendArgsToSummaryFor.funcFields = true
        this.options.doc.appendArgsToSummaryFor.methods = true
        this.nameRewriters.types.interfaces = _ => 'I' + this.caseUp(_)
        super.gen(prep)
    }

    emitIntro(): Gen {
        return this.lines(
            '//' + this.doNotEditComment('csharp'),
            'namespace VscAppz {',
        ).indent().lines(
            'using System;',
            'using System.Collections.Generic;',
            'using Newtonsoft.Json;', '',
            'using Any = System.Object;', ''
        )
    }

    emitOutro(): Gen {
        return this.outdent().lines('}')
    }

    emitInterface(it: gen_ast.TInterface) {
        this.line('public interface ' + it.Name + ' {')
            .indent()
            .outdent()
            .line('}')
    }

}
