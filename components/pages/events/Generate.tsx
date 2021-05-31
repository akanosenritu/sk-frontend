import React, {useEffect, useState} from 'react'
import {makeStyles} from "@material-ui/core"
import {Event} from "../../../types/positions"
import {convertAPIEventToEvent} from "../../../utils/api/event"
import StaffList from "./Generate/StaffList"

const useStyles = makeStyles({
  root: {
    width: "80%",
    margin: "auto"
  }
})

const Generate = () => {
  const classes = useStyles()
  const [event, setEvent] = useState<Event|null>(null)
  useEffect(() => {
    fetch("/api/eventWithAssignedStaffs/")
      .then(res => res.json())
      .then(data => setEvent(convertAPIEventToEvent(data)))
  }, [])
  return (
    <div className={classes.root}>
      {event && <StaffList event={event} />}
    </div>
  );
};

export default Generate