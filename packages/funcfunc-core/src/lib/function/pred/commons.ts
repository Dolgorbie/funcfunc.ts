export function isNullish(x: unknown): x is null | undefined {
  return x == null;
}

export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

export function isBigInt(x: unknown): x is bigint {
  return typeof x === "bigint";
}

export function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}

export function isString(x: unknown): x is string {
  return typeof x === "string";
}

export function isSymbol(x: unknown): x is symbol {
  return typeof x === "symbol";
}

export function isFunction(x: unknown): x is (...xs: never[]) => unknown {
  return typeof x === "function";
}

export function isObject(x: unknown): x is object {
  return x !== null && typeof x === "object";
}

export function isArray(x: any): x is any[] {
  return Array.isArray(x);
}

export function isInteger(x: unknown): boolean {
  return Number.isInteger(x);
}

export function isSafeInteger(x: unknown): boolean {
  return Number.isSafeInteger(x);
}

export function isNan(x: unknown): boolean {
  return Number.isNaN(x);
}

export function isFinite(x: unknown): boolean {
  return Number.isFinite(x);
}
