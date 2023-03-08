import React, { FC, useEffect, useRef, useState } from 'react'
import { ActionMeta, GroupBase, SingleValue } from 'react-select'
import { User } from '@supabase/supabase-js'
import { Topic, Resource } from '@src/types'
import { supabase } from '@src/lib/supabaseClient'
import { objectHasAttributes } from '@src/utils/commonFunctions'
import { assertIsTrue } from '@src/utils/valueCheckers'
import { OptionType } from '@src/components/common/dropDown'
import useForm from '@src/hooks/useForm'
import AsyncReactSelect, { SelectType } from '@src/components/common/dropDown/asyncDropDown'
import Input from '@src/components/common/input'
import { PrimaryButton } from '@src/components/common/button'
import { ResourceFormInputValues, resourceInput } from './helpers'
import Select from 'react-select/dist/declarations/src/Select'

type FormErrorTemplate = {
  topic: string
  linkUrl: string
  description: string
}

type AddResourceFormProps = {
  user: User | undefined
}

const AddResourceForm:FC<AddResourceFormProps> = ({ user }: AddResourceFormProps) => {
  const [counter, setCounter] = useState<number>(5)
  const [newRecordConfirmation, setNewRecordConfirmation] = useState<boolean>(false)
  const [topicName, setTopicName] = useState<SingleValue<OptionType>>()
  const [isNewTopic, setIsNewTopic] = useState<boolean>(false)

  const selectInputRef =
    useRef<Select<OptionType, false, GroupBase<OptionType>>>(null)

  const {
    errors,
    formData: inputData,
    handleChange,
    handleSubmit,
    setFormData
  } = useForm<ResourceFormInputValues>({
    initialValues: resourceInput(),
    async onSubmit({ formData, error, formType }) {
      if (error && objectHasAttributes(error)) {
        return
      } else {
        try {
          assertIsTrue(!!user, 'We need a user to add a new resource')

          const existingTopic = {
            ...topicName,
            id: topicName?.value
          }
          let topic: Topic = existingTopic as unknown as Topic

          if (isNewTopic) {
            const { data, error } = await supabase
              .from('topic')
              .insert({ topic_name: topicName?.label, user_id: user.id }).select()

            if (error) {
              console.error(
                '🚀 ~ file: index.tsx ~ line 70 ~ onSubmit ~ error',
                error,
              )
              throw error
            }

            assertIsTrue(
              !!data,
              'Response for Topic insert is empty array',
            )

            topic = { ...topic, id: data[0].id }
          }
          
          assertIsTrue(
            topic !== undefined,
            'We need a topic to add a new resource',
          )

          setNewRecordConfirmation(true)

          const payload: Partial<Resource> = {
            link_url: formData.linkUrl.value,
            topic_id: topic.id,
            description: formData.description.value,
            user_id: user.id,
            email: user.email,
          }

          const { data, error } = await supabase.from('resource').insert({ ...payload }).select()

          assertIsTrue(!error)

          if (!error && data?.length) {
            selectInputRef?.current?.clearValue()
            setTopicName(null)
            setFormData(resourceInput())
          }
        } catch (error: any) {
          console.error(
            '🚀 ~ file: index.tsx ~ line 64 ~ onSubmit ~ error',
            error,
          )

          if (error.code === '23505') {
            alert('This Topic already exists in your stash')
          } else {
            alert(error.error_description || error.message)
          }
        }
      }
    },

    validate(formData) {
      const { linkUrl } = formData
      const errors: FormErrorTemplate = {} as FormErrorTemplate

      if (!topicName) {
        errors.topic = 'Please enter a topic!'
      }

      if (linkUrl.value) {
        if (linkUrl.value.includes('http://')) {
          errors.linkUrl = 'Please enter a "https://" url!'
        }
      }

      return errors
    },
  })

  const handleTopicAsyncSelectChange = (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => {
    const newValueIsNewTopic: boolean =
      actionMeta.action === 'create-option' ? true : false

    setIsNewTopic(newValueIsNewTopic)
    setTopicName(newValue)
  }

  const { linkUrl, description } = inputData
  const validationErrors: FormErrorTemplate = errors as FormErrorTemplate

  useEffect(() => {
    if (newRecordConfirmation) {
      const intervalId = setInterval(() =>
        setCounter((prevState) => prevState > 0 ? prevState - 1 : 0), 1000)

      return () => clearInterval(intervalId)
    }
  }, [newRecordConfirmation]);
  
  useEffect(() => {
    const getCurrentTab = async () => {
      chrome.tabs.query({ currentWindow: true, active: true }, async function(tabs) {      
        setFormData({
          ...inputData,
          linkUrl: {
            ...linkUrl,
            value: tabs[0].url ?? '',
          },
          description: {
            ...description,
            value: tabs[0].title ?? ''
          }
        })
      });
    }

    getCurrentTab()
  }, [])

  return (
    <>
      <div className="relative max-w-sm mx-auto">
        <AsyncReactSelect
          {...{
            user,
            tabIndex: 1,
            selectInputRef,
            filterValue: topicName,
            className: "text-base peer",
            selectType: SelectType.TOPIC,
            handleAsyncSelectChange: handleTopicAsyncSelectChange
          }}
        />
        <label
          htmlFor="async-select"
          className="absolute text-xl text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
        >
          Enter a topic<span className="text-primary-colour ml-0.5">*</span>
        </label>
      </div>
      <div className="relative max-w-sm mx-auto">
        <Input
        {...{
          required: true,
          type: "url",
          tabIndex: 2,
          id: "linkUrl",
          placeholder: "",
          name: "linkUrl",
          autoFocus: false,
          pattern: "https://*",
          inputMode: "text",
          value: linkUrl.value,
          onChange: handleChange,
          className: "block rounded-t-lg px-2.5 pb-2.5 pt-6 w-full text-base text-gray-200 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-colour peer"
        }}
        />
        <label
          htmlFor="linkUrl"
          className="absolute text-xl text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
        >
          {linkUrl.label}<span className="text-primary-colour ml-0.5">*</span>
        </label>
      </div>
      <div className="relative max-w-sm mx-auto">
        <Input
        {...{
          type: "text",
          tabIndex: 3,
          placeholder: "",
          inputMode: "text",
          id: "description",
          name: "description",
          autoFocus: false,
          onChange: handleChange,
          value: description.value,
          className: "block rounded-t-lg px-2.5 pb-2.5 pt-6 w-full text-base text-gray-200 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-colour peer"
        }}
        />
        <label
          htmlFor="description"
          className="absolute text-xl text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
        >
          {description.label}
        </label>
      </div>
      <div className="flex flex-wrap max-w-sm m-auto items-center justify-end pt-4">
        <PrimaryButton
          {...{
            type: "submit",
            width: "w-36",
            height: "h-16",
            id: "save",
            text: "Add to Stash",
            buttonPadding: "p-1",
            textColour: "text-white",
            onClick: handleSubmit,
            buttonClass: "flex flex-row items-center text-white font-medium rounded-lg",
            backgroundColor: "bg-secondary-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour"
          }}
        />
      </div>
      <div className="flex flex-col">
        <p className="text-white text-lg text-center">
          {validationErrors.topic}
        </p>
        <p className="text-white text-lg text-center">
          {validationErrors.linkUrl}
        </p>
        {newRecordConfirmation && Boolean(counter) && (
          <p className="text-white text-xl2 text-center">
            New Record Added to your stash!
          </p>
        )}
      </div>
    </>
  )
}

export default AddResourceForm
