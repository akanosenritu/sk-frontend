import {Position, PositionGroup} from "./positions"

declare type RegisteredStaffDraft = {
  uuid: string,
  name: string,
  gender: Gender,
}

declare type StaffsDict = {
  [staffUUID: string]: RegisteredStaffDraft
}

declare type StaffUUIDsByDay =  {
  [dayString: string]: string[]  // refers to RegisteredStaffDraft.uuid
}

declare type StaffPositionAssignmentsForPositionGroup = {
  positionGroup: PositionGroup,
  assignedStaffUUIDsByDay: StaffUUIDsByDay
}

type StaffPositionAssignments = {
  [positionGroupUUID: string]: StaffPositionAssignmentsForPositionGroup
}
