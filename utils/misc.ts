export const isValidTelephoneNumber = (telephoneNumber: string): boolean => {
  // tokyo
  const regex1 = /^[0-9]{2}-[0-9]{4}-[0-9]{4}/g
  // 3 digit prefixed city number and cellphone number
  const regex2 = /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/g
  // 4 digit prefixed city number
  const regex3 = /^[0-9]{4}-[0-9]{2}-[0-9]{4}/g

  if (regex1.test(telephoneNumber)) return true
  if (regex2.test(telephoneNumber)) return true
  return regex3.test(telephoneNumber)
}