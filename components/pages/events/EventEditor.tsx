import {Box, Button, makeStyles, TextField, Typography} from "@material-ui/core"
import React, {ChangeEvent, useState} from "react"
import {useFormik} from "formik"
import MyCalendar from "../../MyCalendar"
import {H5} from "../../Header"
import {
  convertPositionGroupToCalendarEvents,
  createDefaultPositionData,
  createPositionGroup,
} from "../../../utils/positions"
import SettingsManagerBase from "./SettingsManagerBase"
import {useClothesSettings, useGatheringPlaceSettings} from "../../../utils/setting"

import {PositionGroup} from "../../../types/positions"
import {Event} from "../../../types/positions"
import produce from "immer"
import {createDefaultEvent} from "../../../utils/event"
import PositionManager from "./PositionManager/PositionManager"
import {createEventOnBackend} from "../../../utils/api/event"

const useStyles = makeStyles({
  eventComponentPositionTitleInput: {
    backgroundColor: "inherit",
    border: "none",
    color: "white",
    marginRight: 10,
    outline: "none",
    padding: 0,
    width: "100%",
  }
})

type Props = {
  myEvent: MyEvent|null
}

// type EventEditorStatus = "Editing" | "Saving" | "Saved" | "SaveFailed"

const EventEditor: React.FC<Props> = () => {
  const classes = useStyles()
  // const [status, setStatus] = useState<EventEditorStatus>("Editing")
  const [event, setEvent] = useState<Event>(createDefaultEvent())

  const EventComponent = (e: any) => {
    const event: CalendarEvent<PositionGroup> = e.event
    const positionGroup = event.data

    const [positionTitle, setPositionTitle] = useState(positionGroup.title? positionGroup.title: "デフォルトの配置名")
    const handlePositionTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setPositionTitle(event.target.value)
    }
    const onBlurPositionTitleInput = () => {
      if (positionTitle === "") {
        setPositionTitle("デフォルトの配置名")
      } else {
        modifyPositionGroup({...positionGroup, title: positionTitle})
      }
    }

    return <div style={{display: "flex", alignItems: "center"}}>
      <div>
        <button type={"button"} onClick={()=>deletePositionGroup(positionGroup)}>消</button>
      </div>
      <div style={{marginLeft: 5, width: "100%", flexGrow: 1}}>
        <input value={positionTitle} onChange={handlePositionTitleChange} onSubmit={onBlurPositionTitleInput} className={classes.eventComponentPositionTitleInput} onBlur={onBlurPositionTitleInput}/>
      </div>
    </div>
  }

  const getPositionGroupIndex = (searchingPositionGroup: PositionGroup) => {
    return event.positionGroups.findIndex(positionGroup => positionGroup.uuid === searchingPositionGroup.uuid)
  }
  const addPositionGroup = (positionGroup: PositionGroup) => {
    setEvent(event => produce(event, draft => {
      draft.positionGroups = [...draft.positionGroups, positionGroup]
    }))
  }
  const modifyPositionGroup = (positionGroup: PositionGroup) => {
    const index = getPositionGroupIndex(positionGroup)
    if (index === -1) return
    setEvent(event => produce(event, draft => {
      draft.positionGroups[index] = positionGroup
    }))
  }
  const deletePositionGroup = (positionGroup: PositionGroup) => {
    const index = getPositionGroupIndex(positionGroup)
    if (index === -1) return
    setEvent(event => produce(event, draft => {
      draft.positionGroups.splice(index, 1)
    }))
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

  const [title, setTitle] = useState("デフォルトのタイトル")
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setTitle(event.target.value)
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      assignedTo: ""
    },
    onSubmit: () => {}
  })

  const {settings: clothesSettings, createSetting: createClothesSetting} = useClothesSettings()
  const {settings: gatheringPlaceSettings, createSetting: createGatheringPlaceSetting} = useGatheringPlaceSettings()

  const getCalendarEvents = (): CalendarEvent<PositionGroup>[] => {
    return event.positionGroups.map(pos => convertPositionGroupToCalendarEvents(pos)).flat()
  }

  const onSaveEvent = () => {
    createEventOnBackend(event)
  }

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
        value={title}
        onChange={handleTitleChange}
        autoComplete={"off"}
      />
      <TextField
        variant={"outlined"}
        label={"担当者*"}
        fullWidth={true}
        InputLabelProps={{shrink: true}}
        style={{marginTop: 20}}
        name={"assignedTo"}
        value={formik.values.assignedTo}
        onChange={formik.handleChange}
        autoComplete={"off"}
      />
    </Box>
    <Box mt={5} mb={5}>
      <H5>2. 配置の日程を設定する</H5>
      <Typography variant={"body1"}>
        空のセルをクリック、またはドラッグすることで配置を追加できます。[消] ボタンを押すと、アイテムを消すことができます。
      </Typography>
      <MyCalendar
        events={getCalendarEvents()}
        onSelectSlot={calendarOnSelectSlot}
        views={["month"]}
        components={{event: EventComponent}}
      />
    </Box>
    <div />
    <Box mt={3}>
      <H5>3. 服装の設定を作成する</H5>
      <Typography variant={"body1"}>
        配置の設定で使用する服装設定を作成します。既存の設定を使う場合はそのままで構いません。
      </Typography>
      <SettingsManagerBase settings={clothesSettings} onCreate={createClothesSetting}/>
    </Box>
    <Box mt={3}>
      <H5>4. 集合場所の設定を作成する</H5>
      <Typography variant={"body1"}>
        配置の設定で使用する集合場所設定を作成します。既存の設定を使う場合はそのままで構いません。
      </Typography>
      <SettingsManagerBase settings={gatheringPlaceSettings} onCreate={createGatheringPlaceSetting}/>
    </Box>
    <Box mt={5}>
      <H5>5. 配置ごとの時間、服装などを設定する</H5>
      <Typography variant={"body1"}>
        配置ごとに日毎の集合時間、集合場所、服装を設定してください。
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
    </Box>
    <Box mt={3}>
      <H5>6. 保存する</H5>
      <Typography variant={"body1"}>保存ボタンを押すことでデータが保存され、スタッフの割当ができるようになります。</Typography>
      <Box mt={1}>
        <Button
          color={"primary"}
          fullWidth={true}
          onClick={onSaveEvent}
          variant={"contained"}
        >作成</Button>
      </Box>
    </Box>
    <div style={{height: "100vh"}}/>
  </Box>
}

export default EventEditor