import React from "react"
import {Box, Button, Dialog, makeStyles} from "@material-ui/core"
import {PositionGroup} from "../../types/positions"
import {ClothesSetting} from "../../utils/clothes"
import {GatheringPlaceSetting} from "../../utils/gatheringPlace"
import {PositionTable} from "../PositionTable/PositionTable"

const useStyles = makeStyles({
  root: {
    minWidth: 800,
  }
})

export const PositionManagerDialog: React.FC<{
  clothesSettings: ClothesSetting[],
  gatheringPlaceSettings: GatheringPlaceSetting[],
  onClose: () => void,
  positionGroup: PositionGroup,
}> = props => {
  const classes = useStyles()
  return <Dialog fullWidth={true} maxWidth={"md"} open={true}>
    <Box className={classes.root}>
      <Box display={"flex"} justifyContent={"center"} m={2}>
        <PositionTable isEditable={false} positionGroups={[props.positionGroup]} onClickRow={()=>{}} />
      </Box>
      <Box display={"flex"} justifyContent={"center"} m={2}>
        <Button color={"primary"} onClick={props.onClose} variant={"contained"}>閉じる</Button>
      </Box>
    </Box>
  </Dialog>
}