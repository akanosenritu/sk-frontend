import React from 'react'
import {Box, Button, makeStyles, Typography} from "@material-ui/core"
import {StaffEditor} from "./StaffEditor"
import {createDefaultRegisteredStaff} from "../../../utils/staff"
import {BackButton} from "../../BackButton"
import {useRouter} from "next/router"

const useStyles = makeStyles({
  bottomButtonsContainer: {
    display: "flex",
  },
  createAnotherStaffButtonContainer: {
    marginLeft: 30,
    flexGrow: 1,
  },
  editorContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
})

const New = () => {
  const newStaff = createDefaultRegisteredStaff()
  const router = useRouter()
  const classes = useStyles()
  return <div>
    <Box className={classes.titleContainer} mt={2}>
      <Typography variant={"h4"}>新しいスタッフを作成</Typography>
      <Box mt={2}>新しいスタッフを作成します。すべての項目を入力する必要があります。</Box>
    </Box>
    <Box mt={2} className={classes.editorContainer}>
      <StaffEditor staff={newStaff} />
    </Box>
    <Box my={2} className={classes.bottomButtonsContainer}>
      <BackButton onClick={()=>router.push(`/staffs/`)} />
      <Box className={classes.createAnotherStaffButtonContainer}>
        <Button
          color={"primary"}
          fullWidth={true}
          onClick={()=>router.reload()}
          variant={"contained"}
        >
          別のスタッフを作成する
        </Button>
      </Box>
    </Box>
  </div>
};

export default New