import Head from "next/head";
import React, { type ReactElement } from "react";
import { type GetServerSideProps } from "next";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { type NextPageWithLayout } from "@/pages/_app";
import { SelectionScreen } from "@/components/views/SelectionScreen";
import { getServerAuth } from "@/server/auth";

// Custom games persist to the account, so they require a login (guests get
// QuickPlay at /play).
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = await getServerAuth(ctx.req, ctx.res);
  if (!userId) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: {} };
};

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>numkey</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SelectionScreen />
    </>
  );
};
Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
