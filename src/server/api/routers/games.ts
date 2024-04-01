import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const OperatorEnum = z.enum(["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"]);

const RoundAttemptRequest = z.object({
  ordering: z.number(),
  value: z.number(),
});

const CursorPagedRequest = z.object({
  cursor: z.string(),
  take: z.number(),
  skip: z.literal(1),
});

const OffsetPagedRequest = z.object({
  take: z.number(),
  skip: z.number(),
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

const PagedProblemDefinitionQuery = z.object({
  leftRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  rightRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  operators: z.array(OperatorEnum).min(1),
  pagedParams: CursorPagedRequest.or(OffsetPagedRequest),
});

const ProblemDefinitionDetails = z.object({
  leftValue: z.number(),
  rightValue: z.number(),
  operator: OperatorEnum,
});

const ProblemDefinitionListQuery = z.object({
  problems: z.array(ProblemDefinitionDetails),
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
  findProblemsByDomainProblems: protectedProcedure
    .input(ProblemDefinitionListQuery)
    .query(async ({ ctx, input }) => {
      const problemPromises = input.problems.map(async (problem) => {
        return await ctx.db.problemDefinition.findFirst({
          where: {
            leftValue: problem.leftValue,
            rightValue: problem.rightValue,
            operator: problem.operator,
          }
        });
      });

      return Promise.all(problemPromises);
    }),
  findProblems: protectedProcedure
      .input(PagedProblemDefinitionQuery)
      .query(async ({ ctx, input }) => {
        return ctx.db.problemDefinition.findMany({
          where: {
            leftValue: {
              gte: input.leftRange.min,
              lte: input.leftRange.max,
            },
            rightValue: {
              gte: input.rightRange.min,
              lte: input.rightRange.max,
            },
            operator: {
              in: input.operators,
            },
          },
          ...input.pagedParams,
        });
      }),
});
