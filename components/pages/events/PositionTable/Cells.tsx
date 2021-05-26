import React from "react"

export const CellWithDefault: React.FC<{isDefault: boolean}> = props => {
  return <td style={{backgroundColor: props.isDefault? "#f0f0f0": ""}}>
    {props.children}
  </td>
}

