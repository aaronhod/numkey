import { parse } from "mathjs";
import { render } from "katex";
import { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";

const equation1 = parse(
  "sqrt(75 / 3) + det([[-1, 2], [3, 1]]) - sin(pi / 4)^2",
);
// TODO: Make Katex Component
export default function Page() {
  const containerRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      render(equation1.toTex(), containerRef.current);
    }
  }, []);

  return (
    <div>
      <h1>Practice</h1>
      <div ref={containerRef} />
    </div>
  );
}
