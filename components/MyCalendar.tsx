import React from 'react'
import {Calendar, momentLocalizer} from "react-big-calendar"
import moment from "moment"
import "moment/locale/ja"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {endOfDay} from "date-fns"

const localizer = momentLocalizer(moment)

const formats = {
  dateFormat: "D",
  dayFormat: "D(ddd)",
  monthHeaderFormat: "YYYY年M月",
  dayHeaderFormat: 'M月D日(ddd)',
}

const messages = {
  next: "次",
  previous: "前",
  today: "今日",
  month: "月",
  week: "週",
  day: "日",
  agenda: "リスト"
}

type View = "month" | "week" | "day" | "agenda"

type Props = {
  events: CalendarEvent<any>[],
  onSelectSlot: (start: Date, end: Date, action: "select"|"click"|"doubleClick") => void,
  views?: View[],
  components?: {event: any}
}

type SlotInfo = {
  start: Date | string,
  end: Date | string,
  slots: Date[] | string[],
  action: "select" | "click" | "doubleClick"
}

const getEnd = (end: Date, action: "select" | "click" | "doubleClick"): Date => {
  if (action === "select") {
    return endOfDay(end)
  }
  return end
}

const MyCalendar: React.FC<Props> = (props) => {
  const onSelectSlot = (slotInfo: SlotInfo) => {
    const action = slotInfo.action
    const start = typeof slotInfo.start === "string"? new Date(slotInfo.start): slotInfo.start
    const end = getEnd(typeof slotInfo.end === "string"? new Date(slotInfo.end): slotInfo.end, action)
    props.onSelectSlot(start, end, action)
  }

  return (
    <Calendar
      defaultDate={moment().toDate()}
      defaultView={props.views? props.views[0]: "month"}
      views={props.views? props.views: ["month"]}
      localizer={localizer}
      startAccessor={"start"}
      endAccessor={"end"}
      events={props.events}
      style={{height: "100vh"}}
      culture={"ja-JP"}
      messages={messages}
      formats={formats}
      selectable={true}
      onSelectSlot={onSelectSlot}
      components={props.components}
      popup={true}
      eventPropGetter={(event: CalendarEvent<any>) => {
        return {
          style: {backgroundColor: event.backgroundColor}
        }
      }}
    />
  )
};

export default MyCalendar