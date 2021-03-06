import React from "react"
import Index from "../../components/pages/events/Index"
import Layout from "../../components/Layout"
import AuthenticationRequiredContent from "../../components/pages/AuthenticationRequiredContent"

const Page = () => {
  return <Layout title={"イベント管理"}>
    <AuthenticationRequiredContent>
      <Index />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page