import {RegisteredStaff, StaffsDict} from "../types/staffs"
import create from "zustand"
import {APIRegisteredStaff, convertAPIRegisteredStaffToRegisteredStaff, getStaffs} from "./api/staff"
import {v4} from "uuid"
import {useEffect, useMemo, useState} from "react"

export const createDefaultRegisteredStaff = (): RegisteredStaff => {
  return {
    uuid: v4(),
    staffId: "",
    gender: "male",
    lastName: "",
    lastNameKana: "",
    firstName: "",
    firstNameKana: "",
    birthDate: new Date(),
    registeredDate: new Date(),
    isActive: true,
    telephoneNumber: "",
    emailAddress: "",
    isEdited: false,
    isSaved: false,
  }
}
export const getStaffCounts = (staffs: RegisteredStaff[]) => {
  let male = 0
  let female = 0
  for (const staff of staffs) {
    switch (staff.gender) {
      case "male":
        male += 1
        break
      case "female":
        female +=1
        break
    }
  }
  return {male, female}
}

export const createSampleStaffData = (dataArray: APIRegisteredStaff[]): RegisteredStaff[] => {
  return dataArray.map(obj => convertAPIRegisteredStaffToRegisteredStaff(obj))
}

export const sampleStaffDataArray = [
  {
    "uuid": "707dd85b-3018-46fb-a94a-1c4ae6c15eb0",
    "staff_id": "1",
    "gender": "male",
    "last_name": "Lincoln",
    "last_name_kana": "リンカーン",
    "first_name": "Abraham",
    "first_name_kana": "エイブラハム",
    "birth_date": "1809-02-12",
    "registered_date": "2021-05-29",
    "interviewed_by": {
      "uuid": "ca63ec7c-1ffd-4d9e-9ac5-adc34b5ca877",
      "last_name": "Jesus",
      "last_name_kana": "イエス",
      "first_name": "Christ",
      "first_name_kana": "キリスト"
    },
    "is_active": true,
    "telephone_number": "bogus-telephone-number",
    "email_address": "abraham-lincoln@example.com"
  },
  {
    "uuid": "0fe86d0d-c1f9-41a4-82cc-00f1d1e1f2d9",
    "staff_id": "32",
    "gender": "male",
    "last_name": "Roosevelt",
    "last_name_kana": "ルーズベルト",
    "first_name": "Franklin",
    "first_name_kana": "フランクリン",
    "birth_date": "1882-01-30",
    "registered_date": "2021-05-29",
    "interviewed_by": {
      "uuid": "ca63ec7c-1ffd-4d9e-9ac5-adc34b5ca877",
      "last_name": "Jesus",
      "last_name_kana": "イエス",
      "first_name": "Christ",
      "first_name_kana": "キリスト"
    },
    "is_active": true,
    "telephone_number": "bogus-telephone-number",
    "email_address": "franklin-roosevelt@example.com"
  },
  {
    "uuid": "259b612a-6ef0-4dd1-8484-ef56a882d34f",
    "staff_id": "45",
    "gender": "male",
    "last_name": "Trump",
    "last_name_kana": "トランプ",
    "first_name": "Donald",
    "first_name_kana": "ドナルド",
    "birth_date": "1946-06-14",
    "registered_date": "2021-05-29",
    "interviewed_by": {
      "uuid": "ca63ec7c-1ffd-4d9e-9ac5-adc34b5ca877",
      "last_name": "Jesus",
      "last_name_kana": "イエス",
      "first_name": "Christ",
      "first_name_kana": "キリスト"
    },
    "is_active": true,
    "telephone_number": "bogus-telephone-number",
    "email_address": "donald-trump@example.com"
  }
]

export const sampleStaffData: RegisteredStaff[] = createSampleStaffData(sampleStaffDataArray)

export const createStaffsDict = (staffs: RegisteredStaff[]) => {
  return Object.fromEntries(staffs.map(staff => [staff.uuid, staff]))
}

export const useStaffsDict = create<{
  dict: StaffsDict,
  setDict: (staffsDict: StaffsDict) => void,
}>(set => ({
  dict: createStaffsDict(sampleStaffData),
  setDict: (newDict) => set({dict: newDict})
}))

export const useStaffs = () => {
  const [staffs, setStaffs] = useState<RegisteredStaff[]>([])
  const [error, setError] = useState<string|null>(null)
  const search = () => {
    retrieveStaffs()
  }

  const retrieveStaffs = () => {
    getStaffs()
      .then(staffs => setStaffs(staffs))
      .catch(() => setError("Failed to retrieve staffs data."))
  }
  // initial load
  useEffect(() => {
    retrieveStaffs()
  }, [])

  const staffsDict = useMemo<{[uuid: string]: RegisteredStaff}>(()=>{
    return Object.fromEntries(staffs.map(staff => [staff.uuid, staff]))
  }, [staffs])

  return {error, staffs, staffsDict, search}
}