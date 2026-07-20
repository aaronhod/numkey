import Head from "next/head";
import React, { type ReactElement } from "react";
import { type GetServerSideProps } from "next";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { type NextPageWithLayout } from "@/pages/_app";
import { useRouter } from "next/router";
import { getGameRouteQuickPlay } from "@/constants/routes";
import { getServerAuth } from "@/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = await getServerAuth(ctx.req, ctx.res);
  return { props: { signedIn: Boolean(userId) } };
};

interface MenuRowProps {
  index: string;
  title: string;
  description: string;
  onClick: () => void;
}

const MenuRow = ({ index, title, description, onClick }: MenuRowProps) => (
  <button
    onClick={onClick}
    className="group flex w-full flex-col gap-2 bg-background p-6 text-left transition-colors hover:bg-accent"
  >
    <div className="flex w-full items-baseline gap-4">
      <span className="text-[11px] tabular-nums text-muted-foreground">
        {index}
      </span>
      <span className="text-base font-semibold uppercase tracking-[0.05em]">
        {title}
      </span>
      <span className="ml-auto text-muted-foreground transition-colors group-hover:text-foreground">
        →
      </span>
    </div>
    <p className="pl-9 text-[13.5px] leading-relaxed text-muted-foreground">
      {description}
    </p>
  </button>
);

const SignedInMenu = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-px border bg-border">
      <MenuRow
        index="01"
        title="Practice"
        description="Drill a single operator and number set."
        onClick={() => void router.push("/practice")}
      />
      <MenuRow
        index="02"
        title="QuickPlay"
        description="Straight into a game with default settings."
        onClick={() => void router.push(`/${getGameRouteQuickPlay()}`)}
      />
      <MenuRow
        index="03"
        title="Custom"
        description="Configure mode, operators, numbers, and modifiers."
        onClick={() => void router.push("/game-custom")}
      />
    </div>
  );
};

const SignedOutMenu = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-px border bg-border">
      <MenuRow
        index="01"
        title="Login"
        description="Sign in to save games and unlock practice and custom modes."
        onClick={() => void router.push("/login")}
      />
      <MenuRow
        index="02"
        title="Guest"
        description="QuickPlay only. Progress is saved on this device."
        onClick={() => void router.push("/play")}
      />
    </div>
  );
};

const Page: NextPageWithLayout<{ signedIn: boolean }> = ({ signedIn }) => {
  return (
    <>
      <Head>
        <title>numkey</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex w-full max-w-2xl flex-col px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
        <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          01 Home
        </p>
        <h1 className="mt-3 text-[clamp(34px,7vw,52px)] font-bold lowercase leading-[1.1] tracking-[-0.01em]">
          numkey
        </h1>
        <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
          Mental arithmetic, timed and scored.
        </p>

        {/* 1px gaps over a border-colored background draw hairlines between rows. */}
        <div className="mt-10">
          {signedIn ? <SignedInMenu /> : <SignedOutMenu />}
        </div>
      </main>
    </>
  );
};

Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
