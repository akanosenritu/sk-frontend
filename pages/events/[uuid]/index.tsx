import React from "react"
import Layout from "../../../components/Layout"
import AuthenticationRequiredContent from "../../../components/pages/AuthenticationRequiredContent"
import {Detail} from "../../../components/pages/events/event/Detail"
import {GetServerSideProps} from "next"

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
  return <Layout title={"イベント詳細ページ"}>
    <AuthenticationRequiredContent>
      <Detail eventUUID={props.uuid} />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page