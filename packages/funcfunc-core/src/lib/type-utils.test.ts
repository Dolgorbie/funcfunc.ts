/* eslint-disable @typescript-eslint/no-empty-object-type */

import { expectTypeOf, suite, test } from "vitest";
import type { UnionKeyOf, UnionOmit, UnionPick } from "./type-utils";

type T1 = { a: number, b: string, c: boolean };
type T2 = { b: symbol, c: bigint, d: null };
type T12 = T1 | T2;

suite("UnionKeyOf", () => {
  test("simple Object", () => {
    expectTypeOf<UnionKeyOf<T1>>().toEqualTypeOf<keyof T1>();
    expectTypeOf<UnionKeyOf<T2>>().toEqualTypeOf<keyof T2>();
  });

  test("union Object", () => {
    expectTypeOf<UnionKeyOf<T12>>().toEqualTypeOf<keyof T1 | keyof T2>();
  });
});

suite("UnionPick", () => {
  test("simple Object", () => {
    expectTypeOf<UnionPick<T1, "b">>().toEqualTypeOf<Pick<T1, "b">>();
    expectTypeOf<UnionPick<T2, "b">>().toEqualTypeOf<Pick<T2, "b">>();

    expectTypeOf<UnionPick<T1, "a" | "b">>().toEqualTypeOf<Pick<T1, "a" | "b">>();
    expectTypeOf<UnionPick<T2, "c" | "d">>().toEqualTypeOf<Pick<T2, "c" | "d">>();
  });

  test("union Object", () => {
    expectTypeOf<UnionPick<T12, "a">>().toEqualTypeOf<Pick<T1, "a"> | {}>();
    expectTypeOf<UnionPick<T12, "b">>().toEqualTypeOf<Pick<T1, "b"> | Pick<T2, "b">>();
    expectTypeOf<UnionPick<T12, "c">>().toEqualTypeOf<Pick<T1, "c"> | Pick<T2, "c">>();
    expectTypeOf<UnionPick<T12, "d">>().toEqualTypeOf<{} | Pick<T2, "d">>();

    expectTypeOf<UnionPick<T12, "a" | "b">>().toEqualTypeOf<Pick<T1, "a" | "b"> | Pick<T2, "b">>();
    expectTypeOf<UnionPick<T12, "b" | "c">>().toEqualTypeOf<Pick<T1, "b" | "c"> | Pick<T2, "b" | "c">>();
    expectTypeOf<UnionPick<T12, "c" | "d">>().toEqualTypeOf<Pick<T1, "c"> | Pick<T2, "c" | "d">>();
  });
});

suite("UnionOmit", () => {
  test("simple Object", () => {
    expectTypeOf<UnionOmit<T1, "b">>().toEqualTypeOf<Omit<T1, "b">>();
    expectTypeOf<UnionOmit<T2, "b">>().toEqualTypeOf<Omit<T2, "b">>();

    expectTypeOf<UnionOmit<T1, "a" | "b">>().toEqualTypeOf<Omit<T1, "a" | "b">>();
    expectTypeOf<UnionOmit<T2, "c" | "d">>().toEqualTypeOf<Omit<T2, "c" | "d">>();
  });

  test("union Object", () => {
    expectTypeOf<UnionOmit<T12, "a">>().toEqualTypeOf<Omit<T1, "a"> | Omit<T2, "a">>();
    expectTypeOf<UnionOmit<T12, "b">>().toEqualTypeOf<Omit<T1, "b"> | Omit<T2, "b">>();
    expectTypeOf<UnionOmit<T12, "c">>().toEqualTypeOf<Omit<T1, "c"> | Omit<T2, "c">>();
    expectTypeOf<UnionOmit<T12, "d">>().toEqualTypeOf<Omit<T1, "d"> | Omit<T2, "d">>();

    expectTypeOf<UnionOmit<T12, "a" | "b">>().toEqualTypeOf<Omit<T1, "a" | "b"> | Omit<T2, "a" | "b">>();
    expectTypeOf<UnionOmit<T12, "b" | "c">>().toEqualTypeOf<Omit<T1, "b" | "c"> | Omit<T2, "b" | "c">>();
    expectTypeOf<UnionOmit<T12, "c" | "d">>().toEqualTypeOf<Omit<T1, "c" | "d"> | Omit<T2, "c" | "d">>();
  });
});
