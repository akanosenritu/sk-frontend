import React from 'react';
import {RegisteredStaff} from "../../../../types/staffs"
import {Box, makeStyles, TableBody, TableContainer, TableHead} from "@material-ui/core"
import HeaderRow from "./HeaderRow"
import StaffRow from "./StaffRow"

const useStyles = makeStyles({
  root: {
    maxWidth: 800,
    display: "flex",
    justifyContent: "center"
  }
})

// TODO: make it a good looking and virtualized table
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