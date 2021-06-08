import React from 'react'
import EventEditor from "./EventEditor"
import {useEvent} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {BackButton} from "../../BackButton"
import {useRouter} from "next/router"
import {Box} from "@material-ui/core"

const Edit: React.FC<{
  eventUUID: string
}> = (props) => {
  const {event, error} = useEvent(props.eventUUID)
  const router = useRouter()
  if (error) return <ContentRetrievalFailedNotice description={error} />
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