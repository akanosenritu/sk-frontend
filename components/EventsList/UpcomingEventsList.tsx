import React from "react"
import {Box} from "@material-ui/core"
import {useQuery} from "react-query"
import {formatDateToYYYYMMDD} from "../../utils/time"
import {getEvents} from "../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../pages/RetrievalRequiredContent"
import {EventsListItem} from "./EventsListItem"

export const UpcomingEventsList: React.FC<{}> = () => {
  const today = formatDateToYYYYMMDD(new Date())
  const {data: events, error, isLoading} = useQuery(
    ["events", {within_week: today}],
    () => getEvents({within_week: today})
  )
  if (error) return <ContentRetrievalFailedNotice description={"イベントリストの取得に失敗しました"} />
  if (isLoading || events === undefined) return <ContentRetrievingNotice />
  if (events.length === 0) return <Box display={"flex"} justifyContent={"center"}><Box>直近一週間以内にはイベントがありません。</Box></Box>
  return <Box>
    {events.map(event => <EventsListItem event={event} />)}
  </Box>
}