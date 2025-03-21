'use client'

import Script from "next/script"
import { MiroSDKInit } from "../components/SDKInit"

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", height: "100vh", flex: "1 1 auto", overflowY: "auto"  }}>
        <Script
          src="https://miro.com/app/static/sdk/v2/miro.js"
          strategy="beforeInteractive"
        />
        <MiroSDKInit />
        {children}
      </body>
    </html>
  )
}
