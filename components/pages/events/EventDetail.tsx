import React, {useEffect, useState} from 'react'
import {Box, Button, Typography} from "@material-ui/core"
import AuthenticationRequiredContent from "../AuthenticationRequiredContent"
import {useRouter} from "next/router"
import {Event} from "../../../types/positions"
import {ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {getEventByUUID} from "../../../utils/api/event"

const EventDetail: React.FC<{
  eventUUID: string,
}> = (props) => {
  const router = useRouter()
  const [event, setEvent] = useState<Event|null>(null)
  useEffect(() => {
    getEventByUUID(props.eventUUID)
      .then(result => {
        if (result.ok) setEvent(result.data)
      })
  }, [props.eventUUID])

  if (!event) return <ContentRetrievingNotice />
  return <AuthenticationRequiredContent>
    <Box>
      <Typography variant={"h5"}>イベント名: {event.title}</Typography>
      <Box mt={2} mx={5} style={{margin: "auto", display: "flex", justifyContent: "center"}}>
        <Box style={{border: "1px solid darkgray", borderRadius: 5, width: 400}} m={3}>
          <Box m={2}><Typography variant={"h6"}>イベントの設定を編集する</Typography></Box>
          <Box m={2}>このイベントの設定を編集します。すでにスタッフ割当がされていた場合には新しい設定との間で不整合が生じるため、修正する必要があります。</Box>
          <Box style={{display: "flex", justifyContent: "center"}} my={2}>
            <div>
              <Button color={"primary"} variant={"contained"} onClick={()=>router.push(`/events/${event.uuid}/edit/`)}>見る</Button>
            </div>
          </Box>
        </Box>
        <Box style={{border: "1px solid darkgray", borderRadius: 5, width: 400}} m={3}>
          <Box m={2}><Typography variant={"h6"}>イベントにスタッフを割り当てる</Typography></Box>
          <Box m={2}>イベント設定に基づいて、スタッフの割当を行います。</Box>
          <Box style={{display: "flex", justifyContent: "center"}} my={2}>
            <div>
              <Button color={"primary"} variant={"contained"} onClick={()=>router.push(`/events/${event.uuid}/assign/`)} disabled={true}>見る</Button>
            </div>
          </Box>
        </Box>
        <Box style={{border: "1px solid darkgray", borderRadius: 5, width: 400}} m={3}>
          <Box m={2}><Typography variant={"h6"}>生成されたメールを確認する</Typography></Box>
          <Box m={2}>イベント設定とスタッフ割当に基づいて生成された個人別のメールの文面の編集を閲覧できます。</Box>
          <Box style={{display: "flex", justifyContent: "center"}} my={2}>
            <div>
              <Button color={"primary"} variant={"contained"} onClick={()=>router.push(`/events/${event.uuid}/mails/`)} disabled={true}>見る</Button>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  </AuthenticationRequiredContent>
}

export default EventDetail
