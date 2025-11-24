export type UnionKeyOf<T> = T extends T ? keyof T : never;

export type UnionPick<T, K extends UnionKeyOf<T>> = T extends T ? Pick<T, K & keyof T> : never;

export type UnionOmit<T, K extends UnionKeyOf<T>> = T extends T ? Omit<T, K> : never;

export type UnionToInterSec<U> = (U extends U ? (u: U) => void : (u: U) => void) extends ((i: infer I) => void) ? I : never;

export type FirstItemOf<TS extends readonly unknown[]> =
  TS extends readonly [] ? never
  : TS extends readonly [infer T0, ...unknown[]] ? T0
  : never;

export type LastItemOf<TS extends readonly unknown[]> =
  TS extends readonly [] ? never
  : TS extends readonly [infer TN] ? TN
  : TS extends readonly [unknown, ...infer TSS] ? LastItemOf<TSS>
  : never;


export type Path<T> = SubTuple<FullPath<T>>;

type FullPath<T> =
  T extends readonly unknown[] ? { [i in keyof T]: [StrToNum<i>, ...FullPath<T[i]>] }[keyof T]
  : T extends object ? { [k in keyof T]: [k, ...FullPath<T[k]>] }[keyof T]
  : [];

type SubTuple<TS extends readonly unknown[]> =
  TS extends readonly [...infer TSS, unknown] ? SubTuple<TSS> | TS
  : [];

export type StrToNum<T> = T extends `${infer I extends number}` ? I : never;

export type Refs<T, KS extends Path<T>> =
  KS extends readonly [] ? T
  : KS extends readonly [infer K0, ...infer KSS] ?
  (K0 extends keyof T ?
    (KSS extends Path<T[K0]> ? Refs<T[K0], KSS> : never)
    : never)
  : never;
