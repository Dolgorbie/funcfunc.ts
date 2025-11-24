export type NonUndefined<T> = NonNullable<T> | T & null;

type NonUndefArray<TS extends unknown[]> = { [i in keyof TS]: NonUndefined<TS[i]> };

export function empty(): undefined {
  return void 0;
}

export function isUndefined(x: unknown): x is undefined {
  return x === void 0;
}

export function mustBeNonUndefined<const T>(x: T): NonUndefined<T> {
  if (x === undefined) {
    throw Error();
  }
  return x;
}

export function map<TS extends unknown[], U>(f: (...xs: NonUndefArray<TS>) => U, ...xs: TS): U | undefined {
  for (const x of xs) {
    if (x === void 0) {
      return void 0;
    }
  }
  return f(...xs as never);
}

export function forEach<TS extends unknown[]>(f: (...xs: NonUndefArray<TS>) => void, ...xs: TS): void {
  for (const x of xs) {
    if (x === void 0) {
      return;
    }
  }
  f(...xs as never);
}

export { map as flatMap };

export function filter1<T>(pred: (x: NonUndefined<T>) => boolean, x: T): T | undefined {
  return x !== void 0 && pred(x) ? x : void 0;
}

export function filter<TS extends unknown[]>(pred: (...xs: NonUndefArray<TS>) => boolean, ...xs: TS): NonUndefArray<TS> | undefined {
  for (const x of xs) {
    if (x === void 0) {
      return void 0;
    }
  }
  return pred(...xs as never) ? xs as never : undefined;
}

export function removeIf1<T>(pred: (x: NonUndefined<T>) => boolean, x: T): T | undefined {
  return x !== void 0 && !pred(x) ? x : void 0;
}

export function removeIf<TS extends unknown[]>(pred: (...xs: NonUndefArray<TS>) => boolean, ...xs: TS): NonUndefArray<TS> | undefined {
  for (const x of xs) {
    if (x === void 0) {
      return void 0;
    }
  }
  return !pred(...xs as never) ? xs as never : undefined;
}

export function every<TS extends unknown[]>(pred: (...xs: NonUndefArray<TS>) => boolean, ...xs: TS): boolean {
  for (const x of xs) {
    if (x === void 0) {
      return true;
    }
  }
  return pred(...xs as never);
}

export function some<TS extends unknown[]>(pred: (...xs: NonUndefArray<TS>) => boolean, ...xs: TS): boolean {
  for (const x of xs) {
    if (x === void 0) {
      return false;
    }
  }
  return pred(...xs as never);
}

export { filter1 as find };

export { filter as findTail };

export function append<T>(...xs: (T | undefined)[]): T | undefined {
  for (const x of xs) {
    if (x !== void 0) {
      return x;
    }
  }
  return void 0;
}
