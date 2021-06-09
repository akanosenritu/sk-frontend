import React from 'react';
import {Event} from "../../types/positions"
import {Box} from "@material-ui/core"
import {AssignmentTable} from "./AssignmentTable/AssignmentTable"

export const EventStaffAssignmentEditor: React.FC<{
  event: Event
}> = (props) => {
  return <Box>
    <AssignmentTable event={props.event} />
  </Box>
}