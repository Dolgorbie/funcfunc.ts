import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig([
  {
    input: "src/main.ts",
    output: [
      {
        dir: "dist",
        format: "es",
        preserveModules: true,
      },
      {
        dir: "dist",
        format: "es",
        entryFileNames: "[name].min.js",
        preserveModules: true,
        sourcemap: true,
        plugins: [terser({ mangle: { properties: { regex: /^_.*/ } } })]
      },
      {
        dir: "dist",
        format: "es",
        entryFileNames: "[name].bundle.min.js",
        sourcemap: true,
        plugins: [terser({ mangle: { properties: { regex: /^_.*/ } } })]
      },
    ],
    logLevel: "debug",
    plugins: [typescript({ exclude: ["**/*.test.ts"] })]
  },
]);
