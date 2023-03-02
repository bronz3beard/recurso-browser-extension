import React, { FC, useEffect, useState } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import {
  OptionsOrGroups,
  GroupBase,
  ActionMeta,
  SingleValue,
} from 'react-select'
import { supabase, SupaBaseFetchError } from '@src/lib/supabaseClient'
import {
  getUniqueArrayObjects,
  reactSelectOptions,
} from '../../../utils/commonFunctions'
import { assertIsTrue } from '../../../utils/valueCheckers'
import { OptionType } from '.'
import { User } from '@supabase/supabase-js'

export enum SelectType {
  TOPIC,
  GROUP,
}

type AsyncReactSelectProps = {
  tabIndex: number
  user: User | undefined
  selectType: SelectType
  className?: string
  filterValue: SingleValue<OptionType> | undefined
  handleAsyncSelectChange: (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => void
}

const AsyncReactSelect: FC<AsyncReactSelectProps> = ({ 
    user,
    tabIndex,
    filterValue,
    selectType, 
    handleAsyncSelectChange,
    className = 'block w-full text-lg text-white appearance-none focus:outline-none',
  }: AsyncReactSelectProps,
) => {
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout>()
  const [error, setError] = useState<SupaBaseFetchError | null>(null)
  const [placeHolder, setPlaceHolder] = useState<SingleValue<OptionType>>({
    value: 0,
    label: 'Search or Select',
  })

  const getLabelOption = (item: OptionType): string => item.label

  const getValueOption = (item: OptionType): string => `${item.value}`

  useEffect(
    function addPlaceholderText() {
      if (selectType === SelectType.TOPIC) {
        setPlaceHolder({
          value: 0,
          label: !filterValue?.label
            ? 'Search Topic'
            : filterValue.label,
        })
      }
      if (selectType === SelectType.GROUP) {
        setPlaceHolder({
          value: 0,
          label: !filterValue?.label
            ? 'Search or Select Group'
            : filterValue.label,
        })
      }
    },
    [filterValue],
  )

  const getOptions = async (
    searchValue: string,
  ): Promise<OptionsOrGroups<OptionType, GroupBase<OptionType>>> => {
    if (!searchValue) {
      return []
    }

    if (selectType === SelectType.TOPIC) {
      const { data: topic, error } = await supabase
        .from('topic')
        .select('topic_name, id')
        .like('topic_name', `%${searchValue}%`)

      if (error) {
        setError(error)
      }

      assertIsTrue(!!topic)

      const topics = reactSelectOptions(topic, 'id', 'topic_name')
      return topics
    }

    if (selectType === SelectType.GROUP && user) {
      const { data: group, error } = await supabase
        .from('resource_group')
        .select(
          `
          id,
          group_name,
          resource_id,
          topic_id,
          created_at,
          deleted_at
        `,
        )
        .is('deleted_at', null)
        .match({ user_id: user.id })
        .textSearch('group_name', `%${searchValue}%`)

      if (error) {
        setError(error)
      }

      assertIsTrue(!!group)
      const groups = reactSelectOptions(
        getUniqueArrayObjects(group, 'group_name'),
        'id',
        'group_name',
      )

      return groups
    }

    return []
  }

  const handleDropdownInput = (
    searchValue: string,
  ): void | Promise<OptionsOrGroups<OptionType, GroupBase<OptionType>>> => {
    if (searchTimer) {
      clearTimeout(searchTimer)
    }

    return new Promise(resolve =>
      setTimeout(() => resolve(getOptions(searchValue)), 2000),
    ) as Promise<OptionsOrGroups<OptionType, GroupBase<OptionType>>>
  }

  const handleInputChange = (value: string) => {
    return value
  }

  const handleChange = (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => {
    handleAsyncSelectChange(newValue, actionMeta)
  }

  return (
    <AsyncCreatableSelect<OptionType>
      tabIndex={tabIndex}
      autoFocus
      cacheOptions
      defaultOptions
      id="async-select"
      name="async-select"
      className={className}
      onChange={handleChange}
      getOptionLabel={getLabelOption}
      getOptionValue={getValueOption}
      onInputChange={handleInputChange}
      loadOptions={handleDropdownInput}
      components={{
        IndicatorSeparator: () => null,
        LoadingIndicator: () => null,
      }}
      placeholder={placeHolder?.label}
      styles={{
        control: (provided, state) => ({
          ...provided,
          color: '#fefefe',
          borderRadius: 0,
          padding: '0.5rem',
          boxShadow: "none",
          border: 'none',
          borderBottom: state.isFocused ? 'solid 2px #fb5607' : 'solid 2px #d1d5db',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          cursor: 'pointer',
          backgroundColor: '#374151',
          "&:hover": {
            borderBottom: 'solid 2px #fb5607',
          },
          // "&:acitve": {
          //   border: "solid 2px #fb5607",
          //   boxShadow: "0px 2px 0px #fb5607"
          // }
        }), 
        option: provided => ({
          ...provided,
          color: '#fefefe',
          backgroundColor: '#374151'
        }),
        singleValue: provided => ({
          ...provided,
          color: '#fefefe',
          backgroundColor: '#374151'
        }),
        input: (base, state) => ({
          ...base,
          color: '#fefefe'
        })
      }}
    />
  )
}

export default AsyncReactSelect
