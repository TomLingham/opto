// @flow

import { option } from "./option";
export { option } from "./option";

export type Option<T> = {|
  empty: boolean,
  value: T,
  wildcard: boolean
|};

export type Optional<T> = (T) => Option<any>;

export type Handler = any => any;

export const match = (test: Option<any>) => (...args: Option<Handler>[]) => {
  const optional = args.find(
    x => x instanceof test.constructor || (x && x.wildcard)
  );

  if (!optional) {
    console.error(test);
    throw new Error("Match not satisfied");
  }

  return optional.empty ? optional.value() : optional.value(test.value);
};

export const Some: Optional<mixed> = option("Some");

export const None: Optional<void | any => any> = option("None", { empty: true });

export const _ = option("_", { wildcard: true });
