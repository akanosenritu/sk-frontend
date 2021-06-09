import React from "react"
import {Box, makeStyles} from "@material-ui/core"
import {useQuery} from "react-query"
import {getEvents} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {EventsListItem} from "../../EventsList/EventsListItem"
import {BasicPageTitle} from "../../BasicPageTitle"

const useStyles = makeStyles({
  root: {
    backgroundColor: "#f2f2f2",
  },
  titleBox: {
    display: "flex",
    justifyContent: "center"
  },
})

export const List: React.FC<{}> = () => {
  const classes = useStyles()
  const {data: events, error, isLoading} = useQuery(["events", {}], () => getEvents({}))

  if (error) return <ContentRetrievalFailedNotice description={"イベント情報の取得に失敗しました"} />
  if (isLoading || events === undefined) return <ContentRetrievingNotice />

  return <Box className={classes.root}>
    <BasicPageTitle descriptions={""} title={"イベントリスト"} />
    <Box mt={2}>
      {events.map(event => <EventsListItem event={event} />)}
    </Box>
  </Box>
}