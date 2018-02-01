// @flow

import type { Handler, Option } from ".";

type Optional<T> = any => Option<T>;

type OptionConfig = { empty?: boolean, wildcard?: boolean };

export function option<T>(name: string, config: OptionConfig = {}): Optional<T> {
  const { empty = false, wildcard = false } = config;
  const m = {
    [name]: function<T>(value: T) {
      this.value = value;
      this.empty = empty;
      this.wildcard = wildcard;
    }
  };
  return val => new m[name](val);
};
