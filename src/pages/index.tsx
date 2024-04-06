import Head from "next/head";
import React, { type ReactElement } from "react";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { SelectionScreen } from "@/components/views/SelectionScreen";
import { type NextPageWithLayout } from "@/pages/_app";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Math Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SelectionScreen />
    </>
  );
};

Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
