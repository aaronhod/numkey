import { describe, expect, it } from "vitest";
import xxhash from "xxhash-wasm";

import { type ProblemDefinition } from "@/game/problem";
import { hashProblemDef } from "@/utils/hash";
import { h32ToString } from "@/utils/xxh32";

const problem = (o: Partial<ProblemDefinition> = {}): ProblemDefinition => ({
  leftValue: 2,
  rightValue: 3,
  operator: "ADD",
  answer: 5,
  ...o,
});

describe("hashProblemDef", () => {
  it("is deterministic for the same problem", async () => {
    expect(await hashProblemDef(problem())).toBe(
      await hashProblemDef(problem()),
    );
  });

  it("produces different hashes for different problems", async () => {
    const a = await hashProblemDef(problem({ leftValue: 2 }));
    const b = await hashProblemDef(problem({ leftValue: 9, answer: 12 }));
    expect(a).not.toBe(b);
  });

  it("distinguishes operator even when operands match", async () => {
    const add = await hashProblemDef(problem({ operator: "ADD", answer: 6 }));
    const mul = await hashProblemDef(
      problem({ operator: "MULTIPLY", answer: 6 }),
    );
    expect(add).not.toBe(mul);
  });

  // Hashes are persisted in ProblemDefinition.hash, so the implementation
  // must never drift from the values the database was seeded with.
  it("matches the historical xxhash-wasm value", async () => {
    expect(await hashProblemDef(problem())).toBe("275d7462");
  });
});

describe("xxh32", () => {
  it("matches xxhash-wasm bit-for-bit", async () => {
    const { h32ToString: wasmH32ToString } = await xxhash();

    const inputs = ["", "a", "23ADD5", "2MULTIPLY36", "é☃𝄞"];
    for (let len = 1; len <= 64; len++) {
      let s = "";
      for (let i = 0; i < len; i++) {
        s += String.fromCharCode(32 + Math.floor(Math.random() * 95));
      }
      inputs.push(s);
    }

    for (const input of inputs) {
      for (const seed of [0, 21, 0xdeadbeef, 4294967295]) {
        expect(h32ToString(input, seed)).toBe(wasmH32ToString(input, seed));
      }
    }
  });
});
