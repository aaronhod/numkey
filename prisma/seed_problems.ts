import { PrismaClient } from "@prisma/client";
import { generateProblems, type Operator } from "@/game/problem";
import { hashProblemDef } from "@/utils/hash";

const NUMBERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const OPERATORS: Operator[] = ["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"];

const prisma = new PrismaClient();

try {
  const problemsWithHashes = await Promise.all(
    generateProblems(NUMBERS, OPERATORS).map(async (problem) => ({
      ...problem,
      hash: await hashProblemDef(problem),
    })),
  );

  console.info("Seeding problems with hashes", problemsWithHashes);

  prisma.problemDefinition
    .createMany({
      data: problemsWithHashes.map((problem) => ({
        hash: problem.hash,
        leftValue: problem.leftValue,
        rightValue: problem.rightValue,
        operator: problem.operator as Operator,
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
} catch (error) {
  console.error("Error seeding problems", error);
  process.exit(1);
}
