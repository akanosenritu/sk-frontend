import React from "react"

import Layout from '../components/Layout'
import Dashboard from "../components/pages/Dashboard"

const Page = () => (
  <Layout title="アプリにようこそ">
    <div >
      <Dashboard />
    </div>
  </Layout>
)

export default Page
