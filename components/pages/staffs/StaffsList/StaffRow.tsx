import React from 'react';
import {RegisteredStaff} from "../../../../types/staffs"
import {TableCell, TableRow} from "@material-ui/core"
import {formatDateToYYYYMMDD} from "../../../../utils/time"
import {intervalToDuration} from "date-fns"
import {getJapaneseTranslationForGender} from "../../../../utils/gender"

const StaffRow: React.FC<{
  staff: RegisteredStaff,
}> = (props) => {
  const {staff} = props
  return <TableRow>
    <TableCell key={"staffId"}>
      {staff.staffId}
    </TableCell>
    <TableCell key={"name"}>
      {`${staff.lastName} ${staff.firstName}`}
    </TableCell>
    <TableCell key={"kana"}>
      {`${staff.lastNameKana} ${staff.firstNameKana}`}
    </TableCell>
    <TableCell key={"gender"}>
      {getJapaneseTranslationForGender(staff.gender)}
    </TableCell>
    <TableCell key={"birthDate"}>
      {formatDateToYYYYMMDD(staff.birthDate)}
    </TableCell>
    <TableCell key={"age"}>
      満{intervalToDuration({start: staff.birthDate, end: new Date()}).years}歳
    </TableCell>
  </TableRow>
}

export default StaffRow