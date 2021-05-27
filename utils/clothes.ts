import {v4} from "uuid"

export type ClothesSetting = {
  uuid: string,
  isSaved: boolean,
  title: string,
  content: string,
}

export const createBlankClothesSetting = (): ClothesSetting => ({
  uuid: v4(),
  isSaved: false,
  title: "デフォルトのタイトル",
  content: "デフォルトのコンテンツ"
})

export const cloneClothesSetting = (setting: ClothesSetting): ClothesSetting => {
  return {...setting, uuid: v4(), isSaved: false, title: setting.title + " (コピー)"}
}