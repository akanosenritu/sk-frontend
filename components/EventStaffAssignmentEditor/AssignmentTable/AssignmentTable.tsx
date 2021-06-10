import React, {useEffect, useMemo, useState} from "react"
import {Event, PositionGroup} from "../../../types/positions"
import {Box, Button, makeStyles} from "@material-ui/core"
import DayHeader from "./DayHeader"
import {PositionGroupRow} from "./PositionGroupRow"
import {formatDateToJaMDEEE, formatDateToYYYYMMDD} from "../../../utils/time"
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
import {createPositionDict, getDayStrings} from "../../../utils/event"
import {Alert} from "@material-ui/lab"
import isEqual from "lodash/isEqual"
import {Position} from "../../../types/position"
import useInterval from "use-interval"

const useStyles = makeStyles({
  table: {
    borderCollapse: "collapse",
    tableLayout: "fixed",
    textAlign: "center",
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

type StatusNames = "initial" | "editing" | "saving" | "saved" | "saveFailed" | "autoSaving" | "autoSaved" | "autoSaveFailed"
type Status = {
  status: StatusNames,
  message: string,
}

export const AssignmentTable: React.FC<{
  event: Event,
}> = props => {
  const classes = useStyles()

  const {staffsDict} = useStaffs()

  const [status, setStatus] = useState<Status>({status: "initial", message: ""})

  // data gathered for convenience
  const dayStrings: string[] = useMemo<string[]>(() => getDayStrings(props.event), [props.event])
  const positionDict = useMemo<Map<string, Position>>(() => createPositionDict(props.event), [props.event])

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
    setStatus({status: "editing", message: ""})
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
    setStatus({status: "editing", message: ""})
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
    const {destination, draggableId, source} = result

    // if it is a drag to nowhere, do nothing.
    if (!destination) return

    const [staffUUID] = draggableId.split("===")

    const destinationIDTokens = destination.droppableId.split("===")
    const destinationType = destinationIDTokens.shift()
    if (destinationType === "positionGroup") {
      const positionGroupUUID = destinationIDTokens.shift() as string
      const dayString = destinationIDTokens.shift() as string
      assignStaffToPosition(staffUUID, positionGroupUUID, dayString, destination.index)
    } else if (destinationType === "staffCell") {
      // if it is a drag from staffCell to staffCell, do nothing.
      // because reordering the staffCell doesn't have a meaning.
      if (destination.droppableId === source.droppableId) return

      const dayString = destinationIDTokens.shift() as string
      unassignStaff(staffUUID, dayString)
    }
  }

  const save = async (staffPositionAssignments: StaffPositionAssignments): Promise<Success|Failure> => {
    const staffPositionAssignmentsForPositionGroups = Object.values(staffPositionAssignments.assigned)
    for (const {positionGroup, assignedStaffUUIDsByDay} of staffPositionAssignmentsForPositionGroups) {
      for (const position of positionGroup.positions) {
        const dayString = formatDateToYYYYMMDD(position.date)
        if (assignedStaffUUIDsByDay[dayString] != null) {
          const oldPosition = positionDict.get(position.uuid)
          if (!oldPosition) return {
            ok: false,
            description: `UUID: ${position.uuid}を持つPositionがこのEventに存在しないため、保存できません。`
          }
          const oldAssignedStaffUUIDs = oldPosition.assignedStaffs.map(staff => staff.uuid)
          const newAssignedStaffUUIDs = assignedStaffUUIDsByDay[dayString]

          // compare two sets of uuids and only if they are different, update the position.
          if (!isEqual(new Set(oldAssignedStaffUUIDs), new Set(newAssignedStaffUUIDs))) {
            const result = await updatePositionStaffAssignments(position.uuid, assignedStaffUUIDsByDay[dayString])
            if (!result.ok) {
              return {
                ok: false,
                description: `${positionGroup.title} (${formatDateToJaMDEEE(position.date)}) の保存に失敗しました。`
              }
            }
          }
        }
      }
    }
    return {
      ok: true
    }
  }

  const onClickSave = async () => {
    setStatus({status: "saving", message: "手動保存中。"})
    const result = await save(staffPositionAssignments)
    if (result.ok) setStatus({status: "saving", message: "手動保存に成功しました。"})
    else {
      setStatus({status: "saveFailed", message: result.description})
    }
  }

  useInterval(() => {
    setStatus({status: "autoSaving", message: "自動保存中。"})
    save(staffPositionAssignments)
      .then(result => {
        if (result.ok) {
          setStatus({status: "autoSaved", message: "自動保存されました。"})
        }
        else {
          setStatus({status: "autoSaveFailed", message: result.description})
        }
      })
  }, 10000)

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
            availableStaffUUIDsByDay={staffPositionAssignments.unassigned.assignedStaffUUIDsByDay}
            columnDays={dayStrings}
            staffsDict={staffsDict}
          />
        </tbody>
      </table>
    </DragDropContext>
    <Box mt={2}>
      {status.status === "editing" && <Alert severity={"info"}>保存されていない編集があります</Alert>}
      {status.status === "saving" && <Alert severity={"info"}>保存中です</Alert>}
      {status.status === "autoSaving" && <Alert severity={"info"}>自動保存中です</Alert>}
      {status.status === "saved" && <Alert severity={"success"}>保存しました</Alert>}
      {status.status === "autoSaved" && <Alert severity={"success"}>自動保存されています。</Alert>}
      {status.status === "saveFailed" && <Alert severity={"error"}>保存に失敗しました。理由：{status.message}</Alert>}
      {status.status === "autoSaveFailed" && <Alert severity={"error"}>自動保存に失敗しました。理由: {status.message}</Alert>}
    </Box>
    <Box mt={2}>
      <Button
        color={"primary"}
        disabled={status.status !== "editing"}
        fullWidth={true}
        onClick={onClickSave}
        variant={"contained"}
      >
        保存
      </Button>
    </Box>
  </div>
}