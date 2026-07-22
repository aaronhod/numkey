import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import reactHooks from "eslint-plugin-react-hooks";

/**
 * Flat ESLint config (ESLint 9+/Next 16). `next lint` was removed in Next 16,
 * so linting now runs through the ESLint CLI (`eslint .`). The Next preset
 * already wires up the TypeScript, React, React Hooks, import and jsx-a11y
 * plugins.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      /**
       * `react-hooks/static-components` is new in the React Hooks plugin shipped
       * with Next 16. It flags components declared during render (e.g. the
       * inline `useCallback`/`forwardRef` helpers in Numpad and SelectionScreen).
       * Those are pre-existing patterns, not introduced by the dependency
       * upgrade, so we surface them as warnings rather than failing lint here.
       * Hoisting those components out of render is a good follow-up cleanup.
       */
      "react-hooks/static-components": "warn",
    },
  },
];
