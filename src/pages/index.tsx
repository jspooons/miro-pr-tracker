import * as React from "react";
import Head from "next/head";
import RootLayout from "../app/layout";

export default function () {

  return (
    <div>
      <Head>
        <script src="https://miro.com/app/static/sdk/v2/miro.js"></script>
      </Head>
      <RootLayout />
    </div>
  );
}