"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const gen = require("./gen-shared");
class Gen extends gen.Gen {
    gen(prep) {
        const pkgname = prep.fromOrig.module[0];
        let src = "// " + this.doNotEditComment("vscext") + "\n\n";
        node_fs.writeFileSync(`${this.outFilePathPref}${pkgname}${this.outFilePathSuff}`, src);
    }
}
exports.Gen = Gen;
