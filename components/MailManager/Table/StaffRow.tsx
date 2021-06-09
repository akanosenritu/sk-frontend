import React, {useState} from "react"
import {IconButton, makeStyles, Tooltip} from "@material-ui/core"
import {RegisteredStaff} from "../../../types/staffs"
import {AssignmentsByDay} from "../../../utils/event"
import {AssignedStaffCell} from "./AssignedStaffCell"
import {UnassignedStaffCell} from "./UnassignedStaffCell"
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import {MailSender} from "../MailSender/MailSender"
import {Event} from "../../../types/positions"

const useStyles = makeStyles({
  nameCell: {}
})

export const StaffRow: React.FC<{
  assignmentsByDay: AssignmentsByDay,
  confirmationDateLimit: Date | null,
  dayStrings: string[],
  defaultMailTemplate: MailTemplate | null,
  event: Event,
  staff: RegisteredStaff,
}> = props => {
  const classes = useStyles()
  const {assignmentsByDay, dayStrings, staff} = props
  const [isMailSenderOpen, setIsMailSenderOpen] = useState(false)

  const handleMailSenderClose = () => setIsMailSenderOpen(false)

  return <tr>
    <td>
      <Tooltip title={"メール本文を生成します。"}>
        <IconButton disabled={!props.defaultMailTemplate || !props.confirmationDateLimit} onClick={()=>setIsMailSenderOpen(true)}>
          <MailOutlineIcon />
        </IconButton>
      </Tooltip>
      {isMailSenderOpen && props.defaultMailTemplate && props.confirmationDateLimit &&
      <MailSender
        assignmentByDay={assignmentsByDay}
        confirmationDateLimit={props.confirmationDateLimit}
        defaultMailTemplate={props.defaultMailTemplate}
        event={props.event}
        onClose={handleMailSenderClose}
        staff={staff}
      />}
    </td>
    <td className={classes.nameCell}>
      {`${staff.lastName}, ${staff.firstName}`}
    </td>
    {dayStrings.map(dayString => {
      if (assignmentsByDay[dayString]) {
        const {position, positionGroup} = assignmentsByDay[dayString]
        return <AssignedStaffCell position={position} positionGroup={positionGroup} staff={staff}/>
      } else {
        return <UnassignedStaffCell />
      }
    })}
  </tr>
}