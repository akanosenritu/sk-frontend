import React, {ChangeEvent, useMemo, useState} from 'react';
import {PositionGroup} from "../types/positions"
import MyCalendar from "./MyCalendar"
import {convertPositionGroupToCalendarEvents} from "../utils/positions"
import {makeStyles} from "@material-ui/core"

const useStyles = makeStyles({
  eventComponentPositionTitleInput: {
    backgroundColor: "inherit",
    border: "none",
    color: "white",
    marginRight: 10,
    outline: "none",
    padding: 0,
    width: "100%",
  }
})

const PositionGroupsCalendar: React.FC<{
  deletePositionGroup: (deletedPositionGroup: PositionGroup) => void,
  modifyPositionGroup: (modifiedPositionGroup: PositionGroup) => void,
  onSelectSlot: (start: Date, end: Date, action: "select" | "click" | "doubleClick") => void
  positionGroups: PositionGroup[],
}> = (props) => {
  const classes = useStyles()
  const calendarEvents = useMemo<CalendarEvent<PositionGroup>[]>(() => {
    return props.positionGroups.map(pos => convertPositionGroupToCalendarEvents(pos)).flat()
  }, [props.positionGroups])

  const EventComponent = (e: any) => {
    const event: CalendarEvent<PositionGroup> = e.event
    const positionGroup = event.data

    const [title, setTitle] = useState(positionGroup.title)
    const handlePositionTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value)
    }
    const onBlurTitleInput = () => {
      props.modifyPositionGroup({
        ...positionGroup,
        title
      })
    }
    return <div style={{display: "flex", alignItems: "center"}}>
      <div>
        <button type={"button"} onClick={()=>props.deletePositionGroup(positionGroup)}>消</button>
      </div>
      <div style={{marginLeft: 5, width: "100%", flexGrow: 1}}>
        <input
          className={classes.eventComponentPositionTitleInput}
          onBlur={onBlurTitleInput}
          onChange={handlePositionTitleChange}
          value={title}
        />
      </div>
    </div>
  }

  return <MyCalendar
    events={calendarEvents}
    onSelectSlot={props.onSelectSlot}
    views={["month"]}
    components={{event: EventComponent}}
  />
}

export default PositionGroupsCalendar
