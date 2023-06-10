import { useWeb3React } from "@web3-react/core"
import { ABI } from "../abi/Abi";

export const usePrivateInstances = () => {

    const { library } = useWeb3React()

    let BUST, PAIR, PAIR_WBNB;

    if (library) {
        PAIR = new library.eth.Contract(ABI.PAIR.abi, ABI.PAIR.address)
        PAIR_WBNB = new library.eth.Contract(ABI.PAIR_NATIVE.abi, ABI.PAIR_NATIVE.address)
        BUST = new library.eth.Contract(ABI.BUST.abi, ABI.BUST.address)
    }

    return {
        PAIR,
        PAIR_WBNB,
        BUST
    }

}