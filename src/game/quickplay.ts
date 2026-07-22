/**
 * Adaptive QuickPlay: instead of drilling every problem in a set, QuickPlay
 * looks at how the player has done in the past and biases the round list
 * towards the problems they get wrong or answer slowly (e.g. 8 × 7). A fresh
 * player with no history just gets a random mixed set.
 *
 * The scoring/selection here is pure so it can run both on the server (from
 * database rounds) and in the browser (from a guest's localStorage history).
 */

export const QUICKPLAY_SIZE = 20;

// How much of the round list is reserved for weak problems; the rest is
// filled with fresh problems so QuickPlay never feels like pure remediation.
const WEAK_FRACTION = 0.6;

// Per-round difficulty weights. A missed problem is the strongest signal;
// extra attempts and slow answers contribute smaller amounts.
const FAIL_WEIGHT = 5;
const EXTRA_ATTEMPT_WEIGHT = 2;
const SLOW_MS = 4000;
const SLOW_WEIGHT = 1;

interface ProblemLike {
  leftValue: number;
  rightValue: number;
  operator: string;
}

export interface QuickPlayRound {
  problem: ProblemLike;
  isCompleted: boolean;
  durationMs: number;
  attemptCount: number;
}

/** Identify a problem by its operands and operator (the answer is derived). */
export function problemKey(problem: ProblemLike): string {
  return `${problem.leftValue}_${problem.operator}_${problem.rightValue}`;
}

/** How much a single played round says the player struggles with its problem. */
export function roundDifficulty(round: QuickPlayRound): number {
  let score = 0;
  if (!round.isCompleted) {
    score += FAIL_WEIGHT;
  }
  score += Math.max(0, round.attemptCount - 1) * EXTRA_ATTEMPT_WEIGHT;
  if (round.durationMs > SLOW_MS) {
    score += SLOW_WEIGHT;
  }
  return score;
}

/** Aggregate difficulty per problem across the player's history. */
export function difficultyByProblem(
  rounds: QuickPlayRound[],
): Map<string, number> {
  const weights = new Map<string, number>();
  for (const round of rounds) {
    const key = problemKey(round.problem);
    weights.set(key, (weights.get(key) ?? 0) + roundDifficulty(round));
  }
  return weights;
}

/**
 * Build the QuickPlay round list: the highest-weighted "weak" problems first,
 * topped up with fresh problems, then shuffled. `pool` should contain both the
 * default mixed problems and any weak problems from history.
 */
export function buildQuickPlaySet<T extends ProblemLike>(params: {
  pool: T[];
  weights: Map<string, number>;
  size?: number;
  weakFraction?: number;
  shuffle?: (items: T[]) => T[];
}): T[] {
  const { pool, weights } = params;
  const size = params.size ?? QUICKPLAY_SIZE;
  const weakFraction = params.weakFraction ?? WEAK_FRACTION;
  const shuffle = params.shuffle ?? shuffleList;

  // Deduplicate the pool by problem identity, keeping the first occurrence.
  const byKey = new Map<string, T>();
  for (const item of pool) {
    const key = problemKey(item);
    if (!byKey.has(key)) {
      byKey.set(key, item);
    }
  }
  const unique = [...byKey.values()];

  const weak = unique
    .filter((item) => (weights.get(problemKey(item)) ?? 0) > 0)
    .sort(
      (a, b) =>
        (weights.get(problemKey(b)) ?? 0) - (weights.get(problemKey(a)) ?? 0),
    );
  const weakKeys = new Set(weak.map(problemKey));
  const fresh = shuffle(unique.filter((item) => !weakKeys.has(problemKey(item))));

  const selected: T[] = [];
  const chosen = new Set<string>();
  const add = (item: T) => {
    const key = problemKey(item);
    if (chosen.has(key)) {
      return;
    }
    chosen.add(key);
    selected.push(item);
  };

  const weakTarget = Math.min(weak.length, Math.floor(size * weakFraction));
  for (let i = 0; i < weakTarget; i++) {
    add(weak[i]!);
  }
  for (const item of fresh) {
    if (selected.length >= size) {
      break;
    }
    add(item);
  }
  // Backfill with any remaining weak problems if the fresh pool ran short.
  for (const item of weak) {
    if (selected.length >= size) {
      break;
    }
    add(item);
  }

  return shuffle(selected).slice(0, size);
}

// Fisher–Yates shuffle over an arbitrary list (unbiased, non-mutating).
function shuffleList<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
