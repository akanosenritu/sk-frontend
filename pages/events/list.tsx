import React from "react"
import Layout from "../../components/Layout"
import {List} from "../../components/pages/events/List"
import AuthenticationRequiredContent from "../../components/pages/AuthenticationRequiredContent"

const Page = () => {
  return <Layout title={"イベント管理"}>
    <AuthenticationRequiredContent>
      <List />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page