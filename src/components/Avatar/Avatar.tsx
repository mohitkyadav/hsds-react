import * as React from 'react'

import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import propConnect from '../PropProvider/propConnect'
import StatusDot from '../StatusDot'
import Icon from '../Icon'

import { getEasingTiming } from '../../utilities/easing'
import { classNames } from '../../utilities/classNames'
import { nameToInitials } from '../../utilities/strings'

import AvatarCrop from './Avatar.Crop'
import AvatarImage from './Avatar.Image'
import { AvatarProps, AvatarState } from './Avatar.types'

import {
  ActionUI,
  AvatarButtonUI,
  AvatarUI,
  BorderAnimationUI,
  CircleAnimationUI,
  CropBorderUI,
  FocusUI,
  OuterBorderUI,
  StatusUI,
  config,
  getCircleProps,
} from './styles/Avatar.css'

import { COMPONENT_KEY, getImageSrc } from './Avatar.utils'

export class Avatar extends React.PureComponent<AvatarProps, AvatarState> {
  static defaultProps = {
    actionable: false,
    actionIcon: 'trash',
    actionIconSize: '24',
    active: false,
    animation: true,
    animationDuration: 160,
    animationEasing: 'ease',
    borderColor: 'transparent',
    fallbackImage: null,
    light: false,
    name: '',
    outerBorderColor: 'transparent',
    showStatusBorderColor: false,
    size: 'md',
    shape: 'circle',
    style: {},
    withShadow: false,
  }

  src: string[]

  state = {
    imageLoaded: false,
  }

  constructor(props) {
    super(props)
    this.src = getImageSrc(props)
  }

  componentWillReceiveProps(newProps) {
    const imageHasChanged = newProps.image !== this.props.image
    const fallbackHasChanged =
      newProps.fallbackImage !== this.props.fallbackImage
    if (imageHasChanged || fallbackHasChanged) {
      this.src = getImageSrc(newProps)
    }
  }

  onImageLoadedError = () => {
    this.props.onError && this.props.onError()
  }

  onImageLoadedSuccess = () => {
    this.setState({
      imageLoaded: true,
    })

    this.props.onLoad && this.props.onLoad()
  }

  getShapeClassNames = (): string => {
    const { shape, size } = this.props

    return classNames(shape && `is-${shape}`, size && `is-${size}`)
  }

  renderAction() {
    const {
      actionable,
      actionIcon,
      actionIconSize,
      removingAvatarAnimation,
    } = this.props

    if (!actionable || removingAvatarAnimation) {
      return null
    }

    const actionClassName = classNames(
      'c-Avatar__action',
      this.getShapeClassNames()
    )

    return (
      <ActionUI data-cy="Avatar.Action" className={actionClassName}>
        <Icon name={actionIcon} size={actionIconSize} />
      </ActionUI>
    )
  }

  renderCrop = () => {
    const {
      animationDuration,
      animationEasing,
      animation,
      name,
      withShadow,
      fallbackImage,
      removingAvatarAnimation,
      light,
    } = this.props

    const shapeClassnames = this.getShapeClassNames()

    const title = this.getTitle()
    return (
      <AvatarCrop
        className={shapeClassnames}
        isImageLoaded={this.state.imageLoaded}
        withShadow={withShadow}
      >
        <AvatarImage
          animation={animation}
          animationDuration={animationDuration}
          animationEasing={animationEasing}
          className={classNames('c-Avatar__imageMainWrapper', shapeClassnames)}
          src={this.src}
          name={name}
          title={title}
          light={light}
          onError={this.onImageLoadedError}
          onLoad={this.onImageLoadedSuccess}
        />
        {removingAvatarAnimation && (
          <AvatarImage
            animation={false}
            className={classNames(
              'c-Avatar__imageStaticWrapper',
              shapeClassnames
            )}
            src={fallbackImage}
            name={name}
            title={title}
            light={light}
          />
        )}
        {this.renderAction()}
      </AvatarCrop>
    )
  }

