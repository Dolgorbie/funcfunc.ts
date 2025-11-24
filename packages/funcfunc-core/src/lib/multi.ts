import type { UnionToInterSec } from "./type-utils";

export type MethodIdOf<T extends { [id in keyof T]: (...params: any[]) => any }> = keyof T;

export type MethodParameters<T extends { [id in Id]: (...params: any[]) => any }, Id extends keyof T> = Id extends Id ? Parameters<T[Id]> : never;

export type MethodReturnType<T extends { [id in Id]: (...params: any[]) => any }, Id extends keyof T> = Id extends Id ? ReturnType<T[Id]> : never;

export type Multi<T extends { [id in keyof T]: (...params: any[]) => any }> = MultiFunc<T> & {
  reg<Id extends keyof T>(id: Id, impl: (...params: MethodParameters<T, Id>) => MethodReturnType<T, Id>): void;
}

type MultiFunc<T extends { [id in keyof T]: (...params: any[]) => any }> = UnionToInterSec<T[keyof T]>;

export function createMulti<T extends { [id in keyof T]: (...params: any[]) => any }>(match: (params: MethodParameters<T, keyof T>) => keyof T | undefined): Multi<T> {
  const registry: Partial<T & { "": (...params: any[]) => any }> = {};

  function multi(...params: MethodParameters<T, keyof T>): MethodReturnType<T, keyof T> {
    let id: "" | keyof T | undefined = match(params);
    if (id == null) {
      id = "";
    }
    const method = registry[id];
    if (method == null) {
      throw TypeError();
    }
    return method(...params) as never;
  }

  function reg<Id extends keyof T>(id: Id, impl: (...params: MethodParameters<T, Id>) => MethodReturnType<T, Id>): void {
    registry[id] = impl as never;
  }

  multi.reg = reg;
  return multi as never;
}
