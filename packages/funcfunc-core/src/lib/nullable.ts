// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NotNull<T> = T & ({} | undefined)

export function empty(): null {
  return null;
}

export function mustBeNonUndefined<const T>(x: T): NotNull<T> {
  if (x === null) {
    throw Error();
  }
  return x;
}

export function map<T, U>(f: (x: NotNull<T>) => U, x: T): U | null {
  return x === null ? null : f(x);
}

export function forEach<T>(f: (x: NotNull<T>) => void, x: T): void {
  if (x !== null) {
    f(x);
  }
}

export function ap<T, U>(f: ((x: NotNull<T>) => U) | null, x: T): U | null {
  return f === null || x === null ? null : f(x);
}

export { map as flatMap };

export function filter<T>(f: (x: NotNull<T>) => boolean, x: T): T | null {
  return x !== null && f(x) ? x : null;
}

export function removeIf<T>(f: (x: NotNull<T>) => boolean, x: T): T | null {
  return x !== null && !f(x) ? x : null;
}

export function every<T>(f: (x: NotNull<T>) => boolean, x: T): boolean {
  return x === null || f(x);
}

export function some<T>(f: (x: NotNull<T>) => boolean, x: T): boolean {
  return x !== null && f(x);
}

export { filter as find };

export { filter as findTail };

export function append<T>(...xs: (T | null)[]): T | null {
  for (const x of xs) {
    if (x === null) {
      return x;
    }
  }
  return null;
}
