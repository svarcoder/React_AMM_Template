import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import { usePrivateInstances } from "../../../../blockchain/privateInstance/instances"
import { ROUTER } from "../../../../blockchain/publicInstance/instance"


export const useFetchLiquidity = () => {
    const { PAIR_WBNB, PAIR } = usePrivateInstances()
    const { account } = useWeb3React()

    const getNativeNonNativeLiquidity = async () : Promise<string | any> => {
        try {
            const liquidity = await PAIR_WBNB.methods.balanceOf(account).call()
            return new BigNumber(liquidity).dividedBy(10 ** 18).toString()
        } catch (err) {
            console.error('getNativeNonNativeLiquidity', err)
        }
    }

    const getNonNativeNonNativeLiquidity = async () : Promise<string | any> => {
        try {
            const liquidity = await PAIR.methods.balanceOf(account).call()            
            return new BigNumber(liquidity).dividedBy(10 ** 18).toString()
        } catch (err) {
            console.error("getNonNativeNonNativeLiquidity", err)
        }
    }

    const getReserveBustLp = async () => {
        try {
            const bustRes = await PAIR.methods.getReserves().call()
            const res0 = bustRes._reserve0
            const res1 = bustRes._reserve1

            return {
                res0,
                res1
            }
        } catch (err) {
            console.error("getReserveBustLp", err)
        }
    }

    const getTotalSupplyBustLp = async (): Promise<object | any> => {
        try{
           const totalSupply = await PAIR.methods.totalSupply().call()
           const totalSupplyEth = new BigNumber(totalSupply).dividedBy(10 ** 18)
           const bustLpReserves: any = await getReserveBustLp()           
           const bustLpReserves0Eth = new BigNumber(bustLpReserves.res0).dividedBy(10 ** 18)
           const bustLpReserves1Eth = new BigNumber(bustLpReserves.res1).dividedBy(10 ** 18)
           const bustLP: string = await getNonNativeNonNativeLiquidity()
           const bustLpEth : BigNumber = new BigNumber(bustLP)
           const BUSTtoken: string | any = (bustLpReserves0Eth.dividedBy(totalSupplyEth)).multipliedBy(bustLpEth).toString()
           const RSTtoken: string = (bustLpReserves1Eth.dividedBy(totalSupplyEth)).multipliedBy(bustLpEth).toString()           
           return {
            BUSTtoken,
            RSTtoken
           }

        }catch(err){
            console.error("getReserveBustLp", err)
        }
    }


    const getReserveBnbLp = async () => {
        try {
            const bnbRes = await PAIR_WBNB.methods.getReserves().call()
            const res0 = bnbRes._reserve0
            const res1 = bnbRes._reserve1
            return {
                res0, res1
            }
        } catch (err) {
            console.error("getReserveBnbLp", err)
        }
    }

    const getTotalSupplyBnbtLp = async () => {
        try{
           const totalSupply = await PAIR_WBNB.methods.totalSupply().call()
           const totalSupplyEth = new BigNumber(totalSupply).dividedBy(10 ** 18)
           const bnbLpReserves: any = await getReserveBnbLp()           
           const bnbLpReserves0Eth = new BigNumber(bnbLpReserves.res0).dividedBy(10 ** 18)
           const bnbLpReserves1Eth = new BigNumber(bnbLpReserves.res1).dividedBy(10 ** 18)
           const bnbLP: string = await getNativeNonNativeLiquidity()
           const bnbLpEth : BigNumber = new BigNumber(bnbLP)
           const RSTtoken: string = (bnbLpReserves0Eth.dividedBy(totalSupplyEth)).multipliedBy(bnbLpEth).toString()
           const BNBtoken: string = (bnbLpReserves1Eth.dividedBy(totalSupplyEth)).multipliedBy(bnbLpEth).toString()
           
           return {
            BNBtoken,
            RSTtoken
           }

        }catch(err){
            console.error("getReserveBustLp", err)
        }
    }


    const getPerTokenPrice2Bust = async () => {
        try {
            const initialPrice = new BigNumber(1).multipliedBy(10 ** 18)
            const res = await getReserveBustLp()
            const price = await ROUTER.methods.quote(initialPrice, res?.res0, res?.res1).call()
            return new BigNumber(price).dividedBy(10 ** 18).toString()
        } catch (err) {
            console.error("getPerTokenPrice2Bust", err)
        }
    }

    const getPerTokenPrice1Bust = async () => {
        try {
            const initialPrice = new BigNumber(1).multipliedBy(10 ** 18)
            const res = await getReserveBustLp()
            const price = await ROUTER.methods.quote(initialPrice, res?.res1, res?.res0).call()
            return new BigNumber(price).dividedBy(10 ** 18).toString()
        } catch (err) {
            console.error("getPerTokenPrice1Bust", err)
        }
    }

    const getPerTokenPrice2Bnb = async () => {
        try {
            const initialPrice = new BigNumber(1).multipliedBy(10 ** 18)
            const res = await getReserveBnbLp()
            const price = await ROUTER.methods.quote(initialPrice, res?.res0, res?.res1).call()
            return new BigNumber(price).dividedBy(10 ** 18).toString()
        } catch (err) {
            console.error("getPerTokenPrice2Bust", err)
        }
    }

    const getPerTokenPrice1Bnb = async () => {
        try {
            const initialPrice = new BigNumber(1).multipliedBy(10 ** 18)
            const res = await getReserveBnbLp()
            const price = await ROUTER.methods.quote(initialPrice, res?.res1, res?.res0).call()
            return new BigNumber(price).dividedBy(10 ** 18).toString()
        } catch (err) {
            console.error("getPerTokenPrice1Bust", err)
        }
    }

    return {
        getNativeNonNativeLiquidity,
        getNonNativeNonNativeLiquidity,
        getPerTokenPrice2Bust,
        getPerTokenPrice1Bust,
        getPerTokenPrice2Bnb,
        getPerTokenPrice1Bnb,
        getTotalSupplyBustLp,
        getTotalSupplyBnbtLp
    }

}