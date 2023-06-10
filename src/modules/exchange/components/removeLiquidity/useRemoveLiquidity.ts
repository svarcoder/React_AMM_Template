import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { ABI } from "../../../../blockchain/abi/Abi";
import { ROUTER } from "../../../../blockchain/publicInstance/instance";


export const useRemoveLiquidity = () => {
    const { account } = useWeb3React()
    const globalSelector = useSelector((state: any) => state)
    const { slippage, deadline } = globalSelector.slippageReducer

    const removeLiquidity = async (liquidity: string, token0: string, token1: string, tokenAaddress: string, tokenBaddress: string) => {
        try {
            const deadLine = (Math.round(new Date().getTime() / 1000) + (Number(deadline) ? Number(deadline) * 60 : 5 * 60)).toString()
            let amountAMin: any = Number(token0) - (Number(token0) * (Number(slippage) / 100))
            amountAMin = new BigNumber(amountAMin).multipliedBy(10 ** 18).toString()
            let amountBMin: any = Number(token1) - (Number(token1) * (Number(slippage) / 100))
            amountBMin = new BigNumber(amountBMin).multipliedBy(10 ** 18).toString()

            await ROUTER.methods.removeLiquidity(
                tokenAaddress,
                tokenBaddress,
                liquidity,
                amountAMin,
                amountBMin,
                account,
                deadLine
            )
                .send({ from: account })
                .on("transactionHash", (hash: any) => {
                    alert(hash)
                }).on("receipt", (receipt: any) => {
                    alert("liquidity removed successfully")
                }).on("error", (error: any, receipt: any) => {
                    alert("transaction failed")
                })
        } catch (err) {
            console.error("removeLiquidity", err)
        }
    }

    const removeLiquidityEth = async (liquidity: string, token0: string, token1: string, tokenBaddress: string) => {
        try {
            const deadLine = (Math.round(new Date().getTime() / 1000) + (Number(deadline) ? Number(deadline) * 60 : 5 * 60)).toString()
            let amountAMin: any = Number(token0) - (Number(token0) * (Number(slippage) / 100))
            amountAMin = new BigNumber(amountAMin).times(10 ** 18)
            let amountBMin: any = Number(token1) - (Number(token1) * (Number(slippage) / 100))
            amountBMin = new BigNumber(amountBMin).times(10 ** 18)
            await ROUTER.methods
                .removeLiquidityETH(
                    tokenBaddress,
                    liquidity,
                    amountAMin,
                    amountBMin,
                    account,
                    deadLine
                )
                .send({ from: account })
                .on("transactionHash", (hash: any) => {
                    alert(hash)
                }).on("receipt", (receipt: any) => {
                    alert("liquidity removed successfully")
                }).on("error", (error: any, receipt: any) => {
                    alert("transaction failed")
                })
        } catch (err) {
            console.error("removeLiquidity", err)
        }
    }

    return {
        removeLiquidity,
        removeLiquidityEth
    }
}