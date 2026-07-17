import React, { memo, useCallback } from "react";
import { cn } from "@/utils/shad";
import type { Action } from "@/components/views/gameReducer";
import { sound } from "@/utils/sound";

interface NumpadProps {
  dispatch: React.Dispatch<Action>;
  negativeMode: boolean;
  /** Show the decimal key (the problem set contains non-integer answers). */
  showDecimal: boolean;
  /** Show the negative key (the problem set contains negative answers). */
  showNegative: boolean;
  className?: string;
}

// Answers auto-submit once the input reaches the answer's length, and wrong
// attempts auto-clear — so there are no delete/submit keys, only input keys.
const KEY_CLASSES =
  "flex h-full select-none touch-manipulation items-center justify-center bg-background text-2xl font-medium tabular-nums transition-none active:bg-foreground/25";

const NumpadBtn: React.FC<{
  value: string;
  dispatch: React.Dispatch<Action>;
  className?: string;
}> = ({ value, dispatch, className }) => {
  // pointerdown (not click) so keys respond the instant a finger lands.
  const press = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      sound.tap();

      if (value === "-") {
        dispatch({ type: "input-toggle-negative", value: "-" });
        return;
      }

      dispatch({ type: "input-insert", value });
    },
    [dispatch, value],
  );

  return (
    <button className={cn(KEY_CLASSES, className)} onPointerDown={press}>
      {value === "-" ? "−" : value}
    </button>
  );
};
NumpadBtn.displayName = "Numpad Button";

const Numpad: React.FC<NumpadProps> = memo(
  ({ dispatch, negativeMode, showDecimal, showNegative, className }) => {
    const Btn = useCallback(
      (props: { value: string; className?: string }) => (
        <NumpadBtn
          dispatch={dispatch}
          value={props.value}
          className={props.className}
        />
      ),
      [dispatch],
    );

    // 1px gaps over the border color draw the hairline grid between keys.
    return (
      <div
        className={cn(
          "grid h-full grid-cols-3 gap-px border-t bg-border",
          className,
        )}
      >
        <Btn value="7" />
        <Btn value="8" />
        <Btn value="9" />

        <Btn value="4" />
        <Btn value="5" />
        <Btn value="6" />

        <Btn value="1" />
        <Btn value="2" />
        <Btn value="3" />

        {showDecimal ? (
          <Btn value="." />
        ) : (
          <div aria-hidden className="bg-background" />
        )}

        <Btn value="0" />

        {showNegative ? (
          <Btn
            value="-"
            className={cn({
              "bg-foreground text-background active:bg-foreground":
                negativeMode,
            })}
          />
        ) : (
          <div aria-hidden className="bg-background" />
        )}
      </div>
    );
  },
);

Numpad.displayName = "Numpad";

export { Numpad as default };
