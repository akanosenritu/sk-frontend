import React from 'react'
import {Typography} from "@material-ui/core"
import StaffEditor from "./StaffEditor"
import {createDefaultRegisteredStaff} from "../../../utils/staff"

const New = () => {
  const newStaff = createDefaultRegisteredStaff()
  return <>
    <Typography variant={"h4"}>新しいスタッフを作成</Typography>
    <StaffEditor staff={newStaff} />
  </>
};

export default New