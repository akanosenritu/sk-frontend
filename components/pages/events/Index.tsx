import React from 'react';
import {Box, Button, makeStyles, Typography} from "@material-ui/core"
import {useRouter} from "next/router"
import EventsCalendar from "../../EventsTable/EventsCalendar"
import {CollapsibleH5, NewH5} from "../../Header"
import {getEvents} from "../../../utils/api/event"
import {useQuery} from "react-query"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {UpcomingEventsList} from "../../EventsList/UpcomingEventsList"

const useStyles = makeStyles({
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

  const {data: events, error, isLoading} = useQuery(["events", {}], () => getEvents({}))

  if (error) return <ContentRetrievalFailedNotice description={"イベント情報の取得に失敗しました"} />
  if (isLoading || events === undefined) return <ContentRetrievingNotice />

  return <Box>
    <Box className={classes.titleBox} mt={2}>
      <Typography variant={"h4"}>イベント管理</Typography>
    </Box>
    <Box mt={2}>
      <NewH5 title={"操作"}>
        <Box display={"flex"} justifyContent={"center"}>
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
                <Button color={"primary"} variant={"contained"} onClick={()=>router.push("/events/list/")}>見る</Button>
              </div>
            </Box>
          </Box>
        </Box>
      </NewH5>
    </Box>
    <Box mt={2}>
      <CollapsibleH5 title={"直近のイベント"} isOpen={true}>
        <UpcomingEventsList />
      </CollapsibleH5>
    </Box>
    <Box mt={2}>
      <CollapsibleH5 title={"イベントカレンダー"} isOpen={true}>
        <EventsCalendar events={events} />
      </CollapsibleH5>
    </Box>
  </Box>
}

export default Index