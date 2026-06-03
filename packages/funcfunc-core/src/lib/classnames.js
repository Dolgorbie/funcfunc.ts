import { isArray, objectHasOwn } from "./asfunc";

export function c(name0, name1, name2, name3, name4, name5, name6, name7, ...names) {
  if (!name4 && !name5 && !name6 && !name7 && names.length === 0 && isNonObj(name0) && isNonObj(name1) && isNonObj(name2) && isNonObj(name3)) {
    if (name0) {
      if (name1) {
        if (name2) {
          if (name3) {
            return `${name0} ${name1} ${name2} ${name3}`;
          }
          return `${name0} ${name1} ${name2}`;
        }
        if (name3) {
          return `${name0} ${name1} ${name3}`;
        }
        return `${name0} ${name1}`;
      }
      if (name2) {
        if (name3) {
          return `${name0} ${name2} ${name3}`;
        }
        return `${name0} ${name2}`;
      }
      if (name3) {
        return `${name0} ${name3}`;
      }
      return `${name0}`;
    }
    if (name1) {
      if (name2) {
        if (name3) {
          return `${name1} ${name2} ${name3}`;
        }
        return `${name1} ${name2}`;
      }
      if (name3) {
        return `${name1} ${name3}`;
      }
      return `${name1}`;
    }
    if (name2) {
      if (name3) {
        return `${name2} ${name3}`;
      }
      return `${name2}`;
    }
    if (name3) {
      return `${name3}`;
    }
    return "";
  }

  const acc = [];

  _c1(acc, name0);
  _c1(acc, name1);
  _c1(acc, name2);
  _c1(acc, name3);
  _c1(acc, name4);
  _c1(acc, name5);
  _c1(acc, name6);
  _c1(acc, name7);

  _c(acc, names);

  return acc.join(" ");
}


function _c(acc, names) {
  const { length } = names;
  for (let i = 0; i < length; ++i) {
    const n = names[i];

    if (!n) {
      continue;
    }

    if (typeof n === "object") {
      _c1Obj(acc, n);
      continue;
    }

    acc.push(n);
  }
}

function _c1(acc, name) {
  if (name) {
    if (isNonObj(name)) {
      acc.push(name);
    } else {
      _c1Obj(acc, name);
    }
  }
}

function _c1Obj(acc, name0) {
  if (isArray(name0)) {
    _c(acc, name0);
  } else {
    for (const key in name0) {
      if (objectHasOwn(name0, key) && name0[key]) {
        acc.push(key);
      }
    }
  }
}

function isNonObj(x) {
  return typeof x !== "object";
}
