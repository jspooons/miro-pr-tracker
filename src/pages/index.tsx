import * as React from "react";
import Head from "next/head";
import RootLayout from "../app/layout";
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