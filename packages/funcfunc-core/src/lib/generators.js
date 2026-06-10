export function* map(proc, iter0, ...iters) {
  switch (iters.length) {
    case 0: {
      yield* map1(proc, iter0);
      break;
    }
    default: {
      const it0 = iter0[Symbol.iterator]();
      const its = _getIterators(iters);
      const values = new Array(its.length + 1);
      try {
        while (!_nextIters(values, it0, its)) {
          yield proc(...values);
        }
      } finally {
        _safeReturn(it0);
        const length = its.length;
        for (let i = 0; i < length; ++i) {
          _safeReturn(its[i]);
        }
      }
    }
  }
}

export function* map1(proc, iter0) {
  const it0 = iter0[Symbol.iterator]();
  let value, done;
  try {
    while (({ value, done } = it0.next()), !done) {
      yield proc(value);
    }
  } finally {
    _safeReturn(it0);
  }
}

function _getIterators(iters) {
  const length = iters.length;
  const acc = new Array(length);
  for (let i = 0; i < length; ++i) {
    acc[i] = iters[i][Symbol.iterator]();
  }
  return acc;
}

function _nextIters(dst, it0, its) {
  const length = its.length;
  const { value: value0, done: done0 } = it0.next();

  if (done0) {
    return true;
  }

  dst[0] = value0;

  for (let i = 0; i < length; ++i) {
    const { value, done } = its[i].next();
    if (done) {
      return true;
    }
    dst[i + 1] = value;
  }

  return false;
}

function _safeReturn(it) {
  if (typeof it.return === "function") {
    it.return();
  }
}

function* zip(iter0, ...iters) {
  const niters = iters.length;

  const its = new Array(niters);
  for (let i = 0; i < niters; ++i) {
    its[i] = iters[i][Symbol.iterator]();
  }

  try {
    for (const v0 of iter0) {
      const values = new Array(niters + 1);
      values[0] = v0;

      for (let i = 0; i < niters; ++i) {
        const res = its[i].next();
        if (res.done) {
          return;
        }
        values[i + 1] = res.value;
      }

      yield values;
    }
  } finally {
    for (let i = 0; i < niters; ++i) {
      _safeReturn(its[i]);
    }
  }
}
