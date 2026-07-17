import Head from "next/head";
import React, { type ReactElement } from "react";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { type NextPageWithLayout } from "@/pages/_app";
import { useRouter } from "next/router";
import { getGameRouteQuickPlay } from "@/constants/routes";

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

const MainMenu = () => {
  const router = useRouter();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
      <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        01 Home
      </p>
      <h1 className="mt-3 text-[clamp(34px,7vw,52px)] font-bold leading-[1.1] tracking-[-0.01em]">
        Math Game
      </h1>
      <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
        Mental arithmetic, timed and scored. Pick a mode below.
      </p>

      {/* 1px gaps over a border-colored background draw hairlines between rows. */}
      <div className="mt-10 flex flex-col gap-px border bg-border">
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
        <MenuRow
          index="04"
          title="Battle"
          description="Head to head against another player."
          onClick={() => void router.push("/game-battle")}
        />
      </div>
    </main>
  );
};

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Math Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainMenu />
    </>
  );
};

Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
