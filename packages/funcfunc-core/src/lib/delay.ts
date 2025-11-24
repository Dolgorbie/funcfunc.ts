const _eagerTag = Symbol("eager");
type _eagerTag = typeof _eagerTag;
const _lazyTag = Symbol("lazy");
type _lazyTag = typeof _lazyTag;

type _Content<T> = _Eager<T> | _Lazy<T>;

type _Eager<T> = {
  _type: _eagerTag;
  _payload: T;
}

type _Lazy<T> = {
  _type: _lazyTag;
  _payload: () => Delay<T>;
}

export class Delay<T> {
  constructor(private _content: _Content<T>) { }

  force(): T {
    while (this._content._type === _lazyTag) {
      const dIn = this._content._payload();
      if (this._content._type === _lazyTag) {
        this._content._type = dIn._content._type as never;
        this._content._payload = dIn._content._payload as never;
        dIn._content = this._content;
      }
    }

    return this._content._payload;
  }
}

type DelayArray<TS extends readonly any[]> = { [i in keyof TS]: Delay<TS[i]> };

export function isDelay(x: unknown): x is Delay<any> {
  return x instanceof Delay;
}

export function delayForce<T>(thunk: () => Delay<T>): Delay<T> {
  return new Delay<T>({ _type: _lazyTag, _payload: thunk });
}

export function asDelay<T>(value: T): Delay<T> {
  return new Delay({ _type: _eagerTag, _payload: value });
}

export function delay<T>(thunk: () => T): Delay<T> {
  return delayForce(() => asDelay(thunk()));
}

export function force<T>(dly: Delay<T>): T {
  return dly.force();
}

export function map<XS extends readonly any[], Y>(f: (...xs: XS) => Y, ...ks: DelayArray<XS>): Delay<Y> {
  return delay(() => f(...ks.map(force) as never));
}

export function forEach<XS extends readonly any[]>(f: (...xs: XS) => void, ...ks: DelayArray<XS>): void {
  f(...ks.map(force) as never);
}

export function flatMap<XS extends readonly any[], Y>(f: (...xs: XS) => Delay<Y>, ...ks: DelayArray<XS>): Delay<Y> {
  return delayForce(() => f(...ks.map(force) as never));
}
