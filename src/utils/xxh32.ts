/**
 * Pure-JS xxHash32. Replaces xxhash-wasm, whose runtime
 * `WebAssembly.instantiate` of inlined bytes is disallowed on Cloudflare
 * Workers ("Wasm code generation disallowed by embedder"), which crashed
 * every page importing it at module load.
 *
 * Output is bit-for-bit identical to xxhash-wasm's `h32ToString` — problem
 * hashes are persisted in the database, so this must never drift (see
 * xxh32 parity assertions in hash.test.ts).
 */

const PRIME32_1 = 0x9e3779b1;
const PRIME32_2 = 0x85ebca77;
const PRIME32_3 = 0xc2b2ae3d;
const PRIME32_4 = 0x27d4eb2f;
const PRIME32_5 = 0x165667b1;

const rotl = (x: number, r: number): number => (x << r) | (x >>> (32 - r));

const readU32 = (b: Uint8Array, i: number): number =>
  b[i]! | (b[i + 1]! << 8) | (b[i + 2]! << 16) | (b[i + 3]! << 24);

export function xxh32(bytes: Uint8Array, seed: number): number {
  const len = bytes.length;
  let i = 0;
  let h32: number;

  if (len >= 16) {
    let v1 = (seed + PRIME32_1 + PRIME32_2) | 0;
    let v2 = (seed + PRIME32_2) | 0;
    let v3 = seed | 0;
    let v4 = (seed - PRIME32_1) | 0;
    for (; i <= len - 16; i += 16) {
      v1 = Math.imul(
        rotl((v1 + Math.imul(readU32(bytes, i), PRIME32_2)) | 0, 13),
        PRIME32_1,
      );
      v2 = Math.imul(
        rotl((v2 + Math.imul(readU32(bytes, i + 4), PRIME32_2)) | 0, 13),
        PRIME32_1,
      );
      v3 = Math.imul(
        rotl((v3 + Math.imul(readU32(bytes, i + 8), PRIME32_2)) | 0, 13),
        PRIME32_1,
      );
      v4 = Math.imul(
        rotl((v4 + Math.imul(readU32(bytes, i + 12), PRIME32_2)) | 0, 13),
        PRIME32_1,
      );
    }
    h32 =
      ((rotl(v1, 1) + rotl(v2, 7)) | 0) + ((rotl(v3, 12) + rotl(v4, 18)) | 0);
  } else {
    h32 = (seed + PRIME32_5) | 0;
  }

  h32 = (h32 + len) | 0;

  for (; i + 4 <= len; i += 4) {
    h32 = Math.imul(
      rotl((h32 + Math.imul(readU32(bytes, i), PRIME32_3)) | 0, 17),
      PRIME32_4,
    );
  }
  for (; i < len; i++) {
    h32 = Math.imul(
      rotl((h32 + Math.imul(bytes[i]!, PRIME32_5)) | 0, 11),
      PRIME32_1,
    );
  }

  h32 ^= h32 >>> 15;
  h32 = Math.imul(h32, PRIME32_2);
  h32 ^= h32 >>> 13;
  h32 = Math.imul(h32, PRIME32_3);
  h32 ^= h32 >>> 16;

  return h32 >>> 0;
}

const encoder = new TextEncoder();

/** Seeded xxHash32 of a string's UTF-8 bytes as 8 lowercase hex chars. */
export const h32ToString = (input: string, seed: number): string =>
  xxh32(encoder.encode(input), seed).toString(16).padStart(8, "0");
