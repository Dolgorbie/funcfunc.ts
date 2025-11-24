export function identity<const X>(x: X) {
  return x;
}

export { identity as id };

export function values<const XS extends readonly any[]>(...xs: XS): XS {
  return xs;
}

export function tuple<const XS extends readonly any[]>(xs: XS): Readonly<XS> {
  return xs;
}

export { tuple as t };

export function partial<AS extends readonly any[], PS extends readonly any[], R>(
  f: (...xs: [...AS, ...PS]) => R,
  ...args: AS
): (...params: PS) => R {
  return (...params) => f(...args, ...params);
}

export { partial as pa };

export function xpartial<P, AS extends readonly any[], R>(
  f: (p: P, ...args: AS) => R,
  ...args: AS
): (p: P) => R {
  return (p) => f(p, ...args);
}

export { xpartial as xpa };

export function call<XS extends readonly any[], Y>(f: (...xs: XS) => Y, ...xs: XS): Y {
  return f(...xs);
}

export function xcall<X, Y>(x: X, f: (x: X) => Y): Y {
  return f(x);
}

export function apply<XS extends readonly any[], Y>(f: (...xs: XS) => Y, xs: XS): Y;
export function apply<X, Y>(f: (...xs: X[]) => Y, xs: Iterable<X>): Y;
export function apply<X, Y>(f: (...xs: X[]) => Y, xs: Iterable<X>): Y {
  return f(...xs);
}

export function compose<XS extends readonly any[], Y, Z>(f: (y: Y) => Z, g: (...xs: XS) => Y): (...xs: XS) => Z {
  return (...xs) => f(g(...xs));
}

export { compose as cmp };

export function pipe<XS extends readonly any[], Y, Z>(f: (...xs: XS) => Y, g: (y: Y) => Z): (...xs: XS) => Z {
  return (...xs) => g(f(...xs));
}

export { pipe as pip };

export interface Pipeline<XS extends readonly any[], Y> {
  (...xs: XS): Y;
  and<Z, AS extends readonly any[]>(g: (...args: [...AS, Y]) => Z, ...args: AS): Pipeline<XS, Z>;
  xand<Z, AS extends readonly any[]>(g: (y: Y, ...args: AS) => Z, ...args: AS): Pipeline<XS, Z>;
}

export function begin<PS extends readonly any[], Y, AS extends readonly any[]>(f: (...xs: [...AS, ...PS]) => Y, ...args: AS): Pipeline<PS, Y> {
  return beginI(partial(f, ...args));
}

export function xbegin<P, Y, AS extends readonly any[]>(f: (p: P, ...args: AS) => Y, ...args: AS): Pipeline<[P], Y> {
  return beginI(xpartial(f, ...args));
}

export function beginI<PS extends readonly any[], Y>(f: (...params: PS) => Y): Pipeline<PS, Y> {
  const tmp = f as Pipeline<PS, Y>;

  tmp.and = function (g, ...args) {
    return beginI(pipe(this, partial(g, ...args)));
  }

  tmp.xand = function (g, ...args) {
    return beginI(pipe(this, xpartial(g, ...args)));
  }

  return tmp;
}

export function curry2<X0, XS extends readonly any[], Y>(f: (x0: X0, ...xs: XS) => Y): (x0: X0) => (...xs: XS) => Y {
  return (x0) => (...xs) => f(x0, ...xs);
}

export function curry3<X0, X1, XS extends readonly any[], Y>(f: (x0: X0, x1: X1, ...xs: XS) => Y): (x0: X0) => (x1: X1) => (...xs: XS) => Y {
  return (x0) => (x1) => (...xs) => f(x0, x1, ...xs);
}

export function curry4<X0, X1, X2, XS extends readonly any[], Y>(f: (x0: X0, x1: X1, x2: X2, ...xs: XS) => Y): (x0: X0) => (x1: X1) => (x2: X2) => (...xs: XS) => Y {
  return (x0) => (x1) => (x2) => (...xs) => f(x0, x1, x2, ...xs);
}

export function curry5<X0, X1, X2, X3, XS extends readonly any[], Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, ...xs: XS) => Y): (x0: X0) => (x1: X1) => (x2: X2) => (x3: X3) => (...xs: XS) => Y {
  return (x0) => (x1) => (x2) => (x3) => (...xs) => f(x0, x1, x2, x3, ...xs);
}

export function curry6<X0, X1, X2, X3, X4, XS extends readonly any[], Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, ...xs: XS) => Y): (x0: X0) => (x1: X1) => (x2: X2) => (x3: X3) => (x4: X4) => (...xs: XS) => Y {
  return (x0) => (x1) => (x2) => (x3) => (x4) => (...xs) => f(x0, x1, x2, x3, x4, ...xs);
}

export function curry7<X0, X1, X2, X3, X4, X5, XS extends readonly any[], Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, x5: X5, ...xs: XS) => Y): (x0: X0) => (x1: X1) => (x2: X2) => (x3: X3) => (x4: X4) => (x5: X5) => (...xs: XS) => Y {
  return (x0) => (x1) => (x2) => (x3) => (x4) => (x5) => (...xs) => f(x0, x1, x2, x3, x4, x5, ...xs);
}

export function curry8<X0, X1, X2, X3, X4, X5, X6, XS extends readonly any[], Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, x5: X5, x6: X6, ...xs: XS) => Y): (x0: X0) => (x1: X1) => (x2: X2) => (x3: X3) => (x4: X4) => (x5: X5) => (x6: X6) => (...xs: XS) => Y {
  return (x0) => (x1) => (x2) => (x3) => (x4) => (x5) => (x6) => (...xs) => f(x0, x1, x2, x3, x4, x5, x6, ...xs);
}

export function curry9<X0, X1, X2, X3, X4, X5, X6, X7, XS extends readonly any[], Y>(f: (x0: X0, x1: X1, x2: X2, x3: X3, x4: X4, x5: X5, x6: X6, x7: X7, ...xs: XS) => Y): (x0: X0) => (x1: X1) => (x2: X2) => (x3: X3) => (x4: X4) => (x5: X5) => (x6: X6) => (x7: X7) => (...xs: XS) => Y {
  return (x0) => (x1) => (x2) => (x3) => (x4) => (x5) => (x6) => (x7) => (...xs) => f(x0, x1, x2, x3, x4, x5, x6, x7, ...xs);
}

export * as Pred from "./function/pred";
