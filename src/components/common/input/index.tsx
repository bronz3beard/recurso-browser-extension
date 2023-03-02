import React, { FC, ChangeEvent, MouseEvent, FocusEvent } from 'react'

// TODO:: maybe break this up into smaller more specific input types

type InputProps = Readonly<{
  id: string
  min?: number
  max?: number
  step?: number | string
  type:
    | 'text'
    | 'search'
    | 'email'
    | 'tel'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | 'password'
    | 'checkbox'
    | undefined
  list?: string
  value?: string | number
  checked?: boolean
  disabled?: boolean
  orient?: string
  className?: string
  required?: boolean
  name: string
  placeholder?: string
  style?: object
  autoComplete?: string
  role?: string
  hasPCIPII?: boolean
  dataAttribute?: number | string
  pciID?: string
  piiID?: string
  pattern?: string
  inputMode:
    | 'text'
    | 'search'
    | 'email'
    | 'tel'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | undefined
  autoFocus?: boolean
  tabIndex?: number
}>

type InputEventProps = {
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void
  onClick?: (event: MouseEvent<HTMLInputElement>) => void
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void
  onMouseUp?: (event: MouseEvent<HTMLInputElement>) => void
  onMouseDown?: (event: MouseEvent<HTMLInputElement>) => void
  onMouseOut?: (event: MouseEvent<HTMLInputElement>) => void
  onMouseOver?: (event: MouseEvent<HTMLInputElement>) => void
}

const Input: FC<InputProps & InputEventProps> = (
  props: InputProps & InputEventProps,
) => {
  const { pciID, piiID, disabled, hasPCIPII, className, dataAttribute } = props
  // personal credit information means absolutely no data.
  // personally identifiable information, this one is contextual/grey area.
  const privacyId = !pciID ? piiID : pciID

  return (
    <input
      disabled={disabled}
      className={className}
      data-attribute={`${dataAttribute}${hasPCIPII ? ` ${privacyId}` : ''}`}
      {...props}
    />
  )
}

Input.defaultProps = {
  id: '',
  min: 0,
  max: 100,
  step: 1,
  type: 'text',
  list: '',
  orient: 'horizontal',
  placeholder: '',
  style: {},
  checked: false,
  disabled: false,
  autoFocus: false,
  inputMode: 'text',
  pattern: '',
  className:
    'p-1 px-2 shadow-sm border-gray-300 rounded-md text-black font-bold text-base',
  required: false,
  onChange: () => {
    return
  },
  onClick: () => {
    return
  },
  onInput: () => {
    return
  },
  onFocus: () => {
    return
  },
  onBlur: () => {
    return
  },
  onMouseUp: () => {
    return
  },
  onMouseDown: () => {
    return
  },
  onMouseOut: () => {
    return
  },
  onMouseOver: () => {
    return
  },
  autoComplete: 'off',
}
export default Input
