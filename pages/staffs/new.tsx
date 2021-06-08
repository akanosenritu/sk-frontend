import React from "react"
import Layout from "../../components/Layout"
import New from "../../components/pages/staffs/New"
import AuthenticationRequiredContent from "../../components/pages/AuthenticationRequiredContent"

const Page = () => {
  return <Layout title={"新しいスタッフを作成する"}>
    <AuthenticationRequiredContent>
      <New />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page