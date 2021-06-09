import {getWithParams, post, putWritable} from "./api"
import {
  APIRegisteredStaff,
  convertAPIRegisteredStaffToRegisteredStaff,
  convertRegisteredStaffToAPIRegisteredStaff
} from "./staff"
import {Mail, MailsForEvent} from "../../types/mail"
import {APIEvent} from "../../types/api"
import {convertAPIEventToEvent, convertEventToAPIEvent} from "./event"
import {APIMailTemplate, convertAPIMailTemplateToMailTemplate} from "./mailTemplate"
import {RegisteredStaff} from "../../types/staffs"
import {Event} from "../../types/positions"

export type APIMail = {
  uuid: string,
  recipient: APIRegisteredStaff,
  is_sent: boolean,
  sent_at_datetime: Date,
  content: string,
}

export type WritableAPIMail = APIMail & {
  recipient_uuid: string,
}

export type APIMailsForEvent = {
  uuid: string,
  event: APIEvent,
  default_template: APIMailTemplate | null,
  confirm_date_limit: string | null,
  mails: APIMail[],
}

export type WritableAPIMailsForEvent = APIMailsForEvent & {
  default_template_uuid: string | null,
  event_uuid: string,
  mail_uuids: string[],
}

export const convertAPIMailToMail = (apiMail: APIMail): Mail => {
  return {
    ...apiMail,
    recipient: convertAPIRegisteredStaffToRegisteredStaff(apiMail.recipient),
    isSent: apiMail.is_sent,
    sentAtDatetime: apiMail.sent_at_datetime,
    isSaved: true,
    isEdited: false,
  }
}

export const convertMailToAPIMail = (mail: Mail): APIMail => {
  return {
    ...mail,
    recipient: convertRegisteredStaffToAPIRegisteredStaff(mail.recipient),
    is_sent: mail.isSent,
    sent_at_datetime: mail.sentAtDatetime,
  }
}

export const convertMailsForEventToAPIMailsForEvent = (mailsForEvent: MailsForEvent): APIMailsForEvent => {
  return {
    ...mailsForEvent,
    default_template: mailsForEvent.defaultTemplate,
    event: convertEventToAPIEvent(mailsForEvent.event),
    mails: mailsForEvent.mails.map(mail => convertMailToAPIMail(mail)),
    confirm_date_limit: mailsForEvent.confirmDateLimit? mailsForEvent.confirmDateLimit.toISOString(): null
  }
}

export const convertAPIMailsForEventToMailsForEvent = (apiMailsForEvent: APIMailsForEvent): MailsForEvent => {
  return {
    ...apiMailsForEvent,
    defaultTemplate: apiMailsForEvent.default_template? convertAPIMailTemplateToMailTemplate(apiMailsForEvent.default_template): null,
    event: convertAPIEventToEvent(apiMailsForEvent.event),
    mails: apiMailsForEvent.mails.map(mail => convertAPIMailToMail(mail)),
    confirmDateLimit: apiMailsForEvent.confirm_date_limit? new Date(apiMailsForEvent.confirm_date_limit): null,
    isEdited: false,
    isSaved: true,
  }
}

export const convertAPIMailsForEventToWritableAPIMailsForEvent = (apiMailsForEvent: APIMailsForEvent): WritableAPIMailsForEvent => {
  return {
    ...apiMailsForEvent,
    default_template_uuid: apiMailsForEvent.default_template? apiMailsForEvent.default_template.uuid: null,
    event_uuid: apiMailsForEvent.event.uuid,
    mail_uuids: apiMailsForEvent.mails.map(mail => mail.uuid)
  }
}

export const getMailsForEvent = async (eventUUID: string): Promise<SuccessWithData<MailsForEvent>|Failure> => {
  const result = await getWithParams<APIMailsForEvent>("get-mails-for-event/", {event_uuid: [eventUUID]})
  if (result.ok) {
    return {
      ...result,
      data: convertAPIMailsForEventToMailsForEvent(result.data)
    }
  }
  return result
}

export const updateMailsForEvent = async (mailsForEvent: MailsForEvent): Promise<SuccessWithData<MailsForEvent>|Failure> => {
  const result = await putWritable<WritableAPIMailsForEvent, APIMailsForEvent>(
    `mails-for-events/${mailsForEvent.uuid}/`,
    convertAPIMailsForEventToWritableAPIMailsForEvent(convertMailsForEventToAPIMailsForEvent(mailsForEvent))
  )
  if (result.ok) {
    return {
      ...result,
      data: convertAPIMailsForEventToMailsForEvent(result.data)
    }
  }
  return result
}

export const checkIsMailSendable = async (recipient: RegisteredStaff, event: Event): Promise<SuccessWithData<boolean>> => {
  const result = await getWithParams("send-mail/", {
    event_uuid: [event.uuid],
    recipient_staff_uuid: [recipient.uuid],
  })
  if (result.ok) {
    return {
      ok: true,
      data: true
    }
  } else {
    return {
      ok: true,
      data: false
    }
  }
}

export const sendMail = async (recipient: RegisteredStaff, subject: string, message: string, event: Event): Promise<Success|Failure> => {
  return post("send-mail/", {
    message,
    subject,
    from_email: "john-doe@example.com",
    recipient_staff_uuid: recipient.uuid,
    event_uuid: event.uuid
  })
}