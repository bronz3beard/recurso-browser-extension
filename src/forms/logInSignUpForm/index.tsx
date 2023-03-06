import React, {
  FC,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'
import {
  AuthResponse,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
} from '@supabase/supabase-js'
import { supabase } from '@src/lib/supabaseClient'
import { objectHasAttributes } from '@src/utils/commonFunctions'
import { PrimaryButton } from '@src/components/common/button'
import Input from '@src/components/common/input'
import useForm, { FormSubmitValues } from '@src/hooks/useForm'
import { authInput, LogInSignUpFormInputValues } from './helpers'


type FormErrorTemplate = {
  email: string
  password: string
}

type LogInSignUpProps = {
  setUser: Dispatch<SetStateAction<User | undefined>>
}

const LogInSignUpForm:FC<LogInSignUpProps> = ({ setUser }: LogInSignUpProps) => {
  const [loading, setLoading] = useState(false)

  const {
    errors,
    formData: inputData,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: authInput(),
    async onSubmit({ formData, error, formType }: FormSubmitValues<LogInSignUpFormInputValues>) {
      const { email, password } = formData
      if (formType === 'signUp') {
        // setNotifyToast({
        //   seconds: 10,
        //   showNotification: true,
        //   title: 'Please confirm your address.',
        //   position: LocationPosition.right,
        //   emojiPosition: EmojiPosition.left,
        //   message: `Check your email or (junk)email`,
        // })
      }

      if (error && objectHasAttributes(error)) {
        return
      } else {
        try {
          setLoading(true)

          const authFields: SignInWithPasswordCredentials = {
            email: email.value as string,
            password: password.value as string,
          }

          const supabaseAuthType = async (): Promise<AuthResponse> => formType === 'signIn'
            ? supabase.auth.signInWithPassword(authFields as unknown as SignInWithPasswordCredentials)
            : supabase.auth.signUp(authFields as unknown as SignUpWithPasswordCredentials)

          const { data, error } = await supabaseAuthType()
          setUser(!data.user ? undefined : data.user)

          if (error) {
            throw error
          }
        } catch (error: any) {
          console.error(
            '🚀 ~ file: index.tsx ~ line 64 ~ onSubmit ~ error',
            error,
          )
          alert(error.error_description || error.message)
        } finally {
          setLoading(false)
        }
      }
    },

    validate(formData: LogInSignUpFormInputValues) {
      const errors: FormErrorTemplate = {} as FormErrorTemplate

      if (!formData.email.value) {
        errors.email = 'Please enter your email'
      }

      if (!formData.password.value || formData.password.value.length < 6) {
        errors.password = 'Please enter a password with 6 or more characters'
      }

      return errors
    },
  })

  // const { email, password } = inputData
  const validationErrors: FormErrorTemplate = errors as FormErrorTemplate

  // const handleSignUp = (event: MouseEvent<HTMLButtonElement>) => {
  //   handleSubmit(event)
  // }

  // const handleSignIn = (event: MouseEvent<HTMLButtonElement>) => {
  //   handleSubmit(event)
  // }


  return (
    <>
      <div className="relative max-w-sm mx-auto">
        <Input
          {...{
            required: true,
            id: "email",
            type: "email",
            name: "email",
            placeholder: "",
            inputMode: "text",
            value: inputData.email.value,
            onChange: handleChange,
            className: "block rounded-t-lg px-2.5 pb-2.5 pt-6 w-full text-base text-gray-200 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-colour peer"
          }}
        />
        <label
          htmlFor="email"
          className="absolute text-xl text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
        >
          Email<span className="text-primary-colour ml-0.5">*</span>
        </label>
      </div>
      <div className="relative max-w-sm mx-auto">
        <Input
          {...{
            id: "password",
            placeholder: "",
            type: "password",
            name: "password",
            inputMode: "text",
            onChange: handleChange,
            value: inputData.password.value,
            autoComplete: "password",
            className: "block rounded-t-lg px-2.5 pb-2.5 pt-6 w-full text-base text-gray-200 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-colour peer"
          }}
        />
        <label
          htmlFor="password"
          className="absolute text-xl text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
        >
          Password<span className="text-primary-colour ml-0.5">*</span>
        </label>
      </div>
      <div className="flex flex-wrap max-w-sm m-auto items-center justify-around pt-4">
        <PrimaryButton
          {...{
            type: "submit",
            width: "w-36",
            height: "h-16",
            id: "signUp",
            text: "Create Account",
            buttonPadding: "p-1",
            textColour: "text-white",
            onClick: handleSubmit,
            buttonClass: "flex flex-row items-center text-white font-medium rounded-lg",
            backgroundColor: "bg-secondary-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour"
          }}
        />
        <PrimaryButton
          {...{
            type: "submit",
            width: "w-36",
            height: "h-16",
            id: "signIn",
            text: 'Sign In',
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
          {validationErrors.email}
        </p>
        <p className="text-white text-lg text-center">
          {validationErrors.password}
        </p>
      </div>
    </>
  )
}

export default LogInSignUpForm
