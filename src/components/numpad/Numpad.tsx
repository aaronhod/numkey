import type { ReactElement } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { cn } from "@/utils/shad";

interface NumpadProps {
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  value: string | null;
  className?: string;
}

const Numpad: React.FC<NumpadProps> = ({ setValue, value, className }) => {
  function buttonClick(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    const newValue = target.value;

    if (!newValue) {
      return;
    }

    if (newValue === "<") {
      if (value === null || value.length === 0) {
        return;
      }
      setValue((value) => value!.slice(0, -1));
      return;
    }


    if (value !== null && value.length >= 5) {
      return;
    }

    if (value === null) {
      setValue(newValue);
      return;
    }

    setValue((value) => value + newValue);
  }

  const NumpadBtn: React.FC<{ value: string; icon?: ReactElement }> = ({
    value,
    icon,
  }) => {
    return (
      <Button
        variant="outline"
        className="sm:text-4 h-full border-2 text-center text-2xl  font-bold hover:bg-primary"
        value={value}
        onClick={buttonClick}
      >
        {icon ?? value}
      </Button>
    );
  };

  return (
    <div className={cn("grid h-full grid-cols-3", className)}>
      <NumpadBtn value="1" />
      <NumpadBtn value="2" />
      <NumpadBtn value="3" />

      <NumpadBtn value="4" />
      <NumpadBtn value="5" />
      <NumpadBtn value="6" />

      <NumpadBtn value="7" />
      <NumpadBtn value="8" />
      <NumpadBtn value="9" />

      <NumpadBtn
        value="<"
        icon={<Delete className="ml-auto mr-auto h-10 w-10" />}
      />
      <NumpadBtn value="0" />
      <NumpadBtn value="." />
    </div>
  );
};

export { Numpad as default };
