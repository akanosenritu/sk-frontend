import {RegisteredStaff} from "../types/staffs"
import {getStaffs} from "./api/staff"
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

export const createStaffsDict = (staffs: RegisteredStaff[]) => {
  return Object.fromEntries(staffs.map(staff => [staff.uuid, staff]))
}

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