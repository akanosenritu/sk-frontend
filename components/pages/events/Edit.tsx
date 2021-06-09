import React from 'react'
import {EventEditor} from "./EventEditor"
import {getEventByUUID} from "../../../utils/api/event"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {BottomNavigationWithBackButton} from "../../BackButton"
import {useRouter} from "next/router"
import {Box, Button} from "@material-ui/core"
import {useQuery} from "react-query"
import {BasicPageTitle} from "../../BasicPageTitle"


const Edit: React.FC<{
  eventUUID: string
}> = (props) => {
  const {data: event, error} = useQuery(`events/${props.eventUUID}/`, () => getEventByUUID(props.eventUUID))
  const router = useRouter()
  if (error) return <ContentRetrievalFailedNotice description={"イベントの取得に失敗しました。"} />
  if (!event) return <ContentRetrievingNotice />
  return <div>
    <BasicPageTitle descriptions={"イベントの設定を編集できます。"} title={"イベントを編集"} />
    <Box mt={2}>
      <EventEditor event={event} />
    </Box>
    <Box my={2}>
      <BottomNavigationWithBackButton onClickBack={()=>router.push(`/events/${props.eventUUID}/`)}>
        <Button
          color={"primary"}
          fullWidth={true}
          onClick={()=>router.push(`/events/${props.eventUUID}/assign/`)}
          variant={"contained"}
        >
          スタッフの割当に進む
        </Button>
      </BottomNavigationWithBackButton>
    </Box>
  </div>
};

export default Edit