import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ABI } from "../../../../blockchain/abi/Abi"
import { useApprove } from "../../../../blockchain/helperMethods/useApprove"
import { Button } from "../../../../shared/button"
import Card from "../../../../shared/card"
import { FlexBox } from "../../../../shared/flexBox"
import {
  IconButton,
  SharedDescription,
  SharedTitle,
  Spacer,
  StyledSlider,
} from "../../../../shared/shared"
import Token from "../../../../shared/token"
import { useFetchLiquidity } from "../liquidity/useFetchLiquidity"
import { useRemoveLiquidity } from "./useRemoveLiquidity"

const RemoveLiquidity = () => {
  const { getTotalSupplyBustLp, getTotalSupplyBnbtLp, getNativeNonNativeLiquidity, getNonNativeNonNativeLiquidity } = useFetchLiquidity()
  const {removeLiquidity, removeLiquidityEth} = useRemoveLiquidity()
  const { approve } = useApprove()
  const { token1, token2 } = useParams()
  const [percentage, setPercentage] = useState(100)
  const { account, library }: any= useWeb3React()
  const [isNativeToken, setIsNativeToken] = useState<boolean>(false)
  const [rstPrice, setRstPrice] = useState<string>("")
  const [bustPrice, setbustPrice] = useState<string>("")
  const [bnbPrice, setBnbPrice] = useState<string>("")
  const [rstBnbPrice, setRstBnbPrice] = useState<string>("")
  const [rstPriceStatic, setRstPriceStatic] = useState<string>("")
  const [bustPriceStatic, setbustPriceStatic] = useState<string>("")
  const [bnbPriceStatic, setBnbPriceStatic] = useState<string>("")
  const [rstBnbPriceStatic, setRstBnbPriceStatic] = useState<string>("")
  const buttonPercentageValues = [25, 50, 75, 100]

  const approveLPtoken = async (pairType: string) => {
    try {      
      await approve(account,pairType, library)
    } catch (err) {
      console.error("approveLPtoken", err)
    }
  }

  const getTokenValue = async () => {
    try {
      if (token1 === "RST" && token2 === "BUST") {
        setIsNativeToken(false)
        const totalBustRst: object | any = await getTotalSupplyBustLp()
        setbustPrice(totalBustRst.BUSTtoken.match(/^-?\d+(?:\.\d{0,18})?/)[0])
        setRstPrice(totalBustRst.RSTtoken.match(/^-?\d+(?:\.\d{0,18})?/)[0])
        setbustPriceStatic(totalBustRst.BUSTtoken.match(/^-?\d+(?:\.\d{0,18})?/)[0])
        setRstPriceStatic(totalBustRst.RSTtoken.match(/^-?\d+(?:\.\d{0,18})?/)[0])
      } else {
        setIsNativeToken(true)
        const totalBnbRst: any = await getTotalSupplyBnbtLp()
        setBnbPrice(totalBnbRst.BNBtoken.match(/^-?\d+(?:\.\d{0,18})?/)[0])
        setRstBnbPrice(totalBnbRst.RSTtoken.match(/^-?\d+(?:\.\d{0,18})?/)[0])
        setBnbPriceStatic(totalBnbRst.BNBtoken.match(/^-?\d+(?:\.\d{0,18})?/)[0])
        setRstBnbPriceStatic(totalBnbRst.RSTtoken.match(/^-?\d+(?:\.\d{0,18})?/)[0])
      }

    } catch (err) {
      console.error("getRstBustToken", err)
    }
  }
  
  const changeInPercentage = (percent: number) => {
    console.log({percent});
    
     if(isNativeToken){
       const changeBNB = new BigNumber(bnbPriceStatic).multipliedBy(percent).dividedBy(100).toString()
       const changeRstBnb = new BigNumber(rstBnbPriceStatic).multipliedBy(percent).dividedBy(100).toString()
       setBnbPrice(changeBNB)
       setRstBnbPrice(changeRstBnb)
     }else{
      const changeRst = new BigNumber(rstPriceStatic).multipliedBy(percent).dividedBy(100).toString()
      const changeBust = new BigNumber(bustPriceStatic).multipliedBy(percent).dividedBy(100).toString()
      setRstPrice(changeRst)
      setbustPrice(changeBust)
     }
  }

  const removeLiq = async() =>{
    try{
      if(isNativeToken){
        const liq = await getNativeNonNativeLiquidity()
        let toBeremove: any = new BigNumber(liq).multipliedBy(percentage).dividedBy(100)
        toBeremove = toBeremove.multipliedBy(10 ** 18).toFixed(0)    
        removeLiquidityEth(toBeremove,bnbPrice,rstBnbPrice, ABI["RST"].address)
      }else{
        const liq = await getNonNativeNonNativeLiquidity()
        let toBeremove: any = new BigNumber(liq).multipliedBy(percentage).dividedBy(100)
        toBeremove = toBeremove.multipliedBy(10 ** 18).toFixed(0)        
        removeLiquidity(toBeremove,bustPrice,rstPrice, ABI["BUST"].address, ABI["RST"].address)
      }
      
    }catch(err){
      console.error("removeLiq",err)
    }
  }

  useEffect(() => {
    if (account && library && token1 && token2) {
      getTokenValue()
    }
  }, [account, library])

  useEffect(()=>{
    if(library){
      changeInPercentage(percentage)
    }
  },[percentage])

  return (
    <Card title="Liquidity">
      <SharedTitle>{percentage}%</SharedTitle>
      <StyledSlider
        onChange={(e) => setPercentage(Number(e.target.value))}
        value={percentage}
      />
      <Spacer marginTop="2rem" />
      <FlexBox>
        {buttonPercentageValues.map((val, i) => (
          <Button key={i} width="5rem" onClick={() => setPercentage(val)}>
            {val}%
          </Button>
        ))}
      </FlexBox>
      <Spacer marginTop="2rem" marginBottom="2rem">
        <IconButton src={require("../../../../assets/icons/down-icon.svg")} />
      </Spacer>
      <FlexBox>
        <SharedDescription>{isNativeToken ? rstBnbPrice : rstPrice}</SharedDescription>
        <Token token={token1} label={token1} />
      </FlexBox>
      <Spacer marginTop="1rem" />
      <FlexBox>
        <SharedDescription>{isNativeToken ? bnbPrice : bustPrice}</SharedDescription>
        <Token token={token2} label={token2} />
      </FlexBox>
      {/* <FlexBox>
        <SharedDescription>{isNativeToken ?  : bustPrice}</SharedDescription>
        <Token token={token2} label={token2} />
      </FlexBox> */}
      <Spacer marginTop="2rem" />
      <FlexBox>
        <Button width="49%" onClick={() => {
          if(isNativeToken){
            approveLPtoken("PAIR_NATIVE")
          }else{
            approveLPtoken("PAIR")
          }
          }}>Approve</Button>
        <Button width="49%" onClick={()=>{
         removeLiq()
        }}>Remove</Button>
      </FlexBox>
    </Card>
  )
}

export default RemoveLiquidity
