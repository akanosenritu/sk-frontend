import {Event, PositionGroup} from "../types/positions"
import {v4} from "uuid"

export const createDefaultEvent = (): Event => ({
  title: "",
  datetimeAdded: new Date(),
  datetimeLastModified: new Date(),
  uuid: v4(),
  isEdited: false,
  isSaved: false,
  positionGroups: [] as PositionGroup[]
})

type ValidateEventErrors = {
  [fieldName: string]: string
}
type ValidateEventResult = {
  ok: boolean,
  errors: ValidateEventErrors,
}
export const validateEvent = (event: Event): ValidateEventResult => {
  const errors: ValidateEventErrors = {}
  if (!event.isEdited) errors["編集なし"] = "編集が行われていないため、保存する必要がありません。"
  if (event.title === "") errors["イベント名"] = "イベント名が空白のイベントは作成できません。"
  if (event.positionGroups.length === 0) errors["配置"] = "配置のないイベントは作成できません。イベントには必ず１つ以上の配置が必要です。"
  return {ok: Object.keys(errors).length === 0, errors}
}