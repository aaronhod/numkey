import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { Operator } from "@/components/game/Problem";

const RoundAttempt = z.object({
  ordering: z.number(),
  value: z.number(),
});

const FinishedRound = z.object({
  leftValue: z.number(),
  rightValue: z.number(),
  operator: z.custom<Operator>(),
  answer: z.number(),
  isCompleted: z.boolean(),
  durationMs: z.number(),
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
    .mutation(async ({ ctx, input }) => {
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
              answer: round.answer,
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
              attempts: true,
            },
          },
        },
      });
    }),
});
