"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_shared = require("./gen-shared");
class Gen extends gen_shared.Gen {
    gen(job) {
        console.log(`Go\t${this.outFilePathPref}${job.module[0]}${this.outFilePathSuff}`);
    }
}
exports.Gen = Gen;
