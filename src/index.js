// @flow

export type Option<T> = T | void;

type OptionHandler<T> = {
  type: string,
  any: boolean,
  handler: (arg?: Option<mixed>) => T,
  none: boolean
};

type Optional = <T>((T) => T) => OptionHandler<T>;

const OptionalTypeKey = Symbol('opto.typeKey');

export const createOptional = (
  type: string,
  { any = false, none = false }: { any?: boolean, none?: boolean } = {}
): Optional => {
  const m = {
    [type]: function(handler) {
      Object.defineProperties(this, {
        any: {
          value: any,
          enumerable: false,
          writable: false
        },
        handler: {
          value: handler,
          enumerable: false,
          writable: false
        },
        none: {
          value: none,
          enumerable: false,
          writable: false
        },
        type: {
          value: type,
          enumerable: false,
          writable: false
        }
      });
    }
  };
  return handler => {
    if (typeof handler === "function") {
      handler.$$typeof = OptionalTypeKey;
    };
    return new m[type](handler);
  };
};

export const Some = createOptional("Some");

export const None = createOptional("None", { none: true });

export const _ = createOptional("_", { any: true });

export function unwrap<T>(value: Option<T>): T {
  if (value == null) {
    throw new Error("Unable to unwrap Option<None>");
  }

  return value;
}

export function unwrapOr<T>(value: Option<T>, orValue: T): T {
  return value == null ? orValue : value;
}

export function match<T>(test: Option<T>) {
  return function<T>(...args: OptionHandler<T>[]): T {
    const isNone = test == null;

    const optional = args.find(x => isNone === x.none || x.any);

    if (!optional) {
      console.error("Unwrapped:", typeof test, test);
      throw new Error("Match not satisfied");
    }

    return optional.none ? optional.handler() : optional.handler(test);
  };
}
