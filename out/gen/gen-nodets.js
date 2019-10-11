"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen-basics");
class Gen extends gen.Gen {
    gen(prep) {
        this.resetState();
        console.log(`Ts\t${this.outFilePathPref}${prep.fromOrig.moduleName}${this.outFilePathSuff}`);
    }
}
exports.Gen = Gen;
