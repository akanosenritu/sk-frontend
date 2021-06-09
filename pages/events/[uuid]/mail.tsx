import React from "react"
import Layout from "../../../components/Layout"
import AuthenticationRequiredContent from "../../../components/pages/AuthenticationRequiredContent"
import {GetServerSideProps} from "next"
import {Mail} from "../../../components/pages/events/Mail"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uuid = context.params && context.params.uuid
  if (!uuid) return {notFound: true}
  return {
    props: {uuid}
  }
}

const Page: React.FC<{
  uuid: string,
}> = (props) => {
  return <Layout title={"確認メール"}>
    <AuthenticationRequiredContent>
      <Mail eventUUID={props.uuid} />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page