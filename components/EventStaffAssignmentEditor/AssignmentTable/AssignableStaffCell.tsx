import React from 'react';
import {StaffItem} from "./StaffItem"
import {Droppable} from "react-beautiful-dnd"
import {RegisteredStaff} from "../../../types/staffs"

const AssignableStaffCell: React.FC<{
  availableStaffs: RegisteredStaff[],
  dayString: string,
  id: string
}> = (props) => {
  return <Droppable droppableId={props.id}>
    {provided => (
      <td
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <div>
          {props.availableStaffs.map((staff, index) => {
            return <StaffItem
              dayString={props.dayString}
              key={`staffItem===${staff.uuid}===${props.dayString}`}
              index={index}
              staff={staff}
            />
          })}
          {provided.placeholder}
        </div>
      </td>
    )}
  </Droppable>
}

export default AssignableStaffCell