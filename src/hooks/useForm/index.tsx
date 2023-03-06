import { useState, MouseEvent, ChangeEvent } from 'react'
import { isFunction } from '@src/utils/valueCheckers'

export type InputValues = {
  value: string
  values?: string[]
  label?: string
  toggleValue?: boolean
  placeholder?: string
  disabled?: boolean
  filterValue?: string
  validation?: (value: string) => boolean
}

export type ErrorResponse = Record<string, string>

export interface FormSubmitValues<T> {
  formType: string
  formData: T
  error: ErrorResponse | undefined
}

interface DefaultOptions<T> {
  initialValues: T
  onSubmit: (submitValues: FormSubmitValues<T>) => void
  validate?: (formData: T) => ErrorResponse
}

const useForm = <T extends {[key: string]: {[key: string]: any}},>(options: DefaultOptions<T>) => {
  const { initialValues, onSubmit, validate } = options
  const [formData, setFormData] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ErrorResponse>({})

  const handleFormReset = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setFormData(initialValues)
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { currentTarget } = event
    const { value, name: eventName } = currentTarget

    type Name = keyof T;
    const name: Name = eventName as unknown as Name
    const formDataValue: InputValues = formData[name] as unknown as InputValues
    const validation = formDataValue?.validation?.(value) as unknown as (value: string) => boolean

    const validatedValue = validation?.(value) ? value : ''

    setFormData({
      ...formData,
      [name]: {
        ...formDataValue,
        value: isFunction(validation) ? validatedValue : value,
      },
    })
  }

  const handleSubmit = (
    event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLInputElement>,
  ) => {
    event.preventDefault()
    const { id } = event.currentTarget
    const error = !validate ? null : validate(formData)

    setErrors({
      ...errors,
      ...error,
    })

    const submitValues: FormSubmitValues<T> = {
      formData,
      error: error as unknown as ErrorResponse,
      formType: id,
    }

    onSubmit(submitValues)
  }

  return {
    formData,
    errors,
    setFormData,
    handleChange,
    handleSubmit,
    handleFormReset
  }
}

export default useForm