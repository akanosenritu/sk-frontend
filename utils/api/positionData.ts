import {
  APIPositionData,
  APIPositionDataNotNullable,
  APIPositionDataNullable,
  WritableAPIPositionData
} from "../../types/api"
import {PositionData, PositionDataNullable} from "../../types/positions"
import {rawTimeToString, stringToRawTime} from "../time"
import {
  convertAPIClothesSettingToClothesSetting,
  convertClothesSettingsToAPIClothesSettings,
  createClothesSettingOnBackend
} from "./clothesSetting"
import {
  convertAPIGatheringPlaceSettingToGatheringPlaceSetting,
  convertGatheringPlaceSettingToAPIGatheringPlaceSetting, createGatheringPlaceSettingOnBackend
} from "./gatheringPlaceSetting"
import {Failure, postWritable, SuccessWithData} from "./api"

export const convertAPIPositionDataToPositionDataNullable = (apiPositionData: APIPositionData): PositionDataNullable => {
  return {
   ...apiPositionData,
    startHour: apiPositionData.start_hour?
      stringToRawTime(apiPositionData.start_hour) || {hour: 0, minute: 0}:
      null,
    endHour:  apiPositionData.end_hour?
      stringToRawTime(apiPositionData.end_hour) || {hour: 23, minute: 59}:
      null,
    clothes: convertAPIClothesSettingToClothesSetting(apiPositionData.clothes),
    gatheringPlace: convertAPIGatheringPlaceSettingToGatheringPlaceSetting(apiPositionData.gathering_place),
    isSaved: true
  }
}

export const convertAPIPositionDataNotNullableToPositionData = (
  apiPositionData: APIPositionDataNotNullable
): PositionData => {
  return {
    ...apiPositionData,
    startHour: stringToRawTime(apiPositionData.start_hour) || {hour: 0, minute: 0},
    endHour:  stringToRawTime(apiPositionData.end_hour) || {hour: 23, minute: 59},
    clothes: convertAPIClothesSettingToClothesSetting(apiPositionData.clothes),
    gatheringPlace: convertAPIGatheringPlaceSettingToGatheringPlaceSetting(apiPositionData.gathering_place),
    isSaved: true
  }
}

export const convertPositionDataToAPIPositionData = (positionData: PositionData): APIPositionDataNotNullable => {
  return {
    ...positionData,
    start_hour: rawTimeToString(positionData.startHour),
    end_hour: rawTimeToString(positionData.endHour),
    clothes: convertClothesSettingsToAPIClothesSettings(positionData.clothes),
    gathering_place: convertGatheringPlaceSettingToAPIGatheringPlaceSetting(positionData.gatheringPlace),
    nullable: false,
  }
}

export const convertPositionDataNullableToAPIPositionData = (positionData: PositionDataNullable): APIPositionDataNullable => {
  return {
    ...positionData,
    start_hour: positionData.startHour? rawTimeToString(positionData.startHour): null,
    end_hour: positionData.endHour? rawTimeToString(positionData.endHour): null,
    clothes: positionData.clothes? convertClothesSettingsToAPIClothesSettings(positionData.clothes): null,
    gathering_place: positionData.gatheringPlace? convertGatheringPlaceSettingToAPIGatheringPlaceSetting(positionData.gatheringPlace): null,
    nullable: true,
  }
}

// make sure apiPositionData.clothes and apiPositionData.gatheringPlace are saved (isSaved: true) before this function.
// otherwise improper uuids which represent nothing in the server are set, resulting in no clothes or gathering_place set.
export const createWritableAPIPositionData = (apiPositionData: APIPositionData): WritableAPIPositionData => {
  return {
    ...apiPositionData,
    clothes_uuid: apiPositionData.clothes? apiPositionData.clothes.uuid: null,
    gathering_place_uuid: apiPositionData.gathering_place? apiPositionData.gathering_place.uuid: null,
  }
}

export const createPositionDataOnBackend = async (positionData: PositionData): Promise<SuccessWithData<PositionData>|Failure> => {
  if (!positionData.clothes.isSaved) {
    const newClothesSettingCreationResult = await createClothesSettingOnBackend(positionData.clothes)
    if (newClothesSettingCreationResult.ok) {
      positionData.clothes = newClothesSettingCreationResult.data
    } else {
      return {
        ok: false,
        description: "Failed to create a new ClothesSetting while trying to create a PositionData."
      }
    }
  }
  if (!positionData.gatheringPlace.isSaved) {
    const newGatheringPlaceCreationResult = await createGatheringPlaceSettingOnBackend(positionData.gatheringPlace)
    if (newGatheringPlaceCreationResult.ok) {
      positionData.gatheringPlace = newGatheringPlaceCreationResult.data
    } return {
      ok: false,
      description: "Failed to create a new GatheringPlaceSetting while trying to create a PositionData."
    }
  }
  const result = await postWritable<WritableAPIPositionData, APIPositionData>("position-data/", createWritableAPIPositionData(
    convertPositionDataToAPIPositionData(positionData)
  ))
  if (result.ok) {
    return {
      ...result,
      data: convertAPIPositionDataNotNullableToPositionData(result.data as APIPositionDataNotNullable)
    }
  }
  return result
}

export const createPositionDataNullableOnBackend = async (positionData: PositionDataNullable): Promise<SuccessWithData<PositionDataNullable>|Failure> => {
  if ((positionData.clothes !== null) && !positionData.clothes.isSaved) {
    const newClothesSettingCreationResult = await createClothesSettingOnBackend(positionData.clothes)
    if (newClothesSettingCreationResult.ok) {
      positionData.clothes = newClothesSettingCreationResult.data
    } else {
      return {
        ok: false,
        description: "Failed to create a new ClothesSetting while trying to create a PositionData."
      }
    }
  }
  if ((positionData.gatheringPlace !== null) && !positionData.gatheringPlace.isSaved) {
    const newGatheringPlaceCreationResult = await createGatheringPlaceSettingOnBackend(positionData.gatheringPlace)
    if (newGatheringPlaceCreationResult.ok) {
      positionData.gatheringPlace = newGatheringPlaceCreationResult.data
    } return {
      ok: false,
      description: "Failed to create a new GatheringPlaceSetting while trying to create a PositionData."
    }
  }
  const result = await postWritable<WritableAPIPositionData, APIPositionDataNullable>("position-data/", createWritableAPIPositionData(
    convertPositionDataNullableToAPIPositionData(positionData)
  ))
  if (result.ok) {
    return {
      ...result,
      data: convertAPIPositionDataToPositionDataNullable(result.data)
    }
  }
  return result
}