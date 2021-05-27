import React from 'react'
import AssignableStaffCell from "./AssignableStaffCell"
import {StaffUUIDsByDay} from "../../../../types/staffs"

const AssignableStaffRow: React.FC<{
  availableStaffsByDay: StaffUUIDsByDay,
  columnDays: string[],
}> = (props) => {
  return <tr>
    <td>残りのスタッフ</td>
    {props.columnDays.map(day => {
      return <AssignableStaffCell
        id={`staffCell-${day}`}
        availableStaffUUIDs={props.availableStaffsByDay[day]}
        dayString={day}
      />
    })}
  </tr>
}

export default AssignableStaffRow