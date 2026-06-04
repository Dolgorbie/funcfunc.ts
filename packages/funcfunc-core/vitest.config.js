import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    typecheck: {
      include: ["**/*.{test,spec}.?(c|m)js?(x)"]
    }
  },
})
