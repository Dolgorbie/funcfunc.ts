import { type Atom, type ReadonlyAtom } from "funcfunc/atom";
import type { LensLike } from "funcfunc/lens";
import { empty } from "funcfunc/optional";
import type { ReactNode } from "react";
import { useAtom, useLensAtom, useValue } from "./atom";

type WithAtomProps<T> = {
  init: T | (() => T);
  render?: (atm: Atom<T>) => ReactNode;
  children?: (atm: Atom<T>) => ReactNode;
};

export function WithAtom<T>({ init, render, children }: WithAtomProps<T>): ReactNode {
  const atm = useAtom(init);
  return (render ?? children ?? empty)(atm);
}

type WithValueProps<T, A extends ReadonlyAtom<T>> = {
  atom: A;
  render?: (value: T, atm: A) => ReactNode;
  children?: (value: T, atm: A) => ReactNode;
}

export function WithValue<T, A extends ReadonlyAtom<T>>({ atom, render, children }: WithValueProps<T, A>): ReactNode {
  const value = useValue(atom);
  return (render ?? children ?? empty)(value, atom);
}

type WithReadonlyLensAtomProps<T, U, A extends ReadonlyAtom<T>> = {
  atom: A;
  lens: LensLike<T, U>;
  render?: (lnsAtom: ReadonlyAtom<U>, atom: A) => ReactNode;
  children?: (lnsAtom: ReadonlyAtom<U>, atom: A) => ReactNode;
}

type WithLensAtomProps<T, U, A extends Atom<T>> = {
  atom: A;
  lens: LensLike<T, U>;
  render?: (lnsAtom: Atom<U>, atom: A) => ReactNode;
  children?: (lnsAtom: Atom<U>, atom: A) => ReactNode;
}

export function WithLensAtom<T, U, A extends Atom<T>>(props: WithLensAtomProps<T, U, A>): ReactNode;
export function WithLensAtom<T, U, A extends ReadonlyAtom<T>>(props: WithReadonlyLensAtomProps<T, U, A>): ReactNode;
export function WithLensAtom<T, U, A extends Atom<T>>({ atom, lens, render, children }: WithLensAtomProps<T, U, A>): ReactNode {
  const lnsAtom = useLensAtom(atom, lens);
  return (render ?? children ?? empty)(lnsAtom, atom);
}
