import type { ReactElement } from "react";
import React, { memo, useCallback } from "react";
import { Button } from "@/components/shad-ui/button";
import { cn } from "@/utils/shad";
import type { Action } from "@/components/views/gameReducer";

interface NumpadProps {
  dispatch: React.Dispatch<Action>;
  negativeMode: boolean;
  className?: string;
}

const NumpadBtn: React.FC<{
  value: string;
  dispatch: React.Dispatch<Action>;
  icon?: ReactElement;
  className?: string;
}> = ({ value, icon, dispatch, className }) => {
  const buttonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // currentTarget: clicks may land on the glyph <span> inside the button.
      const newValue = e.currentTarget.value;

      if (!newValue) {
        return;
      }

      if (newValue === "<") {
        return dispatch({ type: "input-remove" });
      }

      if (newValue === "-") {
        return dispatch({ type: "input-toggle-negative", value: "-" });
      }

      if (newValue == "submit") {
        return dispatch({ type: "add-attempt" });
      }

      dispatch({ type: "input-insert", value: newValue });
    },
    [dispatch],
  );

  return (
    <Button
      variant="outline"
      className={cn(
        // Opaque background so the grid's 1px gaps read as hairlines.
        "h-full border-transparent bg-background text-center text-2xl font-medium tabular-nums tracking-normal hover:border-transparent hover:bg-accent active:bg-foreground/25",
        className,
      )}
      value={value}
      onClick={buttonClick}
    >
      {icon ?? value}
    </Button>
  );
};
NumpadBtn.displayName = "Numpad Button";

const Numpad: React.FC<NumpadProps> = memo(
  ({ dispatch, negativeMode, className }) => {
    const MemoBtn = useCallback(
      (props: { value: string; icon?: ReactElement; className?: string }) => (
        <NumpadBtn
          dispatch={dispatch}
          value={props.value}
          icon={props.icon}
          className={props.className}
        />
      ),
      [dispatch],
    );

    // Text glyphs only — no icon set. 1px gaps over the border color draw the
    // hairline grid between keys.
    return (
      <div
        className={cn(
          "grid h-full grid-cols-3 gap-px border-t bg-border",
          className,
        )}
      >
        <MemoBtn value="7" />
        <MemoBtn value="8" />
        <MemoBtn value="9" />

        <MemoBtn value="4" />
        <MemoBtn value="5" />
        <MemoBtn value="6" />

        <MemoBtn value="1" />
        <MemoBtn value="2" />
        <MemoBtn value="3" />

        <div className="grid grid-cols-2 gap-px">
          <MemoBtn
            value="<"
            className="w-full text-sm uppercase tracking-[0.05em]"
            icon={<span className="pointer-events-none">Del</span>}
          />
          <NumpadBtn
            dispatch={dispatch}
            value="-"
            className={cn("w-full", {
              "border-foreground bg-foreground text-background hover:bg-foreground":
                negativeMode,
            })}
            icon={<span className="pointer-events-none">−</span>}
          />
        </div>

        <MemoBtn value="0" />

        <div className="grid grid-cols-2 gap-px">
          <MemoBtn value="." className="w-full" />
          <MemoBtn
            value="submit"
            className="w-full"
            icon={<span className="pointer-events-none">→</span>}
          />
        </div>
      </div>
    );
  },
);

Numpad.displayName = "Numpad";

export { Numpad as default };
