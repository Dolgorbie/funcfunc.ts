import { useMemo } from "react";
import { useAtom, useValue } from "./signal";

export function WithAtom({ init, children }) {
  const atom = useAtom(init);
  return useMemo(() => children ? children(atom) : void 0, [children, atom]);
}

export function WithValue({ atom, children }) {
  const value = useValue(atom);
  return useMemo(() => children ? children(value) : void 0, [children, value]);
}
