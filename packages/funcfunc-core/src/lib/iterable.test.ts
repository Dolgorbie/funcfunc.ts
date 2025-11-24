import { expect, suite, test } from "vitest";
import { cons, decompose, empty, values, xcons } from "./iterable";

suite("iterables", () => {
  test("empty", () => {
    const actual = empty();
    expect([...actual]).toEqual([]);
  });

  test("values nothing", () => {
    const actual = values();
    expect([...actual]).toEqual([]);
  });

  test("values something", () => {
    const actual = values(1, "abc");
    expect([...actual]).toEqual([1, "abc"]);
  });

  test("cons", () => {
    const actual = cons(1, cons(2, empty()));
    expect([...actual]).toEqual([1, 2]);
  });

  test("xcons", () => {
    const actual = xcons(xcons(empty(), 2), 1);
    expect([...actual]).toEqual([1, 2]);
  });

  test("decompose", () => {
    const actual = decompose(values(1, 2, 3))
    // const actual = decompoe([1, 2, 3])
    expect(actual).instanceOf(Array);
    const [x, xs] = actual!;
    expect(x).toBe(1);
    expect([...xs]).toEqual([2, 3]);
  });
})
