import React from 'react';
import {Box, makeStyles, Typography} from "@material-ui/core"
import {useRouter} from "next/router"
import EventsCalendar from "../../EventsTable/EventsCalendar"
import {CollapsibleH5, NewH5} from "../../Header"
import {getEvents} from "../../../utils/api/event"
import {useQuery} from "react-query"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {UpcomingEventsList} from "../../EventsList/UpcomingEventsList"
import {ActionItem} from "../../ActionItem"

const useStyles = makeStyles({
  calendarContainer: {
    backgroundColor: "white",
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
          <ActionItem
            title={"新しいイベントを作成する"}
            description={"イベントの日程や配置の詳細を設定してイベントを作成し、配置付けができるようにします。"}
            buttonText={"作成"}
            onClick={()=>router.push("/events/new/")}
          />
          <ActionItem
            title={"イベントのリストを見る"}
            description={"現在作成されているイベントのリストを閲覧できます。"}
            buttonText={"見る"}
            onClick={()=>router.push("/events/list/")}
          />
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
        <Box className={classes.calendarContainer}>
          <EventsCalendar events={events} />
        </Box>
      </CollapsibleH5>
    </Box>
  </Box>
}

export default Index