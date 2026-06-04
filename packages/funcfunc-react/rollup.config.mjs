import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';

export default defineConfig([
  {
    input: "src/main.js",
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
  },
]);
