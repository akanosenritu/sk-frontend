import React, {useMemo} from 'react';
import {Event} from "../../types/positions"
import MyCalendar from "../MyCalendar"
import {getIntervals} from "../../utils/time"
import {useRouter} from "next/router"
import {getDates} from "../../utils/event"
import {Box} from "@material-ui/core"

export const EventsCalendar: React.FC<{
  events: Event[]
}> = (props) => {
  const calendarEvents = useMemo<CalendarEvent<Event>[]>(() => {
    const newCalendarEvents: CalendarEvent<Event>[] = []
    for (const event of props.events) {
      const dates = getDates(event)
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

  const router = useRouter()
  const onDoubleClickEvent = (calendarEvent: CalendarEvent<Event>) => {
    const event = calendarEvent.data
    router.push(`/events/${event.uuid}/`)
  }

  return <Box m={1} p={1}>
    <MyCalendar
      events={calendarEvents}
      onDoubleClickEvent={onDoubleClickEvent}
      selectable={false}
    />
  </Box>
}

export default EventsCalendar
