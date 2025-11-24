import { atom, deref, effect, isWritableAtom, lensAtom, reaction, release, retain, type Atom, type ReadableAtom } from "funcfunc/atom";
import type { Lens } from "funcfunc/lens";
import { useCallback, useEffect, useMemo, useState, type DependencyList } from "react";

export function useAtom<T>(init: T | (() => T)): Atom<T> {
  return useState(() => atom(init instanceof Function ? init() : init))[0];
}

export function useValue<T>(atm: ReadableAtom<T>): T {
  const [value, setValue] = useState(() => deref(atm));

  const eff = useMemo(() => effect((x) => setValue(() => x), atm), [atm]);

  useEffect(() => {
    retain(eff);
    return () => {
      release(eff);
    }
  }, [eff]);

  return value;
}

export function useLens<T, U>(atm: ReadableAtom<T>, ln: Lens<T, U>): ReadableAtom<U>;
export function useLens<T, U>(atm: Atom<T>, ln: Lens<T, U>): Atom<U>;
export function useLens<T, U>(atm: ReadableAtom<T> | Atom<T>, ln: Lens<T, U>): ReadableAtom<U> | Atom<U> {
  return useMemo(() => isWritableAtom(atm) ? lensAtom(ln, atm) : reaction((x) => ln(x), atm), [atm, ln]);
}

export function useReaction<TS extends DependencyList, US extends DependencyList, V>(f: (...xs: [...TS, ...US]) => V, values: TS, atoms: { [i in keyof US]: ReadableAtom<US[i]> }): ReadableAtom<V> {
  const g = useCallback((...xs: US) => f(...values, ...xs), [f, ...values]);
  return useMemo(() => reaction<US, V>(g, ...atoms), [g, ...atoms]);
}
