import React from 'react'
import {Box, makeStyles, Typography} from "@material-ui/core"
import {useRouter} from "next/router"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../../RetrievalRequiredContent"
import {getEventByUUID} from "../../../../utils/api/event"
import {useQuery} from "react-query"
import {ActionItem} from "../../../ActionItem"
import {NewH5} from "../../../Header"
import {EventsListItem} from "../../../EventsList/EventsListItem"
import {BackButton} from "../../../BackButton"

const useStyles = makeStyles({
  contentBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
  },
  titleBox: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
})

export const Detail: React.FC<{
  eventUUID: string,
}> = (props) => {
  const router = useRouter()
  const classes = useStyles()
  const {data: event, error} = useQuery(`events/${props.eventUUID}/`, ()=>getEventByUUID(props.eventUUID))

  if (error) return <ContentRetrievalFailedNotice description={"イベントデータの取得に失敗しました"} />
  if (!event) return <ContentRetrievingNotice />
  return <div>
    <Box className={classes.titleBox} mt={2}>
      <Typography variant={"h4"}>{event.title}</Typography>
    </Box>
    <Box my={2}>
      <EventsListItem event={event} />
    </Box>
    <Box className={classes.contentBox} m={1} mt={2}>
      <NewH5 title={"操作"}>
        <Box mt={2} mx={5} style={{margin: "auto", display: "flex", justifyContent: "center"}}>
          <ActionItem
            title={"イベントの設定を編集する"}
            description={"このイベントの設定を編集します。すでにスタッフ割当がされていた場合には新しい設定との間で不整合が生じるため、修正する必要があります。"}
            buttonText={"編集"}
            onClick={()=>router.push(`/events/${event.uuid}/edit/`)}
          />
          <ActionItem
            title={"イベントにスタッフを割り当てる"}
            description={"イベント設定に基づいて、スタッフの割当を行います。"}
            buttonText={"割当"}
            onClick={()=>router.push(`/events/${event.uuid}/assign/`)}
          />
          <ActionItem
            title={"生成されたメールを確認する"}
            description={"イベント設定とスタッフ割当に基づいて生成された個人別のメールの文面の編集を閲覧できます。"}
            buttonText={"確認"}
            onClick={()=>router.push(`/events/${event.uuid}/mail/`)}
          />
        </Box>
      </NewH5>
    </Box>
    <Box my={2}>
      <BackButton onClick={()=>router.push("/events/")} />
    </Box>
  </div>
}
