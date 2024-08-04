import baseConfig, { restrictEnvAccess } from "@munk/eslint-config/base";
import nextjsConfig from "@munk/eslint-config/nextjs";
import reactConfig from "@munk/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
