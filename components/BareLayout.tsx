import React, { ReactNode } from 'react'
import "normalize.css"
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const BareLayout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header />
    {children}
    <footer />
  </div>
)

export default BareLayout
