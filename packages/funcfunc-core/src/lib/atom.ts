import { mustNotReach } from "./errors";
import type { LensLike } from "./lens";

export interface Atom<T> extends ReadableAtom<T>, Swap<T> { }

export interface ReadableAtom<T> {
  _deref(interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): T;
}

export interface EffectAtom extends LeafAtom {
  _retain(): number;
  _release(): number;
}

interface Swap<T> {
  _swap(f: (prev: T) => T, interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): T;
}

interface InterAtom {
  _signal(): SignalResult;
}

interface SignalResult {
  _interAtoms: Iterable<InterAtom>;
  _leafAtoms: Iterable<LeafAtom>;
}

interface LeafAtom {
  _invoke(): void;
}

const emptySignalResult = { _interAtoms: new Set(), _leafAtoms: new Set() } as const satisfies SignalResult

abstract class AbstractReadOnlyAtom<T> implements ReadableAtom<T> {
  protected _interAtoms = new Set<InterAtom>();
  protected _leafAtoms = new Set<LeafAtom>();

  abstract _deref(interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): T;

  protected _register(interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): void {
    if (interAtom) {
      this._interAtoms.add(interAtom);
    }
    if (leafAtom) {
      this._leafAtoms.add(leafAtom);
    }
  }

  protected _clearDerivativeAtoms(): void {
    this._interAtoms = new Set();
    this._leafAtoms = new Set();
  }
}

const State = {
  _init: 1,
  _stale: 2,
  _fresh: 3,
} as const

type State = typeof State[keyof typeof State]
type State_init = typeof State._init;
type State_stale = typeof State._stale;
type State_fresh = typeof State._fresh;

abstract class AbstractInterReadOnlyAtom<T> extends AbstractReadOnlyAtom<T> implements InterAtom {
  protected abstract _content: { _state: State };

  _signal(): SignalResult {
    switch (this._content._state) {
      case State._init:
      case State._stale: {
        return emptySignalResult;
      }
      case State._fresh: {
        const { _interAtoms, _leafAtoms } = this;
        this._clearDerivativeAtoms();
        this._content._state = State._stale;
        return { _interAtoms, _leafAtoms };
      }
      default: {
        throw mustNotReach(this._content._state);
      }
    }
  }
}

export function atom<T>(value: T): Atom<T> {
  return new RootAtom(value);
}

class RootAtom<T> extends AbstractReadOnlyAtom<T> implements Atom<T> {
  constructor(private _value: T) {
    super();
  }

  _deref(interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): T {
    this._register(interAtom, leafAtom);
    return this._value;
  }

  _swap(f: (prev: T) => T, interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): T {
    const prev = this._value;
    const next = f(prev);

    if (prev === next) {
      return prev;
    }

    this._value = next;

    const leaves = [...this._leafAtoms, ...signalAll(this._interAtoms)];
    this._clearDerivativeAtoms()

    leaves.forEach(lf => lf._invoke());

    this._register(interAtom, leafAtom);

    return this._value;
  }
}

function* signalAll(derivatives: Iterable<InterAtom>): Iterable<LeafAtom> {
  for (const d of derivatives) {
    const { _interAtoms: _derivatives, _leafAtoms: _leaves } = d._signal();
    yield* _leaves;
    yield* signalAll(_derivatives);
  }
}

type Content<T, U> =
  | { _state: State_init, _value: undefined, _depValue: undefined }
  | { _state: State_stale | State_fresh, _value: U, _depValue: T };

export function lensAtom<T, U>(ln: LensLike<T, U>, base: Atom<T>): Atom<U> {
  return new LensAtom(ln, base);
}

class LensAtom<T, U> extends AbstractInterReadOnlyAtom<U> implements Atom<U> {
  protected _content: Content<T, U> = { _state: State._init, _value: undefined, _depValue: undefined };

  constructor(private _lens: LensLike<T, U>, private _depAtom: Atom<T>) {
    super();
  }

  _deref(interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): U {
    this._register(interAtom, leafAtom);

    switch (this._content._state) {
      case State._init: {
        const _depValue = this._depAtom._deref(this, undefined);
        const _value = this._lens(_depValue);
        this._content = { _state: State._fresh, _value, _depValue };
        return _value;
      }
      case State._stale: {
        const _depValue = this._depAtom._deref(this, undefined);
        const _value = this._content._depValue === _depValue ? this._content._value : this._lens(_depValue);
        this._content = { _state: State._fresh, _value, _depValue };
        return _value;
      }
      case State._fresh: {
        return this._content._value;
      }
      default: {
        throw mustNotReach(this._content);
      }
    }
  }

