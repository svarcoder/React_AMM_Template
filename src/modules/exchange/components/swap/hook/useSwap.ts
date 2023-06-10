import BigNumber from "bignumber.js";
import { ABI } from "../../../../../blockchain/abi/Abi";
import { useApprove } from "../../../../../blockchain/helperMethods/useApprove";
import { ROUTER } from "../../../../../blockchain/publicInstance/instance";

export const useSwap = () => {
    const { approve } = useApprove()

    const swapExactTokensForTokens = async (token0Price_wei: BigNumber, token1Price_wei: BigNumber, [token0Address, token1Address]: [string, string], admin: string, deadLine: string, slippage: string) => {
        try {
            let succesFlag = false
            let amountOutMin: any = Number(token1Price_wei.dividedBy(10 ** 18)) - (Number(token1Price_wei.dividedBy(10 ** 18)) * (Number(slippage) / 100))
            amountOutMin = new BigNumber(amountOutMin).times(10 ** 18)
            await ROUTER.methods.swapExactTokensForTokens(
                token0Price_wei.toFixed(0),
                amountOutMin.toFixed(0),
                [token0Address, token1Address],
                admin,
                deadLine).send({
                    from: admin
                })
                .on("transactionHash", (hash: any) => {
                    alert(hash)
                }).on("receipt", (receipt: any) => {
                    alert("swap successfull")
                    succesFlag = true
                }).on("error", (error: any, receipt: any) => {
                    alert("swap failed")
                })
            // return succesFlag
        } catch (err) {
            console.error("swapExactTokensForTokens", err)
            return false
        }
    }

    const swapTokensForExactTokens = async (token0Price_wei: BigNumber, token1Price_wei: BigNumber, [token0Address, token1Address]: [string, string], admin: string, deadLine: string, slippage: string) => {
        try {
            let succesFlag = false
            let amountInMax: any = Number(token1Price_wei.dividedBy(10 ** 18)) + (Number(token1Price_wei.dividedBy(10 ** 18)) * (Number(slippage) / 100))
            amountInMax = new BigNumber(amountInMax).times(10 ** 18)
            await ROUTER.methods.swapTokensForExactTokens(
                token0Price_wei.toFixed(0),
                amountInMax.toFixed(0),
                [token0Address, token1Address],
                admin,
                deadLine).send({
                    from: admin
                })
                .on("transactionHash", (hash: any) => {
                    alert(hash)
                }).on("receipt", (receipt: any) => {
                    alert("swap successfull")
                    succesFlag = true
                }).on("error", (error: any, receipt: any) => {
                    alert("swap failed")
                })
            // return succesFlag
        } catch (err) {
            console.error("swapExactTokensForTokens", err)
            return false
        }
    }

    const swapExactETHForTokens = async (token0Price_wei: BigNumber, token1Price_wei: BigNumber, [token0Address, token1Address]: [string, string], admin: string, deadLine: string, slippage: string) => {
        try {
            let amountOutMin: any = Number(token1Price_wei.dividedBy(10 ** 18)) - (Number(token1Price_wei.dividedBy(10 ** 18)) * (Number(slippage) / 100))
            amountOutMin = new BigNumber(amountOutMin).times(10 ** 18)
            await ROUTER.methods.swapExactETHForTokens(
                amountOutMin.toFixed(0),
                [token0Address, token1Address],
                admin,
                deadLine
            ).send({
                from: admin,
                value: token0Price_wei
            }).on("transactionHash", (hash: any) => {
                alert(hash)
            }).on("receipt", (receipt: any) => {
                alert("swap successfull")
            }).on("error", (error: any, receipt: any) => {
                alert("swap failed")
            })
        } catch (err) {
            console.error("swapExactETHForTokens", err)
        }
    }

    const swapTokensForExactETH = async (token0Price_wei: BigNumber, token1Price_wei: BigNumber, [token0Address, token1Address]: [string, string], admin: string, deadLine: string, slippage: string) => {
        try {
            let amountInMax: any = Number(token0Price_wei.dividedBy(10 ** 18)) + (Number(token0Price_wei.dividedBy(10 ** 18)) * (Number(slippage) / 100))
            amountInMax = new BigNumber(amountInMax).times(10 ** 18)
            await ROUTER.methods.swapTokensForExactETH(
                token1Price_wei.toFixed(0),
                amountInMax.toFixed(0),
                [token0Address, token1Address],
                admin,
                deadLine
            ).send({
                from: admin
            })
                .on("transactionHash", (hash: any) => {
                    alert(hash)
                }).on("receipt", (receipt: any) => {
                    alert("swap successfull")
                }).on("error", (error: any, receipt: any) => {
                    alert("swap failed")
                })
        } catch (err: any) {

        }
    }

    const swapExactTokensForETH = async (token0Price_wei: BigNumber, token1Price_wei: BigNumber, [token0Address, token1Address]: [string, string], admin: string, deadLine: string, slippage: string) => {
        try {
            let amountOutMin: any = Number(token1Price_wei.dividedBy(10 ** 18)) - (Number(token1Price_wei.dividedBy(10 ** 18)) * (Number(slippage) / 100))
            amountOutMin = new BigNumber(amountOutMin).times(10 ** 18)
            await ROUTER.methods.swapExactTokensForETH(
                token0Price_wei.toFixed(0),
                amountOutMin.toFixed(0),
                [token0Address, token1Address],
                admin,
                deadLine).send({
                    from: admin
                })
                .on("transactionHash", (hash: any) => {
                    alert(hash)
                }).on("receipt", (receipt: any) => {
                    alert("swap successfull")
                }).on("error", (error: any, receipt: any) => {
                    alert("swap failed")
                })

        } catch (err) {
            console.error("swapExactTokensForETH", err)
        }
    }

    const swapETHForExactTokens = async (token0Price_wei: BigNumber, token1Price_wei: BigNumber, [token0Address, token1Address]: [string, string], admin: string, deadLine: string, slippage: string) => {
        try {
            let amountInMax: any = Number(token0Price_wei.dividedBy(10 ** 18)) + (Number(token0Price_wei.dividedBy(10 ** 18)) * (Number(slippage) / 100))
            amountInMax = new BigNumber(amountInMax).times(10 ** 18)
            await ROUTER.methods.swapETHForExactTokens(
                token1Price_wei.toFixed(0),
                [token0Address, token1Address],
                admin,
                deadLine
            ).send({
                from: admin,
                value: amountInMax
            }).on("transactionHash", (hash: any) => {
                alert(hash)
            }).on("receipt", (receipt: any) => {
                alert("swap successfull")
            }).on("error", (error: any, receipt: any) => {
                alert("swap failed")
            })

        } catch (err) {
            console.error("swapExactTokensForETH", err)
        }
    }

    const swap = async (admin: string, token0Price: string | any, token1Price: string | any,
        token0Address: string, token1Address: string, swapType: string,
        slippage: string, deadLineValue: string, library: object, token0: string, token1: string, inputBoxCheck: number) => {
        try {
            const token0Price_wei = new BigNumber(token0Price).times(10 ** 18)
            const token1Price_wei = new BigNumber(token1Price).times(10 ** 18)
            const deadLine = (Math.round(new Date().getTime() / 1000) + (Number(deadLineValue) ? Number(deadLineValue) * 60 : 5 * 60)).toString()
            await approve(admin, token0, library)
            await approve(admin, token1, library)
            console.log("check", inputBoxCheck, token0, token1, token0Address, ABI[token0].address, token1Address === ABI[token1].address)
            if (token0Address === ABI["RST"].address && token1Address === ABI["WBNB"].address && inputBoxCheck === 0) {
                await swapExactTokensForETH(token0Price_wei, token1Price_wei, [token0Address, token1Address], admin, deadLine, slippage)
                return
            } else if (inputBoxCheck === 0 && (token0Address === ABI["WBNB"].address && token1Address === ABI["RST"].address)) {
                await swapExactETHForTokens(token0Price_wei, token1Price_wei, [token0Address, token1Address], admin, deadLine, slippage)
                return
            } else if (inputBoxCheck === 1 && (token1Address === ABI["WBNB"].address && token0Address === ABI["RST"].address)) {
                await swapTokensForExactETH(token0Price_wei, token1Price_wei, [token0Address, token1Address], admin, deadLine, slippage)
                return
            } else if (inputBoxCheck === 1 && (token0Address === ABI["WBNB"].address && token1Address === ABI["RST"].address)) {
                await swapETHForExactTokens(token0Price_wei, token1Price_wei, [token0Address, token1Address], admin, deadLine, slippage)
                return
            }
            const res = swapType == token0 ? await swapExactTokensForTokens(token0Price_wei, token1Price_wei, [token0Address, token1Address], admin, deadLine, slippage) : await swapTokensForExactTokens(token0Price_wei, token1Price_wei, [token0Address, token1Address], admin, deadLine, slippage)

            return res
        } catch (err) {
            console.error("swap", err)
        }
    }

    const getOtherTokenPrice = async (tokenPrice: any, token0Address: any, token1Address: any) => {
        try {
            if (Number(tokenPrice)) {
                const tokenPrice_wei = new BigNumber(tokenPrice).times(10 ** 18)
                console.log(tokenPrice_wei.toFixed(0), token0Address, token1Address);
                const Token_Amount = await ROUTER.methods.getAmountsOut(tokenPrice_wei.toFixed(0), [token0Address, token1Address]).call()
                let res = Token_Amount[1]
                res = new BigNumber(res).dividedBy(10 ** 18)
                return res
            } else {
                return 0
            }
        } catch (err) {
            console.error("getOtherTokenPrice", err)
        }
    }

    return {
        getOtherTokenPrice,
        swap
    }
}