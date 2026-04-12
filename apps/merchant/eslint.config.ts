import { config } from "@vestrapay/eslint-config/next";
import type { Linter } from "eslint";

const eslintConfig: Linter.Config[] = [
  ...config,
  {
    ignores: ["apps/**"],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

export default eslintConfig;
