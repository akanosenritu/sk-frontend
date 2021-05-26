import React from 'react'
import {Divider, makeStyles, Step, StepLabel, Stepper} from "@material-ui/core"
import EventEditor from "./EventEditor"

const useStyles = makeStyles({
  root: {
    width: "80%",
    margin: "auto"
  }
})

const New = () => {
  const classes = useStyles()
  const steps = ["概要を設定する", "人数を設定する", "保存する"]

  return (
    <div className={classes.root}>
      <Stepper activeStep={0}>
        {steps.map(label => {
          return <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        })}
      </Stepper>
      <Divider/>
      <EventEditor myEvent={null} />
    </div>
  );
};

export default New