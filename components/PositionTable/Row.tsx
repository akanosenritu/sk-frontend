import {MyRow} from "../../utils/positionTable"
import {CellWithDefault} from "./Cells"
import React from "react"
import {Position} from "../../types/position"

const Row: React.FC<{
  row: MyRow,
  onClick: (position: Position) => void
}> = props => {
  const {row} = props
  const onClick = () => {
    props.onClick(row.position)
  }

  return <tr onClick={onClick}>
    {row.dateRowIsSpanning?
      null:
      <td rowSpan={row.dateRowSpanningRows} key={"date"}>{row.date.value}</td>
    }
    <CellWithDefault isDefault={row.startHour.isInheritingDefault} key={`startHour-${row.startHour.value}`}>
      {row.startHour.value}
    </CellWithDefault>
    <CellWithDefault isDefault={row.endHour.isInheritingDefault}>
      {row.endHour.value}
    </CellWithDefault>
    <CellWithDefault isDefault={row.male.isInheritingDefault} key={`male-${row.male.value}`}>
      {row.male.value}
    </CellWithDefault>
    <CellWithDefault isDefault={row.female.isInheritingDefault}>
      {row.female.value}
    </CellWithDefault>
    <CellWithDefault isDefault={row.unspecified.isInheritingDefault}>
      {row.unspecified.value}
    </CellWithDefault>
    <CellWithDefault isDefault={row.clothes.isInheritingDefault}>
      {row.clothes.value}
    </CellWithDefault>
    <CellWithDefault isDefault={row.gatheringPlace.isInheritingDefault}>
      {row.gatheringPlace.value}
    </CellWithDefault>
  </tr>
}

export default Row