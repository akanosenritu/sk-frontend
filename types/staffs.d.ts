import {Position, PositionGroup} from "./positions"

declare type RegisteredStaff = {
  staffId: string,
  gender: Gender,
  lastName: string,
  lastNameKana: string,
  firstName: string,
  firstNameKana: string,
  birthDate: Date,
  registeredDate: Date,
  isActive: boolean,
  telephoneNumber: string,
  emailAddress: string
} & ObjectInfo

declare type StaffsDict = {
  [staffUUID: string]: RegisteredStaff
}

declare type StaffUUIDsByDay =  {
  [dayString: string]: string[]  // refers to RegisteredStaffDraft.uuid
}

declare type StaffPositionAssignmentsForPositionGroup = {
  positionGroup: PositionGroup,
  assignedStaffUUIDsByDay: StaffUUIDsByDay
}

declare type StaffPositionAssignmentsForUnassignedStaffs = {
  assignedStaffUUIDsByDay: StaffUUIDsByDay,
}

type StaffPositionAssignments = {
  assigned: {[positionGroupUUID: string]: StaffPositionAssignmentsForPositionGroup},
  unassigned: StaffPositionAssignmentsForUnassignedStaffs
}
