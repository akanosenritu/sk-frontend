import React from 'react';
import {Event} from "../../types/positions"
import {Box} from "@material-ui/core"
import {AssignmentTable} from "./AssignmentTable/AssignmentTable"
import {NewH5} from "../Header"
import {BasicCaption} from "../BasicCaption"

export const EventStaffAssignmentEditor: React.FC<{
  event: Event
}> = (props) => {
  return <Box>
    <NewH5 title={"割り当て"}>
      <Box mt={2}>
        <BasicCaption>
          <ul>
            <li>一番下の「配置可能なスタッフ」列にいるスタッフがその日割り当て可能なスタッフです。</li>
            <li>スタッフをドラッグして割り当てを変えることができます。</li>
            <li>配置名をクリックすると配置データを閲覧できます。</li>
          </ul>
        </BasicCaption>
      </Box>
      <Box m={1} p={1} style={{backgroundColor: "white", width: "100%"}}>
        <AssignmentTable event={props.event} />
      </Box>
    </NewH5>
  </Box>
}