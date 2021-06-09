import React, {useMemo} from "react"
import {Box, Paper} from "@material-ui/core"
import {Event} from "../../types/positions"
import {AssignmentsByDayByStaff, getAssignmentsByDayByStaff, getDayStrings} from "../../utils/event"
import {RegisteredStaff, StaffsDict} from "../../types/staffs"

import {Table} from "./Table/Table"
import {MailsForEvent} from "../../types/mail"
import {CollapsibleH5, NewH5} from "../Header"
import {MailManagerDefaultMailTemplateSelector} from "./MailManagerDefaultMailTemplateSelector"
import {MailManagerDefaultConfirmationDateLimitSetter} from "./MailManagerDefaultConfirmationDateLimitSetter"

export const MailManager: React.FC<{
  event: Event,
  staffsDict: StaffsDict,
  mailsForEvent: MailsForEvent,
  updateMailsForEvent: (mailsForEvent: MailsForEvent) => Promise<Success|Failure>,
}> = props => {
  const {staffsDict} = props
  const dayStrings = useMemo<string[]>(() => getDayStrings(props.event), [props.event])
  const dates = useMemo<Date[]>(() => dayStrings.map(dayString => new Date(dayString)), [dayStrings])
  const assignmentByDayByStaff = useMemo<AssignmentsByDayByStaff>(() => getAssignmentsByDayByStaff(props.event), [props.event])
  const assignedStaffsSortedArray = useMemo<RegisteredStaff[]>(() => {
    const staffUUIDs = Object.keys(assignmentByDayByStaff)
    staffUUIDs.sort((a, b) => {
      const staffA = staffsDict[a]
      const staffB = staffsDict[b]
      return staffA.staffId < staffB.staffId? -1: 1
    })
    return staffUUIDs.map(uuid => staffsDict[uuid]).filter(staff => staff)
  }, [assignmentByDayByStaff])

  const setDefaultMailTemplate = (newMailTemplate: MailTemplate) => {
    return props.updateMailsForEvent({
      ...props.mailsForEvent,
      defaultTemplate: newMailTemplate
    })
  }

  const setConfirmDateLimit = (newConfirmDateLimit: Date) => {
    return props.updateMailsForEvent({
      ...props.mailsForEvent,
      confirmDateLimit: newConfirmDateLimit
    })
  }

  return <Box m={2}>
    <Box mt={5}>
      <CollapsibleH5 title={"デフォルトのテンプレートを設定する"} isOpen={false}>
        <MailManagerDefaultMailTemplateSelector
          defaultMailTemplate={props.mailsForEvent.defaultTemplate || null}
          setDefaultMailTemplate={setDefaultMailTemplate}
        />
      </CollapsibleH5>
    </Box>
    <Box mt={2}>
      <NewH5 title={"確認期限を設定する"}>
        <MailManagerDefaultConfirmationDateLimitSetter
          defaultConfirmationDateLimit={props.mailsForEvent.confirmDateLimit}
          setDefaultConfirmationDateLimit={setConfirmDateLimit}
        />
      </NewH5>
    </Box>
    <Box mt={2}>
      <NewH5 title={"生成されたメールを確認する"}>
        <Paper style={{padding: 10}}>
          <Table
            assignedStaffsSortedArray={assignedStaffsSortedArray}
            assignmentByDayByStaff={assignmentByDayByStaff}
            confirmationDateLimit={props.mailsForEvent.confirmDateLimit}
            dates={dates}
            dayStrings={dayStrings}
            defaultMailTemplate={props.mailsForEvent.defaultTemplate}
            event={props.event}
          />
        </Paper>
      </NewH5>
    </Box>
  </Box>
}