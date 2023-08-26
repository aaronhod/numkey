import { useState } from "react";
import { SelectionScreen } from "@/components/layouts/SelectionScreen";
import Game from "@/components/numpad/Game";
import type { FinishedGame } from "@/components/numpad/Game";
import type { Problem, Operator } from "@/components/numpad/Problem";
import { generateProblems } from "@/components/numpad/Problem";
import FinishedGameScreen from "@/components/layouts/FinishedGameScreen";
import { useSessionStorage } from "@/hooks/useLocalStorage";

const Layout = () => {
  const [finishedGame, setFinishedGame] = useState<FinishedGame>();

  function startGame(operator: Operator, number: number) {
    const problems = generateProblems(number, operator);
  }

  function completeGame(game: FinishedGame) {
    setFinishedGame(game);
  }

  if (finishedGame) {
    return (
      <FinishedGameScreen
        finishedGame={finishedGame}
        resetGame={() => setFinishedGame(undefined)}
      />
    );
  }

  return <SelectionScreen />;
};

export { Layout as default };
