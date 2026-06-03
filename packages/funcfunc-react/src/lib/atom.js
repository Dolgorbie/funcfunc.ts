import { atom, deref, effect, isWritableAtom, lensAtom, reaction, release, retain } from "funcfunc/atom";
import { getIdLens } from "funcfunc/lens";

export function useAtom<T>(init: T | (() => T)): Atom<T> {
  return useState(() => atom(init instanceof Function ? init() : init))[0];
}

export function useValue<T>(atm: ReadonlyAtom<T>): T {
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

export function useLensAtom<T, U>(atm: Atom<T>, lns: LensLike<T, U>): Atom<U>;
export function useLensAtom<T, U>(atm: ReadonlyAtom<T>, lns: LensLike<T, U>): ReadonlyAtom<U>;
export function useLensAtom<T, U>(atm: ReadonlyAtom<T>, lns: LensLike<T, U>): ReadonlyAtom<U> {
  return useMemo(() => isWritableAtom(atm) ? lensAtom(lns, atm) : reaction((x) => lns(x), atm), [atm, lns]);
}

export function useCursor<T, P extends Path<T>>(atm: Atom<T>, ...path: P): Atom<Refs<T, P>>;
export function useCursor<T, P extends Path<T>>(atm: ReadonlyAtom<T>, ...path: P): ReadonlyAtom<Refs<T, P>>;
export function useCursor<T>(atm: ReadonlyAtom<T>, ...path: PropertyKey[]): ReadonlyAtom<unknown> {
  const lns = useMemo(() => path.reduce < Lens < any, any >> ((acc, p) => acc.prop(p), getIdLens < T > ()), [...path]);
  return useLensAtom(atm, lns);
}

export function useReaction<TS extends DependencyList, US extends DependencyList, V>(f: (...xs: [...TS, ...US]) => V, values: TS, atoms: { [i in keyof US]: ReadonlyAtom<US[i]> }): ReadonlyAtom<V> {
  const g = useCallback((...xs: US) => f(...values, ...xs), [f, ...values]);
  return useMemo(() => reaction < US, V > (g, ...atoms), [g, ...atoms]);
}

export function useAtomAndValue<T>(init: T | (() => T)): [Atom<T>, T] {
  const atm = useAtom(init);
  const value = useValue(atm);
  return [atm, value];
}

export function useLensAtomAndValue<T, U>(atm: Atom<T>, lns: Lens<T, U>): [Atom<U>, U];
export function useLensAtomAndValue<T, U>(atm: ReadonlyAtom<T>, lns: Lens<T, U>): [ReadonlyAtom<U>, U];
export function useLensAtomAndValue<T, U>(atm: ReadonlyAtom<T> | Atom<T>, lns: Lens<T, U>): [ReadonlyAtom<U>, U] {
  const lnsAtmo = useLensAtom(atm, lns);
  const value = useValue(lnsAtmo);
  return [lnsAtmo, value];
}

export function useReactionAndValue<TS extends DependencyList, US extends DependencyList, V>(f: (...xs: [...TS, ...US]) => V, values: TS, atoms: { [i in keyof US]: ReadonlyAtom<US[i]> }): [ReadonlyAtom<V>, V] {
  const rct = useReaction(f, values, atoms);
  const value = useValue(rct);
  return [rct, value];
}
