import {Box, makeStyles, TextField, Typography} from "@material-ui/core"
import React, {ChangeEvent, useState} from "react"
import {useFormik} from "formik"
import MyCalendar from "../../MyCalendar"
import {H5} from "../../Header"
import {convertPositionGroupToCalendarEvents, createPositionGroup, DefaultPositionData} from "../../../utils/positions"
import {defaultClothesSettings} from "../../../utils/clothes"
import SettingsManagerBase from "./SettingsManagerBase"
import {defaultGatheringPlaceSettings} from "../../../utils/gatheringPlace"
import {useSettings} from "../../../utils/setting"
import PositionManager from "./PositionManager/PositionManager"
import {PositionGroup} from "../../../types/positions"
import produce from "immer"

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

const EventEditor: React.FC<Props> = () => {
  const classes = useStyles()

  const EventComponent = (event: any) => {
    const myPosition: PositionGroup = event.event

    const [positionTitle, setPositionTitle] = useState(myPosition.title? myPosition.title: "デフォルトの配置名")
    const handlePositionTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setPositionTitle(event.target.value)
    }
    const onBlurPositionTitleInput = () => {
      if (positionTitle === "") {
        setPositionTitle("デフォルトの配置名")
      } else {
        modifyMyPosition({...myPosition, title: positionTitle})
      }
    }

    return <div style={{display: "flex", alignItems: "center"}}>
      <div>
        <button type={"button"} onClick={()=>deleteMyPosition(event.event)}>消</button>
      </div>
      <div style={{marginLeft: 5, width: "100%", flexGrow: 1}}>
        <input value={positionTitle} onChange={handlePositionTitleChange} onSubmit={onBlurPositionTitleInput} className={classes.eventComponentPositionTitleInput} onBlur={onBlurPositionTitleInput}/>
      </div>
    </div>
  }

  // const [myEvent, setMyEvent] = useState<MyEvent>(props.myEvent? props.myEvent: createNewMyEvent())
  const [myPositions, setMyPositions] = useState<PositionGroup[]>([])
  const getMyPositionIndex = (position: PositionGroup) => {
    return myPositions.findIndex(myPosition => myPosition.uuid === position.uuid)
  }
  const addMyPosition = (position: PositionGroup) => {
    setMyPositions(myPositions => [...myPositions, position])
  }
  const modifyMyPosition = (position: PositionGroup) => {
    const index = getMyPositionIndex(position)
    if (index === -1) return
    setMyPositions(myPositions => {
      const newMyPositions = [...myPositions]
      newMyPositions.splice(index, 1, position)
      return newMyPositions
    })
  }
  const deleteMyPosition = (position: PositionGroup) => {
    const index = getMyPositionIndex(position)
    if (index === -1) return
    setMyPositions(myPositions => {
      const newMyPositions = [...myPositions]
      newMyPositions.splice(index, 1)
      return newMyPositions
    })
  }

  const calendarOnSelectSlot = (start: Date, end: Date, action: "select" | "click" | "doubleClick") => {
    if (action === "doubleClick") return
    const newPosition = createPositionGroup({
      title: "デフォルトの配置名",
      start,
      end,
      defaultPositionData: DefaultPositionData,
    })
    addMyPosition(newPosition)
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

  const {settings: clothesSettings, updateSettings: updateClothesSettings} = useSettings(defaultClothesSettings)
  const {settings: gatheringPlaceSettings, updateSettings: updateGatheringPlaceSettings} = useSettings(defaultGatheringPlaceSettings)

  const getCalendarEvents = (): CalendarEvent[] => {
    return myPositions.map(pos => convertPositionGroupToCalendarEvents(pos)).flat()
  }

  const updatePosition = (updatedPosition: PositionGroup) => {
    const positionIndex = myPositions.findIndex(pos => pos.uuid === updatedPosition.uuid)
    if (positionIndex !== -1) {
      setMyPositions(positions => {
        return produce(positions, draft => {
          draft[positionIndex] = updatedPosition
        })
      })
    } else {
      setMyPositions(positions => [...positions, updatedPosition])
    }
  }

  return <Box style={{minWidth: 600}}>
    <Box mt={5}>
      <H5>概要</H5>
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
      <H5>イベントの日程を選択する</H5>
      <Typography variant={"body1"}>
        空のセルをクリック、またはドラッグすることでアイテムを追加できます。性別をクリックすると、アイテムの性別を変えられます。[x] ボタンを押すと、アイテムを消すことができます。<br />
        複数日にまたがるものは、同じ開始時間・終了時間のアイテムが複数日繰り返されることを意味します。開始時間・終了時間が日毎に異なる場合は、日毎にアイテムを作成してください。
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
      <H5>服装の設定を作成する</H5>
      <Typography variant={"body1"}>
        デフォルトの服装設定以外を使用する場合は、新しい服装設定を作成してください。
      </Typography>
      <SettingsManagerBase settings={clothesSettings} onSave={updateClothesSettings}/>
    </Box>
    <Box mt={3}>
      <H5>集合場所の設定を作成する</H5>
      <Typography variant={"body1"}>
        デフォルトの集合場所設定以外を使用する場合は、新しい集合場所設定を作成してください。
      </Typography>
      <SettingsManagerBase settings={gatheringPlaceSettings} onSave={updateGatheringPlaceSettings}/>
    </Box>
    <Box mt={5}>
      <H5>配置ごとの時間、服装などを設定する</H5>
      <Typography variant={"body1"}>
        配置ごとに日毎の集合時間、集合場所、服装を設定してください。
      </Typography>
      {myPositions.map(position => (
        <PositionManager
          positionGroup={position}
          clothesSettings={clothesSettings}
          gatheringPlaceSettings={gatheringPlaceSettings}
          onDelete={deleteMyPosition}
          onSave={updatePosition}
        />
      ))}
    </Box>
    <div style={{height: "100vh"}}/>
  </Box>
}

export default EventEditor