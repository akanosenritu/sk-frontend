import React from "react"
import Index from "../../components/pages/staffs/Index"
import Layout from "../../components/Layout"
import AuthenticationRequiredContent from "../../components/pages/AuthenticationRequiredContent"

const Page: React.FC<{}> = () => {
  return <Layout title={"スタッフリスト"}>
    <AuthenticationRequiredContent>
      <Index />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page