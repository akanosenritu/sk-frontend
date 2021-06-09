import React from 'react'
import {Box, makeStyles, Typography} from "@material-ui/core"
import {StaffsList} from "./StaffsList/StaffsList"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {BackButton} from "../../BackButton"
import {useRouter} from "next/router"
import {useQuery} from "react-query"
import {getStaffs} from "../../../utils/api/staff"

const useStyles = makeStyles({
  bottomButtonsContainer: {
    display: "flex",
  },
  createAnotherStaffButtonContainer: {
    marginLeft: 30,
    flexGrow: 1,
  },
  listContainer: {
    backgroundColor: "white",
    borderRadius: 15,
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
})

export const List = () => {
  const {data: staffs, error} = useQuery("staffs", () => getStaffs())
  const router = useRouter()
  const classes = useStyles()
  if (error) return <ContentRetrievalFailedNotice description={"スタッフの取得に失敗しました"} />
  if (staffs === undefined) return <ContentRetrievingNotice />
  return <div>
    <Box className={classes.titleContainer} mt={2}>
      <Typography variant={"h4"}>作成済みスタッフのリスト</Typography>
    </Box>
    <Box className={classes.listContainer} mt={2}>
      <StaffsList staffs={staffs} />
    </Box>
    <Box my={2} className={classes.bottomButtonsContainer}>
      <BackButton onClick={()=>router.push(`/staffs/`)} />
    </Box>
  </div>
};
