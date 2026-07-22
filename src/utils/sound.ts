/**
 * Tiny WebAudio synth for game feedback — no audio assets, everything is
 * generated from oscillators, so effects fire with near-zero latency.
 *
 * The AudioContext is created lazily on the first play call, which always
 * happens inside a user gesture (key press / pointer down), satisfying
 * browser autoplay policies.
 */

let audioCtx: AudioContext | null = null;
let enabled = true;
let volume = 0.5;

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export const VOLUME_LEVELS = [
  { label: "Low", value: 0.25 },
  { label: "Mid", value: 0.5 },
  { label: "High", value: 1 },
] as const;

/** Master volume multiplier applied to every effect (0–1). */
export function setSoundVolume(value: number) {
  volume = Math.min(Math.max(value, 0), 1);
}

function context(): AudioContext | null {
  if (!enabled || typeof window === "undefined") {
    return null;
  }

  try {
    audioCtx ??= new AudioContext();
  } catch {
    return null;
  }

  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

interface Tone {
  freq: number;
  /** Seconds after "now" to start. */
  at?: number;
  duration: number;
  type?: OscillatorType;
  peak?: number;
}

function play(tones: Tone[]) {
  const ctx = context();
  if (!ctx) {
    return;
  }

  for (const {
    freq,
    at = 0,
    duration,
    type = "square",
    peak = 0.04,
  } of tones) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    const t0 = ctx.currentTime + at;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peak * volume, t0 + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }
}

export const sound = {
  /** Soft click for every key press. */
  tap() {
    play([{ freq: 2400, duration: 0.03, type: "sine", peak: 0.02 }]);
  },
  /** Rising two-note blip: answer accepted. */
  correct() {
    play([
      { freq: 880, duration: 0.08 },
      { freq: 1318.5, at: 0.06, duration: 0.1 },
    ]);
  },
  /** Low descending buzz: attempt rejected, input cleared. */
  wrong() {
    play([
      { freq: 220, duration: 0.1 },
      { freq: 175, at: 0.05, duration: 0.12 },
    ]);
  },
  /** Short arpeggio when the game completes. */
  finish() {
    play([
      { freq: 659.25, duration: 0.12 },
      { freq: 880, at: 0.09, duration: 0.12 },
      { freq: 1108.73, at: 0.18, duration: 0.12 },
      { freq: 1318.5, at: 0.27, duration: 0.18 },
    ]);
  },
};
