import * as node_util from 'util'

export function moohaha() {
    console.log(
        node_util.isDeepStrictEqual(123, 321),
        "hola welt",
        node_util.isDeepStrictEqual(123, '123'),
        node_util.isDeepStrictEqual(123, 123.0000)
    )
}
