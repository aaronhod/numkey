import type {FinishedGame} from '@/components/numpad/Game';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';

interface FinishedGameProps {
    finishedGame: FinishedGame;
    resetGame: () => void;
}

const FinishedGameScreen = ({finishedGame, resetGame}: FinishedGameProps) => {
    const {solvedProblems, completionTime} = finishedGame;

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <div className="flex flex-col items-center">
                <h1 className="py-3 text-4xl font-bold">Game Complete</h1>
                <h2 className="py-3 text-2xl font-bold">
                    You solved {solvedProblems.length} problems in {completionTime / 1000}{' '}
                    seconds!
                </h2>
            </div>
            <Table className="w-4/5 m-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead>Problem</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Previous Time</TableHead>
                        <TableHead>Average Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {solvedProblems.map((problem, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {problem.leftValue} {problem.operator} {problem.rightValue} ={' '}
                                {problem.answer}
                            </TableCell>
                            <TableCell>{problem.solveTime / 1000}s</TableCell>
                            <TableCell>todo</TableCell>
                            <TableCell>todo</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <button className="btn mt-5 mb-72" onClick={resetGame}>
                Play Again
            </button>
        </div>
    );
};

export {FinishedGameScreen as default};
