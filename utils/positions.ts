import {v4} from "uuid"
import {eachDayOfInterval} from "date-fns"
import {ClothesSetting} from "./clothes"
import {GatheringPlaceSetting} from "./gatheringPlace"
import {PositionGroup, PositionData, PositionDataNullable, ValueWithDefault} from "../types/positions"
import {Position} from "../types/position"
import {getIntervals} from "./time"
import {isCreatedData, isNotCreatedData} from "./object"

export const createDefaultPositionData = (
  clothesSetting: ClothesSetting,
  gatheringPlaceSetting: GatheringPlaceSetting
): PositionData => {
  return {
    isEdited: false,
    isSaved: false,
    uuid: v4(),
    startHour: {hour: 8, minute: 0},
    endHour: {hour: 17, minute: 0},
    male: 0,
    female: 0,
    unspecified: 5,
    clothes: clothesSetting,
    gatheringPlace: gatheringPlaceSetting
  }
}

type CreateDefaultPosition = {
  date: Date,
  startHour?: RawTime,
  endHour?: RawTime,
  male?: number,
  female?: number,
  unspecified?: number,
  clothes?: ClothesSetting,
  gatheringPlace?: GatheringPlaceSetting,
  parentPosition: PositionGroup,
}

const createDefaultPosition = (params: CreateDefaultPosition): Position => {
  return {
    uuid: v4(),
    date: params.date,
    isEdited: false,
    isSaved: false,
    assignedStaffs: [],
    data: {
      isEdited: false,
      isSaved: false,
      uuid: v4(),
      startHour: params.startHour || null,
      endHour: params.endHour || null,
      male: params.male || null,
      female: params.female || null,
      unspecified: params.unspecified || null,
      clothes: params.clothes || null,
      gatheringPlace: params.gatheringPlace || null
    }
  }
}

type CreatePositionGroupParams = {
  title: string,
  start: Date,
  end: Date,
  defaultPositionData: PositionData,
}

export const createPositionGroup = (params: CreatePositionGroupParams): PositionGroup => {
  const positionUUID = v4()
  const positionGroup: PositionGroup = {
    uuid: positionUUID ,
    title: params.title,
    isEdited: false,
    isSaved: false,
    defaultPositionData: params.defaultPositionData,
    positions: [],
    positionColor: getRandomPositionGroupColor(),
  }
  positionGroup.positions = eachDayOfInterval({start: params.start, end: params.end}).map(date => {
    return createDefaultPosition({
      date: date,
      parentPosition: positionGroup
    })
  })
  return positionGroup
}

export const convertPositionGroupToCalendarEvents = (positionGroup: PositionGroup): CalendarEvent<PositionGroup>[] => {
  const intervals = getIntervals(positionGroup.positions.map(pos => pos.date))
  return intervals.map(interval => ({
    title: positionGroup.title,
    start: interval.start,
    end: interval.end,
    allDay: true,
    backgroundColor: positionGroup.positionColor,
    data: positionGroup,
  }))
}

let index = 0
const options = [
  "#d6cbd3",
  "#eca1a6",
  "#bdcebe",
  "#ada397",
  "#b9936c",
  "#dac292",
  "#e6e2d3",
  "#c4b7a6",
  "#f7cac9",
  "#d5f4e6",
  "#80ced6",
  "#618685",
  "#ffef96",
  "#eea29a"
]
export const getRandomPositionGroupColor = () => {
  index += 1
  return options[index % options.length]
}

export const getDataOrDefaultDataFromPositionData = <TKey extends keyof PositionData>(
  dataName: TKey,
  positionData: PositionDataNullable,
  defaultData: PositionData
): PositionData[TKey] => {
  return (positionData[dataName] !== null ?
    positionData[dataName] :
    defaultData[dataName]) as PositionData[TKey]
}

export const getPositionDataOrDefaultData = (positionData: PositionDataNullable, defaultData: PositionData): PositionData => {
  return Object.fromEntries(
    Object.keys(positionData).map(key => {
      return [key, getDataOrDefaultDataFromPositionData(key as keyof PositionData, positionData, defaultData)]
    })
  ) as PositionData
}

export const getValueWithDefault = <TKey extends keyof PositionData>(
  dataName: TKey,
  positionData: PositionDataNullable,
  defaultData: PositionData,
): ValueWithDefault<typeof defaultData[TKey]> => {
  if (positionData[dataName] !== null) {
    return {
      value: positionData[dataName] as PositionData[TKey],
      isInheritingDefault: false
    }
  } else {
    return {
      value: defaultData[dataName],
      isInheritingDefault: true
    }
  }
}

export const getIndexOfMatchingPositionData = (
  positionData: (PositionData|PositionDataNullable)[],
  searchingData: (PositionData|PositionDataNullable)
): number => {
  for (let i=0; i < positionData.length; i++) {
    const currentPositionData = positionData[i]
    if (isCreatedData(currentPositionData) && isCreatedData(searchingData)) {
      if (currentPositionData.uuid === searchingData.uuid) return i
    } else if (isNotCreatedData(currentPositionData) && isNotCreatedData(searchingData)) {
      if (currentPositionData.uuid === searchingData.uuid) return i
    }
  }
  return -1
}
