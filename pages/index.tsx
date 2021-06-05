import React from "react"

import Index from "../components/pages/Index"
import "react-big-calendar/lib/css/react-big-calendar.css"
import BareLayout from "../components/BareLayout"

const IndexPage = () => (
  <BareLayout title="管理アプリ">
    <div >
      <Index />
    </div>
  </BareLayout>
)

export default IndexPage
