import React, {useEffect, useMemo, useState} from "react"
import {Event, PositionGroup} from "../../../types/positions"
import {Box, Button, makeStyles} from "@material-ui/core"
import DayHeader from "./DayHeader"
import PositionGroupRow from "./PositionGroupRow"
import {formatDateToYYYYMMDD} from "../../../utils/time"
import {
  StaffPositionAssignments,
  StaffPositionAssignmentsForPositionGroup,
  StaffPositionAssignmentsForUnassignedStaffs
} from "../../../types/staffs"
import {DragDropContext, DropResult} from "react-beautiful-dnd"
import produce from "immer"
import {useStaffs} from "../../../utils/staff"
import {updatePositionStaffAssignments} from "../../../utils/api/position"
import AssignableStaffRow from "./AssignableStaffRow"
import {getAvailableStaffsForDates} from "../../../utils/api/staff"


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

  const {staffsDict} = useStaffs()

  const dayStrings: string[] = useMemo<string[]>(() => Array.from(
    new Set(props.event.positionGroups
      .map(positionGroup => {
        return positionGroup.positions.map(
          position => formatDateToYYYYMMDD(position.date)
        )
      })
      .flat()
    )
  ).sort(), [props.event.positionGroups])


  const createInitialStaffPositionAssignments = (): StaffPositionAssignments => {
    const createStaffPositionAssignmentsForPositionGroup = (positionGroup: PositionGroup): StaffPositionAssignmentsForPositionGroup => {
      return {
        positionGroup,
        assignedStaffUUIDsByDay: Object.fromEntries(
          positionGroup.positions
            .map(position => {
              const dayString = formatDateToYYYYMMDD(position.date)
              return [dayString, position.assignedStaffs.map(staff => staff.uuid)]
            })
        )
      }
    }
    const createStaffPositionAssignmentsForUnassignedStaffs = (): StaffPositionAssignmentsForUnassignedStaffs => {
      return {
        assignedStaffUUIDsByDay: Object.fromEntries(
          dayStrings.map(dayString => {
            return [dayString, [] as string[]]
          })
        )
      }
    }
    const forPositionGroups = Object.fromEntries(props.event.positionGroups.map(positionGroup => {
      return [
        positionGroup.uuid,
        createStaffPositionAssignmentsForPositionGroup(positionGroup)
      ]
    }))
    return {
      assigned: forPositionGroups,
      unassigned: createStaffPositionAssignmentsForUnassignedStaffs()
    }
  }
  // the state that handles assignments of all staffs related to this event.
  // all available but unassigned staffs are stored with the key "unassigned" in the same way as staffs assigned are stored for each position group.
  const [staffPositionAssignments, setStaffPositionAssignments] = useState<StaffPositionAssignments>(createInitialStaffPositionAssignments())

  // retrieve available staffs from the server and set them to "unassigned" of staffPositionAssignments
  useEffect(() => {
    getAvailableStaffsForDates(dayStrings)
      .then(result => {
        if (result.ok) {
          setStaffPositionAssignments(produce(staffPositionAssignments, draft => {
            for (const dayString of dayStrings) {
              draft.unassigned.assignedStaffUUIDsByDay[dayString] = result.data[dayString]
                .sort((a, b) => {
                  return a.staffId < b.staffId? -1: 1
                })
                .map(staff => staff.uuid)
            }
          }))
        }
      })
  }, [])

  const getPositionGroupUUIDWithThisStaffUUID = (staffUUID: string, dayString: string): string | undefined => {
    return props.event.positionGroups
      .map(positionGroup => positionGroup.uuid)
      .find(positionGroupUUID => {
        const staffUUIDs: string[] | undefined = staffPositionAssignments.assigned[positionGroupUUID].assignedStaffUUIDsByDay[dayString]
        if (staffUUIDs) {
          return new Set(staffUUIDs).has(staffUUID)
        }
        return false
      })
  }

  const assignStaffToPosition = (staffUUID: string, positionGroupUUID: string, dayString: string, index: number) => {
    setStaffPositionAssignments(old => produce(old, draft => {
      const otherPositionGroupUUIDWithThisStaffUUID = getPositionGroupUUIDWithThisStaffUUID(staffUUID, dayString)

      // if other positionGroup have this staff, release him from it and reassign him to this.
      // else remove him from unassigned staffs pool.
      if (otherPositionGroupUUIDWithThisStaffUUID) {
        const oldIndex = draft.assigned[otherPositionGroupUUIDWithThisStaffUUID].assignedStaffUUIDsByDay[dayString]
          .findIndex(_staffUUID => _staffUUID === staffUUID)
        if (oldIndex !== -1) {
          draft.assigned[otherPositionGroupUUIDWithThisStaffUUID].assignedStaffUUIDsByDay[dayString].splice(oldIndex, 1)
          draft.assigned[positionGroupUUID].assignedStaffUUIDsByDay[dayString].splice(index, 0, staffUUID)
        }
      } else {
        const oldIndex = draft.unassigned.assignedStaffUUIDsByDay[dayString]
          .findIndex(_staffUUID => _staffUUID === staffUUID)
        draft.assigned[positionGroupUUID].assignedStaffUUIDsByDay[dayString].splice(index, 0, staffUUID)
        draft.unassigned.assignedStaffUUIDsByDay[dayString].splice(oldIndex, 1)
      }
    }))
  }
  const unassignStaff = (staffUUID: string, dayString: string) => {
    setStaffPositionAssignments(old => produce(old, draft => {
      const positionGroupUUIDWithThisStaffUUID = getPositionGroupUUIDWithThisStaffUUID(staffUUID, dayString)

      // if other positionGroup have this staff, release him.
      // then adds him to unassigned staff pool and sort the pool
      if (positionGroupUUIDWithThisStaffUUID) {
        const oldIndex = draft.assigned[positionGroupUUIDWithThisStaffUUID].assignedStaffUUIDsByDay[dayString]
          .findIndex(_staffUUID => _staffUUID === staffUUID)
        if (oldIndex !== -1) {
          draft.assigned[positionGroupUUIDWithThisStaffUUID].assignedStaffUUIDsByDay[dayString].splice(oldIndex, 1)
        }
      }
      draft.unassigned.assignedStaffUUIDsByDay[dayString].push(staffUUID)
      draft.unassigned.assignedStaffUUIDsByDay[dayString].sort((a, b) => {
        const staffA = staffsDict[a]
        const staffB = staffsDict[b]
        return staffA.staffId < staffB.staffId? -1: 1
      })
    }))
  }

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
    } else if (destinationType === "staffCell") {
      console.log(destinationIDTokens)
      const dayString = destinationIDTokens.shift() as string
      console.log(dayString)
      unassignStaff(staffUUID, dayString)
    }
  }

  const onSave = async () => {
    const staffPositionAssignmentsForPositionGroups = Object.values(staffPositionAssignments.assigned)
    for (const {positionGroup, assignedStaffUUIDsByDay} of staffPositionAssignmentsForPositionGroups) {
      for (const position of positionGroup.positions) {
        const dayString = formatDateToYYYYMMDD(position.date)
        if (assignedStaffUUIDsByDay[dayString] != null) {
          const result = await updatePositionStaffAssignments(position.uuid, assignedStaffUUIDsByDay[dayString])
          if (!result.ok) {
            console.log("error happened while updating a Position. ", position)
          } else {
            console.log("successfully updated position with new assignments of staffs.")
          }
        }
      }
    }
  }

  /**
  const assignedStaffUUIDsByDay = useMemo<{[dayString: string]: string[]}>(() => {
    const assignedStaffUUIDsByDayByPositionGroups = Object.values(staffPositionAssignments).map(o => o.assignedStaffUUIDsByDay)
    const result: {[dayString: string]: string[]} = {}
    for (const dayString of dayStrings) {
      result[dayString] = []
      for (const assignedStaffUUIDsByDayByPositionGroup of assignedStaffUUIDsByDayByPositionGroups) {
        if (assignedStaffUUIDsByDayByPositionGroup[dayString]) {
          result[dayString] = result[dayString].concat(assignedStaffUUIDsByDayByPositionGroup[dayString])
        }
      }
    }
    return result
  }, [staffPositionAssignments, dayStrings])
  **/

  return <div>
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <table className={classes.table}>
        <colgroup>
          <col width={250}/>
          {dayStrings.map(() => {
            return <col width={250}/>
          })}
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
              staffUUIDsByDay={staffPositionAssignments.assigned[positionGroup.uuid].assignedStaffUUIDsByDay}
              staffsDict={staffsDict}
            />
          })}
          <AssignableStaffRow
            availableStaffsByDay={staffPositionAssignments.unassigned.assignedStaffUUIDsByDay}
            columnDays={dayStrings}
          />
        </tbody>
      </table>
    </DragDropContext>
    <Box mt={2}>
      <Button fullWidth={true} variant={"contained"} onClick={onSave}>保存</Button>
    </Box>
  </div>
}

export default AssignmentTable