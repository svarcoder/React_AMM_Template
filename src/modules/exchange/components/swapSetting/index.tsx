import { useDispatch, useSelector } from "react-redux"
import { setDeadline, setSlippage } from "../../../../logic/redux/actions/actions"
import { Button } from "../../../../shared/button"
import Card from "../../../../shared/card"
import { validateAndTrim } from "../../../../shared/helpers/util"
import useComponentVisible from "../../../../shared/hooks/useComponentVisible"
import { IconButton, Spacer, Text } from "../../../../shared/shared"
import { StyledInput } from "../../../../shared/styledInput"
import { FlexRow } from "../../../../styles/styled"
import { colors } from "../../../../styles/theme"
import { SwapSettingCard } from "./style"


const SwapSetting = () => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
  const dispatch = useDispatch()
  const globalSelector = useSelector((state: any) => state)
  const { slippage, deadline } = globalSelector.slippageReducer

  const onChangeSlippage = (val: React.ChangeEvent<HTMLInputElement>) => {
    const value: any = validateAndTrim(val, 3)
    if (value !== "" && Number(value) >= 0 && Number(value) <= 50) {
      dispatch(setSlippage(value))
    } else if (value == "") {
      dispatch(setSlippage(""))
    }
  }

  const onChangeDeadline = (val: React.ChangeEvent<HTMLInputElement>) => {
    const value: any = validateAndTrim(val, 3)
    if (value !== "" && Number(value) >= 0 && Number(value) <= 20) {
      dispatch(setDeadline(value))
    } else if (value == "") {
      dispatch(setDeadline(""))
    }
  }

  return (
    <SwapSettingCard>
      <IconButton
        onClick={() => {
          setIsComponentVisible(!isComponentVisible)
        }}
        src={require("../../../../assets/icons/setting-icon.svg")}
      />

      <div className="settingCard" ref={ref}>
        {isComponentVisible && (
          <Card
            backgroundColor={colors.darkNavy}
            title="Transaction Setting"
            titleFontVariant="h6"
            cardMaxWidth={400}>
            <Text variants="normal">Slippage Setting</Text>
            <Spacer marginBottom="0.5rem" />
            <FlexRow>
              <Button>Auto</Button>
              <StyledInput value={slippage} onChange={onChangeSlippage} />
            </FlexRow>
            <Spacer marginTop="1rem" />
            <Text variants="normal">Deadline</Text>
            <Spacer marginBottom="0.5rem" />
            <FlexRow>
              <Button>Auto</Button>
              <StyledInput value={deadline} onChange={onChangeDeadline} />
            </FlexRow>
          </Card>
        )}
      </div>
    </SwapSettingCard>
  )
}

export default SwapSetting
