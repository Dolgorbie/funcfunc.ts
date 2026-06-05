const _lazyTag = Symbol("lazy");
const _eagerTag = Symbol("eager");

export class DPromise {
  constructor(content) {
    this._content = content;
  }

  _force() {
    while (this._content._type === _lazyTag) {
      const dIn = this._content._payload();
      if (this._content._type === _lazyTag) {
        this._content._type = dIn._content._type;
        this._content._payload = dIn._content._payload;
        dIn._content = this._content;
      }
    }

    return this._content._payload;
  }

  static resolve(value) {
    return new DPromise({ _type: _eagerTag, _payload: value });
  }
}

export function isDPromise(x) {
  return x instanceof DPromise;
}

export function delayForce(proc) {
  return _delayForce((...args) => {
    const result = proc(...args);
    if (isDPromise(result)) {
      return result;
    }
    throw TypeError(`expects dpromise, but got: ${result}`);
  });
}

export function delay(proc) {
  return _delayForce((...args) => DPromise.resolve(proc(...args)));
}

export function force(dpromise) {
  return dpromise._force();
}

export function map(f, ...dpromises) {
  return delay((...args) => f(...args.map(force)))(...dpromises);
}

export function forEach(f, ...ks) {
  f(...ks.map(force));
}

export function flatMap(f, ...dpromises) {
  return delayForce((...args) => f(...args.map(force)))(...dpromises);
}

function _delayForce(proc) {
  return (...args) => new DPromise({ _type: _lazyTag, _payload: () => proc(...args) });
}
