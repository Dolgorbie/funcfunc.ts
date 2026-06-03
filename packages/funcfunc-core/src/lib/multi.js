export function multi({ dispatch, defaultImpl }) {
  const implMap = new Map();

  function _doMethod(...args) {
    const keys = dispatch(...args);
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

function _() { }
