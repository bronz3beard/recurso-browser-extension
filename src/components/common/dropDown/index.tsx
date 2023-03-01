import React, { FC } from 'react'
import Select, { ActionMeta, SingleValue } from 'react-select'

export type OptionType = { label: string; value: number }

type ReactSelectProps = {
  placeholder: string
  value: SingleValue<OptionType> | undefined
  optionList: OptionType[]
  handleSelectChange: (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => void
}

const ReactSelect: FC<ReactSelectProps> = (props: ReactSelectProps) => {
  const { value, placeholder, optionList, handleSelectChange } = props

  const getLabelOption = (item: OptionType): string => item.label

  const getValueOption = (item: OptionType): string => `${item.value}`

  const handleChange = (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => {
    handleSelectChange(newValue, actionMeta)
  }

  return (
    <Select<OptionType>
      isClearable
      isSearchable
      value={value}
      options={optionList}
      backspaceRemovesValue
      onChange={handleChange}
      placeholder={placeholder}
      getOptionLabel={getLabelOption}
      getOptionValue={getValueOption}
      className="block w-full text-base text-black appearance-none focus:outline-none"
    />
  )
}

export default ReactSelect
