import { isNull, isUndef } from "./asfunc";

export { isNull, isUndef };

export function isNullish(x) {
  return x == null;
}

export function isFalsy(x) {
  return !x;
}

export function nullMap(proc, ...xs) {
  if (xs.some(isNull)) {
    return null;
  }
  return proc(...xs);
}

export function nullMap1(proc, x) {
  if (x === null) {
    return null;
  }
  return proc(x);
}

export function undefMap(proc, ...xs) {
  if (xs.some(isUndef)) {
    return void 0;
  }
  return proc(...xs);
}

export function undefMap1(proc, x) {
  if (x === void 0) {
    return void 0;
  }
  return proc(x);
}

export function nullishMap(proc, ...xs) {
  if (xs.some(isNullish)) {
    return void 0;
  }
  return proc(...xs);
}

export function nullishMap1(proc, x) {
  if (x == null) {
    return void 0;
  }
  return proc(x);
}

export function falsyMap(proc, ...xs) {
  if (xs.some(isFalsy)) {
    return false;
  }
  return proc(...xs);
}

export function falsyMap1(proc, x) {
  if (!x) {
    return false;
  }
  return proc(x);
}

export function falseMap(proc, ...xs) {
  if (xs.some((x) => x === false)) {
    return false;
  }
  return proc(...xs);
}

export function falseMap1(proc, x) {
  if (x === false) {
    return false;
  }
  return proc(x);
}
