"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenPrep {
    constructor(job) {
        this.enums = [];
        this.structs = [];
        this.interfaces = [];
    }
}
exports.GenPrep = GenPrep;
class Gen {
    constructor(outFilePathPref, outFilePathSuff) {
        [this.outFilePathPref, this.outFilePathSuff] = [outFilePathPref, outFilePathSuff];
    }
}
exports.Gen = Gen;
