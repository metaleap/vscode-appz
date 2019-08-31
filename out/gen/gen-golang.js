"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs = require("fs");
const gen_shared = require("./gen-shared");
class Gen extends gen_shared.Gen {
    gen(prep) {
        const pkgname = prep.fromOrig.module[0];
        let src = "package " + pkgname + "\n\n";
        for (let i = 0; i < prep.enums.length; i++)
            src += this.genEnum(prep, i);
        node_fs.writeFileSync(`${this.outFilePathPref}${pkgname}${this.outFilePathSuff}`, src);
    }
    genEnum(prep, idx) {
        const it = prep.enums[idx];
        let src = "type " + it.name + " int\n\nconst (\n";
        for (const enumerant of it.enumerants)
            src += enumerant.name + " " + it.name + " = " + enumerant.value + "\n";
        return src + ")\n\n";
    }
}
exports.Gen = Gen;
