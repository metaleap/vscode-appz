"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_util = require("util");
function moohaha() {
    console.log(node_util.isDeepStrictEqual(123, 321), "hola welt", node_util.isDeepStrictEqual(123, '123'), node_util.isDeepStrictEqual(123, 123.0000));
}
exports.moohaha = moohaha;
