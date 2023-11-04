import type { ReactElement } from "react";
import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { cn } from "@/utils/shad";
import type { Action } from "@/components/game/gameReducer";

interface NumpadProps {
  dispatch: React.Dispatch<Action>;
  className?: string;
}

const Numpad: React.FC<NumpadProps> = memo(({ dispatch, className }) => {
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

  const NumpadBtn: React.FC<{
    value: string;
    icon?: ReactElement;
    className?: string;
  }> = memo(({ value, icon, className }) => {
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
  });
  NumpadBtn.displayName = "Numpad Button";

  return (
    <div className={cn("grid h-full grid-cols-3", className)}>
      <NumpadBtn value="7" />
      <NumpadBtn value="8" />
      <NumpadBtn value="9" />

      <NumpadBtn value="4" />
      <NumpadBtn value="5" />
      <NumpadBtn value="6" />

      <NumpadBtn value="1" />
      <NumpadBtn value="2" />
      <NumpadBtn value="3" />

      <NumpadBtn
        value="<"
        icon={<Delete className="ml-auto mr-auto h-10 w-10" />}
      />
      <NumpadBtn value="0" />

      <div className="flex border-2 border-accent">
        <NumpadBtn value="-" className="w-full bg-secondary/50 " />
        <NumpadBtn value="." className="w-full bg-secondary/50" />
      </div>
    </div>
  );
});

Numpad.displayName = "Numpad";

export { Numpad as default };
