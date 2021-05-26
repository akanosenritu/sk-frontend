import React from "react"

import Layout from '../components/Layout'
import Index from "../components/pages/Index"
import "react-big-calendar/lib/css/react-big-calendar.css"

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <div >
      <Index />
    </div>
  </Layout>
)

export default IndexPage
