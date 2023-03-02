import React, { FC, useEffect, useState } from 'react'
import { ActionMeta, SingleValue } from 'react-select'
import { Topic, Resource } from '../../types'
import { supabase } from '../../lib/supabaseClient'
import { objectHasAttributes } from '../../utils/commonFunctions'
import { assertIsTrue } from '../../utils/valueCheckers'
import { PrimaryButton } from '../common/button'
import { OptionType } from '../common/dropDown'
import AsyncReactSelect, { SelectType } from '../common/dropDown/asyncDropDown'
import Input from '../common/input'
import useForm from '../../hooks/useForm'
import { User } from '@supabase/supabase-js'

type FormErrorTemplate = {
  topic: string
  linkUrl: string
  description: string
}

enum FormSection {
  TOPIC,
  RESOURCE,
}

type AddResourceFormProps = {
  user: User | undefined
}

const AddResourceForm:FC<AddResourceFormProps> = ({ user }: AddResourceFormProps) => {
  const [formSection, setFormSection] = useState<FormSection>(FormSection.RESOURCE)
  const [topic, setTopic] = useState<Topic | undefined>(undefined)
  const [topicName, setTopicName] = useState<SingleValue<OptionType>>()
  const [isNewTopic, setIsNewTopic] = useState<boolean>(false)

  const { errors, formData, handleChange, handleSubmit, setFormData } = useForm({
    initialValues: {
      linkUrl: {
        value: '',
        label: 'Add "https://" url',
      },
      description: {
        value: '',
        label: 'Add a description',
      },
    },
    async onSubmit({ formData, error, formType }) {
      if (error && objectHasAttributes(error)) {
        return
      } else {
        try {
          // if (formSection === FormSection.TOPIC) {
          //   if (isNewTopic) {
          //     assertIsTrue(!!user, 'We need a User to add a new topic')

          //     const { data, error } = await supabase
          //       .from('topic')
          //       .insert({ topic_name: topicName?.label, user_id: user.id })

          //     if (error) {
          //       console.error(
          //         '🚀 ~ file: index.tsx ~ line 70 ~ onSubmit ~ error',
          //         error,
          //       )
          //       throw error
          //     }

          //     assertIsTrue(
          //       !!data,
          //       'Response for Topic insert is empty array',
          //     )

          //     setTopic(data[0])
          //   } else {
          //     if (user && topicName) {
          //       setTopic({
          //         id: topicName.value,
          //         user_id: user.id,
          //         topic_name: topicName.label,
          //       })
          //     }
          //   }
          //   setFormSection(FormSection.RESOURCE)

          // } else {
            assertIsTrue(user !== null, 'We need a user to add a new resource')
            assertIsTrue(
              !!user?.email,
              'We need a user email to add a new resource',
            )
            if (isNewTopic) {
              assertIsTrue(!!user, 'We need a User to add a new topic')

              const { data, error } = await supabase
                .from('topic')
                .insert({ topic_name: topicName?.label, user_id: user.id })

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

              setTopic(data[0])
            } else {
              if (user && topicName) {
                setTopic({
                  id: topicName.value,
                  user_id: user.id,
                  topic_name: topicName.label,
                })
              }
            }

            assertIsTrue(
              topic !== undefined,
              'We need a topic to add a new resource',
            )

            const payload: Partial<Resource> = {
              link_url: formData.linkUrl.value,
              topic_id: topic.id,
              description: formData.description.value,
              user_id: user.id,
              email: user.email,
            }

            await addNewResource(payload)
          // }
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
      const errors: FormErrorTemplate = {} as FormErrorTemplate

      if (formSection === FormSection.TOPIC && !topicName) {
        errors.topic = 'Please enter a topic!'
      }

      if (formSection === FormSection.RESOURCE && !formData.linkUrl.value) {
        if (!formData.linkUrl.value.includes('https://')) {
          errors.linkUrl = 'Please enter a "https" url!'
        }
        errors.linkUrl = 'Please enter a valid url!'
      }

      return errors
    },
  })


  const { linkUrl, description } = formData
  const validationErrors: FormErrorTemplate = errors as FormErrorTemplate

  useEffect(() => {
    const getCurrentTab = async () => {
      chrome.tabs.query({ currentWindow: true, active: true }, async function(tabs){      
        setFormData({
          ...formData,
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

  const addNewResource = async (
    payload: Partial<Resource>,
  ): Promise<Partial<Resource> | undefined> => {
    try {
      const { data, error } = await supabase.from('resource').insert({ ...payload })

      if (error) {
        console.error(
          '🚀 ~ file: index.tsx ~ line 69 ~ onSubmit ~ error',
          error,
        )
        throw error
      }

      assertIsTrue(
        !data,
        'Response for adding new resource is empty array',
      )

      if (data) {
        console.log("🚀 ~ file: index.tsx:190 ~ data:", data)
        return data[0]
      }
    } catch (error: any) {
      console.error(
        '🚀 ~ file: index.tsx ~ line 245 ~ addNewResource ~ error',
        error,
      )
    }

  }

  const handleTopicAsyncSelectChange = (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => {
    const newValueIsNewTopic: boolean =
      actionMeta.action === 'create-option' ? true : false

    setIsNewTopic(newValueIsNewTopic)
    setTopicName(newValue)
  }

  return (
    <>
        <div className="relative max-w-sm mx-auto">
          <label
            htmlFor="topic"
            className="z-0 duration-300 origin-0 text-white text-lg select-none"
          >
            Enter a topic*
          </label>
          <AsyncReactSelect
            {...{
              user,
              tabIndex: 1,
              filterValue: topicName,
              selectType: SelectType.TOPIC, 
              handleAsyncSelectChange: handleTopicAsyncSelectChange,
              className: "block w-full text-base text-black appearance-none focus:outline-none border-gray-300 rounded-md font-bold"
            }}
          />
        </div>
        <div className="relative max-w-sm mx-auto">
          <Input
            required
            type="url"
            tabIndex={2}
            id="linkUrl"
            placeholder=""
            name="linkUrl"
            autoFocus={false}
            pattern="https://*"
            inputMode="text"
            value={linkUrl.value}
            onChange={handleChange}
            className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-base text-gray-200 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-colour peer"
          />
          <label
            htmlFor="linkUrl"
            className="absolute text-lg text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-primary-colour peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
          >
            {linkUrl.label}*
          </label>
        </div>
        <div className="relative max-w-sm mx-auto">
          <Input
            type="text"
            tabIndex={3}
            placeholder=""
            inputMode="text"
            id="description"
            name="description"
            autoFocus={false}
            onChange={handleChange}
            value={description.value}
            className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-base text-gray-200 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-colour peer"
          />
          <label
            htmlFor="description"
            className="absolute text-lg text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-primary-colour peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
          >
            {description.label}
          </label>
        </div>
      <div className="flex flex-wrap max-w-sm m-auto items-center justify-around py-1">
        {formSection === FormSection.TOPIC ? (
          <PrimaryButton
            type="submit"
            width="w-36"
            height="h-16"
            id="topic"
            text="Add Topic"
            buttonPadding="p-1"
            textColour="text-white"
            onClick={handleSubmit}
            buttonClass="flex flex-row items-center text-white font-medium rounded-lg"
            backgroundColor="bg-secondary-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour"
          />
        ) : (
          <PrimaryButton
            type="submit"
            width="w-36"
            height="h-16"
            id="save"
            text="Add to Stash"
            buttonPadding="p-1"
            textColour="text-white"
            onClick={handleSubmit}
            buttonClass="flex flex-row items-center text-white font-medium rounded-lg"
            backgroundColor="bg-secondary-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour"
          />
        )}
      </div>
      <div className="flex flex-col">
        {formSection === FormSection.TOPIC && (
          <p className="text-white text-lg text-center">
            {validationErrors.topic}
          </p>
        )}
        <p className="text-white text-lg text-center">
          {validationErrors.linkUrl}
        </p>
      </div>
    </>
  )
}

export default AddResourceForm
