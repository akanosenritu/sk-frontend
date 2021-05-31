import React from 'react';

import {Box, Drawer, makeStyles} from "@material-ui/core"
import AssignmentIcon from '@material-ui/icons/Assignment'
import DashboardIcon from '@material-ui/icons/Dashboard'
import GroupIcon from '@material-ui/icons/Group'
import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import {useRouter} from "next/router"

const useStyles = makeStyles({
  drawer: {
    alignItems: "center",
    background: "linear-gradient(225deg, rgba(0, 51, 102, 0.9), rgba(255, 102, 102, 0.9))",
    borderRight: "1px solid black",
    color: "white",
    display: "flex",
    flexDirection: "column",
    fontSize: 20,
    width: 250,
    height: "100%",
    position: "fixed",
  },
  drawerTitle: {
    borderBottom: "1px solid darkgray",
    fontSize: 20,
    fontWeight: "bold",
    width: "80%",
  },
  drawerItem: {
    fontSize: 20,
    height: 50,
    margin: 10,
    width: "100%",
    "& :hover": {
      backgroundColor: "#00ccff"
    }
  },
  drawerItemButton: {
    appearance: "none",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    height: 50,
    outline: "none",
    padding: 0,
    textAlign: "left",
    width: "100%",
  },
  drawerItemIcon: {
    color: "white",
    width: 30,
    marginRight: 10,
    verticalAlign: "middle",
  },
  drawerItemLink: {
    color: "white",
    fontSize: 20,
    textDecoration: "none",
  }
})

const MyDrawer: React.FC<{}> = () => {
  const classes = useStyles()
  const router = useRouter()
  const pathname = router.pathname
  const move = (destination: string) => router.push(destination)

  return <Box style={{width: 250}} mr={2}>
    <Drawer
      anchor={"left"}
      open={true}
      variant={"permanent"}
    >
      <Box className={classes.drawer}>
        <Box p={2} className={classes.drawerTitle}>
          管理アプリ v.0
        </Box>
        <Box p={2} className={classes.drawerItem}>
          <button
            className={classes.drawerItemButton}
            disabled={pathname === "/dashboard/"}
            onChange={()=>move("/dashboard/")}
          >
            <div style={{display: "inline-block"}}>
              <DashboardIcon className={classes.drawerItemIcon} />
            </div>
            <span className={classes.drawerItemLink}>状態</span>
          </button>
        </Box>
        <Box p={2} className={classes.drawerItem}>
          <button
            className={classes.drawerItemButton}
            disabled={pathname==="/events/"}
            onClick={()=>move("/events/")}
          >
            <div style={{display: "inline-block"}}>
              <AssignmentIcon className={classes.drawerItemIcon} />
            </div>
            <span className={classes.drawerItemLink}>イベント管理</span>
          </button>
        </Box>
        <Box p={2} className={classes.drawerItem}>
          <button
            className={classes.drawerItemButton}
            disabled={pathname==="/staffs/"}
            onClick={()=>move("/staffs/")}
          >
            <div style={{display: "inline-block"}}>
              <GroupIcon className={classes.drawerItemIcon} />
            </div>
            <span className={classes.drawerItemLink}>スタッフ管理</span>
          </button>
        </Box>
        <Box p={2} className={classes.drawerItem}>
          <button
            className={classes.drawerItemButton}
            disabled={pathname==="/settings/"}
            onClick={()=>move("/settings/")}
          >
            <div style={{display: "inline-block"}}>
              <SettingsIcon className={classes.drawerItemIcon} />
            </div>
            <span className={classes.drawerItemLink}>設定</span>
          </button>
        </Box>
        <Box p={2} className={classes.drawerItem}>
          <button
            className={classes.drawerItemButton}
            onClick={()=>move("/signOut/")}
          >
            <div style={{display: "inline-block"}}>
              <ExitToAppIcon className={classes.drawerItemIcon} />
            </div>
            <span className={classes.drawerItemLink}>サインアウト</span>
          </button>
        </Box>
      </Box>
    </Drawer>
  </Box>
}

export default MyDrawer