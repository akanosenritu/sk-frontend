import React, {ChangeEvent, useState} from 'react';
import {RegisteredStaff} from "../../../types/staffs"
import {Box, Button, Grid, MenuItem, Select, TextField, Typography} from "@material-ui/core"
import {FormikErrors, useFormik} from "formik"
import {H5} from "../../Header"
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import {saveRegisteredStaffOnBackend} from "../../../utils/api/staff"
import {useRouter} from "next/router"

type Status = "creating" | "saving" | "saved" | "editing" | "error"

const StaffEditor: React.FC<{
  staff: RegisteredStaff
}> = (props) => {
  const router = useRouter()
  const formik = useFormik({
    initialValues: props.staff,
    validate: values => {
      const errors: FormikErrors<RegisteredStaff> = {}
      return errors
    },
    onSubmit: async (values) => {
      setStatus("saving")
      const result = await saveRegisteredStaffOnBackend(values)
      if (result.ok) {
        setStatus("saved")
      } else {
        setStatus("error")
      }
    },
  })
  const handleChange = (event: ChangeEvent) => {
    setStatus("editing")
    formik.handleChange(event)
  }
  
  const [status, setStatus] = useState<Status>(props.staff.isSaved? "editing": "creating")
  
  return <Box style={{minWidth: 600}}>
    <Box>新しいスタッフを作成します。すべての項目を入力する必要があります。</Box>
    <Box>
      <Box mt={2}>
        <H5>ID</H5>
        <TextField
          autoComplete={"off"}
          disabled={true}
          error={!!formik.errors.uuid}
          fullWidth={true}
          helperText={formik.errors.uuid}
          InputLabelProps={{shrink: true}}
          label={"UUID*"}
          name={"uuid"}
          onChange={handleChange}
          style={{marginTop: 20}}
          value={formik.values.uuid}
          variant={"outlined"}
        />
        <TextField
          autoComplete={"off"}
          error={!!formik.errors.staffId}
          fullWidth={true}
          helperText={formik.errors.staffId}
          InputLabelProps={{shrink: true}}
          label={"スタッフID*"}
          name={"staffId"}
          onChange={handleChange}
          style={{marginTop: 20}}
          value={formik.values.staffId}
          variant={"outlined"}
        />
      </Box>
      <Box mt={2}>
        <H5>名前・性・生年月日</H5>
        <Grid container={true} spacing={1}>
          <Grid item xs={6}>
            <TextField
              autoComplete={"off"}
              error={!!formik.errors.lastName}
              fullWidth={true}
              helperText={formik.errors.lastName}
              InputLabelProps={{shrink: true}}
              label={"名字*"}
              name={"lastName"}
              onChange={handleChange}
              style={{marginTop: 20}}
              value={formik.values.lastName}
              variant={"outlined"}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoComplete={"off"}
              error={!!formik.errors.lastNameKana}
              fullWidth={true}
              helperText={formik.errors.lastNameKana}
              InputLabelProps={{shrink: true}}
              label={"名字 (かな)*"}
              name={"lastNameKana"}
              onChange={handleChange}
              style={{marginTop: 20}}
              value={formik.values.lastNameKana}
              variant={"outlined"}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoComplete={"off"}
              error={!!formik.errors.firstName}
              fullWidth={true}
              helperText={formik.errors.firstName}
              InputLabelProps={{shrink: true}}
              label={"名前*"}
              name={"firstName"}
              onChange={handleChange}
              style={{marginTop: 20}}
              value={formik.values.firstName}
              variant={"outlined"}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoComplete={"off"}
              error={!!formik.errors.firstNameKana}
              fullWidth={true}
              helperText={formik.errors.firstNameKana}
              InputLabelProps={{shrink: true}}
              label={"名前 (かな)*"}
              name={"firstNameKana"}
              onChange={handleChange}
              style={{marginTop: 20}}
              value={formik.values.firstNameKana}
              variant={"outlined"}
            />
          </Grid>
          <Grid item xs={9}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar={true}
                error={!!formik.errors.birthDate}
                format={"yyyy/MM/dd"}
                fullWidth={true}
                helperText={formik.errors.birthDate}
                InputLabelProps={{shrink: true}}
                label={"生年月日*"}
                name={"birthDate"}
                onChange={formik.handleChange}
                style={{marginTop: 20}}
                value={formik.values.birthDate}
                variant={"inline"}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={3}>
            <Select
              error={!!formik.errors.gender}
              fullWidth={true}
              label={"性*"}
              name={"gender"}
              onChange={formik.handleChange}
              style={{marginTop: 20}}
              value={formik.values.gender}
              variant={"outlined"}
            >
              <MenuItem value={"male"}>男</MenuItem>
              <MenuItem value={"female"}>女</MenuItem>
              <MenuItem value={"unspecified"}>未指定</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Box mt={2}>
          <H5>連絡先</H5>
          <TextField
            autoComplete={"off"}
            error={!!formik.errors.telephoneNumber}
            fullWidth={true}
            helperText={formik.errors.telephoneNumber}
            InputLabelProps={{shrink: true}}
            label={"電話番号*"}
            name={"telephoneNumber"}
            onChange={handleChange}
            style={{marginTop: 20}}
            value={formik.values.telephoneNumber}
            variant={"outlined"}
          />
          <TextField
            autoComplete={"off"}
            error={!!formik.errors.emailAddress}
            fullWidth={true}
            helperText={formik.errors.emailAddress}
            InputLabelProps={{shrink: true}}
            label={"メールアドレス*"}
            name={"emailAddress"}
            onChange={handleChange}
            style={{marginTop: 20}}
            value={formik.values.emailAddress}
            variant={"outlined"}
          />
        </Box>
      </Box>
      <Box mt={2}>
        <Button 
          color={"primary"} 
          disabled={status === "saving" || status === "saved"}
          fullWidth={true} 
          onClick={formik.submitForm} 
          variant={"contained"}
        >
          保存
        </Button>
        <Typography>
          {status === "saved" && <div>
            <span style={{color:"green"}}>保存されました。</span>
            <Button
              color={"primary"}
              fullWidth={true}
              onClick={()=>router.push("/staffs/new/")}
              variant={"contained"}
            >
              次のスタッフを作成する
            </Button>
          </div>}
          {status === "error" && <span style={{color:"red"}}>保存に失敗しました。</span>}
        </Typography>
      </Box>
    </Box>
  </Box>
}

export default StaffEditor