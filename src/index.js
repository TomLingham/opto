// @flow

import { option } from "./option";
export { option } from "./option";

export type Option<T> = {|
  empty: boolean,
  value: T,
  wildcard: boolean
|};

export type Optional<T> = any => Option<T>;

export type Handler<T> = any => T;

export function match<T>(test: Option<T>, args: Option<(any) => T>[]): T {
  const optional = args.find(
    x => x instanceof test.constructor || (x && x.wildcard)
  );

  if (!optional) {
    console.error("Unwrapped:", test);
    throw new Error("Match not satisfied");
  }

  return optional.empty ? optional.value() : optional.value(test.value);
}

export const Some: <T>(T) => Option<T> = option("Some");

export const None: <K, T: void | (any => K)>(T) => Option<T> = option("None", {
  empty: true
});

export const _: Optional<mixed> = option("_", { wildcard: true });
