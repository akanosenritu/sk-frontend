import {RegisteredStaff} from "../../types/staffs"
import {format} from "date-fns"
import {Failure, postWithJWT, SuccessWithData} from "./api"

export type APIRegisteredStaff = {
  uuid: string,
  staff_id: string,
  gender: string,
  last_name: string,
  last_name_kana: string,
  first_name: string,
  first_name_kana: string,
  birth_date: string,
  registered_date: string,
  is_active: boolean,
  telephone_number: string,
  email_address: string
}

export const convertAPIRegisteredStaffToRegisteredStaff = (apiRegisteredStaff: APIRegisteredStaff): RegisteredStaff => {
  return {
    ...apiRegisteredStaff,
    staffId: apiRegisteredStaff.staff_id,
    gender: apiRegisteredStaff.gender as Gender,
    lastName: apiRegisteredStaff.last_name,
    lastNameKana: apiRegisteredStaff.last_name_kana,
    firstName: apiRegisteredStaff.first_name,
    firstNameKana: apiRegisteredStaff.first_name_kana,
    registeredDate: new Date(apiRegisteredStaff.registered_date),
    birthDate: new Date(apiRegisteredStaff.birth_date),
    isActive: apiRegisteredStaff.is_active,
    telephoneNumber: apiRegisteredStaff.telephone_number,
    emailAddress: apiRegisteredStaff.email_address,
    isSaved: true,
  }
}

export const convertRegisteredStaffToAPIRegisteredStaff = (registeredStaff: RegisteredStaff): APIRegisteredStaff => {
  return {
    uuid: registeredStaff.uuid,
    staff_id: registeredStaff.staffId,
    gender: registeredStaff.gender,
    last_name: registeredStaff.lastName,
    last_name_kana: registeredStaff.lastNameKana,
    first_name: registeredStaff.firstName,
    first_name_kana: registeredStaff.firstNameKana,
    birth_date: format(registeredStaff.birthDate, "yyyy-MM-dd"),
    registered_date: format(registeredStaff.registeredDate, "yyyy-MM-dd"),
    is_active: registeredStaff.isActive,
    telephone_number: registeredStaff.telephoneNumber,
    email_address: registeredStaff.emailAddress
  }
}

export const saveRegisteredStaffOnBackend = async (registeredStaff: RegisteredStaff): Promise<SuccessWithData<RegisteredStaff>|Failure> => {
  const result = await postWithJWT("registered-staffs/", convertRegisteredStaffToAPIRegisteredStaff(registeredStaff))
  if (result.ok) {
    return {
      ok: true,
      data: convertAPIRegisteredStaffToRegisteredStaff(result.data)
    }
  }
  return result
}