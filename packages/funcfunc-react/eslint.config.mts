import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

declare var __dirname: string;

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser, parserOptions: { tsconfigRootDir: __dirname } } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
