import React, {useMemo} from 'react';
import {Event} from "../../../../types/positions"
import MyCalendar from "../../../MyCalendar"
import {getIntervals} from "../../../../utils/time"

const EventsCalendar: React.FC<{
  events: Event[]
}> = (props) => {
  const calendarEvents = useMemo<CalendarEvent<Event>[]>(() => {
    const newCalendarEvents: CalendarEvent<Event>[] = []
    for (const event of props.events) {
      const dates = [...new Set<Date>(event.positionGroups.map(group => group.positions.map(pos => pos.date)).flat(2))]
      const intervals = getIntervals(dates)
      for (const interval of intervals) {
        newCalendarEvents.push({
          allDay: true,
          backgroundColor: "blue",
          data: event,
          end: interval.end,
          start: interval.start,
          title: event.title,
        })
      }
    }
    return newCalendarEvents
  }, [props.events])
  return <MyCalendar events={calendarEvents} onSelectSlot={()=>{}} />
}

export default EventsCalendar
