import { MouseEventHandler } from 'react'

export type ButtonProps = Readonly<{
  id?: string
  text?: string
  type: string
  name?: string
  label?: string
  height?: string
  width?: string
  disabled?: boolean
  url?: string
  hasIcon?: boolean
  containerClassName?: string
  childContainerClass?: string
  children?: React.ReactNode | JSX.Element
  target?: string
  buttonClass?: string
  isSecondary?: boolean
  secondaryButtonClass?: string
  buttonIconClass?: string
  hasPCIPII?: boolean
  dataAttribute?: number | string
  pciID?: string
  piiID?: string
  textColour?: string
  buttonPadding?: string
  borderRadius?: string
  backgroundColor?: string
}>

export type ButtonEventProps = {
  onMouseUp?: MouseEventHandler<HTMLButtonElement>
  onMouseDown?: MouseEventHandler<HTMLButtonElement>
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export { default as PrimaryButton } from './primary'
