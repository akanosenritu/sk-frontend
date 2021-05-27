import {v4} from "uuid"
import {useEffect, useState} from "react"
import {createClothesSettingOnBackend, getClothesSettingsFromBackend} from "./api/clothesSetting"
import {ClothesSetting} from "./clothes"
import {Failure, Success} from "./api/api"
import {GatheringPlaceSetting} from "./gatheringPlace"
import {createGatheringPlaceSettingOnBackend, getGatheringPlaceSettingsFromBackend} from "./api/gatheringPlaceSetting"

export type Setting = {
  uuid: string,
  isSaved: boolean,
  title: string,
  content: string,
}

export const createBlankSetting = (): Setting => ({
  uuid: v4(),
  isSaved: false,
  title: "デフォルトのタイトル",
  content: "デフォルトの説明"
})

export const cloneSetting = (setting:Setting): Setting => {
  return {...setting, uuid: v4(), isSaved: false}
}

export const useClothesSettings = () => {
  const [settings, setSettings] = useState<ClothesSetting[]>([])
  useEffect(() => {
    getClothesSettingsFromBackend()
      .then(result => {
        if (result.ok) {
          setSettings(result.data)
        }
      })
  }, [])

  const createSetting = async (newSetting: ClothesSetting): Promise<Success|Failure> => {
    const result = await createClothesSettingOnBackend(newSetting)
    if (result.ok) {
      setSettings([...settings, result.data])
      return result
    }
    return result
  }

  // const updateSettings = (updatedSetting: ClothesSetting) => {}

  return {settings, createSetting}
}

export const useGatheringPlaceSettings = () => {
  const [settings, setSettings] = useState<GatheringPlaceSetting[]>([])
  useEffect(() => {
    getGatheringPlaceSettingsFromBackend()
      .then(result => {
        if (result.ok) {
          setSettings(result.data)
        }
      })
  }, [])

  const createSetting = async (newSetting: GatheringPlaceSetting): Promise<Success|Failure> => {
    const result = await createGatheringPlaceSettingOnBackend(newSetting)
    if (result.ok) {
      setSettings([...settings, result.data])
      return result
    }
    return result
  }

  return {settings, createSetting}
}