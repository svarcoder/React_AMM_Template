import { SET_SLIPPAGE, SET_DEADLINE, SET_BNB_BALANCE } from "../constants"

export const setSlippage = (slippage: number | string) => {
    return {
        type: SET_SLIPPAGE,
        payload: slippage
    }
}

export const setDeadline = (deadline: number | string) => {
    return {
        type: SET_DEADLINE,
        payload: deadline
    }
}

export const setBnbBalance = (balance: number | string) => {
    return {
        type: SET_BNB_BALANCE,
        payload: balance
    }
}