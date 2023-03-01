import React, {
  FC,
  useState,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from 'react'
import {
  AuthResponse,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
} from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import { objectHasAttributes } from '../../utils/commonFunctions'
import { PrimaryButton } from '../common/button'
import Input from '../common/input'
import useForm from '../../hooks/useForm'

type FormErrorTemplate = {
  email: string
  password: string
}

type LogInSignUpProps = {
  setUser: Dispatch<SetStateAction<User | undefined>>
}

const LogInSignUp:FC<LogInSignUpProps> = ({ setUser }: LogInSignUpProps) => {
  const [loading, setLoading] = useState(false)
  console.log("🚀 ~ file: index.tsx:33 ~ loading:", loading)

  const {
    errors,
    formData,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: {
      email: {
        value: '',
        label: 'Email',
        placeholder: 'Enter your email',
      },
      password: {
        value: '',
        label: 'Password',
        placeholder: 'Enter your password',
      },
    },
    async onSubmit({ formData, error, formType }) {
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
              email: email.value,
              password: password.value,
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

    validate(formData) {
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

  const { email, password, resetPW } = formData
  const validationErrors: FormErrorTemplate = errors as FormErrorTemplate

  const handleSignUp = (event: MouseEvent<HTMLButtonElement>) => {
    handleSubmit(event)
  }

  const handleSignIn = (event: MouseEvent<HTMLButtonElement>) => {
    handleSubmit(event)
  }


  return (
    <div className="">
      <div className="flex flex-wrap w-full justify-center items-start space-y-4 mt-10">
        <div className="fixed w-full h-full top-1/2 transform -translate-y-1/2 overflow-hidden p-4 bg-theme-grey lg:space-y-5 space-y-6 pb-7 rounded-lg shadow-2xl">
          <div className="mx-auto overflow-hidden p-4 bg-theme-grey lg:space-y-5 space-y-6 pb-7">
          <div className="w-full my-2">
            <h1 className="font-light text-white text-center">Recurso</h1>
          </div>
            <div className="relative max-w-sm mx-auto">
              <Input
                required
                id="email"
                type="email"
                name="email"
                placeholder=""
                inputMode="text"
                value={email.value}
                onChange={handleChange}
                className="block w-full p-2 px-2 shadow-sm border-gray-300 rounded-md text-black font-bold text-base appearance-none focus:outline-none"
              />
              <label
                htmlFor="email"
                className="absolute left-2 lg:top-2 top-3 z-0 duration-300 origin-0 text-black text-base"
              >
                Email*
              </label>
            </div>
            <div className="relative h-10 max-w-sm mx-auto">
              <Input
                id="password"
                placeholder=""
                type="password"
                name="password"
                inputMode="text"
                onChange={handleChange}
                value={password.value}
                autoComplete="password"
                className="block w-full p-2 px-2 shadow-sm border-gray-300 rounded-md text-black font-bold text-base appearance-none focus:outline-none"
              />
              <label
                htmlFor="password"
                className="absolute left-2 lg:top-2 top-3 z-0 duration-300 origin-0 text-black text-base"
              >
                Password*
              </label>
            </div>
            <div className="flex flex-wrap max-w-sm m-auto items-center justify-around">
              <PrimaryButton
                type="submit"
                width="w-36"
                height="h-8"
                id="signUp"
                text="Create Account"
                buttonPadding="p-1"
                textColour="text-white"
                onClick={handleSignUp}
                buttonClass="flex flex-row items-center bg-secondary-colour hover:bg-contrast-colour active:bg-gray-300 text-white font-medium rounded-lg"
              />
              <PrimaryButton
                type="submit"
                width="w-36"
                height="h-8"
                id="signIn"
                text='Sign In'
                buttonPadding="p-1"
                textColour="text-white"
                onClick={handleSignIn}
                buttonClass="flex flex-row items-center bg-secondary-colour hover:bg-contrast-colour active:bg-gray-300 text-white font-medium rounded-lg"
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogInSignUp
