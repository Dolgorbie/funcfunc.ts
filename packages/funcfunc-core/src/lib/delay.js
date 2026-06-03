const _lazyTag = Symbol("lazy");
const _eagerTag = Symbol("eager");

export class Delay {
  constructor(content) {
    this._content = content;
  }

  force() {
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
}

export function isDelay(x) {
  return x instanceof Delay;
}

export function delayForce(thunk) {
  return new Delay({ _type: _lazyTag, _payload: thunk });
}

export function asDelay(value) {
  return new Delay({ _type: _eagerTag, _payload: value });
}

export function delay(thunk) {
  return delayForce(() => asDelay(thunk()));
}

export function force(dly) {
  return dly.force();
}

export function map(f, ...ks) {
  return delay(() => f(...ks.map(force)));
}

export function forEach(f, ...ks) {
  f(...ks.map(force));
}

export function flatMap(f, ...ks) {
  return delayForce(() => f(...ks.map(force)));
}
