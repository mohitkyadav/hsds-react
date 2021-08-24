import styled from 'styled-components'
import { getColor } from '../../styles/utilities/color'

export const HeaderUI = styled('header')`
  width: 100%;
  height: 125px;
  padding: 30px;
  background-color: #fff;
  transition: box-shadow 0.5s;
  z-index: 3;

  &.with-shadow {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 0 5px rgba(0, 0, 0, 0.05);
  }

  .SidePanel__Heading {
    margin: 10px 0 4px 0;
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    color: ${getColor('charcoal.700')};
  }

  .SidePanel__Subheading {
    margin: 0;
    font-size: 13px;
    line-height: 19px;
    color: ${getColor('charcoal.300')};
  }
`

export const BodyUI = styled('div')`
  width: 100%;
  background-color: transparent;
  flex-grow: 1;
  padding: 18px;
  overflow: auto;
`

export const FooterUI = styled('footer')`
  width: 100%;
  height: 90px;
  padding: 20px;
  background-color: #fff;
  transition: box-shadow 0.5s;
  z-index: 3;

  &.with-shadow {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 0 5px rgba(0, 0, 0, 0.05);
  }

  .c-Button {
    width: 100%;
  }
`
