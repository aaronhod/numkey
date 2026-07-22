import Head from "next/head";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Game from "src/components/views/Game";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { QUICKPLAY_QUERY } from "@/constants/routes";
import { generateProblems, type Problem } from "@/game/problem";
import {
  buildQuickPlaySet,
  difficultyByProblem,
} from "@/game/quickplay";
import { getGuestGames } from "@/utils/guestStorage";
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
  const [problems] = useState<Problem[]>(() => {
    // Weight the set towards problems the guest has struggled with, read from
    // this device's saved games; new players just get a random mixed set.
    const history = getGuestGames().flatMap((game) => game.rounds);
    const weights = difficultyByProblem(
      history.map((round) => ({
        problem: round.problem,
        isCompleted: round.isCompleted,
        durationMs: round.durationMs,
        attemptCount: round.attemptCount,
      })),
    );

    const pool = [
      ...generateProblems(QUICKPLAY_QUERY.numbers, QUICKPLAY_QUERY.operators),
      ...history.map((round) => round.problem),
    ];

    return buildQuickPlaySet({ pool, weights }).map((def, i) => ({
      ...def,
      id: -(i + 1),
      hash: `guest-${i}`,
    }));
  });

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
