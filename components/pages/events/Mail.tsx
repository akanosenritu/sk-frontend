import React from "react"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {MailManager} from "../../MailManager/MailManager"
import {useStaffs} from "../../../utils/staff"
import {useMailsForEvent} from "../../../utils/mail"

export const Mail: React.FC<{
  eventUUID: string
}> = props => {
  const {mailsForEvent, error: mailsForEventError, update: updateMailsForEvent} = useMailsForEvent(props.eventUUID)
  const {staffsDict, error: staffsError} = useStaffs()
  if (mailsForEventError) return <ContentRetrievalFailedNotice description={mailsForEventError} />
  if (staffsError) return <ContentRetrievalFailedNotice description={staffsError} />
  if (!mailsForEvent || !staffsDict) return <ContentRetrievingNotice />
  return <MailManager
    event={mailsForEvent.event}
    mailsForEvent={mailsForEvent}
    staffsDict={staffsDict}
    updateMailsForEvent={updateMailsForEvent}
  />
}