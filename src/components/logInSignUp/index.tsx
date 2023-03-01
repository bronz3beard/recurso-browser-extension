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
    <>
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
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-base text-gray-200 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-colour peer"
        />
        <label
          htmlFor="email"
          className="absolute text-lg text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-primary-colour peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
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
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-base text-gray-200 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-colour peer"
        />
        <label
          htmlFor="password"
          className="absolute text-lg text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-primary-colour peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 select-none"
        >
          Password*
        </label>
      </div>
      <div className="flex flex-wrap max-w-sm m-auto items-center justify-around py-4">
        <PrimaryButton
          type="submit"
          width="w-36"
          height="h-16"
          id="signUp"
          text="Create Account"
          buttonPadding="p-1"
          textColour="text-white"
          onClick={handleSignUp}
          buttonClass="flex flex-row items-center text-white font-medium rounded-lg"
          backgroundColor="bg-secondary-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour"
        />
        <PrimaryButton
          type="submit"
          width="w-36"
          height="h-16"
          id="signIn"
          text='Sign In'
          buttonPadding="p-1"
          textColour="text-white"
          onClick={handleSignIn}
          buttonClass="flex flex-row items-center text-white font-medium rounded-lg"
          backgroundColor="bg-secondary-colour hover:bg-secondary-contrast-colour active:bg-secondary-contrast-colour"
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

export default LogInSignUp
