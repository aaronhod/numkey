import React, { useEffect, useState } from "react";
import Numpad from "./Numpad";
import { Display } from "./Display";
import type { Problem, SolvedProblem } from "./Problem";
import { Stack } from "immutable";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface GameProps {
  problems: Problem[];
}

const Game: React.FC<GameProps> = ({ problems }) => {
  const [value, setValue] = useState<string>("");
  const [problemStack, setProblemStack] = useState<Stack<Problem>>(
    Stack(problems).pop()
  );
  const [currentProblem, setCurrentProblem] = useState<Problem>(problems[0]!);
  const [history, setHistory] = useState<Stack<SolvedProblem>>(
    Stack<SolvedProblem>()
  );
  const [lastAnsAt, setLastAnsAt] = useState<Dayjs>(dayjs());

  // check if the answer is correct
  useEffect(() => {
    if (value === "") return;
    if (parseInt(value) === currentProblem.answer) {
      updateHistory();

      const nextProblem = problemStack.peek()!;
      setProblemStack(problemStack.pop());
      setCurrentProblem(nextProblem);
      setValue("");
    }
    console.log(history);
  }, [value, currentProblem, history, problemStack]);

  function updateHistory() {
    const solvedDate = dayjs();
    const timeDiff = solvedDate.diff(lastAnsAt); // diff in ms
    setHistory(
      history.push({
        ...currentProblem,
        solvedAt: solvedDate,
        solveTime: timeDiff,
      })
    );
    setLastAnsAt(solvedDate);
  }

  return (
    <div className="flex h-full flex-col font-mono text-lg font-semibold">
      <Display value={value} problem={currentProblem} />
      <Numpad value={value} setValue={setValue} />
    </div>
  );
};

export { Game as default };
