import React from "react"
import {getEventByUUID} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {EventStaffAssignmentEditor} from "../../EventStaffAssignmentEditor/EventStaffAssignmentEditor"
import {useRouter} from "next/router"
import {BasicPage} from "../../BasicPage"
import {useQuery} from "react-query"

export const Assign: React.FC<{
  eventUUID: string
}> = (props) => {
  const {data: event, error} = useQuery(`events/${props.eventUUID}/`, () => getEventByUUID(props.eventUUID))
  const router = useRouter()
  if (error) return <ContentRetrievalFailedNotice description={"イベントデータの取得に失敗しました。"} />
  if (!event) return <ContentRetrievingNotice />
  return <BasicPage
    descriptions={
      "配置にスタッフを割り当てます。その日に割当可能なスタッフが一番下の列「配置可能なスタッフ」に表示されています。\n" +
      "スタッフ名をドラッグして割り当てる配置の上にドロップすると割当できます。\n" +
      "この配置表に基づいてスタッフに送られるメールが作成されます。"
    }
    onClickBack={()=>router.push(`/events/${props.eventUUID}/`)}
    title={"スタッフ割当"}
  >
    <EventStaffAssignmentEditor event={event} />
  </BasicPage>
}