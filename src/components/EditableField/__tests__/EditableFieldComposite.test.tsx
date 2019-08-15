import * as React from 'react'
import { cy } from '@helpscout/cyan'
import { mount } from 'enzyme'
import { EditableFieldComposite } from '../EditableFieldComposite'
import { EditableField } from '../EditableField'
import {
  COMPOSITE_CLASSNAMES,
  EDITABLEFIELD_CLASSNAMES,
  STATES_CLASSNAMES,
} from '../EditableField.utils'

describe('className', () => {
  test('Has default className', () => {
    const wrapper = cy.render(<EditableFieldComposite />)

    expect(wrapper.hasClass(COMPOSITE_CLASSNAMES.component)).toBeTruthy()
  })

  test('Can render custom className', () => {
    const customClassName = 'blue'
    const wrapper = cy.render(
      <EditableFieldComposite className={customClassName} />
    )

    expect(wrapper.hasClass(customClassName)).toBeTruthy()
  })
})

describe('Children', () => {
  test('Renders as many EditableFields as passed', () => {
    cy.render(
      <EditableFieldComposite>
        <EditableField name="city" />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const el = cy.get(`.${EDITABLEFIELD_CLASSNAMES.component}`)

    expect(el.length).toBe(2)
  })

  test('Sets inline mode on EditableFields', () => {
    cy.render(
      <EditableFieldComposite>
        <EditableField name="city" />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const el = cy.get(`.${STATES_CLASSNAMES.isInline}`)

    expect(el.length).toBe(2)
  })

  test('onInputFocus still gets executed if passed on an EditableField', () => {
    const spy = jest.fn()

    const wrapper = cy.render(
      <EditableFieldComposite>
        <EditableField name="city" onInputFocus={spy} />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const input = wrapper.find('input').first()

    input.focus()

    expect(spy).toHaveBeenCalled()
  })

  test('onInputFocus still gets executed if passed on an EditableField', () => {
    const spy = jest.fn()

    const wrapper = cy.render(
      <EditableFieldComposite>
        <EditableField name="city" onInputFocus={spy} />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const input = wrapper.find('input').first()

    input.focus()

    expect(spy).toHaveBeenCalled()
  })

  test('onInputBlur still gets executed if passed on an EditableField', () => {
    const spy = jest.fn()

    const wrapper = cy.render(
      <EditableFieldComposite>
        <EditableField name="city" onInputBlur={spy} />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const input = wrapper.find('input').first()

    input.blur()

    expect(spy).toHaveBeenCalled()
  })

  test('onInputChange still gets executed if passed on an EditableField', () => {
    const spy = jest.fn()

    const wrapper = cy.render(
      <EditableFieldComposite>
        <EditableField name="city" onInputChange={spy} />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const input = wrapper.find('input').first()
    input.type('hello')

    expect(spy).toHaveBeenCalled()
  })

  // test('onEnter still gets executed if passed on an EditableField', () => {
  //   const spy = jest.fn()

  //   const wrapper = cy.render(
  //     <EditableFieldComposite>
  //       <EditableField name="city" onEnter={spy} />
  //       <EditableField name="country" />
  //     </EditableFieldComposite>
  //   )

  //   const input = wrapper.find('input').first()
  //   input.type('{enter}')

  //   expect(spy).toHaveBeenCalled()
  // })

  // test('onEscape still gets executed if passed on an EditableField', () => {
  //   const spy = jest.fn()

  //   const wrapper = cy.render(
  //     <EditableFieldComposite>
  //       <EditableField name="city" onEscape={spy} />
  //       <EditableField name="country" />
  //     </EditableFieldComposite>
  //   )

  //   const input = wrapper.find('input').first()
  //   input.type('{esc}')

  //   expect(spy).toHaveBeenCalled()
  // })
})

describe('Composite Mask', () => {
  test('Renders the composed value of the fields as mask', () => {
    cy.render(
      <EditableFieldComposite>
        <EditableField name="city" value="Barcelona" />
        <EditableField name="country" value="Spain" />
      </EditableFieldComposite>
    )

    const el = cy.get(`.${COMPOSITE_CLASSNAMES.mask}`)
    const maskItems = cy.get(`.${COMPOSITE_CLASSNAMES.maskItem}`)

    expect(el.text()).toBe(`Barcelona${'\u00a0'}Spain`)
    expect(maskItems.length).toBe(2)
  })

  test('Renders the placeholder if fields have no values as mask', () => {
    cy.render(
      <EditableFieldComposite placeholder="Add a place">
        <EditableField name="city" />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const el = cy.get(`.${COMPOSITE_CLASSNAMES.mask}`)
    const maskPlaceholder = cy.get(`.${STATES_CLASSNAMES.isPlaceholder}`)

    expect(el.text()).toBe('Add a place')
    expect(maskPlaceholder.length).toBe(1)
  })

  test('Renders fields values as mask even if not all present', () => {
    cy.render(
      <EditableFieldComposite placeholder="Add a place">
        <EditableField name="city" value="Barcelona" />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const mask = cy.get(`.${COMPOSITE_CLASSNAMES.mask}`)
    const maskItems = cy.get(`.${COMPOSITE_CLASSNAMES.maskItem}`)

    expect(mask.text()).toBe('Barcelona')
    expect(maskItems.length).toBe(1)
  })

  test('Renders fields values as mask even if not all present (2)', () => {
    cy.render(
      <EditableFieldComposite placeholder="Add a place">
        <EditableField name="city" />
        <EditableField name="country" value="Spain" />
      </EditableFieldComposite>
    )

    const el = cy.get(`.${COMPOSITE_CLASSNAMES.mask}`)

    expect(el.text()).toBe('Spain')
  })

  test('Renders the composed value of the fields with custom separator as mask', () => {
    cy.render(
      <EditableFieldComposite separator=",">
        <EditableField name="city" value="Barcelona" />
        <EditableField name="country" value="Spain" />
      </EditableFieldComposite>
    )

    const el = cy.get(`.${COMPOSITE_CLASSNAMES.mask}`)

    expect(el.text()).toBe(`Barcelona,${'\u00a0'}Spain`)
  })
})

describe('Active Fields', () => {
  test('Sets active fields state on focus', () => {
    const wrapper = mount(
      <EditableFieldComposite>
        <EditableField name="city" value="Barcelona" />
        <EditableField name="country" value="Spain" />
      </EditableFieldComposite>
    )
    const input = wrapper.find('input').first()

    input.simulate('focus')

    expect(wrapper.state('inputState')).toBe('focused')
    expect(wrapper.state('hasActiveFields')).toBeTruthy()
  })

  test('Sets active fields state to blurred', () => {
    const wrapper = mount(
      <EditableFieldComposite>
        <EditableField name="city" value="Barcelona" />
        <EditableField name="country" value="Spain" />
      </EditableFieldComposite>
    )
    const input = wrapper.find('input').first()

    input.simulate('focus')
    input.simulate('blur')

    expect(wrapper.state('inputState')).toBe('blurred')
  })

  test('Mask should be hidden when active fields state on', () => {
    const wrapper = mount(
      <EditableFieldComposite>
        <EditableField name="city" value="Barcelona" />
        <EditableField name="country" value="Spain" />
      </EditableFieldComposite>
    )
    const input = wrapper.find('input').first()

    input.simulate('focus')

    expect(
      wrapper
        .find(`.${COMPOSITE_CLASSNAMES.mask}`)
        .first()
        .hasClass(STATES_CLASSNAMES.isHidden)
    ).toBeTruthy()
  })
})

describe('Large size', () => {
  test('Sets large size', () => {
    const wrapper = cy.render(
      <EditableFieldComposite size="lg">
        <EditableField name="city" value="Barcelona" />
        <EditableField name="country" value="Spain" />
      </EditableFieldComposite>
    )

    expect(wrapper.hasClass(STATES_CLASSNAMES.isLarge)).toBeTruthy()
  })
})

describe('Enter and Escape keypress', () => {
  test('onEnter removes active state', () => {
    const wrapper = mount(
      <EditableFieldComposite>
        <EditableField name="city" />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const input = wrapper.find('input').first()
    input.simulate('keydown', { key: 'Enter' })

    expect(wrapper.state('inputState')).toBe(null)
    expect(wrapper.state('hasActiveFields')).toBeFalsy()
  })

  test('onEnter sets mask tabindex and focus it', () => {
    const spy = jest.fn()

    const wrapper = mount(
      <EditableFieldComposite>
        <EditableField name="city" onEnter={spy} />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const input = wrapper.find('input').first()
    input.simulate('keydown', { key: 'Enter' })

    expect(
      wrapper
        .find(`.${COMPOSITE_CLASSNAMES.mask}`)
        .first()
        .getDOMNode()
        .getAttribute('tabindex')
    ).toBe('0')

    expect(document.activeElement).toBe(
      wrapper
        .find(`.${COMPOSITE_CLASSNAMES.mask}`)
        .first()
        .getDOMNode()
    )
    expect(spy).toHaveBeenCalled()
  })

  test('onEscape sets mask tabindex and focus it', () => {
    const spy = jest.fn()

    const wrapper = mount(
      <EditableFieldComposite>
        <EditableField name="city" onEscape={spy} />
        <EditableField name="country" />
      </EditableFieldComposite>
    )

    const input = wrapper.find('input').first()
    input.simulate('keydown', { key: 'Escape' })

    expect(
      wrapper
        .find(`.${COMPOSITE_CLASSNAMES.mask}`)
        .first()
        .getDOMNode()
        .getAttribute('tabindex')
    ).toBe('0')

    expect(document.activeElement).toBe(
      wrapper
        .find(`.${COMPOSITE_CLASSNAMES.mask}`)
        .first()
        .getDOMNode()
    )
    expect(spy).toHaveBeenCalled()
  })
})
