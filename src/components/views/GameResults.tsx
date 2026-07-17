import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shad-ui/table";
import { getOperatorChar, type Operator } from "@/game/problem";

export interface ResultRound {
  problem: {
    leftValue: number;
    rightValue: number;
    operator: Operator;
    answer: number;
  };
  isCompleted: boolean;
  durationMs: number;
  attemptCount: number;
}

const Time = ({ milliSeconds }: { milliSeconds: number }) => {
  const seconds = Math.floor(milliSeconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const remainingMilliseconds = milliSeconds % 1000;

  const values = () => {
    if (minutes > 0) {
      return {
        value: `${minutes}:${remainingSeconds}`,
        unit: "m",
      };
    }

    if (seconds > 0) {
      return {
        value: `${seconds}.${remainingMilliseconds}`,
        unit: "s",
      };
    }

    return {
      value: milliSeconds.toString(),
      unit: "ms",
    };
  };

  return (
    <div className="flex">
      <p>{values().value}</p>
      <p className="font-extralight">{values().unit}</p>
    </div>
  );
};

/** Round-by-round results table shared by the account and guest complete pages. */
export const GameResults = ({ rounds }: { rounds: ResultRound[] }) => (
  <Table className="border">
    <TableHeader>
      <TableRow>
        <TableHead>Problem</TableHead>
        <TableHead>Answer</TableHead>
        <TableHead>Solved</TableHead>
        <TableHead>Time</TableHead>
        <TableHead>Attempts</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rounds.map((round, index) => (
        <TableRow key={index}>
          <TableCell>
            {round.problem.leftValue} {getOperatorChar(round.problem.operator)}{" "}
            {round.problem.rightValue}
          </TableCell>
          <TableCell>{round.problem.answer}</TableCell>
          <TableCell>
            {round.isCompleted ? (
              <span>●</span>
            ) : (
              <span className="text-muted-foreground">○</span>
            )}
          </TableCell>
          <TableCell>
            <Time milliSeconds={round.durationMs} />
          </TableCell>
          <TableCell>{round.attemptCount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
