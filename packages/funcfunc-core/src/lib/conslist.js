export class Pair {
  constructor(car, cdr) {
    this._car = car;
    this._cdr = cdr;
  }

  [Symbol.iterator]() {
    return new _ListIter(this);
  }
}

class _ListIter extends Iterator {
  constructor(list) {
    super();
    this._list = list;
  }

  next() {
    const { _list } = this;

    if (isPair(_list)) {
      this._list = cdr(_list);
      return { value: car(_list), done: false };
    }

    return { value: _list, done: true };
  }

  return(value) {
    this._list = null;
    return { value, done: true };
  }
}

class _IListIter extends Iterator {
  constructor(list) {
    super();
    this._list = list;
    this._done = false;
  }

  next() {
    const { _list } = this;

    if (isPair(_list)) {
      this._list = cdr(_list);
      return { value: car(_list), done: false };
    }

    if (this._done) {
      return { value: void 0, done: true };
    }

    this._done = true;
    this._list = void 0;
    return { value: _list, done: false };
  }

  return(value) {
    this._done = true;
    this._list = void 0;
    return { value, done: true };
  }
}

export function isPair(x) {
  return x instanceof Pair;
}

export function cons(x, y) {
  return new Pair(x, y);
}

export function car(pair) {
  return pair._car;
}

export function cdr(pair) {
  return pair._cdr;
}

export function setCar(pair, value) {
  return pair._car = value;
}

export function setCdr(pair, value) {
  return pair._cdr = value;
}

export function iter(list) {
  return new _ListIter(list);
}

export function iiter(improperList) {
  return new _IListIter(improperList);
}
