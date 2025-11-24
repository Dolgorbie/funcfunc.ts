import { xpartial } from "../function";

export interface PredLike<T> {
  (x: T): boolean;
}

export interface GuardLike<T, U extends T> extends PredLike<T> {
  (x: T): x is U;
}

export interface Pred<T> extends PredLike<T> {
  and<AS extends readonly any[]>(p: (x: T, ...args: AS) => boolean, ...args: AS): Pred<T>;
  or<AS extends readonly any[]>(p: (x: T, ...args: AS) => boolean, ...args: AS): Pred<T>;
  not(): Pred<T>;
}

export interface Guard<T, U extends T> extends GuardLike<T, U>, Pred<T> {
  and<V extends U, AS extends readonly any[]>(g: (x: U, ...args: AS) => x is V, ...args: AS): Guard<T, V>;
  and<AS extends readonly any[]>(p: (x: U, ...args: AS) => boolean, ...args: AS): Pred<T>;

  or<V extends T, AS extends readonly any[]>(g: (x: T, ...args: AS) => x is V, ...args: AS): Guard<T, U | V>;
  or<AS extends readonly any[]>(p: (x: T, ...args: AS) => boolean, ...args: AS): Pred<T>;

  not(): Guard<T, Exclude<T, U>>;
}

export function pred<T, U extends T, AS extends readonly any[]>(g: (x: T, ...args: AS) => x is U, ...args: AS): Guard<T, U>;
export function pred<T, AS extends readonly any[]>(p: (x: T, ...args: AS) => boolean, ...args: AS): Pred<T>;
export function pred<T, AS extends readonly any[]>(p: (x: T, ...args: AS) => boolean, ...args: AS): Pred<T> {
  return predI(xpartial(p, ...args));
}

export function predI<T, U extends T>(g: GuardLike<T, U>): Guard<T, U>;
export function predI<T>(p: PredLike<T>): Pred<T>;
export function predI<T>(p: PredLike<T>): Pred<T> {
  const tmp = p as Pred<T>;

  tmp.and = function <AS extends readonly any[]>(q: (x: T, ...args: AS) => boolean, ...args: AS): Pred<T> {
    return and(this, xpartial(q, ...args));
  }

  tmp.or = function <AS extends readonly any[]>(q: (x: T, ...args: AS) => boolean, ...args: AS): Pred<T> {
    return or(this, xpartial(q, ...args));
  }

  tmp.not = function (): Pred<T> {
    return not(this);
  }

  return tmp;
}

export function and<T, U extends T, V extends U>(g: GuardLike<T, U>, h: GuardLike<U, V>): Guard<T, V>;
export function and<T>(p: PredLike<T>, q: PredLike<T>): Pred<T>;
export function and<T>(p: PredLike<T>, q: PredLike<T>): Pred<T> {
  return predI((x) => p(x) && q(x));
}

export function or<T, U extends T, V extends T>(g: GuardLike<T, U>, h: GuardLike<T, V>): Guard<T, U | V>;
export function or<T>(p: PredLike<T>, q: PredLike<T>): Pred<T>;
export function or<T>(p: PredLike<T>, q: PredLike<T>): Pred<T> {
  return predI((x) => p(x) || q(x));
}

export function not<T, U extends T>(g: GuardLike<T, U>): Guard<T, Exclude<T, U>>;
export function not<T>(p: PredLike<T>): Pred<T>;
export function not<T>(p: PredLike<T>): Pred<T> {
  return predI((x) => !p(x));
}

export function union<T, US extends readonly T[]>(...gs: { [i in keyof US]: GuardLike<T, US[i]> }): Guard<T, US[number]>;
export function union<T>(...ps: PredLike<T>[]): Pred<T>;
export function union<T>(...ps: PredLike<T>[]): Pred<T> {
  return predI((x) => ps.some((p) => p(x)));
}
