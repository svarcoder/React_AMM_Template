import { useWeb3React } from "@web3-react/core"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ABI } from "../../../../blockchain/abi/Abi"
import { useGetBalance } from "../../../../blockchain/helperMethods/useGetBalance"
import { tokens } from "../../../../blockchain/tokens"
import { Button } from "../../../../shared/button"
import Card from "../../../../shared/card"
import Collapse from "../../../../shared/collapse"
import { validateAndTrim } from "../../../../shared/helpers/util"
import { IconButton, Spacer, Text } from "../../../../shared/shared"
import SwapInput from "../../../../shared/swapInput"
import { FlexRow } from "../../../../styles/styled"
import SwapSetting from "../swapSetting"
import { useSwap } from "./hook/useSwap"

const Swap: React.FC = () => {
  const [ticker1, setTicker1] = useState<string>(tokens["RST"].name)
  const [ticker2, setTicker2] = useState<string>(tokens["BUST"].name)
  const [token1Approved, setToken1Approved] = useState<boolean>(false)
  const [token2Approved, setToken2Approved] = useState<boolean>(false)
  const [switchSwap, setSwitchSwap] = useState<boolean | undefined>()
  const [token0, setToken0] = useState<string | number | undefined>("")
  const [token1, setToken1] = useState<string | number | undefined>("")
  const [token0InitalImpact, setToken0InitialImpact] = useState<
    string | number | undefined
  >("1")
  const [token1InitialImpact, setToken1InitialImpact] = useState<
    string | number | undefined
  >("1")
  const [token0Address, setToken0Address] = useState<string>(
    ABI[ticker1].address
  )
  const [token1Address, setToken1Address] = useState<string>(
    ABI[ticker2].address
  )
  const [token0Balance, setToken0Balance] = useState<string>("0")
  const [token1Balance, setToken1Balance] = useState<string>("0")
  const [swappingUI, setSwappingUI] = useState<boolean>(false)
  const [inputBoxCheck, setInputBoxCheck] = useState<number>(-1)
  const globalSelector = useSelector((state: any) => state)
  const { slippage, deadline, bnbBalance } = globalSelector.slippageReducer
  const { getOtherTokenPrice, swap } = useSwap()
  const { account, library } = useWeb3React()
  const { getBalance } = useGetBalance()

  useEffect(() => {
    if (account && library) {
      fetchBalance()
    }
    getOtherTokenInitialValue(ticker1)
    setToken0Address(ABI[ticker1].address)
    setToken1Address(ABI[ticker2].address)
  }, [account, library, ticker1, ticker2])

  const fetchBalance = async () => {
    try {
      if (account) {
        const token0 = await getBalance(account, ticker1, library)
        const token1 = await getBalance(account, ticker2, library)
        setToken0Balance(token0)
        setToken1Balance(token1)
      }
    } catch (err) {
      console.error("fetchBalance", err)
    }
  }

  const changingInputVal0 = async (
    val: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!swappingUI) {
      setInputBoxCheck(0)
    } else {
      setInputBoxCheck(1)
    }
    const value: any = validateAndTrim(val, 19)
    setToken0(value)
    const res = await getOtherTokenPrice(value, token0Address, token1Address)
    if (res) setToken1(res)
    else setToken1("")
  }

  const changingInputVal1 = async (
    val: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!swappingUI) {
      setInputBoxCheck(1)
    } else {
      setInputBoxCheck(0)
    }
    const value: any = validateAndTrim(val, 19)
    setToken1(value)
    const res = swappingUI
      ? await getOtherTokenPrice(value, token0Address, token1Address)
      : await getOtherTokenPrice(value, token1Address, token0Address)
    if (res) setToken0(res)
    else setToken0("")
  }

  const getOtherTokenInitialValue = async (tokenType: string) => {
    try {
      if (tokenType === ticker1) {
        setToken0InitialImpact(1)
        console.log({ token0Address, token1Address })

        const res = await getOtherTokenPrice(1, token0Address, token1Address)
        if (res) setToken1InitialImpact(Number(res).toFixed(2))
      } else {
        setToken1InitialImpact(1)
        const res = await getOtherTokenPrice(1, token0Address, token1Address)
        if (res) setToken0InitialImpact(Number(res).toFixed(2))
      }
    } catch (err) {
      console.error("getOtherTokenInitialValue", err)
    }
  }

  useEffect(() => {
    if (swappingUI) {
      getOtherTokenInitialValue(ticker2)
    } else {
      getOtherTokenInitialValue(ticker1)
    }

    const swapValues = async () => {
      if (swappingUI) {
        const res = await getOtherTokenPrice(
          token1,
          token0Address,
          token1Address
        )
        if (res) setToken0(res)
        else setToken0("")
      } else {
        const res = await getOtherTokenPrice(
          token0,
          token0Address,
          token1Address
        )
        if (res) setToken1(res)
        else setToken1("")
      }
    }
    if (token0) swapValues()
  }, [token0Address, token1Address])

  const onSwapTokensPlaces = async () => {
    const tempToken1Address = token1Address
    setToken1Address(token0Address)
    setToken0Address(tempToken1Address)
    setSwappingUI((prev) => !prev)
  }

  const handleSwap = async () => {
    if (Number(token0) && Number(token1) && account) {
      const res = await swap(
        account,
        token0,
        token1,
        token0Address,
        token1Address,
        token0Address == ABI[ticker1].address ? ticker1 : ticker2,
        slippage,
        deadline,
        library,
        ticker1,
        ticker2,
        inputBoxCheck
      )

      if (res) {
        await fetchBalance()
      }
    }
  }

  return (
    <Card title='Swap' rightComponent={<SwapSetting />}>
      <SwapInput
        position='top'
        switchSwap={switchSwap}
        token={ticker1}
        inputValue={token0}
        onChangeInput={changingInputVal0}
        onTokenChange={(token) => setTicker1(token)}
        balance={ticker1 === "WBNB" ? bnbBalance : token0Balance}
        swapTokenList={Object.values(tokens).filter(
          (val) => val.name !== ticker2
        )}
        onMaxButtonClick={() => setToken0(token0Balance)}
        showModalList
      />

      <Spacer marginTop='1rem' marginBottom='1rem'>
        <IconButton
          switchSwap={switchSwap}
          onClick={() => {
            setSwitchSwap(!switchSwap)
            onSwapTokensPlaces()
          }}
          src={require("../../../../assets/icons/down-icon.svg")}
        />
      </Spacer>

      <SwapInput
        position='bottom'
        switchSwap={switchSwap}
        token={ticker2}
        inputValue={token1}
        onChangeInput={changingInputVal1}
        onTokenChange={(token) => setTicker2(token)}
        balance={ticker2 === "WBNB" ? bnbBalance : token1Balance}
        swapTokenList={Object.values(tokens).filter(
          (val) => val.name !== ticker1
        )}
        onMaxButtonClick={() => {
          setToken1(token1Balance)
        }}
        showModalList
      />

      <Spacer marginTop='2rem' />

      <Collapse
        header={
          <Text variants='h6'>
            {!swappingUI
              ? `${token0InitalImpact} ${ticker1} = ${token1InitialImpact} ${ticker2}`
              : `${token1InitialImpact} ${ticker2} = ${token0InitalImpact} ${ticker1}`}
          </Text>
        }>
        <FlexRow justifyContent={`space-between`}>
          <Text variants='normal'>Expected Output </Text>
          <Text variants='normal'>1{ticker2}</Text>
        </FlexRow>
        <Spacer marginTop='0.5rem' />
        <FlexRow justifyContent={`space-between`}>
          <Text variants='normal'>Price Impact</Text>
          <Text variants='normal'>0.03%</Text>
        </FlexRow>
      </Collapse>
      <Spacer marginTop='1rem' />

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
          onClick={() => {
            if (account) handleSwap()
          }}>
          Swap
        </Button>
      )}
    </Card>
  )
}

export default Swap
