import { expect, suite, test } from "vitest";
import { and, pred } from "./pred";
import { isArray, isInteger, isNumber, isObject } from "./pred/commons";

suite("and", () => {
  test("simple", () => {
    const pred = and(isNumber, isInteger);

    expect(pred(0)).toBe(true);
    expect(pred(1)).toBe(true);

    expect(pred("")).toBe(false);
    expect(pred("1")).toBe(false);
  });

  test("simple", () => {
    const pred = and(isObject, isArray);

    expect(pred([])).toBe(true);
    expect(pred([1])).toBe(true);

    expect(pred("")).toBe(false);
    expect(pred({})).toBe(false);
  });

  test("simple", () => {
    const p = pred(isObject).and(isArray);

    expect(p([])).toBe(true);
    expect(p([1])).toBe(true);

    expect(p("")).toBe(false);
    expect(p({})).toBe(false);
  });
});
