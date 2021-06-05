import React from 'react'
import EventEditor from "./EventEditor"
import {useEvent} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"

const Edit: React.FC<{
  eventUUID: string
}> = (props) => {
  const {event, error} = useEvent(props.eventUUID)
  if (error) return <ContentRetrievalFailedNotice description={error} />
  if (!event) return <ContentRetrievingNotice />
  return <EventEditor event={event} />
};

export default Edit