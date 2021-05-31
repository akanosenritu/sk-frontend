import React, {useEffect, useState} from 'react';
import {Box, Button, Typography} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"
import {useRouter} from "next/router"
import {Event} from "../../../types/positions"
import EventsCalendar from "./EventsTable/EventsCalendar"
import PageWithDrawer from "../PageWithDrawer"
import {getEvents} from "../../../utils/api/event"

const useStyles = makeStyles({
  calendarBox: {
  },
  contentBox: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    width: "80%",
  },
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleBox: {
    display: "flex",
    justifyContent: "center"
  },
})
const Index: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()

  const [events, setEvents] = useState<Event[]>([])
  useEffect(() => {
    getEvents()
      .then(result => {
        if (result.ok) setEvents(result.data)
      })
  }, [])

  return <PageWithDrawer>
    <Box className={classes.titleBox} mt={2}>
      <Typography variant={"h4"}>イベント管理</Typography>
    </Box>
    <Box mt={2} mx={5} style={{margin: "auto", display: "flex", justifyContent: "center"}}>
      <Box style={{border: "1px solid darkgray", borderRadius: 5, width: 400}} m={3}>
        <Box m={2}><Typography variant={"h6"}>新しいイベントを追加する</Typography></Box>
        <Box m={2}>イベントの日程や配置の詳細を設定してイベントを作成し、配置付けができるようにします。</Box>
        <Box style={{display: "flex", justifyContent: "center"}} my={2}>
          <div>
            <Button color={"primary"} variant={"contained"} onClick={()=>router.push("/events/new/")}>追加</Button>
          </div>
        </Box>
      </Box>
      <Box style={{border: "1px solid darkgray", borderRadius: 5, width: 400}} m={3}>
        <Box m={2}><Typography variant={"h6"}>イベントのリストを見る</Typography></Box>
        <Box m={2}>現在利用可能なイベントのリストが閲覧できます。</Box>
        <Box style={{display: "flex", justifyContent: "center"}} my={2}>
          <div>
            <Button color={"primary"} variant={"contained"} onClick={()=>router.push("/events/new/")} disabled={true}>見る</Button>
          </div>
        </Box>
      </Box>
    </Box>
    <Box mt={2} className={classes.calendarBox} style={{margin: "auto"}}>
      {events && <EventsCalendar events={events} /> }
    </Box>
  </PageWithDrawer>
}

export default Index