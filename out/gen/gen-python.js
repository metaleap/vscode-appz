"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-shared");
class Gen extends gen.Gen {
    gen(prep) {
        console.log(`Py\t${this.outFilePathPref}${prep.fromOrig.module[0]}${this.outFilePathSuff}`);
    }
}
exports.Gen = Gen;
