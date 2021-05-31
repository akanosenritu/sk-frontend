import {Failure, getWithJWT, postWithJWT, SuccessWithData} from "./api"
import {GatheringPlaceSetting} from "../gatheringPlace"
import {APIGatheringPlaceSetting} from "../../types/api"


export const convertAPIGatheringPlaceSettingToGatheringPlaceSetting = (
  apiGatheringPlaceSetting: APIGatheringPlaceSetting
): GatheringPlaceSetting => {
  return {...apiGatheringPlaceSetting, isSaved: true}
}

export const convertGatheringPlaceSettingToAPIGatheringPlaceSetting = (gatheringPlaceSetting: GatheringPlaceSetting): APIGatheringPlaceSetting => {
  return gatheringPlaceSetting
}

export const getGatheringPlaceSettingsFromBackend = async (): Promise<SuccessWithData<GatheringPlaceSetting[]>|Failure> => {
  const result = await getWithJWT<APIGatheringPlaceSetting[]>(
    "gathering-place-settings/"
  )
  if (result.ok) {
    return {
      ...result,
      data: result.data.map(convertAPIGatheringPlaceSettingToGatheringPlaceSetting)
    }
  }
  return result
}

export const createGatheringPlaceSettingOnBackend = async (
  gatheringPlaceSetting: APIGatheringPlaceSetting
): Promise<SuccessWithData<GatheringPlaceSetting>|Failure> => {
  const result = await postWithJWT<APIGatheringPlaceSetting>(
    "gathering-place-settings/",
    gatheringPlaceSetting
  )
  if (result.ok) {
    return {
      ...result,
      data: {...result.data, isSaved: true}
    }
  }
  return result
}