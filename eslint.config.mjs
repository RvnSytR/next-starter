import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const eslintConfig = [
  ...new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
  }).extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
