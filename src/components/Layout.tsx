import { useState } from "react";
import { SelectionScreen } from "./SelectionScreen";
import Game from "./numpad/Game";
import type { FinishedGame } from "./numpad/Game";
import type { Problem, Operator } from "./numpad/Problem";
import { generateProblems } from "./numpad/Problem";
import FinishedGameScreen from "./FinishedGameScreen";
import { useSessionStorage } from "../hooks/useLocalStorage";

const Layout = () => {
  const [problems, setProblems] = useSessionStorage<Problem[]>("problems",[]);
  const [finishedGame, setFinishedGame] = useState<FinishedGame>();

  function startGame(operator: Operator, number: number) {
    const problems = generateProblems(number, operator);
    setProblems(problems);
  }

  function completeGame(game: FinishedGame) {
    setFinishedGame(game);
    setProblems([]);
  }

  if (finishedGame) {
    return (
      <FinishedGameScreen
        finishedGame={finishedGame}
        resetGame={() => setFinishedGame(undefined)}
      />
    );
  }

  if (problems.length === 0) {
    return <SelectionScreen startGame={startGame} />;
  }

  return (
    <>
      <Game problems={problems} completeGame={completeGame} />
    </>
  );
};

export { Layout as default };

