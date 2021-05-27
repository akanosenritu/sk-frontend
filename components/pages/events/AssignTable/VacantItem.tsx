import React from 'react';
import {makeStyles} from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    border: "1px solid #999999",
    borderRadius: 3,
    display: "flex",
    margin: 3,
    height: 50,
  },
  title: {
    alignItems: "center",
    backgroundColor: "#ffcc5c",
    borderRight: "1px solid #999999",
    color: "white",
    display: "flex",
    height: 50,
    justifyContent: "center",
    width: 30,
  }
})

const VacantItem: React.FC<{
  vacancies: {
    male: number,
    female: number,
    unspecified: number
  }
}> = (props) => {
  const classes = useStyles()
  // const {male, female, unspecified} = props.vacancies
  return <div className={classes.root}>
    <div className={classes.title}>
      <div>空</div>
    </div>
    <div style={{flexGrow: 1}}>

    </div>
  </div>
}

export default VacantItem