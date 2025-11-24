import { identity } from "./function";

type IterableTuple<TS extends any[]> = { [i in keyof TS]: Iterable<TS[i]> };

export function* empty<T = any>(): Iterable<T> {
}

export function* values<const XS extends any[]>(...xs: XS): Iterable<XS[number]> {
  yield* xs;
}

class _IteratorIterable<T> implements Iterable<T> {
  constructor(private _self: Iterator<T>) { }

  [Symbol.iterator](): Iterator<T> {
    return this._self;
  }
}

export function iterableFrom<T>(iter: Iterator<T> | IterableIterator<T>): Iterable<T> {
  return Symbol.iterator in iter ? iter : new _IteratorIterable(iter);
}

export function* cons<T>(x: T, xs: Iterable<T>): Iterable<T> {
  yield x;
  yield* xs;
}

export function* xcons<T>(xs: Iterable<T>, x: T): Iterable<T> {
  yield x;
  yield* xs;
}

export function decompose<T>(xs: Iterable<T>): [T, Iterable<T>] | undefined {
  const iter = xs[Symbol.iterator]();
  const { value, done } = iter.next();
  return done ? undefined : [value, iterableFrom(iter)];
}

export function zip(): Iterable<[]>;
export function zip<T0>(k0: Iterable<T0>): Iterable<[T0]>;
export function zip<T0, T1>(k0: Iterable<T0>, k1: Iterable<T1>): Iterable<[T0, T1]>;
export function zip<T0, T1, T2>(k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>): Iterable<[T0, T1, T2]>;
export function zip<T0, T1, T2, T3>(k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>): Iterable<[T0, T1, T2, T3]>;
export function zip<T0, T1, T2, T3, T4>(k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>): Iterable<[T0, T1, T2, T3, T4]>;
export function zip<T0, T1, T2, T3, T4, T5>(k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>): Iterable<[T0, T1, T2, T3, T4, T5]>;
export function zip<T0, T1, T2, T3, T4, T5, T6>(k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>): Iterable<[T0, T1, T2, T3, T4, T5, T6]>;
export function zip<T0, T1, T2, T3, T4, T5, T6, T7>(k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>): Iterable<[T0, T1, T2, T3, T4, T5, T6, T7]>;
export function zip<T0, T1, T2, T3, T4, T5, T6, T7, T8>(k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>): Iterable<[T0, T1, T2, T3, T4, T5, T6, T7, T8]>;
export function zip<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>, k9: Iterable<T9>): Iterable<[T0, T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export function zip<TS extends any[]>(...ks: IterableTuple<TS>): Iterable<TS>;
export function* zip(...ks: Iterable<any>[]): Iterable<any[]> {
  const iters = ks.map((k) => k[Symbol.iterator]());
  for (; ;) {
    const tmp = [];
    for (const iter of iters) {
      const { value, done } = iter.next();
      if (done) {
        return;
      }
      tmp.push(value);
    }
    yield tmp;
  }
}

export function* take<T>(limit: number, iter: Iterable<T>): Iterable<T> {
  let i = 0;
  for (const x of iter) {
    if (i >= limit) {
      break;
    }
    yield x;
    i += 1;
  }
}

export function* drop<T>(limit: number, iter: Iterable<T>): Iterable<T> {
  let i = 0;
  for (const x of iter) {
    if (i < limit) {
      i += 1;
      continue;
    }
    yield x;
  }
}

export function map<X0, Y>(f: (x0: X0) => Y, k0: Iterable<X0>): Iterable<Y>;
export function map<X0, X1, Y>(f: (x0: X0, x1: X1) => Y, k0: Iterable<X0>, k1: Iterable<X1>): Iterable<Y>;
export function map<X0, X1, X2, Y>(f: (x0: X0, x1: X1, x2: X2) => Y, k0: Iterable<X0>, k1: Iterable<X1>, k2: Iterable<X2>): Iterable<Y>;
export function map<X0, X1, X2, X3, Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3) => Y, k0: Iterable<X0>, k1: Iterable<X1>, k2: Iterable<X2>, k3: Iterable<X3>): Iterable<Y>;
export function map<X0, X1, X2, X3, X4, Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4) => Y, k0: Iterable<X0>, k1: Iterable<X1>, k2: Iterable<X2>, k3: Iterable<X3>, k4: Iterable<X4>): Iterable<Y>;
export function map<X0, X1, X2, X3, X4, X5, Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, x5: X5) => Y, k0: Iterable<X0>, k1: Iterable<X1>, k2: Iterable<X2>, k3: Iterable<X3>, k4: Iterable<X4>, k5: Iterable<X5>): Iterable<Y>;
export function map<X0, X1, X2, X3, X4, X5, X6, Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, x5: X5, x6: X6) => Y, k0: Iterable<X0>, k1: Iterable<X1>, k2: Iterable<X2>, k3: Iterable<X3>, k4: Iterable<X4>, k5: Iterable<X5>, k6: Iterable<X6>): Iterable<Y>;
export function map<X0, X1, X2, X3, X4, X5, X6, X7, Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, x5: X5, x6: X6, x7: X7) => Y, k0: Iterable<X0>, k1: Iterable<X1>, k2: Iterable<X2>, k3: Iterable<X3>, k4: Iterable<X4>, k5: Iterable<X5>, k6: Iterable<X6>, k7: Iterable<X7>): Iterable<Y>;
export function map<X0, X1, X2, X3, X4, X5, X6, X7, X8, Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, x5: X5, x6: X6, x7: X7, x8: X8) => Y, k0: Iterable<X0>, k1: Iterable<X1>, k2: Iterable<X2>, k3: Iterable<X3>, k4: Iterable<X4>, k5: Iterable<X5>, k6: Iterable<X6>, k7: Iterable<X7>, k8: Iterable<X8>): Iterable<Y>;
export function map<X0, X1, X2, X3, X4, X5, X6, X7, X8, X9, Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, x5: X5, x6: X6, x7: X7, x8: X8, x9: X9) => Y, k0: Iterable<X0>, k1: Iterable<X1>, k2: Iterable<X2>, k3: Iterable<X3>, k4: Iterable<X4>, k5: Iterable<X5>, k6: Iterable<X6>, k7: Iterable<X7>, k8: Iterable<X8>, k9: Iterable<X9>): Iterable<Y>;
export function map<XS extends any[], Y>(f: (...xs: XS) => Y, ...ks: IterableTuple<XS>): Iterable<Y>;
export function* map<Y>(f: (...xs: any[]) => Y, ...ks: Iterable<any>[]): Iterable<Y> {
  const argsIter = zip(...ks);
  for (const args of argsIter) {
    yield f(...args);
  }
}

