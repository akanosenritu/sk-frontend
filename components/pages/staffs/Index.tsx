import React, {useEffect, useState} from 'react';
import {Box, Button, Typography} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"
import {useRouter} from "next/router"
import PageWithDrawer from "../PageWithDrawer"
import {RegisteredStaff} from "../../../types/staffs"

const useStyles = makeStyles({
  calendarBox: {
  },
  contentBox: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    width: "80%",
  },
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleBox: {
    display: "flex",
    justifyContent: "center"
  },
})
const Index: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()

  const [staffs, setStaffs] = useState<RegisteredStaff[]>([])

  return <PageWithDrawer>
    <Box className={classes.titleBox} mt={2}>
      <Typography variant={"h4"}>スタッフ管理</Typography>
    </Box>
    <Box mt={2} mx={5} style={{margin: "auto", display: "flex", justifyContent: "center"}}>
      <Box style={{border: "1px solid darkgray", borderRadius: 5, width: 400}} m={3}>
        <Box m={2}><Typography variant={"h6"}>新しいスタッフを作成する</Typography></Box>
        <Box m={2}>新しいスタッフを作成し、配置付けができるようにします。</Box>
        <Box style={{display: "flex", justifyContent: "center"}} my={2}>
          <div>
            <Button color={"primary"} variant={"contained"} onClick={()=>router.push("/staffs/new/")}>作成</Button>
          </div>
        </Box>
      </Box>
      <Box style={{border: "1px solid darkgray", borderRadius: 5, width: 400}} m={3}>
        <Box m={2}><Typography variant={"h6"}>スタッフのリストを見る</Typography></Box>
        <Box m={2}>現在利用可能なスタッフのリストが閲覧できます。</Box>
        <Box style={{display: "flex", justifyContent: "center"}} my={2}>
          <div>
            <Button color={"primary"} variant={"contained"} onClick={()=>router.push("/staffs/new/")} disabled={true}>見る</Button>
          </div>
        </Box>
      </Box>
    </Box>
  </PageWithDrawer>
}

export default Index