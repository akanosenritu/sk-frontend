import {RegisteredStaff} from "../types/staffs"
import {AssignmentsByDay} from "./event"
import {Event, PositionGroup} from "../types/positions"
import {Position} from "../types/position"
import {format} from "date-fns"
import {formatDateTimeToJaMDEEEHm, rawTimeToString} from "./time"
import {getValueWithDefault} from "./positions"
import {ja} from "date-fns/locale"
import {Setting} from "./setting"
import {useEffect, useState} from "react"
import {getMailTemplates} from "./api/mailTemplate"

export const mailTemplateDataKeys = [
  "clothes",
  "confirmationDateLimit",
  "eventTitle",
  "footer",
  "gatheringPlaces",
  "header",
  "mainData",
  "recipient",
] as const

export type TemplateDataKey = typeof mailTemplateDataKeys[number]

export const mailTemplateDataKeyDescriptions:  {[key in TemplateDataKey]: string} = {
  clothes: "服装の説明",
  confirmationDateLimit: "確認期限",
  eventTitle: "イベント名",
  footer: "本文最下部に挿入されるフッター",
  gatheringPlaces: "集合場所の説明",
  header: "本文最上部に挿入されるヘッダー",
  mainData: "集合時間・場所・服装のデータ",
  recipient: "メールの受取人",
}

export type MailTemplateData = {
  [key in typeof mailTemplateDataKeys[number]]: string
}

export const createDayAssignmentString = (position: Position, positionGroup: PositionGroup) => {
  const {date} = position
  const startHourString = rawTimeToString(getValueWithDefault("startHour", position.data, positionGroup.defaultPositionData).value)
  const clothes = getValueWithDefault("clothes", position.data, positionGroup.defaultPositionData).value.title
  const gatheringPlace = getValueWithDefault("gatheringPlace", position.data, positionGroup.defaultPositionData).value.title
  return `${format(date, "M月dd日 (eee)", {locale: ja})}
    集合時間: ${startHourString}
    　　服装: ${clothes}
    　　場所: ${gatheringPlace}`
}

export const createMainData = (assignmentsByDay: AssignmentsByDay): string => {
  const dayStrings = Object.keys(assignmentsByDay).sort()
  return dayStrings
    .map(dayString => assignmentsByDay[dayString])
    .map(obj => createDayAssignmentString(obj.position, obj.positionGroup))
    .join("\n")
}

const gatherSettings = (target: "clothes" | "gatheringPlace" ,assignmentsByDay: AssignmentsByDay): Setting[] => {
  const settingsDict: {[settingUUID: string]: Setting} = {}
  Object.values(assignmentsByDay).map(obj => {
    const {position, positionGroup} = obj
    const setting = getValueWithDefault(target, position.data, positionGroup.defaultPositionData).value
    settingsDict[setting.uuid] = setting
  })
  return Object.values(settingsDict)
}

const createSettingDescription = (setting: Setting): string => {
  return `◎${setting.title}
      ${setting.content}`
}
const createSettingsDescription = (settings: Setting[]): string => {
  return settings.map(setting => createSettingDescription(setting)).join("\n")
}

export const createDefaultSubject = (event: Event) => {
  return `[業務確定] ${event.title}`
}

export const getTemplateData = (staff: RegisteredStaff, assignmentsByDay: AssignmentsByDay, event: Event, confirmationDateLimit: Date): MailTemplateData => {
  return {
    clothes: createSettingsDescription(gatherSettings("clothes", assignmentsByDay)),
    confirmationDateLimit: formatDateTimeToJaMDEEEHm(confirmationDateLimit),
    eventTitle: event.title,
    footer: "株式会社S・K \nTEL：03-5312-7628\n平日：10時～18時",
    gatheringPlaces: createSettingsDescription(gatherSettings("gatheringPlace", assignmentsByDay)),
    header: "お疲れ様です。\n株式会社S・Kです。",
    mainData: createMainData(assignmentsByDay),
    recipient: `${staff.lastName} ${staff.firstName}`,
  }
}

export const useMailTemplates = () => {
  const [mailTemplates, setMailTemplates] = useState<MailTemplate[]|null>(null)
  const [error, setError] = useState<string|null>(null)
  useEffect(() => {
    getMailTemplates()
      .then(result => {
        if (result.ok) {
          setMailTemplates(result.data)
        } else {
          setError("Failed to retrieve mail templates.")
        }
      })
  }, [])
  return {mailTemplates, error}
}