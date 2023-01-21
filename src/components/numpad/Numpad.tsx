// react functional component that renders a numpad and a display
// the numpad is a grid of buttons that are rendered using the Button component

import { useState } from "react";

// the display is a text input that is rendered using the Input
const Numpad: React.FC = () => {
  const [value, setValue] = useState<string>("");

  function buttonClick(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    const value = target.value;
    setValue(value);
  }

  const NumpadBtn: React.FC<{ value: string }> = ({ value }) => {
    return (
      <button
        className="text-center text-3xl h-40 bg-base-300 border-2 border-[hsl(var(--b1))]"
        value={value}
        onClick={buttonClick}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full font-mono text-lg font-semibold">
      <h1 className="text-8xl pl-16 pr-16 bg-neutral-content"> {value} </h1>
      <div className="grid grid-cols-3 mt-auto">
        <NumpadBtn value="1" />
        <NumpadBtn value="2" />
        <NumpadBtn value="3" />

        <NumpadBtn value="4" />
        <NumpadBtn value="5" />
        <NumpadBtn value="6" />

        <NumpadBtn value="7" />
        <NumpadBtn value="8" />
        <NumpadBtn value="9" />

        <NumpadBtn value="<" />
        <NumpadBtn value="0" />
        <NumpadBtn value=">" />
      </div>
    </div>
  );
};

export { Numpad as default };
