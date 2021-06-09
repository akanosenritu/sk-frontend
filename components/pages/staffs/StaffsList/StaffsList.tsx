import React, {useMemo} from 'react';
import {RegisteredStaff} from "../../../../types/staffs"
import {Box, makeStyles} from "@material-ui/core"
import MaterialTable from "material-table"
import {getJapaneseTranslationForGender} from "../../../../utils/gender"
import {getAge} from "../../../../utils/time"

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  }
})

export const StaffsList: React.FC<{
  staffs: RegisteredStaff[]
}> = (props) => {
  const classes = useStyles()
  const tableData = useMemo(() => {
    return props.staffs.map(staff => {
      return {
        ...staff,
        name: `${staff.lastName} ${staff.firstName}`,
        kana: `${staff.lastNameKana} ${staff.firstNameKana}`,
        genderString: getJapaneseTranslationForGender(staff.gender),
        age: `${getAge(staff.birthDate)}歳`,
      }
    })
  }, [props.staffs])

  return <Box className={classes.root}>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <MaterialTable
      columns={[
        {
          align: "right",
          field: "staffId",
          headerStyle: {
            textAlign: "center",
          },
          title: "スタッフID",
          width: 150,
        },
        {
          field: "name",
          headerStyle: {
            textAlign: "center",
          },
          width: 200,
          title: "名前",
        },
        {
          title: "かな",
          field: "kana",
          headerStyle: {
            textAlign: "center",
          },
        },
        {
          title: "性別",
          field: "genderString",
          headerStyle: {
            textAlign: "center",
          },
          width: 100,
        },
        {
          title: "年齢",
          field: "age",
          headerStyle: {
            textAlign: "center",
          },
          width: 100,
        },
        {
          title: "メールアドレス",
          field: "emailAddress",
          headerStyle: {
            textAlign: "center",
          },
        }
      ]}
      data={tableData}
      detailPanel={() => {
        return <div>工事中</div>
      }}
      localization={{
        pagination: {
          firstTooltip: "先頭",
          labelRowsSelect: "行",
          lastTooltip: "最後",
          nextTooltip: "次",
          previousTooltip: "前",
        },
        toolbar: {
          searchPlaceholder: "検索ワードを入力",
          searchTooltip: "検索",
        },
      }}
      options={{
        maxBodyHeight: "80vh",
        pageSize: Math.min(tableData.length, 50),
        pageSizeOptions: [Math.min(tableData.length, 50)],
      }}
      style={{width: "100%"}}
      title={""}
    />
  </Box>
}