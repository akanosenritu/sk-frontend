import React from "react"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {MailManager} from "../../MailManager/MailManager"
import {useStaffs} from "../../../utils/staff"
import {useMailsForEvent} from "../../../utils/mail"
import {BasicPage} from "../../BasicPage"
import {useRouter} from "next/router"

export const Mail: React.FC<{
  eventUUID: string
}> = props => {
  const {mailsForEvent, error: mailsForEventError, update: updateMailsForEvent} = useMailsForEvent(props.eventUUID)
  const {staffsDict, error: staffsError} = useStaffs()
  const router = useRouter()
  if (mailsForEventError) return <ContentRetrievalFailedNotice description={mailsForEventError} />
  if (staffsError) return <ContentRetrievalFailedNotice description={staffsError} />
  if (!mailsForEvent || !staffsDict) return <ContentRetrievingNotice />
  return <BasicPage
    descriptions={
      "配置に基づいて自動生成されたメールの文面を確認できます。\n" +
      "メールの文面はテンプレートに数値を埋め込むことで生成されます。\n" +
      ""
    }
    onClickBack={()=>router.push(`/events/${props.eventUUID}/`)}
    title={"確認メール"}
  >
    <MailManager
      event={mailsForEvent.event}
      mailsForEvent={mailsForEvent}
      staffsDict={staffsDict}
      updateMailsForEvent={updateMailsForEvent}
    />
  </BasicPage>
}