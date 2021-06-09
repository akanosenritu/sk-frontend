import React from "react"
import {Box, Grid, IconButton, makeStyles, Tooltip, Typography} from "@material-ui/core"
import {Event} from "../../types/positions"
import {collectEventStatistics, getDates} from "../../utils/event"
import {formatDateToMDEEE, getIntervals, getIntervalString} from "../../utils/time"
import EditIcon from '@material-ui/icons/Edit'

const useStyles = makeStyles({
  root: {
    height: 400,
    padding: 10,
  },
  topContainer: {
    backgroundColor: "lightgray",
    border: "1px solid lightgray",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
  },
  mainContainer: {
    border: "1px solid lightgray",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 10,
  },
  detailContainer: {
    borderRight: "1px solid lightgray",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    height: 250,
  },
  bottomButton: {
    fontSize: 12,
    padding: 3,
  },
  bottomButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  mailContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 250,
    padding: 10,
  },
  staffContainer: {
    borderRight: "1px solid lightgray",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 250,
    padding: 10,
  }
})

export const EventsListItem: React.FC<{
  event: Event
}> = props => {
  const classes = useStyles()
  const {event} = props
  const dates = getDates(event)
  const intervals = getIntervals(dates)
  const stats = collectEventStatistics(event)

  return <Box className={classes.root}>
    <Box className={classes.topContainer}>
      <Typography variant={"h5"}>{event.title}</Typography>
    </Box>
    <Box className={classes.mainContainer}>
      <Grid container justify={"center"}>
        <Grid item xs={4}>
          <Box className={classes.detailContainer}>
            <Box>
              <Box mt={1} mx={1}>
                期間: {intervals.map(interval => getIntervalString(interval)).join(", ")} (計{dates.length}日間)
              </Box>
              <Box mt={1} mx={1}>
                作成日: {formatDateToMDEEE(event.datetimeAdded)}
              </Box>
            </Box>
            <Box className={classes.bottomButtonContainer}>
              <IconButton size={"small"}><Tooltip title={"概要編集画面を開く"}><EditIcon /></Tooltip></IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box className={classes.staffContainer}>
            <Box style={{textAlign: "center"}}>
              <Box mt={1}>
                スタッフ充足率
                <Box mt={2}>
                  <Typography variant={"h4"}>{(stats.totalNumberOfStaffsAssigned / stats.totalNumberOfStaffsRequired * 100).toFixed(0)}%</Typography>
                </Box>
              </Box>
              <Box display={"flex"} justifyContent={"center"} mt={1}>
                <Box mt={1} p={1} style={{width: "50%"}}>
                  必要
                  <Box mt={1}>
                    <Typography variant={"h4"}>{stats.totalNumberOfStaffsRequired}</Typography>
                  </Box>
                </Box>
                <Box mt={1} p={1} style={{width: "50%"}}>
                  割り当て済み
                  <Box mt={2}>
                    <Typography variant={"h4"}>{stats.totalNumberOfStaffsAssigned}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={classes.bottomButtonContainer}>
              <IconButton size={"small"}><Tooltip title={"スタッフ割当画面を開く"}><EditIcon /></Tooltip></IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box className={classes.mailContainer}>
            <Box>
              メール送信状況

              工事中
            </Box>
            <Box className={classes.bottomButtonContainer}>
              <IconButton size={"small"}><Tooltip title={"メール編集画面を開く"}><EditIcon /></Tooltip></IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Box>
}