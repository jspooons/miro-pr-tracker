import * as React from "react";
import RootLayout from "../app/layout";
import { Head } from "next/document";
import Script from "next/script";

export default function () {

  return (
    <div>
      <Head>
        <Script
          src="https://miro.com/app/static/sdk/v2/miro.js"
          strategy="beforeInteractive"
        />
      </Head>
      <RootLayout />
    </div>
  );
}