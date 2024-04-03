import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const RoundAttemptRequest = z.object({
  ordering: z.number(),
  value: z.number(),
});

const FinishedRoundRequest = z.object({
  problemId: z.number(),
  isCompleted: z.boolean(),
  durationMs: z.number(),
  attempts: z.array(RoundAttemptRequest),
});

const FinishedGameRequest = z.object({
  userId: z.string(),
  startedAt: z.date(),
  finishedAt: z.date(),
  rounds: z.array(FinishedRoundRequest),
});

export type FinishedGame = z.infer<typeof FinishedGameRequest>;
export type FinishedRound = z.infer<typeof FinishedRoundRequest>;
export type RoundAttempt = z.infer<typeof RoundAttemptRequest>;

// https://youtrack.jetbrains.com/issue/WEB-65284/Prisma-Plugin-Argument-type-is-not-assignable-to-parameter-type-SelectSubset
export const gameRouter = createTRPCRouter({
  addFinishedGame: protectedProcedure
    .input(FinishedGameRequest)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.finishedGame.create({
        data: {
          userId: input.userId,
          startedAt: input.startedAt,
          finishedAt: input.finishedAt,
          rounds: {
            create: input.rounds.map((round) => ({
              problemId: round.problemId,
              isCompleted: round.isCompleted,
              durationMs: round.durationMs,
              attempts: {
                create: round.attempts.map((attempt) => ({
                  ordering: attempt.ordering,
                  value: attempt.value,
                })),
              },
            })),
          },
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.finishedGame.findMany();
  }),
  getAllByUserId: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.finishedGame.findMany({
        where: {
          userId: input,
        },
      });
    }),
  getById: protectedProcedure
    .input(z.number().int())
    .query(({ ctx, input }) => {
      return ctx.db.finishedGame.findUnique({
        where: {
          id: input,
        },
        include: {
          rounds: {
            include: {
              problem: true,
              attempts: true,
            },
          },
        },
      });
    }),
  findProblemsByHash: protectedProcedure
    .input(z.array(z.string().min(1)).min(1))
    .query(({ ctx, input }) => {
      return ctx.db.problemDefinition.findMany({
        where: {
          hash: {
            in: input,
          },
        },
      });
    }),
});
