import React, {ChangeEvent, useState} from "react"
import {Box, Checkbox, MenuItem, Select, TextField} from "@material-ui/core"
import {isValidRawTimeString, rawTimeToString, stringToRawTime} from "../../utils/time"
import {FormikErrors, useFormik} from "formik"
import {ClothesSetting} from "../../utils/clothes"
import {GatheringPlaceSetting} from "../../utils/gatheringPlace"
import {PositionData, PositionDataNullable, ValueWithDefault} from "../../types/positions"
import {getValueWithDefault} from "../../utils/positions"

export type PositionManagerEditorProps = {
  clothesSettings: ClothesSetting[],
  defaultValues: PositionData,
  gatheringPlaceSettings: GatheringPlaceSetting[],
  isEditable: boolean,
  isEditingDefaultData: boolean,
  initialValues: PositionDataNullable,
  onSave: (newValues: PositionDataNullable) => void,
}

export const PositionManagerEditor: React.FC<PositionManagerEditorProps> = (props) => {
  const initialValues: {
    [key in keyof PositionData]: ValueWithDefault<PositionData[key]>
  } = Object.fromEntries(
    Object.keys(props.initialValues).map(k => {
      const key = k as keyof PositionData
      return [
        key,
        getValueWithDefault(key, props.initialValues, props.defaultValues)
      ] as const
    })
  ) as {
    [key in keyof PositionData]: ValueWithDefault<PositionData[key]>
  }

  const [isFieldInheritingDefault, setIsFieldInheritingDefault] = useState<{
    [key in keyof PositionData]: boolean
  }>(Object.fromEntries(Object.entries(initialValues).map(([k, v]) => {
    return [
      k as keyof PositionData,
      v.isInheritingDefault
    ] as const
  })) as {
    [key in keyof PositionData]: boolean
  })

  const prepareFormikValues = () => {
    const values = Object.fromEntries(
      Object.entries(initialValues).map(([key, value]) => {
        return [key, value.value]
      })
    ) as {
      [key in keyof PositionData]: PositionData[key]
    }
    return {
      ...values,
      startHourString: rawTimeToString(values.startHour),
      endHourString: rawTimeToString(values.endHour),
      clothesUUID: values.clothes.uuid,
      gatheringPlaceUUID: values.gatheringPlace.uuid,
    }
  }
  const formik = useFormik({
    initialValues: prepareFormikValues(),
    validate: (values) => {
      const errors: FormikErrors<PositionData & {startHourString: string, endHourString: string}> = {}
      if (!isValidRawTimeString(values.startHourString)) errors.startHourString = "不正な時間です"
      if (!isValidRawTimeString(values.endHourString)) errors.endHourString = "不正な時間です"
      if (values.male < 0) errors.male = "負数の人数です"
      if (values.female < 0) errors.female = "負数の人数です"
      if (values.unspecified < 0) errors.unspecified = "負数の人数です"
      return errors
    },
    validateOnChange: false,
    onSubmit: (values) => {
      const newData: PositionDataNullable = {
        clothes: !isFieldInheritingDefault["clothes"]?
          props.clothesSettings.find(s => s.uuid === values.clothesUUID) || formik.initialValues.clothes:
          null,
        endHour: !isFieldInheritingDefault["endHour"]? stringToRawTime(values.endHourString) || formik.initialValues.endHour: null,
        female: !isFieldInheritingDefault["female"]? values.female: null,
        gatheringPlace: !isFieldInheritingDefault["gatheringPlace"]?
          props.gatheringPlaceSettings.find(s => s.uuid === values.gatheringPlaceUUID) || formik.initialValues.gatheringPlace:
          null,
        isEdited: true,
        isSaved: values.isSaved,
        male: !isFieldInheritingDefault["male"]? values.male: null,
        startHour: !isFieldInheritingDefault["startHour"]? stringToRawTime(values.startHourString) || formik.initialValues.startHour: null,
        unspecified: !isFieldInheritingDefault["unspecified"]? values.unspecified: null,
        uuid: values.uuid
      }
      props.onSave(newData)
    }
  })

  const onBlurStartHour = () => {
    const str = formik.values.startHourString
    const rawTime = stringToRawTime(str)
    if (rawTime) formik.setFieldValue("startHourString", rawTimeToString(rawTime))
    onBlur()
  }
  const onBlurEndHour = () => {
    const str = formik.values.endHourString
    const rawTime = stringToRawTime(str)
    if (rawTime) formik.setFieldValue("endHourString", rawTimeToString(rawTime))
    onBlur()
  }
  const onBlur = async () => {
    await formik.submitForm()
  }
  const onChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|{ name?: string | undefined; value: unknown; }>) => {
    formik.handleChange(event)
    formik.submitForm()
  }

  const onClickDefaultCheckbox = (clickedField: keyof PositionData) => {
    const currentState = isFieldInheritingDefault[clickedField]
    if (currentState) {
      setIsFieldInheritingDefault(state => ({...state, [clickedField]: false}))
    } else {
      if (clickedField === "clothes") {
        formik.setFieldValue("clothesUUID", props.defaultValues["clothes"].uuid)
      } else if (clickedField === "gatheringPlace") {
        formik.setFieldValue("gatheringPlaceUUID", props.defaultValues["gatheringPlace"].uuid)
      } else {
        formik.setFieldValue(clickedField, props.defaultValues[clickedField])
      }
      setIsFieldInheritingDefault(state => ({...state, [clickedField]: true}))
    }
  }

  return <Box style={{minWidth: 500}} ml={2}>
    <Box display={"flex"} mt={1} alignItems={"center"}>
      <Box style={{width: "30%", verticalAlign: "middle"}}>
        開始時間:
      </Box>
      <Box flexGrow={1}>
        <TextField
          disabled={!props.isEditable || isFieldInheritingDefault["startHour"]}
          error={!!formik.errors.startHourString}
          fullWidth={true}
          label={formik.errors.startHourString}
          name={"startHourString"}
          onBlur={onBlurStartHour}
          onChange={onChange}
          size={"small"}
          title={"開始時間"}
          value={formik.values.startHourString}
          variant={"outlined"}
        />
      </Box>
      <Checkbox
        disabled={!props.isEditable || props.isEditingDefaultData}
        checked={props.isEditingDefaultData || isFieldInheritingDefault["startHour"]}
        color={"default"}
        onClick={() => onClickDefaultCheckbox("startHour")}
      />
    </Box>
    <Box display={"flex"} mt={1} alignItems={"center"}>
      <Box style={{width: "30%", verticalAlign: "middle"}}>
        終了時間:
      </Box>
      <Box flexGrow={1}>
        <TextField
          variant={"outlined"}
          title={"終了時間"}
          value={formik.values.endHourString}
          size={"small"}
          name={"endHourString"}
          disabled={!props.isEditable || isFieldInheritingDefault["endHour"]}
          onBlur={onBlurEndHour}
          onChange={onChange}
          error={!!formik.errors.endHourString}
          label={formik.errors.endHourString}
          fullWidth
        />
      </Box>
      <Checkbox
        disabled={!props.isEditable || props.isEditingDefaultData}
        checked={props.isEditingDefaultData || isFieldInheritingDefault["endHour"]}
        color={"default"}
        onClick={() => onClickDefaultCheckbox("endHour")}
      />
    </Box>
    <Box display={"flex"} mt={1} alignItems={"center"}>
      <Box style={{width: "30%", verticalAlign: "middle"}}>
        人数・男性:
      </Box>
      <Box flexGrow={1}>
        <TextField
          error={!!formik.errors.male}
          fullWidth={true}
          label={formik.errors.male}
          name={"male"}
          disabled={!props.isEditable || !props.isEditingDefaultData && isFieldInheritingDefault["male"]}
          onBlur={onBlur}
          onChange={onChange}
          size={"small"}
          title={"人数・男性"}
          type={"number"}
          value={formik.values.male}
          variant={"outlined"}
        />
      </Box>
      <Checkbox
        disabled={!props.isEditable || props.isEditingDefaultData}
        checked={props.isEditingDefaultData || isFieldInheritingDefault["male"]}
        color={"default"}
        onClick={() => onClickDefaultCheckbox("male")}
      />
    </Box>
    <Box display={"flex"} mt={1} alignItems={"center"}>
      <Box style={{width: "30%", verticalAlign: "middle"}}>
        人数・女性:
      </Box>
      <Box flexGrow={1}>
        <TextField
          error={!!formik.errors.female}
          fullWidth={true}
          label={formik.errors.female}
          name={"female"}
          disabled={!props.isEditable || isFieldInheritingDefault["female"]}
          onBlur={onBlur}
          onChange={onChange}
          size={"small"}
          title={"人数・女性"}
          type={"number"}
          value={formik.values.female}
          variant={"outlined"}
        />
      </Box>
      <Checkbox
        disabled={!props.isEditable || props.isEditingDefaultData}
        checked={props.isEditingDefaultData || isFieldInheritingDefault["female"]}
        color={"default"}
        onClick={() => onClickDefaultCheckbox("female")}
      />
    </Box>
    <Box display={"flex"} mt={1} alignItems={"center"}>
      <Box style={{width: "30%", verticalAlign: "middle"}}>
        人数・未指定:
      </Box>
      <Box flexGrow={1}>
        <TextField
          error={!!formik.errors.unspecified}
          fullWidth={true}
          label={formik.errors.unspecified}
          name={"unspecified"}
          disabled={!props.isEditable || isFieldInheritingDefault["unspecified"]}
          onBlur={onBlur}
          onChange={onChange}
          size={"small"}
          title={"人数・未指定"}
          type={"number"}
          value={formik.values.unspecified}
          variant={"outlined"}
        />
      </Box>
      <Checkbox
        disabled={!props.isEditable || props.isEditingDefaultData}
        checked={props.isEditingDefaultData || isFieldInheritingDefault["unspecified"]}
        color={"default"}
        onClick={() => onClickDefaultCheckbox("unspecified")}
      />
    </Box>
    <Box display={"flex"} mt={1} alignItems={"center"}>
      <Box style={{width: "30%", verticalAlign: "middle"}}>
        服装:
      </Box>
      <Box flexGrow={1}>
        <Select
          variant={"outlined"}
          title={"服装"}
          value={formik.values.clothesUUID}
          fullWidth
          style={{height: 40}}
          name={"clothesUUID"}
          disabled={!props.isEditable || isFieldInheritingDefault["clothes"]}
          onBlur={onBlur}
          onChange={onChange}
        >
          {props.clothesSettings.map(setting => (
            <MenuItem value={setting.uuid}>{setting.title}</MenuItem>
          ))}
        </Select>
      </Box>
      <Checkbox
        disabled={!props.isEditable || props.isEditingDefaultData}
        checked={props.isEditingDefaultData || isFieldInheritingDefault["clothes"]}
        color={"default"}
        onClick={() => onClickDefaultCheckbox("clothes")}
      />
    </Box>
    <Box display={"flex"} mt={1} alignItems={"center"}>
      <Box style={{width: "30%", verticalAlign: "middle"}}>
        集合場所:
      </Box>
      <Box flexGrow={1}>
        <Select
          variant={"outlined"}
          title={"集合場所"}
          value={formik.values.gatheringPlaceUUID}
          fullWidth
          style={{height: 40}}
          name={"gatheringPlaceUUID"}
          disabled={!props.isEditable || isFieldInheritingDefault["gatheringPlace"]}
          onBlur={onBlur}
          onChange={onChange}
        >
          {props.gatheringPlaceSettings.map(setting => (
            <MenuItem value={setting.uuid}>{setting.title}</MenuItem>
          ))}
        </Select>
      </Box>
      <Checkbox
        disabled={!props.isEditable || props.isEditingDefaultData}
        checked={props.isEditingDefaultData || isFieldInheritingDefault["gatheringPlace"]}
        color={"default"}
        onClick={() => onClickDefaultCheckbox("gatheringPlace")}
      />
    </Box>
  </Box>
}