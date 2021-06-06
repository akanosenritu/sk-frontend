import React from "react"
import StaffItem from "./StaffItem"
import {Position} from "../../../types/position"
import {PositionGroup} from "../../../types/positions"
import {detectNumberOfPeopleDiscrepancies} from "../../../utils/assign/assign"
import {getPositionStaffNumbers} from "../../../utils/event/positionData"
import {getStaffCounts} from "../../../utils/staff"

import {makeStyles} from "@material-ui/core"
import {Droppable} from "react-beautiful-dnd"
import {formatDateToYYYYMMDD} from "../../../utils/time"
import {RegisteredStaff} from "../../../types/staffs"
import {getJapaneseTranslationForGender} from "../../../utils/gender"

const useStyles = makeStyles({
  root: {
    borderCollapse: "separate"
  },
})

const DisplayDiscrepancyInfoForGender: React.FC<{
  gender: Gender,
  discrepancies: {[gender in Gender]: number}
}> = (props) => {
  const {discrepancies, gender} = props
  if (discrepancies[gender] === 0) return null
  return <div>
    {getJapaneseTranslationForGender(gender)}: {Math.abs(discrepancies[gender])}人{discrepancies[gender] < 0? "過剰": "不足"}
  </div>
}

const PositionCell: React.FC<{
  id: string,
  position: Position,
  positionGroup: PositionGroup,
  staffs: RegisteredStaff[]
}> = props => {
  const {position, positionGroup, staffs} = props
  const discrepancies = detectNumberOfPeopleDiscrepancies(
    getPositionStaffNumbers(position.data, positionGroup.defaultPositionData),
    getStaffCounts(staffs)
  )
  const isOk = Object.values(discrepancies).every(v => v === 0)
  const totalNumberOfPeople = Object.values(getPositionStaffNumbers(position.data, positionGroup.defaultPositionData)).reduce((a, b) => a + b, 0)
  const classes = useStyles()
  return <td
    className={classes.root}
    style={{backgroundColor: isOk? "#ccffcc": "#fefbd8", height: 1}}
  >
    <div style={{height: "100%", minHeight: totalNumberOfPeople * 30, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
      <Droppable droppableId={props.id}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{flexGrow: 1, display: "flex", justifyContent: "space-between", flexDirection: "column"}}
          >
            <div>
              {staffs.map((staff, index) => {
                return <StaffItem
                  dayString={formatDateToYYYYMMDD(props.position.date)}
                  key={`staffItem===${staff.uuid}===${formatDateToYYYYMMDD(position.date)}`}
                  index={index}
                  staff={staff}
                />
              })}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      <div style={{height: 30 * Object.values(discrepancies).filter(d => d !== 0).length, marginTop: 30}}>
        <DisplayDiscrepancyInfoForGender gender={"male"} discrepancies={discrepancies} />
        <DisplayDiscrepancyInfoForGender gender={"female"} discrepancies={discrepancies} />
        <DisplayDiscrepancyInfoForGender gender={"unspecified"} discrepancies={discrepancies} />
      </div>
    </div>
  </td>
}

export default PositionCell