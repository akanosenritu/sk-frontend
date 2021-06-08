import React　from "react"
import {useEvent} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import EventStaffAssignmentEditor from "../../EventStaffAssignmentEditor/EventStaffAssignmentEditor"
import {useRouter} from "next/router"
import {BackButton} from "../../BackButton"
import {Box} from "@material-ui/core"


const Assign: React.FC<{
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
    <EventStaffAssignmentEditor event={event} />
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/events/${props.eventUUID}/`)} />
    </Box>
  </div>
}

export default Assign