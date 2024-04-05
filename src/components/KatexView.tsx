import React, { useEffect } from "react";
import "katex/dist/katex.min.css";
import { render } from "katex";

interface KatexViewProps {
  tex: string;
  className?: string;
}

const KatexView = (props: KatexViewProps) => {
  const { tex, className, ...rest } = props;
  const containerRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      render(tex, containerRef.current);
    }
  }, [tex]);

  return <div ref={containerRef} className={className} {...rest} />;
};

export { KatexView };
