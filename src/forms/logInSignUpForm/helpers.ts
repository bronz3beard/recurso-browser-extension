import { InputValues } from "@src/hooks/useForm"

export type LogInSignUpFormInputValues = {
    email: InputValues,
    password: InputValues,
}

export const authInput = (): LogInSignUpFormInputValues => ({
    email: {
        value: '',
        label: 'Email',
        placeholder: 'Enter your email',
    },
    password: {
        value: '',
        label: 'Password',
        placeholder: 'Enter your password',
    }
})