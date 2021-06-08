import React from 'react'
import {Box, Typography} from "@material-ui/core"
import StaffEditor from "./StaffEditor"
import {createDefaultRegisteredStaff} from "../../../utils/staff"
import {BackButton} from "../../BackButton"
import {useRouter} from "next/router"

const New = () => {
  const newStaff = createDefaultRegisteredStaff()
  const router = useRouter()
  return <div>
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/staffs/`)} />
    </Box>
    <Typography variant={"h4"}>新しいスタッフを作成</Typography>
    <StaffEditor staff={newStaff} />
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/staffs/`)} />
    </Box>
  </div>
};

export default New