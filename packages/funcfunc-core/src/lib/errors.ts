export class NonNeverError extends Error {
  constructor(...args: Parameters<ErrorConstructor>) {
    super(...args)
  }
}

export function mustNotReach(x: never): never {
  throw new NonNeverError(`must not reach, but got ${x}`);
}
