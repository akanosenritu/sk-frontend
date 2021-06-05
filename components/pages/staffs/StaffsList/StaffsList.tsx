import React from 'react';
import {RegisteredStaff} from "../../../../types/staffs"
import {Box, TableBody, TableContainer, TableHead} from "@material-ui/core"
import HeaderRow from "./HeaderRow"
import StaffRow from "./StaffRow"
import {makeStyles} from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    maxWidth: 800,
    display: "flex",
    justifyContent: "center"
  }
})
const StaffsList: React.FC<{
  staffs: RegisteredStaff[]
}> = (props) => {
  const classes = useStyles()

  return <Box className={classes.root} m={3}>
    <TableContainer>
      <TableHead>
        <HeaderRow />
      </TableHead>
      <TableBody>
        {props.staffs.map(staff => {
          return <StaffRow staff={staff} />
        })}
      </TableBody>
    </TableContainer>
  </Box>
}

export default StaffsList