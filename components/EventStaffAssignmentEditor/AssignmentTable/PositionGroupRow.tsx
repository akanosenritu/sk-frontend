import React, {useState} from "react"
import {Position} from "../../../types/position"
import {PositionGroup} from "../../../types/positions"
import {formatDateToYYYYMMDD} from "../../../utils/time"
import PositionCell from "./PositionCell"
import EmptyCell from "./EmptyCell"
import {RegisteredStaff} from "../../../types/staffs"
import {PositionManagerDialog} from "../../PositionManager/PositionManagerDialog"

export const PositionGroupRow: React.FC<{
  positionGroup: PositionGroup,
  columnDays: string[],
  staffUUIDsByDay: {[dayString: string]: string[]}
  staffsDict: {[staffUUID: string]: RegisteredStaff}
}> = props => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const daysWithPosition: {[date: string]: Position|null} = Object.fromEntries(props.columnDays.map(day => [day, null]))
  for (const position of props.positionGroup.positions) {
    daysWithPosition[formatDateToYYYYMMDD(position.date)] = position
  }
  return <tr>
    <td onClick={()=>setIsDialogOpen(true)}>{props.positionGroup.title}</td>
    {props.columnDays.map(day => {
      const position = daysWithPosition[day]
      if (position != null) {
        return <PositionCell
          id={`positionGroup===${props.positionGroup.uuid}===${day}`}
          key={`positionGroup===${props.positionGroup.uuid}===${day}`}
          position={position}
          positionGroup={props.positionGroup}
          staffs={props.staffUUIDsByDay[day].map(uuid => props.staffsDict[uuid]).filter(staff => staff)}
        />
      } else {
        return <EmptyCell key={`positionGroup===${props.positionGroup.uuid}===${day}`}/>
      }
    })}
    {isDialogOpen && <PositionManagerDialog
      clothesSettings={[]}
      gatheringPlaceSettings={[]}
      onClose={()=>setIsDialogOpen(false)}
      positionGroup={props.positionGroup}
    />}
  </tr>
}

export default PositionGroupRow