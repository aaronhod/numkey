import { useState } from "react";
import { SelectionScreen } from "./SelectionScreen";
import Game from "./numpad/Game";
import type { FinishedGame } from "./numpad/Game";
import type { Problem, Operator } from "./numpad/Problem";
import { generateProblems } from "./numpad/Problem";
import FinishedGameScreen from "./FinishedGameScreen";
import { useSessionStorage } from "../hooks/useLocalStorage";

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
