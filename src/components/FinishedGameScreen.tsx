import type { FinishedGame } from "./numpad/Game";

interface FinishedGameProps {
  finishedGame: FinishedGame;
  resetGame: () => void;
}

const FinishedGameScreen = ({ finishedGame, resetGame }: FinishedGameProps) => {
  const { solvedProblems, completionTime } = finishedGame;
  console.log(finishedGame);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="py-3 text-4xl font-bold">You finished!</h1>
        <h2 className="py-3 text-2xl font-bold">
          You solved {solvedProblems.length} problems in {completionTime / 1000}{" "}
          seconds
        </h2>
      </div>
      <div className="flex w-full flex-col items-center">
        <div className="flex flex-col items-center">
          {solvedProblems.map((problem, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-center"
            >
              <h4 className="text-xl font-bold">
                {problem.value1} {problem.operator} {problem.value2} ={" "}
                {problem.answer}
              </h4>
              <h4 className="text-xl font-bold">
                &nbsp; in {problem.solveTime / 1000} seconds
              </h4>
            </div>
          ))}
        </div>
      </div>
      <button className="btn mt-5 mb-72" onClick={resetGame}>
        Play Again
      </button>
    </div>
  );
};

export { FinishedGameScreen as default };