  _swap(f: (prev: U) => U, interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): U {
    const _depValue = this._depAtom._swap((prev) => this._lens(prev, f(this._lens(prev))), this, undefined);
    const _value = this._lens(_depValue);

    this._register(interAtom, leafAtom);

    this._content = { _state: State._fresh, _value, _depValue };
    return _value;
  }
}

export function reaction<TS extends readonly any[], U>(f: (...xs: TS) => U, ...atoms: { [i in keyof TS]: ReadableAtom<TS[i]> }): ReadableAtom<U> {
  return new Reaction(f, atoms);
}

class Reaction<TS extends readonly any[], U> extends AbstractInterReadOnlyAtom<U> {
  protected _content: Content<TS, U> = { _state: State._init, _value: undefined, _depValue: undefined };

  constructor(private _f: (...xs: TS) => U, private _depAtoms: { [i in keyof TS]: ReadableAtom<TS[i]> }) {
    super();
  }

  _deref(interAtom: InterAtom | undefined, leafAtom: LeafAtom | undefined): U {
    this._register(interAtom, leafAtom);

    switch (this._content._state) {
      case State._init: {
        const _depValue = this._depAtoms.map(a => a._deref(this, undefined)) as never as TS;
        const _value = this._f(..._depValue);
        this._content = { _state: State._fresh, _value, _depValue };
        return _value;
      }
      case State._stale: {
        const _depValue = this._depAtoms.map(a => a._deref(this, undefined)) as never as TS;
        const _value = this._content._depValue.every((dv, i) => dv === _depValue[i]) ? this._content._value : this._f(..._depValue);
        this._content = { _state: State._fresh, _value, _depValue };
        return _value;
      }
      case State._fresh: {
        return this._content._value;
      }
      default: {
        throw mustNotReach(this._content);
      }
    }
  }
}

export function effect<TS extends readonly any[]>(f: (...xs: TS) => void, ...atoms: { [i in keyof TS]: ReadableAtom<TS[i]> }): EffectAtom {
  return new EffectAtomImpl(f, atoms);
}

class EffectAtomImpl<TS extends readonly any[]> implements EffectAtom {
  private _content: Content<TS, undefined> = { _state: State._init, _value: undefined, _depValue: undefined };
  private _count = 0;

  constructor(private _f: (...xs: TS) => void, private _depAtoms: { [i in keyof TS]: ReadableAtom<TS[i]> }) { }

  _invoke(): void {
    if (this._count === 0) {
      return;
    }
    switch (this._content._state) {
      case State._init: {
        const _depValue = this._depAtoms.map(a => a._deref(undefined, this)) as never as TS;
        this._content = { _state: State._fresh, _value: undefined, _depValue };
        this._f(..._depValue);
        break;
      }
      case State._stale: {
        const _depValue = this._depAtoms.map(a => a._deref(undefined, this)) as never as TS;
        const changed = this._content._depValue.some((dv, i) => dv !== _depValue[i]);
        this._content = { _state: State._fresh, _value: undefined, _depValue }
        if (changed) {
          this._f(..._depValue);
        }
        break;
      }
      case State._fresh: {
        break;
      }
      default: {
        throw mustNotReach(this._content);
      }
    }
  }

  _retain(): number {
    if (this._count++ === 0) {
      this._invoke();
    }
    return this._count;
  }

  _release(): number {
    const count = --this._count;
    if (count === 0 && this._content._state === State._fresh) {
      this._content._state = State._stale;
    } else if (count < 0) {
      throw Error("too many releases");
    }
    return count;
  }
}

export function isReadableAtom(x: any): x is ReadableAtom<any> {
  const prop = x._deref;
  return prop instanceof Function;
}

export function isWritableAtom(x: any): x is Atom<any> {
  const prop = x._swap;
  return prop instanceof Function;
}

export function deref<T>(atom: ReadableAtom<T>): T {
  return atom._deref(undefined, undefined);
}

export function swap<T>(atom: Atom<T>, f: (prev: T) => T): T {
  return atom._swap(f, undefined, undefined);
}

export function retain(eff: EffectAtom): number {
  return eff._retain();
}

export function release(eff: EffectAtom): number {
  return eff._release();
}
