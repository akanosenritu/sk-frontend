import React from 'react'
import {Box, Typography} from "@material-ui/core"
import StaffsList from "./StaffsList/StaffsList"
import {useStaffs} from "../../../utils/staff"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../RetrievalRequiredContent"
import {BackButton} from "../../BackButton"
import {useRouter} from "next/router"

const List = () => {
  const {staffs, error} = useStaffs()
  const router = useRouter()
  if (error) return <ContentRetrievalFailedNotice description={"スタッフの取得に失敗しました"} />
  if (!staffs) return <ContentRetrievingNotice />
  return <div>
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/staffs/`)} />
    </Box>
    <Typography variant={"h4"}>作成済みスタッフのリスト</Typography>
    <StaffsList staffs={staffs} />
    <Box my={2}>
      <BackButton onClick={()=>router.push(`/staffs/`)} />
    </Box>
  </div>
};

export default List