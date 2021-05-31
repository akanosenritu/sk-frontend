import React from "react"
import {format, parse} from "date-fns"

const DayHeader: React.FC<{
  dayString: string
}> = props => {
  const date = parse(props.dayString, "yyyy-MM-dd", new Date())
  return <td style={{width: 178}}>
    {format(date, "MM/dd")}
  </td>
}

export default DayHeader