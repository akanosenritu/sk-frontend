import React, {ChangeEvent, useState} from 'react';
import {RegisteredStaff} from "../../../types/staffs"
import {Box, Button, Grid, MenuItem, Select, TextField, Typography} from "@material-ui/core"
import {FormikErrors, useFormik} from "formik"
import {H5} from "../../Header"
import {isThisStaffIdAvailable, saveRegisteredStaffOnBackend} from "../../../utils/api/staff"
import {isValid} from "date-fns"
import {isValidTelephoneNumber} from "../../../utils/misc"
import * as yup from "yup"
import {Alert} from "@material-ui/lab"

type Status = "initial" | "saving" | "saved" | "editing" | "error"

export const StaffEditor: React.FC<{
  staff: RegisteredStaff
}> = (props) => {
  const formik = useFormik({
    initialValues: {
      ...props.staff,
      birthDateString: "",
    },
    validate: async (values) => {
      const errors: FormikErrors<RegisteredStaff & {birthDateString: string}> = {}

      // staffId
      if (values.staffId !== props.staff.staffId && !await isThisStaffIdAvailable(values.staffId)) errors.staffId = "このスタッフIDはすでに使われています。"
      if (!values.staffId) errors.staffId = "スタッフIDが空です。"
      // lastName
      if (!values.lastName) errors.lastName = "名字が空です。"
      // lastNameKana
      if (!values.lastNameKana) errors.lastNameKana = "名字 (かな) が空です。"
      // firstName
      if (!values.firstName) errors.firstName = "名前が空です。"
      // firstNameKana
      if (!values.firstNameKana) errors.firstNameKana = "名前 (かな) が空です。"
      // birthDateString
      if (!isValid(new Date(values.birthDateString))) errors.birthDateString = "不正な年月日です。"
      // telephoneNumber
      if (!isValidTelephoneNumber(values.telephoneNumber)) errors.telephoneNumber = "不正な電話番号形式です。"
      if (!values.telephoneNumber) errors.telephoneNumber = "電話番号が空です。"
      // emailAddress
      if (!await yup.string().email().isValid(values.emailAddress)) errors.emailAddress = "不正なメールアドレスです。"
      if (!values.emailAddress) errors.emailAddress = "メールアドレスが空です。"

      return errors
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setStatus("saving")
      const result = await saveRegisteredStaffOnBackend({
        ...values,
        birthDate: new Date(values.birthDateString)
      })
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
  
  const [status, setStatus] = useState<Status>("initial")
  
  return <Box style={{minWidth: 600}}>
    <Box>
      <Box mt={2}>
        <H5>ID</H5>
        <Box m={1}>
          <Typography variant={"body2"}>
            UUIDはシステムによって自動的に割り当てられる識別子で編集できません。他のスタッフと同じスタッフIDを割り当てることはできません。
          </Typography>
        </Box>
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
        <Box m={1}>
          <Typography variant={"body2"}>
            ふりがなはひらがなで記入してください。
          </Typography>
        </Box>
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
            <TextField
              error={!!formik.errors.birthDateString}
              fullWidth={true}
              helperText={formik.errors.birthDateString}
              InputLabelProps={{
                shrink: true
              }}
              label={"生年月日*"}
              name={"birthDateString"}
              onChange={formik.handleChange}
              style={{marginTop: 20}}
              type={"date"}
              value={formik.values.birthDateString}
              variant={"outlined"}
            />
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
        <Box m={1}>
          {status === "saved" && <Alert severity={"success"}>保存されました</Alert>}
          {status === "saving" && <Alert severity={"info"}>保存中です</Alert>}
          {status === "error" && <Alert severity={"error"}>保存に失敗しました</Alert>}
        </Box>
        <Button 
          color={"primary"} 
          disabled={status !== "editing"}
          fullWidth={true} 
          onClick={formik.submitForm} 
          variant={"contained"}
        >
          保存
        </Button>
        <Typography>
          {status === "saved" && <div>
          </div>}
        </Typography>
      </Box>
    </Box>
  </Box>
}
