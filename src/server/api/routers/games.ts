import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const RoundAttempt = z.object({
  ordering: z.number(),
  value: z.number(),
});

const FinishedRound = z.object({
  leftValue: z.number(),
  rightValue: z.number(),
  operator: z.string(),
  answer: z.number(),
  isCompleted: z.boolean(),
  duration: z.number(),
  attempts: z.array(RoundAttempt),
});

const FinishedGame = z.object({
  userId: z.string(),
  startedAt: z.date(),
  finishedAt: z.date(),
  rounds: z.array(FinishedRound),
});

export type FinishedGame = z.infer<typeof FinishedGame>;
export type FinishedRound = z.infer<typeof FinishedRound>;
export type RoundAttempt = z.infer<typeof RoundAttempt>;

export const gameRouter = createTRPCRouter({
  addFinishedGame: protectedProcedure
    .input(FinishedGame)
    .mutation(({ ctx, input }) => {
      return ctx.db.finishedGame.create({
        data: {
          userId: input.userId,
          startedAt: input.startedAt,
          finishedAt: input.finishedAt,
          rounds: {
            create: input.rounds.map((round) => ({
              leftValue: round.leftValue,
              rightValue: round.rightValue,
              operator: round.operator,
              isCompleted: round.isCompleted,
              duration: round.duration,
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
      });
    }),
});
