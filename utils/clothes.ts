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

export const defaultClothesSettings: ClothesSetting[] = [
  {
    uuid: "e7b78b19-894d-4118-915f-e0ae037b7ecd",
    isSaved: true,
    title:"スーツ",
    content: "男性＝ダーク系スーツ、ジャケット、ネクタイ、白無地Ｙシャツ、黒革靴\n女性＝ダーク系スーツ、ジャケット、白無地襟付きブラウス、黒パンプス（スカート、パンツ可）",
  },
  {
    uuid: "c7b58c33-d8e3-43f0-a5ed-31928df8f42b",
    isSaved: true,
    title: "カジュアル",
    content: "男性・女性＝チノパン、スニーカー",
  }
]