export function forEach<T0>(f: (x0: T0) => void, k0: Iterable<T0>): void;
export function forEach<T0, T1>(f: (x0: T0, x1: T1) => void, k0: Iterable<T0>, k1: Iterable<T1>): void;
export function forEach<T0, T1, T2>(f: (x0: T0, x1: T1, x2: T2) => void, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>): void;
export function forEach<T0, T1, T2, T3>(f: (x0: T0, x1: T1, x2: T2, x3: T3) => void, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>): void;
export function forEach<T0, T1, T2, T3, T4>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4) => void, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>): void;
export function forEach<T0, T1, T2, T3, T4, T5>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5) => void, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>): void;
export function forEach<T0, T1, T2, T3, T4, T5, T6>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6) => void, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>): void;
export function forEach<T0, T1, T2, T3, T4, T5, T6, T7>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7) => void, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>): void;
export function forEach<T0, T1, T2, T3, T4, T5, T6, T7, T8>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8) => void, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>): void;
export function forEach<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8, x9: T9) => void, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>, k9: Iterable<T9>): void;
export function forEach(f: (...xs: any[]) => void, ...ks: Iterable<any>[]): void {
  const iters = ks.map((k) => k[Symbol.iterator]());
  for (; ;) {
    const args = [];
    for (const iter of iters) {
      const { value, done } = iter.next();
      if (done) {
        return;
      }
      args.push(value);
    }
    f(...args);
  }
}

