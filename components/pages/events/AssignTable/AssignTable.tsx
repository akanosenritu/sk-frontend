import React, {useMemo, useState} from "react"
import {Event} from "../../../../types/positions"
import {makeStyles} from "@material-ui/core"
import DayHeader from "./DayHeader"
import PositionGroupRow from "./PositionGroupRow"
import {formatDateToYYYYMMDD} from "../../../../utils/time"
import AssignableStaffRow from "./AssignableStaffRow"
import {StaffPositionAssignments, StaffUUIDsByDay} from "../../../../types/staffs"
import {DragDropContext, DropResult} from "react-beautiful-dnd"
import produce from "immer"
import {useStaffsDict} from "../../../../utils/staff"


const useStyles = makeStyles({
  table: {
    borderCollapse: "collapse",
    tableLayout: "fixed",
    textAlign: "center",
    minWidth: 600,
    "& thead": {
      borderBottom: "3px double lightgray"
    },
    "& th": {
      border: "solid 1px lightgray",
      padding: 10,
      margin: 3
    },
    "& td": {
      border: "solid 1px lightgray",
      padding: 10
    }
  },
})



const AssignTable: React.FC<{
  event: Event,
  availableStaffUUIDsByDay: StaffUUIDsByDay,
}> = props => {
  const classes = useStyles()

  const {dict: staffsDict} = useStaffsDict()

  const dayStrings: string[] = Array.from(
    new Set(props.event.positionGroups
      .map(positionGroup => {
        return positionGroup.positions.map(
          position => formatDateToYYYYMMDD(position.date)
        )
      })
      .flat()
    )
  ).sort()

  const [staffPositionAssignments, setStaffPositionAssignments] = useState<StaffPositionAssignments>(Object.fromEntries(props.event.positionGroups.map(positionGroup => {
    return [
      positionGroup.uuid,
      {
        positionGroup,
        assignedStaffUUIDsByDay: Object.fromEntries(positionGroup.positions.map(position => formatDateToYYYYMMDD(position.date)).map(dayString => {
          return [dayString, []]
        }))
      }
    ]
  })))

  const assignStaffToPosition = (staffUUID: string, positionGroupUUID: string, dayString: string, index: number) => {
    setStaffPositionAssignments(old => produce(old, draft => {
      if (new Set(availableStaffsByDay[dayString]).has(staffUUID)) {
        draft[positionGroupUUID].assignedStaffUUIDsByDay[dayString].splice(index, 0, staffUUID)
      }
    }))
  }

  const availableStaffsByDay = useMemo<StaffUUIDsByDay>(() => {
    const assignedStaffUUIDsSetByDay: {[dayString: string]: Set<string>} = Object.fromEntries(dayStrings.map(dayString => [dayString, new Set<string>()]))
    Object.values(staffPositionAssignments).map(assignmentForPositionGroup => {
      return Object.entries(assignmentForPositionGroup.assignedStaffUUIDsByDay)
    })
      .flat()
      .map(arr => {
      const dayString = arr[0]
      const staffUUIDs = arr[1]
      assignedStaffUUIDsSetByDay[dayString] = new Set([...assignedStaffUUIDsSetByDay[dayString], ...staffUUIDs])
    })
    const availableStaffUUIDsSetByDay: {[dayString: string]: Set<string>} = Object.fromEntries(dayStrings.map(dayString => {
      return [dayString, new Set<string>([...props.availableStaffUUIDsByDay[dayString]].filter(staff => !assignedStaffUUIDsSetByDay[dayString].has(staff)))]
    }))
    console.log(availableStaffUUIDsSetByDay)
    return Object.fromEntries(dayStrings.map(dayString => {
      return [dayString, [...availableStaffUUIDsSetByDay[dayString]].sort((a, b) => staffsDict[a].name.toLowerCase() < staffsDict[b].name.toLowerCase()? -1: 1)]
    }))
  }, [staffPositionAssignments])

  const onDragEnd = (result: DropResult) => {
    const {destination, draggableId} = result

    if (!destination) return

    const [staffUUID] = draggableId.split("===")

    const destinationIDTokens = destination.droppableId.split("===")
    const destinationType = destinationIDTokens.shift()
    if (destinationType === "positionGroup") {
      const positionGroupUUID = destinationIDTokens.shift() as string
      const dayString = destinationIDTokens.shift() as string
      assignStaffToPosition(staffUUID, positionGroupUUID, dayString, destination.index)
    }
  }

  return <div>
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <table className={classes.table}>
        <colgroup>
          <col width={250}/>
          <col width={250} />
          <col width={250} />
          <col width={250} />
          <col width={250} />
          <col width={250} />
        </colgroup>
        <thead>
        <tr>
          <td/>
          {dayStrings.map(day => {
            return <DayHeader dayString={day}/>
          })}
        </tr>
        </thead>
        <tbody>
          {props.event.positionGroups.map(positionGroup => {
            return <PositionGroupRow
              columnDays={dayStrings}
              positionGroup={positionGroup}
              staffUUIDsByDay={staffPositionAssignments[positionGroup.uuid].assignedStaffUUIDsByDay}
            />
          })}
          <AssignableStaffRow
            availableStaffsByDay={availableStaffsByDay}
            columnDays={dayStrings}
          />
        </tbody>
      </table>
    </DragDropContext>
  </div>
}

export default AssignTable