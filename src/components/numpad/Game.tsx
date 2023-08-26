import React, {useEffect, useState} from 'react';
import Numpad from './Numpad';
import {Display} from './Display';
import type {Problem, SolvedProblem} from './Problem';
import {Stack} from 'immutable';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';

interface FinishedGame {
    solvedProblems: SolvedProblem[];
    completionTime: number;
}

interface GameProps {
    problems: Problem[];
}

const Game: React.FC<GameProps> = ({problems}) => {
    const [value, setValue] = useState<string>('');
    const [problemStack, setProblemStack] = useState<Stack<Problem>>(
        Stack(problems).pop(),
    );
    const [currentProblem, setCurrentProblem] = useState<Problem>(problems[0]!);
    const [history, setHistory] = useState<Stack<SolvedProblem>>(
        Stack<SolvedProblem>(),
    );
    const [lastAnsAt, setLastAnsAt] = useState<Dayjs>(dayjs());

    // check if the answer is correct
    useEffect(() => {
        if (value === '') {
            return;
        }
        if (Number(value) === currentProblem.answer) {
            updateHistory();
            const nextProblem = problemStack.peek();

            if (!nextProblem) {
                completeGame({
                    solvedProblems: history.reverse().toArray(),
                    completionTime: totalTime(),
                });
                return;
            }

            setProblemStack(problemStack.pop());
            setCurrentProblem(nextProblem);
            setValue('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, currentProblem, history, problemStack]);

    function completeGame(game: FinishedGame) {
        console.log(game);
    }

    function updateHistory() {
        const solvedDate = dayjs();
        const timeDiff = solvedDate.diff(lastAnsAt); // diff in ms
        setHistory(
            history.push({
                ...currentProblem,
                solvedAt: solvedDate,
                solveTime: timeDiff,
            }),
        );
        setLastAnsAt(solvedDate);
    }

    function totalTime() {
        return history.reduce((acc, problem) => acc + problem.solveTime, 0);
    }

    return (
        <div className="flex h-full flex-col font-mono text-lg font-semibold">
            <Display value={value} problem={currentProblem} />
            <Numpad value={value} setValue={setValue} />
        </div>
    );
};

export {Game as default};
export type {FinishedGame};
