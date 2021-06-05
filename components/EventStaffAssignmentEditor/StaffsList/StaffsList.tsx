import React from 'react';
import {Box, makeStyles, Typography} from "@material-ui/core"
import {RegisteredStaff} from "../../../types/staffs"
import StaffItem from "../AssignmentTable/StaffItem"
import {Droppable} from "react-beautiful-dnd"

const useStyles = makeStyles({
  root: {
    maxHeight: "100vh",
    overflow: "auto",
  },
  searchConditionInputContainer: {
    border: "1px solid darkgray",
    borderRadius: 5,
    minHeight: 300,
  }
})

const StaffsList: React.FC<{
  staffs: RegisteredStaff[],
  search: (searchConditions: string) => void,
}> = (props) => {
  const classes = useStyles()
  return <Box m={1} className={classes.root}>
    <Typography variant={"h6"}>スタッフを検索</Typography>
    <Box m={1} className={classes.searchConditionInputContainer}>
      検索条件:
    </Box>
    <Box display={"flex"} justifyContent={"center"} m={1}>
      <Droppable droppableId={"staffsList"}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.staffs.map((staff, index) => (
              <StaffItem index={index} staff={staff} dayString={"date-unspecified"} key={`${staff.uuid}`}/>
            ))}
          </div>
        )}
      </Droppable>
    </Box>
  </Box>
}

export default StaffsList