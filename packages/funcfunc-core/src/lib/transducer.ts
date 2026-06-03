export function takeT(limit: number): <T, X>(rf: (acc: T, x: X) => T) => (acc: T, x: X) => T {
  return (rf) => {
    let count = 0;
    return (acc, x) => count >= limit ? acc : (++count, rf(acc, x));
  }
}

export function dropT(limit: number): <T, X>(rf: (acc: T, x: X) => T) => (acc: T, x: X) => T {
  return (rf) => {
    let count = 0;
    return (acc, x) => count < limit ? (++count, acc) : rf(acc, x);
  }
}

export function mapT<X, Y>(f: (x: X) => Y): <T>(rf: (acc: T, y: Y) => T) => (acc: T, x: X) => T {
  return (rf) => (acc, x) => rf(acc, f(x));
}

export function flatMapT<X, Y>(f: (x: X) => Y[]): <T>(rf: (acc: T, y: Y) => T) => (acc: T, x: X) => T {
  return (rf) => (acc, x) => f(x).reduce(rf, acc);
}

export function filterT<X, Y extends X>(pred: (x: X) => x is Y): <T>(rf: (acc: T, y: Y) => T) => (acc: T, x: X) => T;
export function filterT<X>(pred: (x: X) => boolean): <T>(rf: (acc: T, x: X) => T) => (acc: T, x: X) => T;
export function filterT<X>(pred: (x: X) => boolean): <T>(rf: (acc: T, x: X) => T) => (acc: T, x: X) => T {
  return (rf) => (acc, x) => pred(x) ? rf(acc, x) : acc;
}

export function removeIfT<X, Y extends X>(pred: (x: X) => x is Y): <T>(rf: (acc: T, z: Exclude<X, Y>) => T) => (acc: T, x: X) => T;
export function removeIfT<X>(pred: (x: X) => boolean): <T>(rf: (acc: T, x: X) => T) => (acc: T, x: X) => T;
export function removeIfT<X>(pred: (x: X) => boolean): <T>(rf: (acc: T, x: X) => T) => (acc: T, x: X) => T {
  return (rf) => (acc, x) => pred(x) ? acc : rf(acc, x);
}
