import {Box, Button, TextField, Typography} from "@material-ui/core"
import React, {ChangeEvent, useState} from "react"
import {H5} from "../../Header"
import {createDefaultPositionData, createPositionGroup,} from "../../../utils/positions"
import SettingsManagerBase from "./SettingsManagerBase"
import {useClothesSettings, useGatheringPlaceSettings} from "../../../utils/setting"

import {Event, PositionGroup} from "../../../types/positions"
import produce from "immer"
import {validateEvent} from "../../../utils/event"
import PositionManager from "../../PositionManager/PositionManager"
import {saveEventOnBackend} from "../../../utils/api/event"
import PositionGroupsCalendar from "../../PositionGroupsCalendar"
import {Alert} from "@material-ui/lab"


type Props = {
  event: Event
}
type Status = "initial" | "editing" | "saving" | "saved" | "saveFailed"
const EventEditor: React.FC<Props> = (props) => {
  const [event, setEvent] = useState<Event>(props.event)
  const [status, setStatus] = useState<Status>("initial")

  const getPositionGroupIndex = (searchingPositionGroup: PositionGroup) => {
    return event.positionGroups.findIndex(positionGroup => positionGroup.uuid === searchingPositionGroup.uuid)
  }
  const addPositionGroup = (positionGroup: PositionGroup) => {
    setEvent(event => produce(event, draft => {
      draft.positionGroups = [...draft.positionGroups, positionGroup]
      draft.isEdited = true
    }))
    setStatus("editing")
  }
  const modifyPositionGroup = (newPositionGroup: PositionGroup) => {
    const index = getPositionGroupIndex(newPositionGroup)
    if (index === -1) return
    setEvent(event => produce(event, draft => {
      draft.positionGroups[index] = {...newPositionGroup, isEdited: true}
    }))
    setStatus("editing")
  }
  const deletePositionGroup = (positionGroup: PositionGroup) => {
    const index = getPositionGroupIndex(positionGroup)
    if (index === -1) return
    setEvent(event => produce(event, draft => {
      draft.positionGroups.splice(index, 1)
      draft.isEdited = true
    }))
    setStatus("editing")
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setEvent(produce(event, draft => {
      draft.title = e.target.value
      draft.isEdited = true
    }))
    setStatus("editing")
  }

  const {settings: clothesSettings, createSetting: createClothesSetting} = useClothesSettings()
  const {settings: gatheringPlaceSettings, createSetting: createGatheringPlaceSetting} = useGatheringPlaceSettings()

  const onSaveEvent = async () => {
    setStatus("saving")
    const result = await saveEventOnBackend(event)
    if (result.ok) {
      setEvent(event)
      setStatus("saved")
    } else {
      setStatus("saveFailed")
    }
  }

  const calendarOnSelectSlot = (start: Date, end: Date, action: "select" | "click" | "doubleClick") => {
    if (action === "doubleClick") return
    if (clothesSettings.length === 0 || gatheringPlaceSettings.length === 0) return
    const newPosition = createPositionGroup({
      title: "デフォルトの配置名",
      start,
      end,
      defaultPositionData: createDefaultPositionData(clothesSettings[0], gatheringPlaceSettings[0]),
    })
    addPositionGroup(newPosition)
  }

  const {ok: isValid, errors: validateErrors} = validateEvent(event)

  return <Box style={{minWidth: 600}}>
    <Box mt={5}>
      <H5>1. 概要を設定する</H5>
      <TextField
        variant={"outlined"}
        label={"イベント名*"}
        fullWidth={true}
        InputLabelProps={{shrink: true}}
        style={{marginTop: 20}}
        name={"title"}
        value={event.title}
        onChange={handleTitleChange}
        autoComplete={"off"}
      />
      <Box mt={1} ml={1}>
        <Typography variant={"body2"}>イベント名は簡潔かつわかりやすいものにしてください。</Typography>
      </Box>
    </Box>
    <Box mt={5} mb={5}>
      <H5>2. 配置の日程を設定する</H5>
      <Box m={1}>
        <Typography variant={"body2"}>
          空のセルをクリック、またはドラッグすることで配置を追加できます。[消] ボタンを押すと、アイテムを消すことができます。配置名をクリックすると、配置名を編集できます。
          同じ名前の配置が複数あるとわかりにくいので、避けたほうがよいでしょう。

          ここで設定する配置は必ずしも現実の配置と一致する必要はありません。同じ服装・集合場所・集合場所を共有するひとまとまりのグループと考えてください。あまり細分化すると設定するのが大変です。
        </Typography>
      </Box>
      <PositionGroupsCalendar
        deletePositionGroup={deletePositionGroup}
        modifyPositionGroup={modifyPositionGroup}
        onSelectSlot={calendarOnSelectSlot}
        positionGroups={event.positionGroups}
      />
    </Box>
    <div />
    <Box mt={3}>
      <H5>3. 服装の設定を作成する</H5>
      <Typography variant={"body2"}>
        配置の設定で使用する服装設定を作成します。既存の設定を使う場合はそのままで構いません。
        既存の設定は他のイベントと結びついている場合があるため、ここでは編集できません。既存の設定の編集ボタンを押すとコピーした内容の別の設定が作成できます。
        編集が終わったら保存ボタンを押してください。メール文面作成の際には、説明の部分が使われます。
      </Typography>
      <SettingsManagerBase settings={clothesSettings} onCreate={createClothesSetting}/>
    </Box>
    <Box mt={3}>
      <H5>4. 集合場所の設定を作成する</H5>
      <Typography variant={"body2"}>
        配置の設定で使用する集合場所設定を作成します。既存の設定を使う場合はそのままで構いません。
        既存の設定は他のイベントと結びついている場合があるため、ここでは編集できません。既存の設定の編集ボタンを押すとコピーした内容の別の設定が作成できます。
        編集が終わったら保存ボタンを押してください。メール文面作成の際には、説明の部分が使われます。
      </Typography>
      <SettingsManagerBase settings={gatheringPlaceSettings} onCreate={createGatheringPlaceSetting}/>
    </Box>
    <Box mt={5}>
      <H5>5. 配置ごとの時間、服装などを設定する</H5>
      <Typography variant={"body2"}>
        配置ごとに日毎の集合時間、集合場所、服装を設定してください。配置ごとにデフォルトの値が設定されており、その値を編集するとデフォルト値を使用している日すべてに影響します。
        日毎の値を個別に設定したい場合は、設定したい部分をクリックし、日毎の編集画面を開いてください。
      </Typography>
      {event.positionGroups.map(positionGroup => (
        <PositionManager
          positionGroup={positionGroup}
          clothesSettings={clothesSettings}
          gatheringPlaceSettings={gatheringPlaceSettings}
          onDelete={deletePositionGroup}
          onSave={modifyPositionGroup}
        />
      ))}
      {event.positionGroups.length === 0 && <Box m={3} style={{color: "red"}}>配置がありません。</Box>}
    </Box>
    <Box mt={3}>
      <H5>6. 保存する</H5>
      <Typography variant={"body2"}>保存ボタンを押すことでデータが保存され、スタッフの割当ができるようになります。</Typography>
      {!isValid && <Box mt={1} style={{color: "red"}}>
        設定に問題があるため保存できません。
        <ul>
          {Object.entries(validateErrors).map(entry => {
            return <li>{entry[0]}: {entry[1]}</li>
          })}
        </ul>
      </Box>}
      <Box mt={1}>
        {status === "saving" && <Alert severity={"info"}>イベントを保存中</Alert>}
        {status === "saved" && <Alert severity={"success"}>イベントを保存しました</Alert>}
        {status === "saveFailed" && <Alert severity={"error"}>イベントの保存に失敗しました</Alert>}
      </Box>
      <Box mt={1}>
        <Box>
          <Button
            color={"primary"}
            disabled={!isValid　|| status !== "editing"}
            fullWidth={true}
            onClick={onSaveEvent}
            variant={"contained"}
          >
            保存
          </Button>
        </Box>
      </Box>
    </Box>
  </Box>
}

export default EventEditor