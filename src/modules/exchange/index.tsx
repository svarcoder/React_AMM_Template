import { useLocation, useParams } from "react-router-dom"
import { liquidityPath, rootPath } from "../../logic/paths"
import { Spacer } from "../../shared/shared"
import TabButton from "../../shared/tabButton"
import { FlexRow } from "../../styles/styled"
import AddLiquidity from "./components/addLiquidity"
import Liquidity from "./components/liquidity"
import RemoveLiquidity from "./components/removeLiquidity"
import Swap from "./components/swap"

const Exchange: React.FC = () => {
  const { pathname } = useLocation()
  const { token1, token2 } = useParams()

  const getPaths = () => {
    if (pathname === rootPath) {
      return <Swap />
    } else if (pathname.includes(liquidityPath) && (token1 || token2)) {
      return <AddLiquidity />
    } else if (pathname.includes("remove") && (token1 || token2)) {
      return <RemoveLiquidity />
    } else if (pathname === liquidityPath) {
      return <Liquidity />
    } else {
      return <div />
    }
  }

  return (
    <>
      <FlexRow justifyContent={`center`}>
        <TabButton to={rootPath} active={pathname === rootPath}>
          Swap
        </TabButton>
        <Spacer marginLeft='24px' />
        <TabButton to={liquidityPath} active={pathname.includes(liquidityPath)}>
          Liquidity
        </TabButton>
      </FlexRow>
      <Spacer marginTop='56px' />
      {getPaths()}
    </>
  )
}

export default Exchange
