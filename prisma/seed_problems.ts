import { PrismaClient } from "@prisma/client";
import {
  generateProblems,
  Operator,
  ProblemDefinition,
} from "@/components/game/problem";

const NUMBERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const OPERATORS: Operator[] = ["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"];

const prisma = new PrismaClient();
const problems: ProblemDefinition[] = generateProblems(NUMBERS, OPERATORS);

prisma.problemDefinition
  .createMany({
    data: problems.map((problem) => ({
      leftValue: problem.leftValue,
      rightValue: problem.rightValue,
      operator: problem.operator,
      answer: problem.answer,
    })),
    skipDuplicates: true,
  })
  .then(async () => {
    console.log("Problems seeded");
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding problems", error);
    process.exit(1);
  });
