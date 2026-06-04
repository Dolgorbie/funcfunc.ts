import { pathLens } from "funcfunc/lens";
import { atom, effect, focus, release, retain, track } from "funcfunc/signal";
import { useMemo, useSyncExternalStore } from "react";

export function useAtom(init) {
  return useMemo(() => {
    return atom(typeof init === "function" ? init() : init);
  }, [init]);
}

export function useValue(atm) {
  const [subscribe, getSnapshot] = useMemo(() => createHandle(atm), [atm]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

function createHandle(atm) {
  function _handle(value) {
    _value = value;
    if (_listener) {
      _listener();
    }
  }
  
  let _listener = void 0;
  let _value = void 0;

  const eff = effect(_handle, atm);

  return [
    (listener) => {
      retain(eff);
      _listener = listener;
      return () => {
        _listener = void 0;
        release(eff);
      };
    },
    () => {
      return _value;
    },
  ]
}

export function useTrack(handler, ...nodes) {
  return useMemo(()=> track(handler, ...nodes), [handler, ...nodes]);
}

export function useFocus(lns, node) {
  return useMemo(()=> focus(lns, node), [lns, node]);
}

export function usePathFocus(node, ...path) {
  return useMemo(()=> focus(pathLens(...path), node), [node, ...path]);
}

export function useValueAtom(init) {
  const atm = useAtom(init);
  const value = useValue(atm);
  return [value, atm];
}

export function useValueTrack(handler, ...nodes) {
  const trk = useTrack(handler, ...nodes);
  const value = useValue(trk);
  return [value, trk];
}

export function useValueFocus(lns, node) {
  const fcs = useFocus(lns, node);
  const value = useValue(fcs);
  return [value, fcs];
}

export function useValuePathFocus(node, ...path) {
  const fcs = usePathFocus(node, ...path);
  const value = useValue(fcs);
  return [value, fcs];
}
