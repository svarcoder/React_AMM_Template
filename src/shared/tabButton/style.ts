import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { colors } from "../../styles/theme"

interface TabButtonProps {
  active?: boolean
}

export const TabButtonStyled = styled(Link)<TabButtonProps>`
  cursor: pointer;
  background-color: ${colors.gray};
  color: ${colors.blueDark};
  border-radius: 12px 12px 0px 0px;
  position: relative;
  padding: 1rem;
  text-align: center;
`

const tabActiveAnmation = ({ active }: TabButtonProps) => keyframes`
  0%{
    width: ${active ? "0%" : "100%"} ;
  }

  100%{
    width: ${!active ? "0%" : "100%"} ;
  };
`

export const TabActiveStyled = styled.div<TabButtonProps>`
  height: 100%;
  background: red;
  animation: ${(props) => tabActiveAnmation({ active: props.active })} linear
    0.3s;
  animation-fill-mode: forwards;
`
