import React from "react"
import {Box, Grid, IconButton, makeStyles, Tooltip, Typography} from "@material-ui/core"
import {Event} from "../../types/positions"
import {collectEventStatistics, getDates} from "../../utils/event"
import {formatDateToJaMDEEE, getIntervals, getIntervalString} from "../../utils/time"
import EditIcon from '@material-ui/icons/Edit'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import {useRouter} from "next/router"

const useStyles = makeStyles({
  bottomButton: {
    fontSize: 12,
    padding: 3,
  },
  bottomButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  detailContainer: {
    borderRight: "1px solid lightgray",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    height: 330,
  },
  mailContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 330,
    padding: 10,
  },
  mainContainer: {
    // border: "1px solid lightgray",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: 350,
    padding: 10,
  },
  openEventDetailButton: {
    color: "white",
  },
  root: {
    backgroundColor: "white",
    borderRadius: 15,
    height: 400,
    margin: 10,
  },
  staffContainer: {
    borderRight: "1px solid lightgray",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 330,
    padding: 10,
  },
  topContainer: {
    background: "linear-gradient(225deg, rgba(54, 102, 102, 0.9), rgba(220, 102, 102, 0.9))",
    backgroundColor: "rgba(54, 0, 102, 0.9)",
    color: "white",
    border: "1px solid lightgray",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    display: "flex",
    height: 50,
    justifyContent: "space-between",
    padding: 10,
  },
})

export const EventsListItem: React.FC<{
  event: Event
}> = props => {
  const classes = useStyles()
  const {event} = props
  const dates = getDates(event)
  const intervals = getIntervals(dates)
  const stats = collectEventStatistics(event)

  const router = useRouter()

  return <Box className={classes.root}>
    <Box className={classes.topContainer}>
      <Typography variant={"h5"}>{event.title}</Typography>
      <Box>
        <IconButton
          className={classes.openEventDetailButton}
          onClick={()=>router.push(`/events/${event.uuid}/`)}
          size={"small"}
        >
          <OpenInNewIcon />
        </IconButton>
      </Box>
    </Box>
    <Box className={classes.mainContainer}>
      <Grid container justify={"center"}>
        <Grid item xs={4}>
          <Box className={classes.detailContainer}>
            <Box>
              <Box mt={1} mx={1}>
                ??????: {intervals.map(interval => getIntervalString(interval)).join(", ")} (???{dates.length}??????)
              </Box>
              <Box mt={1} mx={1}>
                ?????????: {formatDateToJaMDEEE(event.datetimeAdded)}
              </Box>
            </Box>
            <Box className={classes.bottomButtonContainer}>
              <IconButton onClick={()=>router.push(`/events/${event.uuid}/edit/`)} size={"small"}>
                <Tooltip title={"???????????????????????????"}><EditIcon /></Tooltip>
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box className={classes.staffContainer}>
            <Box style={{textAlign: "center"}}>
              <Box mt={1}>
                ?????????????????????
                <Box mt={2}>
                  <Typography variant={"h4"}>{(stats.totalNumberOfStaffsAssigned / stats.totalNumberOfStaffsRequired * 100).toFixed(0)}%</Typography>
                </Box>
              </Box>
              <Box display={"flex"} justifyContent={"center"} mt={1}>
                <Box mt={1} p={1} style={{width: "50%"}}>
                  ??????
                  <Box mt={1}>
                    <Typography variant={"h4"}>{stats.totalNumberOfStaffsRequired}</Typography>
                  </Box>
                </Box>
                <Box mt={1} p={1} style={{width: "50%"}}>
                  ??????????????????
                  <Box mt={2}>
                    <Typography variant={"h4"}>{stats.totalNumberOfStaffsAssigned}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={classes.bottomButtonContainer}>
              <IconButton onClick={()=>router.push(`/events/${event.uuid}/assign/`)} size={"small"}>
                <Tooltip title={"?????????????????????????????????"}><EditIcon /></Tooltip>
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box className={classes.mailContainer}>
            <Box>
              ?????????????????????

              ?????????
            </Box>
            <Box className={classes.bottomButtonContainer}>
              <IconButton onClick={()=>router.push(`/events/${event.uuid}/mail/`)} size={"small"}>
                <Tooltip title={"??????????????????????????????"}><EditIcon /></Tooltip>
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Box>
}