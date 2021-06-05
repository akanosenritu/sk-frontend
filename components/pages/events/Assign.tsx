import React, {useEffect, useState} from "react"
import {Event} from "../../../types/positions"
import AssignTable from "./EventStaffAssignTable/AssignTable"
import {getEventByUUID} from "../../../utils/api/event"
import {sampleStaffData} from "../../../utils/staff"


const Assign: React.FC<{
  eventUUID: string
}> = (props) => {

  const [event, setEvent] = useState<Event|null>(null)
  useEffect(() => {
    getEventByUUID(props.eventUUID)
      .then(result => {
        if (result.ok) {
          setEvent(result.data)
        }
      })
  }, [])

  return <div style={{width: "80%", margin: "auto"}}>
    {event && <AssignTable
      availableStaffUUIDsByDay={{
        "2021-05-03": sampleStaffData.slice(0, 20).map(staff => staff.uuid),
        "2021-05-04": sampleStaffData.slice(0, 20).map(staff => staff.uuid),
        "2021-05-05": sampleStaffData.slice(0, 30).map(staff => staff.uuid),
        "2021-05-06": sampleStaffData.slice(0, 40).map(staff => staff.uuid),
        "2021-05-07": sampleStaffData.slice(0, 50).map(staff => staff.uuid),
      }}
      event={event}
    />}
  </div>
}

export default Assign