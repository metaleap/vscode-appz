"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_shared = require("./gen-shared");
class Gen extends gen_shared.Gen {
    gen() {
        console.log(`C#\tpref=${this.outFilePathPref}\tsuff=${this.outFilePathSuff}`);
    }
}
exports.Gen = Gen;
