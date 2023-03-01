import React, { FC, useState } from 'react'
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
  const [formSection, setFormSection] = useState<FormSection>(FormSection.TOPIC)
  const [topic, setTopic] = useState<Topic | undefined>(undefined)
  const [topicName, setTopicName] = useState<SingleValue<OptionType>>()
  const [isNewTopic, setIsNewTopic] = useState<boolean>(false)

  const { errors, formData, handleChange, handleSubmit } = useForm({
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
          if (formSection === FormSection.TOPIC) {
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
                console.log("🚀 ~ file: index.tsx:84 ~ onSubmit ~ topicName:", topicName)
                setTopic({
                  id: topicName.value,
                  user_id: user.id,
                  topic_name: topicName.label,
                })
              }
            }
            setFormSection(FormSection.RESOURCE)

          } else {
            assertIsTrue(user !== null, 'We need a user to add a new resource')
            assertIsTrue(
              !!user?.email,
              'We need a user email to add a new resource',
            )
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

  const addNewResource = async (
    payload: Partial<Resource>,
  ): Promise<Partial<Resource> | undefined> => {
    console.log("🚀 ~ file: index.tsx:76 ~ useFetchMethods ~ payload:", payload)
    try {
      const { data, error } = await supabase.from('resource').insert({ ...payload })
      console.log("🚀 ~ file: index.tsx:47 ~ useFetchMethods ~ data:", data)

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
        console.log("🚀 ~ file: index.tsx:96 ~ useFetchMethods ~ data:", data)
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


  const { linkUrl, description } = formData
  const validationErrors: FormErrorTemplate = errors as FormErrorTemplate

  return (
    <div className="flex flex-wrap w-full justify-center items-start space-y-4 mt-10">
      <div className="fixed w-full h-full top-1/2 transform -translate-y-1/2 overflow-hidden p-4 bg-theme-grey lg:space-y-5 space-y-6 pb-7 rounded-lg shadow-2xl">
        <div className="mx-auto p-4 bg-theme-grey lg:space-y-5 space-y-6 pb-7">
          <div className="w-full my-2">
            <h1 className="font-light text-white text-center">Recurso</h1>
          </div>
          {formSection === FormSection.TOPIC && (
            <div className="relative max-w-sm mx-auto">
              <label
                htmlFor="topic"
                className="z-0 duration-300 origin-0 text-white text-base"
              >
                Enter a topic*
              </label>
              <AsyncReactSelect
                {...{
                  user,
                  filterValue: topicName,
                  selectType: SelectType.TOPIC, 
                  handleAsyncSelectChange: handleTopicAsyncSelectChange,
                  className: "block w-full text-base text-black appearance-none focus:outline-none shadow-sm border-gray-300 rounded-md font-bold"
                }}
              />
            </div>
          )}
          {formSection === FormSection.RESOURCE && (
            <>
              <div className="relative max-w-sm mx-auto">
                <Input
                  required
                  autoFocus
                  type="url"
                  id="linkUrl"
                  placeholder=""
                  name="linkUrl"
                  pattern="https://*"
                  inputMode="text"
                  value={linkUrl.value}
                  onChange={handleChange}
                  className="block w-full p-2 px-2 shadow-sm rounded-md text-black font-bold text-base appearance-none focus:outline-none"
                />
                <label
                  htmlFor="linkUrl"
                  className="absolute left-2 lg:top-2 top-3 z-0 duration-300 origin-0 text-black text-base"
                >
                  {linkUrl.label}*
                </label>
              </div>
              <div className="relative max-w-sm mx-auto">
                <Input
                  autoFocus
                  type="text"
                  placeholder=""
                  id="description"
                  name="description"
                  inputMode="text"
                  onChange={handleChange}
                  value={description.value}
                  className="block w-full p-2 shadow-sm rounded-md text-black font-bold text-base appearance-none focus:outline-none"
                />
                <label
                  htmlFor="description"
                  className="absolute left-2 lg:top-2 top-3 z-0 duration-300 origin-0 text-black text-base"
                >
                  {description.label}
                </label>
              </div>
            </>
          )}
          <div className="flex flex-wrap max-w-sm mx-auto items-center justify-around mt-4 lg:space-y-0 md:space-y-2 space-y-2">
            {formSection === FormSection.TOPIC ? (
              <PrimaryButton
                type="submit"
                width="w-36"
                height="h-8"
                id="signUp"
                buttonPadding="p-1"
                textColour="text-white"
                onClick={handleSubmit}
                buttonClass="flex flex-row items-center bg-secondary-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour text-white font-medium rounded-lg"
              >
                Add Topic
              </PrimaryButton>
            ) : (
              <PrimaryButton
                type="submit"
                width="w-36"
                height="h-8"
                id="signIn"
                buttonPadding="p-1"
                textColour="text-white"
                onClick={handleSubmit}
                buttonClass="flex flex-row items-center bg-secondary-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour text-white font-medium rounded-lg"
              >
                Add to Stash
              </PrimaryButton>
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
        </div>
      </div>
    </div>
  )
}

export default AddResourceForm
