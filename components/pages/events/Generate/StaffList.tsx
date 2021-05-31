import React from 'react';
import {H5} from "../../../Header"
import {Position} from "../../../../types/position"
import {Event, PositionGroup} from "../../../../types/positions"
import {Box} from "@material-ui/core"
import {RegisteredStaff} from "../../../../types/staffs"
import {formatDateToYYYYMMDD} from "../../../../utils/time"
import {getDataOrDefaultDataFromPositionData} from "../../../../utils/positions"
import {format} from "date-fns"
import {useStaffsDict} from "../../../../utils/staff"

const StaffList: React.FC<{
  event: Event
}> = (props) => {
  const assignedStaffUUIDsSet = new Set<string>()
  const {dict: staffsDict} = useStaffsDict()

  const assignments: {[staffUUID: string]: [string, Position, PositionGroup][]} = {}
  for (const positionGroup of props.event.positionGroups) {
    for (const position of positionGroup.positions) {
      for (const assignedStaff of position.assignedStaffs) {
        assignedStaffUUIDsSet.add(assignedStaff.uuid)
        if (!assignments[assignedStaff.uuid]) {
          assignments[assignedStaff.uuid] = [[formatDateToYYYYMMDD(position.date), position, positionGroup]]
        } else {
          assignments[assignedStaff.uuid].push([formatDateToYYYYMMDD(position.date), position, positionGroup])
        }
      }
    }
  }

  const assignedStaffs = [...assignedStaffUUIDsSet]
    .map(uuid => staffsDict[uuid])
    .sort((a, b) => a.lastName < b.lastName? -1: 1)

  const getDayText = (position: Position, positionGroup: PositionGroup) => {
    console.log(position, positionGroup)
    const data = position.data
    const defaultData = positionGroup.defaultPositionData
    const date = position.date
    const startHour = getDataOrDefaultDataFromPositionData("startHour", data, defaultData)
    const clothes = getDataOrDefaultDataFromPositionData("clothes", data, defaultData)
    const gatheringPlace = getDataOrDefaultDataFromPositionData("gatheringPlace", data, defaultData)

    return <Box m={1} mt={4}>
      {format(date, "MM'月'dd'日' '('eee')'")}:
      <Box m={1}>
        集合時間: {startHour.hour}時{startHour.minute}分
      </Box>
      <Box m={1} display={"flex"}>
        集合場所: <p>{gatheringPlace.content}</p>
      </Box>
      <Box m={1} display={"flex"}>
        服装: <p>{clothes.content}</p>
      </Box>
    </Box>
  }

  const getMailText = (staff: RegisteredStaff, assignments: [string, Position, PositionGroup][]) => {
    const sortedAssignments = [...assignments]
    sortedAssignments.sort(((a, b) => a[0] < b[0]? -1: 1))
    return sortedAssignments.map(assignment => getDayText(assignment[1], assignment[2]))
  }

  return <div>
    {assignedStaffs.map(staff => {
      return <Box m={3}>
        <H5>{`${staff.lastNameKana}, ${staff.firstNameKana}さん`}:</H5>
        <div style={{whiteSpace: "pre"}}>
          {getMailText(staff, assignments[staff.uuid])}
        </div>
      </Box>
    })}
  </div>
}

export default StaffList