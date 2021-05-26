import {format, isAfter, isBefore} from "date-fns"
import {rawTimeToString} from "./time"
import {PositionGroup, Position, ValueWithDefault} from "../types/positions"
import {getValueWithDefault} from "./positions"
import {Setting} from "./setting"

export type Cell = {
  value: string
}
export type CellWithDefault = {
  value: string,
  isInheritingDefault: boolean,
}

export const getNumberCellValueWithDefault= (value: ValueWithDefault<number>): CellWithDefault => {
  return {
    value: value.value.toString(10),
    isInheritingDefault: value.isInheritingDefault
  }
}

export const getRawTimeCellValueWithDefault= (value: ValueWithDefault<RawTime>): CellWithDefault => {
  return {
    value: rawTimeToString(value.value),
    isInheritingDefault: value.isInheritingDefault
  }
}

export const getSettingCellValueWithDefault = (value: ValueWithDefault<Setting>): CellWithDefault => {
  return {
    value: value.value.title,
    isInheritingDefault: value.isInheritingDefault
  }
}

export type MyRow = {
  date: Cell,
  dateRowSpanningRows: number,
  dateRowIsSpanning: boolean
  startHour: CellWithDefault,
  endHour: CellWithDefault,
  male: CellWithDefault,
  female: CellWithDefault,
  unspecified: CellWithDefault,
  clothes: CellWithDefault,
  gatheringPlace: CellWithDefault,
  position: Position,
  positionGroup: PositionGroup,
}

export const prepareRows = (positions: {position: Position, positionGroup: PositionGroup}[]): MyRow[] => {
  positions.sort((a, b) => {
    if (isAfter(b.position.date, a.position.date)) return -1
    else if (isBefore(b.position.date, a.position.date)) return 1
    return 0
  })

  let result: MyRow[] = []
  let currentDayFirstRow: null | MyRow = null

  const createMyRow = (position: Position, positionGroup: PositionGroup, dateRowSpanningRows: number, dateRowIsSpanning: boolean): MyRow => {
    const {defaultPositionData: defaultData} = positionGroup
    const {data} = position
    
    return {
      date: {value: format(position.date, "MM/dd")},
      dateRowSpanningRows,
      dateRowIsSpanning,
      startHour: getRawTimeCellValueWithDefault(getValueWithDefault("startHour", data, defaultData)),
      endHour: getRawTimeCellValueWithDefault(getValueWithDefault("endHour", data, defaultData)),
      male: getNumberCellValueWithDefault(getValueWithDefault("male", data, defaultData)),
      female: getNumberCellValueWithDefault(getValueWithDefault("female", data, defaultData)),
      unspecified: getNumberCellValueWithDefault(getValueWithDefault("unspecified", data, defaultData)),
      clothes: getSettingCellValueWithDefault(getValueWithDefault("clothes", data, defaultData)),
      gatheringPlace: getSettingCellValueWithDefault(getValueWithDefault("gatheringPlace", data, defaultData)),
      position: position,
      positionGroup: positionGroup
    }
  }
  positions.forEach(data => {
    const formattedDate = format(data.position.date, "MM/dd")
    if (currentDayFirstRow === null || currentDayFirstRow.date.value !== formattedDate) {
      const row = createMyRow(data.position, data.positionGroup, 1, false)
      result.push(row)
      currentDayFirstRow = row
    } else {
      const row = createMyRow(data.position, data.positionGroup, 0, true)
      result.push(row)
      currentDayFirstRow.dateRowSpanningRows += 1
    }
  })
  return result
}
