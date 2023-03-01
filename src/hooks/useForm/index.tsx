import { useState, MouseEvent, ChangeEvent } from 'react'

export type InputValues = {
  value: string
  label?: string
  toggleValue?: boolean
  placeholder?: string
  disabled?: boolean
  filterValue?: string
}

export type FormDataItem = {
  [index: string]: InputValues
}

export type ErrorResponse = Record<string, string>

export type FormSubmitValue = {
  formType: string
  formData: FormDataItem
  error: ErrorResponse
}

type DefaultOptions = {
  initialValues: FormDataItem
  onSubmit: (submitValues: FormSubmitValue) => void
  onHandleCancel?: (submitValues: FormSubmitValue) => void
  validate: (formData: FormDataItem) => ErrorResponse
}

const useForm = (options: DefaultOptions) => {
  const { initialValues, onSubmit, onHandleCancel, validate } = options
  const [formData, setFormData] = useState<FormDataItem>(initialValues)

  // currently errors are not being used but they can be in future.
  const [errors, setErrors] = useState<ErrorResponse>({})

  // handleButtonChange && handleCheckboxChange or to better separate event types for handling button and input"checkbox" aka switch.
  // component these events will also allow for form to grow in future if needed with extra form elements, buttons, checkboxes etc.
  const handleButtonChange = (event: MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event
    const { name } = currentTarget

    setFormData({
      ...formData,
      [name]: {
        ...formData[name],
        toggleValue: !formData[name].toggleValue,
      },
    })
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { name } = currentTarget

    setFormData({
      ...formData,
      [name]: {
        ...formData[name],
        toggleValue: !formData[name].toggleValue,
      },
    })
  }

  // accommodate all possible form types.
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { value, name } = currentTarget

    setFormData({
      ...formData,
      [name]: {
        ...formData[name],
        value,
      },
    })
  }

  const handleCancel = (
    event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLInputElement>,
  ) => {
    event.preventDefault()
    const { id } = event.currentTarget
    const error = validate(formData)

    setErrors({
      ...errors,
      ...error,
    })

    const submitValues: FormSubmitValue = {
      formData,
      error,
      formType: id,
    } as FormSubmitValue

    if (onHandleCancel) {
      onHandleCancel(submitValues)
    }
  }

  const handleSubmit = (
    event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLInputElement>,
  ) => {
    event.preventDefault()
    const { id } = event.currentTarget
    const error = validate(formData)

    setErrors({
      ...errors,
      ...error,
    })

    const submitValues: FormSubmitValue = {
      formData,
      error,
      formType: id,
    } as FormSubmitValue

    onSubmit(submitValues)
  }
  // the above three functions are passed to and used in the component where we use useForm,
  // the functions called inside each function scope are what are passed to useForm from the component where we use useForm.
  // this allows greater flexibility for form handler functions and also lets us preventDefault here rather than in parent component.
  // the functions called inside each function scope are specific to each parent component and the actions that need to be taken per specific form.
  return {
    formData,
    errors,
    setFormData,
    handleChange,
    handleSubmit,
    handleCancel,
    handleCheckboxChange,
    handleButtonChange,
  }
}

export default useForm
