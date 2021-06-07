import {RegisteredStaff} from "./staffs"
import {Event} from "./positions"

declare type Mail = {
  recipient: RegisteredStaff,
  isSent: boolean,
  sentAtDatetime: Date,
  content: string,
} & ObjectInfo

declare type MailsForEvent = {
  event: Event,
  defaultTemplate: MailTemplate | null,
  mails: Mail[]
} & ObjectInfo
