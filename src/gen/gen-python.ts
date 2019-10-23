import * as gen from './gen'

export class Gen extends gen.Gen implements gen.IGen {

    gen(_prep: gen.Prep) {
        this.resetState()
    }

}
