import Head from "next/head";
import React, { useState, type ReactElement } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { type NextPageWithLayout } from "@/pages/_app";
import { Button } from "@/components/shad-ui/button";
import { GameResults } from "@/components/views/GameResults";
import {
  getGuestGame,
  getGuestGames,
  type GuestGame,
} from "@/utils/guestStorage";

const GuestResultsInner = ({ gameId }: { gameId: string | null }) => {
  // Client-only (ssr: false below): reads localStorage once on mount.
  const [game] = useState<GuestGame | null>(() =>
    gameId ? getGuestGame(gameId) : (getGuestGames()[0] ?? null),
  );

  if (!game) {
    return (
      <p className="text-[13.5px] leading-relaxed text-muted-foreground">
        No saved game found on this device.
      </p>
    );
  }

  return <GameResults rounds={game.rounds} />;
};

const GuestResults = dynamic(() => Promise.resolve(GuestResultsInner), {
  ssr: false,
});

const Page: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Game Complete</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-10 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          Guest — saved on this device
        </p>
        <h1 className="mb-8 mt-3 text-4xl font-bold leading-[1.1] tracking-[-0.01em]">
          Game Complete
        </h1>
        {router.isReady && (
          <GuestResults
            gameId={
              typeof router.query.game === "string" ? router.query.game : null
            }
          />
        )}
        <div className="mt-6 flex flex-row-reverse gap-3">
          <Button onClick={() => void router.push("/play")}>
            Play Again →
          </Button>
          <Button variant="secondary" onClick={() => void router.push("/")}>
            Home
          </Button>
        </div>
      </main>
    </>
  );
};

Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
