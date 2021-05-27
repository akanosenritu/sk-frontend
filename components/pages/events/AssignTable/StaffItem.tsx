import React from "react"
import {makeStyles} from "@material-ui/core"
import {getGenderColor} from "../../../../utils/gender"
import {Draggable} from "react-beautiful-dnd"
import {RegisteredStaffDraft} from "../../../../types/staffs"

const useStyles = makeStyles({
  root: {
    borderRadius: 3,
    border: "1px solid #999999",
    color: "white",
    display: "flex",
    margin: 2,
  },
  hour: {
    width: 30,
    backgroundColor: "#999999"
  },
  name: {
    borderLeft: "1px solid #999999",
    borderRight: "1px solid #999999",
    flexGrow: 1
  }
})

const StaffItem: React.FC<{
  id: string,
  index: number,
  staff: RegisteredStaffDraft,
  dayString: string
}> = (props) => {
  const classes = useStyles()
  const {staff} = props
  return <Draggable draggableId={`${staff.uuid}===${props.dayString}`} index={props.index}>
    {provided => (
      <div
        className={classes.root}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div className={classes.hour} />
        <div className={classes.name} style={{backgroundColor: getGenderColor(staff.gender)}}>
          {staff.name}
        </div>
        <div className={classes.hour} />
      </div>
    )}
  </Draggable>
}

export default StaffItem