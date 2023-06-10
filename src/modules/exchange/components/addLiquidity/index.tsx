import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ABI } from "../../../../blockchain/abi/Abi"
import { useGetBalance } from "../../../../blockchain/helperMethods/useGetBalance"
import { tokens } from "../../../../blockchain/tokens"
import { Button } from "../../../../shared/button"
import Card from "../../../../shared/card"
import Collapse from "../../../../shared/collapse"
import { bustRstPairArray, validateAndTrim, wbnbRstPairArray } from "../../../../shared/helpers/util"
import { IconButton, Spacer, Text } from "../../../../shared/shared"
import SwapInput from "../../../../shared/swapInput"
import { FlexRow } from "../../../../styles/styled"
import SwapSetting from "../swapSetting"
import { useAddLiquidity } from "./hook/useAddLiquidity"

const AddLiquidity = () => {
  const [ticker1, setTicker1] = useState(tokens["BUST"].name)
  const [ticker2, setTicker2] = useState(tokens["RST"].name)
  const [token1Approved, setToken1Approved] = useState<boolean>(false)
  const [token2Approved, setToken2Approved] = useState<boolean>(false)
  const [token0, setToken0] = useState<string | number | undefined>("")
  const [token1, setToken1] = useState<string | number | undefined>("")
  const { getToken1Amount, getToken0Amount, getToken1Amount_ETH, getToken0Amount_ETH, addLiquidity, addLiquidityEth } = useAddLiquidity()
  const { active, account, library } = useWeb3React()
  const globalSelector = useSelector((state: any) => state)
  const { slippage, deadline, bnbBalance } = globalSelector.slippageReducer
  const { getBalance } = useGetBalance()
  const [token0Balance, setBalance0] = useState(0)
  const [token1Balance, setBalance1] = useState(0)

  useEffect(() => {
    if (account && library) {
      fetchBalance()
    }
  }, [account, library, ticker1, ticker2])

  const fetchBalance = async () => {
    try {
      if (account) {
        const token0 = await getBalance(account, ticker1, library)
        const token1 = await getBalance(account, ticker2, library)
        setBalance0(token0)
        setBalance1(token1)
      }
    } catch (err) {
      console.error("fetchBalance", err)
    }
  }

  const changingInputVal0 = async (
    val: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value: any = validateAndTrim(val, 19)
    setToken0(value)
    let res;
    if (bustRstPairArray.includes(ticker1) && bustRstPairArray.includes(ticker2)) {
      res = ticker1 === tokens["BUST"].name ? await getToken1Amount(value) : await getToken0Amount(value)
    } else if (wbnbRstPairArray.includes(ticker1) && wbnbRstPairArray.includes(ticker2)) {
      res = ticker1 === tokens["WBNB"].name ? await getToken1Amount_ETH(value) : await getToken0Amount_ETH(value)
    }
    if (res) setToken1(res)
    else setToken1("")
  }

  const changingInputVal1 = async (
    val: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value: any = validateAndTrim(val, 19)
    setToken1(value)
    let res;
    if (bustRstPairArray.includes(ticker1) && bustRstPairArray.includes(ticker2)) {
      res = ticker2 === tokens["RST"].name ? await getToken0Amount(value) : await getToken1Amount(value)
    } else if (wbnbRstPairArray.includes(ticker1) && wbnbRstPairArray.includes(ticker2)) {
      res = ticker2 === tokens["WBNB"].name ? await getToken1Amount_ETH(value) : await getToken0Amount_ETH(value)
    }
    if (res) setToken0(res)
    else setToken0("")
  }

  const handleAddLiquidity = async () => {
    try {
      if (Number(token0) && Number(token1) && account && active && ticker1 !== "WBNB") {
        const res = await addLiquidity(account, token0, token1, ABI[ticker1].address, ABI[ticker2].address, deadline, slippage, library, ticker1, ticker2)
      } else {
        const res = await addLiquidityEth(account, token0, token1, ABI[ticker1].address, ABI[ticker2].address, deadline, slippage, library, ticker1, ticker2)
      }
    } catch (err) {
      console.error("handleAddLiquidity", err)
    }
  }

  return (
    <Card title="Liquidity" rightComponent={<SwapSetting />}>
      <SwapInput
        position='top'
        onTokenChange={(token) => setTicker1(token)}
        token={ticker1}
        showModalList
        inputValue={token0}
        balance={ticker1 === "WBNB" ? bnbBalance : token0Balance}
        onMaxButtonClick={() => setToken0(token0Balance)}
        onChangeInput={changingInputVal0}
        swapTokenList={Object.values(tokens).filter(
          (val) => val.name !== ticker2
        )}
      />
      <Spacer marginTop='1rem' marginBottom='1rem'>
        <IconButton
          onClick={() => { }}
          src={require("../../../../assets/icons/add-icon.svg")}
        />
      </Spacer>
      <SwapInput
        position='bottom'
        showModalList
        token={ticker2}
        onTokenChange={(token) => setTicker2(token)}
        inputValue={token1}
        balance={ticker2 === "WBNB" ? bnbBalance : token1Balance}
        onChangeInput={changingInputVal1}
        onMaxButtonClick={() => setToken1(token1Balance)}
        swapTokenList={Object.values(tokens).filter(
          (val) => val.name !== ticker1
        )}
      />
      <Spacer marginTop='2rem' />

      {ticker1 && ticker2 && (
        <>
          <Collapse header={<Text variants='h6'>Prices and pool share</Text>}>
            <FlexRow justifyContent={`space-between`}>
              <Text variants='normal'>
                {ticker1} per {ticker2}
              </Text>
              <Text variants='normal'>27.6021</Text>
            </FlexRow>
            <Spacer marginTop='0.5rem' />
            <FlexRow justifyContent={`space-between`}>
              <Text variants='normal'>
                {ticker2} per {ticker1}
              </Text>
              <Text variants='normal'>0.0362291</Text>
            </FlexRow>
            <Spacer marginTop='0.5rem' />
            <FlexRow justifyContent={`space-between`}>
              <Text variants='normal'>Share of Pool</Text>
              <Text variants='normal'>3.03%</Text>
            </FlexRow>
          </Collapse>
          <Spacer marginTop='2rem' />
        </>
      )}

      {!(token1Approved && token2Approved) && (
        <FlexRow>
          <Button
            fullWidth
            disabled={token1Approved}
            onClick={() => {
              setToken1Approved(true)
            }}>
            Approve {ticker1}
          </Button>
          <Spacer marginLeft='16px' />
          <Button
            fullWidth
            disabled={token2Approved}
            onClick={() => {
              setToken2Approved(true)
            }}>
            Approve {ticker2}
          </Button>
        </FlexRow>
      )}

      {token1Approved && token2Approved && (
        <Button
          disabled={Number(token0) && Number(token1) ? false : true}
          fullWidth
          align='center'
          onClick={handleAddLiquidity}>
          Supply
        </Button>
      )}
    </Card>
  )
}

export default AddLiquidity
