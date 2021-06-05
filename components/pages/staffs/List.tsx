import React from 'react'
import PageWithDrawer from "../PageWithDrawer"
import {Typography} from "@material-ui/core"
import {getStaffs} from "../../../utils/api/staff"
import {RegisteredStaff} from "../../../types/staffs"
import useSWR from "swr"
import StaffsList from "./StaffsList/StaffsList"

const List = () => {
  const {data: staffs, error} = useSWR<RegisteredStaff[]>("fuck", getStaffs)
  console.log(staffs, error)
  return <PageWithDrawer>
    <Typography variant={"h4"}>作成済みスタッフのリスト</Typography>
    {staffs ?
      <StaffsList staffs={staffs} />:
      <div>スタッフリストの取得に失敗しました。<br />エラーメッセージ: {error}</div>
    }
  </PageWithDrawer>
};

export default List