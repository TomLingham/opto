// @flow

export type Option<T> = T | void;

opaque type Empty = "impossible" & "empty";

const SymbolType = Symbol("opto.type");

export function Some<T, K>(handler: T => K): T => K {
  return Object.defineProperty(handler, SymbolType, {
    value: "Some",
    enumerable: false,
    writable: false
  });
}

export function None<T>(handler: () => T): () => T {
  return Object.defineProperty(() => handler(), SymbolType, {
    value: "None",
    enumerable: false,
    writable: false
  });
}

export function _<T, K>(handler: T => K): T => K {
  return Object.defineProperty(handler, SymbolType, {
    value: "Any",
    enumerable: false,
    writable: false
  });
}

export function unwrap<T>(value: Option<T>): T {
  if (value == null) {
    throw new Error("Attempted to unwrap Option<None>");
  }

  return value;
}

export function unexpected(impossible: Empty) {
  console.error("Default case executed with unexpected type", impossible);
  throw new Error("Unexpected state not handled in `switch`.");
}

export function unwrapOr<T>(value: Option<T>, orValue: T): T {
  return value == null ? orValue : value;
}

export function unsafeUnwrap<T>(value: Option<T>): T {
  return value;
}

export function match<T>(
  test: Option<T>
): <Y>(...args: Array<(T) => Y>) => Y {
  return function<K>(...args: Array<(T) => K>): K {
    const isNone = test == null;

    const optional = args.find(handler => {
      return (
        (handler[SymbolType] === "None" && isNone) ||
        (handler[SymbolType] === "Some" && !isNone) ||
        handler[SymbolType] === "Any"
      );
    });

    if (!optional) {
      console.error("Unwrapped:", typeof test, test);
      throw new Error("Match not satisfied");
    }

    return optional(unsafeUnwrap(test));
  };
}
