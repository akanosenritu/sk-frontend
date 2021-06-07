import {Event, PositionGroup} from "../types/positions"
import {Position} from "../types/position"
import {v4} from "uuid"
import {formatDateToYYYYMMDD} from "./time"
import {compareAsc} from "date-fns"

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
  if (!event.isEdited) errors["編集なし"] = "編集が行われていないため、保存する必要がありません。"
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
          position => position.date
        )
      })
      .flat()
    )
  ).sort(compareAsc)
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