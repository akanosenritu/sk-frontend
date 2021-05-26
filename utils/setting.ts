import {v4} from "uuid"
import {useState} from "react"

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

export const useSettings = (initialSettings: Setting[]) => {
  const [settings, setSettings] = useState<Setting[]>(initialSettings)
  const updateSettings = (newSettings: Setting[]) => {
    setSettings(newSettings)
    console.log("updated?", newSettings)
  }
  return {settings, updateSettings}
}