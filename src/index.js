// @flow

export type Option<T> = {|
  value: T,
  wildcard: boolean,
  empty: boolean
|};

type OptionMatcher<T> = Option<(any) => T>;

export function match<T>(test: Option<T>) {
  return function<T>(...args: Option<(any) => T>[]): T {
    const optional = args.find(
      x => x instanceof test.constructor || (x && x.wildcard)
    );

    if (!optional) {
      console.error("Unwrapped:", test);
      throw new Error("Match not satisfied");
    }

    return optional.empty ? optional.value() : optional.value(test.value);
  };
}

export function createOption(
  name: string,
  config: { empty?: boolean, wildcard?: boolean } = {}
): <T>(T) => Option<T> {
  const { empty = false, wildcard = false } = config;
  const m = {
    [name]: function(value) {
      Object.defineProperties(this, {
        value: {
          value,
          enumerable: !empty,
          writable: false
        },
        empty: {
          value: empty,
          writable: false,
          enumerable: false
        },
        wildcard: {
          value: wildcard,
          writable: false,
          enumerable: false
        }
      });
    }
  };
  return val => new m[name](val);
}

export const Some = createOption("Some");

export const None: <T>(T) => Option<any> = createOption("None", {
  empty: true
});

export const _ = createOption("_", { wildcard: true });
