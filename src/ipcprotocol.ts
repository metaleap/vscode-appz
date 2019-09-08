
export interface MsgFromApp {
    ns?: string
    name?: string
    payload: { [_: string]: any }
    andThen?: string
}

export interface MsgToApp {
    andThen: string
    payload?: any
    failed?: boolean
}
