import Head from "next/head";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Game from "src/components/views/Game";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { QUICKPLAY_QUERY } from "@/constants/routes";
import {
  generateProblems,
  shuffleProblemListOrder,
  type Problem,
} from "@/game/problem";
import { type GameSettings } from "@/components/views/GameSettings";

const GUEST_SETTINGS: GameSettings = {
  gameMode: QUICKPLAY_QUERY.gameMode,
  gameModifiers: {
    random: { enabled: false },
    shuffled: { enabled: true },
    timed: { enabled: false, durationSeconds: 10 },
  },
};

const GuestGameInner = () => {
  // Client-only (ssr: false below), so the shuffle can't mismatch hydration.
  const [problems] = useState<Problem[]>(() =>
    shuffleProblemListOrder(
      generateProblems(QUICKPLAY_QUERY.numbers, QUICKPLAY_QUERY.operators),
    ).map((def, i) => ({ ...def, id: -(i + 1), hash: `guest-${i}` })),
  );

  return (
    <Game
      userId="guest"
      category="SMART"
      route="play"
      persistence="local"
      initialProblems={problems}
      settings={GUEST_SETTINGS}
    />
  );
};

const GuestGame = dynamic(() => Promise.resolve(GuestGameInner), {
  ssr: false,
  loading: () => <LoaderOverlay isLoading />,
});

/**
 * Guest QuickPlay: no account, no database. Problems are generated in the
 * browser and the finished game is saved to localStorage.
 */
export default function GuestPlayPage() {
  return (
    <>
      <Head>
        <title>QuickPlay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GuestGame />
    </>
  );
}
