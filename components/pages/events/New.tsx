import React from 'react'
import EventEditor from "./EventEditor"
import PageWithDrawer from "../PageWithDrawer"
import {Typography} from "@material-ui/core"
import {createDefaultEvent} from "../../../utils/event"

const New = () => {
  const newEvent = createDefaultEvent()
  return <PageWithDrawer>
    <Typography variant={"h4"}>新しいイベントを作成</Typography>
    <EventEditor event={newEvent} />
  </PageWithDrawer>
};

export default New