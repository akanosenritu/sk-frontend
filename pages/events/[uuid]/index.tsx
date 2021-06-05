import React from "react"
import Layout from "../../../components/Layout"
import AuthenticationRequiredContent from "../../../components/pages/AuthenticationRequiredContent"
import EventDetail from "../../../components/pages/events/EventDetail"
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
  return <Layout>
    <AuthenticationRequiredContent>
      <EventDetail eventUUID={props.uuid} />
    </AuthenticationRequiredContent>
  </Layout>
}

export default Page