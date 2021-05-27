import React, {useEffect, useState} from "react"
import {Event} from "../../../types/positions"
import AssignTable from "./AssignTable/AssignTable"
import {convertAPIEventToEvent} from "../../../utils/api/event"
import {sampleStaffData} from "../../../utils/staff"

const Assign: React.FC = () => {

  const [event, setEvent] = useState<Event|null>(null)
  useEffect(() => {
    fetch("/api/events/")
      .then(res => res.json())
      .then(data => setEvent(convertAPIEventToEvent(data)))
  }, [])

  return <div style={{width: "80%", margin: "auto"}}>
    {event && <AssignTable
      availableStaffUUIDsByDay={{
        "2021-05-03": sampleStaffData.slice(0, 10).map(staff => staff.uuid),
        "2021-05-04": sampleStaffData.slice(11, 20).map(staff => staff.uuid),
        "2021-05-05": sampleStaffData.slice(21, 30).map(staff => staff.uuid),
        "2021-05-06": sampleStaffData.slice(31, 40).map(staff => staff.uuid),
        "2021-05-07": sampleStaffData.slice(41, 50).map(staff => staff.uuid),
      }}
      event={event}
    />}
  </div>
}

export default Assign