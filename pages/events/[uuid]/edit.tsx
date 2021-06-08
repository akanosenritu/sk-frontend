import React from "react"
import Layout from "../../../components/Layout"
import AuthenticationRequiredContent from "../../../components/pages/AuthenticationRequiredContent"
import {GetServerSideProps} from "next"
import Edit from "../../../components/pages/events/Edit"

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
  return <Layout title={"イベントを編集する"}>
    <AuthenticationRequiredContent>
      <Edit eventUUID={props.uuid} />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page