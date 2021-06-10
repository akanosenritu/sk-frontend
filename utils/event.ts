import {Event, PositionGroup} from "../types/positions"
import {Position} from "../types/position"
import {v4} from "uuid"
import {formatDateToYYYYMMDD} from "./time"
import {compareAsc} from "date-fns"
import {getValueWithDefault} from "./positions"

export const createDefaultEvent = (): Event => ({
  title: "",
  datetimeAdded: new Date(),
  datetimeLastModified: new Date(),
  uuid: v4(),
  isEdited: false,
  isSaved: false,
  positionGroups: [] as PositionGroup[]
})

type ValidateEventErrors = {
  [fieldName: string]: string
}
type ValidateEventResult = {
  ok: boolean,
  errors: ValidateEventErrors,
}
export const validateEvent = (event: Event): ValidateEventResult => {
  const errors: ValidateEventErrors = {}
  if (event.title === "") errors["イベント名"] = "イベント名が空白のイベントは作成できません。"
  if (event.positionGroups.length === 0) errors["配置"] = "配置のないイベントは作成できません。イベントには必ず１つ以上の配置が必要です。"
  return {ok: Object.keys(errors).length === 0, errors}
}

// returns a sorted array of Dates
// at which at least one position of the event exists.
export const getDates = (event: Event) => {
  return Array.from(
    new Set(event.positionGroups
      .map(positionGroup => {
        return positionGroup.positions.map(
          position => formatDateToYYYYMMDD(position.date)
        )
      })
      .flat()
    )
  ).map(str => new Date(str))
  .sort(compareAsc)
}

// returns a sorted array of dayStrings (formatted as YYYY-MM-DD) of dates
// at which at least one position of the event exists.
export const getDayStrings = (event: Event) => {
  return Array.from(
    new Set(event.positionGroups
      .map(positionGroup => {
        return positionGroup.positions.map(
          position => formatDateToYYYYMMDD(position.date)
        )
      })
      .flat()
    )
  ).sort()
}


export type AssignmentsByDay = {
  [dayString: string]: {
    positionGroup: PositionGroup,
    position: Position,
  },
}
export type AssignmentsByDayByStaff = {
  [staffUUID: string]: AssignmentsByDay
}
// TODO: Write an explanation!
export const getAssignmentsByDayByStaff = (event: Event): AssignmentsByDayByStaff => {
  const assignmentByDayByStaff: AssignmentsByDayByStaff = {}
  for (const positionGroup of event.positionGroups) {
    for (const position of positionGroup.positions) {
      const dayString = formatDateToYYYYMMDD(position.date)
      for (const assignedStaff of position.assignedStaffs) {
        const assignmentByDay = assignmentByDayByStaff[assignedStaff.uuid]
        assignmentByDayByStaff[assignedStaff.uuid] = {
          ...assignmentByDay,
          [dayString]: {
            positionGroup,
            position
          }
        }
      }
    }
  }
  return assignmentByDayByStaff
}

type EventStatistics = {
  totalNumberOfStaffsRequired: number,
  totalNumberOfStaffsRequiredByGender: {[gender in Gender]: number},
  totalNumberOfStaffsAssigned: number,
  totalNumberOfStaffsAssignedByGender: {[gender in Gender]: number},
}
export const collectEventStatistics = (event: Event): EventStatistics => {
  const required: {[gender in Gender]: number} = {male: 0, female: 0, unspecified: 0}
  const assigned: {[gender in Gender]: number} = {male: 0, female: 0, unspecified: 0}
  for (const positionGroup of event.positionGroups) {
    for (const position of positionGroup.positions) {
      // calculate required
      const male = getValueWithDefault("male", position.data, positionGroup.defaultPositionData).value
      required.male += male
      const female = getValueWithDefault("female", position.data, positionGroup.defaultPositionData).value
      required.female += female
      const unspecified = getValueWithDefault("unspecified", position.data, positionGroup.defaultPositionData).value
      required.unspecified += unspecified

      // calculate assigned
      let maleAssigned = 0
      let femaleAssigned = 0
      let unspecifiedAssigned = 0
      for (const staff of position.assignedStaffs) {
        if (staff.gender === "male") maleAssigned += 1
        if (staff.gender === "female") femaleAssigned += 1
        if (staff.gender === "unspecified") unspecifiedAssigned += 1
      }
      assigned.male += maleAssigned
      assigned.female += femaleAssigned
      assigned.unspecified += unspecifiedAssigned
    }
  }
  return {
    totalNumberOfStaffsRequired: required.male + required.female + required.unspecified,
    totalNumberOfStaffsRequiredByGender: required,
    totalNumberOfStaffsAssigned: assigned.male + assigned.female + assigned.unspecified,
    totalNumberOfStaffsAssignedByGender: assigned,
  }
}

export const createPositionDict = (event: Event): Map<string, Position> => {
  const dict: Map<string, Position> = new Map()
  for (const positionGroup of event.positionGroups) {
    for (const position of positionGroup.positions) {
      dict.set(position.uuid, position)
    }
  }
  return dict
}