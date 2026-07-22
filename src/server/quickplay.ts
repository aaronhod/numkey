import { generateProblems, type Operator, type Problem } from "@/game/problem";
import { QUICKPLAY_QUERY } from "@/constants/routes";
import { hashProblemDefs } from "@/utils/hash";
import {
  buildQuickPlaySet,
  difficultyByProblem,
  QUICKPLAY_SIZE,
  type QuickPlayRound,
} from "@/game/quickplay";
import { type getDb } from "@/server/db";

// Only the most recent rounds inform the weighting; older mistakes matter
// less and this keeps the history query bounded.
const HISTORY_ROUND_LIMIT = 1000;

/**
 * Build the adaptive QuickPlay round list for a signed-in player from their
 * finished-game history: the problems they miss or answer slowly, topped up
 * with fresh mixed problems.
 */
export async function buildSmartQuickPlayProblems(
  db: ReturnType<typeof getDb>,
  userId: string,
): Promise<Problem[]> {
  const rounds = await db.finishedRound.findMany({
    where: { game: { userId } },
    orderBy: { id: "desc" },
    take: HISTORY_ROUND_LIMIT,
    include: {
      problem: true,
      _count: { select: { attempts: true } },
    },
  });

  const historyRounds: QuickPlayRound[] = rounds.map((round) => ({
    problem: {
      leftValue: round.problem.leftValue,
      rightValue: round.problem.rightValue,
      operator: round.problem.operator,
    },
    isCompleted: round.isCompleted,
    durationMs: round.durationMs,
    attemptCount: round._count.attempts,
  }));
  const weights = difficultyByProblem(historyRounds);

  // Fresh pool: the standard mixed set, fetched as real rows (with ids).
  const freshDefs = generateProblems(
    QUICKPLAY_QUERY.numbers,
    QUICKPLAY_QUERY.operators,
  );
  const freshHashes = await hashProblemDefs(freshDefs);
  const freshRows = await db.problemDefinition.findMany({
    where: { hash: { in: freshHashes } },
  });

  // Weak problems come straight from the history rounds' problem rows, so they
  // already carry real ids even when they fall outside the default pool.
  const weakRows = rounds.map((round) => round.problem);

  const pool = [...freshRows, ...weakRows].map((row) => ({
    id: row.id,
    hash: row.hash,
    leftValue: row.leftValue,
    rightValue: row.rightValue,
    operator: row.operator as Operator,
    answer: row.answer,
  })) satisfies Problem[];

  return buildQuickPlaySet({ pool, weights, size: QUICKPLAY_SIZE });
}
