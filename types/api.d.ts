import {APIClothesSetting} from "../utils/api/clothesSetting"
import {APIGatheringPlaceSetting} from "../utils/api/gatheringPlaceSetting"
import {APIRegisteredStaff} from "../utils/api/staff"

declare type APIClothesSetting = {
  uuid: string,
  title: string,
  content: string
}

declare type APIGatheringPlaceSetting = {
  uuid: string,
  title: string,
  content: string
}

declare type APIPositionDataNullable = {
  uuid: string,
  start_hour: string | null,
  end_hour: string | null,
  male: number | null,
  female: number | null,
  unspecified: number | null,
  clothes: APIClothesSetting | null,
  gathering_place: APIGatheringPlaceSetting | null,
  nullable: true
}

declare type APIPositionDataNotNullable = {
  uuid: string,
  start_hour: string,
  end_hour: string,
  male: number,
  female: number,
  unspecified: number,
  clothes: APIClothesSetting,
  gathering_place: APIGatheringPlaceSetting,
  nullable: false
}

declare type APIPositionData = APIPositionDataNullable | APIPositionDataNotNullable

declare type WritableAPIPositionData = APIPositionData & {
  clothes_uuid: string,
  gathering_place_uuid: string,
}

declare type APIPositionBase = {
  uuid: string,
  date: string,  // in the format of YYYY-MM-DD
  assigned_staffs: APIRegisteredStaff[],
}

declare type APIPosition = APIPositionBase & {
  data: APIPositionData,
}

declare type WritableAPIPosition = APIPositionBase & {
  data_uuid: string,  // refers to the uuid of APIPositionData
  assigned_staff_uuids: string[],
}

declare type APIPositionGroupBase = {
  uuid: string,
  title: string,
  position_color: string
}

declare type APIPositionGroup = APIPositionGroupBase & {
  default_position_data: APIPositionDataNotNullable,
  positions: APIPosition[],
}

declare type WritableAPIPositionGroup = APIPositionGroupBase & {
  default_position_data_uuid: string,
  position_uuids: string[]
}

declare type APIEventBase = {
  uuid: string,
  datetime_added: string,
  datetime_last_modified: string,
  title: string,
}

declare type APIEvent = APIEventBase & {
  position_groups: APIPositionGroup[]
}

declare type WritableAPIEvent = APIEventBase & {
  position_group_uuids: string[]
}