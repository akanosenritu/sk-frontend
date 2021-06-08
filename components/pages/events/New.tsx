import React from 'react'
import EventEditor from "./EventEditor"
import {createDefaultEvent} from "../../../utils/event"
import {useRouter} from "next/router"
import {BackButton} from "../../BackButton"
import {Box} from "@material-ui/core"

const New = () => {
  const newEvent = createDefaultEvent()
  const router = useRouter()
  return <div>
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/events/`)} />
    </Box>
    <EventEditor event={newEvent} />
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/events/`)} />
    </Box>
  </div>
};

export default New