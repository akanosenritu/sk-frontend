import React, {useState} from "react"
import PositionTable from "../PositionTable/PositionTable"
import {Box, IconButton, InputBase, Typography} from "@material-ui/core"
import {Setting} from "../../../../utils/setting"
import PositionManagerEditor from "./PositionManagerEditor"
import {PositionGroup, PositionDataNullable, Position} from "../../../../types/positions"
import {v4} from "uuid"
import DeleteIcon from '@material-ui/icons/Delete'
import {PositionEditorDialog} from "../PositionTable/Dialogs"
import {getIndexOfMatchingPositionData, getPositionDataOrDefaultData} from "../../../../utils/positions"
import produce from "immer"

const PositionManager: React.FC<{
  positionGroup: PositionGroup,
  clothesSettings: Setting[],
  gatheringPlaceSettings: Setting[],
  onSave: (updatedPositionGroup: PositionGroup) => void,
  onDelete: (deletedPositionGroup: PositionGroup) => void,
}> = (props) => {
  const onSaveDefaultData = (newData: PositionDataNullable) => {
    props.onSave({
      ...props.positionGroup,
      defaultPositionData: getPositionDataOrDefaultData(newData, props.positionGroup.defaultPositionData)
    })
  }
  const onClickDelete = () => {
    props.onDelete(props.positionGroup)
  }

  const positionGroups = [props.positionGroup]

  const [editingPosition, setEditingPosition] = useState<Position|null>(null)
  const onClickRowOnPositionTable = (position: Position) => setEditingPosition(position)
  const onSaveSubPositionData = (position: Position) => {
    // @ts-ignore
    const index = getIndexOfMatchingPositionData(props.positionGroup.positions, position)
    if (index !== -1) {
      props.onSave({
        ...props.positionGroup,
        positions: produce(props.positionGroup.positions, draft => {
          draft[index] = position
        })
      })
    }
  }

  return <Box mt={2} ml={1} style={{border: "1px solid lightgray", borderRadius: 20}}>
    <Box style={{borderBottom: "1px solid darkgray", borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: "lightgray", padding: 10}}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant={"h6"} style={{flexGrow: 1}}>
          <InputBase
            disabled={true}
            style={{fontSize: 20}}
            value={props.positionGroup.title}
          />
        </Typography>
        <Box>
          <IconButton size={"small"} onClick={onClickDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
    <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"} p={2}>
      <Box>
        <Typography>標準の設定</Typography>
        <PositionManagerEditor
          clothesSettings={props.clothesSettings}
          defaultValues={props.positionGroup.defaultPositionData}
          gatheringPlaceSettings={props.gatheringPlaceSettings}
          initialValues={props.positionGroup.defaultPositionData}
          isEditingDefaultData={true}
          onSave={onSaveDefaultData}
        />
      </Box>
      <PositionTable
        key={v4()}
        onClickRow={onClickRowOnPositionTable}
        positionGroups={positionGroups}
      />
    </Box>
    {editingPosition && <PositionEditorDialog
      clothesSettings={props.clothesSettings}
      defaultValues={props.positionGroup.defaultPositionData}
      gatheringPlaceSettings={props.gatheringPlaceSettings}
      initialValues={editingPosition.data}
      isEditingDefaultData={false}
      onCloseWithoutSave={()=>setEditingPosition(null)}
      onSave={onSaveSubPositionData}
      position={editingPosition}
    />}
  </Box>
}

export default PositionManager