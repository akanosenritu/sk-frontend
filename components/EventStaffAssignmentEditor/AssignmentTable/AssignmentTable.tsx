import React, {useState} from "react"
import {Event} from "../../../types/positions"
import {Box, Button, Grid, makeStyles} from "@material-ui/core"
import DayHeader from "./DayHeader"
import PositionGroupRow from "./PositionGroupRow"
import {formatDateToYYYYMMDD} from "../../../utils/time"
import {StaffPositionAssignments} from "../../../types/staffs"
import {DragDropContext, DropResult} from "react-beautiful-dnd"
import produce from "immer"
import {useStaffs} from "../../../utils/staff"
import {updatePositionOnBackend} from "../../../utils/api/position"
import StaffsList from "../StaffsList/StaffsList"


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



const AssignmentTable: React.FC<{
  event: Event,
}> = props => {
  const classes = useStyles()

  const {staffs, staffsDict, search: searchStaffs} = useStaffs()

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
    console.log(staffUUID, positionGroupUUID, dayString, index)
    setStaffPositionAssignments(old => produce(old, draft => {
      // if other positionGroup have this staff, release him from it and reassign him to this.
      const otherPositionGroupWithThisStaffUUID = props.event.positionGroups
        .map(positionGroup => positionGroup.uuid)
        .find(positionGroupUUID => {
          const staffUUIDs: string[] | undefined = staffPositionAssignments[positionGroupUUID].assignedStaffUUIDsByDay[dayString]
          if (staffUUIDs) {
            return new Set(staffUUIDs).has(staffUUID)
          }
          return false
        })
      if (otherPositionGroupWithThisStaffUUID) {
        const oldIndex = draft[otherPositionGroupWithThisStaffUUID].assignedStaffUUIDsByDay[dayString]
          .findIndex(_staffUUID => _staffUUID === staffUUID)
        if (oldIndex !== -1) {
          draft[otherPositionGroupWithThisStaffUUID].assignedStaffUUIDsByDay[dayString].splice(oldIndex, 1)
          draft[positionGroupUUID].assignedStaffUUIDsByDay[dayString].splice(index, 0, staffUUID)
        }
      } else {
        draft[positionGroupUUID].assignedStaffUUIDsByDay[dayString].splice(index, 0, staffUUID)
      }
    }))
  }

  /**
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
      return [dayString, [...availableStaffUUIDsSetByDay[dayString]].sort((a, b) => staffsDict[a].lastName.toLowerCase() < staffsDict[b].lastName.toLowerCase()? -1: 1)]
    }))
  }, [staffPositionAssignments])
   **/

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

  const onSave = async () => {
    const staffPositionAssignmentsForPositionGroups = Object.values(staffPositionAssignments)
    for (const {positionGroup, assignedStaffUUIDsByDay} of staffPositionAssignmentsForPositionGroups) {
      for (const position of positionGroup.positions) {
        const dayString = formatDateToYYYYMMDD(position.date)
        if (assignedStaffUUIDsByDay[dayString]) {
          const updatedPosition = {...position}
          updatedPosition.assignedStaffs = assignedStaffUUIDsByDay[dayString].map(uuid => staffsDict[uuid])
          console.log(updatedPosition)
          const result = await updatePositionOnBackend(updatedPosition)
          if (!result.ok) {
            console.log("error happened while updating a Position. ", position)
          }
        }
      }
    }
  }

  return <div>
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Grid container spacing={2}>
        <Grid item xs={9}>
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
                staffsDict={staffsDict}
              />
            })}
            </tbody>
          </table>
        </Grid>
        <Grid item xs={3}>
          <StaffsList
            search={searchStaffs}
            staffs={staffs}
          />
        </Grid>
      </Grid>
    </DragDropContext>
    <Box mt={2}>
      <Button fullWidth={true} variant={"contained"} onClick={onSave}>保存</Button>
    </Box>
  </div>
}

export default AssignmentTable