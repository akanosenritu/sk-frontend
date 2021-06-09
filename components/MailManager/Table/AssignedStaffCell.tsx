import React from "react"
import {makeStyles} from "@material-ui/core"
import {RegisteredStaff} from "../../../types/staffs"
import {Position} from "../../../types/position"
import {PositionGroup} from "../../../types/positions"
import {getValueWithDefault} from "../../../utils/positions"
import {rawTimeToString} from "../../../utils/time"

const useStyles = makeStyles({
  rightMostTd: {
  }
})

export const AssignedStaffCell: React.FC<{
  staff: RegisteredStaff,
  position: Position,
  positionGroup: PositionGroup,
}> = props => {
  const classes = useStyles()
  const {position, positionGroup} = props
  const startHour = getValueWithDefault("startHour", position.data, positionGroup.defaultPositionData)
  const clothes = getValueWithDefault("clothes", position.data, positionGroup.defaultPositionData)
  const gatheringPlace = getValueWithDefault("gatheringPlace", position.data, positionGroup.defaultPositionData)
  return <>
    <td>{rawTimeToString(startHour.value)}</td>
    <td>{gatheringPlace.value.title}</td>
    <td className={classes.rightMostTd}>{clothes.value.title}</td>
  </>
}