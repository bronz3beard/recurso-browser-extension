export const getDescendantPropObject = (
  obj: any,
  description: string,
): string => {
  const arrList: string[] = description.split('.')
  let newObj = obj

  if (!arrList.length) {
    return newObj[description]
  }
  // "shift()" Removes the first element from an array and returns it. If the array is empty, undefined.
  // If the array is empty, undefined is returned and the array is not modified.
  while (arrList.length) {
    newObj = newObj[arrList.shift() ?? ''] as unknown as string
  }

  return newObj as string
}

export const getDescendantPropString = (field: string): string => {
  const fieldArray = field.split('.')

  return fieldArray[fieldArray.length - 1]
}

// check if object is empty.
export const objectHasAttributes = (obj: Record<string, string>): boolean =>
  Object.keys(obj).length > 0

export const reactSelectOptions = (
  optionsArray: any[],
  value: string,
  label: string,
  stringFunction?: (value: Record<string, string> | string) => any,
  concatParam = null,
): any[] =>
  optionsArray.map(item => {
    // const optionItems = {} as T

    const objectFieldValue = getDescendantPropObject(item, value)
    const objectFieldLabel = getDescendantPropObject(item, label)
    const objectFieldConcatParam =
      concatParam && getDescendantPropObject(item, concatParam)

    const labelValue: string = !concatParam
      ? objectFieldLabel
      : `${objectFieldLabel} ${
          !objectFieldConcatParam ? '' : ` - ${objectFieldConcatParam}`
        }`

    // item.value = parseInt(objectFieldValue, 10)
    // item.label = !stringFunction ? labelValue : stringFunction(labelValue)

    return {
      value: parseInt(objectFieldValue, 10),
      label: !stringFunction ? labelValue : stringFunction(labelValue),
    }
  })

  export const getUniqueArrayObjects = (array: any[], objectKey: string) =>
  array.filter(
    (value: { [x: string]: any }, index: any, self: any[]) =>
      self.map(item => item[objectKey]).indexOf(value[objectKey]) === index,
  )
