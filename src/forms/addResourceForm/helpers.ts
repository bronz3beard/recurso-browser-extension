import { InputValues } from "@src/hooks/useForm"
import { Resource } from "@src/types"

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

export const getMetaData = async (
  payload: Partial<Resource>,
): Promise<Partial<Resource>> => {
  try {
    const response = await fetch(
        `https://jsonlink.io/api/extract?url=${payload.link_url}`,
    )

    if (!response.ok) {
      console.info(
        '🚀 ~ request for metadata was blocked by cross-origin request, it is not uncommon and this message suppresses the error as we expect it.',
      )
    }

    const metaData = await response.json()
    const image_url = metaData.images?.[0]

    const newPayload = response.ok ? { ...payload, image_url } : { ...payload }

    return newPayload
  } catch (error: any) {
    // error has been muted because we are expecting a lot of 500 cors cross origin errors.
    // in this case the error is not important enough to load the console with logging.

    const mute = error
  }

  return payload
}