export function flatMap<T0, U>(f: (x0: T0) => Iterable<U>, k0: Iterable<T0>): Iterable<U>;
export function flatMap<T0, T1, U>(f: (x0: T0, x1: T1) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>): Iterable<U>;
export function flatMap<T0, T1, T2, U>(f: (x0: T0, x1: T1, x2: T2) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>): Iterable<U>;
export function flatMap<T0, T1, T2, T3, U>(f: (x0: T0, x1: T1, x2: T2, x3: T3) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>): Iterable<U>;
export function flatMap<T0, T1, T2, T3, T4, U>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>): Iterable<U>;
export function flatMap<T0, T1, T2, T3, T4, T5, U>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>): Iterable<U>;
export function flatMap<T0, T1, T2, T3, T4, T5, T6, U>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>): Iterable<U>;
export function flatMap<T0, T1, T2, T3, T4, T5, T6, T7, U>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>): Iterable<U>;
export function flatMap<T0, T1, T2, T3, T4, T5, T6, T7, T8, U>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>): Iterable<U>;
export function flatMap<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, U>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8, x9: T9) => Iterable<U>, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>, k9: Iterable<T9>): Iterable<U>;
export function* flatMap<U>(f: (...xs: any[]) => Iterable<U>, ...ks: Iterable<any>[]): Iterable<U> {
  const iters = ks.map((k) => k[Symbol.iterator]());
  for (; ;) {
    const args = [];
    for (const iter of iters) {
      const { value, done } = iter.next();
      if (done) {
        return;
      }
      args.push(value);
    }
    yield* f(...args);
  }
}

export function foldL<T0, U>(f: (acc: U, x0: T0) => U, init: U, k0: Iterable<T0>): Iterable<U>;
export function foldL<T0, T1, U>(f: (acc: U, x0: T0, x1: T1) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>): Iterable<U>;
export function foldL<T0, T1, T2, U>(f: (acc: U, x0: T0, x1: T1, x2: T2) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>): Iterable<U>;
export function foldL<T0, T1, T2, T3, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>): Iterable<U>;
export function foldL<T0, T1, T2, T3, T4, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>): Iterable<U>;
export function foldL<T0, T1, T2, T3, T4, T5, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>): Iterable<U>;
export function foldL<T0, T1, T2, T3, T4, T5, T6, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>): Iterable<U>;
export function foldL<T0, T1, T2, T3, T4, T5, T6, T7, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>): Iterable<U>;
export function foldL<T0, T1, T2, T3, T4, T5, T6, T7, T8, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>): Iterable<U>;
export function foldL<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8, x9: T9) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>, k9: Iterable<T9>): Iterable<U>;
export function foldL<U>(f: (acc: U, ...xs: any[]) => U, init: U, ...ks: Iterable<any>[]): U {
  const iters = ks.map((k) => k[Symbol.iterator]());
  let acc: U = init;
  for (; ;) {
    const args = [];
    for (const iter of iters) {
      const { value, done } = iter.next();
      if (done) {
        return acc;
      }
      args.push(value);
    }
    acc = f(acc, ...args);
  }
}

export function foldR<T0, U>(f: (acc: U, x0: T0) => U, init: U, k0: Iterable<T0>): Iterable<U>;
export function foldR<T0, T1, U>(f: (acc: U, x0: T0, x1: T1) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>): Iterable<U>;
export function foldR<T0, T1, T2, U>(f: (acc: U, x0: T0, x1: T1, x2: T2) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>): Iterable<U>;
export function foldR<T0, T1, T2, T3, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>): Iterable<U>;
export function foldR<T0, T1, T2, T3, T4, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>): Iterable<U>;
export function foldR<T0, T1, T2, T3, T4, T5, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>): Iterable<U>;
export function foldR<T0, T1, T2, T3, T4, T5, T6, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>): Iterable<U>;
export function foldR<T0, T1, T2, T3, T4, T5, T6, T7, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>): Iterable<U>;
export function foldR<T0, T1, T2, T3, T4, T5, T6, T7, T8, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>): Iterable<U>;
export function foldR<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, U>(f: (acc: U, x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8, x9: T9) => U, init: U, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>, k9: Iterable<T9>): Iterable<U>;
export function foldR<U>(f: (acc: U, ...xs: any[]) => U, init: U, ...ks: Iterable<any>[]): U {
  const iters = ks.map((k) => k[Symbol.iterator]());
  let acc: (init: U) => U = identity;
  for (; ;) {
    const args: any[] = [];
    for (const iter of iters) {
      const { value, done } = iter.next();
      if (done) {
        return acc(init);
      }
      args.push(value);
    }
    const tmp = acc;
    acc = (init) => tmp(f(init, ...args));
  }
}

export function* unfoldL<T, U>(f: (x: U) => [U, T] | undefined, init: U): Iterable<T> {
  let value: T;
  let acc: U = init;
  let tmp: [U, T] | undefined;
  while ((tmp = f(acc)) != null) {
    [acc, value] = tmp;
    yield value;
  }
}

