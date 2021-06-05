import React from 'react';
import {Event} from "../../types/positions"
import {Box} from "@material-ui/core"
import AssignmentTable from "./AssignmentTable/AssignmentTable"

const EventStaffAssignmentEditor: React.FC<{
  event: Event
}> = (props) => {
  return <Box style={{minWidth: 600}}>
    <AssignmentTable event={props.event} />
  </Box>
}

export default EventStaffAssignmentEditor