
export interface Lens<S, A> extends LensLike<S, A> {
  chain<X>(next: LensLike<A, X>): LensLike<S, X>;
  prop<K extends keyof A>(key: K): Lens<S, A[K]>;
  mut<K extends keyof A>(key: K): Lens<S, A[K]>;
}

export interface LensLike<S, A> extends Setter<S, A>, Getter<S, A> { }

export interface Setter<S, A> {
  (s: S, a: A): S;
}

export interface Getter<S, A> {
  (s: S): A;
}

function idLens_<S>(s: S, a: S): S;
function idLens_<S>(s: S): S;
function idLens_<S>(s: S, ...a: [S] | []): S {
  return a.length === 0 ? s : a[0];
}

export function getIdLens<S>(): Lens<S, S> {
  if ("chain" in idLens_) {
    return idLens_ as Lens<S, S>;
  }
  return lensI(idLens_<S>);
}

export function lens<S, A>(get: Getter<S, A>, set: Setter<S, A>): Lens<S, A> {
  function lns(s: S, a: A): S;
  function lns(s: S): A;
  function lns(s: S, ...a: [A] | []): S | A {
    return a.length === 0 ? get(s) : set(s, ...a);
  }

  return lensI(lns);
}

export function lensI<S, A>(lns: LensLike<S, A>): Lens<S, A> {
  const tmp = lns as Lens<S, A>;

  tmp.chain = function (next) {
    return chain(this, next);
  };

  tmp.prop = function (key) {
    return prop(this, key);
  }

  tmp.mut = function (key) {
    return mutProp(this, key);
  }

  return tmp;
}

export function chain<S, A, X>(lns0: LensLike<S, A>, lns1: LensLike<A, X>): Lens<S, X> {
  function lns(s: S, x: X): S;
  function lns(s: S): X;
  function lns(s: S, ...x: [X] | []): S | X {
    return x.length === 0 ? lns1(lns0(s)) : modify(lns0, (a) => lns1(a, ...x), s);
  }

  return lensI(lns);
}

export function prop<K extends keyof A, S, A>(lns: LensLike<S, A>, key: K): Lens<S, A[K]> {
  function lnsP(a: A, ak: A[K]): A;
  function lnsP(a: A): A[K];
  function lnsP(a: A, ...ak: [A[K]] | []): A | A[K] {
    if (ak.length === 0) {
      return a[key];
    }
    if (Array.isArray(a)) {
      const tmp = [...a] as A;
      tmp[key] = ak[0];
      return tmp;
    }
    const res = { ...a, [key]: ak[0] };
    return res;
  }

  return chain(lns, lnsP);
}

export function mutProp<K extends keyof A, S, A>(lns: LensLike<S, A>, key: K): Lens<S, A[K]> {
  function lnsM(a: A, ak: A[K]): A;
  function lnsM(a: A): A[K];
  function lnsM(a: A, ...ak: [A[K]] | []): A | A[K] {
    return ak.length === 0 ? a[key] : (a[key] = ak[0], a);
  }

  return chain(lns, lnsM);
}

export function modify<S, A>(lns: LensLike<S, A>, f: (a: A) => A, s: S): S {
  return lns(s, f(lns(s)));
}
