
export function* map(proc, iter0, ...iters) {
  if (iters.length === 0) {
    yield* map1(proc, iter0);
  } else {
    yield* _mapN(proc, iter0, iters);
  }
}


export function* map1(proc, iter0) {
  for (const v0 of iter0) {
    yield proc(v0);
  }
}

function* _mapN(proc, iter0, iters) {
  const niters = iters.length;

  const its = new Array(niters);
  for (let i = 0; i < niters; ++i) {
    its[i] = iters[i][Symbol.iterator]();
  }

  const vals = new Array(niters + 1);
  try {
    for (const v0 of iter0) {
      vals[0] = v0;
      for (let i = 0; i < niters; ++i) {
        const res = its[i].next();
        if (res.done) {
          return;
        }
        vals[i + 1] = res.value;
      }
      yield proc(...vals);
    }
  } finally {
    for (let i = 0; i < niters; ++i) {
      _safeReturn(its[i]);
    }
  }
}

export function* flatMap(proc, iter0, ...iters) {
  if (iters.length === 0) {
    yield* flatMap1(proc, iter0);
  } else {
    yield* _flatMapN(proc, iter0, iters);
  }
}

export function* flatMap1(proc, iter0) {
  for (const v0 of iter0) {
    yield* proc(v0);
  }
}

function* _flatMapN(proc, iter0, iters) {
  const niters = iters.length;

  const its = new Array(niters);
  for (let i = 0; i < niters; ++i) {
    its[i] = iters[i][Symbol.iterator]();
  }

  const vals = new Array(niters + 1);
  try {
    for (const v0 of iter0) {
      vals[0] = v0;
      for (let i = 0; i < niters; ++i) {
        const res = its[i].next();
        if (res.done) {
          return;
        }
        vals[i + 1] = res.value;
      }
      yield* proc(...vals);
    }
  } finally {
    for (let i = 0; i < niters; ++i) {
      _safeReturn(its[i]);
    }
  }
}

export function* zip(iter0, ...iters) {
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

function _safeReturn(it) {
  if (typeof it.return === "function") {
    it.return();
  }
}
