import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { Operator } from "@/components/game/problem";

const RoundAttemptValidator = z.object({
  ordering: z.number(),
  value: z.number(),
});

const FinishedRoundValidator = z.object({
  leftValue: z.number(),
  rightValue: z.number(),
  operator: z.custom<Operator>(),
  answer: z.number(),
  isCompleted: z.boolean(),
  durationMs: z.number(),
  attempts: z.array(RoundAttemptValidator),
});

const FinishedGameValidator = z.object({
  userId: z.string(),
  startedAt: z.date(),
  finishedAt: z.date(),
  rounds: z.array(FinishedRoundValidator),
});

export type FinishedGame = z.infer<typeof FinishedGameValidator>;
export type FinishedRound = z.infer<typeof FinishedRoundValidator>;
export type RoundAttempt = z.infer<typeof RoundAttemptValidator>;


// https://youtrack.jetbrains.com/issue/WEB-65284/Prisma-Plugin-Argument-type-is-not-assignable-to-parameter-type-SelectSubset
export const gameRouter = createTRPCRouter({
  addFinishedGame: protectedProcedure
    .input(FinishedGameValidator)
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
