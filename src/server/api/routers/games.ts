import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const RoundAttemptRequest = z.object({
  ordering: z.number(),
  value: z.number(),
  type: z.enum(["IMPLICIT", "EXPLICIT", "SKIPPED"]),
});

const FinishedRoundRequest = z.object({
  problemId: z.number(),
  isCompleted: z.boolean(),
  durationMs: z.number(),
  attempts: z.array(RoundAttemptRequest),
});

const FinishedGameRequest = z.object({
  // The owner is taken from the authenticated session, never the client.
  userId: z.string().optional(),
  category: z.enum(["CUSTOM", "SMART", "VERSUS", "PRACTICE"]),
  settings: z
    .object({
      gameMode: z.enum(["normal", "endless", "lives", "stack"]),
      gameModifiers: z.object({
        random: z.object({
          enabled: z.boolean(),
        }),
        shuffled: z.object({
          enabled: z.boolean(),
        }),
        timed: z.object({
          enabled: z.boolean(),
          durationSeconds: z.number(),
        }),
      }),
      nextOnFail: z.boolean().optional(),
    })
    .optional(),
  startedAt: z.date(),
  finishedAt: z.date(),
  rounds: z.array(FinishedRoundRequest),
});

export type FinishedGame = z.infer<typeof FinishedGameRequest>;
export type FinishedRound = z.infer<typeof FinishedRoundRequest>;
export type RoundAttempt = z.infer<typeof RoundAttemptRequest>;

export const gameRouter = createTRPCRouter({
  addFinishedGame: protectedProcedure
    .input(FinishedGameRequest)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.finishedGame.create({
        data: {
          // Attribute the game to the caller, ignoring any client-sent userId.
          userId: ctx.auth.userId,
          category: input.category,
          settings: input.settings,
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
                  type: attempt.type,
                })),
              },
            })),
          },
        },
      });
    }),
  // Games belonging to the caller. (Scoped to the session — never accepts a
  // userId from the client, which would expose other players' games.)
  getMine: protectedProcedure.query(({ ctx }) => {
    return ctx.db.finishedGame.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });
  }),
  getById: protectedProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.finishedGame.findUnique({
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

      // Don't leak other users' games via a guessable numeric id.
      if (game && game.userId !== ctx.auth.userId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return game;
    }),
  findProblemsByHash: publicProcedure
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
