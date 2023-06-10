import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { liquidityPath } from "../../../../logic/paths"
import { Button } from "../../../../shared/button"
import Card from "../../../../shared/card"
import { Spacer } from "../../../../shared/shared"
import UserLiquidity from "../userLiquidity"
import { useFetchLiquidity } from "./useFetchLiquidity"

const Liquidity = () => {
  const navigate = useNavigate()
  const { getNativeNonNativeLiquidity,
    getNonNativeNonNativeLiquidity,
    getTotalSupplyBustLp,
    getTotalSupplyBnbtLp } = useFetchLiquidity()
  const { account, library } = useWeb3React()
  const [bustLp, setBustLp] = useState<any>("")
  const [bnbLp, setBnbLp] = useState<any>("")
  const [rstPrice, setRstPrice] = useState<any>("")
  const [bustPrice, setbustPrice] = useState<any>("")
  const [bnbPrice, setBnbPrice] = useState<any>("")
  const [rstBnbPrice, setRstBnbPrice] = useState<any>("")

  const getLps = async () => {
    try {
      const lp1: any = await getNativeNonNativeLiquidity()
      const lp2: any = await getNonNativeNonNativeLiquidity()
      setBnbLp(lp1)
      setBustLp(lp2)
    } catch (err) {
      console.error("getLps", err)
    }
  }

  const getTokenValue = async () => {
    try {
      const totalBustRst: object | any = await getTotalSupplyBustLp()
      const totalBnbRst: object | any = await getTotalSupplyBnbtLp()
      if (totalBustRst) {
        setbustPrice(totalBustRst.BUSTtoken)
        setRstPrice(totalBustRst.RSTtoken)
      }
      if (totalBnbRst) {
        setBnbPrice(totalBnbRst.BNBtoken)
        setRstBnbPrice(totalBnbRst.RSTtoken)
      }
    } catch (err) {
      console.error("getRstBustToken", err)
    }
  }

  useEffect(() => {
    if (bnbLp || bustLp) {
      getTokenValue()
    }
  }, [bnbLp, bustLp])

  useEffect(() => {
    if (account && library) {
      getLps()
    }
  }, [account, library])

  return (
    <Card title="Liquidity">
      <Button fullWidth onClick={() => navigate(`${liquidityPath}/BNB/BUSD`)}>
        Add Liquidity
      </Button>
      <Spacer marginTop="2rem" />

      {Number(bustLp) && Number(bustPrice) && Number(rstPrice) ? <UserLiquidity
        onRemoveClick={() => navigate(`/remove/RST/BUST`)}
        token1="RST"
        token2="BUST"
        token1Price={bustPrice?.match(/^-?\d+(?:\.\d{0,18})?/)[0]}
        token2Price={rstPrice?.match(/^-?\d+(?:\.\d{0,18})?/)[0]}
        pooledToken={bustLp?.match(/^-?\d+(?:\.\d{0,18})?/)[0]}
      /> : ""}

      {Number(bnbLp) && Number(bnbPrice) && Number(rstBnbPrice) ? <UserLiquidity
        onRemoveClick={() => navigate(`/remove/BNB/RST`)}
        token1="BNB"
        token2="RST"
        token1Price={bnbPrice?.match(/^-?\d+(?:\.\d{0,18})?/)[0]}
        token2Price={rstBnbPrice?.match(/^-?\d+(?:\.\d{0,18})?/)[0]}
        pooledToken={bnbLp?.match(/^-?\d+(?:\.\d{0,18})?/)[0]}
      /> : ""}

    </Card>
  )
}
export default Liquidity
