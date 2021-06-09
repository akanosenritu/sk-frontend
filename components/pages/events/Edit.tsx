import React from 'react'
import EventEditor from "./EventEditor"
import {getEventByUUID} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {BackButton} from "../../BackButton"
import {useRouter} from "next/router"
import {Box} from "@material-ui/core"
import {useQuery} from "react-query"

const Edit: React.FC<{
  eventUUID: string
}> = (props) => {
  const {data: event, error} = useQuery(`events/${props.eventUUID}/`, () => getEventByUUID(props.eventUUID))
  const router = useRouter()
  if (error) return <ContentRetrievalFailedNotice description={"イベントの取得に失敗しました。"} />
  if (!event) return <ContentRetrievingNotice />
  return <div>
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/events/${props.eventUUID}/`)} />
    </Box>
    <EventEditor event={event} />
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/events/${props.eventUUID}/`)} />
    </Box>
  </div>
};

export default Edit