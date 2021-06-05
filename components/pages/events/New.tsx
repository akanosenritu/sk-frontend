import React from 'react'
import EventEditor from "./EventEditor"
import {Typography} from "@material-ui/core"
import {createDefaultEvent} from "../../../utils/event"

const New = () => {
  const newEvent = createDefaultEvent()
  return <>
    <Typography variant={"h4"}>新しいイベントを作成</Typography>
    <EventEditor event={newEvent} />
  </>
};

export default New