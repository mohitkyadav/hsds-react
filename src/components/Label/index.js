// @flow
import React from 'react'
import Text from '../Text'
import { stateTypes } from '../../constants/propTypes'
import classNames from '../../utilities/classNames'
import { isString } from '../../utilities/is'
import type { UIState } from '../../constants/types'

type Props = {
  className?: string,
  children?: any,
  for: string,
  state?: UIState,
}

const Label = (props: Props) => {
  const { className, children, for: htmlFor, state, ...rest } = props

  const componentClassName = classNames(
    'c-Label',
    state && `is-${state}`,
    className
  )

  const contentMarkup = isString(children) ? (
    <Text className="c-Label__text" faint>
      {children}
    </Text>
  ) : (
    children
  )

  return (
    <label className={componentClassName} htmlFor={htmlFor} {...rest}>
      {contentMarkup}
    </label>
  )
}

export default Label
