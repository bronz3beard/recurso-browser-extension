import React, { FC } from 'react'
// import { Link } from 'react-router-dom'
import { ButtonProps, ButtonEventProps } from './index'

const PrimaryButton: FC<ButtonProps & ButtonEventProps> = (
  props: ButtonProps & ButtonEventProps,
) => {
  const {
    id,
    text,
    type,
    label,
    name,
    disabled,
    url,
    height,
    width,
    buttonClass,
    containerClassName,
    childContainerClass,
    children,
    target,
    dataAttribute,
    pciID,
    piiID,
    hasPCIPII,
    textColour,
    buttonPadding,
    borderRadius,
    backgroundColor,
    onClick,
    onMouseUp,
    onMouseDown,
  } = props
  // personal credit information means absolutely no data.
  // personally identifiable information, this one is contextual/grey area.
  const privacyId = !pciID ? piiID : pciID

  return (
    <div className={containerClassName}>
      {type === 'link' && url ? (
        <a id={id} href={url} target={target} className={buttonClass}>
          {text || children}
        </a>
      ) : (
        <>
          <button
            id={id}
            name={name}
            onClick={onClick}
            disabled={disabled}
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}
            type={!type ? 'button' : 'submit'}
            className={`${buttonClass} ${height} ${width} ${buttonPadding} ${borderRadius} ${backgroundColor} ${
              disabled ? 'bg-opacity-70 pointer-events-none' : ''
            }`}
            data-attribute={`${dataAttribute}${
              hasPCIPII ? ` ${privacyId}` : ''
            }`}
          >
            <span className={`${childContainerClass} ${textColour}`}>
              {text || children}
            </span>
          </button>
          {label && (
            <label htmlFor={name} className="">
              {label}
            </label>
          )}
        </>
      )}
    </div>
  )
}

PrimaryButton.defaultProps = {
  id: '',
  url: '',
  type: 'button', // 'button', 'submit', 'reset', 'link'
  containerClassName: '',
  label: '',
  disabled: false,
  target: '_self', // '_blank', '_self'
  name: 'button',
  pciID: 'suppress_flag_pci',
  piiID: 'suppress_flag_pii',
  hasPCIPII: false,
  dataAttribute: '',
  textColour: 'text-white',
  buttonPadding: 'p-2',
  height: 'h-10',
  width: 'lg:w-56 w-40',
  borderRadius: 'rounded-lg',
  backgroundColor:
    'bg-contrast-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour',
  childContainerClass:
    'w-full items-center static text-center not-italic tracking-tight font-base text-xs lg:text-base px-2',
  buttonClass:
    'flex flex-row items-center border-opacity-10 text-white font-medium',
  onClick: () => {
    return
  },
  onMouseUp: () => {
    return
  },
  onMouseDown: () => {
    return
  },
}

export default PrimaryButton
