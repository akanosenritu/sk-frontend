import React from "react"
import {getEventByUUID} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {EventStaffAssignmentEditor} from "../../EventStaffAssignmentEditor/EventStaffAssignmentEditor"
import {useRouter} from "next/router"
import {useQuery} from "react-query"
import {BasicPageTitle} from "../../BasicPageTitle"
import {BottomNavigationWithBackButton} from "../../BackButton"
import {Button} from "@material-ui/core"

export const Assign: React.FC<{
  eventUUID: string
}> = (props) => {
  const {data: event, error} = useQuery(`events/${props.eventUUID}/`, () => getEventByUUID(props.eventUUID))
  const router = useRouter()
  if (error) return <ContentRetrievalFailedNotice description={"イベントデータの取得に失敗しました。"} />
  if (!event) return <ContentRetrievingNotice />
  return <div
  >
    <BasicPageTitle descriptions={"配置にスタッフを割り当てます。"} title={"スタッフ割り当て"} />
    <EventStaffAssignmentEditor event={event} />
    <BottomNavigationWithBackButton onClickBack={()=>router.push(`/events/${props.eventUUID}/`)}>
      <Button
        color={"primary"}
        fullWidth={true}
        onClick={()=>router.push(`/events/${props.eventUUID}/mail/`)}
        variant={"contained"}
      >
        メール送信に進む
      </Button>
    </BottomNavigationWithBackButton>
  </div>
}