  renderStatus = () => {
    const {
      borderColor,
      showStatusBorderColor,
      size,
      statusIcon,
      status,
    } = this.props

    const componentClassName = classNames(
      'c-Avatar__status',
      this.getShapeClassNames(),
      statusIcon && 'is-withStatusIcon',
      showStatusBorderColor && 'is-withBorder'
    )

    return (
      status && (
        <StatusUI className={componentClassName}>
          <StatusDot
            icon={statusIcon}
            outerBorderColor={showStatusBorderColor ? borderColor : undefined}
            size={size === 'lg' ? 'md' : 'sm'}
            status={status}
          />
        </StatusUI>
      )
    )
  }

  getTitle() {
    const { count, initials, name } = this.props

    return count || initials || nameToInitials(name)
  }

  renderCropBorder = () => {
    const { borderColor, shape } = this.props
    const componentClassName = classNames(
      'c-Avatar__cropBorder',
      shape && `is-${shape}`
    )

    return (
      <CropBorderUI className={componentClassName} borderColor={borderColor} />
    )
  }

  renderOuterBorder = () => {
    const { outerBorderColor, shape } = this.props
    const componentClassName = classNames(
      'c-Avatar__outerBorder',
      shape && `is-${shape}`
    )

    return (
      <OuterBorderUI
        className={componentClassName}
        borderColor={outerBorderColor}
      />
    )
  }

  renderFocusBorder = () => {
    const { shape, onRemoveAnimationEnd, size } = this.props

    const componentClassName = classNames(
      'c-Avatar__focusBorder',
      shape && `is-${shape}`
    )

    const borderAnimationClassName = classNames(
      'c-Avatar__borderAnimation',
      this.getShapeClassNames()
    )

    const sz = config.size[size].size
    const { size: svgSize, ...circleProps } = getCircleProps(sz)

    return [
      <FocusUI
        key="focusBorder"
        data-cy="Avatar.FocusBorder"
        className={componentClassName}
      />,
      <BorderAnimationUI
        key="borderAnimation"
        className={borderAnimationClassName}
        data-cy="Avatar.BorderAnimation"
      >
        <CircleAnimationUI
          id="anime"
          onAnimationEnd={onRemoveAnimationEnd}
          {...circleProps}
        />
      </BorderAnimationUI>,
    ]
  }

  getStyles() {
    const { animationDuration, animationEasing, style } = this.props

    return {
      ...style,
      transition: `width ${animationDuration}ms ${getEasingTiming(
        animationEasing
      )},
      height ${animationDuration}ms ${getEasingTiming(animationEasing)}`,
    }
  }

  render() {
    const {
      actionable,
      active,
      borderColor,
      className,
      count,
      image,
      name,
      light,
      initials,
      onLoad,
      outerBorderColor,
      showStatusBorderColor,
      removingAvatarAnimation,
      size,
      shape,
      status,
      statusIcon,
      withShadow,
      fallbackImage,
      onActionClick,
      ...rest
    } = this.props

    const componentClassName = classNames(
      'c-Avatar',
      borderColor && 'has-borderColor',
      statusIcon && 'has-statusIcon',
      light && 'is-light',
      active && 'is-active',
      outerBorderColor && 'has-outerBorderColor',
      status && `is-${status}`,
      actionable && `has-action`,
      removingAvatarAnimation && 'is-animating',
      this.getShapeClassNames(),
      className
    )

    const Component = actionable ? AvatarButtonUI : AvatarUI

    const extraProps = actionable ? { onClick: onActionClick } : {}

    return (
      <Component
        {...getValidProps(rest)}
        data-cy="Avatar"
        className={componentClassName}
        style={this.getStyles()}
        title={name}
        {...extraProps}
      >
        {this.renderCrop()}
        {this.renderStatus()}
        {this.renderCropBorder()}
        {this.renderOuterBorder()}
        {actionable && this.renderFocusBorder()}
      </Component>
    )
  }
}

const PropConnectedComponent = propConnect(COMPONENT_KEY)(Avatar)

export default PropConnectedComponent
