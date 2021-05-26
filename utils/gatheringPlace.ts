import {v4} from "uuid"

export type GatheringPlaceSetting = {
  uuid: string,
  isSaved: boolean,
  title: string,
  content: string,
}

export const createBlankGatheringPlaceSetting = (): GatheringPlaceSetting => ({
  uuid: v4(),
  isSaved: false,
  title: "デフォルトのタイトル",
  content: "デフォルトの説明"
})

export const cloneGatheringPlaceSetting = (setting: GatheringPlaceSetting): GatheringPlaceSetting => {
  return {...setting, uuid: v4(), isSaved: false}
}

export const defaultGatheringPlaceSettings: GatheringPlaceSetting[] = [
  {
    uuid: "ac5a4fc7-b392-4d9c-9571-477317e77591",
    isSaved: false,
    title: "ビッグサイト　ダイアモンドヘッド前",
    content: "ビッグサイト正面、ダイアモンドヘッド広場の国際展示場駅寄りの部分。"
  },
  {
    uuid: "907daf09-fd75-4a6a-b518-c755de2ce6aa",
    isSaved: false,
    title: "幕張メッセ　東2ゲート",
    content: "幕張メッセ、東2ゲート前。"
  },
]