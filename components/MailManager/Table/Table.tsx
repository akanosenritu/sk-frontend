import React from "react"
import {makeStyles} from "@material-ui/core"
import {RegisteredStaff} from "../../../types/staffs"
import {AssignmentsByDayByStaff} from "../../../utils/event"
import {format} from "date-fns"
import {StaffRow} from "./StaffRow"
import {Event} from "../../../types/positions"

const useStyles = makeStyles({
  root: {
    backgroundColor: "white",
    borderCollapse: "collapse",
    padding: 5,
    "& th": {
      padding: 5,
    },
    "& td": {
      padding: 5,
      textAlign: "center"
    }
  },
  body: {
    "& tr:nth-child(odd)": {
      backgroundColor: "#f2f2f2"
    }
  },
})

export const Table: React.FC<{
  assignedStaffsSortedArray: RegisteredStaff[],
  assignmentByDayByStaff: AssignmentsByDayByStaff,
  confirmationDateLimit: Date | null,
  dates: Date[],
  dayStrings: string[],
  defaultMailTemplate: MailTemplate | null,
  event: Event,
}> = props => {
  const classes = useStyles()
  const {
    assignedStaffsSortedArray,
    assignmentByDayByStaff,
    dates,
    dayStrings,
  } = props
  return <table className={classes.root}>
    <colgroup>
      <col width={100}/>
      <col width={250}/>
      {dayStrings.map(() => <><col width={100} /><col width={100}/><col width={100}/></>)}
    </colgroup>
    <thead>
      <tr>
        <th />
        <th />
        {dates.map(date => <th colSpan={3} >{format(date, "MM/dd")}</th>)}
      </tr>
      <tr>
        <th />
        <th />
        {dayStrings.map(() => (
          <>
            <th>時間</th>
            <th>場所</th>
            <th>服装</th>
          </>
        ))}
      </tr>
    </thead>
    <tbody className={classes.body}>
      {assignedStaffsSortedArray.map(staff => (
        <StaffRow
          assignmentsByDay={assignmentByDayByStaff[staff.uuid]}
          confirmationDateLimit={props.confirmationDateLimit}
          dayStrings={dayStrings}
          defaultMailTemplate={props.defaultMailTemplate}
          event={props.event}
          staff={staff}
        />
      ))}
    </tbody>
  </table>
}