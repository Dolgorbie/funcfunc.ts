import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    typecheck: {
      include: ["**/*.type.{test,spec}.?(c|m)[jt]s?(x)"]
    }
  },
})
