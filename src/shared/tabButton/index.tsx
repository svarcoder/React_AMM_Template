import React from "react"
import { To } from "react-router-dom"
import { TabActiveStyled, TabButtonStyled } from "./style"

type Props = {
  to: To
  active: boolean
  children?: React.ReactNode
}

const TabButton = (props: Props) => {
  const { to, active, children } = props
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "12rem" }}>
      <TabButtonStyled to={to} active={active}>
        {children}
      </TabButtonStyled>
      <div style={{ height: "5px", width: "100%" }}>
        <TabActiveStyled active={active} />
      </div>
    </div>
  )
}

export default TabButton
