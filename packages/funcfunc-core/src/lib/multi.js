import { is } from "./asfunc";

export function multi({ dispatch, isa = _isa, defaultImpl = _defaultImpl }) {
  const implMap = new Map();

  function _doMethod(...args) {
    const keys = isa(dispatch(...args));
    for (const k of keys) {
      const impl = implMap.get(k);
      if (impl != null) {
        return impl(...args);
      }
    }
    return defaultImpl(...args);
  }

  _doMethod.reg = (key, impl) => {
    implMap.set(key, impl);
    return _doMethod;
  };

  return _doMethod;
}

export function derive(parent, child) {
  let uppers = _hierarchy.get(child);
  if (uppers == null) {
    _hierarchy.set(child, uppers = [child]);
  }

  if (uppers.every((u) => !is(u, parent))) {
    uppers.push(parent);
  }
}

const _hierarchy = new Map();

function _isa(key) {
  const uppers = _hierarchy.get(key);
  return uppers ? uppers : [key];
}

export { _isa as isa };

function _defaultImpl() {
  throw TypeError("Not implemented");
}
