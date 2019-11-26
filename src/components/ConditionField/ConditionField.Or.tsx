import * as React from 'react'
import Operator from '../Condition/Condition.Operator'
import { classNames } from '../../utilities/classNames'

export const Or = props => {
  const { className, ...rest } = props

  const componentClassName = classNames(Or.className, className)

  return (
    <div
      {...rest}
      className={componentClassName}
      data-cy="ConditionFieldOrWrapper"
    >
      <Operator data-cy={props['data-cy']} type="or" isBorderless={true} />
    </div>
  )
}

Or.defaultProps = {
  'data-cy': 'ConditionFieldOr',
}
Or.className = 'c-ConditionAnd'

export default Or
