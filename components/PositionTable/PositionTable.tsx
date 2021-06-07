import React from "react"
import {makeStyles, Typography} from "@material-ui/core"
import {getGenderColor} from "../../utils/gender"
import {prepareRows} from "../../utils/positionTable"
import Row from "./Row"
import {PositionGroup} from "../../types/positions"
import {Position} from "../../types/position"

const useStyles = makeStyles({
  table: {
    borderCollapse: "collapse",
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
  }
})

type Props = {
  positionGroups: PositionGroup[],
  onClickRow: (position: Position) => void
}

const PositionTable: React.FC<Props> = (props) => {
  const classes = useStyles()
  const rows = prepareRows(props.positionGroups.map(positionGroup => positionGroup.positions.map(subPosition => {
    return {
      position: subPosition,
      positionGroup: positionGroup
    }
  })).flat())
  return <table className={classes.table}>
    <thead>
      <tr>
        <th rowSpan={2}>日付</th>
        <th colSpan={2}>時間</th>
        <th colSpan={3}>性別</th>
        <th rowSpan={2}>服装</th>
        <th rowSpan={2}>集合場所</th>
      </tr>
      <tr>
        <th>開始</th>
        <th>終了</th>
        <th style={{backgroundColor:getGenderColor("male")}}>男</th>
        <th style={{backgroundColor:getGenderColor("female")}}>女</th>
        <th style={{backgroundColor:getGenderColor("unspecified")}}>未指定</th>
      </tr>
    </thead>
    <tbody>
      {rows.map(row => {
        return <Row row={row} onClick={props.onClickRow}/>
      })}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan={8}>
          <Typography variant={"caption"}>
            各列はクリックすることで編集できます。グレーの背景のセルは標準の設定が使用されているセルです。
          </Typography>
        </td>
      </tr>
    </tfoot>
  </table>
}

export default PositionTable