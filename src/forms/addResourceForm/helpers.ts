import { InputValues } from "@src/hooks/useForm"

export type ResourceFormInputValues = {
    linkUrl: InputValues,
    description: InputValues,
  }

export const resourceInput = (): ResourceFormInputValues => ({
    linkUrl: {
        value: '',
        label: 'Add "https://" url',
    },
    description: {
        value: '',
        label: 'Add a description',
    },
})