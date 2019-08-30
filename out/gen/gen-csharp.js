"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_shared = require("./gen-shared");
class Gen extends gen_shared.Gen {
    gen(module, genFuncs, genStructs) {
        console.log(`C#\t${this.outFilePathPref}${module[0]}${this.outFilePathSuff}`);
    }
}
exports.Gen = Gen;
