import * as gen from './gen'

export class Gen implements gen.IGen {
    outFilePath: string;
    constructor(outFilePath: string) { this.outFilePath = outFilePath; }

    gen: () => {

    };

}
