import { useMemo } from "react";
import { useAtom, useFocus, usePathFocus, useTrack, useValue, useValueAtom, useValueFocus, useValuePathFocus, useValueTrack } from "./signal";

export function WithAtom({ init, children }) {
  const atom = useAtom(init);
  return useMemo(() => children ? children(atom) : void 0, [children, atom]);
}

export function WithValue({ atom, children }) {
  const value = useValue(atom);
  return useMemo(() => children ? children(value) : void 0, [children, value]);
}

export function WithTrack({ atoms, handler, children }) {
  const trk = useTrack(handler, ...atoms);
  return useMemo(() => children ? children(trk) : void 0, [children, trk]);
}

export function WithFocus({ atom, lens, children }) {
  const fc = useFocus(lens, atom);
  return useMemo(() => children ? children(fc) : void 0, [children, fc]);
}

export function WithPathFocus({ atom, path, children }) {
  const fc = usePathFocus(atom, ...path);
  return useMemo(() => children ? children(fc) : void 0, [children, fc]);
}

export function WithValueAtom({ init, children }) {
  const valAtom = useValueAtom(init);
  return useMemo(() => children ? children(...valAtom) : void 0, [children, ...valAtom]);
}

export function WithValueTrack({ atoms, handler, children }) {
  const valTrk = useValueTrack(handler, ...atoms);
  return useMemo(() => children ? children(...valTrk) : void 0, [children, ...valTrk]);
}

export function WithValueFocus({ atom, lens, children }) {
  const valFc = useValueFocus(lens, atom);
  return useMemo(() => children ? children(...valFc) : void 0, [children, ...valFc]);
}

export function WithValuePathFocus({ atom, path, children }) {
  const valFc = useValuePathFocus(atom, ...path);
  return useMemo(() => children ? children(...valFc) : void 0, [children, ...valFc]);
}
