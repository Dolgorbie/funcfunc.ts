export function map(proc, arr0, ...arrs) {
  const narrs = arrs.length;

  switch (arrs.length) {
    case 0: {
      return map1(proc, arr0);
    }
    case 1: {
      return map2(proc, arr0, arrs[0]);
    }
    default: {
      const length = lengthMin(arr0, arrs);

      const result = new Array(length);
      const arrsi = new Array(narrs + 1);
      for (let i = 0; i < length; ++i) {
        arrsi[0] = arr0[i];
        for (let j = 0; j < narrs; ++j) {
          arrsi[j + 1] = arrs[j][i];
        }

        result[i] = proc(...arrsi);
      }
      return result;
    }
  }
}

export function map1(proc, arr0) {
  const { length } = arr0;
  const result = new Array(length);
  for (let i = 0; i < length; ++i) {
    result[i] = proc(arr0[i]);
  }
  return result;
}

export function map2(proc, arr0, arr1) {
  const length = Math.min(arr0.length, arr1.length);
  const result = new Array(length);
  for (let i = 0; i < length; ++i) {
    result[i] = proc(arr0[i], arr1[i]);
  }
  return result;
}

export function flatMap(proc, arr0, ...arrs) {
  const narrs = arrs.length;

  const length = lengthMin(arr0, arrs);
  const result = [];
  const arrsi = new Array(narrs + 1);
  for (let i = 0; i < length; ++i) {
    arrsi[0] = arr0[i];
    for (let j = 0; j < narrs; ++j) {
      arrsi[j + 1] = arrs[j][i];
    }

    const tmp = proc(...arrsi);
    const ntmp = tmp.length;
    for (let j = 0; j < ntmp; ++j) {
      result.push(tmp[j]);
    }
  }

  return result;
}

export function concat(arrs) {
  switch (arrs.length) {
    case 0: {
      return arrs;
    }
    case 1: {
      return arrs[0];
    }
    default: {
      let length = 0;
      const n = arrs.length;
      for (let i = 0; i < n; ++i) {
        length += arrs[i].length;
      }

      const result = new Array(length);
      let jOffset = 0;
      for (let i = 0; i < n; ++i) {
        const ai = arrs[i];
        const ni = ai.length;
        for (let j = 0; j < ni; ++j) {
          result[j + jOffset] = ai[j];
        }
        jOffset += ni;
      }
      return result;
    }
  }
}

function lengthMin(arr0, arrs) {
  let len = arr0.length;

  const n = arrs.length;
  for (let i = 0; i < n; ++i) {
    len = Math.min(len, arrs[i].length);
  }

  return len;
}
