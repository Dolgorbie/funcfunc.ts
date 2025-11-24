/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */

type MethodOf<T extends {}> =
  T extends boolean ? MethodOf<Boolean>
  : T extends number ? MethodOf<Number>
  : T extends bigint ? MethodOf<BigInt>
  : T extends string ? MethodOf<String>
  : T extends symbol ? MethodOf<Symbol>
  : T extends (...xs: any[]) => any ? MethodOf<Function>
  : T extends unknown[] ? { [k in keyof (T[number][])]: T[k] extends (...xs: any[]) => any ? k : never }[keyof (T[number][])]
  : { [k in keyof T]: T[k] extends (...xs: any[]) => any ? k : never }[keyof T];

type FuncFrom<T extends {}, M extends MethodOf<T> & keyof T> = T[M] extends (...xs: infer XS) => infer R ? (self: T, ...xs: XS) => R : never;

const call = Function.call;

export function methodOf<T extends {}, M extends MethodOf<T> & keyof T>(cls: new (...xs: any[]) => T, method: M): FuncFrom<T, M> {
  return call.bind(cls.prototype[method]) as never;
}

export function booleanMethodOf<M extends MethodOf<boolean>>(method: M): FuncFrom<boolean, M> {
  return call.bind(Boolean.prototype[method]) as never;
}

export function numberMethodOf<M extends MethodOf<number>>(method: M): FuncFrom<number, M> {
  return call.bind(Number.prototype[method]) as never;
}

export function bigintMethodOf<M extends MethodOf<bigint>>(method: M): FuncFrom<bigint, M> {
  return call.bind(BigInt.prototype[method]) as never;
}

export function stringMethodOf<M extends MethodOf<string>>(method: M): FuncFrom<string, M> {
  return call.bind(String.prototype[method]) as never;
}

export function symbolMethodOf<M extends MethodOf<symbol>>(method: M): FuncFrom<symbol, M> {
  return call.bind(Symbol.prototype[method]) as never;
}