export function* unfoldR<T, U>(f: (x: U) => [T, U] | undefined, init: U): Iterable<T> {
  const result: T[] = [];
  let value: T;
  let acc: U = init;
  let tmp: [T, U] | undefined;
  while ((tmp = f(acc)) != null) {
    [value, acc] = tmp;
    result.push(value);
  }
  for (const x of result.reverse()) {
    yield x;
  }
}

export function* filter<T>(f: (x: T) => boolean, k: Iterable<T>): Iterable<T> {
  for (const x of k) {
    if (f(x)) {
      yield x;
    }
  }
}

export function* removeIf<T>(f: (x: T) => boolean, k: Iterable<T>): Iterable<T> {
  for (const x of k) {
    if (!f(x)) {
      yield x;
    }
  }
}

export function every<T0>(f: (x0: T0) => boolean, k0: Iterable<T0>): boolean;
export function every<T0, T1>(f: (x0: T0, x1: T1) => boolean, k0: Iterable<T0>, k1: Iterable<T1>): boolean;
export function every<T0, T1, T2>(f: (x0: T0, x1: T1, x2: T2) => boolean, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>): boolean;
export function every<T0, T1, T2, T3>(f: (x0: T0, x1: T1, x2: T2, x3: T3) => boolean, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>): boolean;
export function every<T0, T1, T2, T3, T4>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4) => boolean, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>): boolean;
export function every<T0, T1, T2, T3, T4, T5>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5) => boolean, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>): boolean;
export function every<T0, T1, T2, T3, T4, T5, T6>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6) => boolean, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>): boolean;
export function every<T0, T1, T2, T3, T4, T5, T6, T7>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7) => boolean, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>): boolean;
export function every<T0, T1, T2, T3, T4, T5, T6, T7, T8>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8) => boolean, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>): boolean;
export function every<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(f: (x0: T0, x1: T1, x2: T2, x3: T3, x4: T4, x5: T5, x6: T6, x7: T7, x8: T8, x9: T9) => boolean, k0: Iterable<T0>, k1: Iterable<T1>, k2: Iterable<T2>, k3: Iterable<T3>, k4: Iterable<T4>, k5: Iterable<T5>, k6: Iterable<T6>, k7: Iterable<T7>, k8: Iterable<T8>, k9: Iterable<T9>): boolean;
export function every(f: (...xs: any[]) => boolean, ...ks: Iterable<any>[]): boolean {
  const iters = ks.map((k) => k[Symbol.iterator]());
  for (; ;) {
    const args = [];
    for (const iter of iters) {
      const { value, done } = iter.next();
      if (done) {
        return true;
      }
      args.push(value);
    }
    if (f(...args)) {
      return false;
    }
  }
}

export function some<T>(f: (x: T) => boolean, xs: Iterable<T>): boolean {
  for (const x of xs) {
    if (f(x)) {
      return true;
    }
  }
  return false;
}

export function find<T>(f: (x: T) => boolean, xs: Iterable<T>): T | undefined {
  for (const x of xs) {
    if (f(x)) {
      return x;
    }
  }
}

export function findTail<T>(f: (x: T) => boolean, xs: Iterable<T>): Iterable<T> {
  const iter = xs[Symbol.iterator]();
  let result: IteratorResult<T>;
  while (!(result = iter.next()).done) {
    const { value } = result;
    if (f(value)) {
      return cons(value, iterableFrom(iter));
    }
  }
  return iterableFrom(iter);
}

export function member<T>(search: T, xs: Iterable<T>): Iterable<T> {
  return findTail((x) => x === search, xs);
}

export function* unique<T>(xs: Iterable<T>): Iterable<T> {
  const cache = new Set<T>();
  for (const x of xs) {
    if (cache.has(x)) {
      continue;
    }
    cache.add(x);
    yield x;
  }
}

export function* append<T>(...xss: Iterable<T>[]): Iterable<T> {
  for (const xs of xss) {
    yield* xs;
  }
}

export function* concatenate<T>(xss: Iterable<Iterable<T>>): Iterable<T> {
  for (const xs of xss) {
    yield* xs;
  }
}

export function* reverse<T>(xs: Iterable<T>): Iterable<T> {
  const arr = [...xs];
  yield* arr.reverse();
}

export function* iota(count = Number.POSITIVE_INFINITY, step = 1, start = 0) {
  for (let i = 0; i < count; ++i) {
    yield start + step * i;
  }
}
