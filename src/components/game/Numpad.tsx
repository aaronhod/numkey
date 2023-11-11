import type { ReactElement } from "react";
import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { cn } from "@/utils/shad";
import type { Action } from "@/components/game/gameReducer";

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
      const target = e.target as HTMLButtonElement;
      const newValue = target.value;

      if (!newValue) {
        return;
      }

      if (newValue === "<") {
        return dispatch({ type: "input-remove" });
      }

      if (newValue === "-") {
        return dispatch({ type: "input-toggle-negative", value: "-" });
      }

      dispatch({ type: "input-insert", value: newValue });
    },
    [dispatch],
  );

  return (
    <Button
      variant="outline"
      className={cn(
        "sm:text-4 h-full rounded-none border-2 text-center text-2xl font-bold hover:bg-primary",
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

// TODO: on negative mode toggle, buttons are re-rendering
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

    return (
      <div className={cn("grid h-full grid-cols-3", className)}>
        <MemoBtn value="7" />
        <MemoBtn value="8" />
        <MemoBtn value="9" />

        <MemoBtn value="4" />
        <MemoBtn value="5" />
        <MemoBtn value="6" />

        <MemoBtn value="1" />
        <MemoBtn value="2" />
        <MemoBtn value="3" />

        <MemoBtn
          value="<"
          icon={<Delete className="ml-auto mr-auto h-10 w-10" />}
        />
        <MemoBtn value="0" />

        <div className="flex border-2 border-accent">
          <NumpadBtn
            dispatch={dispatch}
            value="-"
            className={cn("w-full bg-secondary/50", {
              "bg-primary/30": negativeMode,
            })}
          />
          <MemoBtn value="." className="w-full bg-secondary/50" />
        </div>
      </div>
    );
  },
);

Numpad.displayName = "Numpad";

export { Numpad as default };
