'use client'

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
      <body>
        <MiroSDKInit />
        {children}
      </body>
    </html>
  )
}
