import styled from "styled-components"
import { colors } from "../../../styles/theme"

export const FarmInfo = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  column-gap: 1rem;
  background: ${colors.darkGrey};
  border-radius: 0.3rem;

  .grid-columns:first-child {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 1rem;
  }

  .grid-columns {
    padding: 1rem;
    border-radius: 0.3rem;
  }

  @media (max-width: 512px) {
    grid-template-columns: auto;
  }
`

export const Header = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  grid-gap: 1rem;
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 512px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
