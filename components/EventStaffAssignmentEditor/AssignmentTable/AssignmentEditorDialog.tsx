import React from "react"
import {Box, Checkbox, IconButton, InputBase, makeStyles, Typography} from "@material-ui/core"
import {Search} from "@material-ui/icons"

const useStyles = makeStyles({})

export const AssignmentEditorDialog: React.FC<{}> = props => {
  const classes = useStyles()
  return <Box style={{border: "1px solid black"}}>
    <Box m={2}>
      <Typography variant={"h6"}>  配置名　ー　１月１日（月）</Typography>
    </Box>
    <Box display={"flex"} flexDirection={"column"} m={2} style={{border: "1px solid black"}}>
      <Box style={{width: 300, height: 500, border: "1px solid black"}} m={2}>
        <Box display={"flex"} m={1} style={{border: "1px solid black"}}>
          <InputBase style={{flexGrow: 1}}/>
          <IconButton>
            <Search />
          </IconButton>
        </Box>
        <Box m={1}>
          <Box style={{width:"100%", border: "1px solid black"}} display={"flex"} alignItems={"center"}>
            <Checkbox checked={true} color={"default"}/>
            <Box flexGrow={1}>
              <Typography>田中　一郎</Typography>
            </Box>
          </Box>
          <Box style={{width:"100%", border: "1px solid black"}} display={"flex"} alignItems={"center"}>
            <Checkbox checked={true} color={"default"}/>
            <Box flexGrow={1}>
              <Typography>田中　一郎</Typography>
            </Box>
          </Box>
          <Box style={{width:"100%", border: "1px solid black"}} display={"flex"} alignItems={"center"}>
            <Checkbox checked={true} color={"default"}/>
            <Box flexGrow={1}>
              <Typography>田中　一郎</Typography>
            </Box>
          </Box>
          <Box style={{width:"100%", border: "1px solid black"}} display={"flex"} alignItems={"center"}>
            <Checkbox checked={true} color={"default"}/>
            <Box flexGrow={1}>
              <Typography>田中　一郎</Typography>
            </Box>
          </Box>
          <Box style={{width:"100%", border: "1px solid black"}} display={"flex"} alignItems={"center"}>
            <Checkbox checked={true} color={"default"}/>
            <Box flexGrow={1}>
              <Typography>田中　一郎</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box style={{border: "1px solid black"}} m={2} display={"flex"}>
        <Box m={1}>
          人数:
        </Box>
        <Box m={1}>
          5 / 10
        </Box>
        <Box m={1}>
          5 / 10
        </Box>
        <Box m={1}>
          5 / 10
        </Box>
      </Box>
    </Box>
  </Box>
}