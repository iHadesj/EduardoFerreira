import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    ".velite/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // No accidental logging; warn/error are allowed (and used in env.ts).
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // §5.1 — `any` is forbidden; use `unknown` + narrowing.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);

export default eslintConfig;
