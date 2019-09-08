
export interface MsgIncoming {
    ns?: string
    name?: string
    payload: { [_: string]: any }
    andThen?: string
}

export interface MsgOutgoing {
    andThen?: string
    payload: any
    isFail?: boolean
}
