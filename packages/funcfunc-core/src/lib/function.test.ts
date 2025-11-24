import { expect, expectTypeOf, suite, test } from "vitest";
import { begin, compose, pipe } from "./function";

function f0(x: number): string {
  return "callF0" + x;
}

function f1(x: string): string[] {
  return [x, x];
}

function f2(x: string[]): { v: string } {
  return { v: x[0] };
}

function f3(x: { v: string }): [string, string][] {
  return Object.entries(x);
}

suite("compose", () => {
  test("types compose 2 functions", () => {
    expectTypeOf(compose(f1, f0)).toEqualTypeOf((x: number) => f1(f0(x)));
  });

  test("types compose 3 functions", () => {
    expectTypeOf(compose(f2, compose(f1, f0))).toEqualTypeOf((x: number) => f2(f1(f0(x))));
    expectTypeOf(compose(compose(f2, f1), f0)).toEqualTypeOf((x: number) => f2(f1(f0(x))));
  });

  test("pipe", () => {
    expectTypeOf(pipe(f0, f1)).toEqualTypeOf((x: number) => f1(f0(x)));
  })

  test("pipeline", () => {
    const pipline = begin(f0).and(f1).and(f2).and(f3);
    expectTypeOf(pipline).toEqualTypeOf(begin((x: number) => f3(f2(f1(f0(x))))));
    expect(pipline(1)).toEqual([["v", "callF01"]]);
  })
})
