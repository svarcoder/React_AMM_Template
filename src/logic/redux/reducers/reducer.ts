import { SET_BNB_BALANCE, SET_DEADLINE, SET_SLIPPAGE } from '../constants'

interface I_ApplicationState {
    slippage: number | string,
    deadline: number | string,
    bnbBalance: number | string
}

export const initialState: I_ApplicationState = {
    slippage: 5,
    deadline: 5,
    bnbBalance: 0
}


export const slippageReducer = (state = initialState, action: any) => {
    const { type, payload } = action

    switch (type) {
        case SET_DEADLINE:
            return {
                ...state,
                deadline: payload
            }
        case SET_SLIPPAGE:
            return {
                ...state,
                slippage: payload
            }
        case SET_BNB_BALANCE:
            return {
                ...state,
                bnbBalance: payload
            }
        default:
            return state
    }
}