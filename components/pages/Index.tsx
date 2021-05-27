import React, {useState} from 'react'
import MyCalendar from "../MyCalendar"

const Index: React.FC = () => {
  const [events] = useState<CalendarEvent<any>[]>([])

  return (
    <div>
      <MyCalendar events={events} onSelectSlot={()=>{}} views={["month", "week", "agenda"]}/>
    </div>
  )
}

export default Index