import React from "react"
import {Position, PositionGroup} from "../../../../types/positions"
import {formatDateToYYYYMMDD} from "../../../../utils/time"
import PositionCell from "./PositionCell"
import EmptyCell from "./EmptyCell"

const PositionGroupRow: React.FC<{
  positionGroup: PositionGroup,
  columnDays: string[],
  staffUUIDsByDay: {[dayString: string]: string[]}
}> = props => {
  const daysWithPosition: {[date: string]: Position|null} = Object.fromEntries(props.columnDays.map(day => [day, null]))
  for (const position of props.positionGroup.positions) {
    daysWithPosition[formatDateToYYYYMMDD(position.date)] = position
  }
  return <tr>
    <td>{props.positionGroup.title}</td>
    {props.columnDays.map(day => {
      const position = daysWithPosition[day]
      if (position !== null) {
        return <PositionCell
          id={`positionGroup===${props.positionGroup.uuid}===${day}`}
          position={position}
          positionGroup={props.positionGroup}
          staffUUIDs={props.staffUUIDsByDay[day]}
        />
      } else {
        return <EmptyCell />
      }
    })}
  </tr>
}

export default PositionGroupRow