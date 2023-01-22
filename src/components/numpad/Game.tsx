
import React, { useState } from "react";
import Numpad from "./Numpad";
import { Display } from "./Display";
import type { ProblemWithAns } from "./Problem";

const testProblem: ProblemWithAns = {
    value1: 5,
    value2: 4,
    operator: "*",
    answer: 20,
  };

const Game: React.FC = () => {
    const [value, setValue] = useState<string>("");
    const [currentProblem, setCurrentProblem] = useState<ProblemWithAns>(
        testProblem
    );
    const [history, setHistory] = useState<ProblemWithAns[]>([]);
    

    return (
        <div className="flex h-full flex-col font-mono text-lg font-semibold">
            <Display value={value} problem={currentProblem}/>
            <Numpad value={value} setValue={setValue}/>
        </div>
    )
}

export { Game as default}