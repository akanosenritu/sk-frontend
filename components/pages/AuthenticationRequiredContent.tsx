import React, {useEffect} from 'react';
import {useUser} from "../../utils/user"
import {Box, Typography} from "@material-ui/core"

const AuthenticationDeniedNotice: React.FC = () => {
  return <Box display={"flex"} justifyContent={"center"} m={5}>
    <Box>
      <Typography variant={"h5"}>アクセスに失敗しました</Typography>
      <Box m={2}>
        認証が必要なデータにアクセスしようとしましたが、失敗しました。以下のケースが考えられます。
        <ul>
          <li>アクセス権限がないデータにアクセスしようとしている。 =&gt; 管理者にアクセス権限の設定を求めてください。</li>
          <li>認証情報が間違っている、あるいは古い。 =&gt; 一度ログアウトした後、再度ログインすると解決する場合があります。</li>
        </ul>
      </Box>
    </Box>
  </Box>
}

const AuthenticationCheckingNotice: React.FC = () => {
  return <Box display={"flex"} justifyContent={"center"} m={5}>
    <Box>
      <Typography variant={"h5"}>アクセス権限を確認中です</Typography>
      <Box m={2}>
        認証が必要なデータにアクセスするために、権限を確認中です。
      </Box>
    </Box>
  </Box>
}

const AuthenticationRequiredContent: React.FC = (props) => {
  const {user, checkUserStatus} = useUser()
  useEffect(() => {
    checkUserStatus()
  }, [])
  if (user.status === "anonymous") return <AuthenticationDeniedNotice />
  if (user.status === "checking") return <AuthenticationCheckingNotice />
  return <div>
    {props.children}
  </div>
}

export default AuthenticationRequiredContent