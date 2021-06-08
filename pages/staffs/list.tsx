import React from "react"
import List from "../../components/pages/staffs/List"
import Layout from "../../components/Layout"
import AuthenticationRequiredContent from "../../components/pages/AuthenticationRequiredContent"


const Page: React.FC<{}> = (props) => {
  return <Layout title={"スタッフリスト"}>
    <AuthenticationRequiredContent>
      <List />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page