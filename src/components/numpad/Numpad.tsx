import React, { ReactElement } from "react";
import { BackSpaceIcon } from "../Icons";

interface NumpadProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

const Numpad: React.FC<NumpadProps> = ({ setValue, value }) => {
  function buttonClick(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    const newValue = target.value;

    if (!newValue) {
      return;
    }

    if (newValue === "<") {
      if (value.length === 0) return;
      setValue((value) => value.slice(0, -1));
      return;
    }

    if (value.length >= 3) {
      return;
    }

    setValue((value) => value + newValue);
  }

  const NumpadBtn: React.FC<{ value: string; icon?: ReactElement }> = ({
    value,
    icon,
  }) => {
    return (
      <button
        className="h-40 border-2 border-[hsl(var(--b1))] bg-base-300 text-center text-3xl"
        value={value}
        onClick={buttonClick}
      >
        {icon ?? value}
      </button>
    );
  };

  return (
    <div className="mt-auto grid grid-cols-3">
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
        icon={<BackSpaceIcon className="ml-auto mr-auto h-10 w-10" />}
      />
      <NumpadBtn value="0" />
      <NumpadBtn value="." />
    </div>
  );
};

export { Numpad as default };
