import React from 'react'
import PropTypes from 'prop-types'

import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import Illo from '../Illo'
import { classNames } from '../../utilities/classNames'

import { BlankSlateUI, HeadingUI, TextUI, IlloUI } from './BlankSlate.css'

const getIllo = ({ illo, illoName, illoSize }) => {
  let content = null

  if (illo) {
    content = illo
  } else if (illoName) {
    content = <Illo name={illoName} size={illoSize} />
  }

  return content ? <IlloUI>{content}</IlloUI> : content
}

class BlankSlate extends React.PureComponent {
  static defaultProps = {
    lightBackground: false,
    alignTop: false,
    illoSize: 80,
  }

  render() {
    const {
      className,
      children,
      illo,
      illoName,
      illoSize,
      title,
      message,
      lightBackground,
      alignTop,
      ...rest
    } = this.props

    const componentClassName = classNames(
      'c-BlankSlate',
      lightBackground ? 'with-light-background' : '',
      alignTop ? 'align-top' : '',
      className
    )

    return (
      <BlankSlateUI {...getValidProps(rest)} className={componentClassName}>
        {getIllo({ illo, illoName, illoSize })}
        {title && <HeadingUI size="h3">{title}</HeadingUI>}
        {message && <TextUI>{message}</TextUI>}
      </BlankSlateUI>
    )
  }
}

BlankSlate.propTypes = {
  /** Will aligned to the top the content of the component */
  alignTop: PropTypes.bool,
  /** Custom class names to be added to the component. */
  className: PropTypes.string,
  /** An instance of an Illo Component */
  illo: React.ReactNode,
  /** DEPRECATED. Name of the illustration, from the Illo component. */
  illoName: PropTypes.string,
  /** DEPRECATED. Size of the illustration, from the Illo component. */
  illoSize: PropTypes.number,
  /** Will add a light background to the component */
  lightBackground: PropTypes.bool,
  /** Message displayed in the content area. Can be HTML */
  message: PropTypes.any,
  /** Title displayed in the content area */
  title: PropTypes.string,
}

export default BlankSlate
