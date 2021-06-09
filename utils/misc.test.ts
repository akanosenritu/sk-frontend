import {isValidTelephoneNumber} from "./misc"

test("test isValidTelephoneNumber", () => {
  // valid cellphone number
  expect(isValidTelephoneNumber("080-1234-5678")).toBe(true)

  // valid tokyo telephone number
  expect(isValidTelephoneNumber("03-1234-5678")).toBe(true)
  // invalid tokyo telephone number (too short)
  expect(isValidTelephoneNumber("03-123-5678")).toBe(false)
  // invalid tokyo telephone number (too short)
  expect(isValidTelephoneNumber("03-12-5678")).toBe(false)

  // valid 3 digit city prefixed telephone number
  expect(isValidTelephoneNumber("046-123-5678")).toBe(true)
  // invalid 3 digit city prefixed telephone number (too short)
  expect(isValidTelephoneNumber("046-12-5678")).toBe(false)

  // valid 4 digit city prefixed telephone number
  expect(isValidTelephoneNumber("0461-23-5678")).toBe(true)
  // invalid 4 digit city prefixed telephone number (too long)
  expect(isValidTelephoneNumber("0461-234-5678")).toBe(false)
  // invalid 4 digit city prefixed telephone number (too long)
  expect(isValidTelephoneNumber("0461-2345-6789")).toBe(false)

  // invalid telephone number (no dash)
  expect(isValidTelephoneNumber("08012345678")).toBe(false)

  // invalid telephone number (too short)
  expect(isValidTelephoneNumber("0")).toBe(false)
})