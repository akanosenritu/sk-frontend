import React　from "react"
import {useEvent} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import EventStaffAssignmentEditor from "../../EventStaffAssignmentEditor/EventStaffAssignmentEditor"


const Assign: React.FC<{
  eventUUID: string
}> = (props) => {
  const {event, error} = useEvent(props.eventUUID)
  if (error) return <ContentRetrievalFailedNotice description={error} />
  if (!event) return <ContentRetrievingNotice />
  return <EventStaffAssignmentEditor event={event} />
}

export default Assign