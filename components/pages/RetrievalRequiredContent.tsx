import React from "react"
import {Box, Typography} from "@material-ui/core"

export const ContentRetrievingNotice: React.FC = () => {
  return <Box display={"flex"} justifyContent={"center"} m={5}>
    <Box>
      <Typography variant={"h5"}>データ取得中</Typography>
      <Box m={2}>
        データをサーバから取得中です。
      </Box>
    </Box>
  </Box>
}

export const ContentRetrievalFailedNotice: React.FC<{
  description: string
}> = (props) => {
  return <Box display={"flex"} justifyContent={"center"} m={5}>
    <Box>
      <Typography variant={"h5"}>データ取得に失敗しました</Typography>
      <Box m={2}>
        サーバからのデータ取得に失敗しました。
        <Box m={2}>
          {props.description}
        </Box>
      </Box>
    </Box>
  </Box>
}

const RetrievalRequiredContent: React.FC<{
  data: any
}> = (props) => {
  if (!props.data) return <ContentRetrievingNotice />
  return <div>
    {props.children}
  </div>
}

export default RetrievalRequiredContent