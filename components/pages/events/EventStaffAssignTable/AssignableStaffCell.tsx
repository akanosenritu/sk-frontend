import React from 'react';
import StaffItem from "./StaffItem"
import {Droppable} from "react-beautiful-dnd"
import {useStaffsDict} from "../../../../utils/staff"

const AssignableStaffCell: React.FC<{
  availableStaffUUIDs: string[],
  dayString: string,
  id: string
}> = (props) => {
  const {dict: staffsDict} = useStaffsDict()
  const staffs = props.availableStaffUUIDs.map(uuid => staffsDict[uuid])
  return <Droppable droppableId={props.id}>
    {provided => (
      <td
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <div>
          {staffs.map((staff, index) => {
            return <StaffItem
              dayString={props.dayString}
              key={`staffItem===${staff.uuid}===${props.dayString}`}
              id={`staffItem===${staff.uuid}===${props.dayString}`}
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