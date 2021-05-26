import {ClothesSetting} from "../utils/clothes"
import {GatheringPlaceSetting} from "../utils/gatheringPlace"

declare type ValueWithDefault<T> = {
  value: T,
  isInheritingDefault: boolean,
}

declare type PositionDataBase = {
  startHour: RawTime,
  endHour: RawTime,
  male: number,
  female: number,
  unspecified: number,
  clothes: ClothesSetting,
  gatheringPlace: GatheringPlaceSetting,
}

// generally corresponds to api.models.PositionData
declare type PositionData = PositionDataBase & ObjectInfo

declare type PositionDataNullableBase = {[key in keyof PositionDataBase]: PositionDataBase[key] | null }
// generally corresponds to api.models.PositionData
declare type PositionDataNullable =  PositionDataNullableBase & ObjectInfo

// corresponds to api.models.Position
declare type Position = {
  date: Date,
  data: PositionDataNullable
} & ObjectInfo

// corresponds to api.models.PositionGroup
declare type PositionGroup = {
  title: string,
  defaultPositionData: PositionData,
  positions: Position[],
  positionColor: string,
} & ObjectInfo