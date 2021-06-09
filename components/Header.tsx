import {Box, IconButton, makeStyles, Typography} from "@material-ui/core"
import React, {useState} from "react"
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles({
  expandButton: {
    backgroundColor: "white",
    padding: 5,
  },
})

export const H5: React.FC = props => {
  return <Typography variant={"h5"} style={{borderBottom: "1px solid black", paddingBottom: 3, marginBottom: 20}}>
    {props.children}
  </Typography>
}

export const NewH5: React.FC<{
  title: string
}> = props => {
  return <>
    <Typography variant={"h5"} style={{borderBottom: "1px solid black", paddingBottom: 3, marginBottom: 20}}>
      {props.title}
    </Typography>
    {props.children}
  </>
}

export const CollapsibleH5: React.FC<{
  title: string,
  isOpen: boolean,
}> = props => {
  const [isOpen, setIsOpen] = useState(props.isOpen)
  const classes = useStyles()
  return <>
    <Box display={"flex"} justifyContent={"space-between"} >
      <Box flexGrow={1} onClick={()=>setIsOpen(!isOpen)}>
        <Typography variant={"h5"} style={{borderBottom: "1px solid black", paddingBottom: 3, marginBottom: 3}}>{props.title}</Typography>
      </Box>
      <Box>
        {isOpen?
          <IconButton className={classes.expandButton} onClick={()=>setIsOpen(false)}><ExpandLessIcon /></IconButton>:
          <IconButton className={classes.expandButton} onClick={()=>setIsOpen(true)}><ExpandMoreIcon/></IconButton>
        }
      </Box>
    </Box>
    {isOpen && props.children}
  </>
}