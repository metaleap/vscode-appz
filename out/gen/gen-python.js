"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen = require("./gen");
class Gen extends gen.Gen {
    gen(_prep) {
        this.resetState();
    }
}
exports.Gen = Gen;
