import React from 'react';
import {Box} from "@material-ui/core"
import {useRouter} from "next/router"
import {ActionItem} from "../../ActionItem"
import {NewH5} from "../../Header"
import {BasicPage} from "../../BasicPage"

const Index: React.FC = () => {
  const router = useRouter()

  return <BasicPage descriptions={""} title={"スタッフ管理"}>
    <NewH5 title={"操作"}>
      <Box style={{margin: "auto", display: "flex", justifyContent: "center"}}>
        <ActionItem
          title={"新しいスタッフを作成する"}
          description={"新しいスタッフを作成します。"}
          buttonText={"作成"}
          onClick={()=>router.push("/staffs/new/")}
        />
        <ActionItem
          title={"スタッフのリストを見る"}
          description={"現在作成されているスタッフのリストを閲覧できます。"}
          buttonText={"見る"}
          onClick={()=>router.push("/staffs/list/")}
        />
      </Box>
    </NewH5>
  </BasicPage>
}

export default Index