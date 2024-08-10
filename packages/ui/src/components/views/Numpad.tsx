import type { Action } from "Macaca/packages/ui/src/components/views/gameReducer";
import type { ReactElement } from "react";
import React, { memo, useCallback } from "react";
import { cn } from "@/utils/shad";
import { Button } from "@shad/button";
import { CornerDownRight, Delete, Dot, Minus } from "lucide-react";

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

        <div className="flex border-2 border-accent">
          <MemoBtn
            value="<"
            icon={<Delete className="ml-auto mr-auto h-10 w-10" />}
            className="w-full bg-destructive/30"
          />
          <NumpadBtn
            dispatch={dispatch}
            value="-"
            icon={<Minus className="ml-auto mr-auto h-10 w-10" />}
            className={cn("w-full", {
              "bg-secondary/50": negativeMode,
            })}
          />
        </div>

        <MemoBtn value="0" />

        <div className="flex border-2 border-accent">
          <MemoBtn
            value="."
            className="w-full"
            icon={<Dot className="ml-auto mr-auto h-10 w-10" />}
          />
          <MemoBtn
            value="submit"
            className="w-full bg-primary/20"
            icon={<CornerDownRight className="ml-auto mr-auto h-10 w-10" />}
          />
        </div>
      </div>
    );
  },
);

Numpad.displayName = "Numpad";

export { Numpad as default };
