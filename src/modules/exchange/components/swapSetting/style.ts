import styled from "styled-components"

export const SwapSettingCard = styled.div`
  position: relative;

  .settingCard {
    position: absolute;
    right: 0px;
    top: 60px;
    z-index: 2;

    @media (max-width: 512px) {
      right: -60px;
    }
  }
`
