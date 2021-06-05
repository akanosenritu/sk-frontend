import React from 'react';
import {TableCell, TableRow} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    "& td": {
      fontWeight: "bold"
    }
  }
})
const HeaderRow: React.FC<{}> = () => {
  const classes = useStyles()

  return <TableRow className={classes.root}>
    <TableCell key={"staffId"}>
      スタッフID
    </TableCell>
    <TableCell key={"name"}>
      名前
    </TableCell>
    <TableCell key={"kana"}>
      読み
    </TableCell>
    <TableCell key={"gender"}>
      性別
    </TableCell>
    <TableCell key={"birthDate"}>
      生年月日
    </TableCell>
    <TableCell key={"age"}>
      年齢
    </TableCell>
  </TableRow>
}

export default HeaderRow
