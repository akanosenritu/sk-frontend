export const isCreatedData = (data: any): data is CreatedData => {
  return data.isSaved && data.uuid !== undefined
}

export const isNotCreatedData = (data: any): data is NotCreatedData => {
  return !data.isSaved && data.uuid !== undefined
}