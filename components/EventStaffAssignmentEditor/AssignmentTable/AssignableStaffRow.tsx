import React from 'react'
import AssignableStaffCell from "./AssignableStaffCell"
import {StaffsDict, StaffUUIDsByDay} from "../../../types/staffs"

const AssignableStaffRow: React.FC<{
  availableStaffUUIDsByDay: StaffUUIDsByDay,
  columnDays: string[],
  staffsDict: StaffsDict,
}> = (props) => {
  return <tr>
    <td>配置可能な<br/>スタッフ</td>
    {props.columnDays.map(day => {
      return <AssignableStaffCell
        id={`staffCell===${day}`}
        key={`staffCell===${day}`}
        availableStaffs={props.availableStaffUUIDsByDay[day].map(uuid => props.staffsDict[uuid]).filter(staff => staff)}
        dayString={day}
      />
    })}
  </tr>
}

export default AssignableStaffRow