import React, {useState} from "react"
import {Box, Button, Dialog, Typography} from "@material-ui/core"
import PositionManagerEditor, {PositionManagerEditorProps} from "../PositionManager/PositionManagerEditor"
import {PositionDataNullable, Position} from "../../../../types/positions"
import {format} from "date-fns"
import {H5} from "../../../Header"

type Props = Omit<PositionManagerEditorProps, "onSave"> & {
  position: Position,
  onCloseWithoutSave: () => void,
  onSave: (savedPosition: Position) => void,
}

export const PositionEditorDialog: React.FC<Props> = props => {
  const [position, setPosition] = useState<Position>(props.position)
  const onSaveTemporarily = (positionData: PositionDataNullable) => {
    setPosition({...position, date: props.position.date, data: positionData})
  }
  return <Dialog onClose={props.onCloseWithoutSave} open={true}>
    <Box m={2}>
      <Box>
        <H5>{`${format(props.position.date, "MM/dd")}の配置設定`}</H5>
        <Typography variant={"caption"}>チェックされている項目はデフォルトの設定を使用します。</Typography>
        <PositionManagerEditor
          {...props}
          initialValues={position.data}
          onSave={onSaveTemporarily}
        />
      </Box>
      <Box display={"flex"} justifyContent={"center"} mt={1}>
        <Button
          color={"primary"}
          onClick={()=>{
            props.onSave(position)
            props.onCloseWithoutSave()
          }}
          variant={"outlined"}
        >
          保存して閉じる
        </Button>
        <Button
          color={"secondary"}
          onClick={props.onCloseWithoutSave}
          variant={"outlined"}
        >
          保存せずに閉じる
        </Button>
      </Box>
    </Box>
  </Dialog>
}

