import {Failure, get, post, SuccessWithData} from "./api"
import {ClothesSetting} from "../clothes"
import {APIClothesSetting} from "../../types/api"

export const convertAPIClothesSettingToClothesSetting = (apiClothesSetting: APIClothesSetting): ClothesSetting => {
  return {...apiClothesSetting, isSaved: true}
}

export const convertClothesSettingsToAPIClothesSettings = (clothesSetting: ClothesSetting): APIClothesSetting => {
  return clothesSetting
}

export const getClothesSettingsFromBackend = async (): Promise<SuccessWithData<ClothesSetting[]>|Failure> => {
  const result = await get<APIClothesSetting[]>(
    "clothes-settings/"
  )
  if (result.ok) {
    return {
      ...result,
      data: result.data.map(convertAPIClothesSettingToClothesSetting)
    }
  }
  return result
}

export const createClothesSettingOnBackend = async (
  clothesSetting: ClothesSetting
): Promise<SuccessWithData<ClothesSetting>|Failure> => {
  const result = await post<APIClothesSetting>(
    "clothes-settings/",
    convertClothesSettingsToAPIClothesSettings(clothesSetting)
  )
  if (result.ok) {
    return {
      ...result,
      data: {...result.data, isSaved: true}
    }
  }
  return result
}