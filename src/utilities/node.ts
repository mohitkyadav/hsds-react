import closest from './closest'
import get from './get'
import { isNodeEnv } from './other'

type Node = HTMLElement | any
type Scope = Node | Document
const Element = window['Element']

export const isNodeElement = (node: Scope): boolean => {
  return (
    node &&
    (node instanceof Element ||
    node.nodeType === 1 || // Thanks Brett! <3
      node === document)
  )
}

export const getNodeScope = (nodeScope: Scope): Scope => {
  return nodeScope && isNodeElement(nodeScope)
    ? nodeScope
    : nodeScope === window
      ? window
      : document
}

export const applyStylesToNode = (node: Node, styles: Object = {}): Node => {
  if (!node) return false
  if (!isNodeElement(node)) return node
  if (typeof styles !== 'object') return node

  Object.keys(styles).forEach((prop: number | string) => {
    const value = styles[prop]
    node.style[prop] =
      typeof value === 'number' && prop !== 'zIndex' ? `${value}px` : value
  })

  return node
}

export const parseFloatValue = (value: string | null): number =>
  parseFloat(value || '0')

export const getComputedHeightProps = (
  node: Node
): { height: number; offset: number } => {
  if (!isNodeElement(node))
    return {
      height: 0,
      offset: 0,
    }

  const el = node !== document ? node : document.body
  const height = el.offsetHeight

  const {
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
  } = window.getComputedStyle(el)

  // Adjust for node environments (for testing purposes)
  let offset = parseFloatValue(marginTop) + parseFloatValue(marginBottom)
  /* istanbul ignore next */
  if (!isNodeEnv()) {
    offset =
      offset + parseFloatValue(paddingTop) + parseFloatValue(paddingBottom)
  }

  return {
    height,
    offset,
  }
}

export const getComputedWidthProps = (
  node: Node
): { width: number; offset: number } => {
  if (!isNodeElement(node))
    return {
      width: 0,
      offset: 0,
    }

  const el = node !== document ? node : document.body
  const width = el.offsetWidth

  const {
    marginLeft,
    marginRight,
    paddingLeft,
    paddingRight,
  } = window.getComputedStyle(el)

  // Adjust for node environments (for testing purposes)
  let offset = parseFloatValue(marginLeft) + parseFloatValue(marginRight)
  /* istanbul ignore next */
  if (!isNodeEnv()) {
    offset =
      offset + parseFloatValue(paddingLeft) + parseFloatValue(paddingRight)
  }

  return {
    width,
    offset,
  }
}

export const getComputedOffsetTop = (node: Node): number => {
  if (!isNodeElement(node)) return 0
  const offset = getComputedHeightProps(document).offset
  return node.getBoundingClientRect().top + offset / 2
}

export const getComputedOffsetLeft = (node: Node): number => {
  if (!isNodeElement(node)) return 0
  const offset = getComputedWidthProps(document).offset
  return node.getBoundingClientRect().left + offset / 2
}

export const getViewportHeight = (scope?: Scope): number => {
  const node = getNodeScope(scope)
  const { height, offset } = getComputedHeightProps(node)

  /* istanbul ignore next */
  // Tested one case, but cannot test the other in JSDOM
  return height > window.innerHeight ? height : window.innerHeight - offset
}

export const getViewportWidth = (scope?: Scope): number => {
  const node = getNodeScope(scope)
  const { width, offset } = getComputedWidthProps(node)

  /* istanbul ignore next */
  // Tested one case, but cannot test the other in JSDOM
  return width > window.innerWidth ? width : window.innerWidth - offset
}

/**
 * Checks if node is visible with the view (a node Element or window). This is typically used for scroll interactions.
 * Note: This function currently only measures vertical scroll-based
 * calculations.
 *
 * @param     options   object    Config object
 * @option    node      Element   DOM node to check visibility for
 * @option    scope     Element   DOM node to check visibility within
 * @option    offset    number    Top buffer amount for visiblity check
 * @option    complete  bool      node must be in complete view, if true
 * @return    bool                True/False if node is in view
 */
export const isNodeVisible = (options: {
  node: Node
  scope: Scope
  offset: number
  complete: boolean
}) => {
  if (!options || typeof options !== 'object') return false
  const { node, scope, offset, complete } = options

  if (!isNodeElement(node)) return false

  let nodeOffset = offset !== undefined ? offset : 0
  nodeOffset =
    typeof nodeOffset !== 'number' ? 0 : nodeOffset < 0 ? 0 : nodeOffset

  const nodeScope = getNodeScope(scope || window)
  const isWindow = nodeScope === window
  const bufferOffset = 4 // To account for potential borders on the nodeScope

  const rect = node.getBoundingClientRect()
  /* istanbul ignore next */
  // Tested, but JSDOM + Istanbul cannot account for offsetTop.
  const offsetTop = isNodeEnv() ? rect.top : node.offsetTop

  const viewportHeight = isWindow
    ? window.innerHeight
    : nodeScope.getBoundingClientRect().height
  const viewportTop = isWindow ? window.scrollY : nodeScope.scrollTop
  const viewportBottom = isWindow
    ? window.innerHeight
    : viewportTop + viewportHeight + bufferOffset

  const bottom = offsetTop + rect.height
  const top = complete && nodeOffset === 0 ? bottom : bottom - nodeOffset

  return (
    parseInt(top, 10) <= parseInt(viewportBottom, 10) &&
    parseInt(bottom, 10) >= parseInt(viewportTop, 10)
  )
}

export const getScrollParent = (node: Node): Node => {
  /* istanbul ignore else */
  if (!isNodeElement(node)) {
    return null
  }
  /* istanbul ignore next */
  // Cannot be tested in JSDOM. scrollHeight and clientHeight do not exist.
  if (node.scrollHeight > node.clientHeight) {
    return node
  } else {
    return getScrollParent(node.parentNode)
  }
}

export const isNodeScrollable = (node: Node): boolean => {
  /* istanbul ignore next */
  // Cannot be tested in JSDOM. scrollHeight and clientHeight do not exist.
  return node && isNodeElement(node)
    ? node.scrollHeight > node.clientHeight
    : false
}

export const getClosestDocument = (node: Node): Node => {
  return node && isNodeElement(node) ? node.ownerDocument : document
}

export const hasContentOverflowX = (node: Node): boolean => {
  // Cannot be tested in JSDOM (missing measurements for props)
  /* istanbul ignore else */
  if (!isNodeElement(node)) return false
  /* istanbul ignore next */
  return node.clientWidth < node.scrollWidth
}

export const hasContentOverflowY = (node: Node): boolean => {
  // Cannot be tested in JSDOM (missing measurements for props)
  /* istanbul ignore else */
  if (!isNodeElement(node)) return false
  /* istanbul ignore next */
  return node.clientHeight < node.scrollHeight
}

export const getClosestNode = (node: Node, selector: string): Node => {
  if (!isNodeElement(node)) return null
  if (typeof selector !== 'string') return null
  return closest(node, selector)
}

/**
 * Enhanced wrapper for Node.scrollIntoViewIfNeeded()
 *
 * @param   {Node} node
 * @returns {Node}
 */
export const scrollIntoView = (node: Node) => {
  if (!isNodeElement(node)) return
  if (node['scrollIntoViewIfNeeded']) return node.scrollIntoViewIfNeeded()
  /* istanbul ignore else */
  if (node['scrollIntoView']) return node.scrollIntoView()
}

export const getWindowFromNode = (node: Node) => {
  if (!isNodeElement(node)) return window
  return get(node, 'ownerDocument.defaultView', window)
}
