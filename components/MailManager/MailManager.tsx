import React, {useMemo} from "react"
import {Box, Typography} from "@material-ui/core"
import {Event} from "../../types/positions"
import {AssignmentsByDayByStaff, getAssignmentsByDayByStaff, getDayStrings} from "../../utils/event"
import {RegisteredStaff, StaffsDict} from "../../types/staffs"

import {Table} from "./Table/Table"
import {MailsForEvent} from "../../types/mail"
import {CollapsibleH5, H5} from "../Header"
import {MailManagerDefaultMailTemplateSelector} from "./MailManagerDefaultMailTemplateSelector"

export const MailManager: React.FC<{
  event: Event,
  staffsDict: StaffsDict,
  mailsForEvent: MailsForEvent,
  updateMailsForEvent: (mailsForEvent: MailsForEvent) => void,
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
    props.updateMailsForEvent({
      ...props.mailsForEvent,
      defaultTemplate: newMailTemplate
    })
  }

  return <Box>
    <Typography variant={"h4"}>{props.event.title}</Typography>
    <Box m={2}>
      <Typography>
        設定された配置、スタッフ割当に基づいて生成されたメールの文面を閲覧できます。メールの文面を閲覧するには表のメールアイコンをクリックしてください。
      </Typography>
    </Box>
    <Box m={2} mt={5}>
      <CollapsibleH5 title={"デフォルトのテンプレートを編集する"} isOpen={false}>
        <Box mt={2}>
          メール本文生成の際に使用されるテンプレートのデフォルトを設定します。
        </Box>
        <MailManagerDefaultMailTemplateSelector
          defaultMailTemplate={props.mailsForEvent.defaultTemplate || null}
          setDefaultMailTemplate={setDefaultMailTemplate}
        />
      </CollapsibleH5>
    </Box>
    <Box m={2} mt={5}>
      <H5>生成されたメールを確認する</H5>
      <Table
        assignedStaffsSortedArray={assignedStaffsSortedArray}
        assignmentByDayByStaff={assignmentByDayByStaff}
        dates={dates}
        dayStrings={dayStrings}
        defaultMailTemplate={props.mailsForEvent.defaultTemplate}
        event={props.event}
      />
    </Box>
  </Box>
}