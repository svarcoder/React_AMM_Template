import BigNumber from "bignumber.js";
import { useApprove } from "../../../../../blockchain/helperMethods/useApprove";
import { PAIR_PUBLIC, PAIR_WBNB, ROUTER } from "../../../../../blockchain/publicInstance/instance";


export const useAddLiquidity = () => {
    const { approve } = useApprove()

    const getToken1Amount = async (token0: string) => {
        try {
            if (Number(token0)) {
                const token0_wei = new BigNumber(token0).times(10 ** 18)
                const res = await PAIR_PUBLIC.methods.getReserves().call()
                let bustValue = await ROUTER.methods.quote(token0_wei.toFixed(0), res._reserve0, res._reserve1).call()
                return new BigNumber(bustValue).dividedBy(10 ** 18).toString()
            } else return ""
        } catch (err) {
            console.error("getToken1Amount", err)
        }
    }

    const getToken0Amount = async (token1: string) => {
        try {
            if (Number(token1)) {
                const token1_wei = new BigNumber(token1).times(10 ** 18)
                const res = await PAIR_PUBLIC.methods.getReserves().call()
                let bustValue = await ROUTER.methods.quote(token1_wei.toFixed(0), res._reserve1, res._reserve0).call()
                return new BigNumber(bustValue).dividedBy(10 ** 18).toString()
            } else return ""
        } catch (err) {
            console.error("getToken0Amount", err)
        }
    }

    const getToken1Amount_ETH = async (token0: string) => {
        try {
            if (Number(token0)) {
                const token0_wei = new BigNumber(token0).times(10 ** 18)
                const res = await PAIR_WBNB.methods.getReserves().call()
                let bustValue = await ROUTER.methods.quote(token0_wei.toFixed(0), res._reserve0, res._reserve1).call()
                return new BigNumber(bustValue).dividedBy(10 ** 18).toString()
            } else return ""
        } catch (err) {
            console.error("getToken0Amount", err)
        }
    }

    const getToken0Amount_ETH = async (token1: string) => {
        try {
            if (Number(token1)) {
                const token1_wei = new BigNumber(token1).times(10 ** 18)
                const res = await PAIR_WBNB.methods.getReserves().call()
                let bustValue = await ROUTER.methods.quote(token1_wei.toFixed(0), res._reserve1, res._reserve0).call()
                return new BigNumber(bustValue).dividedBy(10 ** 18).toString()
            } else return ""
        } catch (err) {
            console.error("getToken0Amount", err)
        }
    }


    const addLiquidity = async (account: string,
        token0: string | any,
        token1: string | any,
        token0Address: string,
        token1Address: string,
        deadLineValue: string,
        slippage: string,
        library: object,
        ticker0: string,
        ticker1: string) => {
        try {
            await approve(account, ticker0, library)
            await approve(account, ticker1, library)
            const deadLine = (Math.round(new Date().getTime() / 1000) + (Number(deadLineValue) ? Number(deadLineValue) * 60 : 5 * 60)).toString()
            const token0_wei = new BigNumber(token0).times(10 ** 18)
            const token1_wei = new BigNumber(token1).times(10 ** 18)
            const minToken0 = Number(slippage) ? Number(token0) - (Number(token0) * (Number(slippage) / 100)) : token0
            const minToken1 = Number(slippage) ? Number(token1) - (Number(token1) * (Number(slippage) / 100)) : token1
            const minToken0_wei = new BigNumber(minToken0).times(10 ** 18)
            const minToken1_wei = new BigNumber(minToken1).times(10 ** 18)

            ROUTER.methods.addLiquidity(
                token0Address,
                token1Address,
                token0_wei.toFixed(0),
                token1_wei.toFixed(0),
                minToken0_wei.toFixed(0),
                minToken1_wei.toFixed(0),
                account,
                deadLine
            ).send({
                from: account
            }).on("transactionHash", (hash: any) => {
                alert(hash)
            }).on("receipt", (receipt: any) => {
                alert("liquidity added successfully")
                return true
            }).on("error", (error: any, receipt: any) => {
                alert("failed")
                return false
            })
        } catch (err) {
            console.error("addLiquidity", err)
            return false
        }
    }

    const addLiquidityEth = async (account: string | any,
        token0: string | any,
        token1: string | any,
        token0Address: string,
        token1Address: string,
        deadLineValue: string,
        slippage: string,
        library: object,
        ticker0: string,
        ticker1: string) => {
        try {
            await approve(account, ticker1, library)
            const deadLine = (Math.round(new Date().getTime() / 1000) + (Number(deadLineValue) ? Number(deadLineValue) * 60 : 5 * 60)).toString()
            const token0_wei = new BigNumber(token0).times(10 ** 18)
            const token1_wei = new BigNumber(token1).times(10 ** 18)
            const minToken0 = Number(slippage) ? Number(token0) - (Number(token0) * (Number(slippage) / 100)) : token0
            const minToken1 = Number(slippage) ? Number(token1) - (Number(token1) * (Number(slippage) / 100)) : token1
            const minToken0_wei = new BigNumber(minToken0).times(10 ** 18)
            const minToken1_wei = new BigNumber(minToken1).times(10 ** 18)

            ROUTER.methods.addLiquidityETH(
                token1Address,
                token1_wei.toFixed(0),
                minToken1_wei.toFixed(0),
                minToken0_wei.toFixed(0),
                account,
                deadLine
            ).send({
                from: account,
                value: minToken0_wei
            }).on("transactionHash", (hash: any) => {
                alert(hash)
            }).on("receipt", (receipt: any) => {
                alert("liquidity added successfully")
                return true
            }).on("error", (error: any, receipt: any) => {
                alert("failed")
                return false
            })
        } catch (err: any) {
            console.error("addLiquidityEth", err)
        }

    }
    
    return {
        getToken1Amount,
        getToken0Amount,
        getToken1Amount_ETH,
        getToken0Amount_ETH,
        addLiquidity,
        addLiquidityEth
    }

}

