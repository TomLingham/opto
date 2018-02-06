// @flow

type States = "Some" | "None" | "_";

type Handler = mixed => mixed;

type HandlerMap =
  | $Exact<{ Some: Handler, None: Handler }>
  | $Exact<{ Some: Handler, _: Handler }>
  | $Exact<{ None: Handler, _: Handler }>
  | $Exact<{ _: Handler }>;

export type Option<T> = T | void;

opaque type Empty = "impossible" & "empty";

export function unwrap<T>(value: Option<T>): T {
  if (value == null) {
    throw new Error("Attempted to unwrap Option<None>");
  }
  return value;
}

export function unwrapUnsafe<T>(value: Option<T>): T {
  const next: T = (value: any); // I'm sorry
  return next;
}

export function unwrapOr<T>(value: Option<T>, orValue: T): T {
  return value == null ? orValue : value;
}

export function unexpected(impossible: Empty) {
  console.error("Default case executed with unexpected type", impossible);
  throw new Error("Unexpected state not handled in `switch`.");
}

export function match<T>(test: Option<T>, map: HandlerMap) {
  const isNone = test == null;
  const types: States[] = Object.keys(map);

  const handlerType: States | void = types.find(type => {
    return (
      (isNone && type === "None") ||
      (!isNone && type === "Some") ||
      type === "_"
    );
  });

  switch (handlerType) {
    case "Some":
      if (map.Some) return map.Some(test);
    case "None":
      if (map.None) return map.None(test);
    case "_":
      if (map._) return map._(test);
    default:
      console.error("Non-exhaustive match failed");
      throw new Error("Non-exhaustive match");
  }
}
