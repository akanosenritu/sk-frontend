import React from "react"
import StaffItem from "./StaffItem"
import {Position, PositionGroup} from "../../../../types/positions"
import {detectNumberOfPeopleDiscrepancies} from "../../../../utils/assign/assign"
import {getPositionStaffNumbers} from "../../../../utils/event/positionData"
import {getStaffCounts, useStaffsDict} from "../../../../utils/staff"
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import {makeStyles, Tooltip} from "@material-ui/core"
import {Droppable} from "react-beautiful-dnd"
import {formatDateToYYYYMMDD} from "../../../../utils/time"

const useStyles = makeStyles({
  root: {
    paddingBottom: "0 !important",
    borderCollapse: "separate"
  },
  footer: {
    alignItems: "center",
    color: "darkgray",
    display: "flex",
    fontSize: 10,
    justifyContent: "flex-end",
    marginTop: 10,
    verticalAlign: "middle"
  }
})

const PositionCell: React.FC<{
  id: string,
  position: Position,
  positionGroup: PositionGroup,
  staffUUIDs: string[]
}> = props => {
  const {position, positionGroup, staffUUIDs} = props
  const {dict: staffsDict} = useStaffsDict()
  const staffs = staffUUIDs.map(uuid => staffsDict[uuid])
  const discrepancies = detectNumberOfPeopleDiscrepancies(
    getPositionStaffNumbers(position.data, positionGroup.defaultPositionData),
    getStaffCounts(staffs)
  )
  const isOk = Object.values(discrepancies).every(v => v === 0)
  const errorMessage = `人数に過不足があります。男: ${discrepancies.male}、女: ${discrepancies.female}、未指定: ${discrepancies.unspecified}`
  const classes = useStyles()
  return <td
    className={classes.root}
    style={{backgroundColor: isOk? "": "#fefbd8"}}
  >
    <Droppable droppableId={props.id}>
      {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {staffs.map((staff, index) => {
              return <StaffItem
                dayString={formatDateToYYYYMMDD(props.position.date)}
                id={`${props.id}-${staff.name}`}
                index={index}
                staff={staff}
              />
            })}
            {provided.placeholder}
          </div>
      )}
    </Droppable>
    <div className={classes.footer}>
      {isOk?
        <CheckOutlinedIcon/>:
        <Tooltip title={errorMessage}>
          <ErrorOutlineOutlinedIcon />
        </Tooltip>
      }
    </div>
  </td>
}

export default PositionCell