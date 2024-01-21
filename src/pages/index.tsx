import * as React from "react";
import RootLayout from "../app/layout";
import Head from "next/head";

export default function () {

  return (
    <div>
      <Head>
        <title>Github Pull Request Tracker</title>
      </Head>
      <div>
        <RootLayout />
      </div>
    </div>
  );
}