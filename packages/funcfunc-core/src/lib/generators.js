
export function map(proc, iterable0, ...iterables) {
  if (iterables.length === 0) {
    return map1(proc, iterable0);
  } else {
    return _mapN(proc, iterable0, iterables);
  }
}


export function* map1(proc, iterable0) {
  for (const v0 of iterable0) {
    yield proc(v0);
  }
}

function* _mapN(proc, iterable0, iterables) {
  const niter = iterables.length;

  const iters = new Array(niter);
  for (let i = 0; i < niter; ++i) {
    iters[i] = iterables[i][Symbol.iterator]();
  }

  const values = new Array(niter + 1);
  try {
    for (const v0 of iterable0) {
      values[0] = v0;
      for (let i = 0; i < niter; ++i) {
        const res = iters[i].next();
        if (res.done) {
          return;
        }
        values[i + 1] = res.value;
      }
      yield proc(...values);
    }
  } finally {
    for (let i = 0; i < niter; ++i) {
      _safeReturn(iters[i]);
    }
  }
}

export function flatMap(proc, iterable0, ...iterables) {
  if (iterables.length === 0) {
    return flatMap1(proc, iterable0);
  } else {
    return _flatMapN(proc, iterable0, iterables);
  }
}

export function* flatMap1(proc, iterable0) {
  for (const v0 of iterable0) {
    yield* proc(v0);
  }
}

function* _flatMapN(proc, iterable0, iterables) {
  const niter = iterables.length;

  const iters = new Array(niter);
  for (let i = 0; i < niter; ++i) {
    iters[i] = iterables[i][Symbol.iterator]();
  }

  const values = new Array(niter + 1);
  try {
    for (const v0 of iterable0) {
      values[0] = v0;
      for (let i = 0; i < niter; ++i) {
        const res = iters[i].next();
        if (res.done) {
          return;
        }
        values[i + 1] = res.value;
      }
      yield* proc(...values);
    }
  } finally {
    for (let i = 0; i < niter; ++i) {
      _safeReturn(iters[i]);
    }
  }
}

export function* concat(...iterables) {
  const niter = iterables.length;
  for (let i = 0; i < niter; ++i) {
    yield* iterables[i];
  }
}

export function entries(...iterables) {
  return zip(iota(), ...iterables);
}

export function every(pred, iterable0, ...iterables) {
  if (iterables.length === 0) {
    return every1(pred, iterable0);
  }
  return _everyN(pred, iterable0, iterables);
}

export function every1(pred, iterable0) {
  let result = true;
  for (const v0 of iterable0) {
    result = pred(v0);
    if (!result) {
      break;
    }
  }
  return result;
}

function _everyN(pred, iterable0, iterables) {
  const niter = iterables.length;

  const iters = new Array(niter);
  for (let i = 0; i < niter; ++i) {
    iters[i] = iterables[i][Symbol.iterator]();
  }

  const values = new Array(niter + 1);

  try {
    let result = true;
    LoopIter0: for (const v0 of iterable0) {
      values[0] = v0;
      for (let i = 0; i < niter; ++i) {
        const res = iters[i].next();
        if (res.done) {
          break LoopIter0;
        }
        values[i + 1] = res.value;
      }
      result = pred(...values);
      if (!result) {
        break;
      }
    }
    return result;
  } finally {
    for (let i = 0; i < niter; ++i) {
      _safeReturn(iters[i]);
    }
  }
}

export function* zip(iterable0, ...iterables) {
  const niter = iterables.length;

  const iters = new Array(niter);
  for (let i = 0; i < niter; ++i) {
    iters[i] = iterables[i][Symbol.iterator]();
  }

  try {
    for (const v0 of iterable0) {
      const values = new Array(niter + 1);
      values[0] = v0;

      for (let i = 0; i < niter; ++i) {
        const res = iters[i].next();
        if (res.done) {
          return;
        }
        values[i + 1] = res.value;
      }

      yield values;
    }
  } finally {
    for (let i = 0; i < niter; ++i) {
      _safeReturn(iters[i]);
    }
  }
}

export function iota(count, start = 0, step = 1) {
  if (count === void 0) {
    return new _IotaInf(start, step);
  }
  return new _IotaFinite(count, start, step);
}

class _IotaBase {
  [Symbol.iterator]() {
    return this;
  }

  return(value) {
    this.next = _IotaBase._returnDone;
    return { value, done: true };
  }

  static _returnDone() {
    return { value: void 0, done: true };
  }
}

class _IotaInf extends _IotaBase {
  constructor(start, step) {
    super();
    this._start = +start;
    this._step = +step;
    this._i = 0;
  }

  next() {
    const value = (this._i++) * this._step + this._start;
    return { value, done: false };
  }
}

class _IotaFinite extends _IotaBase {
  constructor(count, start, step) {
    super();
    this._count = (count | 0) & ~(count >> 31);
    this._start = +start;
    this._step = +step;
    this._i = 0;
  }

  next() {
    if (this._i >= this._count) {
      return this.return();
    }
    const value = (this._i++) * this._step + this._start;
    return { value, done: false };
  }
}

function _safeReturn(it) {
  if (typeof it.return === "function") {
    it.return();
  }
}
